import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Wand2, ChevronDown, ChevronUp, User, Sparkles } from 'lucide-react';

interface PromptEditorProps {
  prompt: string;
  setPrompt: (v: string) => void;
  negativePrompt: string;
  setNegativePrompt: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const STYLE_PRESETS = [
  'Cinematic 35mm lens',
  'Dynamic camera dolly',
  'Golden hour atmospheric lighting',
  'Slow-motion 60fps fluid trajectory',
  'Photorealistic 8k detail',
  'Moody film noir shadow play',
];

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  placeholder = 'Describe your scene in rich detail (e.g., A cybernetic owl flying through rain-drenched Neo-Tokyo, neon reflections, 35mm film still)...',
  disabled = false,
}) => {
  const { characters } = useStudio();
  const [showNegative, setShowNegative] = useState(false);

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    const enhancements = [
      'cinematic composition',
      'dynamic camera trajectory',
      'photorealistic 8k texture',
      'photogenic ambient volumetric lighting',
      'shallow depth of field',
      'organic motion blur'
    ];
    // Avoid double appending
    const cleanPrompt = prompt.trim().replace(/,\s*$/, '');
    setPrompt(`${cleanPrompt}, ${enhancements.join(', ')}`);
  };

  const handleAddPreset = (phrase: string) => {
    if (!prompt) {
      setPrompt(phrase);
    } else if (!prompt.includes(phrase)) {
      setPrompt(`${prompt.trim().replace(/,\s*$/, '')}, ${phrase}`);
    }
  };

  const handleInsertCharacter = (tag: string) => {
    if (!prompt.includes(tag)) {
      setPrompt(`${tag} ${prompt}`.trim());
    }
  };

  return (
    <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Scene Prompt
        </label>
        <button
          type="button"
          disabled={disabled || !prompt.trim()}
          onClick={handleEnhance}
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition disabled:opacity-40"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Auto-Enhance Prompt</span>
        </button>
      </div>

      {/* Main prompt input */}
      <div className="relative">
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 pt-1 font-mono">
          <span>{prompt.length} characters</span>
          <span>Seedance 2.5 Prompt Interpreter</span>
        </div>
      </div>

      {/* Character tags insertion */}
      {characters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-500 flex items-center gap-1">
            <User className="w-3 h-3 text-purple-400" /> Characters:
          </span>
          {characters.map((char) => (
            <button
              key={char.id}
              type="button"
              disabled={disabled}
              onClick={() => handleInsertCharacter(char.triggerTag)}
              className="px-2 py-0.5 rounded-md bg-[#1c1c24] border border-[#2b2b38] hover:border-purple-500/50 text-zinc-300 hover:text-purple-300 text-[11px] font-mono transition"
              title={`Insert ${char.name} (${char.triggerTag})`}
            >
              {char.triggerTag}
            </button>
          ))}
        </div>
      )}

      {/* Quick style suggestion triggers */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-zinc-500">Quick styles:</span>
        {STYLE_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => handleAddPreset(p)}
            className="text-[11px] px-2 py-0.5 rounded bg-[#181820] border border-[#282833] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition"
          >
            + {p}
          </button>
        ))}
      </div>

      {/* Negative Prompt Collapsible */}
      <div className="pt-1 border-t border-[#22222a]">
        <button
          type="button"
          onClick={() => setShowNegative(!showNegative)}
          className="flex items-center justify-between w-full text-xs text-zinc-400 hover:text-zinc-200 transition py-1"
        >
          <span>Negative Prompt (What to exclude)</span>
          {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showNegative && (
          <div className="mt-2">
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. blurry, deformed hands, low quality, artifacts, watermark"
              disabled={disabled}
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        )}
      </div>
    </div>
  );
};
