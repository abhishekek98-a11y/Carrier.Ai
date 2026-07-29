// frontend/js/roadmap.js
import { api } from './api.js';
import { showToast, createSkillTags } from './utils.js';

const CAREERS = ["AI/ML Engineer","Data Scientist","Full Stack Developer","Backend Developer","Frontend Developer","DevOps Engineer","Cybersecurity Analyst","Cloud Architect","Mobile App Developer","Data Analyst","Blockchain Developer","Game Developer","UI/UX Designer","Database Administrator","IoT Engineer"];

export function renderRoadmapPage(container) {
    // Check for career param in hash
    const hash = window.location.hash;
    const match = hash.match(/career=([^&]+)/);
    const preselected = match ? decodeURIComponent(match[1]) : '';

    container.innerHTML = `
        <div class="max-w-4xl mx-auto animate-fadeIn">
            <h1 class="font-heading text-3xl font-bold mb-2 flex items-center gap-3">🗺️ Learning Roadmap</h1>
            <p class="text-gray-400 mb-6">Generate a personalized learning path to your dream career</p>
            <div class="glass-card p-6 mb-6">
                <div class="flex flex-col sm:flex-row gap-4">
                    <select id="roadmap-career" class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric transition-colors bg-[#0a0e27]">
                        <option value="">Select a career path...</option>
                        ${CAREERS.map(c => `<option value="${c}" ${c === preselected ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                    <button id="gen-roadmap-btn" class="btn-primary px-8 py-3 rounded-lg font-semibold whitespace-nowrap" onclick="window.generateRoadmap()">
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
    btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Generating...';

    ct.innerHTML = `<div class="space-y-4">${Array(4).fill('<div class="glass-card p-6 h-32 shimmer rounded-xl"></div>').join('')}</div>`;

    try {
        const data = await api.post('/roadmap/generate', { career });
        renderRoadmap(data);
    } catch {
        ct.innerHTML = '<div class="glass-card p-8 text-center text-gray-400">Failed to generate roadmap. Please try again.</div>';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🚀 Generate Roadmap';
    }
}

function renderRoadmap(data) {
    const ct = document.getElementById('roadmap-content');
    if (!data || !data.steps || data.steps.length === 0) {
        ct.innerHTML = '<div class="glass-card p-8 text-center text-gray-400">No roadmap data available.</div>';
        return;
    }

    ct.innerHTML = `
        <div class="mb-4 flex items-center justify-between">
            <h2 class="font-heading text-xl font-bold">📍 Path to ${data.career}</h2>
            <span class="text-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">⏱️ ${data.total_duration}</span>
        </div>
        <div class="roadmap-timeline pl-10 md:pl-0">
            ${data.steps.map((step, i) => `
                <div class="roadmap-step animate-fadeIn" style="animation-delay: ${i * 0.15}s">
                    <div class="step-marker text-xs font-bold text-electric">${step.step_number}</div>
                    <div class="ml-12 md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}">
                        <div class="glass-card p-5 hover:border-white/20 transition-all duration-300">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="font-heading font-bold text-lg">${step.title}</h3>
                                <span class="text-xs bg-electric/10 text-electric px-2 py-1 rounded-full border border-electric/20">${step.duration}</span>
                            </div>
                            <p class="text-sm text-gray-400 mb-3">${step.description}</p>
                            ${(step.skills_gained || []).length > 0 ? `
                            <div class="mb-3">
                                <p class="text-xs text-gray-500 mb-1">Skills gained:</p>
                                <div class="flex flex-wrap gap-1">${createSkillTags(step.skills_gained, 'success')}</div>
                            </div>` : ''}
                            ${(step.resources || []).length > 0 ? `
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Resources:</p>
                                <div class="space-y-1">
                                    ${step.resources.map(r => {
                                        const icon = r.type === 'Course' ? '🎥' : r.type === 'Documentation' ? '📚' : r.type === 'Interactive' ? '💻' : '🔗';
                                        return `<a href="${r.url}" target="_blank" rel="noopener" class="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"><span>${icon}</span>${r.name}</a>`;
                                    }).join('')}
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="roadmap-step animate-fadeIn" style="animation-delay: ${data.steps.length * 0.15}s">
                <div class="step-marker bg-gradient-to-r from-electric to-emerald text-white text-xs">🎯</div>
                <div class="ml-12 md:ml-0 md:w-5/12 ${data.steps.length % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}">
                    <div class="glass-card p-5 border-emerald-500/30 bg-emerald-500/5">
                        <h3 class="font-heading font-bold text-lg text-emerald-400">🎉 Career Ready!</h3>
                        <p class="text-sm text-gray-400">You're ready to start your career as a ${data.career}!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
