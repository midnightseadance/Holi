document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const errorElement = document.getElementById('errorMessage');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Get values
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  // Client-side validation
  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Success
    sessionStorage.setItem('tempUser', JSON.stringify({
      email: email,
      name: name
    }));
    
    alert('Account created successfully! Redirecting to login...');
    window.location.href = 'Homepage.html';

  } catch (error) {
    showError(error.message);
    console.error('Signup error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Up';
  }
});

function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}