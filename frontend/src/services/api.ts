import axios from 'axios';

// FastAPI varsayılan adresi (Port 8000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// TİP TANIMLAMALARI (TYPES / INTERFACES)
// ==========================================

export interface ProjectDTO {
  name: string;
  description?: string;
  status?: string;
}

export interface NodeData {
  id: string;
  label: string;
  type?: string;
  [key: string]: unknown;
}

export interface EdgeData {
  source: string;
  target: string;
  [key: string]: unknown;
}

export interface MindMapNodesData {
  nodes?: NodeData[];
  edges?: EdgeData[];
  [key: string]: unknown;
}

export interface MindMapCreateDTO {
  title: string;
  category?: string;
  project_id?: string | null;
  nodes_data?: MindMapNodesData;
}

export interface MindMapUpdateDTO {
  title?: string;
  nodes_data?: MindMapNodesData;
}

// API Genel Yanıt Tipi
export interface ApiResponse<T> {
  status?: string;
  data: T;
  [key: string]: unknown;
}

// ==========================================
// 1. PROJELER (PROJECTS)
// ==========================================

export const getProjects = async (): Promise<ApiResponse<unknown>> => {
  const response = await api.get('/api/projects');
  return response.data;
};

export const createProject = async (projectData: ProjectDTO): Promise<ApiResponse<unknown>> => {
  const response = await api.post('/api/projects', projectData);
  return response.data;
};

export const getProjectById = async (projectId: string): Promise<ApiResponse<unknown>> => {
  const response = await api.get(`/api/projects/${projectId}`);
  return response.data;
};

export const deleteProject = async (projectId: string): Promise<ApiResponse<unknown>> => {
  const response = await api.delete(`/api/projects/${projectId}`);
  return response.data;
};

// ==========================================
// 2. ZİHİN HARİTALARI (MIND MAPS)
// ==========================================

export const getMaps = async (): Promise<ApiResponse<unknown>> => {
  const response = await api.get('/api/maps');
  return response.data;
};

export const createMap = async (mapData: MindMapCreateDTO): Promise<ApiResponse<unknown>> => {
  const response = await api.post('/api/maps', mapData);
  return response.data;
};

export const updateMap = async (mapId: string, mapData: MindMapUpdateDTO): Promise<ApiResponse<unknown>> => {
  const response = await api.put(`/api/maps/${mapId}`, mapData);
  return response.data;
};

export const deleteMap = async (mapId: string): Promise<ApiResponse<unknown>> => {
  const response = await api.delete(`/api/maps/${mapId}`);
  return response.data;
};

// ==========================================
// 3. SES KÜTÜPHANESİ (AUDIO UPLOAD)
// ==========================================

export const uploadAudio = async (file: File): Promise<ApiResponse<unknown>> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAudioLibrary = async (): Promise<ApiResponse<unknown>> => {
  const response = await api.get('/api/audio');
  return response.data;
};

export const processAudio = async (fileId: string, projectId?: string): Promise<ApiResponse<any>> => {
  const response = await api.post('/api/process-audio', { file_id: fileId, project_id: projectId });
  return response.data;
};

// ==========================================
// 4. ENTEGRASYONLAR & ARAMA
// ==========================================

export const getIntegrations = async (): Promise<ApiResponse<unknown>> => {
  const response = await api.get('/api/integrations');
  return response.data;
};

export const toggleIntegration = async (integrationId: string): Promise<ApiResponse<unknown>> => {
  const response = await api.post(`/api/integrations/${integrationId}/toggle`);
  return response.data;
};

export const searchAll = async (query: string): Promise<ApiResponse<unknown>> => {
  const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export default api;