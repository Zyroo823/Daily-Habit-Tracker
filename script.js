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