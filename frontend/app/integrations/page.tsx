'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Sliders, 
  ShieldCheck,
  Radio
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  iconBg: string;
  connected: boolean;
  lastSync?: string;
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
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            connected: !item.connected,
            lastSync: !item.connected ? 'Just now' : undefined,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f2438]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations & Apps</h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect Vocalyze with your favorite tools to automate audio import and mind map exports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#121622] hover:bg-[#1a2035] border border-[#1f2438] text-slate-300 text-xs px-4 py-2 rounded-xl transition">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync All</span>
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20">
            <Plus className="w-3.5 h-3.5" />
            <span>Request New App</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((app) => (
          <div 
            key={app.id} 
            className={`p-6 rounded-2xl bg-[#121622] border transition-all flex flex-col justify-between ${
              app.connected ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' : 'border-[#1f2438] hover:border-slate-700'
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
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
                <span className="text-[10px] text-slate-500">Requires OAuth 2.0</span>
              )}

              <div className="flex items-center gap-2">
                {app.connected && (
                  <button className="p-2 rounded-lg bg-[#1a2035] hover:bg-[#252b45] text-slate-300 transition">
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}
                <button 
                  onClick={() => toggleConnection(app.id)}
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
    </div>
  );
}