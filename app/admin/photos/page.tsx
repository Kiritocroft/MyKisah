"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Trash2, Image as ImageIcon, X } from "lucide-react";
import { uploadPhoto, getPhotos, deletePhoto, type Photo } from "@/app/actions/photos";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const { photos, error } = await getPhotos();
    if (error) {
        alert(error);
    } else {
        setPhotos(photos);
    }
    setIsLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadPhoto(formData);
    if (res?.error) {
        alert(res.error);
    } else {
        await loadPhotos();
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(fileName: string) {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    
    setDeletingId(fileName);
    const res = await deletePhoto(fileName);
    if (res?.success) {
        await loadPhotos();
    } else {
        alert("Failed to delete");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-serif text-white mb-2">Photo Gallery</h2>
            <p className="text-slate-400">Manage your waifu collection images.</p>
        </div>
        
        <div>
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleUpload}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 bg-soft-pink text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full" />
                ) : (
                    <Upload size={20} />
                )}
                <span>Upload New</span>
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
            {photos.map((photo) => (
                <motion.div
                    key={photo.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700"
                >
                    <img 
                        src={photo.path} 
                        alt={photo.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                        <p className="text-white text-xs truncate mb-1">{photo.name}</p>
                        <p className="text-slate-400 text-[10px] mb-3">
                            {(photo.size / 1024).toFixed(1)} KB
                        </p>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleDelete(photo.name)}
                                className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
        
        {/* Empty State */}
        {photos.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/30">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <ImageIcon size={32} />
                </div>
                <h3 className="text-white font-medium mb-1">No photos yet</h3>
                <p className="text-slate-500 text-sm">Upload some waifu images to get started.</p>
            </div>
        )}
      </div>
      )}
    </div>
  );
}
