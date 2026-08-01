import os
import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware

# ================= 1. SUPABASE BAGLANTISI =================
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://lezsyqjynsbmudijvxtn.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlenN5cWp5bnNibXVkaWp2eHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzQzMDUsImV4cCI6MjEwMTE1MDMwNX0.HvbQmYny_tRibRK9Zz7w8HrkUuX53E1mNwzXRC9Y_V8")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ================= 2. Pydantic Şemaları (DTOs) =================
class ProjectCreateDTO(BaseModel):
    name: str
    description: str
    status: Optional[str] = "Active"

class MindMapCreateDTO(BaseModel):
    title: str
    category: Optional[str] = "MEETINGS"
    project_id: Optional[str] = None
    nodes_data: Optional[dict] = None

class MindMapUpdateDTO(BaseModel):
    title: Optional[str] = None
    nodes_data: Optional[dict] = None

# ================= 3. FASTAPI UYGULAMASI VE CORS =================
app = FastAPI(title="Vocalyze Supabase Backend API")
from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI() satırından hemen sonra ekle:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme aşamasında tüm kökenlere izin verir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./temp_audio_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================= 4. ENDPOINT'LER =================

# --- 1. DASHBOARD & FILE UPLOAD ---
@app.post("/api/upload")
async def upload_audio_file(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        ext = os.path.splitext(file.filename)[1] if file.filename else ".mp3"
        saved_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
        
        # Dosyayı diske kaydet
        contents = await file.read()
        with open(saved_path, "wb") as buffer:
            buffer.write(contents)
            
        file_size_mb = round(len(contents) / (1024 * 1024), 2)
            
        data = {
            "id": file_id,
            "title": file.filename or "Untitled Audio",
            "duration": "Processing...",
            "file_size": f"{file_size_mb} MB",
            "file_path": saved_path,
            "created_at": "Just now",
            "tags": ["#NewUpload"],
            "status": "PROCESSING"
        }
        
        response = supabase.table("audio_library").insert(data).execute()
        return {"status": "success", "file_id": file_id, "data": response.data}

    except Exception as e:
        # Hatayı doğrudan HTTP 500 yanıtının detayına yazıyoruz
        raise HTTPException(status_code=500, detail=f"HATA DETAYI: {str(e)}")

# --- 2. PROJECTS API ---
@app.get("/api/projects")
def get_projects():
    response = supabase.table("projects").select("*").execute()
    
    formatted_projects = []
    for item in response.data:
        formatted_projects.append({
            "id": str(item.get("id")),
            "name": item.get("name", ""),
            "description": item.get("description", ""),
            "status": item.get("status", "Active"),
            "progress": item.get("progress", 0),
            "membersCount": item.get("members_count", 0),
            "mapsCount": item.get("maps_count", 0),
            "audioCount": item.get("audio_count", 0),
            "updatedAt": item.get("updated_at", "")
        })
        
    return formatted_projects

@app.get("/api/projects/{project_id}")
def get_project_detail(project_id: str):
    project = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not project.data:
        raise HTTPException(status_code=404, detail="Proje bulunamadı.")
    
    maps = supabase.table("mind_maps").select("*").eq("project_id", project_id).execute()
    return {"project": project.data[0], "mind_maps": maps.data}

@app.post("/api/projects")
def create_project(payload: ProjectCreateDTO):
    data = {
        "id": f"p-{uuid.uuid4().hex[:6]}",
        "name": payload.name,
        "description": payload.description,
        "status": payload.status,
        "progress": 0,
        "members_count": 1,
        "maps_count": 0
    }
    response = supabase.table("projects").insert(data).execute()
    return {"status": "success", "data": response.data}

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str):
    supabase.table("projects").delete().eq("id", project_id).execute()
    return {"status": "success", "message": "Proje silindi."}


# --- 3. MY MAPS API ---
@app.get("/api/maps")
def get_maps():
    response = supabase.table("mind_maps").select("*").execute()
    return response.data

