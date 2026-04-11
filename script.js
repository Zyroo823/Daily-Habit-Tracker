
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
// FAKE LOGIN
// ===============================
loginFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        localStorage.setItem("user", JSON.stringify({ email }));

        loginSection.classList.add("hidden");
        appContainer.classList.remove("hidden");

        showToast("Login successful 🚀", "success");
    } else {
        showToast("Please fill all fields", "error");
    }
});

// ===============================
// SIGNUP
// ===============================
signupFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const pass = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirmPassword").value;
    document.getElementById("heroSection").style.display = "flex";

    if (pass !== confirm) {
        showToast("Passwords do not match ❌", "error");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ name, email }));

    signupForm.reset();

    showToast("Account created! You can login now 🎉", "success");

    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

// ===============================
// AUTO LOGIN (IF SAVED)
// ===============================
window.addEventListener("load", () => {
    const user = localStorage.getItem("user");

    if (user) {
        loginSection.classList.add("hidden");
        appContainer.classList.remove("hidden");
    }
});

const STORAGE_KEY = 'daily_habit_tracker_data';
const SUGGESTIONS = [
    { name: 'Morning Meditation', description: '10 minutes of mindfulness', emoji: '🧘' },
    { name: 'Exercise', description: '30 minutes of physical activity', emoji: '💪' },
    { name: 'Read', description: 'Read for at least 20 minutes', emoji: '📚' },
    { name: 'Hydration', description: 'Drink 8 glasses of water', emoji: '💧' },
    { name: 'Journaling', description: 'Write down your thoughts', emoji: '📝' },
    { name: 'Sleep', description: 'Get 7-8 hours of quality sleep', emoji: '😴' },
    { name: 'Healthy Eating', description: 'Eat nutritious meals', emoji: '🥗' },
    { name: 'Learning', description: 'Learn something new today', emoji: '🧠' },
];

const BADGES = [
    { id: 'first_habit', name: 'First Step', description: 'Create your first habit', icon: '🚀', condition: (stats) => stats.totalHabits >= 1 },
    { id: 'week_streak', name: 'Week Warrior', description: '7-day streak', icon: '🔥', condition: (stats) => stats.longestStreak >= 7 },
    { id: 'month_streak', name: 'Month Master', description: '30-day streak', icon: '⭐', condition: (stats) => stats.longestStreak >= 30 },
    { id: 'perfect_week', name: 'Perfect Week', description: '100% completion for a week', icon: '💯', condition: (stats) => stats.weeklyCompletionRate >= 100 },
    { id: 'five_habits', name: 'Habit Hero', description: 'Track 5 habits', icon: '🦸', condition: (stats) => stats.totalHabits >= 5 },
    { id: 'consistency', name: 'Consistency King', description: '90% overall completion', icon: '👑', condition: (stats) => stats.overallCompletionRate >= 90 },
];

// ============================================
// State Management
// ============================================

class HabitTracker {
    constructor() {
        this.habits = [];
        this.currentTab = 'dashboard';
        this.editingHabitId = null;
        this.loadData();
        this.initializeApp();
    }

    // ============================================
    // Data Management
    // ============================================

    loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.habits = JSON.parse(stored);
                this.resetDailyHabits();
            } catch (e) {
                console.error('Error loading data:', e);
                this.habits = [];
            }
        }
    }

    saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.habits));
    }

    resetDailyHabits() {
        const today = new Date().toISOString().split('T')[0];
        this.habits.forEach(habit => {
            if (habit.frequency === 'daily' && habit.lastResetDate !== today) {
                habit.lastResetDate = today;
                habit.completedToday = false;
            }
        });
        this.saveData();
    }

    // ============================================
    // Habit Operations
    // ============================================

    addHabit(name, description, color, frequency) {
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
        this.saveData();
        this.showToast(`Habit "${name}" created!`, 'success');
        return habit;
    }

    deleteHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (habit && confirm(`Delete "${habit.name}"?`)) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            this.saveData();
            this.showToast(`Habit deleted`, 'success');
        }
    }

    toggleHabit(habitId) {
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

        this.saveData();
    }

    updateStreak(habit) {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            if (habit.completedDates.includes(dateStr)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        habit.streak = streak;
        if (streak > habit.longestStreak) {
            habit.longestStreak = streak;
        }
    }

    // ============================================
    // Statistics
    // ============================================

    getStats() {
        const today = new Date().toISOString().split('T')[0];
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekStartStr = weekStart.toISOString().split('T')[0];

        let completedToday = 0;
        let weeklyCompletions = 0;
        let totalPossible = 0;
        let longestStreak = 0;

        this.habits.forEach(habit => {
            if (habit.completedToday) completedToday++;
            longestStreak = Math.max(longestStreak, habit.longestStreak);

            // Weekly calculation
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                totalPossible++;
                if (habit.completedDates.includes(dateStr)) {
                    weeklyCompletions++;
                }
            }
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
        this.showHeroOrApp();
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

        // Suggestions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.suggestion-item')) {
                const item = e.target.closest('.suggestion-item');
                const name = item.querySelector('.suggestion-name').textContent;
                const desc = item.querySelector('.suggestion-desc').textContent;
                this.addHabit(name, desc, '#7c5cff', 'daily');
                this.renderHabits();
                this.renderStats();
            }
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
        }

        grid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        moodTracker.classList.add('hidden');
        suggestionsContainer.classList.add('hidden');

        grid.innerHTML = this.habits.map(habit => this.createHabitCard(habit)).join('');

        // Add event listeners to habit cards
        document.querySelectorAll('[data-habit-id]').forEach(card => {
            const habitId = card.dataset.habitId;
            const checkbox = card.querySelector('.checkbox-toggle');
            const deleteBtn = card.querySelector('.delete-btn');

            checkbox.addEventListener('click', () => {
                this.toggleHabit(habitId);
                this.renderHabits();
                this.renderStats();
            });

            deleteBtn.addEventListener('click', () => {
                this.deleteHabit(habitId);
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
                </div>

                <div class="streak-container">
                    <span class="streak-flame">🔥</span>
                    <span class="streak-number">${habit.streak}</span>
                    <span class="streak-text">day streak</span>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${weeklyRate}%"></div>
                </div>
                <div class="progress-text">${weeklyRate}% this week</div>

                <div class="checkbox-toggle ${isCompletedToday ? 'completed' : ''}">
                    <div class="checkbox ${isCompletedToday ? 'checked' : ''}">
                        ${isCompletedToday ? '✓' : ''}
                    </div>
                    <div class="checkbox-label">
                        ${isCompletedToday ? 'Completed today!' : 'Mark as done'}
                    </div>
                </div>
            </div>
        `;
    }

    getWeeklyCompletionRate(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        let completed = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            if (habit.completedDates.includes(dateStr)) completed++;
        }

        return Math.round((completed / 7) * 100);
    }

    renderStats() {
        const stats = this.getStats();
        const grid = document.getElementById('statsGrid');

        grid.innerHTML = `
            <div class="glass-card stat-card">
                <div class="stat-label">Completed Today</div>
                <div class="stat-value">${stats.completedToday}/${stats.totalHabits}</div>
            </div>
            <div class="glass-card stat-card">
                <div class="stat-label">Weekly Completion</div>
                <div class="stat-value">${stats.weeklyCompletionRate}%</div>
            </div>
            <div class="glass-card stat-card">
                <div class="stat-label">Longest Streak</div>
                <div class="stat-value">${stats.longestStreak} 🔥</div>
            </div>
            <div class="glass-card stat-card">
                <div class="stat-label">Level</div>
                <div class="stat-value">${stats.currentLevel.level}</div>
            </div>
            <div class="glass-card stat-card">
                <div class="stat-label">Points</div>
                <div class="stat-value">${stats.points}</div>
            </div>
            <div class="glass-card stat-card">
                <div class="stat-label">Overall Completion</div>
                <div class="stat-value">${stats.overallCompletionRate}%</div>
            </div>
        `;

        this.renderWeeklyChart();
        this.renderProfileStats(stats);
    }

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
                <div class="chart-bar">
                    <div class="bar" style="height: ${height}px;" title="${completed}/${this.habits.length}"></div>
                    <div class="bar-label">${days[i]}</div>
                    <div class="bar-percentage">${Math.round(rate)}%</div>
                </div>
            `;
        }

        chartHTML += '</div>';
        chart.innerHTML = chartHTML;
    }

    renderBadges() {
        const badgesList = document.getElementById('badgesList');
        const unlockedBadges = this.getUnlockedBadges();

        badgesList.innerHTML = BADGES.map(badge => {
            const unlocked = unlockedBadges.some(b => b.id === badge.id);
            return `
                <div class="badge ${unlocked ? 'unlocked' : ''}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-desc">${badge.description}</div>
                </div>
            `;
        }).join('');
    }

    renderSuggestions() {
        const list = document.getElementById('suggestionsList');
        list.innerHTML = SUGGESTIONS.map(suggestion => `
            <div class="suggestion-item">
                <span class="suggestion-emoji">${suggestion.emoji}</span>
                <div class="suggestion-text">
                    <div class="suggestion-name">${suggestion.name}</div>
                    <div class="suggestion-desc">${suggestion.description}</div>
                </div>
            </div>
        `).join('');
    }

    renderProfileStats(stats) {
        const profileContent = document.getElementById('profileContent');
        profileContent.innerHTML = `
            <div class="profile-stat">
                <span class="profile-stat-label">Level</span>
                <span class="profile-stat-value">${stats.currentLevel.level} - ${stats.currentLevel.name}</span>
            </div>
            <div class="profile-stat">
                <span class="profile-stat-label">Total Points</span>
                <span class="profile-stat-value">${stats.points}</span>
            </div>
            <div class="profile-stat">
                <span class="profile-stat-label">Total Habits</span>
                <span class="profile-stat-value">${stats.totalHabits}</span>
            </div>
            <div class="profile-stat">
                <span class="profile-stat-label">Longest Streak</span>
                <span class="profile-stat-value">${stats.longestStreak} 🔥</span>
            </div>
            <div class="profile-stat">
                <span class="profile-stat-label">Badges Unlocked</span>
                <span class="profile-stat-value">${this.getUnlockedBadges().length}/${BADGES.length}</span>
            </div>
            <div class="profile-stat">
                <span class="profile-stat-label">Overall Completion</span>
                <span class="profile-stat-value">${stats.overallCompletionRate}%</span>
            </div>
        `;
    }

    selectMood(btn) {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    }

    // ============================================
    // Modal Management
    // ============================================

    openHabitModal() {
        const modal = document.getElementById('habitModal');
        const form = document.getElementById('habitForm');
        const title = document.getElementById('modalTitle');

        form.reset();
        title.textContent = 'Add New Habit';
        this.editingHabitId = null;
        document.getElementById('colorPreview').style.backgroundColor = '#7c5cff';

        modal.classList.remove('hidden');
        document.getElementById('habitName').focus();
    }

    closeHabitModal() {
        document.getElementById('habitModal').classList.add('hidden');
    }

    handleHabitSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('habitName').value.trim();
        const description = document.getElementById('habitDescription').value.trim();
        const color = document.getElementById('habitColor').value;
        const frequency = document.getElementById('habitFrequency').value;

        if (!name) {
            this.showToast('Please enter a habit name', 'error');
            return;
        }

        this.addHabit(name, description, color, frequency);
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
            }
        }
    }

    exportData() {
        const data = {
            habits: this.habits,
            exportDate: new Date().toISOString(),
            version: '1.0',
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

        this.showToast('Data exported successfully!', 'success');
    }

    clearData() {
        if (confirm('Are you sure? This will delete all habits but keep the app running.')) {
            this.habits = [];
            this.saveData();
            this.showToast('All habits cleared', 'success');
            this.renderHabits();
            this.renderStats();
            this.showHeroOrApp();
        }
    }

    resetApp() {
        if (confirm('Are you sure? This will reset the entire app to its initial state.')) {
            localStorage.clear();
            location.reload();
        }
    }

    // ============================================
    // Notifications
    // ============================================

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});

// ===============================
// TOAST FUNCTION
// ===============================
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}