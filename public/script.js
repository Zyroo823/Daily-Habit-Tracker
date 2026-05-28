<<<<<<< HEAD:script.js
// ============================================
// DAILY HABIT TRACKER PRO - JAVASCRIPT
// ============================================

// ============================================
// STATE MANAGEMENT
// ============================================

let currentUser = null;
let habits = [];
let editingHabitId = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupEventListeners();
    updateGreeting();
    setInterval(updateGreeting, 60000);
=======
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("appContainer").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
    
    // Add sign out button to profile tab
    addSignOutButton();
>>>>>>> main:public/script.js
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Auth Forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    document.getElementById('signupToggleBtn').addEventListener('click', toggleAuthForm);
    document.getElementById('loginToggleBtn').addEventListener('click', toggleAuthForm);

    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });

    // Habit Management
    document.getElementById('addHabitBtn').addEventListener('click', openHabitModal);
    document.getElementById('createFirstHabitBtn').addEventListener('click', openHabitModal);
    document.getElementById('habitForm').addEventListener('submit', handleAddHabit);
    document.getElementById('closeModalBtn').addEventListener('click', closeHabitModal);
    document.getElementById('cancelBtn').addEventListener('click', closeHabitModal);
    document.getElementById('reminderToggle').addEventListener('change', toggleReminderTime);

    // Settings
    document.getElementById('logoutBtn').addEventListener('click', showLogoutConfirm);
    document.getElementById('confirmLogoutBtn').addEventListener('click', handleLogout);
    document.getElementById('cancelLogoutBtn').addEventListener('click', closeLogoutModal);
    document.getElementById('notificationBtn').addEventListener('click', requestNotifications);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('clearBtn').addEventListener('click', clearAllData);
    document.getElementById('resetBtn').addEventListener('click', resetApp);

    // Sidebar
    document.getElementById('habitModal').addEventListener('click', (e) => {
        if (e.target.id === 'habitModal') closeHabitModal();
    });

    document.getElementById('logoutModal').addEventListener('click', (e) => {
        if (e.target.id === 'logoutModal') closeLogoutModal();
    });
}

// ============================================
// AUTHENTICATION
// ============================================

function toggleAuthForm() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('signupForm').classList.toggle('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    currentUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        avatar: email.split('@')[0].substring(0, 2).toUpperCase(),
        createdAt: new Date().toISOString(),
    };

    saveUserData();
    showApp();
    showToast('Welcome back!', 'success');
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    currentUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        createdAt: new Date().toISOString(),
    };

    saveUserData();
    showApp();
    showToast('Account created successfully!', 'success');
}

function handleLogout() {
    currentUser = null;
    habits = [];
    localStorage.removeItem('habitTrackerUser');
    localStorage.removeItem('habits');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('logoutModal').classList.add('hidden');
    document.getElementById('loginFormElement').reset();
    document.getElementById('signupFormElement').reset();
    showToast('Logged out successfully', 'success');
}

// ============================================
// USER DATA MANAGEMENT
// ============================================

function saveUserData() {
    localStorage.setItem('habitTrackerUser', JSON.stringify(currentUser));
    localStorage.setItem('habits', JSON.stringify(habits));
    updateUserDisplay();
}

function loadUserData() {
    const savedUser = localStorage.getItem('habitTrackerUser');
    const savedHabits = localStorage.getItem('habits');

    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            habits = savedHabits ? JSON.parse(savedHabits) : [];
            showApp();
        } catch (e) {
            console.error('Failed to load user data');
        }
    }
}

function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userAvatar').textContent = currentUser.avatar;
    }
}

function showApp() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    updateUserDisplay();
    renderHabits();
    updateStats();
    renderProfile();

    // Sets the baseline navbar text when a user opens up the dashboard
    const mobilePageTitle = document.getElementById('mobilePageTitle');
    if (mobilePageTitle) {
        mobilePageTitle.textContent = 'Dashboard';
    }
}

// ============================================
// TAB NAVIGATION
// ============================================

