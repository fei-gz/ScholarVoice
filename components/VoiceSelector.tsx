import React from 'react';
import { VoiceName } from '../types';
import { Mic2 } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onVoiceChange: (voice: VoiceName) => void;
  disabled?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onVoiceChange, disabled }) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="flex items-center text-academic-600">
        <Mic2 className="w-5 h-5 mr-2" />
        <span className="font-medium text-sm">Speaker Voice</span>
      </div>
      <div className="flex space-x-2">
        {Object.values(VoiceName).map((voice) => (
          <button
            key={voice}
            onClick={() => onVoiceChange(voice)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg text-sm transition-all duration-200 border
              ${selectedVoice === voice 
                ? 'bg-academic-600 text-white border-academic-600 shadow-md' 
                : 'bg-white text-academic-600 border-academic-200 hover:border-academic-400 hover:bg-academic-50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {voice}
          </button>
        ))}
      </div>
    </div>
  );
};