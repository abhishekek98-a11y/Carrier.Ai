// frontend/js/profile.js
import { api } from './api.js';
import { showToast } from './utils.js';

const SKILLS_LIST = [
    "Python","JavaScript","Java","C++","C","C#","TypeScript","Ruby","PHP","Swift","Kotlin","Go","Rust","R",
    "HTML","CSS","React","Angular","Vue.js","Svelte","Next.js","Node.js","Express.js","Django","Flask","FastAPI","Spring Boot",
    "SQL","MySQL","PostgreSQL","Oracle","MongoDB","Cassandra","Redis","Elasticsearch",
    "AWS","Azure","GCP","Docker","Kubernetes","Jenkins","Terraform","Ansible","Linux","Bash",
    "Machine Learning","Deep Learning","TensorFlow","PyTorch","Scikit-learn","Pandas","NumPy","Data Analysis","Data Visualization","Tableau","Power BI","Statistics","Mathematics",
    "Git","GitHub","Agile","Scrum","Networking","Security","Cryptography","Penetration Testing",
    "Figma","Adobe XD","Wireframing","Prototyping","UI/UX",
    "Android","iOS","React Native","Flutter","Blockchain","Solidity","Unity","Unreal Engine",
    "API Design","REST API","GraphQL","Microservices","System Design","Embedded Systems","IoT"
];

const INTERESTS = ["AI/ML","Web Development","Mobile Development","Data Science","Cybersecurity","Cloud Computing","Blockchain","IoT","Game Development","UI/UX Design"];

export function renderProfilePage(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="font-heading text-3xl font-bold flex items-center gap-3">
                        <span class="icon-badge">🎓</span> Student Profile
                    </h1>
                    <p class="text-gray-400 text-sm mt-1">Manage your academic background, technical skills, and career interests</p>
                </div>
            </div>

            <div id="profile-content">
                <div class="flex justify-center py-16">
                    <div class="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    `;
    loadProfile();
}

async function loadProfile() {
    const ct = document.getElementById('profile-content');
    try {
        const profile = await api.get('/profile');
        renderProfileForm(ct, profile);
    } catch {
        renderProfileForm(ct, {});
    }
}