function handleTabChange(e) {
    const tabName = e.currentTarget.dataset.tab;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    e.currentTarget.classList.add('active');

<<<<<<< HEAD:script.js
    // Dynamically updates mobile top row bar title text to match current tab view
    const spanElement = e.currentTarget.querySelector('span');
    const mobilePageTitle = document.getElementById('mobilePageTitle');
    if (spanElement && mobilePageTitle) {
        mobilePageTitle.textContent = spanElement.textContent.trim();
=======
document.querySelector(".overlay").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.remove("active");
    document.querySelector(".overlay").classList.remove("active");
    document.querySelector(".menu-toggle").classList.remove("hidden");
});





// ============================================
// State Management
// ============================================

class HabitTracker {
    constructor(userId) {
        this.userId = userId;
        this.habits = [];
        this.currentTab = 'dashboard';
        this.editingHabitId = null;
        this.isLoading = false;
        this.loadData();
        this.initializeApp();
>>>>>>> main:public/script.js
    }

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');

<<<<<<< HEAD:script.js
    // Close sidebar on mobile
    closeSidebar();

    // Update content based on tab
    if (tabName === 'stats') {
        renderStats();
    } else if (tabName === 'profile') {
        renderProfile();
    }
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
}

// ============================================
// HABIT MANAGEMENT
// ============================================

function openHabitModal() {
    editingHabitId = null;
    document.getElementById('habitForm').reset();
    document.getElementById('modalTitle').textContent = 'Add New Habit';
    document.getElementById('reminderToggle').checked = false;
    document.getElementById('reminderTimeGroup').classList.add('hidden');
    document.getElementById('habitColor').value = '#7c5cff';
    updateColorPreview();
    document.getElementById('habitModal').classList.remove('hidden');
}

function closeHabitModal() {
    document.getElementById('habitModal').classList.add('hidden');
    editingHabitId = null;
}

function handleAddHabit(e) {
    e.preventDefault();

    const name = document.getElementById('habitName').value;
    const description = document.getElementById('habitDescription').value;
    const color = document.getElementById('habitColor').value;
    const frequency = document.getElementById('habitFrequency').value;
    const reminderEnabled = document.getElementById('reminderToggle').checked;
    const reminderTime = document.getElementById('reminderTime').value;

    if (!name.trim()) {
        showToast('Habit name is required', 'error');
        return;
    }

    if (editingHabitId) {
        // Update existing habit
        const habitIndex = habits.findIndex(h => h.id === editingHabitId);
        if (habitIndex !== -1) {
            habits[habitIndex] = {
                ...habits[habitIndex],
                name,
                description,
                color,
                frequency,
                reminderEnabled,
                reminderTime,
            };
            showToast('Habit updated successfully!', 'success');
        }
    } else {
        // Create new habit
        const newHabit = {
            id: Date.now().toString(),
            name,
            description,
            color,
            frequency,
            reminderEnabled,
            reminderTime,
            streak: 0,
            completedDates: [],
            createdAt: new Date().toISOString(),
        };
        habits.push(newHabit);
        showToast('Habit created successfully!', 'success');
    }

    saveUserData();
    renderHabits();
    closeHabitModal();
}

function deleteHabit(id) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits = habits.filter(h => h.id !== id);
        saveUserData();
        renderHabits();
        showToast('Habit deleted', 'success');
