'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Sliders, 
  Radio,
  Search,
  X,
  Loader2,
  Lock,
  Key,
  Globe,
  Check,
  AlertCircle
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  iconBg: string;
  connected: boolean;
  lastSync?: string;
  webhookUrl?: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'Cloud Storage',
    description: 'Automatically import recorded meeting audio files directly from your Drive folders.',
    iconBg: 'from-amber-500 to-emerald-500',
    connected: true,
    lastSync: '10 mins ago',
  },
  {
    id: 'notion',
    name: 'Notion Workspace',
    category: 'Productivity',
    description: 'Export AI-generated mind maps and summary notes directly into your Notion database.',
    iconBg: 'from-slate-700 to-slate-900',
    connected: true,
    lastSync: '2 hours ago',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Send meeting summaries and action items to designated Slack channels automatically.',
    iconBg: 'from-purple-600 to-pink-600',
    connected: false,
  },
  {
    id: 'zoom',
    name: 'Zoom Cloud Recordings',
    category: 'Video Conferencing',
    description: 'Sync and analyze Zoom cloud recordings instantly as soon as meetings end.',
    iconBg: 'from-blue-600 to-cyan-500',
    connected: false,
  },
  {
    id: 'google-meet',
    name: 'Google Meet Bot',
    category: 'Video Conferencing',
    description: 'Invite Vocalyze AI bot to live Google Meet sessions to generate real-time mind maps.',
    iconBg: 'from-emerald-600 to-teal-500',
    connected: false,
  },
  {
    id: 'webhooks',
    name: 'Custom Webhooks',
    category: 'Developer Tools',
    description: 'Trigger custom HTTP webhooks when new mind maps or audio transcripts are ready.',
    iconBg: 'from-indigo-600 to-purple-800',
    connected: false,
    webhookUrl: 'https://api.vocalyze.ai/v1/webhooks/incoming'
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Modal Durumları
  const [activeModalApp, setActiveModalApp] = useState<Integration | null>(null);
  const [modalMode, setModalMode] = useState<'connect' | 'settings' | 'webhook' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Custom Webhook state
  const [customWebhookInput, setCustomWebhookInput] = useState('');

  // 1. Tumunu Senkronize Et
  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIntegrations(prev => prev.map(item => item.connected ? { ...item, lastSync: 'Just now' } : item));
      setIsSyncingAll(false);
    }, 1200);
  };

  // 2. Bağlantı / Ayarlar Butonu Yönetimi
  const handleActionClick = (app: Integration) => {
    setActiveModalApp(app);
    if (app.id === 'webhooks') {
      setCustomWebhookInput(app.webhookUrl || '');
      setModalMode('webhook');
    } else if (app.connected) {
      setModalMode('settings');
    } else {
      setModalMode('connect');
    }
  };

  // 3. Bağlantıyı Onayla / Başlat
  const confirmConnection = () => {
    if (!activeModalApp) return;
    setIsConnecting(true);

    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => {
          if (item.id === activeModalApp.id) {
            return {
              ...item,
              connected: true,
              lastSync: 'Just now',
              webhookUrl: item.id === 'webhooks' ? customWebhookInput : item.webhookUrl
            };
          }
          return item;
        })
      );
      setIsConnecting(false);
      setActiveModalApp(null);
      setModalMode(null);
    }, 1000);
  };

  // 4. Bağlantıyı Kopar
  const handleDisconnect = (id: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return;
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, connected: false, lastSync: undefined };
        }
        return item;
      })
    );
    setActiveModalApp(null);
    setModalMode(null);
  };

  // Filtreleme
  const categories = ['All', 'Cloud Storage', 'Productivity', 'Communication', 'Video Conferencing', 'Developer Tools'];

  const filteredIntegrations = integrations.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white relative">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f2438]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations & Apps</h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect Vocalyze with your favorite tools to automate audio import and mind map exports.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="flex items-center gap-2 bg-[#121622] hover:bg-[#1a2035] border border-[#1f2438] text-slate-300 text-xs px-4 py-2 rounded-xl transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isSyncingAll ? 'Syncing...' : 'Sync All'}</span>
          </button>
          
          <button 
            onClick={() => alert('New integration requests recorded!')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Request New App</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..." 
            className="w-full bg-[#121622] border border-[#1f2438] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>

        {/* Kategori Sekmeleri */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-[#121622] border border-[#1f2438] text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((app) => (
          <div 
            key={app.id} 
            className={`p-6 rounded-2xl bg-[#121622] border transition-all flex flex-col justify-between ${
              app.connected 
                ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' 
                : 'border-[#1f2438] hover:border-slate-700'
            }`}
          >
            <div>
              {/* Top Row: Icon & Status */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center shadow-md font-bold text-white text-lg`}>
                  {app.name.charAt(0)}
                </div>

                {app.connected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-800/80 text-slate-400 border border-slate-700">
                    <Radio className="w-3 h-3 text-slate-500" /> Not Connected
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <div className="mb-2">
                <span className="text-[10px] font-semibold tracking-wider text-purple-400 uppercase">{app.category}</span>
                <h3 className="text-base font-semibold text-slate-100 mt-0.5">{app.name}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {app.description}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-[#1f2438]/60 flex items-center justify-between">
              {app.connected ? (
                <span className="text-[10px] font-mono text-slate-500">Sync: {app.lastSync}</span>
              ) : (
                <span className="text-[10px] text-slate-500">
                  {app.id === 'webhooks' ? 'HTTP Endpoint' : 'Requires OAuth 2.0'}
                </span>
              )}

              <div className="flex items-center gap-2">
                {app.connected && (
                  <button 
                    onClick={() => handleActionClick(app)}
                    className="p-2 rounded-lg bg-[#1a2035] hover:bg-[#252b45] text-slate-300 transition"
                    title="Configure Integration"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}
                
                <button 
                  onClick={() => handleActionClick(app)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
                    app.connected 
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {app.connected ? 'Disconnect' : 'Connect'}
                  {!app.connected && <ExternalLink className="w-3 h-3" />}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ================= DYNAMIC MODALS ================= */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121622] border border-[#1f2438] rounded-2xl w-full max-w-md p-6 shadow-2xl relative flex flex-col gap-5">
            
            <button 
              onClick={() => setActiveModalApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1f2438] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeModalApp.iconBg} flex items-center justify-center text-white font-bold text-base`}>
                {activeModalApp.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{activeModalApp.name}</h3>
                <p className="text-xs text-purple-400 font-medium">{activeModalApp.category}</p>
              </div>
            </div>

            {/* MODAL MOD 1: OAUTH CONNECT */}
            {modalMode === 'connect' && (
              <>
                <div className="bg-[#090b10] border border-[#1f2438] p-4 rounded-xl text-xs text-slate-300 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                    <Lock className="w-4 h-4" />
                    <span>OAuth 2.0 Authentication</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    By connecting {activeModalApp.name}, you authorize Vocalyze to access relevant files for automated transcription and mind-mapping.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1f2438]">
                  <button
                    onClick={() => setActiveModalApp(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[#1a2035] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmConnection}
                    disabled={isConnecting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    <span>{isConnecting ? 'Authenticating...' : 'Authorize & Connect'}</span>
                  </button>
                </div>
              </>
            )}

            {/* MODAL MOD 2: WEBHOOK CONFIG */}
            {modalMode === 'webhook' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      Payload Destination URL
                    </label>
                    <input 
                      type="url"
                      value={customWebhookInput}
                      onChange={(e) => setCustomWebhookInput(e.target.value)}
                      placeholder="https://your-server.com/api/webhook"
                      className="w-full bg-[#090b10] border border-[#1f2438] rounded-xl text-xs text-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      Webhook Signing Secret
                    </label>
                    <input 
                      type="text"
                      readOnly
                      value="whsec_9a8f7b2c6e1d40a"
                      className="w-full bg-[#090b10] border border-[#1f2438] rounded-xl text-xs text-slate-500 font-mono px-3.5 py-2.5 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1f2438]">
                  {activeModalApp.connected ? (
                    <button
                      onClick={() => handleDisconnect(activeModalApp.id)}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Disable Webhook
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalApp(null)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmConnection}
                      disabled={!customWebhookInput || isConnecting}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      {isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Save Endpoint</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* MODAL MOD 3: SETTINGS & DISCONNECT */}
            {modalMode === 'settings' && (
              <>
                <div className="bg-[#090b10] border border-[#1f2438] p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Last Sync:</span>
                    <span className="text-slate-400 font-mono">{activeModalApp.lastSync || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1f2438]">
                  <button
                    onClick={() => handleDisconnect(activeModalApp.id)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                  >
                    Disconnect Integration
                  </button>
                  <button
                    onClick={() => setActiveModalApp(null)}
                    className="px-4 py-2 bg-[#1a2035] hover:bg-[#252b45] text-white rounded-xl text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}