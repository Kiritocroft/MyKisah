import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Crop as CropIcon, FlipHorizontal, FlipVertical } from "lucide-react";
import getCroppedImg from "@/utils/canvasUtils";

interface ImageAdvancedEditorProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (file: File) => void;
}

export default function ImageAdvancedEditor({ imageSrc, onCancel, onSave }: ImageAdvancedEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Crop State ---
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [aspect, setAspect] = useState(3 / 4);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // --- Handlers: Crop ---
  const onCropComplete = useCallback((croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!croppedAreaPixels) {
         setError("Area crop belum ditentukan.");
         setIsLoading(false);
         return;
      }
      
      const finalBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flip);

      if (finalBlob) {
        const file = new File([finalBlob], "edited-image.jpg", { type: "image/jpeg" });
        onSave(file);
      } else {
        setError("Gagal membuat gambar.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan gambar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[90vh] border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-white">Edit Gambar</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Preview Area */}
          <div className="flex-1 bg-black relative flex items-center justify-center p-4">
            <div className="relative w-full h-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="w-80 bg-slate-950 border-l border-slate-800 p-4 overflow-y-auto">
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <CropIcon size={16} /> Pengaturan Crop
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Zoom</label>
                    <input 
                      type="range" 
                      min={1} 
                      max={3} 
                      step={0.1} 
                      value={zoom} 
                      onChange={(e) => setZoom(Number(e.target.value))} 
                      className="w-full accent-soft-pink"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Rotasi ({Math.round(rotation)}°)</label>
                    <input 
                      type="range" 
                      min={0} 
                      max={360} 
                      step={1} 
                      value={rotation} 
                      onChange={(e) => setRotation(Number(e.target.value))} 
                      className="w-full accent-soft-pink"
                    />
                  </div>

                  <div className="flex gap-2">
                      <button 
                          onClick={() => setFlip({ ...flip, horizontal: !flip.horizontal })}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-medium border transition-colors ${flip.horizontal ? 'bg-soft-pink text-slate-900 border-soft-pink' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
                      >
                          <FlipHorizontal size={14} /> Flip H
                      </button>
                      <button 
                          onClick={() => setFlip({ ...flip, vertical: !flip.vertical })}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-medium border transition-colors ${flip.vertical ? 'bg-soft-pink text-slate-900 border-soft-pink' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
                      >
                          <FlipVertical size={14} /> Flip V
                      </button>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Rasio Aspek</label>
                    <select 
                      value={aspect} 
                      onChange={(e) => setAspect(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:border-soft-pink outline-none"
                    >
                      <option value={3/4}>Waifu Card (3:4)</option>
                      <option value={1}>Persegi (1:1)</option>
                      <option value={16/9}>Landscape (16:9)</option>
                      <option value={4/3}>Portrait (4:3)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {error && (
               <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                 {error}
               </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800">
               <button 
                 onClick={handleSave}
                 disabled={isLoading}
                 className="w-full py-3 bg-soft-pink text-slate-900 font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </>
                 ) : (
                    "Simpan Hasil Crop"
                 )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}