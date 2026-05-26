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

    // Dynamically updates mobile top row bar title text to match current tab view
    const spanElement = e.currentTarget.querySelector('span');
    const mobilePageTitle = document.getElementById('mobilePageTitle');
    if (spanElement && mobilePageTitle) {
        mobilePageTitle.textContent = spanElement.textContent.trim();
    }

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');

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
    }
}

function toggleHabitCompletion(id) {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === id);

    if (habit) {
        if (habit.completedDates.includes(today)) {
            habit.completedDates = habit.completedDates.filter(d => d !== today);
        } else {
            habit.completedDates.push(today);
        }

        // Update streak
        updateStreak(habit);
        saveUserData();
        renderHabits();
        updateStats();
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
        }

        const weeklyRate = Math.round((weekCompleted / 7) * 100);

        const card = document.createElement('div');
        card.className = `habit-card ${isCompletedToday ? 'completed' : ''}`;
        card.style.borderLeftColor = habit.color;

        card.innerHTML = `
            <div class="habit-header">
                <div>
                    <h3 class="habit-title">${habit.name}</h3>
                    ${habit.description ? `<p class="habit-description">${habit.description}</p>` : ''}
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

    const chartContainer = document.querySelector('.weekly-chart');
    chartContainer.innerHTML = `
        <h3 class="card-title"><i class="fas fa-chart-bar"></i> Weekly Overview</h3>
        <div class="chart-container">
            ${data.map(d => `
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

function renderProfile() {
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

function toggleReminderTime() {
    const reminderTimeGroup = document.getElementById('reminderTimeGroup');
    if (document.getElementById('reminderToggle').checked) {
        reminderTimeGroup.classList.remove('hidden');
    } else {
        reminderTimeGroup.classList.add('hidden');
    }
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