// ===== VIEW TOGGLING =====
const authCard = document.getElementById('auth-card');
const viewLogin = document.getElementById('view-login');
const viewSignup = document.getElementById('view-signup');
const toggleBtns = document.querySelectorAll('.toggle-view-btn');

function updateCardHeight(view) {
  const height = view.offsetHeight;
  authCard.style.height = `${height}px`;
}

// Set initial height
window.addEventListener('DOMContentLoaded', () => {
  updateCardHeight(viewLogin);
});

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    
    // Clear any errors when switching
    clearErrors();
    
    if (target === 'signup') {
      authCard.classList.add('show-signup');
      updateCardHeight(viewSignup);
    } else {
      authCard.classList.remove('show-signup');
      updateCardHeight(viewLogin);
    }
  });
});

// Update height on resize just in case text wraps
window.addEventListener('resize', () => {
  const isSignup = authCard.classList.contains('show-signup');
  updateCardHeight(isSignup ? viewSignup : viewLogin);
});


// ===== PASSWORD TOGGLES =====
document.querySelectorAll('.field__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    const eyeOpen = btn.querySelector('.eye-open');
    const eyeClosed = btn.querySelector('.eye-closed');
    
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    eyeOpen.style.display = isPassword ? 'none' : 'block';
    eyeClosed.style.display = isPassword ? 'block' : 'none';
  });
});

// ===== FORM VALIDATION =====
function clearErrors() {
  document.querySelectorAll('.field--error').forEach(f => f.classList.remove('field--error'));
  document.querySelectorAll('.field__error').forEach(e => e.remove());
}

function showError(fieldId, message) {
  const fieldEl = document.getElementById(fieldId);
  if (!fieldEl) return;
  fieldEl.classList.add('field--error');
  const errorEl = document.createElement('span');
  errorEl.className = 'field__error';
  errorEl.textContent = message;
  fieldEl.appendChild(errorEl);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear error on input
document.querySelectorAll('.field__input').forEach(input => {
  input.addEventListener('input', () => {
    const field = input.closest('.field');
    field.classList.remove('field--error');
    const err = field.querySelector('.field__error');
    if (err) err.remove();
  });
});

// ===== LOGIN SUBMIT =====
const loginForm = document.getElementById('login-form');
const loginBtn = loginForm.querySelector('.btn-primary');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  
  let hasError = false;
  const email = emailInput.value.trim();
  const pass = passInput.value;

  if (!email) {
    showError('login-email-field', 'Email is required');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('login-email-field', 'Enter a valid email address');
    hasError = true;
  }

  if (!pass) {
    showError('login-password-field', 'Password is required');
    hasError = true;
  }

  if (hasError) return;

  simulateLoading(loginBtn, 'Signed in successfully!');
});


// ===== SIGNUP SUBMIT =====
const signupForm = document.getElementById('signup-form');
const signupBtn = signupForm.querySelector('.btn-primary');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passInput = document.getElementById('signup-password');
  
  let hasError = false;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passInput.value;

  if (!name) {
    showError('signup-name-field', 'Name is required');
    hasError = true;
  }

  if (!email) {
    showError('signup-email-field', 'Email is required');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('signup-email-field', 'Enter a valid email address');
    hasError = true;
  }

  if (!pass) {
    showError('signup-password-field', 'Password is required');
    hasError = true;
  } else if (pass.length < 6) {
    showError('signup-password-field', 'Must be at least 6 characters');
    hasError = true;
  }

  if (hasError) return;

  simulateLoading(signupBtn, 'Account created successfully!');
});


// ===== SIMULATE LOADING & TOAST =====
function simulateLoading(btn, successMsg) {
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    showToast(successMsg);
  }, 1800);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ${message}`;
  
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

// ===== SOCIAL BTN RIPPLE =====
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Find closest form button
    const closestFormBtn = btn.closest('.auth-view').querySelector('.btn-primary');
    const isSignup = btn.closest('.auth-view').classList.contains('auth-view--signup');
    const msg = isSignup ? 'Account created via Provider!' : 'Signed in via Provider!';
    
    simulateLoading(closestFormBtn, msg);
  });
});
