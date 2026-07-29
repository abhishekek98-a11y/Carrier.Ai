// frontend/js/dashboard.js
import { api } from './api.js';
import { animateNumber } from './utils.js';

export function renderDashboardPage(container, userName) {
    container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8">
            <!-- Hero Header -->
            <div class="hero-section p-8 md:p-10 relative overflow-hidden animate-fadeIn">
                <div class="relative z-10 max-w-2xl">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        ✨ Career Acceleration Platform
                    </div>
                    <h1 class="font-heading text-3xl md:text-5xl font-bold mb-3 leading-tight">
                        Welcome back, <span class="gradient-text">${userName || 'Student'}</span> 👋
                    </h1>
                    <p class="text-gray-300 text-base md:text-lg">
                        Track your academic progress, optimize your resume, and discover AI-matched career paths.
                    </p>
                </div>
            </div>

            <!-- Content Container -->
            <div id="dashboard-content">
                <div class="flex justify-center py-16">
                    <div class="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
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
        <div class="space-y-8 animate-fadeIn">
            <!-- Stat Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                ${[
                    { icon: '🎯', label: 'Career Score', val: 0, badgeClass: 'icon-badge' },
                    { icon: '📄', label: 'Resume Score', val: 0, badgeClass: 'icon-badge icon-badge-emerald' },
                    { icon: '📊', label: 'ATS Score', val: 0, badgeClass: 'icon-badge icon-badge-violet' },
                    { icon: '💻', label: 'Skills Added', val: 0, badgeClass: 'icon-badge icon-badge-amber' }
                ].map((c, i) => `
                    <div class="glass-card p-6 flex items-center gap-4 glass-card-hover animate-fadeIn" style="animation-delay:${i * 0.08}s">
                        <div class="${c.badgeClass}">${c.icon}</div>
                        <div>
                            <p class="font-heading text-3xl font-bold text-white">${c.val}</p>
                            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">${c.label}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Quick Start Steps -->
            <div class="glass-card p-8 md:p-10 border border-white/10">
                <div class="max-w-xl mx-auto text-center mb-8">
                    <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-2xl flex items-center justify-center mx-auto mb-3">🚀</div>
                    <h2 class="font-heading text-2xl font-bold text-white mb-2">Get Started with CareerAI</h2>
                    <p class="text-gray-400 text-sm">Complete your profile to unlock personalized recommendations and ATS resume analysis</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <a href="#profile" class="glass-card p-6 text-center glass-card-hover block group">
                        <div class="icon-badge mx-auto mb-4 group-hover:scale-110 transition-transform">🎓</div>
                        <p class="font-semibold text-white text-base mb-1">Complete Profile</p>
                        <p class="text-xs text-gray-400">Add skills & GPA</p>
                    </a>
                    <a href="#resume" class="glass-card p-6 text-center glass-card-hover block group">
                        <div class="icon-badge icon-badge-emerald mx-auto mb-4 group-hover:scale-110 transition-transform">📄</div>
                        <p class="font-semibold text-white text-base mb-1">Upload Resume</p>
                        <p class="text-xs text-gray-400">Analyze ATS fit</p>
                    </a>
                    <a href="#careers" class="glass-card p-6 text-center glass-card-hover block group">
                        <div class="icon-badge icon-badge-violet mx-auto mb-4 group-hover:scale-110 transition-transform">🚀</div>
                        <p class="font-semibold text-white text-base mb-1">Career Guidance</p>
                        <p class="text-xs text-gray-400">Find top matches</p>
                    </a>
                    <a href="#roadmap" class="glass-card p-6 text-center glass-card-hover block group">
                        <div class="icon-badge icon-badge-amber mx-auto mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                        <p class="font-semibold text-white text-base mb-1">Learning Roadmap</p>
                        <p class="text-xs text-gray-400">Structured paths</p>
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
        <div class="space-y-8 animate-fadeIn">
            <!-- Stat Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="glass-card p-6 flex items-center gap-4 glass-card-hover animate-fadeIn" style="animation-delay:0.05s">
                    <div class="icon-badge">🎯</div>
                    <div>
                        <p class="font-heading text-3xl font-bold gradient-text" id="stat-career">${cs}</p>
                        <p class="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">Career Score</p>
                    </div>
                </div>
                <div class="glass-card p-6 flex items-center gap-4 glass-card-hover animate-fadeIn" style="animation-delay:0.1s">
                    <div class="icon-badge icon-badge-emerald">📄</div>
                    <div>
                        <p class="font-heading text-3xl font-bold gradient-text" id="stat-resume">${rs}</p>
                        <p class="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">Resume Score</p>
                    </div>
                </div>
                <div class="glass-card p-6 flex items-center gap-4 glass-card-hover animate-fadeIn" style="animation-delay:0.15s">
                    <div class="icon-badge icon-badge-violet">📊</div>
                    <div>
                        <p class="font-heading text-3xl font-bold gradient-text" id="stat-ats">${as}</p>
                        <p class="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">ATS Score</p>
                    </div>
                </div>
                <div class="glass-card p-6 flex items-center gap-4 glass-card-hover animate-fadeIn" style="animation-delay:0.2s">
                    <div class="icon-badge icon-badge-amber">💻</div>
                    <div>
                        <p class="font-heading text-3xl font-bold gradient-text" id="stat-skills">${sc}</p>
                        <p class="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">Active Skills</p>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass-card p-6 animate-fadeIn" style="animation-delay:0.25s">
                    <div class="flex items-center justify-between mb-5">
                        <h3 class="font-heading text-lg font-bold text-white flex items-center gap-2">
                            <span>🏆</span> Top Career Matches
                        </h3>
                        <a href="#careers" class="text-xs text-blue-400 hover:text-blue-300 font-medium">View details →</a>
                    </div>
                    <div class="relative h-64 w-full">
                        <canvas id="career-chart"></canvas>
                    </div>
                </div>
                <div class="glass-card p-6 animate-fadeIn" style="animation-delay:0.3s">
                    <div class="flex items-center justify-between mb-5">
                        <h3 class="font-heading text-lg font-bold text-white flex items-center gap-2">
                            <span>🎯</span> Skill Distribution
                        </h3>
                        <a href="#profile" class="text-xs text-blue-400 hover:text-blue-300 font-medium">Manage skills →</a>
                    </div>
                    <div class="relative h-64 w-full flex items-center justify-center">
                        <canvas id="skill-chart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Quick Action Cards -->
            <div>
                <h3 class="font-heading text-xl font-bold text-white mb-4 flex items-center gap-2">
                    ⚡ Quick Actions
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <a href="#resume" class="glass-card p-5 glass-card-hover flex items-center gap-4 block group">
                        <div class="icon-badge icon-badge-emerald group-hover:scale-110 transition-transform">📄</div>
                        <div>
                            <p class="font-semibold text-white text-sm">Upload Resume</p>
                            <p class="text-xs text-gray-400">PDF analysis</p>
                        </div>
                    </a>
                    <a href="#careers" class="glass-card p-5 glass-card-hover flex items-center gap-4 block group">
                        <div class="icon-badge group-hover:scale-110 transition-transform">🚀</div>
                        <div>
                            <p class="font-semibold text-white text-sm">Career Advice</p>
                            <p class="text-xs text-gray-400">AI match breakdown</p>
                        </div>
                    </a>
                    <a href="#roadmap" class="glass-card p-5 glass-card-hover flex items-center gap-4 block group">
                        <div class="icon-badge icon-badge-violet group-hover:scale-110 transition-transform">🗺️</div>
                        <div>
                            <p class="font-semibold text-white text-sm">Learning Path</p>
                            <p class="text-xs text-gray-400">Personalized steps</p>
                        </div>
                    </a>
                    <div class="glass-card p-5 glass-card-hover flex items-center gap-4 cursor-pointer group" onclick="document.getElementById('chatbot-toggle-btn').click()">
                        <div class="icon-badge icon-badge-amber group-hover:scale-110 transition-transform">🤖</div>
                        <div>
                            <p class="font-semibold text-white text-sm">AI Assistant</p>
                            <p class="text-xs text-gray-400">Instant answers</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Timeline -->
            ${(stats.recent_activity || []).length > 0 ? `
            <div class="glass-card p-6 animate-fadeIn" style="animation-delay:0.4s">
                <h3 class="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    📋 Recent Activity
                </h3>
                <div class="space-y-3">
                    ${stats.recent_activity.map(a => `
                        <div class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm">
                            <span class="text-lg">${a.icon || '📌'}</span>
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
    }, 200);

    // Animate numbers
    setTimeout(() => {
        ['stat-career','stat-resume','stat-ats','stat-skills'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const target = parseInt(el.textContent) || 0;
                el.textContent = '0';
                animateNumber(el, target);
            }
        });
    }, 400);
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
                backgroundColor: ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ec4899'],
                borderRadius: 6,
                barThickness: 24
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#9ca3af' } },
                y: { grid: { display: false }, ticks: { color: '#e5e7eb', font: { size: 12, family: 'Inter' } } }
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
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 12, font: { size: 11, family: 'Inter' } } }
            }
        }
    });
}
