// frontend/js/career.js
import { api } from './api.js';
import { showToast, createScoreGauge, createSkillTags } from './utils.js';

export function renderCareerPage(container) {
    container.innerHTML = `
        <div class="max-w-5xl mx-auto animate-fadeIn">
            <h1 class="font-heading text-3xl font-bold mb-2 flex items-center gap-3">🚀 Career Recommendations</h1>
            <p class="text-gray-400 mb-6">Get AI-powered career recommendations based on your profile</p>
            <div class="text-center mb-6">
                <button id="get-recs-btn" class="btn-primary px-8 py-3 rounded-lg font-semibold text-lg" onclick="window.getCareerRecs()">
                    ✨ Get AI Recommendations
                </button>
            </div>
            <div id="career-results"></div>
        </div>
        <div id="skill-gap-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="window.closeSkillGapModal()"></div>
            <div class="glass-card-strong p-6 rounded-2xl max-w-lg w-full relative z-10 max-h-[80vh] overflow-y-auto custom-scrollbar animate-slideUp" id="modal-body"></div>
        </div>
    `;
    window.getCareerRecs = getRecommendations;
    window.analyzeSkillGap = analyzeSkillGap;
    window.closeSkillGapModal = () => document.getElementById('skill-gap-modal').classList.add('hidden');
    window.goToRoadmap = (career) => { window.location.hash = '#roadmap?career=' + encodeURIComponent(career); };

    loadHistory();
}

async function loadHistory() {
    try {
        const history = await api.get('/career/history');
        if (history && history.length > 0) {
            // Fetch full recommendations
            await getRecommendations();
        }
    } catch { /* no history */ }
}

async function getRecommendations() {
    const ct = document.getElementById('career-results');
    const btn = document.getElementById('get-recs-btn');

    btn.disabled = true;
    btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Analyzing...';

    ct.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${Array(4).fill('<div class="glass-card p-6 h-64 shimmer rounded-xl"></div>').join('')}</div>`;

    try {
        const data = await api.post('/career/recommend', {});
        renderResults(data);
    } catch {
        ct.innerHTML = '<div class="glass-card p-8 text-center"><p class="text-gray-400">Please complete your profile and add skills first.</p><a href="#profile" class="text-electric hover:underline mt-2 inline-block">→ Go to Profile</a></div>';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '✨ Get AI Recommendations';
    }
}

function renderResults(careers) {
    const ct = document.getElementById('career-results');
    if (!careers || careers.length === 0) {
        ct.innerHTML = '<div class="glass-card p-8 text-center text-gray-400">No recommendations yet. Complete your profile first.</div>';
        return;
    }

    ct.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${careers.map((c, i) => {
            const scoreColor = c.match_score >= 70 ? '#10b981' : c.match_score >= 40 ? '#f59e0b' : '#ef4444';
            const growthColor = c.growth === 'Very High' ? 'text-green-400' : c.growth === 'High' ? 'text-blue-400' : 'text-yellow-400';
            return `
            <div class="glass-card p-6 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] animate-fadeIn" style="animation-delay: ${i * 0.1}s">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <span class="inline-block bg-gradient-to-r from-electric to-emerald text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">#${i+1}</span>
                        <h3 class="font-heading text-xl font-bold">${c.career_name}</h3>
                    </div>
                    <div class="text-center">
                        <div class="relative w-16 h-16">
                            <svg class="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${scoreColor}" stroke-width="3" stroke-dasharray="${c.match_score}, 100" stroke-linecap="round"/>
                            </svg>
                            <span class="absolute inset-0 flex items-center justify-center text-sm font-bold" style="color: ${scoreColor}">${Math.round(c.match_score)}%</span>
                        </div>
                    </div>
                </div>
                <p class="text-sm text-gray-400 mb-3">${c.description}</p>
                <div class="flex flex-wrap gap-2 mb-3">
                    <span class="text-xs bg-white/5 px-2 py-1 rounded-full border border-white/10">💰 ${c.avg_salary}</span>
                    <span class="text-xs bg-white/5 px-2 py-1 rounded-full border border-white/10 ${growthColor}">📈 ${c.growth}</span>
                </div>
                <div class="mb-2">
                    <p class="text-xs text-gray-500 mb-1">Matching Skills:</p>
                    <div class="flex flex-wrap gap-1">${(c.matching_skills || []).slice(0, 5).map(s => `<span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${s}</span>`).join('') || '<span class="text-xs text-gray-600">None</span>'}</div>
                </div>
                <div class="mb-4">
                    <p class="text-xs text-gray-500 mb-1">Missing Skills:</p>
                    <div class="flex flex-wrap gap-1">${(c.missing_skills || []).slice(0, 4).map(s => `<span class="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">${s}</span>`).join('') || '<span class="text-xs text-green-400">All matched!</span>'}</div>
                </div>
                <div class="flex gap-2">
                    <button class="btn-secondary text-xs px-3 py-1.5 rounded-lg flex-1" onclick="window.analyzeSkillGap('${c.career_name}')">🔍 Skill Gap</button>
                    <button class="btn-primary text-xs px-3 py-1.5 rounded-lg flex-1" onclick="window.goToRoadmap('${c.career_name}')">🗺️ Roadmap</button>
                </div>
            </div>`;
        }).join('')}
    </div>`;
}

