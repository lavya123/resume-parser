from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from resume_parser import parse_resume
from job_parser import parse_job
from matcher import hiring_decision
from supabase_client import supabase
from nltk_setup import setup_nltk


# 1️⃣ Create FastAPI app FIRST
app = FastAPI(title="Resume Screening API")


# 2️⃣ Setup NLTK (runs once at startup)
setup_nltk()


# 3️⃣ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://10.145.7.167:3000",
        "*",  # allow all for now (safe for demo)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse")
async def parse_only(resume_file: UploadFile = File(...)):
    resume_bytes = await resume_file.read()
    resume_data = parse_resume(resume_bytes, resume_file.filename)
    return resume_data



# 4️⃣ API endpoint
@app.post("/screen")
async def screen_candidate(
    resume_file: UploadFile = File(...),
    job_requirement: str = Form(...),
    user_id: str = Form(...)
):
    # Read resume
    resume_bytes = await resume_file.read()
    resume_data = parse_resume(resume_bytes, resume_file.filename)

    # Defensive defaults
    resume_data.setdefault("skills", [])
    resume_data.setdefault("experience", 0)
    resume_data.setdefault("raw_text", "")

    # Parse job requirement
    job_data = parse_job(job_requirement)
    job_data.setdefault("required_skills", [])
    job_data.setdefault("required_experience", 0)

    # Hiring decision
    result = hiring_decision(
        resume_skills=resume_data["skills"],
        resume_experience=resume_data["experience"],
        resume_text=resume_data["raw_text"],
        job_skills=job_data["required_skills"],
        required_experience=job_data["required_experience"],
        job_text=job_requirement
    )

    # Save to Supabase
    supabase.table("screening_results").insert({
        "user_id": user_id,
        "resume_filename": resume_file.filename,
        "job_requirement": job_requirement,
        "decision": result["decision"],
        "reason": result["reason"]
    }).execute()

    # Return response
    return {
        "decision": result["decision"],
        "reason": result["reason"]
    }
