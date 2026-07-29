// frontend/js/career.js
import { api } from './api.js';
import { createSkillTags } from './utils.js';

export function renderCareerPage(container) {
    container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 class="font-heading text-3xl font-bold flex items-center gap-3">
                        <span class="icon-badge icon-badge-violet">🚀</span> Career AI Recommendations
                    </h1>
                    <p class="text-gray-400 text-sm mt-1">AI-driven career matching based on your skill set, GPA, and personal interests</p>
                </div>
                <button id="get-recs-btn" class="btn-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 whitespace-nowrap self-start sm:self-auto" onclick="window.getCareerRecs()">
                    ✨ Get AI Recommendations
                </button>
            </div>

            <div id="career-results"></div>
        </div>

        <!-- Skill Gap Modal -->
        <div id="skill-gap-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/75 backdrop-blur-md" onclick="window.closeSkillGapModal()"></div>
            <div class="glass-card-strong p-6 md:p-8 rounded-2xl max-w-lg w-full relative z-10 max-h-[85vh] overflow-y-auto custom-scrollbar border border-white/15 animate-slideUp shadow-2xl" id="modal-body"></div>
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
            await getRecommendations();
        }
    } catch { /* no history */ }
}

async function getRecommendations() {
    const ct = document.getElementById('career-results');
    const btn = document.getElementById('get-recs-btn');

    btn.disabled = true;
    btn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Analyzing Profile...';

    ct.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">${Array(4).fill('<div class="glass-card p-6 h-64 shimmer rounded-2xl"></div>').join('')}</div>`;

    try {
        const data = await api.post('/career/recommend', {});
        renderResults(data);
    } catch {
        ct.innerHTML = `
            <div class="glass-card p-10 text-center space-y-3">
                <p class="text-gray-300 font-semibold text-base">Please complete your profile and add skills first.</p>
                <a href="#profile" class="btn-primary inline-flex items-center text-sm px-5 py-2.5 rounded-xl">→ Go to Profile</a>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btn.innerHTML = '✨ Get AI Recommendations';
    }
}

function renderResults(careers) {
    const ct = document.getElementById('career-results');
    if (!careers || careers.length === 0) {
        ct.innerHTML = '<div class="glass-card p-10 text-center text-gray-400">No recommendations available yet. Please complete your profile first.</div>';
        return;
    }

    ct.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${careers.map((c, i) => {
                const scoreColor = c.match_score >= 70 ? '#34d399' : c.match_score >= 40 ? '#fbbf24' : '#f87171';
                const growthColor = c.growth === 'Very High' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : c.growth === 'High' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' : 'text-amber-400 border-amber-500/20 bg-amber-500/10';
                return `
                <div class="glass-card p-6 flex flex-col justify-between glass-card-hover animate-fadeIn" style="animation-delay: ${i * 0.08}s">
                    <div>
                        <div class="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <span class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-2">#${i+1} Match</span>
                                <h3 class="font-heading text-xl font-bold text-white">${c.career_name}</h3>
                            </div>
                            <div class="relative w-14 h-14 shrink-0">
                                <svg class="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"/>
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="${scoreColor}" stroke-width="3.5" stroke-dasharray="${c.match_score}, 100" stroke-linecap="round"/>
                                </svg>
                                <span class="absolute inset-0 flex items-center justify-center text-xs font-bold" style="color: ${scoreColor}">${Math.round(c.match_score)}%</span>
                            </div>
                        </div>
                        <p class="text-xs text-gray-300 leading-relaxed mb-4">${c.description}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">💰 ${c.avg_salary}</span>
                            <span class="text-xs font-medium px-2.5 py-1 rounded-full border ${growthColor}">📈 ${c.growth} Growth</span>
                        </div>
                        <div class="space-y-2 mb-5">
                            <div>
                                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Matching Skills:</p>
                                <div class="flex flex-wrap gap-1">
                                    ${(c.matching_skills || []).slice(0, 5).map(s => `<span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">${s}</span>`).join('') || '<span class="text-xs text-gray-500">None yet</span>'}
                                </div>
                            </div>
                            <div>
                                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Missing Skills:</p>
                                <div class="flex flex-wrap gap-1">
                                    ${(c.missing_skills || []).slice(0, 4).map(s => `<span class="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">${s}</span>`).join('') || '<span class="text-xs text-emerald-400 font-medium">All matched!</span>'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 pt-2 border-t border-white/5">
                        <button class="btn-secondary text-xs px-3 py-2 rounded-xl flex-1 font-medium" onclick="window.analyzeSkillGap('${c.career_name}')">🔍 Skill Gap</button>
                        <button class="btn-primary text-xs px-3 py-2 rounded-xl flex-1 font-semibold" onclick="window.goToRoadmap('${c.career_name}')">🗺️ Roadmap</button>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
}

async function analyzeSkillGap(career) {
    const modal = document.getElementById('skill-gap-modal');
    const body = document.getElementById('modal-body');
    modal.classList.remove('hidden');
    body.innerHTML = '<div class="flex justify-center py-10"><div class="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div></div>';

    try {
        const data = await api.post('/career/skill-gap', { target_career: career });
        const pct = Math.round(data.skill_match_percentage || 0);
        const barColor = pct >= 70 ? 'from-emerald-500 to-green-400' : pct >= 40 ? 'from-amber-500 to-orange-400' : 'from-rose-500 to-rose-400';

        body.innerHTML = `
            <button class="absolute top-4 right-4 text-gray-400 hover:text-white p-1" onclick="window.closeSkillGapModal()">✕</button>
            <h2 class="font-heading text-xl font-bold text-white mb-4">🔍 Skill Gap Analysis: ${data.target_career}</h2>
            <div class="text-center my-4">
                <span class="font-heading text-5xl font-bold gradient-text">${pct}%</span>
                <p class="text-gray-400 text-xs font-medium mt-1">Skill Match Score</p>
            </div>
            <div class="progress-bar-container h-3 mb-6 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000" style="width: ${pct}%"></div>
            </div>
            <div class="space-y-4">
                <div>
                    <h3 class="font-semibold text-xs uppercase tracking-wider mb-2 text-emerald-400">✅ Matching Skills (${(data.matching_skills || []).length})</h3>
                    <div class="flex flex-wrap gap-1.5">${createSkillTags(data.matching_skills || [], 'success')}</div>
                </div>
                <div>
                    <h3 class="font-semibold text-xs uppercase tracking-wider mb-2 text-rose-400">❌ Missing Skills (${(data.missing_skills || []).length})</h3>
                    <div class="flex flex-wrap gap-1.5">
                        ${(data.missing_skills || []).map((s, i) => {
                            const pr = i < 1 ? 'danger' : i < 3 ? 'warning' : '';
                            const badge = i < 1 ? 'High' : i < 3 ? 'Med' : 'Low';
                            return `<span class="skill-tag ${pr}">${s} <span class="text-[10px] opacity-75 uppercase font-bold">(${badge})</span></span>`;
                        }).join('')}
                    </div>
                </div>
                ${(data.learning_suggestions || []).length > 0 ? `
                <div>
                    <h3 class="font-semibold text-xs uppercase tracking-wider mb-2 text-blue-400">💡 Learning Suggestions</h3>
                    <ul class="space-y-1.5">
                        ${data.learning_suggestions.map((s, i) => `
                            <li class="text-xs text-gray-300 flex items-start gap-2">
                                <span class="text-blue-400 font-bold">${i+1}.</span>
                                <span>${s}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>` : ''}
            </div>
            <button class="btn-primary w-full mt-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25" onclick="window.goToRoadmap('${data.target_career}'); window.closeSkillGapModal();">
                🗺️ Generate Learning Roadmap
            </button>
        `;
    } catch {
        body.innerHTML = '<p class="text-center text-gray-400 py-8">Failed to analyze skill gap. Please try again.</p>';
    }
}