=======
    async loadData() {
        this.isLoading = true;
        this.showLoadingState();
        try {
            const snapshot = await db.collection('users').doc(this.userId).collection('habits').get();
            this.habits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            await this.resetDailyHabits();
        } catch (error) {
            console.error('Error loading data from Firestore:', error);
            this.showToast('Error loading data', 'error');
            this.habits = [];
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async saveData() {
        try {
            const batch = db.batch();
            const habitsRef = db.collection('users').doc(this.userId).collection('habits');
            
            // Delete all existing habits for this user
            const existingSnapshot = await habitsRef.get();
            existingSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            // Add all current habits
            this.habits.forEach(habit => {
                const habitRef = habitsRef.doc(habit.id);
                batch.set(habitRef, habit);
            });
            
            await batch.commit();
        } catch (error) {
            console.error('Error saving data to Firestore:', error);
            this.showToast('Error saving data', 'error');
        }
    }

    async resetDailyHabits() {
        const today = new Date().toISOString().split('T')[0];
        let needsSave = false;
        this.habits.forEach(habit => {
            if (habit.frequency === 'daily' && habit.lastResetDate !== today) {
                habit.lastResetDate = today;
                habit.completedToday = false;
                needsSave = true;
            }
        });
        if (needsSave) {
            await this.saveData();
        }
    }

    // ============================================
    // Habit Operations
    // ============================================

    async addHabit(name, description, color, frequency) {
        try {
            const habit = {
                id: Date.now().toString(),
                name,
                description,
                color,
                frequency,
                completedToday: false,
                completedDates: [],
                streak: 0,
                longestStreak: 0,
                createdDate: new Date().toISOString().split('T')[0],
                lastResetDate: new Date().toISOString().split('T')[0],
            };
            this.habits.push(habit);
            await this.saveData();
            this.showToast(`Habit "${name}" created!`, 'success');
            return habit;
        } catch (error) {
            console.error('Error adding habit:', error);
            this.showToast('Error creating habit', 'error');
            throw error;
        }
>>>>>>> main:public/script.js
    }
}

<<<<<<< HEAD:script.js
function toggleHabitCompletion(id) {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === id);

    if (habit) {
        if (habit.completedDates.includes(today)) {
            habit.completedDates = habit.completedDates.filter(d => d !== today);
        } else {
            habit.completedDates.push(today);
=======
    async deleteHabit(habitId) {
        try {
            const habit = this.habits.find(h => h.id === habitId);
            if (habit && confirm(`Delete "${habit.name}"?`)) {
                this.habits = this.habits.filter(h => h.id !== habitId);
                await this.saveData();
                this.showToast(`Habit deleted`, 'success');
            }
        } catch (error) {
            console.error('Error deleting habit:', error);
            this.showToast('Error deleting habit', 'error');
>>>>>>> main:public/script.js
        }
    }

<<<<<<< HEAD:script.js
        // Update streak
        updateStreak(habit);
        saveUserData();
        renderHabits();
        updateStats();
=======
    async toggleHabit(habitId) {
        try {
            const habit = this.habits.find(h => h.id === habitId);
            if (!habit) return;

            const today = new Date().toISOString().split('T')[0];
            habit.completedToday = !habit.completedToday;

            if (habit.completedToday) {
                if (!habit.completedDates.includes(today)) {
                    habit.completedDates.push(today);
                }
                this.updateStreak(habit);
                this.showToast(`Great! Keep it up! 🔥`, 'success');
            } else {
                habit.completedDates = habit.completedDates.filter(d => d !== today);
                this.updateStreak(habit);
            }

            await this.saveData();
        } catch (error) {
            console.error('Error toggling habit:', error);
            this.showToast('Error updating habit', 'error');
        }
>>>>>>> main:public/script.js
    }
}

function updateStreak(habit) {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        if (habit.completedDates.includes(dateStr)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    habit.streak = streak;
}

function renderHabits() {
    const habitsGrid = document.getElementById('habitsGrid');
    const emptyState = document.getElementById('emptyState');

    if (habits.length === 0) {
        habitsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    habitsGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    habitsGrid.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];

    habits.forEach(habit => {
        const isCompletedToday = habit.completedDates.includes(today);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        let weekCompleted = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            if (habit.completedDates.includes(dateStr)) {
                weekCompleted++;
            }
<<<<<<< HEAD:script.js
=======
        });

        const weeklyCompletionRate = totalPossible > 0 ? Math.round((weeklyCompletions / totalPossible) * 100) : 0;
        const overallCompletionRate = this.calculateOverallCompletion();

        return {
            totalHabits: this.habits.length,
            completedToday,
            weeklyCompletionRate,
            overallCompletionRate,
            longestStreak,
            currentLevel: this.calculateLevel(),
            points: this.calculatePoints(),
        };
    }

    calculateLevel() {
        const points = this.calculatePoints();
        if (points >= 1000) return { level: 5, name: 'Legend', color: '#FFD700' };
        if (points >= 500) return { level: 4, name: 'Master', color: '#7c5cff' };
        if (points >= 250) return { level: 3, name: 'Expert', color: '#00d9ff' };
        if (points >= 100) return { level: 2, name: 'Intermediate', color: '#7c5cff' };
        return { level: 1, name: 'Novice', color: '#a0aec0' };
    }

    calculatePoints() {
        return this.habits.reduce((total, habit) => {
            return total + (habit.longestStreak * 10) + (habit.completedDates.length * 5);
        }, 0);
    }

    calculateOverallCompletion() {
        if (this.habits.length === 0) return 0;
        const totalDays = this.habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
        const maxDays = this.habits.length * 365;
        return Math.round((totalDays / maxDays) * 100);
    }

    getUnlockedBadges() {
        const stats = this.getStats();
        return BADGES.filter(badge => badge.condition(stats));
    }

    // ============================================
    // UI Rendering
    // ============================================

    initializeApp() {
        this.setupEventListeners();
        this.renderHabits();
        this.renderStats();
        this.renderBadges();
        this.renderSuggestions();
        //this.showHeroOrApp();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.nav-item').dataset.tab));
        });

        // Hero
        document.getElementById('getStartedBtn').addEventListener('click', () => this.startApp());

        // Add Habit
        document.getElementById('addHabitBtn').addEventListener('click', () => this.openHabitModal());
        document.getElementById('createFirstHabitBtn').addEventListener('click', () => this.openHabitModal());

        // Suggestions
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.suggestion-item')) {
                const item = e.target.closest('.suggestion-item');
                const name = item.querySelector('.suggestion-name').textContent;
                const desc = item.querySelector('.suggestion-desc').textContent;
                await this.addHabit(name, desc, '#7c5cff', 'daily');
                this.renderHabits();
                this.renderStats();
            }
        });

        // Modal
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeHabitModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeHabitModal());
        document.getElementById('habitForm').addEventListener('submit', (e) => this.handleHabitSubmit(e));
        document.getElementById('habitModal').addEventListener('click', (e) => {
            if (e.target.id === 'habitModal') this.closeHabitModal();
        });

        // Color picker
        document.getElementById('habitColor').addEventListener('input', (e) => {
            document.getElementById('colorPreview').style.backgroundColor = e.target.value;
        });

        // Mood tracker
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e.target.closest('.mood-btn')));
        });


        // Settings
        document.getElementById('notificationBtn').addEventListener('click', () => this.requestNotification());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearData());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetApp());
    }

    showHeroOrApp() {
        const heroSection = document.getElementById('heroSection');
        const appContainer = document.getElementById('appContainer');


         loginSection.classList.add("hidden");
          heroSection.classList.add('hidden');
    appContainer.classList.remove('hidden');


    }

    startApp() {
        document.getElementById('heroSection').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        this.openHabitModal();
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');

        // Refresh stats if needed
        if (tabName === 'stats') {
            this.renderStats();
        }
    }

    renderHabits() {
        const grid = document.getElementById('habitsGrid');
        const emptyState = document.getElementById('emptyState');
        const moodTracker = document.getElementById('moodTracker');
        const suggestionsContainer = document.getElementById('suggestionsContainer');

        if (this.habits.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            moodTracker.classList.remove('hidden');
            suggestionsContainer.classList.remove('hidden');
            return;
>>>>>>> main:public/script.js
        }

        const weeklyRate = Math.round((weekCompleted / 7) * 100);

        const card = document.createElement('div');
        card.className = `habit-card ${isCompletedToday ? 'completed' : ''}`;
        card.style.borderLeftColor = habit.color;

<<<<<<< HEAD:script.js
        card.innerHTML = `
            <div class="habit-header">
                <div>
                    <h3 class="habit-title">${habit.name}</h3>
                    ${habit.description ? `<p class="habit-description">${habit.description}</p>` : ''}
=======
        // Add event listeners to habit cards
        document.querySelectorAll('[data-habit-id]').forEach(card => {
            const habitId = card.dataset.habitId;
            const checkbox = card.querySelector('.checkbox-toggle');
            const deleteBtn = card.querySelector('.delete-btn');

            checkbox.addEventListener('click', async () => {
                await this.toggleHabit(habitId);
                this.renderHabits();
                this.renderStats();
            });

            deleteBtn.addEventListener('click', async () => {
                await this.deleteHabit(habitId);
                this.renderHabits();
                this.renderStats();
                this.showHeroOrApp();
            });
        });
    }

    createHabitCard(habit) {
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completedDates.includes(today);
        const weeklyRate = this.getWeeklyCompletionRate(habit.id);

        return `
            <div class="habit-card" data-habit-id="${habit.id}">
                <div class="habit-header">
                    <div class="habit-info">
                        <div class="habit-name">${habit.name}</div>
                        <div class="habit-description">${habit.description}</div>
                    </div>
                    <div class="habit-actions">
                        <button class="habit-btn delete-btn" title="Delete">🗑️</button>
                    </div>
>>>>>>> main:public/script.js
                </div>
                <button class="habit-delete-btn" onclick="deleteHabit('${habit.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <div class="habit-streak">
                <i class="fas fa-fire"></i>
                <span class="habit-streak-count">${habit.streak}</span>
                <span>day streak</span>
            </div>

            <div class="habit-progress">
                <div class="habit-progress-label">
                    <span>This week</span>
                    <span style="color: var(--accent-cyan);">${weeklyRate}%</span>
                </div>
                <div class="habit-progress-bar">
                    <div class="habit-progress-fill" style="width: ${weeklyRate}%"></div>
                </div>
            </div>

            ${habit.reminderEnabled ? `
                <div class="habit-reminder">
                    <i class="fas fa-clock"></i>
                    <span>Reminder at ${habit.reminderTime}</span>
                </div>
            ` : ''}

            <button class="habit-toggle-btn ${isCompletedToday ? 'completed' : ''}" onclick="toggleHabitCompletion('${habit.id}')">
                <div class="habit-checkbox ${isCompletedToday ? 'checked' : ''}">
                    ${isCompletedToday ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <span>${isCompletedToday ? 'Completed today!' : 'Mark as done'}</span>
            </button>
        `;

        habitsGrid.appendChild(card);
    });

    updateStats();
}

// ============================================
// STATISTICS
// ============================================

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalHabits = habits.length;

    document.getElementById('completedToday').textContent = completedToday;
    document.getElementById('totalHabits').textContent = totalHabits;
    document.getElementById('totalHabitsCard').textContent = totalHabits;

    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    document.getElementById('longestStreakCard').textContent = longestStreak;

    const progressPercent = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    document.getElementById('progressFill').style.width = progressPercent + '%';
}

function renderStats() {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalHabits = habits.length;

    // Weekly completion rate
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let weekCompleted = 0;
    let weekTotal = 0;

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        habits.forEach(habit => {
            weekTotal++;
            if (habit.completedDates.includes(dateStr)) {
                weekCompleted++;
            }
        });
    }

    const weeklyCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);

    // Overall completion rate
    const totalDays = habits.length > 0 ? 30 : 1;
    let totalCompleted = 0;
    for (let i = 0; i < totalDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        habits.forEach(habit => {
            if (habit.completedDates.includes(dateStr)) {
                totalCompleted++;
            }
        });
    }

    const overallCompletionRate = totalDays > 0 ? Math.round((totalCompleted / (habits.length * totalDays)) * 100) : 0;

    // Calculate level and points
    const totalPoints = habits.reduce((sum, h) => sum + h.streak * 10, 0);
    const currentLevel = Math.floor(totalPoints / 100) + 1;

    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="glass-card">
            <div class="stat-label"><i class="fas fa-zap"></i> Completed Today</div>
            <div class="stat-value">${completedToday}/${totalHabits}</div>
        </div>
        <div class="glass-card">
            <div class="stat-label"><i class="fas fa-chart-line"></i> Weekly Rate</div>
            <div class="stat-value">${weeklyCompletionRate}%</div>
        </div>
        <div class="glass-card">
            <div class="stat-label"><i class="fas fa-fire"></i> Longest Streak</div>
            <div class="stat-value">${longestStreak}</div>
        </div>
        <div class="glass-card">
            <div class="stat-label"><i class="fas fa-trophy"></i> Level</div>
            <div class="stat-value">${currentLevel}</div>
        </div>
    `;

    // Render weekly chart
    renderWeeklyChart();

    // Render badges
    renderBadges(longestStreak, totalHabits, overallCompletionRate);
}

function renderWeeklyChart() {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        let completed = 0;
        habits.forEach(habit => {
            if (habit.completedDates.includes(dateStr)) completed++;
        });

        const maxHeight = habits.length > 0 ? (completed / habits.length) * 150 : 0;

        data.push({
            day: days[i],
            completed,
            height: Math.max(maxHeight, 10),
        });
    }

<<<<<<< HEAD:script.js
    const chartContainer = document.querySelector('.weekly-chart');
    chartContainer.innerHTML = `
        <h3 class="card-title"><i class="fas fa-chart-bar"></i> Weekly Overview</h3>
        <div class="chart-container">
            ${data.map(d => `
=======
    renderWeeklyChart() {
        const chart = document.getElementById('weeklyChart');
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let chartHTML = '<h3 class="card-title">Weekly Overview</h3><div class="chart-container">';

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            let completed = 0;
            this.habits.forEach(habit => {
                if (habit.completedDates.includes(dateStr)) completed++;
            });

            const rate = this.habits.length > 0 ? (completed / this.habits.length) * 100 : 0;
            const height = Math.max(rate, 5);

            chartHTML += `
>>>>>>> main:public/script.js
                <div class="chart-bar">
                    <div class="chart-bar-fill" style="height: ${d.height}px;" title="${d.completed} completed"></div>
                    <div class="chart-bar-label">${d.day}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderBadges(longestStreak, totalHabits, overallCompletionRate) {
    const badgeDefinitions = [
        { 
            id: 'week_warrior',
            name: 'Week Warrior', 
            icon: 'fa-medal', 
            desc: '7 Day Streak',
            unlocked: longestStreak >= 7 
        },
        { 
            id: 'month_master',
            name: 'Month Master', 
            icon: 'fa-star', 
            desc: '30 Day Streak',
            unlocked: longestStreak >= 30 
        },
        { 
            id: 'habit_master',
            name: 'Habit Master', 
            icon: 'fa-bullseye', 
            desc: 'Track 5+ Habits',
            unlocked: totalHabits >= 5 
        },
        { 
            id: 'consistency_pro',
            name: 'Consistency Pro', 
            icon: 'fa-bolt', 
            desc: '80%+ Completion',
            unlocked: overallCompletionRate >= 80 
        }
    ];

    const badgesList = document.getElementById('badgesList');
    
    badgesList.innerHTML = badgeDefinitions.map(badge => `
        <div class="badge-card ${badge.unlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon-wrapper">
                <i class="fas ${badge.icon}"></i>
            </div>
            <div class="badge-info">
                <span class="badge-name">${badge.name}</span>
                <span class="badge-desc">${badge.desc}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// PROFILE
// ============================================

<<<<<<< HEAD:script.js
function renderProfile() {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalHabits = habits.length;
=======
    showLoadingState() {
        const grid = document.getElementById('habitsGrid');
        if (grid) {
            grid.innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    hideLoadingState() {
        const loading = document.querySelector('.loading');
        if (loading) loading.remove();
    }

    // ============================================
    // Modal Management
    // ============================================
>>>>>>> main:public/script.js

    // Weekly completion rate
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let weekCompleted = 0;
    let weekTotal = 0;

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

<<<<<<< HEAD:script.js
        habits.forEach(habit => {
            weekTotal++;
            if (habit.completedDates.includes(dateStr)) {
                weekCompleted++;
=======
        modal.classList.remove('hidden');
        document.getElementById('habitName').focus();
    }

    closeHabitModal() {
        document.getElementById('habitModal').classList.add('hidden');
    }

    async handleHabitSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('habitName').value.trim();
        const description = document.getElementById('habitDescription').value.trim();
        const color = document.getElementById('habitColor').value;
        const frequency = document.getElementById('habitFrequency').value;

        if (!name) {
            this.showToast('Please enter a habit name', 'error');
            return;
        }

        await this.addHabit(name, description, color, frequency);
        this.closeHabitModal();
        this.renderHabits();
        this.renderStats();
        this.showHeroOrApp();
    }

    // ============================================
    // Settings
    // ============================================

    requestNotification() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Daily Habit Tracker', {
                    body: 'You have habits to complete today! 🔥',
                    icon: '📊',
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Notifications enabled!', {
                            body: 'You will receive daily reminders',
                            icon: '📊',
                        });
                    }
                });
>>>>>>> main:public/script.js
            }
        });
    }

    const weeklyCompletionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);

    // Overall completion rate
    const totalDays = habits.length > 0 ? 30 : 1;
    let totalCompleted = 0;
    for (let i = 0; i < totalDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        habits.forEach(habit => {
            if (habit.completedDates.includes(dateStr)) {
                totalCompleted++;
            }
        });
    }

