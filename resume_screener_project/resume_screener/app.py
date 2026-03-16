from flask import Flask, request, jsonify, render_template
import os
import json
from utils.resume_parser import extract_text_from_file
from utils.nlp_processor import process_resume
from utils.scorer import score_candidate
from utils.skill_extractor import extract_skills

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_resumes():
    job_description = request.form.get('job_description', '')
    required_skills = request.form.get('required_skills', '')
    experience_years = int(request.form.get('experience_years', 0))
    
    if not job_description:
        return jsonify({'error': 'Job description is required'}), 400
    
    files = request.files.getlist('resumes')
    if not files or len(files) == 0:
        return jsonify({'error': 'At least one resume is required'}), 400
    
    required_skills_list = [s.strip().lower() for s in required_skills.split(',') if s.strip()]
    
    results = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                # Extract text
                text = extract_text_from_file(filepath)
                
                # Process with NLP
                nlp_data = process_resume(text)
                
                # Extract skills
                found_skills = extract_skills(text, required_skills_list)
                
                # Score candidate
                score_data = score_candidate(
                    text=text,
                    nlp_data=nlp_data,
                    job_description=job_description,
                    required_skills=required_skills_list,
                    found_skills=found_skills,
                    min_experience=experience_years
                )
                
                results.append({
                    'filename': filename,
                    'name': nlp_data.get('name', filename.replace('.pdf','').replace('.docx','')),
                    'email': nlp_data.get('email', 'N/A'),
                    'phone': nlp_data.get('phone', 'N/A'),
                    'experience_years': nlp_data.get('experience_years', 0),
                    'education': nlp_data.get('education', 'N/A'),
                    'skills_found': found_skills,
                    'skills_missing': [s for s in required_skills_list if s not in [x.lower() for x in found_skills]],
                    'total_score': score_data['total_score'],
                    'score_breakdown': score_data['breakdown'],
                    'summary': score_data['summary'],
                    'recommendation': score_data['recommendation']
                })
                
                # Clean up uploaded file
                os.remove(filepath)
                
            except Exception as e:
                results.append({
                    'filename': filename,
                    'name': filename,
                    'error': str(e),
                    'total_score': 0,
                    'score_breakdown': {},
                    'skills_found': [],
                    'skills_missing': required_skills_list,
                    'recommendation': 'Error processing resume'
                })
    
    # Sort by score descending
    results.sort(key=lambda x: x.get('total_score', 0), reverse=True)
    
    # Add rank
    for i, r in enumerate(results):
        r['rank'] = i + 1
    
    return jsonify({
        'success': True,
        'total_candidates': len(results),
        'job_description_summary': job_description[:200] + '...' if len(job_description) > 200 else job_description,
        'required_skills': required_skills_list,
        'candidates': results
    })

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True, port=5000)
