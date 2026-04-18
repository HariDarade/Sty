import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag } from 'lucide-react';

export const ShoppingResults = ({ results, isLoading, query }) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8"
    >
      <h3 className="text-2xl mb-6 font-semibold flex items-center gap-2">
        <ShoppingBag className="text-indigo-400" /> 
        Results for "{query}"
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((item, idx) => (
          <motion.a 
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel overflow-hidden group flex flex-col hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="h-48 w-full bg-white/5 relative overflow-hidden">
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-medium text-sm line-clamp-2 mb-2 flex-1">{item.title}</h4>
              <div className="flex items-end justify-between mt-4">
                <span className="text-xl font-bold text-indigo-300">{item.price}</span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  {item.source} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};
