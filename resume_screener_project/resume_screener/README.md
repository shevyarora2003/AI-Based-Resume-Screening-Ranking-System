# RecruitAI — AI Resume Screening System
> Academic Project | Python + Flask + NLP + Machine Learning

---

## Overview
RecruitAI is a full-stack web application that automatically analyzes resumes and ranks candidates based on job requirements using NLP and ML techniques.

## Features
- Upload multiple resumes (PDF, DOCX, TXT)
- Extract text using PyPDF2 and docx2txt
- NLP processing with spaCy for named entity recognition
- Skill extraction against a 100+ skills database
- TF-IDF cosine similarity scoring with scikit-learn
- 5-dimensional weighted scoring algorithm
- Interactive dashboard with score breakdown
- CSV export of results
- Demo mode (no files needed)

## Scoring Algorithm (Total: 100 points)
| Dimension        | Weight |
|------------------|--------|
| Skills Match     | 40 pts |
| JD Similarity    | 25 pts |
| Experience       | 20 pts |
| Education        | 10 pts |
| Resume Quality   |  5 pts |

## Tech Stack
| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python 3.9+, Flask                  |
| NLP        | spaCy, NLTK, Regex                  |
| ML         | scikit-learn (TF-IDF + Cosine Sim)  |
| PDF Parse  | PyPDF2, docx2txt                    |
| Frontend   | HTML5, CSS3, Vanilla JavaScript     |
| Database   | (stateless, no DB required)         |

## Setup Instructions

### 1. Clone / Extract Project
```bash
cd resume_screener
```

### 2. Create Virtual Environment
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download spaCy Language Model
```bash
python -m spacy download en_core_web_sm
```

### 5. Run the Application
```bash
python app.py
```

### 6. Open in Browser
```
http://localhost:5000 or http://127.0.0.1:5000
```

## Project Structure
```
resume_screener/
├── app.py                    # Flask application & API routes
├── requirements.txt          # Python dependencies
├── README.md
├── uploads/                  # Temporary file storage
├── utils/
│   ├── resume_parser.py      # PDF/DOCX/TXT text extraction
│   ├── nlp_processor.py      # spaCy NLP & info extraction
│   ├── skill_extractor.py    # Skill identification engine
│   └── scorer.py             # ML scoring algorithm
├── templates/
│   └── index.html            # Main dashboard UI
└── static/
    ├── css/style.css         # Full stylesheet
    └── js/app.js             # Frontend application logic
```

## API Endpoint
**POST** `/api/analyze`

Form data:
- `job_description` (string) — Full job description text
- `required_skills` (string) — Comma-separated required skills
- `experience_years` (int) — Minimum years of experience
- `resumes` (files) — One or more resume files

Returns JSON with ranked candidate list and score breakdown.
 
  OR 
1️⃣ Open Terminal in VS Code

Press:

``` Ctrl + `
```

or click Terminal → New Terminal

2️⃣ Go to Your Project Folder

Run:

``` cd C:\Users\ASUS\Downloads\resume_screener_project ```

If you are already inside it, you can skip this.

3️⃣ Install Required Libraries

Run:

``` pip install flask spacy nltk scikit-learn PyPDF2 docx2txt ```

Wait until installation finishes.

4️⃣ Download spaCy Language Model

Run:

```python -m spacy download en_core_web_sm```

This is required for the NLP processing in your project.

5️⃣ Run the Project

Now run:

```python resume_screener/app.py```

or if already inside the folder:

```python app.py```
6️⃣ Open in Browser

Open:

```http://127.0.0.1:5000```

Your AI Resume Screening System will open.

7️⃣ If pip does not work

Try:

``` python -m pip install flask ```
8️⃣ Best Way (Recommended for Projects)

Use requirements.txt.

Run:

``` pip install -r requirements.txt ```

This installs all project dependencies automatically.
## Demo Mode
Click "Run Demo" on the homepage to test with 5 sample resumes without uploading any files.
