// frontend/js/profile.js
import { api } from './api.js';
import { showToast, showLoading, hideLoading } from './utils.js';

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
        <div class="max-w-3xl mx-auto animate-fadeIn">
            <h1 class="font-heading text-3xl font-bold mb-6 flex items-center gap-3">🎓 Student Profile</h1>
            <div id="profile-content">
                <div class="flex justify-center py-12"><div class="w-10 h-10 border-4 border-white/10 border-t-electric rounded-full animate-spin"></div></div>
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
            <div class="glass-card p-6">
                <h2 class="font-heading text-xl font-semibold mb-4 flex items-center gap-2">📋 Personal Info</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">College Name</label>
                        <input type="text" id="prof-college" value="${profile.college || ''}" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric transition-colors" placeholder="Your college">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Semester</label>
                        <select id="prof-semester" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric transition-colors bg-[#0a0e27]">
                            <option value="">Select</option>
                            ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${profile.semester == s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">CGPA (0-10)</label>
                        <input type="number" id="prof-cgpa" value="${profile.cgpa || ''}" min="0" max="10" step="0.1" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric transition-colors" placeholder="e.g. 8.5">
                    </div>
                </div>
            </div>

            <div class="glass-card p-6">
                <h2 class="font-heading text-xl font-semibold mb-4 flex items-center gap-2">💻 Skills</h2>
                <div class="relative mb-3">
                    <input type="text" id="skill-input" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric transition-colors" placeholder="Type a skill and press Enter..." autocomplete="off">
                    <div id="skill-dropdown" class="hidden absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto glass-card-strong rounded-lg custom-scrollbar"></div>
                </div>
                <div id="skills-tags" class="flex flex-wrap gap-2 mb-2">
                    ${skills.map(s => `<span class="skill-tag success">${s} <button type="button" class="ml-1 text-xs opacity-60 hover:opacity-100" onclick="window.profileRemoveSkill(this, '${s}')">✕</button></span>`).join('')}
                </div>
                <p class="text-xs text-gray-500"><span id="skills-count">${skills.length}</span> skills added</p>
            </div>

            <div class="glass-card p-6">
                <h2 class="font-heading text-xl font-semibold mb-4 flex items-center gap-2">🎯 Interests</h2>
                <div id="interest-chips" class="flex flex-wrap gap-2">
                    ${INTERESTS.map(i => `<button type="button" class="skill-tag cursor-pointer transition-all ${interests.includes(i) ? 'success ring-1 ring-emerald-400' : ''}" onclick="window.profileToggleInterest(this, '${i}')">${i}</button>`).join('')}
                </div>
            </div>

            <div class="glass-card p-6">
                <h2 class="font-heading text-xl font-semibold mb-4 flex items-center gap-2">📊 Aptitude Score</h2>
                <div class="flex items-center gap-4">
                    <input type="range" id="prof-aptitude" min="0" max="100" value="${profile.aptitude_score || 50}" class="flex-1 accent-electric">
                    <span id="aptitude-val" class="font-heading text-2xl font-bold text-electric w-12 text-right">${profile.aptitude_score || 50}</span>
                </div>
            </div>

            <button type="submit" id="save-profile-btn" class="btn-primary w-full py-3 rounded-lg font-semibold text-center">
                💾 Save Profile
            </button>
        </form>
    `;

    // Skills state
    let currentSkills = [...skills];

    // Aptitude slider
    document.getElementById('prof-aptitude').addEventListener('input', function() {
        document.getElementById('aptitude-val').textContent = this.value;
    });

    // Skills autocomplete
    const input = document.getElementById('skill-input');
    const dropdown = document.getElementById('skill-dropdown');

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase().trim();
        if (!val) { dropdown.classList.add('hidden'); return; }
        const matches = SKILLS_LIST.filter(s => s.toLowerCase().includes(val) && !currentSkills.map(x=>x.toLowerCase()).includes(s.toLowerCase())).slice(0, 8);
        if (matches.length === 0) { dropdown.classList.add('hidden'); return; }
        dropdown.innerHTML = matches.map(s => `<div class="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm transition-colors" onclick="window.profileAddSkillFromDropdown('${s}')">${s}</div>`).join('');
        dropdown.classList.remove('hidden');
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = this.value.trim();
            if (val && !currentSkills.map(x=>x.toLowerCase()).includes(val.toLowerCase())) {
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
        tag.innerHTML = `${skill} <button type="button" class="ml-1 text-xs opacity-60 hover:opacity-100" onclick="window.profileRemoveSkill(this, '${skill}')">✕</button>`;
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
    window.profileToggleInterest = function(btn, interest) {
        btn.classList.toggle('success');
        btn.classList.toggle('ring-1');
        btn.classList.toggle('ring-emerald-400');
    };

    // Save form
    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-profile-btn');
        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>';

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
            // handled
        } finally {
            btn.disabled = false;
            btn.innerHTML = '💾 Save Profile';
        }
    });
}
