'use client';

import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  Search, 
  Plus, 
  Users, 
  Kanban,
  ExternalLink,
  Loader2,
  AlertCircle,
  X
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
  audioCount?: number;
  updatedAt?: string;
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Projeleri Backend'den Çekme
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8000/api/projects');
      if (!res.ok) throw new Error('Backend ile iletişim kurulamadı.');
      
      const rawData = await res.json();
      
      // Supabase snake_case alanlarını güvenli bir şekilde entegre etme
      const mappedData: ProjectItem[] = rawData.map((item: any) => ({
        id: str(item.id),
        name: item.name || 'Untitled Project',
        description: item.description || '',
        status: item.status || 'Active',
        progress: item.progress ?? 0,
        membersCount: item.members_count ?? item.membersCount ?? 1,
        mapsCount: item.maps_count ?? item.mapsCount ?? 0,
        audioCount: item.audio_count ?? item.audioCount ?? 0,
        updatedAt: item.updated_at || item.updatedAt || 'Recently'
      }));

      setProjects(mappedData);
    } catch (err: any) {
      console.error(err);
      setError('Projeler yüklenirken hata oluştu. Backend (FastAPI) sunucusunun çalıştığından emin ol.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Yeni Proje Oluşturma (Post Request)
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc,
          status: 'Active',
          progress: 0,
          members_count: 1,
          maps_count: 0
        })
      });

      if (res.ok) {
        setNewProjectName('');
        setNewProjectDesc('');
        setIsModalOpen(false);
        fetchProjects(); // Listeyi yenile
      }
    } catch (err) {
      console.error('Proje oluşturma hatası:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const str = (val: any) => (val ? String(val) : '');

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

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Yükleniyor Veya Hata Durumu */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-xs">Projeler yükleniyor...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Proje Kartları */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-500 text-xs">
              Henüz hiç proje bulunmuyor veya aramayla eşleşmedi.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="p-6 rounded-2xl bg-[#121622] border border-[#1f2438] hover:border-indigo-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
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

                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-6">
                    {project.description}
                  </p>

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
                    href={`/projects/${project.id}`} 
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#121622] border border-[#1f2438] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Create New Project</h2>
            <p className="text-xs text-slate-400 mb-6">Enter project details to initialize a new workspace.</p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Q4 Marketing Audio Notes"
                  className="w-full bg-[#090b10] border border-[#1f2438] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief summary of the project..."
                  className="w-full bg-[#090b10] border border-[#1f2438] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f2438]">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}