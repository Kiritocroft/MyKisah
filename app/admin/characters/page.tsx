"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Save, Sparkles } from "lucide-react";
import { getCharacters, saveCharacter, deleteCharacter, type Character } from "@/app/actions/characters";
import { motion, AnimatePresence } from "framer-motion";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Character>>({
    name: "",
    anime: "",
    type: "Wholesome",
    desc: "",
    image: "✿"
  });

  const fetchCharacters = useCallback(async () => {
    try {
      const { characters, error } = await getCharacters();
      if (error) {
        alert(error);
      } else {
        setCharacters(characters);
      }
    } catch (err) {
      console.error("Failed to fetch characters:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleEdit = (char: Character) => {
    setFormData(char);
    setEditingId(char.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      anime: "",
      type: "Wholesome",
      desc: "",
      image: "✿"
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.anime || !formData.desc) {
        alert("Please fill in all required fields");
        return;
    }

    const charToSave = {
        name: formData.name,
        anime: formData.anime,
        type: formData.type || "Wholesome",
        desc: formData.desc,
        image: formData.image || "✿",
        id: editingId || undefined
    };

    const res = await saveCharacter(charToSave);
    if (res.error) {
        alert(res.error);
    } else {
        await fetchCharacters();
        setIsEditing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this character?")) return;
    
    const res = await deleteCharacter(id);
    if (res.error) {
        alert(res.error);
    } else {
        await fetchCharacters();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-serif text-white mb-2">Character Management</h2>
            <p className="text-slate-400">Add or edit your waifu collection.</p>
        </div>
        
        <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-soft-pink text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-white transition-all"
        >
            <Plus size={20} />
            <span>Add Character</span>
        </button>
      </div>

      {/* Edit Modal / Form Overlay */}
      <AnimatePresence>
        {isEditing && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) setIsEditing(false);
                }}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                >
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <h3 className="text-2xl font-serif text-white mb-6">
                        {editingId ? "Edit Character" : "New Character"}
                    </h3>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-soft-pink outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Anime Source</label>
                            <input 
                                type="text" 
                                value={formData.anime}
                                onChange={e => setFormData({...formData, anime: e.target.value})}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-soft-pink outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Type</label>
                                <select 
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-soft-pink outline-none"
                                >
                                    {["Wholesome", "Energetic", "Cool", "Introvert"].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Emoji / Icon</label>
                                <input 
                                    type="text" 
                                    value={formData.image}
                                    onChange={e => setFormData({...formData, image: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-soft-pink outline-none"
                                    placeholder="e.g. ✿"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <textarea 
                                value={formData.desc}
                                onChange={e => setFormData({...formData, desc: e.target.value})}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-soft-pink outline-none h-24 resize-none"
                                required
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 bg-soft-pink text-slate-900 px-4 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                <span>Save Character</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-soft-pink border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {characters.map((char) => (
                    <motion.div
                        key={char.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 group hover:border-soft-pink/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                {char.image}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(char)}
                                    className="p-2 bg-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(char.id)}
                                    className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-serif text-white mb-1">{char.name}</h3>
                        <p className="text-sm text-soft-pink font-medium mb-3">{char.anime}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-400 rounded-full">
                                {char.type}
                            </span>
                        </div>

                        <p className="text-sm text-slate-400 italic">"{char.desc}"</p>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {/* Empty State */}
            {characters.length === 0 && (
                <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/30">
                    <Sparkles className="mx-auto mb-4 text-slate-500" size={32} />
                    <h3 className="text-white font-medium mb-1">No characters found</h3>
                    <p className="text-slate-500 text-sm">Add your first waifu to the collection.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