async function analyzeSkillGap(career) {
    const modal = document.getElementById('skill-gap-modal');
    const body = document.getElementById('modal-body');
    modal.classList.remove('hidden');
    body.innerHTML = '<div class="flex justify-center py-8"><div class="w-10 h-10 border-4 border-white/10 border-t-electric rounded-full animate-spin"></div></div>';

    try {
        const data = await api.post('/career/skill-gap', { target_career: career });
        const pct = Math.round(data.skill_match_percentage || 0);
        const barColor = pct >= 70 ? 'from-emerald-500 to-green-400' : pct >= 40 ? 'from-yellow-500 to-orange-400' : 'from-red-500 to-red-400';

        body.innerHTML = `
            <button class="absolute top-3 right-3 text-gray-400 hover:text-white" onclick="window.closeSkillGapModal()">✕</button>
            <h2 class="font-heading text-2xl font-bold mb-4">🔍 Skill Gap: ${data.target_career}</h2>
            <div class="text-center mb-4">
                <span class="font-heading text-5xl font-bold gradient-text">${pct}%</span>
                <p class="text-gray-400 text-sm mt-1">Skill Match</p>
            </div>
            <div class="progress-bar-container h-3 mb-6">
                <div class="h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000" style="width: ${pct}%"></div>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold text-sm mb-2 text-green-400">✅ Matching Skills (${(data.matching_skills || []).length})</h3>
                <div class="flex flex-wrap gap-1">${createSkillTags(data.matching_skills || [], 'success')}</div>
            </div>
            <div class="mb-4">
                <h3 class="font-semibold text-sm mb-2 text-red-400">❌ Missing Skills (${(data.missing_skills || []).length})</h3>
                <div class="flex flex-wrap gap-1">${(data.missing_skills || []).map((s,i) => {
                    const pr = i < 1 ? 'danger' : i < 3 ? 'warning' : '';
                    const badge = i < 1 ? '🔴 High' : i < 3 ? '🟡 Med' : '🟢 Low';
                    return `<span class="skill-tag ${pr}">${s} <span class="text-[10px] opacity-60">${badge}</span></span>`;
                }).join('')}</div>
            </div>
            ${(data.learning_suggestions || []).length > 0 ? `
            <div>
                <h3 class="font-semibold text-sm mb-2 text-blue-400">💡 Suggestions</h3>
                <ul class="space-y-1">${data.learning_suggestions.map((s,i) => `<li class="text-sm text-gray-300">${i+1}. ${s}</li>`).join('')}</ul>
            </div>` : ''}
            <button class="btn-primary w-full mt-4 py-2 rounded-lg text-sm" onclick="window.goToRoadmap('${data.target_career}'); window.closeSkillGapModal();">🗺️ Generate Learning Roadmap</button>
        `;
    } catch {
        body.innerHTML = '<p class="text-center text-gray-400 py-8">Failed to analyze skill gap.</p>';
    }
}
