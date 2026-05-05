document.addEventListener("DOMContentLoaded", function() {
  // Check if user is logged in
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    window.location.href = 'Homepage.html';
    return;
  }

  // Display user info on dashboard
  document.getElementById("welcomeMessage").textContent = `Welcome, ${currentUser.name}!`;
  document.getElementById("userEmail").textContent = currentUser.email;

  // Load user-specific dashboard content here
  loadUserData(currentUser.userId);
});

async function loadUserData(userId) {
  try {
    const response = await fetch(`http://localhost:3001/api/user/${userId}`);
    const userData = await response.json();
    
    // Update dashboard with user-specific data
    console.log('User data loaded:', userData);
    
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}