// =============================================
//  RecruitAI — Frontend Application Logic
// =============================================

let selectedFiles = [];
let analysisResults = null;

// ── FILE HANDLING ─────────────────────────

function handleFileSelect(input) {
    const files = Array.from(input.files);
    files.forEach(file => {
        if (!selectedFiles.find(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    });
    renderFileList();
}

function renderFileList() {
    const container = document.getElementById('file-list');
    const countBar = document.getElementById('file-count-bar');
    const countText = document.getElementById('file-count-text');
    
    container.innerHTML = '';
    
    selectedFiles.forEach((file, idx) => {
        const ext = file.name.split('.').pop().toLowerCase();
        const size = (file.size / 1024).toFixed(0);
        
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <span class="file-name" title="${file.name}">${file.name}</span>
            <div style="display:flex;align-items:center;gap:8px">
                <span class="file-ext ext-${ext}">${ext.toUpperCase()}</span>
                <span style="font-size:11px;color:var(--text3)">${size}KB</span>
                <button class="file-remove" onclick="removeFile(${idx})" title="Remove">✕</button>
            </div>
        `;
        container.appendChild(item);
    });
    
    if (selectedFiles.length > 0) {
        countBar.style.display = 'flex';
        countText.textContent = `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`;
    } else {
        countBar.style.display = 'none';
    }
}

function removeFile(idx) {
    selectedFiles.splice(idx, 1);
    renderFileList();
}

function clearFiles() {
    selectedFiles = [];
    document.getElementById('resume-files').value = '';
    renderFileList();
}

// ── DRAG & DROP ───────────────────────────

const uploadZone = document.getElementById('upload-zone');

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => 
        ['pdf','docx','txt'].includes(f.name.split('.').pop().toLowerCase())
    );
    files.forEach(file => {
        if (!selectedFiles.find(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    });
    renderFileList();
});

// ── JOB PRESETS ───────────────────────────

const PRESETS = {
    fullstack: {
        description: `We are looking for an experienced Full Stack Developer to join our engineering team. 

Key Responsibilities:
- Build and maintain scalable web applications using React and Node.js
- Design and implement RESTful APIs and microservices
- Work with SQL and NoSQL databases (MySQL, MongoDB)
- Deploy and manage applications on AWS/GCP cloud platforms
- Collaborate with UI/UX designers and backend engineers
- Participate in code reviews and agile ceremonies

Requirements:
- 3+ years of full stack development experience
- Strong proficiency in JavaScript/TypeScript, React, Node.js
- Experience with databases: MySQL, MongoDB, Redis
- Cloud experience with AWS or GCP
- Familiarity with Docker and CI/CD pipelines
- Bachelor's degree in Computer Science or related field`,
        skills: 'javascript, react, node.js, python, mysql, mongodb, docker, aws, git, html, css, restful api',
        experience: 3
    },
    datascience: {
        description: `We are hiring a Data Scientist to help us turn data into actionable business insights.

Key Responsibilities:
- Develop machine learning models for prediction and classification
- Perform exploratory data analysis and feature engineering
- Build NLP pipelines for text classification and analysis
- Create data visualizations and dashboards
- Collaborate with engineering teams to deploy models to production

Requirements:
- 2+ years experience in data science or machine learning
- Proficiency in Python, pandas, scikit-learn, TensorFlow or PyTorch
- Strong understanding of statistical modeling and ML algorithms
- Experience with NLP, deep learning, and neural networks
- Familiarity with SQL, Jupyter notebooks, and data visualization tools
- Masters or PhD in a quantitative field preferred`,
        skills: 'python, machine learning, deep learning, tensorflow, pytorch, nlp, pandas, numpy, scikit-learn, sql, data science',
        experience: 2
    },
    devops: {
        description: `We are looking for a DevOps Engineer to enhance our deployment pipelines and infrastructure.

Key Responsibilities:
- Design and maintain CI/CD pipelines using Jenkins and GitHub Actions
- Manage container orchestration with Kubernetes and Docker
- Provision and maintain cloud infrastructure on AWS using Terraform
- Monitor system performance and implement automated alerting
- Ensure security, availability, and scalability of production systems

Requirements:
- 3+ years of DevOps or Site Reliability Engineering experience
- Strong expertise in Docker, Kubernetes, and container ecosystems
- Hands-on experience with AWS services (EC2, S3, Lambda, EKS)
- Proficiency in Terraform, Ansible, or other IaC tools
- Experience with Linux system administration and shell scripting
- Knowledge of CI/CD best practices and Git workflows`,
        skills: 'docker, kubernetes, aws, terraform, jenkins, linux, bash, git, python, ansible, ci/cd',
        experience: 3
    }
};

function loadPreset(type) {
    const preset = PRESETS[type];
    document.getElementById('job_description').value = preset.description;
    document.getElementById('required_skills').value = preset.skills;
    document.getElementById('experience_years').value = preset.experience;
}

// ── DEMO MODE ─────────────────────────────

const DEMO_RESUMES = [
    {
        name: "sarah_johnson_resume.pdf",
        content: `Sarah Johnson
Email: sarah.johnson@email.com | Phone: +1-555-0101
LinkedIn: linkedin.com/in/sarahjohnson

SUMMARY
Experienced Full Stack Developer with 5 years building web applications. 
Expertise in React, Node.js, Python, and cloud technologies.

EXPERIENCE
Senior Software Engineer — TechCorp Inc. (2021–Present)
- Led development of React-based dashboard serving 100K+ users
- Built RESTful APIs using Node.js and Express
- Managed MySQL and MongoDB databases
- Deployed microservices on AWS using Docker and Kubernetes

Software Developer — StartupXYZ (2019–2021)
- Developed full-stack features using React, Node.js, Python
- Implemented CI/CD pipelines with Jenkins and GitHub Actions
- Used Git for version control and code collaboration

EDUCATION
Bachelor of Science in Computer Science — State University, 2019

SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frontend: React, HTML, CSS, Bootstrap
Backend: Node.js, Express, Django, Flask, RESTful API
Databases: MySQL, MongoDB, Redis, PostgreSQL
Cloud/DevOps: AWS, Docker, Kubernetes, Git, CI/CD, Jenkins
Methodologies: Agile, Scrum, TDD`
    },
    {
        name: "michael_chen_resume.docx",
        content: `Michael Chen
michael.chen@gmail.com | 555-0202 | GitHub: github.com/mchen

OBJECTIVE
Full Stack Developer with 2 years of experience seeking new opportunities.

WORK EXPERIENCE
Junior Developer — WebSolutions Co. (2022–Present)
- Built React components and Node.js microservices
- Used MySQL for data storage and Redis for caching
- Worked with Docker for containerization
- Participated in agile sprints

Intern — CodeCraft Agency (2021–2022)
- Assisted in HTML, CSS, and JavaScript development
- Learned Git version control and RESTful APIs

EDUCATION
B.Tech in Information Technology — Tech Institute, 2021

SKILLS
JavaScript, React, Node.js, HTML, CSS
MySQL, MongoDB, Git, Docker
Python (basic), AWS (basic), Agile`
    },
    {
        name: "priya_patel_resume.pdf",
        content: `Priya Patel
priya.patel@techmail.com | +91-9876543210

PROFESSIONAL SUMMARY
Data Scientist and Backend Developer with 4 years of experience.
Strong background in Python, machine learning, and SQL databases.

EXPERIENCE
Data Science Engineer — Analytics Corp (2020–Present)
- Developed ML models using scikit-learn, TensorFlow, PyTorch
- Built NLP pipelines for text classification
- Created Python Flask APIs for model serving
- Used pandas, numpy for data analysis
- Maintained PostgreSQL and MongoDB databases

Junior Developer — DataTech (2019–2020)
- Python scripting and automation
- SQL database management
- Statistical analysis with R and Python

EDUCATION
M.Sc. Computer Science — Premier University, 2019
B.Sc. Mathematics — State College, 2017

SKILLS
Python, R, SQL, JavaScript
Machine Learning, Deep Learning, NLP, TensorFlow, PyTorch, scikit-learn
pandas, numpy, matplotlib, seaborn
Flask, Django, REST API
MySQL, PostgreSQL, MongoDB
Docker, Git, Linux, AWS`
    },
    {
        name: "alex_rodriguez_resume.txt",
        content: `Alex Rodriguez
Email: alex.rodriguez@email.com
Phone: 555-0303

EXPERIENCE
DevOps Engineer - CloudOps Inc (2020-Present) - 3 years
  AWS infrastructure management, Terraform, Kubernetes
  Docker container orchestration, Jenkins CI/CD pipelines
  Linux system administration, bash scripting
  Monitoring with Prometheus and Grafana
  Git version control and GitHub Actions

System Admin - IT Services (2018-2020)
  Linux/Windows server management
  Basic Python automation scripts
  Network configuration

EDUCATION
  Bachelor in Computer Engineering - 2018

TECHNICAL SKILLS
AWS, Azure, Docker, Kubernetes, Terraform, Ansible
Jenkins, Git, CI/CD, Linux, Bash, Python
MySQL, PostgreSQL
Agile, Scrum`
    },
    {
        name: "emily_wang_resume.pdf",
        content: `Emily Wang | emily.wang@outlook.com | (555) 404-0404

About Me
Fresh graduate passionate about web development. 
Completed several personal projects using React and Node.

Projects
E-commerce Website: React frontend, Node.js backend, MongoDB database
Portfolio Site: HTML, CSS, JavaScript, deployed on Netlify
Todo App: React, Firebase

Education
Bachelor of Computer Science - City University, 2023 (GPA: 3.8)

Skills
JavaScript, React, HTML, CSS, Node.js
MongoDB, Firebase
Git, GitHub
Basic Python, basic SQL`
    }
];

function runDemo() {
    // Load full stack preset
    loadPreset('fullstack');
    
    // Create fake File objects from demo data
    selectedFiles = DEMO_RESUMES.map(resume => {
        const blob = new Blob([resume.content], { type: 'text/plain' });
        return new File([blob], resume.name, { type: 'text/plain' });
    });
    
    renderFileList();
    
    // Small delay then analyze
    setTimeout(() => {
        analyzeResumes(true);
    }, 300);
}

// ── ANALYSIS ─────────────────────────────

async function analyzeResumes(isDemoMode = false) {
    const jobDescription = document.getElementById('job_description').value.trim();
    const requiredSkills = document.getElementById('required_skills').value.trim();
    const experienceYears = document.getElementById('experience_years').value;
    
    if (!jobDescription) {
        showToast('Please enter a job description', 'error');
        return;
    }
    
    if (selectedFiles.length === 0) {
        showToast('Please upload at least one resume', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        if (isDemoMode) {
            // Simulate API call with demo data
            await new Promise(r => setTimeout(r, 2800));
            const demoResults = generateDemoResults(jobDescription, requiredSkills, experienceYears);
            hideLoading();
            displayResults(demoResults);
        } else {
            // Real API call
            const formData = new FormData();
            formData.append('job_description', jobDescription);
            formData.append('required_skills', requiredSkills);
            formData.append('experience_years', experienceYears);
            
            selectedFiles.forEach(file => {
                formData.append('resumes', file);
            });
            
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error');
            }
            
            const data = await response.json();
            hideLoading();
            displayResults(data);
        }
    } catch (error) {
        hideLoading();
        showToast(`Error: ${error.message}`, 'error');
    }
}

function generateDemoResults(jobDesc, skillsInput, minExp) {
    const requiredSkills = skillsInput.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const minExperience = parseInt(minExp) || 0;
    
    const candidateProfiles = [
        {
            filename: 'sarah_johnson_resume.pdf',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1-555-0101',
            experience_years: 5,
            education: 'Bachelors',
            all_skills: ['javascript', 'react', 'node.js', 'python', 'mysql', 'mongodb', 'docker', 'aws', 'kubernetes', 'git', 'html', 'css', 'restful api', 'ci/cd', 'jenkins', 'typescript'],
            base_similarity: 0.88
        },
        {
            filename: 'priya_patel_resume.pdf',
            name: 'Priya Patel',
            email: 'priya.patel@techmail.com',
            phone: '+91-9876543210',
            experience_years: 4,
            education: 'Masters',
            all_skills: ['python', 'machine learning', 'sql', 'mongodb', 'flask', 'docker', 'git', 'aws', 'javascript', 'mysql', 'nlp', 'tensorflow'],
            base_similarity: 0.74
        },
        {
            filename: 'alex_rodriguez_resume.txt',
            name: 'Alex Rodriguez',
            email: 'alex.rodriguez@email.com',
            phone: '555-0303',
            experience_years: 3,
            education: 'Bachelors',
            all_skills: ['aws', 'docker', 'kubernetes', 'terraform', 'jenkins', 'linux', 'bash', 'python', 'mysql', 'git', 'ci/cd'],
            base_similarity: 0.65
        },
        {
            filename: 'michael_chen_resume.docx',
            name: 'Michael Chen',
            email: 'michael.chen@gmail.com',
            phone: '555-0202',
            experience_years: 2,
            education: 'Bachelors',
            all_skills: ['javascript', 'react', 'node.js', 'mysql', 'mongodb', 'docker', 'git', 'html', 'css', 'python'],
            base_similarity: 0.71
        },
        {
            filename: 'emily_wang_resume.pdf',
            name: 'Emily Wang',
            email: 'emily.wang@outlook.com',
            phone: '(555) 404-0404',
            experience_years: 0,
            education: 'Bachelors',
            all_skills: ['javascript', 'react', 'node.js', 'html', 'css', 'mongodb', 'git'],
            base_similarity: 0.45
        }
    ];
    
    const results = candidateProfiles.map(c => {
        const foundSkills = requiredSkills.length > 0
            ? requiredSkills.filter(s => c.all_skills.includes(s.toLowerCase()))
            : c.all_skills.slice(0, 8);
        
        const missingSkills = requiredSkills.filter(s => !c.all_skills.includes(s.toLowerCase()));
        const extraSkills = c.all_skills.filter(s => !requiredSkills.includes(s)).slice(0, 6);
        
        const skillRatio = requiredSkills.length > 0 ? foundSkills.length / requiredSkills.length : 0.7;
        const skillsScore = Math.min(40, skillRatio * 35 + Math.min(5, c.all_skills.length * 0.2));
        const similarityScore = c.base_similarity * 25;
        const expScore = c.experience_years >= minExperience
            ? Math.min(20, 17 + Math.min(3, (c.experience_years - minExperience) * 0.5))
            : (c.experience_years / Math.max(1, minExperience)) * 15;
        const eduScores = {'PhD': 10, 'Masters': 9, 'Bachelors': 7, 'Diploma': 5, 'Not specified': 4};
        const eduScore = eduScores[c.education] || 4;
        const qualityScore = 4.5;
        
        const totalScore = Math.min(100, skillsScore + similarityScore + expScore + eduScore + qualityScore);
        
        let recommendation, recClass;
        if (totalScore >= 80) { recommendation = 'Strong Match - Highly Recommended'; recClass = 'rec-strong'; }
        else if (totalScore >= 65) { recommendation = 'Good Match - Recommended for Interview'; recClass = 'rec-good'; }
        else if (totalScore >= 50) { recommendation = 'Partial Match - Consider for Interview'; recClass = 'rec-partial'; }
        else { recommendation = 'Weak Match - Review Carefully'; recClass = 'rec-weak'; }
        
        return {
            filename: c.filename,
            name: c.name,
            email: c.email,
            phone: c.phone,
            experience_years: c.experience_years,
            education: c.education,
            skills_found: foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            skills_extra: extraSkills,
            skills_missing: missingSkills,
            total_score: Math.round(totalScore * 10) / 10,
            score_breakdown: {
                skills_match: Math.round(skillsScore * 10) / 10,
                jd_similarity: Math.round(similarityScore * 10) / 10,
                experience: Math.round(expScore * 10) / 10,
                education: eduScore,
                resume_quality: qualityScore
            },
            recommendation,
            recClass,
            summary: `Score: ${totalScore.toFixed(1)}/100. Matched ${foundSkills.length}/${Math.max(requiredSkills.length, 1)} skills. ${c.experience_years} years experience. Education: ${c.education}.`
        };
    });
    
    results.sort((a, b) => b.total_score - a.total_score);
    results.forEach((r, i) => r.rank = i + 1);
    
    return {
        success: true,
        total_candidates: results.length,
        required_skills: requiredSkills,
        job_description_summary: jobDesc.substring(0, 200) + '...',
        candidates: results
    };
}

// ── DISPLAY RESULTS ───────────────────────

function displayResults(data) {
    analysisResults = data;
    const section = document.getElementById('results-section');
    section.style.display = 'block';
    
    // Metadata
    document.getElementById('results-meta').textContent = 
        `${data.total_candidates} candidate${data.total_candidates !== 1 ? 's' : ''} analyzed · Required: ${data.required_skills.join(', ') || 'Not specified'}`;
    
    // Summary cards
    const candidates = data.candidates;
    const avgScore = candidates.reduce((s, c) => s + c.total_score, 0) / candidates.length;
    const topScore = candidates[0]?.total_score || 0;
    const strongMatches = candidates.filter(c => c.total_score >= 65).length;
    
    document.getElementById('summary-cards').innerHTML = `
        <div class="summary-card">
            <div class="sc-label">Total Candidates</div>
            <div class="sc-value">${candidates.length}</div>
            <div class="sc-sub">Analyzed & ranked</div>
        </div>
        <div class="summary-card">
            <div class="sc-label">Average Score</div>
            <div class="sc-value" style="color:${getScoreColor(avgScore)}">${avgScore.toFixed(1)}</div>
            <div class="sc-sub">Out of 100</div>
        </div>
        <div class="summary-card">
            <div class="sc-label">Top Score</div>
            <div class="sc-value" style="color:${getScoreColor(topScore)}">${topScore}</div>
            <div class="sc-sub">${candidates[0]?.name || ''}</div>
        </div>
        <div class="summary-card">
            <div class="sc-label">Recommended</div>
            <div class="sc-value" style="color:var(--green)">${strongMatches}</div>
            <div class="sc-sub">Score ≥ 65</div>
        </div>
    `;
    
    // Update stat counter
    const prevCount = parseInt(document.getElementById('stat-processed').textContent) || 0;
    document.getElementById('stat-processed').textContent = prevCount + candidates.length;
    
    // Candidate cards
    const grid = document.getElementById('candidates-grid');
    grid.innerHTML = '';
    
    candidates.forEach((c, i) => {
        const card = createCandidateCard(c, i);
        card.style.animationDelay = `${i * 0.08}s`;
        grid.appendChild(card);
    });
    
    // Chart
    renderChart(candidates);
    
    // Scroll to results
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createCandidateCard(c, idx) {
    const card = document.createElement('div');
    card.className = `candidate-card${idx === 0 ? ' top-1' : ''}`;
    
    const rankClass = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : '';
    const rankLabel = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${c.rank}`;
    const scoreColor = getScoreColor(c.total_score);
    
    const recClass = getRecClass(c.total_score);
    
    const breakdown = c.score_breakdown || {};
    const maxes = { skills_match: 40, jd_similarity: 25, experience: 20, education: 10, resume_quality: 5 };
    
    const breakdownHTML = Object.entries(breakdown).map(([key, val]) => {
        const max = maxes[key] || 10;
        const pct = Math.min(100, (val / max) * 100);
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const color = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--yellow)' : 'var(--red)';
        return `
            <div class="breakdown-item">
                <div class="bi-label">${label}</div>
                <div class="bi-bar"><div class="bi-fill" style="width:${pct}%;background:${color}"></div></div>
                <div class="bi-value">${val}/${max}</div>
            </div>
        `;
    }).join('');
    
    const foundSkillsHTML = (c.skills_found || []).slice(0, 8).map(s =>
        `<span class="skill-tag found">${s}</span>`
    ).join('');
    
    const missingSkillsHTML = (c.skills_missing || []).slice(0, 5).map(s =>
        `<span class="skill-tag missing">✗ ${s}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="card-top">
            <div class="card-left">
                <div class="rank-badge ${rankClass}">${rankLabel}</div>
                <div>
                    <div class="candidate-name">${escapeHTML(c.name)}</div>
                    <div class="candidate-meta">
                        ${c.email !== 'N/A' ? `<span class="meta-item">✉ ${escapeHTML(c.email)}</span>` : ''}
                        ${c.experience_years > 0 ? `<span class="meta-item">⏱ ${c.experience_years}yr exp</span>` : ''}
                        ${c.education && c.education !== 'Not specified' ? `<span class="meta-item">🎓 ${c.education}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="card-right">
                <div class="score-display" style="color:${scoreColor}">${c.total_score}</div>
                <div class="score-label">/ 100</div>
                <div class="recommendation-tag ${recClass}">${c.recommendation}</div>
            </div>
        </div>
        
        <div class="score-breakdown">
            <div class="breakdown-grid">${breakdownHTML}</div>
        </div>
        
        ${foundSkillsHTML || missingSkillsHTML ? `
        <div class="skills-section">
            ${foundSkillsHTML ? `
            <div class="skills-row">
                <span class="skills-row-label">Matched</span>
                ${foundSkillsHTML}
                ${(c.skills_found||[]).length > 8 ? `<span class="skill-tag extra">+${c.skills_found.length - 8} more</span>` : ''}
            </div>` : ''}
            ${missingSkillsHTML ? `
            <div class="skills-row">
                <span class="skills-row-label">Missing</span>
                ${missingSkillsHTML}
            </div>` : ''}
        </div>` : ''}
        
        ${c.summary ? `<div class="candidate-summary">💡 ${escapeHTML(c.summary)}</div>` : ''}
    `;
    
    return card;
}

function renderChart(candidates) {
    const container = document.getElementById('chart-container');
    container.innerHTML = '';
    
    candidates.forEach((c, i) => {
        const pct = c.total_score;
        const color = getScoreColor(c.total_score);
        const item = document.createElement('div');
        item.className = 'chart-bar-item';
        item.innerHTML = `
            <div class="chart-name">${escapeHTML(c.name)}</div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width:0%;background:${color}" data-width="${pct}%">
                    <span class="chart-score-label">${c.total_score}</span>
                </div>
            </div>
            <div class="chart-total-label">/ 100</div>
        `;
        container.appendChild(item);
    });
    
    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('.chart-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    }, 200);
}

// ── EXPORT CSV ────────────────────────────

function exportResults() {
    if (!analysisResults) return;
    
    const headers = ['Rank', 'Name', 'Email', 'Phone', 'Experience (yrs)', 'Education', 'Total Score', 'Skills Match', 'JD Similarity', 'Experience Score', 'Education Score', 'Skills Found', 'Skills Missing', 'Recommendation'];
    
    const rows = analysisResults.candidates.map(c => [
        c.rank,
        c.name,
        c.email,
        c.phone,
        c.experience_years,
        c.education,
        c.total_score,
        c.score_breakdown?.skills_match || '',
        c.score_breakdown?.jd_similarity || '',
        c.score_breakdown?.experience || '',
        c.score_breakdown?.education || '',
        (c.skills_found || []).join('; '),
        (c.skills_missing || []).join('; '),
        c.recommendation
    ]);
    
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recruitai_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Results exported as CSV!', 'success');
}

function resetForm() {
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('job_description').value = '';
    document.getElementById('required_skills').value = '';
    document.getElementById('experience_years').value = '0';
    clearFiles();
    analysisResults = null;
    document.getElementById('main-form').scrollIntoView({ behavior: 'smooth' });
}

// ── LOADING ───────────────────────────────

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('analyze-btn').disabled = true;
    
    // Animate steps
    const steps = ['ls-1', 'ls-2', 'ls-3', 'ls-4'];
    let current = 0;
    
    const interval = setInterval(() => {
        if (current > 0) {
            document.getElementById(steps[current - 1]).className = 'ls-step done';
            document.getElementById(steps[current - 1]).innerHTML = 
                '✓ ' + document.getElementById(steps[current - 1]).textContent;
        }
        if (current < steps.length) {
            document.getElementById(steps[current]).className = 'ls-step active';
            current++;
        } else {
            clearInterval(interval);
        }
    }, 600);
    
    document.getElementById('loading-overlay')._interval = interval;
}

function hideLoading() {
    clearInterval(document.getElementById('loading-overlay')._interval);
    document.getElementById('loading-overlay').style.display = 'none';
    document.getElementById('analyze-btn').disabled = false;
    
    // Reset steps
    ['ls-1','ls-2','ls-3','ls-4'].forEach(id => {
        const el = document.getElementById(id);
        el.className = 'ls-step';
    });
    document.getElementById('ls-1').textContent = '📄 Extracting text from files';
    document.getElementById('ls-2').textContent = '🧠 Running NLP processing';
    document.getElementById('ls-3').textContent = '🎯 Matching skills & computing TF-IDF';
    document.getElementById('ls-4').textContent = '🏆 Ranking candidates';
}

// ── TOAST ─────────────────────────────────

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        padding: 14px 20px; border-radius: 10px; font-size: 14px;
        font-family: 'DM Sans', sans-serif; font-weight: 500;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'};
        border: 1px solid ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'};
        color: ${type === 'error' ? '#f87171' : '#4ade80'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ── HELPERS ───────────────────────────────

function getScoreColor(score) {
    if (score >= 80) return '#22c55e';
    if (score >= 65) return '#84cc16';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
}

function getRecClass(score) {
    if (score >= 80) return 'rec-strong';
    if (score >= 65) return 'rec-good';
    if (score >= 50) return 'rec-partial';
    return 'rec-weak';
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
