"""
Resume Parser - Extracts text from PDF, DOCX, and TXT files
"""

import os
import re

def extract_text_from_file(filepath):
    """Extract raw text from a resume file."""
    ext = filepath.rsplit('.', 1)[-1].lower()
    
    if ext == 'pdf':
        return extract_from_pdf(filepath)
    elif ext == 'docx':
        return extract_from_docx(filepath)
    elif ext == 'txt':
        return extract_from_txt(filepath)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def extract_from_pdf(filepath):
    """Extract text from PDF using PyPDF2."""
    try:
        import PyPDF2
        text = ""
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return clean_text(text)
    except ImportError:
        # Fallback: try pdfplumber
        try:
            import pdfplumber
            text = ""
            with pdfplumber.open(filepath) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return clean_text(text)
        except ImportError:
            raise ImportError("Please install PyPDF2 or pdfplumber: pip install PyPDF2")

def extract_from_docx(filepath):
    """Extract text from DOCX using docx2txt."""
    try:
        import docx2txt
        text = docx2txt.process(filepath)
        return clean_text(text)
    except ImportError:
        try:
            from docx import Document
            doc = Document(filepath)
            text = "\n".join([para.text for para in doc.paragraphs])
            return clean_text(text)
        except ImportError:
            raise ImportError("Please install docx2txt: pip install docx2txt")

def extract_from_txt(filepath):
    """Extract text from TXT file."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        return clean_text(f.read())

def clean_text(text):
    """Clean extracted text."""
    if not text:
        return ""
    # Remove excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    # Remove non-printable characters
    text = re.sub(r'[^\x20-\x7E\n\t]', ' ', text)
    return text.strip()
