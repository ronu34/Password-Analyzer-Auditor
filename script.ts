const passwordInput = document.getElementById("password") as HTMLInputElement;
const info = document.getElementById("info") as HTMLDivElement;
const strengthFill = document.getElementById("strengthFill") as HTMLDivElement;

const togglePasswordBtn = document.getElementById("togglePassword") as HTMLSpanElement;
const generateBtn = document.getElementById("generateBtn") as HTMLButtonElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;

passwordInput.addEventListener("input", async () => {
    await analyzePassword();
});

togglePasswordBtn.addEventListener("click", togglePassword);
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);
clearBtn.addEventListener("click", clearPassword);

async function analyzePassword(): Promise<void> {
    const password: string = passwordInput.value;

    if (!password) {
        resetUI();
        return;
    }

    const lengthEl = document.getElementById("length") as HTMLElement;
    const entropyEl = document.getElementById("entropy") as HTMLElement;
    const scoreEl = document.getElementById("score") as HTMLElement;

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

    const entropy = calculateEntropy(password);
    const breachedCount = await checkPwned(password);

    if (breachedCount > 0) {
        score -= 35;
    }

    score = Math.max(0, Math.min(score, 100));

    let color: string = "#444";
    let status: string = "Weak";

    if (score >= 80) {
        color = "#d4d4d4";
        status = "Strong";
    } else if (score >= 50) {
        color = "#888";
        status = "Medium";
    } else {
        color = "#555";
    }

    strengthFill.style.width = `${score}%`;
    strengthFill.style.background = color;

    lengthEl.innerText = password.length.toString();
    entropyEl.innerText = entropy.toFixed(1);
    scoreEl.innerText = `${score}%`;

    info.innerHTML = `<strong>Status:</strong> ${status}` +
        (breachedCount > 0 ? `<br><strong>Breached:</strong> ${breachedCount} time(s)` : "");
}

async function checkPwned(password: string): Promise<number> {
    const sha1Hash = await sha1(password);
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5).toUpperCase();

    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await response.text();
        const hashes = text.split("\n");

        for (const hash of hashes) {
            const [hashSuffix, count] = hash.trim().split(":");
            if (hashSuffix === suffix) {
                return parseInt((count || "0").trim(), 10);
            }
        }

        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

async function sha1(str: string): Promise<string> {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
}

function calculateEntropy(password: string): number {
    let poolSize = 0;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;
    return poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
}

function togglePassword(): void {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function generatePassword(): void {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]";
    let password = "";

    for (let i = 0; i < 18; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    passwordInput.value = password;
    analyzePassword();
}

function copyPassword(): void {
    navigator.clipboard.writeText(passwordInput.value);
    (document.getElementById("copyMsg") as HTMLElement).innerText = "Password copied";
}

function clearPassword(): void {
    passwordInput.value = "";
    resetUI();
}

function resetUI(): void {
    strengthFill.style.width = "0%";
    info.innerHTML = "";
    (document.getElementById("length") as HTMLElement).innerText = "0";
    (document.getElementById("entropy") as HTMLElement).innerText = "0";
    (document.getElementById("score") as HTMLElement).innerText = "0%";
    (document.getElementById("copyMsg") as HTMLElement).innerText = "";
}
