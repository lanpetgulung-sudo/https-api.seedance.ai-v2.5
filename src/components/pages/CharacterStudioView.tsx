import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { CharacterPreset } from '../../types/index';
import {
  Users,
  Plus,
  Trash2,
  Tag,
  UploadCloud,
  Sparkles,
  Info,
  Film,
  X
} from 'lucide-react';

export const CharacterStudioView: React.FC = () => {
  const { characters, addCharacter, deleteCharacter, setActiveTab } = useStudio();

  const [name, setName] = useState('');
  const [triggerTag, setTriggerTag] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('Female');
  const [tagInput, setTagInput] = useState('');
  const [styleTags, setStyleTags] = useState<string[]>(['Cinematic', 'Sci-Fi']);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setReferenceImages([...referenceImages, event.target?.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!styleTags.includes(tagInput.trim())) {
        setStyleTags([...styleTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setStyleTags(styleTags.filter((tag) => tag !== t));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const cleanTag = triggerTag.trim().startsWith('@')
      ? triggerTag.trim()
      : `@${triggerTag.trim() || name.toLowerCase().replace(/\s+/g, '_')}`;

    addCharacter({
      name: name.trim(),
      triggerTag: cleanTag,
      description: description.trim(),
      gender,
      styleTags,
      referenceImages: referenceImages.length > 0 ? referenceImages : ['/src/assets/images/character_elena_portrait_1793608014221.jpg'],
    });

    setName('');
    setTriggerTag('');
    setDescription('');
    setReferenceImages([]);
    setNotification('Character profile saved successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Character Consistency Engine
          </h1>
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
            Seedance Identity Lock
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Store reusable multi-angle character references, clothing cues, and trigger tags to preserve facial and stylistic likeness across video scenes.
        </p>
      </div>

      {/* Advisory banner */}
      <div className="p-3.5 rounded-xl bg-[#14141d] border border-[#232332] flex items-start gap-3 text-xs text-zinc-400">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-zinc-200">Consistency Note:</strong> While AI video generation inherently exhibits natural micro-variations, binding character reference images and trigger tags significantly grounds identity, haircut, facial geometry, and costume consistency.
        </span>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Creator panel */}
        <div className="lg:col-span-5 bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 pb-2 border-b border-[#22222a]">
            Create Character Profile
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Character Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!triggerTag) {
                    setTriggerTag(`@${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
                  }
                }}
                placeholder="e.g. Elena Rostova"
                className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Trigger Tag</label>
              <input
                type="text"
                value={triggerTag}
                onChange={(e) => setTriggerTag(e.target.value)}
                placeholder="@elena_cyber"
                className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              Appearance, Facial Structure & Costume
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Silver-haired female detective in mid-30s, sharp jawline, high collar obsidian coat, amber rim lighting..."
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
            />
          </div>

          {/* Reference Image Uploads */}
          <div className="space-y-2">
            <label className="text-[11px] text-zinc-400 block">
              Reference Headshots & Wardrobe
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {referenceImages.map((img, i) => (
                <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-700 group">
                  <img src={img} alt="Ref" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="w-14 h-14 rounded-lg border-2 border-dashed border-[#2b2b36] hover:border-purple-500/50 flex flex-col items-center justify-center cursor-pointer transition text-zinc-500 hover:text-purple-400">
                <UploadCloud className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Style Tags */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-400 block">Style Tags (Press Enter)</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {styleTags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-[#181820] border border-[#2b2b36] text-[11px] text-zinc-300 flex items-center gap-1"
                >
                  {t}
                  <button onClick={() => removeTag(t)} className="text-zinc-500 hover:text-red-400">
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none w-20 px-1"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleSave}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Save Character Preset
          </button>
        </div>

        {/* Existing Presets List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#22222a]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Saved Character Presets ({characters.length})
            </h3>
            <span className="text-[11px] text-zinc-500">Reusable across all studios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map((char) => (
              <div
                key={char.id}
                className="bg-[#121217] border border-[#22222a] rounded-xl p-4 flex flex-col justify-between space-y-3 group hover:border-[#353545] transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {char.referenceImages[0] ? (
                        <img
                          src={char.referenceImages[0]}
                          alt={char.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#2e2e3d] shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 font-bold">
                          {char.name[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{char.name}</h4>
                        <span className="font-mono text-[11px] text-purple-400">{char.triggerTag}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCharacter(char.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {char.description}
                  </p>

                  {char.styleTags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {char.styleTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[#181820] text-zinc-400 border border-[#242430]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#1d1d26] flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(char.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => setActiveTab('text-to-video')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition"
                  >
                    <Film className="w-3 h-3" />
                    <span>Use in Scene</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
