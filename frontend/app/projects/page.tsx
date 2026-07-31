'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  Search, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Sparkles,
  Kanban,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'In Review';
  progress: number;
  membersCount: number;
  mapsCount: number;
  audioCount: number;
  updatedAt: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-01',
    name: 'Vocalyze Core Platform',
    description: 'AI-assisted analytics, audio transcription, and interactive mind map visualization system.',
    status: 'Active',
    progress: 75,
    membersCount: 4,
    mapsCount: 8,
    audioCount: 12,
    updatedAt: '2 hours ago',
  },
  {
    id: 'proj-02',
    name: 'LLM Research & Optimization',
    description: 'Literature review, SHAP/LIME explainability, and inference optimization benchmarking.',
    status: 'In Review',
    progress: 90,
    membersCount: 2,
    mapsCount: 5,
    audioCount: 6,
    updatedAt: 'Yesterday',
  },
  {
    id: 'proj-03',
    name: 'Market & Competitor Analysis',
    description: 'Audio summaries and mind maps extracted from competitor product demo calls.',
    status: 'Completed',
    progress: 100,
    membersCount: 3,
    mapsCount: 4,
    audioCount: 4,
    updatedAt: 'Jan 10, 2026',
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 max-w-[1920px] w-full mx-auto antialiased selection:bg-indigo-500 selection:text-white">
      {/* Üst Başlık & Arama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1f2438]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize your recordings, transcripts, and mind maps into collaborative team projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Arama Kutusu */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..." 
              className="bg-[#121622] border border-[#1f2438] text-xs text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 w-64 placeholder-slate-500"
            />
          </div>

          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Grid Proje Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            className="p-6 rounded-2xl bg-[#121622] border border-[#1f2438] hover:border-indigo-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Durum & İkon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                  <Folder className="w-5 h-5" />
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
                  project.status === 'Completed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : project.status === 'In Review'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Başlık & Açıklama */}
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition mb-2">
                {project.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-6">
                {project.description}
              </p>

              {/* İlerleme Çubuğu */}
              <div className="mb-6">
                <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-indigo-400">{project.progress}%</span>
                </div>
                <div className="w-full bg-[#090b10] h-2 rounded-full overflow-hidden p-0.5 border border-[#1f2438]">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Alt İstatistikler & Aksiyon */}
            <div className="pt-4 border-t border-[#1f2438] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Users className="w-3.5 h-3.5 text-slate-500" /> {project.membersCount}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Kanban className="w-3.5 h-3.5 text-purple-400" /> {project.mapsCount} Maps
                </span>
              </div>

              <Link 
                href="/" 
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}