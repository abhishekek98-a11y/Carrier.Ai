// frontend/js/resume.js
import { api } from './api.js';
import { showToast, createScoreGauge, createSkillTags } from './utils.js';

export function renderResumePage(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto animate-fadeIn">
            <h1 class="font-heading text-3xl font-bold mb-6 flex items-center gap-3">📄 Resume Analyzer</h1>
            
            <div class="glass-card p-8 mb-6" id="upload-section">
                <div id="upload-zone" class="upload-zone p-12 text-center">
                    <div class="text-5xl mb-4">📁</div>
                    <p class="text-lg font-medium mb-2">Drag & drop your resume (PDF)</p>
                    <p class="text-sm text-gray-400 mb-4">or click to browse</p>
                    <input type="file" id="resume-file" accept=".pdf" class="hidden">
                    <button type="button" id="browse-btn" class="btn-secondary text-sm px-6 py-2">Browse Files</button>
                </div>
                <div id="file-info" class="hidden mt-4 flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">📄</span>
                        <div>
                            <p id="file-name" class="font-medium text-sm"></p>
                            <p id="file-size" class="text-xs text-gray-400"></p>
                        </div>
                    </div>
                    <button type="button" id="upload-btn" class="btn-primary text-sm px-6 py-2">Analyze Resume</button>
                </div>
                <div id="upload-progress" class="hidden mt-4">
                    <div class="progress-bar-container h-2">
                        <div id="progress-bar" class="progress-bar-fill h-2" style="width:0%"></div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2 text-center">Analyzing your resume with AI...</p>
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

    // Drag and drop
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
        btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>';
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
            setTimeout(() => showAnalysisResults(data), 500);
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
        <div class="animate-slideUp">
            <h2 class="font-heading text-2xl font-bold mb-4 flex items-center gap-2">📊 Analysis Results</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="glass-card p-6 flex justify-center">
                    ${createScoreGauge(Math.round(data.resume_score || 0), 'Resume Score', '140px')}
                </div>
                <div class="glass-card p-6 flex justify-center">
                    ${createScoreGauge(Math.round(data.ats_score || 0), 'ATS Score', '140px')}
                </div>
            </div>

            <div class="glass-card p-6 mb-6">
                <h3 class="font-heading text-lg font-semibold mb-3">💻 Extracted Skills</h3>
                <div class="flex flex-wrap gap-2">
                    ${createSkillTags(data.extracted_skills || [], 'success')}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="glass-card p-6">
                    <h3 class="font-heading text-lg font-semibold mb-3">✅ Strengths</h3>
                    <ul class="space-y-2">
                        ${(data.strengths || []).map(s => `<li class="flex items-start gap-2 text-sm text-gray-300"><span class="text-green-400 mt-0.5">✓</span>${s}</li>`).join('') || '<li class="text-gray-500 text-sm">Upload a resume to see strengths</li>'}
                    </ul>
                </div>
                <div class="glass-card p-6">
                    <h3 class="font-heading text-lg font-semibold mb-3">⚠️ Areas for Improvement</h3>
                    <ul class="space-y-2">
                        ${(data.weaknesses || []).map(s => `<li class="flex items-start gap-2 text-sm text-gray-300"><span class="text-yellow-400 mt-0.5">!</span>${s}</li>`).join('') || '<li class="text-gray-500 text-sm">No issues found</li>'}
                    </ul>
                </div>
            </div>

            ${(data.suggestions || []).length > 0 ? `
            <div class="glass-card p-6">
                <h3 class="font-heading text-lg font-semibold mb-3">💡 Suggestions</h3>
                <ul class="space-y-2">
                    ${data.suggestions.map(s => `<li class="flex items-start gap-2 text-sm text-gray-300"><span class="text-blue-400">→</span>${s}</li>`).join('')}
                </ul>
            </div>` : ''}
        </div>
    `;
}
