// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store user data in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify({
      userId: data.userId,
      name: data.customerName,
      email: data.email
    }));

    // Redirect to profile page
    window.location.href = `dashboard.html`;
    
  } catch (error) {
    alert(error.message);
    console.error('Login Error:', error);
  }
});
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const loginBtn = document.getElementById('loginBtn');

    try {
        // Disable button during submission
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Login successful
        messageElement.textContent = 'Login successful! Redirecting...';
        messageElement.style.color = 'green';
        
        // Store user data in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            userId: data.userId,
            name: data.name,
            email: data.email
        }));
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'account.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login Error:', error);
        messageElement.textContent = error.message || 'Login failed. Please try again.';
        messageElement.style.color = 'red';
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Check for temp user data from signup
document.addEventListener('DOMContentLoaded', () => {
    const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
    if (tempUser) {
        document.getElementById('email').value = tempUser.email || '';
        sessionStorage.removeItem('tempUser');
    }
});