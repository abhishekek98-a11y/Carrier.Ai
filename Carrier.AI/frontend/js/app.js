// frontend/js/app.js
import { isAuthenticated, removeToken, api } from './api.js';
import { renderLoginPage, renderSignupPage } from './auth.js';
import { renderProfilePage } from './profile.js';
import { renderResumePage } from './resume.js';
import { renderCareerPage } from './career.js';
import { renderRoadmapPage } from './roadmap.js';
import { initChatbot } from './chatbot.js';
import { renderDashboardPage } from './dashboard.js';
import { showToast } from './utils.js';

let currentUser = null;

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '🎓' },
    { id: 'resume', label: 'Resume', icon: '📄' },
    { id: 'careers', label: 'Careers', icon: '🚀' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
];

function getPage() {
    const hash = window.location.hash.replace('#', '').split('?')[0] || '';
    return hash || (isAuthenticated() ? 'dashboard' : 'login');
}

function renderNav(page) {
    return `
        <div class="sidebar custom-scrollbar" id="sidebar">
            <div class="p-6 border-b border-white/10">
                <a href="#dashboard" class="flex items-center gap-2">
                    <span class="text-2xl">🎯</span>
                    <h1 class="font-heading text-2xl font-bold gradient-text">CareerAI</h1>
                </a>
            </div>
            <nav class="p-4 flex-1">
                <ul class="space-y-1">
                    ${NAV_ITEMS.map(item => `
                        <li>
                            <a href="#${item.id}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${page === item.id ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
                                <span class="text-lg">${item.icon}</span>
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
            <div class="p-4 border-t border-white/10">
                <div class="flex items-center gap-3 mb-3 px-2">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-r from-electric to-emerald flex items-center justify-center font-bold text-sm">
                        ${currentUser ? currentUser.full_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">${currentUser ? currentUser.full_name : 'User'}</p>
                        <p class="text-xs text-gray-500 truncate">${currentUser ? currentUser.email : ''}</p>
                    </div>
                </div>
                <button onclick="window.logout()" class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm">
                    <span>🚪</span> Logout
                </button>
            </div>
        </div>
        <!-- Mobile header -->
        <div class="fixed top-0 left-0 right-0 z-40 bg-navy/90 backdrop-blur-lg border-b border-white/10 p-3 flex items-center justify-between md:hidden">
            <button onclick="window.toggleSidebar()" class="text-white p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <span class="font-heading font-bold gradient-text">🎯 CareerAI</span>
            <div class="w-6"></div>
        </div>
    `;
}

async function renderPage() {
    const page = getPage();
    const app = document.getElementById('app');

    // Auth pages (no nav)
    if (page === 'login') { renderLoginPage(); initChatbot(); return; }
    if (page === 'signup') { renderSignupPage(); initChatbot(); return; }

    // Protected pages - check auth
    if (!isAuthenticated()) {
        window.location.hash = '#login';
        return;
    }

    // Fetch user if not loaded
    if (!currentUser) {
        try {
            currentUser = await api.get('/auth/me');
        } catch {
            removeToken();
            window.location.hash = '#login';
            return;
        }
    }

    // Render layout
    app.innerHTML = `
        ${renderNav(page)}
        <div class="layout-container">
            <div class="main-content custom-scrollbar" id="page-content"></div>
        </div>
    `;

    const content = document.getElementById('page-content');

    switch (page) {
        case 'dashboard':
            renderDashboardPage(content, currentUser.full_name);
            break;
        case 'profile':
            renderProfilePage(content);
            break;
        case 'resume':
            renderResumePage(content);
            break;
        case 'careers':
            renderCareerPage(content);
            break;
        case 'roadmap':
            renderRoadmapPage(content);
            break;
        default:
            renderDashboardPage(content, currentUser.full_name);
    }

    initChatbot();
}

// Global functions
window.logout = function() {
    removeToken();
    currentUser = null;
    showToast('Logged out successfully', 'info');
    window.location.hash = '#login';
};

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
};

// Close sidebar on link click (mobile)
document.addEventListener('click', (e) => {
    if (e.target.closest('.sidebar a')) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth < 768) sidebar.classList.remove('open');
    }
    // Close sidebar on overlay click (mobile)
    if (e.target.closest('.main-content') && window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
    }
});

// Router
window.addEventListener('hashchange', renderPage);

// Initial render
renderPage();
