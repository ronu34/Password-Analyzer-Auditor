const passwordInput = document.getElementById("password");
const info = document.getElementById("info");
const strengthFill = document.getElementById("strengthFill");
const togglePasswordBtn = document.getElementById("togglePassword");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
passwordInput.addEventListener("input", analyzePassword);
togglePasswordBtn.addEventListener("click", togglePassword);
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);
clearBtn.addEventListener("click", clearPassword);
function analyzePassword() {
    const password = passwordInput.value;
    let score = 0;
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
        spaces: !/\s/.test(password)
    };
    if (checks.length)
        score += 25;
    if (checks.uppercase)
        score += 15;
    if (checks.lowercase)
        score += 15;
    if (checks.number)
        score += 15;
    if (checks.symbol)
        score += 20;
    if (checks.spaces)
        score += 10;
    let color = "#ef4444";
    let status = "Weak";
    if (score >= 80) {
        color = "#22c55e";
        status = "Strong";
    }
    else if (score >= 50) {
        color = "#facc15";
        status = "Medium";
    }
    strengthFill.style.width = `${score}%`;
    strengthFill.style.background = color;
    const entropy = Math.round(password.length * Math.log2(94));
    document.getElementById("length").innerText =
        password.length.toString();
    document.getElementById("entropy").innerText =
        entropy.toString();
    document.getElementById("score").innerText =
        `${score}%`;
    info.innerHTML = `
        <div class="${checks.length ? 'good' : 'bad'}">
            ${checks.length ? '✔' : '✖'} Minimum 12 Characters
        </div>

        <div class="${checks.uppercase ? 'good' : 'bad'}">
            ${checks.uppercase ? '✔' : '✖'} Uppercase Letters
        </div>

        <div class="${checks.lowercase ? 'good' : 'bad'}">
            ${checks.lowercase ? '✔' : '✖'} Lowercase Letters
        </div>

        <div class="${checks.number ? 'good' : 'bad'}">
            ${checks.number ? '✔' : '✖'} Numbers
        </div>

        <div class="${checks.symbol ? 'good' : 'bad'}">
            ${checks.symbol ? '✔' : '✖'} Symbols
        </div>

        <div class="${checks.spaces ? 'good' : 'bad'}">
            ${checks.spaces ? '✔' : '✖'} No Spaces
        </div>

        <div class="${score >= 80 ? 'good' : score >= 50 ? 'medium' : 'bad'}">
            🔒 Password Strength: ${status}
        </div>
    `;
}
function togglePassword() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    }
    else {
        passwordInput.type = "password";
    }
}
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]";
    let password = "";
    for (let i = 0; i < 18; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    passwordInput.value = password;
    analyzePassword();
}
function copyPassword() {
    navigator.clipboard.writeText(passwordInput.value);
    document.getElementById("copyMsg").innerText = "Password copied to clipboard!";
}
function clearPassword() {
    passwordInput.value = "";
    analyzePassword();
    document.getElementById("copyMsg").innerText = "";
}
export {};
//# sourceMappingURL=script.js.map