@app.get("/api/maps/{map_id}")
def get_map_detail(map_id: str):
    response = supabase.table("mind_maps").select("*").eq("id", map_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Harita bulunamadı.")
    return response.data[0]

@app.post("/api/maps")
def create_map(payload: MindMapCreateDTO):
    try:
        # nodes_data güvenli okuma
        nodes_dict = payload.nodes_data or {}
        nodes_list = nodes_dict.get("nodes", []) if isinstance(nodes_dict, dict) else []
        nodes_count = len(nodes_list)

        data = {
            "id": f"m-{uuid.uuid4().hex[:6]}",
            "title": payload.title,
            "category": payload.category or "MEETINGS",
            "project_id": payload.project_id,
            "nodes_data": nodes_dict,
            "nodes_count": nodes_count
        }
        
        response = supabase.table("mind_maps").insert(data).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        print("MIND MAP CREATE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=f"Map oluşturma hatası: {str(e)}")

@app.put("/api/maps/{map_id}")
def update_map(map_id: str, payload: MindMapUpdateDTO):
    update_data = {"updated_at": "Just now"}
    if payload.title:
        update_data["title"] = payload.title
    if payload.nodes_data:
        update_data["nodes_data"] = payload.nodes_data
        nodes_list = payload.nodes_data.get("nodes", []) if isinstance(payload.nodes_data, dict) else []
        update_data["nodes_count"] = len(nodes_list)
    
    response = supabase.table("mind_maps").update(update_data).eq("id", map_id).execute()
    return {"status": "success", "data": response.data}

@app.delete("/api/maps/{map_id}")
def delete_map(map_id: str):
    supabase.table("mind_maps").delete().eq("id", map_id).execute()
    return {"status": "success", "message": "Harita silindi."}
# --- 4. LIBRARY API ---
@app.get("/api/library")
def get_library():
    response = supabase.table("audio_library").select("*").execute()
    return response.data

@app.get("/api/library/{audio_id}/transcript")
def get_audio_transcript(audio_id: str):
    response = supabase.table("audio_library").select("id, title, transcript").eq("id", audio_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı.")
    return response.data[0]

@app.get("/api/library/{audio_id}/download")
def download_audio(audio_id: str):
    response = supabase.table("audio_library").select("*").eq("id", audio_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı.")
    
    file_path = response.data[0].get("file_path")
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="İndirilecek dosya sunucuda bulunamadı.")
        
    return FileResponse(file_path, filename=f"{response.data[0]['title']}.mp3", media_type="audio/mpeg")

@app.delete("/api/library/{audio_id}")
def delete_audio(audio_id: str):
    response = supabase.table("audio_library").select("file_path").eq("id", audio_id).execute()
    if response.data and response.data[0].get("file_path"):
        path = response.data[0]["file_path"]
        if os.path.exists(path):
            os.remove(path)
            
    supabase.table("audio_library").delete().eq("id", audio_id).execute()
    return {"status": "success", "message": "Kayıt ve dosya silindi."}


# --- 5. INTEGRATIONS API ---
@app.get("/api/integrations")
def get_integrations():
    response = supabase.table("integrations").select("*").execute()
    return response.data

@app.post("/api/integrations/{integration_id}/toggle")
def toggle_integration(integration_id: str):
    item = supabase.table("integrations").select("*").eq("id", integration_id).execute()
    if not item.data:
        raise HTTPException(status_code=404, detail="Entegrasyon bulunamadı.")
    
    current_status = item.data[0]["is_connected"]
    new_status = 0 if current_status == 1 else 1
    new_sync = "Connected just now" if new_status == 1 else "Requires OAuth 2.0"
    
    response = supabase.table("integrations").update({"is_connected": new_status, "sync_status": new_sync}).eq("id", integration_id).execute()
    return {"status": "success", "is_connected": new_status}


# --- 6. GLOBAL SEARCH ---
@app.get("/api/search")
def global_search(q: str = Query(..., min_length=1)):
    projects = supabase.table("projects").select("*").ilike("name", f"%{q}%").execute()
    maps = supabase.table("mind_maps").select("*").ilike("title", f"%{q}%").execute()
    audio = supabase.table("audio_library").select("*").ilike("title", f"%{q}%").execute()
    
    return {
        "query": q,
        "results": {
            "projects": projects.data,
            "mind_maps": maps.data,
            "audio_library": audio.data
        }
    }