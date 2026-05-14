const passwordInput = document.getElementById("password") as HTMLInputElement;
const info = document.getElementById("info") as HTMLDivElement;
const strengthFill = document.getElementById("strengthFill") as HTMLDivElement;

const togglePasswordBtn = document.getElementById("togglePassword") as HTMLSpanElement;
const generateBtn = document.getElementById("generateBtn") as HTMLButtonElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;

passwordInput.addEventListener("input", analyzePassword);

togglePasswordBtn.addEventListener("click", togglePassword);
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);
clearBtn.addEventListener("click", clearPassword);

function analyzePassword(): void {

    const password: string = passwordInput.value;

    let score: number = 0;

    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
        spaces: !/\s/.test(password)
    };

    if (checks.length) score += 25;
    if (checks.uppercase) score += 15;
    if (checks.lowercase) score += 15;
    if (checks.number) score += 15;
    if (checks.symbol) score += 20;
    if (checks.spaces) score += 10;

    let color: string = "#ef4444";
    let status: string = "Weak";

    if (score >= 80) {
        color = "#22c55e";
        status = "Strong";
    } else if (score >= 50) {
        color = "#facc15";
        status = "Medium";
    }

    strengthFill.style.width = `${score}%`;
    strengthFill.style.background = color;

    const entropy: number = Math.round(password.length * Math.log2(94));

    (document.getElementById("length") as HTMLElement).innerText =
        password.length.toString();

    (document.getElementById("entropy") as HTMLElement).innerText =
        entropy.toString();

    (document.getElementById("score") as HTMLElement).innerText =
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

function togglePassword(): void {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function generatePassword(): void {

    const chars: string =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]";

    let password: string = "";

    for (let i = 0; i < 18; i++) {

        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    passwordInput.value = password;

    analyzePassword();
}

function copyPassword(): void {

    navigator.clipboard.writeText(passwordInput.value);

    (
        document.getElementById("copyMsg") as HTMLElement
    ).innerText = "Password copied to clipboard!";
}

function clearPassword(): void {

    passwordInput.value = "";

    analyzePassword();

    (
        document.getElementById("copyMsg") as HTMLElement
    ).innerText = "";
}