function renderProfileForm(ct, profile) {
    const skills = profile.skills || [];
    const interests = profile.interests || [];

    ct.innerHTML = `
        <form id="profile-form" class="space-y-6">
            <!-- Academic Information -->
            <div class="glass-card p-6 md:p-8">
                <h2 class="font-heading text-xl font-bold mb-5 flex items-center gap-3 text-white border-b border-white/10 pb-3">
                    <span class="icon-badge icon-badge-emerald">📋</span> Academic Details
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">College / University</label>
                        <input type="text" id="prof-college" value="${profile.college || ''}" class="w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all" placeholder="e.g. Stanford University">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Current Semester</label>
                        <select id="prof-semester" class="w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all">
                            <option value="">Select Semester</option>
                            ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${profile.semester == s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">CGPA (Out of 10.0)</label>
                        <input type="number" id="prof-cgpa" value="${profile.cgpa || ''}" min="0" max="10" step="0.1" class="w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all" placeholder="e.g. 8.7">
                    </div>
                </div>
            </div>

            <!-- Skills Section -->
            <div class="glass-card p-6 md:p-8">
                <h2 class="font-heading text-xl font-bold mb-5 flex items-center gap-3 text-white border-b border-white/10 pb-3">
                    <span class="icon-badge icon-badge-violet">💻</span> Technical Skills
                </h2>
                <div class="relative mb-4">
                    <input type="text" id="skill-input" class="w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all" placeholder="Type a skill (e.g. Python, React) and press Enter..." autocomplete="off">
                    <div id="skill-dropdown" class="hidden absolute z-20 left-0 right-0 mt-2 max-h-48 overflow-y-auto glass-card-strong rounded-xl custom-scrollbar border border-white/15 shadow-2xl"></div>
                </div>
                <div id="skills-tags" class="flex flex-wrap gap-2 mb-3">
                    ${skills.map(s => `
                        <span class="skill-tag success animate-fadeIn">
                            ${s}
                            <button type="button" class="ml-1 text-xs text-emerald-400 hover:text-emerald-200 transition-colors" onclick="window.profileRemoveSkill(this, '${s}')">✕</button>
                        </span>
                    `).join('')}
                </div>
                <p class="text-xs text-gray-400 font-medium">
                    <span id="skills-count" class="text-emerald-400 font-bold">${skills.length}</span> skills added to profile
                </p>
            </div>

            <!-- Interests Section -->
            <div class="glass-card p-6 md:p-8">
                <h2 class="font-heading text-xl font-bold mb-5 flex items-center gap-3 text-white border-b border-white/10 pb-3">
                    <span class="icon-badge icon-badge-amber">🎯</span> Career Interests
                </h2>
                <div id="interest-chips" class="flex flex-wrap gap-2.5">
                    ${INTERESTS.map(i => `
                        <button type="button" class="skill-tag cursor-pointer transition-all ${interests.includes(i) ? 'success ring-2 ring-emerald-400/50' : 'hover:bg-white/10'}" onclick="window.profileToggleInterest(this, '${i}')">
                            ${i}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Aptitude Score Section -->
            <div class="glass-card p-6 md:p-8">
                <h2 class="font-heading text-xl font-bold mb-5 flex items-center gap-3 text-white border-b border-white/10 pb-3">
                    <span class="icon-badge">📊</span> Self-Assessed Aptitude Score
                </h2>
                <div class="flex items-center gap-6">
                    <input type="range" id="prof-aptitude" min="0" max="100" value="${profile.aptitude_score || 50}" class="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500">
                    <span id="aptitude-val" class="font-heading text-3xl font-bold text-blue-400 min-w-[3rem] text-right">${profile.aptitude_score || 50}</span>
                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="save-profile-btn" class="btn-primary w-full py-4 text-base font-bold rounded-xl shadow-lg shadow-blue-500/25">
                💾 Save Profile Changes
            </button>
        </form>
    `;

    // Skills state
    let currentSkills = [...skills];

    // Aptitude slider listener
    document.getElementById('prof-aptitude').addEventListener('input', function() {
        document.getElementById('aptitude-val').textContent = this.value;
    });

    // Skills autocomplete
    const input = document.getElementById('skill-input');
    const dropdown = document.getElementById('skill-dropdown');

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase().trim();
        if (!val) { dropdown.classList.add('hidden'); return; }
        const matches = SKILLS_LIST.filter(s => s.toLowerCase().includes(val) && !currentSkills.map(x => x.toLowerCase()).includes(s.toLowerCase())).slice(0, 8);
        if (matches.length === 0) { dropdown.classList.add('hidden'); return; }
        dropdown.innerHTML = matches.map(s => `
            <div class="px-4 py-2.5 hover:bg-blue-500/20 cursor-pointer text-sm transition-colors text-gray-200" onclick="window.profileAddSkillFromDropdown('${s}')">${s}</div>
        `).join('');
        dropdown.classList.remove('hidden');
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = this.value.trim();
            if (val && !currentSkills.map(x => x.toLowerCase()).includes(val.toLowerCase())) {
                addSkillTag(val);
            }
            this.value = '';
            dropdown.classList.add('hidden');
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#skill-input') && !e.target.closest('#skill-dropdown')) {
            dropdown.classList.add('hidden');
        }
    });

    function addSkillTag(skill) {
        currentSkills.push(skill);
        const container = document.getElementById('skills-tags');
        const tag = document.createElement('span');
        tag.className = 'skill-tag success animate-fadeIn';
        tag.innerHTML = `${skill} <button type="button" class="ml-1 text-xs text-emerald-400 hover:text-emerald-200 transition-colors" onclick="window.profileRemoveSkill(this, '${skill}')">✕</button>`;
        container.appendChild(tag);
        document.getElementById('skills-count').textContent = currentSkills.length;
    }

    window.profileAddSkillFromDropdown = function(skill) {
        addSkillTag(skill);
        input.value = '';
        dropdown.classList.add('hidden');
    };

    window.profileRemoveSkill = function(btn, skill) {
        currentSkills = currentSkills.filter(s => s !== skill);
        btn.parentElement.remove();
        document.getElementById('skills-count').textContent = currentSkills.length;
    };

    // Interest toggle
    window.profileToggleInterest = function(btn) {
        btn.classList.toggle('success');
        btn.classList.toggle('ring-2');
        btn.classList.toggle('ring-emerald-400/50');
    };

    // Save form submit
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-profile-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Saving...';

        const selectedInterests = [];
        document.querySelectorAll('#interest-chips .success').forEach(el => {
            selectedInterests.push(el.textContent.trim());
        });

        const data = {
            college: document.getElementById('prof-college').value.trim(),
            semester: parseInt(document.getElementById('prof-semester').value) || null,
            cgpa: parseFloat(document.getElementById('prof-cgpa').value) || null,
            skills: currentSkills,
            interests: selectedInterests,
            aptitude_score: parseInt(document.getElementById('prof-aptitude').value) || 50
        };

        try {
            await api.put('/profile', data);
            showToast('Profile saved successfully!', 'success');
        } catch {
            // Handled in api.js
        } finally {
            btn.disabled = false;
            btn.innerHTML = '💾 Save Profile Changes';
        }
    });
}
