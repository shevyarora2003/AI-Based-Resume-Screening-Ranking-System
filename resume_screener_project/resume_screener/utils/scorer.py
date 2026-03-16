"""
Scoring Algorithm - Ranks candidates using TF-IDF similarity + weighted scoring
Uses scikit-learn for cosine similarity between resume and job description
"""

import re
import math

def score_candidate(text, nlp_data, job_description, required_skills, found_skills, min_experience):
    """
    Score a candidate out of 100 using multiple weighted criteria.
    
    Scoring Breakdown:
    - Skills Match: 40 points
    - Text Similarity (TF-IDF): 25 points  
    - Experience: 20 points
    - Education: 10 points
    - Resume Quality: 5 points
    """
    breakdown = {}
    
    # 1. Skills Match Score (40 points)
    skills_score = calculate_skills_score(required_skills, found_skills)
    breakdown['skills_match'] = round(skills_score, 1)
    
    # 2. TF-IDF Similarity Score (25 points)
    similarity_score = calculate_similarity_score(text, job_description)
    breakdown['jd_similarity'] = round(similarity_score, 1)
    
    # 3. Experience Score (20 points)
    exp_score = calculate_experience_score(nlp_data.get('experience_years', 0), min_experience)
    breakdown['experience'] = round(exp_score, 1)
    
    # 4. Education Score (10 points)
    edu_score = calculate_education_score(nlp_data.get('education', ''))
    breakdown['education'] = round(edu_score, 1)
    
    # 5. Resume Quality Score (5 points)
    quality_score = calculate_quality_score(text, nlp_data)
    breakdown['resume_quality'] = round(quality_score, 1)
    
    # Total
    total = sum(breakdown.values())
    total = min(100, max(0, total))
    
    return {
        'total_score': round(total, 1),
        'breakdown': breakdown,
        'summary': generate_summary(breakdown, total, required_skills, found_skills, nlp_data),
        'recommendation': get_recommendation(total)
    }

def calculate_skills_score(required_skills, found_skills):
    """Score based on how many required skills are present."""
    if not required_skills:
        # If no required skills specified, give partial score based on skills found
        return min(30, len(found_skills) * 2)
    
    found_lower = [s.lower() for s in found_skills]
    matched = sum(1 for s in required_skills if s.lower() in found_lower)
    ratio = matched / len(required_skills)
    
    # Bonus for extra skills
    bonus = min(5, len(found_skills) * 0.2)
    return min(40, ratio * 35 + bonus)

def calculate_similarity_score(resume_text, job_description):
    """Calculate TF-IDF cosine similarity between resume and JD."""
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000
        )
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return similarity * 25
        
    except ImportError:
        # Fallback: simple keyword overlap
        return simple_text_similarity(resume_text, job_description) * 25

def simple_text_similarity(text1, text2):
    """Simple word overlap similarity as fallback."""
    words1 = set(re.findall(r'\b\w{3,}\b', text1.lower()))
    words2 = set(re.findall(r'\b\w{3,}\b', text2.lower()))
    
    # Remove common stop words
    stop_words = {'the', 'and', 'for', 'are', 'with', 'have', 'this', 'that', 'will', 'from'}
    words1 -= stop_words
    words2 -= stop_words
    
    if not words2:
        return 0
    
    intersection = words1 & words2
    return len(intersection) / len(words2)

def calculate_experience_score(candidate_years, required_years):
    """Score based on experience requirements."""
    if required_years == 0:
        # Any experience is fine; bonus for having some
        return min(20, candidate_years * 3)
    
    if candidate_years >= required_years:
        # Full score, with small bonus for exceeding
        bonus = min(3, (candidate_years - required_years) * 0.5)
        return min(20, 17 + bonus)
    else:
        ratio = candidate_years / required_years
        return ratio * 15

def calculate_education_score(education):
    """Score based on education level."""
    education_scores = {
        'PhD': 10,
        'Masters': 9,
        'Bachelors': 7,
        'Diploma': 5,
        'High School': 3,
        'Not specified': 4
    }
    return education_scores.get(education, 4)

def calculate_quality_score(text, nlp_data):
    """Score resume completeness and quality."""
    score = 0
    
    # Has email
    if nlp_data.get('email') != 'N/A':
        score += 1
    
    # Has phone
    if nlp_data.get('phone') != 'N/A':
        score += 1
    
    # Has multiple sections
    sections = nlp_data.get('sections', [])
    if len(sections) >= 3:
        score += 2
    elif len(sections) >= 1:
        score += 1
    
    # Has sufficient content
    word_count = len(text.split())
    if word_count > 300:
        score += 1
    
    return min(5, score)

def generate_summary(breakdown, total, required_skills, found_skills, nlp_data):
    """Generate a human-readable summary."""
    matched_required = [s for s in required_skills if s.lower() in [x.lower() for x in found_skills]]
    missing = [s for s in required_skills if s.lower() not in [x.lower() for x in found_skills]]
    
    summary = f"Overall Score: {total:.1f}/100. "
    
    if required_skills:
        summary += f"Matched {len(matched_required)}/{len(required_skills)} required skills. "
    
    if nlp_data.get('experience_years', 0) > 0:
        summary += f"{nlp_data['experience_years']} years of experience. "
    
    if nlp_data.get('education') and nlp_data['education'] != 'Not specified':
        summary += f"Education: {nlp_data['education']}. "
    
    if missing:
        summary += f"Missing skills: {', '.join(missing[:3])}{'...' if len(missing) > 3 else ''}."
    
    return summary.strip()

def get_recommendation(score):
    """Get hiring recommendation based on score."""
    if score >= 80:
        return "Strong Match - Highly Recommended"
    elif score >= 65:
        return "Good Match - Recommended for Interview"
    elif score >= 50:
        return "Partial Match - Consider for Interview"
    elif score >= 35:
        return "Weak Match - Review Carefully"
    else:
        return "Poor Match - Not Recommended"
