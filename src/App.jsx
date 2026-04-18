import React, { useState } from 'react';
import { Sparkles, ScanLine } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { VisionAnalysis } from './components/VisionAnalysis';
import { ShoppingResults } from './components/ShoppingResults';
import { analyzeImage } from './services/gemini';
import { searchProducts } from './services/serp';
import { supabase } from './services/supabase';

function App() {
  const [imageState, setImageState] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const [selectedObject, setSelectedObject] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [shoppingResults, setShoppingResults] = useState([]);
  
  const handleImageSelect = async (imageData) => {
    setImageState(imageData);
    setIsAnalyzing(true);
    setAnalysis(null);
    setSelectedObject(null);
    setShoppingResults([]);
    
    try {
      // 1. Analyze via Gemini
      const result = await analyzeImage(imageData.base64, imageData.mimeType);
      setAnalysis(result);
      
      // 2. Optionally store to Supabase if configured
      if (supabase) {
        try {
          await supabase.from('analyses').insert([{
            style: result.style,
            tags: result.tags,
            created_at: new Date()
          }]);
        } catch (dbError) {
          console.warn("Supabase insert failed, skipping (might be missing table or keys)", dbError);
        }
      }
      
    } catch (error) {
      alert("Failed to analyze image. Check console for details.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleObjectSelect = async (obj) => {
    setSelectedObject(obj);
    setIsSearching(true);
    
    try {
      // Send the specific search query suggested by Gemini to SerpAPI
      const results = await searchProducts(obj.searchQuery);
      setShoppingResults(results);
    } catch (error) {
      alert("Failed to fetch shopping results. Check if server.js is running and SERP_API_KEY is set.");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">AI-Powered Fashion & Decor</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 flex items-center gap-4">
            Stylin<span className="text-indigo-500">'</span> <ScanLine className="w-12 h-12 text-indigo-400" />
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl font-light">
            Drop an image. Let AI decode the style. Buy the look instantly.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="space-y-12">
          {!imageState && (
            <div className="max-w-2xl mx-auto">
               <ImageUpload onImageSelect={handleImageSelect} />
            </div>
          )}

          {imageState && (
            <VisionAnalysis 
              imageUrl={imageState.url}
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              onObjectSelect={handleObjectSelect}
              selectedObject={selectedObject}
            />
          )}

          {/* Shopping Results */}
          {(isSearching || shoppingResults.length > 0) && (
            <ShoppingResults 
              results={shoppingResults} 
              isLoading={isSearching} 
              query={selectedObject?.searchQuery} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
