"""
Skill Extractor - Identifies technical and soft skills from resume text
Uses keyword matching + optional spaCy NLP
"""

# Comprehensive skills database
TECH_SKILLS_DB = {
    # Programming Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust',
    'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'shell',
    
    # Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'nodejs', 'express',
    'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'jquery', 'bootstrap',
    'tailwind', 'webpack', 'graphql', 'rest api', 'restful', 'soap',
    
    # Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
    'cassandra', 'elasticsearch', 'dynamodb', 'firebase', 'sql', 'nosql',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins',
    'git', 'github', 'gitlab', 'ci/cd', 'terraform', 'ansible', 'linux', 'unix',
    'nginx', 'apache', 'heroku', 'vercel',
    
    # Data Science & ML
    'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'keras',
    'scikit-learn', 'sklearn', 'pandas', 'numpy', 'matplotlib', 'seaborn',
    'data analysis', 'data science', 'computer vision', 'neural network',
    'natural language processing', 'bert', 'gpt', 'transformers',
    
    # Tools & Methodologies
    'agile', 'scrum', 'jira', 'confluence', 'figma', 'photoshop', 'tableau',
    'power bi', 'excel', 'microservices', 'mvc', 'oop', 'tdd', 'unit testing',
    
    # Soft Skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'project management', 'time management', 'collaboration', 'critical thinking'
}

def extract_skills(text, required_skills=None):
    """
    Extract skills from resume text.
    Returns list of found skills (prioritizing required skills).
    """
    text_lower = text.lower()
    found_skills = []
    
    # Check required skills first
    if required_skills:
        for skill in required_skills:
            skill_lower = skill.lower()
            if skill_lower in text_lower:
                if skill not in found_skills:
                    found_skills.append(skill)
    
    # Check skills database
    for skill in TECH_SKILLS_DB:
        if skill in text_lower:
            # Avoid duplicates (case-insensitive)
            if skill not in [s.lower() for s in found_skills]:
                found_skills.append(skill.title() if len(skill) > 3 else skill.upper())
    
    # Try spaCy for additional extraction
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text[:3000])
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
                if token.text.lower() in TECH_SKILLS_DB:
                    skill_text = token.text
                    if skill_text.lower() not in [s.lower() for s in found_skills]:
                        found_skills.append(skill_text)
    except Exception:
        pass
    
    return found_skills[:30]  # Return top 30 skills

def get_skill_categories(skills):
    """Categorize skills into groups."""
    categories = {
        'Programming Languages': [],
        'Web Technologies': [],
        'Databases': [],
        'Cloud & DevOps': [],
        'Data Science & ML': [],
        'Soft Skills': [],
        'Other': []
    }
    
    programming = {'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'r', 'scala'}
    web = {'html', 'css', 'react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring'}
    databases = {'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'sql', 'nosql', 'elasticsearch'}
    cloud = {'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'linux', 'ci/cd', 'terraform'}
    ds_ml = {'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'data science'}
    soft = {'leadership', 'communication', 'teamwork', 'agile', 'scrum', 'project management'}
    
    for skill in skills:
        sl = skill.lower()
        if sl in programming:
            categories['Programming Languages'].append(skill)
        elif sl in web:
            categories['Web Technologies'].append(skill)
        elif sl in databases:
            categories['Databases'].append(skill)
        elif sl in cloud:
            categories['Cloud & DevOps'].append(skill)
        elif sl in ds_ml:
            categories['Data Science & ML'].append(skill)
        elif sl in soft:
            categories['Soft Skills'].append(skill)
        else:
            categories['Other'].append(skill)
    
    return {k: v for k, v in categories.items() if v}
