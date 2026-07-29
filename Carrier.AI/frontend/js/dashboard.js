// frontend/js/dashboard.js
import { api } from './api.js';
import { animateNumber, createScoreGauge } from './utils.js';

export function renderDashboardPage(container, userName) {
    container.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="hero-section p-8 mb-8 animate-fadeIn">
                <h1 class="font-heading text-4xl font-bold mb-2">Welcome back, <span class="gradient-text">${userName || 'Student'}</span>! 👋</h1>
                <p class="text-gray-400 text-lg">Here's your career journey overview</p>
            </div>
            <div id="dashboard-content">
                <div class="flex justify-center py-12"><div class="w-10 h-10 border-4 border-white/10 border-t-electric rounded-full animate-spin"></div></div>
            </div>
        </div>
    `;
    loadDashboard();
}

async function loadDashboard() {
    const ct = document.getElementById('dashboard-content');
    try {
        const stats = await api.get('/dashboard/stats');
        renderDashboard(ct, stats);
    } catch {
        renderEmptyDashboard(ct);
    }
}

function renderEmptyDashboard(ct) {
    ct.innerHTML = `
        <div class="animate-fadeIn">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                ${[{icon:'🎯',label:'Career Score',val:0},{icon:'📄',label:'Resume Score',val:0},{icon:'📊',label:'ATS Score',val:0},{icon:'💻',label:'Skills',val:0}]
                .map((c,i) => `
                    <div class="glass-card p-5 text-center animate-fadeIn" style="animation-delay:${i*0.1}s">
                        <span class="text-3xl mb-2 block">${c.icon}</span>
                        <p class="font-heading text-3xl font-bold gradient-text">${c.val}</p>
                        <p class="text-sm text-gray-400 mt-1">${c.label}</p>
                    </div>
                `).join('')}
            </div>
            <div class="glass-card p-8 text-center">
                <h2 class="font-heading text-2xl font-bold mb-4">🚀 Get Started</h2>
                <p class="text-gray-400 mb-6">Complete these steps to unlock your personalized career insights</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="#profile" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center">
                        <span class="text-3xl block mb-2">🎓</span><p class="font-medium text-sm">Complete Profile</p>
                    </a>
                    <a href="#resume" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center">
                        <span class="text-3xl block mb-2">📄</span><p class="font-medium text-sm">Upload Resume</p>
                    </a>
                    <a href="#careers" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center">
                        <span class="text-3xl block mb-2">🚀</span><p class="font-medium text-sm">Get Career Advice</p>
                    </a>
                    <a href="#roadmap" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center">
                        <span class="text-3xl block mb-2">🗺️</span><p class="font-medium text-sm">View Roadmap</p>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderDashboard(ct, stats) {
    const cs = Math.round(stats.career_score || 0);
    const rs = Math.round(stats.resume_score || 0);
    const as = Math.round(stats.ats_score || 0);
    const sc = stats.skills_count || 0;

    ct.innerHTML = `
        <div class="animate-fadeIn">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="glass-card p-5 text-center animate-fadeIn hover:scale-105 transition-transform duration-300" style="animation-delay:0.1s">
                    <span class="text-3xl mb-2 block">🎯</span>
                    <p class="font-heading text-3xl font-bold gradient-text" id="stat-career">${cs}</p>
                    <p class="text-sm text-gray-400 mt-1">Career Score</p>
                </div>
                <div class="glass-card p-5 text-center animate-fadeIn hover:scale-105 transition-transform duration-300" style="animation-delay:0.2s">
                    <span class="text-3xl mb-2 block">📄</span>
                    <p class="font-heading text-3xl font-bold gradient-text" id="stat-resume">${rs}</p>
                    <p class="text-sm text-gray-400 mt-1">Resume Score</p>
                </div>
                <div class="glass-card p-5 text-center animate-fadeIn hover:scale-105 transition-transform duration-300" style="animation-delay:0.3s">
                    <span class="text-3xl mb-2 block">📊</span>
                    <p class="font-heading text-3xl font-bold gradient-text" id="stat-ats">${as}</p>
                    <p class="text-sm text-gray-400 mt-1">ATS Score</p>
                </div>
                <div class="glass-card p-5 text-center animate-fadeIn hover:scale-105 transition-transform duration-300" style="animation-delay:0.4s">
                    <span class="text-3xl mb-2 block">💻</span>
                    <p class="font-heading text-3xl font-bold gradient-text" id="stat-skills">${sc}</p>
                    <p class="text-sm text-gray-400 mt-1">Skills</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div class="glass-card p-6 animate-fadeIn" style="animation-delay:0.3s">
                    <h3 class="font-heading text-lg font-semibold mb-4">🏆 Top Career Matches</h3>
                    <canvas id="career-chart" height="200"></canvas>
                </div>
                <div class="glass-card p-6 animate-fadeIn" style="animation-delay:0.4s">
                    <h3 class="font-heading text-lg font-semibold mb-4">🎯 Skill Distribution</h3>
                    <canvas id="skill-chart" height="200"></canvas>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <a href="#resume" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center animate-fadeIn" style="animation-delay:0.5s">
                    <span class="text-2xl block mb-1">📄</span><p class="font-medium text-sm">Upload Resume</p>
                </a>
                <a href="#careers" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center animate-fadeIn" style="animation-delay:0.55s">
                    <span class="text-2xl block mb-1">🚀</span><p class="font-medium text-sm">Get Career Advice</p>
                </a>
                <a href="#roadmap" class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 block text-center animate-fadeIn" style="animation-delay:0.6s">
                    <span class="text-2xl block mb-1">🗺️</span><p class="font-medium text-sm">View Roadmap</p>
                </a>
                <div class="glass-card p-4 hover:border-white/20 hover:scale-105 transition-all duration-300 text-center cursor-pointer animate-fadeIn" style="animation-delay:0.65s" onclick="document.getElementById('chatbot-toggle-btn').click()">
                    <span class="text-2xl block mb-1">🤖</span><p class="font-medium text-sm">Ask AI Assistant</p>
                </div>
            </div>

            ${(stats.recent_activity || []).length > 0 ? `
            <div class="glass-card p-6 animate-fadeIn" style="animation-delay:0.5s">
                <h3 class="font-heading text-lg font-semibold mb-4">📋 Recent Activity</h3>
                <div class="space-y-3">
                    ${stats.recent_activity.map(a => `
                        <div class="flex items-center gap-3 text-sm">
                            <span class="text-xl">${a.icon || '📌'}</span>
                            <p class="text-gray-300 flex-1">${a.action}</p>
                            ${a.time ? `<span class="text-xs text-gray-500">${new Date(a.time).toLocaleDateString()}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        </div>
    `;

    // Render charts
    setTimeout(() => {
        renderCareerChart(stats.top_careers || []);
        renderSkillChart(stats.skill_distribution || {});
    }, 300);

    // Animate numbers
    setTimeout(() => {
        ['stat-career','stat-resume','stat-ats','stat-skills'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { const target = parseInt(el.textContent); el.textContent = '0'; animateNumber(el, target); }
        });
    }, 500);
}

function renderCareerChart(topCareers) {
    const canvas = document.getElementById('career-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = topCareers.map(c => c.name || c);
    const data = topCareers.map(c => c.score || 0);

    if (labels.length === 0) {
        labels.push('No data yet');
        data.push(0);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['rgba(59,130,246,0.7)','rgba(16,185,129,0.7)','rgba(139,92,246,0.7)','rgba(245,158,11,0.7)','rgba(236,72,153,0.7)'],
                borderRadius: 8,
                barThickness: 28
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                y: { grid: { display: false }, ticks: { color: '#d1d5db', font: { size: 11 } } }
            }
        }
    });
}

function renderSkillChart(distribution) {
    const canvas = document.getElementById('skill-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = Object.keys(distribution);
    const data = Object.values(distribution);

    if (labels.length === 0) {
        labels.push('No skills yet');
        data.push(1);
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ec4899','#06b6d4','#f43f5e','#84cc16','#6366f1','#14b8a6'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 12, font: { size: 11 } } }
            }
        }
    });
}
