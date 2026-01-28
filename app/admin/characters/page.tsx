"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageAdvancedEditor from "@/components/ImageAdvancedEditor";
import { getCharacters, saveCharacter, deleteCharacter } from "@/app/actions/characters";
import { type Character } from "@/types";
import { Trash2, Edit2, Plus, Upload, X, AlertCircle, Crop as CropIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function AdminCharactersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [anime, setAnime] = useState("");
  const [type, setType] = useState("Waifu");
  const [desc, setDesc] = useState("");
  const [rank, setRank] = useState<string>(""); // "" means no rank
  const [objectPosition, setObjectPosition] = useState("center center");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const imagePreview = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return existingImage;
  }, [imageFile, existingImage]);

  const loadCharacters = useCallback(async () => {
    setIsLoading(true);
    const { characters, error } = await getCharacters();
    if (!error) {
      setCharacters(characters);
    } else {
      showToast("Failed to load characters", "error");
    }
    setIsLoading(false);
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCharacters();
  }, [loadCharacters]);

  const showCroppedImage = useCallback((file: File) => {
    setImageFile(file);
    setIsCropping(false);
    setCropImageSrc(null);
    showToast("Gambar berhasil dicrop", "success");
  }, [showToast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropImageSrc(reader.result?.toString() || "");
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
      if (errors.image) setErrors({...errors, image: ""});
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setCropImageSrc(null);
    // If we were uploading a new file but cancelled, we might want to reset imageFile if it wasn't set yet?
    // Or just leave it as is (previous state).
    // For now, let's just close the cropper.
    // If the user wants to revert to existing image, they can close the modal or re-upload.
  };

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!anime.trim()) newErrors.anime = "Anime source is required";
    
    if (!desc.trim()) newErrors.desc = "Description is required";
    else if (desc.length < 10) newErrors.desc = "Description must be at least 10 characters";

    if (!existingImage && !imageFile) {
      newErrors.image = "An image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleOpenModal(character?: Character) {
    setErrors({});
    if (character) {
      setEditingCharacter(character);
      setName(character.name);
      setAnime(character.anime);
      setType(character.type);
      setDesc(character.desc);
      setRank(character.rank ? character.rank.toString() : "");
      setObjectPosition(character.objectPosition || "center center");
      setExistingImage(character.image);
    } else {
      setEditingCharacter(null);
      setName("");
      setAnime("");
      setType("Wholesome");
      setDesc("");
      setRank("");
      setObjectPosition("center center");
      setExistingImage("");
    }
    setImageFile(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    const formData = new FormData();
    if (editingCharacter) {
      formData.append("id", editingCharacter.id.toString());
    }
    formData.append("name", name);
    formData.append("anime", anime);
    formData.append("type", type);
    formData.append("desc", desc);
    if (rank) {
      formData.append("rank", rank);
    }
    formData.append("objectPosition", objectPosition);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("existingImage", existingImage);

    try {
      const result = await saveCharacter(formData);
      if (result.success) {
        setIsModalOpen(false);
        showToast(editingCharacter ? "Character updated successfully" : "Character created successfully", "success");
        
        // Show visual confirmation for auto-deletion
        if (result.deletedOldImage) {
           setTimeout(() => {
               showToast("Previous photo deleted to save space", "success");
           }, 800);
        }

        loadCharacters();
        router.refresh(); // Update server components
      } else {
        showToast("Failed to save character", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this character?")) {
      const result = await deleteCharacter(id);
      if (result.success) {
        showToast("Character deleted successfully", "success");
        loadCharacters();
        router.refresh();
      } else {
        showToast("Failed to delete character", "error");
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-0 md:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-soft-pink to-purple-400 bg-clip-text text-transparent">
            Character Management
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-soft-pink text-slate-900 rounded-xl font-bold hover:bg-white transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Character
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-soft-pink border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <div key={char.id} className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden group hover:border-soft-pink/50 transition-colors">
                <div className="h-48 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                   {char.image.startsWith("/") || char.image.startsWith("http") ? (
                      <img 
                        src={char.image} 
                        alt={char.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: char.objectPosition || "center center" }}
                      />
                   ) : (
                      <span className="text-6xl">{char.image}</span>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={() => handleOpenModal(char)}
                        className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-400"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(char.id)}
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{char.name}</h3>
                    <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-400">{char.type}</span>
                  </div>
                  <p className="text-sm text-soft-pink mb-2">{char.anime}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{char.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-800 p-6 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">
                {editingCharacter ? "Edit Character" : "Add Character"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({...errors, name: ""});
                    }}
                    className={`w-full bg-slate-800 border rounded-lg px-4 py-2 focus:outline-none focus:border-soft-pink ${errors.name ? 'border-red-500' : 'border-slate-700'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Anime</label>
                  <input
                    type="text"
                    value={anime}
                    onChange={(e) => {
                      setAnime(e.target.value);
                      if (errors.anime) setErrors({...errors, anime: ""});
                    }}
                    className={`w-full bg-slate-800 border rounded-lg px-4 py-2 focus:outline-none focus:border-soft-pink ${errors.anime ? 'border-red-500' : 'border-slate-700'}`}
                  />
                  {errors.anime && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.anime}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-soft-pink"
                  >
                    <option value="Waifu">Waifu</option>
                    <option value="Husbu">Husbu</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Rank (Top 3)</label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-soft-pink"
                  >
                    <option value="">None</option>
                    <option value="1">Rank 1</option>
                    <option value="2">Rank 2</option>
                    <option value="3">Rank 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea
                    value={desc}
                    onChange={(e) => {
                      setDesc(e.target.value);
                      if (errors.desc) setErrors({...errors, desc: ""});
                    }}
                    className={`w-full bg-slate-800 border rounded-lg px-4 py-2 focus:outline-none focus:border-soft-pink h-24 ${errors.desc ? 'border-red-500' : 'border-slate-700'}`}
                  />
                  {errors.desc && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.desc}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Image</label>
                  <div className="flex gap-4 items-center">
                    {existingImage && !imageFile && (
                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                            {existingImage.startsWith("/") ? (
                                <img src={existingImage} alt="Existing" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl">{existingImage}</span>
                            )}
                        </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                        <div className={`flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-dashed rounded-lg p-4 transition-colors ${errors.image ? 'border-red-500' : 'border-slate-700'}`}>
                            <Upload size={20} className="text-slate-400" />
                            <span className="text-sm text-slate-400">
                                {imageFile ? imageFile.name : "Upload new image"}
                            </span>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </label>
                  </div>
                  {errors.image && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.image}</p>}
                </div>

                {imagePreview && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Preview & Crop</label>
                    <div className="flex flex-col gap-3">
                        <div className="relative w-full aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden border border-slate-700 group">
                           <img 
                             src={imagePreview} 
                             alt="Preview"
                             className="w-full h-full object-cover"
                             style={{ objectPosition }}
                           />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (imagePreview) {
                                    setCropImageSrc(imagePreview);
                                    setIsCropping(true);
                                  }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-soft-pink text-slate-900 rounded-lg font-bold hover:bg-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-200"
                              >
                                <CropIcon size={18} />
                                Crop Image
                              </button>
                           </div>
                        </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-soft-pink text-slate-900 font-bold py-3 rounded-xl hover:bg-white transition-colors mt-4"
                >
                  {editingCharacter ? "Save Changes" : "Create Character"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Advanced Image Editor Modal */}
        {isCropping && cropImageSrc && (
          <ImageAdvancedEditor
            imageSrc={cropImageSrc}
            onCancel={cancelCrop}
            onSave={showCroppedImage}
          />
        )}
      </div>
    </div>
  );
}
