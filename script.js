// DOM Elements
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const feedbackDiv = document.getElementById('feedback');
const lengthSpan = document.getElementById('length');
const crackTimeSpan = document.getElementById('crackTime');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');

// Requirements elements
const requirements = {
    length: document.getElementById('req-length'),
    uppercase: document.getElementById('req-uppercase'),
    lowercase: document.getElementById('req-lowercase'),
    number: document.getElementById('req-number'),
    special: document.getElementById('req-special')
};

// Password validation patterns
const patterns = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/
};

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
});

// Check password strength in real-time
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    // Update length
    lengthSpan.textContent = password.length;
    
    // Check requirements
    const checks = checkRequirements(password);
    
    // Update requirement UI
    updateRequirementsUI(checks);
    
    // Calculate strength
    const strength = calculateStrength(password, checks);
    
    // Update strength bar
    updateStrengthBar(strength);
    
    // Update feedback
    updateFeedback(password, checks, strength);
    
    // Calculate crack time
    const crackTime = calculateCrackTime(password);
    crackTimeSpan.textContent = crackTime;
});

// Check password requirements
function checkRequirements(password) {
    return {
        length: password.length >= 8,
        uppercase: patterns.uppercase.test(password),
        lowercase: patterns.lowercase.test(password),
        number: patterns.number.test(password),
        special: patterns.special.test(password)
    };
}

// Update requirements UI
function updateRequirementsUI(checks) {
    Object.keys(checks).forEach(key => {
        const element = requirements[key];
        if (checks[key]) {
            element.classList.add('met');
            element.classList.remove('unmet');
            element.querySelector('.icon').textContent = '✓';
        } else {
            element.classList.remove('met');
            element.classList.add('unmet');
            element.querySelector('.icon').textContent = '○';
        }
    });
}

// Calculate password strength
function calculateStrength(password, checks) {
    if (!password) return 0;
    
    let strength = 0;
    const length = password.length;
    
    // Length scoring
    if (length >= 8) strength += 20;
    if (length >= 12) strength += 10;
    if (length >= 16) strength += 10;
    if (length >= 20) strength += 10;
    
    // Requirement scoring
    const metRequirements = Object.values(checks).filter(Boolean).length;
    strength += metRequirements * 10;
    
    // Character variety bonus
    const uniqueChars = new Set(password).size;
    if (uniqueChars > 10) strength += 10;
    
    return Math.min(100, strength);
}

// Update strength bar and label
function updateStrengthBar(strength) {
    strengthBar.className = 'strength-bar';
    
    if (strength === 0) {
        strengthLabel.textContent = 'Enter a password';
        strengthLabel.style.color = '#666';
    } else if (strength < 30) {
        strengthBar.classList.add('weak');
        strengthLabel.textContent = '❌ Weak';
        strengthLabel.style.color = '#ff6b6b';
    } else if (strength < 50) {
        strengthBar.classList.add('fair');
        strengthLabel.textContent = '⚠️ Fair';
        strengthLabel.style.color = '#ffd43b';
    } else if (strength < 80) {
        strengthBar.classList.add('good');
        strengthLabel.textContent = '✓ Good';
        strengthLabel.style.color = '#51cf66';
    } else {
        strengthBar.classList.add('strong');
        strengthLabel.textContent = '🔒 Very Strong';
        strengthLabel.style.color = '#339af0';
    }
}

// Update feedback messages
function updateFeedback(password, checks, strength) {
    let feedback = '';
    
    if (!password) {
        feedback = 'Create a strong password to protect your account.';
    } else if (!checks.length) {
        feedback = '⚠️ Use at least 8 characters for better security.';
    } else if (!checks.uppercase) {
        feedback = '💡 Add uppercase letters to strengthen your password.';
    } else if (!checks.lowercase) {
        feedback = '💡 Add lowercase letters to strengthen your password.';
    } else if (!checks.number) {
        feedback = '💡 Add numbers to strengthen your password.';
    } else if (!checks.special) {
        feedback = '💡 Add special characters (!@#$%^&*) for maximum security.';
    } else if (strength >= 80) {
        feedback = '✅ Excellent! Your password is very strong and secure.';
    } else if (strength >= 50) {
        feedback = '✅ Good password. Consider adding more complexity for better security.';
    }
    
    feedbackDiv.textContent = feedback;
}

// Calculate time to crack password
function calculateCrackTime(password) {
    if (!password) return '-';
    
    // Estimate character set size
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) charsetSize += 32;
    
    if (charsetSize === 0) return '-';
    
    // Calculate possibilities and crack time
    // Assuming 10 billion attempts per second
    const possibilities = Math.pow(charsetSize, password.length);
    const secondsToGuess = possibilities / 2 / 10000000000;
    
    return formatTime(secondsToGuess);
}

// Format time into readable string
function formatTime(seconds) {
    if (seconds < 1) return 'Less than 1 second';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    
    const minutes = seconds / 60;
    if (minutes < 60) return Math.round(minutes) + ' minutes';
    
    const hours = minutes / 60;
    if (hours < 24) return Math.round(hours) + ' hours';
    
    const days = hours / 24;
    if (days < 365) return Math.round(days) + ' days';
    
    const years = days / 365;
    if (years < 1000000) return Math.round(years) + ' years';
    
    return 'Centuries';
}

// Generate strong password
function generateStrongPassword() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + special;
    const length = 16;
    let password = '';
    
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
}

// Generate button click handler
generatBtn.addEventListener('click', () => {
    const newPassword = generateStrongPassword();
    passwordInput.value = newPassword;
    passwordInput.type = 'text';
    togglePasswordBtn.textContent = '🙈';
    copyBtn.style.display = 'block';
    
    // Trigger input event to update all displays
    const event = new Event('input', { bubbles: true });
    passwordInput.dispatchEvent(event);
});

// Copy button click handler
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordInput.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        alert('Failed to copy password');
    });
});

// Show copy button only when there's a generated password
passwordInput.addEventListener('focus', () => {
    if (passwordInput.value) {
        copyBtn.style.display = 'block';
    }
});

passwordInput.addEventListener('blur', () => {
    if (!passwordInput.value) {
        copyBtn.style.display = 'none';
    }
});