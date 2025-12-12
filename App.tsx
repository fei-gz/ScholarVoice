import React, { useState, useRef } from 'react';
import { VoiceName } from './types';
import { generateAcademicSpeech } from './services/geminiService';
import { VoiceSelector } from './components/VoiceSelector';
import { BookOpen, Download, Play, Loader2, Sparkles, FileAudio } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Fenrir);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const wavBlob = await generateAcademicSpeech(inputText, selectedVoice);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (err) {
      setError("Failed to generate audio. Please check your API key and connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `scholar-voice-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-academic-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-academic-800 rounded-full shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-academic-900 mb-2">
            ScholarVoice
          </h1>
          <p className="text-academic-500 max-w-lg mx-auto text-lg">
            Transform written text into professional, academic narration.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-academic-100">
          
          {/* Controls Bar */}
          <div className="bg-academic-50/50 p-6 border-b border-academic-100">
             <VoiceSelector 
               selectedVoice={selectedVoice} 
               onVoiceChange={setSelectedVoice}
               disabled={isLoading}
             />
             <p className="text-xs text-academic-400 italic">
               * The "Fenrir" and "Charon" voices are recommended for deeper, more formal academic tones.
             </p>
          </div>

          <div className="p-8 grid gap-8 lg:grid-cols-2">
            
            {/* Input Section */}
            <div className="flex flex-col h-full">
              <label htmlFor="text-input" className="block text-sm font-bold text-academic-700 mb-2 uppercase tracking-wide">
                Source Text
              </label>
              <textarea
                id="text-input"
                className="flex-grow w-full p-4 rounded-xl border border-academic-200 bg-white focus:ring-2 focus:ring-academic-400 focus:border-academic-400 transition-all resize-none text-academic-800 leading-relaxed font-serif shadow-inner h-64 lg:h-80"
                placeholder="Paste your academic abstract, paper excerpt, or lecture notes here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-4 text-xs text-academic-400">
                <span>{inputText.length} characters</span>
              </div>
            </div>

            {/* Action & Result Section */}
            <div className="flex flex-col justify-between h-full space-y-6">
              
              <div className="bg-academic-50 rounded-xl p-6 border border-academic-100 h-full flex flex-col items-center justify-center text-center">
                {!audioUrl && !isLoading && !error && (
                  <div className="text-academic-400 flex flex-col items-center">
                    <Sparkles className="w-12 h-12 mb-3 opacity-20" />
                    <p>Enter text and select a voice to generate audio.</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center animate-pulse">
                    <Loader2 className="w-10 h-10 text-academic-600 animate-spin mb-4" />
                    <p className="text-academic-600 font-medium">Synthesizing speech...</p>
                    <p className="text-xs text-academic-400 mt-2">Generating academic cadence</p>
                  </div>
                )}

                {error && (
                   <div className="text-red-500 bg-red-50 p-4 rounded-lg text-sm border border-red-100">
                     {error}
                   </div>
                )}

                {audioUrl && !isLoading && (
                  <div className="w-full animate-fade-in space-y-6">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                       <FileAudio className="w-6 h-6 text-academic-700" />
                       <span className="font-semibold text-academic-800">Generation Complete</span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-academic-200">
                      <audio 
                        controls 
                        ref={audioRef} 
                        src={audioUrl} 
                        className="w-full h-10 outline-none accent-academic-600"
                      />
                    </div>

                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-academic-200 text-academic-700 font-semibold rounded-lg hover:bg-academic-50 hover:border-academic-300 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download .WAV
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!inputText.trim() || isLoading}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all transform active:scale-95
                  ${!inputText.trim() || isLoading 
                    ? 'bg-academic-200 text-academic-400 cursor-not-allowed' 
                    : 'bg-academic-800 text-white hover:bg-academic-700 hover:shadow-xl'}
                `}
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Generate Audio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-academic-400 text-sm">
          <p>© {new Date().getFullYear()} ScholarVoice. Powered by Google Gemini 2.5 Flash.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;