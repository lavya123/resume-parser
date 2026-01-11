from io import BytesIO
import pdfplumber
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# ----------------------------
# SKILL DATABASE (editable)
# ----------------------------
SKILLS_DB = [
    "strategic planning",
    "problem solving",
    "crisis management",
    "creative thinking",
    "data analysis",
    "brand development",
    "negotiation",
    "customer orientation",
    "adaptability",
    "communication",
    "ui ux design",
    "graphic design",
    "digital illustration",
    "typography",
    "design software",
    "marketing",
    "management"
]


# ----------------------------
# TEXT EXTRACTION
# ----------------------------
def extract_text_from_pdf(file_bytes):
    text = ""
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.lower()


# ----------------------------
# CLEANING
# ----------------------------
def clean_text(text):
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    lemmatizer = WordNetLemmatizer()

    cleaned_tokens = [
        lemmatizer.lemmatize(token)
        for token in tokens
        if token.isalpha() and token not in stop_words
    ]

    return cleaned_tokens


# ----------------------------
# SKILL EXTRACTION (DB MATCH)
# ----------------------------
def extract_skills(text):
    cleaned_tokens = clean_text(text)
    cleaned_text = " ".join(cleaned_tokens)

    skills_found = []

    for skill in SKILLS_DB:
        if skill in cleaned_text:
            skills_found.append(skill)

    return list(set(skills_found))


# ----------------------------
# EXPERIENCE EXTRACTION
# ----------------------------
def extract_experience(text):
    matches = re.findall(r"(\d+)\s*(years|year)", text)
    if matches:
        return max(int(m[0]) for m in matches)
    return 0


# ----------------------------
# EDUCATION EXTRACTION
# ----------------------------
def extract_education(text):
    education_keywords = [
        "bachelor",
        "master",
        "masters",
        "mba",
        "phd",
        "university",
        "college"
    ]

    found = []
    for word in education_keywords:
        if word in text:
            found.append(word)

    return list(set(found))


# ----------------------------
# MAIN PARSER
# ----------------------------
def parse_resume(file_bytes, filename):
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    else:
        text = file_bytes.decode("utf-8").lower()

    skills = extract_skills(text)
    experience = extract_experience(text)
    education = extract_education(text)

    return {
        "skills": skills,
        "education": education,
        "experience": experience,
        "raw_text": text
    }
