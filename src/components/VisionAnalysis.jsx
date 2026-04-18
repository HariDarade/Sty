import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Tag, Search } from 'lucide-react';

export const VisionAnalysis = ({ imageUrl, analysis, isAnalyzing, onObjectSelect, selectedObject }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Image Preview */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel overflow-hidden relative"
      >
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          className="w-full h-auto object-cover max-h-[500px]"
        />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-lg font-medium text-white tracking-widest animate-pulse">ANALYZING STYLE...</p>
          </div>
        )}
      </motion.div>

      {/* Analysis Results */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6"
      >
        {analysis ? (
          <>
            <div className="glass-panel p-6">
              <h3 className="text-xl font-medium tracking-wide mb-2 text-indigo-300">Overall Style</h3>
              <p className="text-lg text-white/90">{analysis.style}</p>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xl font-medium tracking-wide mb-4 flex items-center gap-2">
                <Palette className="text-indigo-400" /> Color Palette
              </h3>
              <div className="flex flex-wrap gap-4">
                {analysis.colorPalette.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 flex-1">
              <h3 className="text-xl font-medium tracking-wide mb-4 flex items-center gap-2">
                <Tag className="text-indigo-400" /> Detected Objects
              </h3>
              <p className="text-sm text-neutral-400 mb-4">Select an object to find similar items to buy.</p>
              
              <div className="flex flex-wrap gap-3">
                {analysis.objects.map((obj, idx) => {
                  const isSelected = selectedObject?.name === obj.name;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onObjectSelect(obj)}
                      className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                          : 'glass-button'
                      }`}
                    >
                      {isSelected && <Search className="w-4 h-4" />}
                      {obj.name}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {analysis.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-white/5 text-neutral-400 border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel p-6 h-full flex flex-col items-center justify-center text-center text-neutral-500 min-h-[300px]">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">Upload an image to reveal the style details.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
