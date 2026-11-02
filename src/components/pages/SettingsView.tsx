import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { AspectRatio, Resolution } from '../../types/index';
import {
  Settings,
  Key,
  CreditCard,
  User,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Coins
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, credits, addCredits, transactions, testApiKey } = useStudio();

  // Local state for API form
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl);
  const [enableMockMode, setEnableMockMode] = useState(settings.enableMockMode);
  const [userName, setUserName] = useState(settings.userName);
  const [userEmail, setUserEmail] = useState(settings.userEmail);

  // Preference state
  const [defaultDuration, setDefaultDuration] = useState(settings.defaultDuration);
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<AspectRatio>(settings.defaultAspectRatio);
  const [defaultResolution, setDefaultResolution] = useState<Resolution>(settings.defaultResolution);
  const [defaultAudio, setDefaultAudio] = useState(settings.defaultAudio);
  const [autoDownload, setAutoDownload] = useState(settings.autoDownload);

  // Status feedback
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testApiKey(apiKey, apiBaseUrl);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSaveSettings = () => {
    updateSettings({
      apiKey: apiKey.trim(),
      apiBaseUrl: apiBaseUrl.trim(),
      enableMockMode,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      defaultDuration,
      defaultAspectRatio,
      defaultResolution,
      defaultAudio,
      autoDownload,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTopUp = (amount: number) => {
    addCredits(amount, `Credit refill (+${amount} credits)`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Studio Settings & Configuration
          </h1>
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
            Seedance 2.5 Hub
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Configure Seedance 2.5 engine parameters, API keys, balance management, and workflow defaults.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Studio settings updated and persisted successfully!</span>
        </div>
      )}

      {/* 1. SEEDANCE 2.5 API CONFIGURATION */}
      <div className="bg-[#121217] border border-[#22222a] rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#22222a]">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Seedance 2.5 API Provider
            </h2>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {enableMockMode ? 'Simulation Active' : 'Live Endpoints Active'}
          </span>
        </div>

        {/* Engine mode switcher */}
        <div className="p-4 rounded-xl bg-[#171722] border border-[#262638] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-zinc-200">Simulation / Mock Mode</div>
            <div className="text-[11px] text-zinc-400">
              When enabled, generates high-definition simulated video sequences without debiting upstream Seedance API quotas.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEnableMockMode(!enableMockMode)}
            className={`w-12 h-6 rounded-full transition-colors p-1 relative flex items-center ${
              enableMockMode ? 'bg-purple-600' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                enableMockMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* API Credentials */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Seedance API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_live_seedance_xxxxxxxxxxxx"
                className="flex-1 bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                disabled={isTesting}
                onClick={handleTestConnection}
                className="px-4 py-2 rounded-lg bg-[#20202d] hover:bg-[#28283a] text-zinc-200 text-xs font-semibold border border-[#303042] transition flex items-center gap-1.5 whitespace-nowrap"
              >
                {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Test Connection</span>
              </button>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Required for Live Production mode. Credentials remain secured in your private studio configuration.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Seedance API Base URL
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="https://api.seedance.ai/v2.5"
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/15 border border-red-500/30 text-red-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. CREDIT MANAGEMENT & TOP-UP */}
      <div className="bg-[#121217] border border-[#22222a] rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#22222a]">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Credit Management & Billing
            </h2>
          </div>
          <span className="font-mono tabular-nums text-sm font-bold text-amber-300">
            {credits} Available Credits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#16161f] border border-[#262635] flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-white">Starter Pack</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1">+100 Credits</div>
              <p className="text-[11px] text-zinc-400 mt-1">Generates up to 3 full 30s clips</p>
            </div>
            <button
              onClick={() => handleTopUp(100)}
              className="w-full py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 font-semibold text-xs transition"
            >
              Add +100 Credits
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#16161f] border border-purple-500/30 flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[9px] bg-purple-600 text-white font-mono uppercase px-1.5 py-0.5 rounded">
              Popular
            </div>
            <div>
              <div className="text-xs font-bold text-white">Production Tier</div>
              <div className="text-xl font-bold font-mono text-purple-300 mt-1">+250 Credits</div>
              <p className="text-[11px] text-zinc-400 mt-1">Generates ~8 full 30s clips</p>
            </div>
            <button
              onClick={() => handleTopUp(250)}
              className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition"
            >
              Add +250 Credits
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#16161f] border border-[#262635] flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-white">Studio Pro</div>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">+500 Credits</div>
              <p className="text-[11px] text-zinc-400 mt-1">Generates ~16 full 30s clips</p>
            </div>
            <button
              onClick={() => handleTopUp(500)}
              className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-xs transition"
            >
              Add +500 Credits
            </button>
          </div>
        </div>

        {/* Transactions list */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Transaction Activity Ledger
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {transactions.slice(0, 8).map((tx) => (
              <div
                key={tx.id}
                className="p-2.5 rounded-lg bg-[#181820] border border-[#22222a] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="text-zinc-200 font-medium">{tx.description}</div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {new Date(tx.createdAt).toLocaleDateString()} · {new Date(tx.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div
                  className={`font-mono font-bold ${
                    tx.type === 'DEDUCTION'
                      ? 'text-red-400'
                      : tx.type === 'REFUND'
                      ? 'text-cyan-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tx.type === 'DEDUCTION' ? '-' : '+'}
                  {tx.amount} credits
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GENERATION DEFAULTS & PREFERENCES */}
      <div className="bg-[#121217] border border-[#22222a] rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#22222a]">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Workflow & Generation Defaults
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Default Duration</label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(parseInt(e.target.value, 10))}
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              {[4, 5, 8, 10, 15, 20, 25, 30].map((d) => (
                <option key={d} value={d}>
                  {d} Seconds {d === 30 ? '(Default Master Setting)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Default Aspect Ratio</label>
            <select
              value={defaultAspectRatio}
              onChange={(e) => setDefaultAspectRatio(e.target.value as AspectRatio)}
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="16:9">16:9 (Landscape - Default)</option>
              <option value="9:16">9:16 (Portrait / Reels)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="4:3">4:3 (Standard)</option>
              <option value="3:4">3:4 (Mobile Vertical)</option>
              <option value="21:9">21:9 (Cinematic Ultrawide)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Default Resolution</label>
            <select
              value={defaultResolution}
              onChange={(e) => setDefaultResolution(e.target.value as Resolution)}
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="720p">720p HD (Balanced - Default)</option>
              <option value="1080p">1080p Full HD</option>
              <option value="480p">480p Standard</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#181820] border border-[#2b2b36]">
            <div>
              <div className="text-xs font-semibold text-zinc-200">Synchronized Native Audio</div>
              <div className="text-[10px] text-zinc-500">Auto-enable multi-channel audio synthesis</div>
            </div>
            <input
              type="checkbox"
              checked={defaultAudio}
              onChange={(e) => setDefaultAudio(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 accent-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-[#181820] border border-[#2b2b36]">
          <div>
            <div className="text-xs font-semibold text-zinc-200">Auto-Download Finished MP4</div>
            <div className="text-[10px] text-zinc-500">
              Directly download MP4 file to local storage when video rendering completes
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoDownload}
            onChange={(e) => setAutoDownload(e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 accent-purple-500"
          />
        </div>
      </div>

      {/* 4. USER PROFILE */}
      <div className="bg-[#121217] border border-[#22222a] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#22222a]">
          <User className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            User Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Display Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Save Settings Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer"
        >
          Save All Studio Settings
        </button>
      </div>
    </div>
  );
};
