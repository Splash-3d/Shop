// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verificando...';
        submitBtn.disabled = true;

        try {
            const success = await attemptLogin(username, password, remember);

            if (success) {
                showAlert('Inicio de sesión exitoso', 'success');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showAlert('Usuario o contraseña incorrectos', 'danger');
            }
        } catch (error) {
            showAlert('Error de conexión. Intenta nuevamente.', 'danger');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    checkExistingSession();
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

// Attempt login with API
async function attemptLogin(username, password, remember) {
    console.log('Attempting login with API for user:', username);
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        console.log('API response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('API response data:', data);

            if (!data.success || !data.token) {
                console.log('API response missing success or token');
                return false;
            }

            if (remember) {
                localStorage.setItem('adminSession', 'true');
                localStorage.setItem('adminToken', data.token);
            } else {
                sessionStorage.setItem('adminSession', 'true');
                sessionStorage.setItem('adminToken', data.token);
            }

            return true;
        } else {
            console.log('API response not ok, falling back to demo credentials');
            return false;
        }
    } catch (error) {
        console.log('API request failed, falling back to demo credentials:', error.message);
        return validateDemoCredentials(username, password, remember);
    }
}

// Validate demo credentials (for development)
function validateDemoCredentials(username, password, remember) {
    // Updated credentials to match user requirements
    const validCredentials = {
        'admin': 'admin123',
        'Óscar': 'Pitimirri2385'  // Updated to match user's actual credentials
    };

    if (validCredentials.hasOwnProperty(username) &&
        validCredentials[username] === password) {

        const fakeToken = 'demo-token-' + Date.now();

        if (remember) {
            localStorage.setItem('adminSession', 'true');
            localStorage.setItem('adminToken', fakeToken);
        } else {
            sessionStorage.setItem('adminSession', 'true');
            sessionStorage.setItem('adminToken', fakeToken);
        }

        return true;
    }

    return false;
}

// Check existing session
function checkExistingSession() {
    const hasSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');

    if (hasSession) {
        verifySession();
    }
}

// Verify session validity
async function verifySession() {
    const token = getSessionToken();
    if (!token) {
        clearSession();
        return;
    }

    try {
        const response = await fetch('/api/admin/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.href = 'dashboard.html';
        } else {
            clearSession();
        }
    } catch (error) {
        window.location.href = 'dashboard.html';
    }
}

// Get session token
function getSessionToken() {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
}

// Clear session
function clearSession() {
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
}

// Show alert message
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Handle Enter key in form
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const loginForm = document.getElementById('loginForm');
        if (document.activeElement.form === loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Add input validation
document.getElementById('username').addEventListener('input', function(e) {
    e.target.value = e.target.value.trim();
});

document.getElementById('password').addEventListener('input', function(e) {
    e.target.value = e.target.value.trim();
});

// Add focus effects
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focus');
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focus');
    });
});