<<<<<<< HEAD:script.js
    const overallCompletionRate = totalDays > 0 ? Math.round((totalCompleted / (habits.length * totalDays)) * 100) : 0;
=======
    async clearData() {
        if (confirm('Are you sure? This will delete all habits but keep the app running.')) {
            this.habits = [];
            await this.saveData();
            this.showToast('All habits cleared', 'success');
            this.renderHabits();
            this.renderStats();
            this.showHeroOrApp();
        }
    }
>>>>>>> main:public/script.js

    // Calculate level and points
    const totalPoints = habits.reduce((sum, h) => sum + h.streak * 10, 0);
    const currentLevel = Math.floor(totalPoints / 100) + 1;

    const profileCard = document.getElementById('profileContent');
    profileCard.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${currentUser.avatar}</div>
            <div>
                <h2>${currentUser.name}</h2>
                <p>${currentUser.email}</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Member since ${new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
        </div>

        <div class="profile-stats">
            <div class="profile-stat">
                <div class="profile-stat-label">Level</div>
                <div class="profile-stat-value">${currentLevel}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Points</div>
                <div class="profile-stat-value">${totalPoints}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Habits</div>
                <div class="profile-stat-value">${totalHabits}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Streak</div>
                <div class="profile-stat-value">${longestStreak}</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Overall</div>
                <div class="profile-stat-value">${overallCompletionRate}%</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-label">Weekly</div>
                <div class="profile-stat-value">${weeklyCompletionRate}%</div>
            </div>
        </div>
    `;
}

// ============================================
// SETTINGS
// ============================================

<<<<<<< HEAD:script.js
function toggleReminderTime() {
    const reminderTimeGroup = document.getElementById('reminderTimeGroup');
    if (document.getElementById('reminderToggle').checked) {
        reminderTimeGroup.classList.remove('hidden');
    } else {
        reminderTimeGroup.classList.add('hidden');
    }
=======
// HabitTracker is now initialized by Firebase auth state listener


// ===============================
// ELEMENTS
// ===============================
const loginSection = document.getElementById("loginSection");
const appContainer = document.getElementById("appContainer");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const signupToggleBtn = document.getElementById("signupToggleBtn");
const loginToggleBtn = document.getElementById("loginToggleBtn");

const loginFormElement = document.getElementById("loginFormElement");
const signupFormElement = document.getElementById("signupFormElement");

// ===============================
// TOGGLE FORMS
// ===============================
signupToggleBtn.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
});

loginToggleBtn.addEventListener("click", () => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

// ===============================
// VALIDATION FUNCTIONS
// ===============================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
>>>>>>> main:public/script.js
}

function updateColorPreview() {
    const color = document.getElementById('habitColor').value;
    document.getElementById('colorPreview').style.backgroundColor = color;
}

document.getElementById('habitColor').addEventListener('change', updateColorPreview);

function requestNotifications() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Habit Tracker', {
                body: 'Notifications are already enabled!',
                icon: '📊',
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Notifications Enabled!', {
                        body: 'You will receive daily reminders for your habits.',
                        icon: '📊',
                    });
                    showToast('Notifications enabled!', 'success');
                }
            });
        }
    } else {
        showToast('Notifications not supported', 'error');
    }
}

<<<<<<< HEAD:script.js
function exportData() {
    const data = {
        user: currentUser,
        habits: habits,
        exportDate: new Date().toISOString(),
        version: '2.0',
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
}

function clearAllData() {
    if (confirm('Are you sure? This will delete all habits but keep the app running.')) {
        habits = [];
        saveUserData();
        renderHabits();
        updateStats();
        showToast('All habits cleared', 'success');
    }
}
=======
// ===============================
// LOGIN WITH FIREBASE
// ===============================
loginFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Validate email format
    if (!validateEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return;
    }

    // Validate password
    if (!password) {
        showToast("Please enter your password", "error");
        return;
    }

    try {
        // Sign in with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showToast("Login successful 🚀", "success");
    } catch (error) {
        console.error("Login error:", error);
        switch (error.code) {
            case 'auth/user-not-found':
                showToast("No account found with this email. Please sign up.", "error");
                break;
            case 'auth/wrong-password':
                showToast("Incorrect password. Please try again.", "error");
                break;
            case 'auth/invalid-email':
                showToast("Invalid email address.", "error");
                break;
            default:
                showToast("Login failed. Please try again.", "error");
        }
    }
});

// ===============================
// SIGNUP WITH FIREBASE
// ===============================
signupFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirmPassword").value;

    // Validate name
    if (name.length < 2) {
        showToast("Name must be at least 2 characters", "error");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return;
    }

    // Validate password strength
    if (!validatePassword(pass)) {
        const strength = getPasswordStrength(pass);
        showToast(strength.message, "error");
        return;
    }

    // Validate password confirmation
    if (pass !== confirm) {
        showToast("Passwords do not match ❌", "error");
        return;
    }

    try {
        // Create user with Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        
        // Update user profile with display name
        await userCredential.user.updateProfile({ displayName: name });
        
        // Store additional user data in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        signupForm.reset();
        showToast("Account created! 🎉", "success");
    } catch (error) {
        console.error("Signup error:", error);
        switch (error.code) {
            case 'auth/email-already-in-use':
                showToast("An account with this email already exists", "error");
                break;
            case 'auth/weak-password':
                showToast("Password is too weak. Please use a stronger password.", "error");
                break;
            case 'auth/invalid-email':
                showToast("Invalid email address.", "error");
                break;
            default:
                showToast("Signup failed. Please try again.", "error");
        }
    }
});



// ===============================
// FIREBASE AUTH STATE LISTENER
// ===============================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        loginSection.classList.add("hidden");
        appContainer.classList.remove("hidden");
        
        // Initialize or load habit tracker for this user
        if (!window.habitTracker) {
            window.habitTracker = new HabitTracker(user.uid);
        }
    } else {
        // User is signed out
        loginSection.classList.remove("hidden");
        appContainer.classList.add("hidden");
        
        // Clear habit tracker instance
        if (window.habitTracker) {
            window.habitTracker = null;
        }
    }
});

// ===============================
// SIGN OUT FUNCTION
// ===============================
async function signOut() {
    try {
        await auth.signOut();
        showToast("Signed out successfully", "success");
    } catch (error) {
        console.error("Sign out error:", error);
        showToast("Sign out failed", "error");
    }
}

// Add sign out button to profile tab
function addSignOutButton() {
    const profileTab = document.getElementById('profileTab');
    const signOutBtn = document.createElement('button');
    signOutBtn.className = 'settings-button danger';
    signOutBtn.textContent = 'Sign Out';
    signOutBtn.addEventListener('click', signOut);
    
    const profileContent = document.getElementById('profileContent');
    profileContent.appendChild(signOutBtn);
}
// ===============================
// TOAST FUNCTION
// ===============================
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
>>>>>>> main:public/script.js

function resetApp() {
    if (confirm('Are you sure? This will reset the entire app to its initial state.')) {
        handleLogout();
    }
}

function showLogoutConfirm() {
    document.getElementById('logoutModal').classList.remove('hidden');
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.add('hidden');
}

// ============================================
// UI UTILITIES
// ============================================

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Morning';

    if (hour >= 12 && hour < 18) {
        greeting = 'Good Afternoon';
    } else if (hour >= 18) {
        greeting = 'Good Evening';
    }

    const greetingTitle = document.getElementById('greetingTitle');
    if (greetingTitle) {
        greetingTitle.textContent = greeting + ', ' + (currentUser?.name?.split(' ')[0] || 'User');
    }

    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Update color layout trigger
updateColorPreview();

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}