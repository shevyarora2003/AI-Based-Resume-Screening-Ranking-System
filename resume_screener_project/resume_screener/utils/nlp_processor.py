"""
NLP Processor - Extracts structured information from resume text
Uses spaCy for NER and regex patterns for contact info
"""

import re

def process_resume(text):
    """
    Process resume text and extract structured information.
    Returns dict with name, email, phone, experience_years, education.
    """
    result = {
        'name': extract_name(text),
        'email': extract_email(text),
        'phone': extract_phone(text),
        'experience_years': extract_experience_years(text),
        'education': extract_education(text),
        'sections': extract_sections(text)
    }
    return result

def extract_name(text):
    """Extract candidate name from resume."""
    # Try spaCy first
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text[:500])  # Check first 500 chars
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text.strip()
    except Exception:
        pass
    
    # Fallback: first non-empty line that looks like a name
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    for line in lines[:5]:
        # Name pattern: 2-4 words, each capitalized, no numbers
        words = line.split()
        if 2 <= len(words) <= 4:
            if all(w[0].isupper() and w.isalpha() for w in words if w):
                return line
    
    return lines[0] if lines else "Unknown"

def extract_email(text):
    """Extract email address."""
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(pattern, text)
    return match.group(0) if match else "N/A"

def extract_phone(text):
    """Extract phone number."""
    patterns = [
        r'\+?[\d\s\-\(\)]{10,15}',
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',
        r'\b\d{10}\b'
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            phone = match.group(0).strip()
            if len(re.sub(r'\D', '', phone)) >= 10:
                return phone
    return "N/A"

def extract_experience_years(text):
    """Estimate years of experience from resume text."""
    # Look for explicit mentions
    patterns = [
        r'(\d+)\+?\s*years?\s+of\s+experience',
        r'(\d+)\+?\s*years?\s+experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+exp',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    # Count date ranges in experience section
    year_pattern = r'\b(19|20)\d{2}\b'
    years_found = re.findall(year_pattern, text)
    if len(years_found) >= 2:
        # Rough estimate: range of years mentioned
        try:
            years_int = [int(y + text[text.index(y+text[text.index(y):].index(y[:2])+len(y[:2])):][:2]) 
                        for y in years_found]
        except:
            pass
        # Simple approach: count unique years mentioned
        return min(len(set(years_found)) * 1, 15)
    
    return 0

def extract_education(text):
    """Extract highest education level."""
    education_keywords = {
        'PhD': ['phd', 'ph.d', 'doctorate', 'doctoral'],
        'Masters': ['master', 'msc', 'm.sc', 'mba', 'm.b.a', 'me ', 'm.e', 'ms ', 'm.s'],
        'Bachelors': ['bachelor', 'bsc', 'b.sc', 'be ', 'b.e', 'btech', 'b.tech', 'bs ', 'b.s', 'ba ', 'b.a'],
        'Diploma': ['diploma', 'associate'],
        'High School': ['high school', 'secondary', '12th', 'hsc', 'ssc']
    }
    
    text_lower = text.lower()
    for level, keywords in education_keywords.items():
        for kw in keywords:
            if kw in text_lower:
                return level
    return "Not specified"

def extract_sections(text):
    """Identify major sections in the resume."""
    section_headers = [
        'experience', 'work experience', 'employment', 'professional experience',
        'education', 'academic', 'skills', 'technical skills', 'projects',
        'certifications', 'achievements', 'summary', 'objective', 'profile'
    ]
    
    found_sections = []
    text_lower = text.lower()
    for section in section_headers:
        if section in text_lower:
            found_sections.append(section.title())
    
    return found_sections
