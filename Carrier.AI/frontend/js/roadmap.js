// frontend/js/roadmap.js
import { api } from './api.js';
import { showToast, createSkillTags } from './utils.js';

const CAREERS = [
    "AI/ML Engineer","Data Scientist","Full Stack Developer","Backend Developer",
    "Frontend Developer","DevOps Engineer","Cybersecurity Analyst","Cloud Architect",
    "Mobile App Developer","Data Analyst","Blockchain Developer","Game Developer",
    "UI/UX Designer","Database Administrator","IoT Engineer"
];

export function renderRoadmapPage(container) {
    const hash = window.location.hash;
    const match = hash.match(/career=([^&]+)/);
    const preselected = match ? decodeURIComponent(match[1]) : '';

    container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="font-heading text-3xl font-bold flex items-center gap-3">
                        <span class="icon-badge icon-badge-amber">🗺️</span> Learning Roadmap
                    </h1>
                    <p class="text-gray-400 text-sm mt-1">Structured, step-by-step learning paths generated for your career goals</p>
                </div>
            </div>

            <div class="glass-card p-6 md:p-8">
                <div class="flex flex-col sm:flex-row gap-4">
                    <select id="roadmap-career" class="flex-1 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium">
                        <option value="">Select a targeted career path...</option>
                        ${CAREERS.map(c => `<option value="${c}" ${c === preselected ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                    <button id="gen-roadmap-btn" class="btn-primary px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 whitespace-nowrap" onclick="window.generateRoadmap()">
                        🚀 Generate Roadmap
                    </button>
                </div>
            </div>

            <div id="roadmap-content"></div>
        </div>
    `;

    window.generateRoadmap = generateRoadmap;
    if (preselected) generateRoadmap();
}

async function generateRoadmap() {
    const career = document.getElementById('roadmap-career').value;
    if (!career) { showToast('Please select a career', 'error'); return; }

    const ct = document.getElementById('roadmap-content');
    const btn = document.getElementById('gen-roadmap-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Generating...';

    ct.innerHTML = `<div class="space-y-4">${Array(4).fill('<div class="glass-card p-6 h-36 shimmer rounded-2xl"></div>').join('')}</div>`;

    try {
        const data = await api.post('/roadmap/generate', { career });
        renderRoadmap(data);
    } catch {
        ct.innerHTML = '<div class="glass-card p-10 text-center text-gray-400 font-medium">Failed to generate roadmap. Please try again.</div>';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🚀 Generate Roadmap';
    }
}

function renderRoadmap(data) {
    const ct = document.getElementById('roadmap-content');
    if (!data || !data.steps || data.steps.length === 0) {
        ct.innerHTML = '<div class="glass-card p-10 text-center text-gray-400">No roadmap data available for this career.</div>';
        return;
    }

    ct.innerHTML = `
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 glass-card rounded-2xl border border-white/10">
            <h2 class="font-heading text-xl font-bold text-white flex items-center gap-2">
                <span>📍</span> Path to ${data.career}
            </h2>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                ⏱️ Total Duration: ${data.total_duration}
            </span>
        </div>

        <div class="roadmap-timeline pl-6 md:pl-0">
            ${data.steps.map((step, i) => `
                <div class="roadmap-step animate-fadeIn" style="animation-delay: ${i * 0.1}s">
                    <div class="step-marker text-xs font-bold text-blue-400 shadow-md shadow-blue-500/20">${step.step_number}</div>
                    <div class="ml-10 md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}">
                        <div class="glass-card p-6 glass-card-hover border border-white/10">
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <h3 class="font-heading font-bold text-lg text-white">${step.title}</h3>
                                <span class="text-xs bg-blue-500/10 text-blue-400 font-semibold px-2.5 py-1 rounded-full border border-blue-500/20 whitespace-nowrap">${step.duration}</span>
                            </div>
                            <p class="text-xs text-gray-300 leading-relaxed mb-4">${step.description}</p>
                            
                            ${(step.skills_gained || []).length > 0 ? `
                            <div class="mb-4">
                                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Skills Acquired:</p>
                                <div class="flex flex-wrap gap-1">${createSkillTags(step.skills_gained, 'success')}</div>
                            </div>` : ''}

                            ${(step.resources || []).length > 0 ? `
                            <div class="pt-3 border-t border-white/5">
                                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommended Resources:</p>
                                <div class="space-y-1.5">
                                    ${step.resources.map(r => {
                                        const icon = r.type === 'Course' ? '🎥' : r.type === 'Documentation' ? '📚' : r.type === 'Interactive' ? '💻' : '🔗';
                                        return `<a href="${r.url}" target="_blank" rel="noopener" class="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                            <span>${icon}</span>
                                            <span class="underline decoration-blue-500/30 underline-offset-2">${r.name}</span>
                                        </a>`;
                                    }).join('')}
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}

            <!-- Final Node -->
            <div class="roadmap-step animate-fadeIn" style="animation-delay: ${data.steps.length * 0.1}s">
                <div class="step-marker bg-gradient-to-tr from-blue-500 to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">🏆</div>
                <div class="ml-10 md:ml-0 md:w-5/12 ${data.steps.length % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}">
                    <div class="glass-card p-6 border-emerald-500/30 bg-emerald-500/5">
                        <h3 class="font-heading font-bold text-lg text-emerald-400 flex items-center gap-2">
                            <span>🎉</span> Career Ready!
                        </h3>
                        <p class="text-xs text-gray-300 mt-1 leading-relaxed">Congratulations! Completing this path prepares you to apply for ${data.career} roles.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
