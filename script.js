var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const passwordInput = document.getElementById("password");
const info = document.getElementById("info");
const strengthFill = document.getElementById("strengthFill");
const togglePasswordBtn = document.getElementById("togglePassword");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
passwordInput.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    yield analyzePassword();
}));
togglePasswordBtn.addEventListener("click", togglePassword);
generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);
clearBtn.addEventListener("click", clearPassword);
function analyzePassword() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = passwordInput.value;
        if (!password) {
            resetUI();
            return;
        }
        const lengthEl = document.getElementById("length");
        const entropyEl = document.getElementById("entropy");
        const scoreEl = document.getElementById("score");
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
        const entropy = calculateEntropy(password);
        const breachedCount = yield checkPwned(password);
        if (breachedCount > 0) {
            score -= 35;
        }
        score = Math.max(0, Math.min(score, 100));
        let color = "#444";
        let status = "Weak";
        if (score >= 80) {
            color = "#d4d4d4";
            status = "Strong";
        }
        else if (score >= 50) {
            color = "#888";
            status = "Medium";
        }
        else {
            color = "#555";
        }
        strengthFill.style.width = `${score}%`;
        strengthFill.style.background = color;
        lengthEl.innerText = password.length.toString();
        entropyEl.innerText = entropy.toFixed(1);
        scoreEl.innerText = `${score}%`;
        info.innerHTML = `<strong>Status:</strong> ${status}` +
            (breachedCount > 0 ? `<br><strong>Breached:</strong> ${breachedCount} time(s)` : "");
    });
}
function checkPwned(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const sha1Hash = yield sha1(password);
        const prefix = sha1Hash.substring(0, 5);
        const suffix = sha1Hash.substring(5).toUpperCase();
        try {
            const response = yield fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            const text = yield response.text();
            const hashes = text.split("\n");
            for (const hash of hashes) {
                const [hashSuffix, count] = hash.trim().split(":");
                if (hashSuffix === suffix) {
                    return parseInt((count || "0").trim(), 10);
                }
            }
            return 0;
        }
        catch (error) {
            console.error(error);
            return 0;
        }
    });
}
function sha1(str) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = yield crypto.subtle.digest("SHA-1", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase();
    });
}
function calculateEntropy(password) {
    let poolSize = 0;
    if (/[A-Z]/.test(password))
        poolSize += 26;
    if (/[a-z]/.test(password))
        poolSize += 26;
    if (/[0-9]/.test(password))
        poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password))
        poolSize += 32;
    return poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
}
function togglePassword() {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
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
    document.getElementById("copyMsg").innerText = "Password copied";
}
function clearPassword() {
    passwordInput.value = "";
    resetUI();
}
function resetUI() {
    strengthFill.style.width = "0%";
    info.innerHTML = "";
    document.getElementById("length").innerText = "0";
    document.getElementById("entropy").innerText = "0";
    document.getElementById("score").innerText = "0%";
    document.getElementById("copyMsg").innerText = "";
}
export {};
//# sourceMappingURL=script.js.map