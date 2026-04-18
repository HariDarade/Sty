import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ImageUpload = ({ onImageSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }, []);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      const base64Data = base64Url.split(',')[1];
      onImageSelect({
        file,
        url: base64Url,
        base64: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-8 text-center border-2 border-dashed transition-all duration-300 ${isDragOver ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/20'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <UploadCloud className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Upload Inspiration</h3>
          <p className="text-neutral-400 text-sm">Drag & drop an outfit or room image here, or click to browse.</p>
        </div>
      </label>
    </motion.div>
  );
};
