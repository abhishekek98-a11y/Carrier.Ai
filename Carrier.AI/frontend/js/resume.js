// frontend/js/resume.js
import { api } from './api.js';
import { showToast, createScoreGauge, createSkillTags } from './utils.js';

export function renderResumePage(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="font-heading text-3xl font-bold flex items-center gap-3">
                        <span class="icon-badge icon-badge-emerald">📄</span> Resume Analyzer
                    </h1>
                    <p class="text-gray-400 text-sm mt-1">Upload your resume for AI-powered ATS optimization and feedback</p>
                </div>
            </div>
            
            <div class="glass-card p-6 md:p-8" id="upload-section">
                <div id="upload-zone" class="upload-zone p-10 md:p-14 text-center group">
                    <div class="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        📁
                    </div>
                    <p class="text-lg font-bold text-white mb-1">Drag & drop your resume PDF</p>
                    <p class="text-xs text-gray-400 mb-6">Supports standard PDF resumes up to 10MB</p>
                    <input type="file" id="resume-file" accept=".pdf" class="hidden">
                    <button type="button" id="browse-btn" class="btn-secondary text-sm px-6 py-2.5 rounded-xl font-medium">Browse Computer</button>
                </div>

                <div id="file-info" class="hidden mt-5 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="icon-badge icon-badge-emerald">📄</div>
                        <div>
                            <p id="file-name" class="font-semibold text-sm text-white"></p>
                            <p id="file-size" class="text-xs text-gray-400"></p>
                        </div>
                    </div>
                    <button type="button" id="upload-btn" class="btn-primary text-sm px-6 py-2.5 rounded-xl font-semibold">
                        Analyze Resume
                    </button>
                </div>

                <div id="upload-progress" class="hidden mt-5 space-y-2">
                    <div class="progress-bar-container h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div id="progress-bar" class="progress-bar-fill h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300" style="width:0%"></div>
                    </div>
                    <p class="text-xs text-gray-400 text-center font-medium">Analyzing resume structure, ATS keywords, and skills...</p>
                </div>
            </div>

            <div id="analysis-results"></div>
        </div>
    `;

    const fileInput = document.getElementById('resume-file');
    const uploadZone = document.getElementById('upload-zone');
    const browseBtn = document.getElementById('browse-btn');
    const fileInfo = document.getElementById('file-info');

    browseBtn.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('click', (e) => { if (e.target === uploadZone || e.target.parentElement === uploadZone) fileInput.click(); });

    // Drag and drop events
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('drag-active'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-active'));
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-active');
        if (e.dataTransfer.files[0]) { fileInput.files = e.dataTransfer.files; handleFileSelect(e.dataTransfer.files[0]); }
    });

    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFileSelect(fileInput.files[0]); });

    function handleFileSelect(file) {
        if (!file.name.toLowerCase().endsWith('.pdf')) { showToast('Only PDF files are accepted', 'error'); return; }
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-size').textContent = `${(file.size / 1024).toFixed(1)} KB`;
        fileInfo.classList.remove('hidden');
    }

    document.getElementById('upload-btn')?.addEventListener('click', uploadResume);

    async function uploadResume() {
        const file = fileInput.files[0];
        if (!file) { showToast('Please select a file first', 'error'); return; }

        const btn = document.getElementById('upload-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Analyzing...';
        document.getElementById('upload-progress').classList.remove('hidden');

        const bar = document.getElementById('progress-bar');
        let w = 0;
        const progressTimer = setInterval(() => { if (w < 85) { w += Math.random() * 15; bar.style.width = w + '%'; } }, 300);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const data = await api.upload('/resume/upload', formData);
            clearInterval(progressTimer);
            bar.style.width = '100%';
            setTimeout(() => showAnalysisResults(data), 400);
            showToast('Resume analyzed successfully!', 'success');
        } catch {
            clearInterval(progressTimer);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Analyze Resume';
        }
    }

    // Load existing analysis
    loadExistingAnalysis();
}

async function loadExistingAnalysis() {
    try {
        const data = await api.get('/resume/analysis');
        if (data && data.filename) showAnalysisResults(data);
    } catch { /* no existing analysis */ }
}

function showAnalysisResults(data) {
    const ct = document.getElementById('analysis-results');
    ct.innerHTML = `
        <div class="space-y-6 animate-slideUp">
            <h2 class="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <span>📊</span> Comprehensive Analysis
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass-card p-6 flex flex-col items-center justify-center text-center">
                    ${createScoreGauge(Math.round(data.resume_score || 0), 'Overall Resume Quality', '140px')}
                </div>
                <div class="glass-card p-6 flex flex-col items-center justify-center text-center">
                    ${createScoreGauge(Math.round(data.ats_score || 0), 'ATS Compatibility', '140px')}
                </div>
            </div>

            <div class="glass-card p-6">
                <h3 class="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>💻</span> Identified Technical Skills
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${createSkillTags(data.extracted_skills || [], 'success')}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass-card p-6">
                    <h3 class="font-heading text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <span>✅</span> Key Strengths
                    </h3>
                    <ul class="space-y-2.5">
                        ${(data.strengths || []).map(s => `
                            <li class="flex items-start gap-2.5 text-sm text-gray-300">
                                <span class="text-emerald-400 font-bold mt-0.5">✓</span>
                                <span>${s}</span>
                            </li>
                        `).join('') || '<li class="text-gray-500 text-sm">No specific strengths documented.</li>'}
                    </ul>
                </div>
                <div class="glass-card p-6">
                    <h3 class="font-heading text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <span>⚠️</span> Areas for Growth
                    </h3>
                    <ul class="space-y-2.5">
                        ${(data.weaknesses || []).map(s => `
                            <li class="flex items-start gap-2.5 text-sm text-gray-300">
                                <span class="text-amber-400 font-bold mt-0.5">!</span>
                                <span>${s}</span>
                            </li>
                        `).join('') || '<li class="text-gray-500 text-sm">No weaknesses detected.</li>'}
                    </ul>
                </div>
            </div>

            ${(data.suggestions || []).length > 0 ? `
            <div class="glass-card p-6">
                <h3 class="font-heading text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <span>💡</span> Recommended Action Steps
                </h3>
                <ul class="space-y-2.5">
                    ${data.suggestions.map(s => `
                        <li class="flex items-start gap-2.5 text-sm text-gray-300">
                            <span class="text-blue-400 font-bold">→</span>
                            <span>${s}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>` : ''}
        </div>
    `;
}
