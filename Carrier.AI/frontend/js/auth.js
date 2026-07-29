// frontend/js/auth.js
import { api, setToken } from './api.js';
import { showToast } from './utils.js';

export function renderLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="auth-page flex items-center justify-center px-4">
            <div class="glass-card-strong w-full max-w-md p-8 animate-fadeIn">
                <div class="text-center mb-8">
                    <h1 class="font-heading text-4xl font-bold gradient-text mb-2">🎯 CareerAI</h1>
                    <p class="text-gray-400">AI-Powered Career Guidance</p>
                </div>
                <form id="login-form" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                            <input type="email" id="login-email" class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-electric transition-colors" placeholder="you@example.com" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                            <input type="password" id="login-password" class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white focus:outline-none focus:border-electric transition-colors" placeholder="••••••••" required minlength="6">
                            <button type="button" id="toggle-login-pw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-sm">Show</button>
                        </div>
                    </div>
                    <button type="submit" id="login-btn" class="btn-primary w-full py-3 text-center rounded-lg font-semibold">
                        Sign In
                    </button>
                </form>
                <p class="text-center text-gray-400 mt-6 text-sm">
                    Don't have an account? <a href="#signup" class="text-electric hover:underline font-medium">Sign Up</a>
                </p>
            </div>
        </div>
    `;

    // Toggle password visibility
    document.getElementById('toggle-login-pw').addEventListener('click', function() {
        const pw = document.getElementById('login-password');
        if (pw.type === 'password') { pw.type = 'text'; this.textContent = 'Hide'; }
        else { pw.type = 'password'; this.textContent = 'Show'; }
    });

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) { showToast('Please fill all fields', 'error'); return; }
        if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }

        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>';

        try {
            const data = await api.post('/auth/login', { email, password });
            setToken(data.access_token);
            showToast('Login successful!', 'success');
            window.location.hash = '#dashboard';
        } catch (err) {
            // Error is handled by api.js
        } finally {
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    });
}

export function renderSignupPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="auth-page flex items-center justify-center px-4 py-8">
            <div class="glass-card-strong w-full max-w-md p-8 animate-fadeIn">
                <div class="text-center mb-8">
                    <h1 class="font-heading text-4xl font-bold gradient-text mb-2">🎯 CareerAI</h1>
                    <p class="text-gray-400">Create your account</p>
                </div>
                <form id="signup-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                            <input type="text" id="signup-name" class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-electric transition-colors" placeholder="John Doe" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                            <input type="email" id="signup-email" class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-electric transition-colors" placeholder="you@example.com" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                            <input type="password" id="signup-password" class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-electric transition-colors" placeholder="Min 6 characters" required minlength="6">
                        </div>
                        <div id="pw-strength" class="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div id="pw-strength-bar" class="h-full w-0 rounded-full transition-all duration-300"></div>
                        </div>
                        <p id="pw-strength-text" class="text-xs mt-1 text-gray-500"></p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                            <input type="password" id="signup-confirm" class="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-electric transition-colors" placeholder="Repeat password" required minlength="6">
                        </div>
                    </div>
                    <button type="submit" id="signup-btn" class="btn-primary w-full py-3 text-center rounded-lg font-semibold">
                        Create Account
                    </button>
                </form>
                <p class="text-center text-gray-400 mt-6 text-sm">
                    Already have an account? <a href="#login" class="text-electric hover:underline font-medium">Sign In</a>
                </p>
            </div>
        </div>
    `;

    // Password strength indicator
    document.getElementById('signup-password').addEventListener('input', function() {
        const val = this.value;
        const bar = document.getElementById('pw-strength-bar');
        const text = document.getElementById('pw-strength-text');
        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-emerald-500'];
        bar.className = `h-full rounded-full transition-all duration-300 ${colors[score] || ''}`;
        bar.style.width = `${score * 20}%`;
        text.textContent = levels[score] || '';
        text.className = `text-xs mt-1 ${score <= 1 ? 'text-red-400' : score <= 3 ? 'text-yellow-400' : 'text-green-400'}`;
    });

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('signup-btn');
        const full_name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (!full_name || !email || !password) { showToast('Please fill all fields', 'error'); return; }
        if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
        if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }

        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>';

        try {
            const data = await api.post('/auth/signup', { email, password, full_name });
            setToken(data.access_token);
            showToast('Account created successfully!', 'success');
            window.location.hash = '#profile';
        } catch (err) {
            // handled
        } finally {
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    });
}
