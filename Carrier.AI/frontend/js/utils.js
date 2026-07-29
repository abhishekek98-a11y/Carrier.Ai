// frontend/js/utils.js

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <div class="flex-1">
            <p class="text-sm font-medium text-white">${message}</p>
        </div>
        <button class="text-gray-400 hover:text-white" onclick="this.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

export function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.setAttribute('data-original-content', container.innerHTML);
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]">
            <div class="w-12 h-12 border-4 border-white/10 border-t-electric rounded-full animate-spin"></div>
            <p class="mt-4 text-sm text-gray-400">Loading...</p>
        </div>
    `;
}

export function hideLoading(containerId, contentHtml = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (contentHtml) {
        container.innerHTML = contentHtml;
    } else {
        const original = container.getAttribute('data-original-content');
        if (original) container.innerHTML = original;
    }
}

export function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function animateNumber(element, target, duration = 1000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const animate = () => {
        start += increment;
        if (start >= target) {
            element.innerText = target;
        } else {
            element.innerText = Math.floor(start);
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

export function animateProgress(element, targetPercent, duration = 800) {
    element.style.width = '0%';
    setTimeout(() => {
        element.style.transition = `width ${duration}ms ease-out`;
        element.style.width = `${targetPercent}%`;
    }, 50);
}

export function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

export function escapeHtml(str) {
    if (!str) return '';
    return String(str)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export function createSkillTags(skills, className = '') {
    if (!skills || !skills.length) return '<span class="text-gray-500 text-sm">None identified</span>';
    return skills.map(skill => `<span class="skill-tag ${className}">${escapeHtml(skill)}</span>`).join(' ');
}

export function createScoreGauge(score, label, size = '120px') {
    let color = '#ef4444'; // red
    if (score >= 50) color = '#f59e0b'; // yellow
    if (score >= 75) color = '#10b981'; // green
    
    return `
        <div class="flex flex-col items-center">
            <div class="score-gauge-container" style="width: ${size}; height: ${size};">
                <div class="score-gauge" style="background: conic-gradient(${color} ${score}%, transparent 0);"></div>
                <div class="score-gauge-inner">
                    <span class="score-value" style="color: ${color}">${score}</span>
                </div>
            </div>
            <p class="mt-3 text-sm font-medium text-gray-300 text-center">${label}</p>
        </div>
    `;
}

export function staggerAnimation(container, selector, className = 'animate-fadeIn', delay = 100) {
    const elements = container.querySelectorAll(selector);
    elements.forEach((el, i) => {
        el.classList.add('opacity-0'); // initially hidden
        setTimeout(() => {
            el.classList.add(className);
            el.classList.remove('opacity-0');
        }, i * delay);
    });
}
