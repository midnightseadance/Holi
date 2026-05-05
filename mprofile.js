document.addEventListener("DOMContentLoaded", function () {
    // Check authentication
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'Homepage.html';
        return;
    }

        
        // Display user information
        document.getElementById("name").textContent = '${currentUser.name}';
        document.getElementById("email").textContent = currentUser.email;
        document.getElementById("mobile").value = userData.mobile || '';
        document.getElementById("address").value = userData.address || '';


    // Load policies
    loadPolicies();

    // Form submission
    document.getElementById("user-info-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/user/${currentUser.userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: document.getElementById("mobile").value,
                    address: document.getElementById("address").value
                })
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update profile');
        }
    });

    // Payment system
    let totalPaid = 0;
    const totalDue = 1000.00;
    const updatePaymentBtn = document.getElementById("update-payment-btn");

    updatePaymentBtn.addEventListener("click", function() {
        const paymentInput = document.getElementById('paymentInput');
        const payment = parseFloat(paymentInput.value);
        
        if (isNaN(payment)) {
            alert("Please enter a valid number");
            return;
        }
        
        if (payment <= 0) {
            alert("Payment amount must be positive");
            return;
        }

        totalPaid += payment;
        document.getElementById('paidAmount').textContent = totalPaid.toFixed(2);
        
        const remaining = Math.max(0, totalDue - totalPaid);
        document.getElementById('dueAmount').textContent = remaining.toFixed(2);
        
        paymentInput.value = '';
        
        if (remaining === 0) {
            alert("Payment completed successfully!");
        }
    });
});

function toggle2FA() {
    const btn = document.getElementById("2fa-btn");
    const isEnabled = btn.textContent.includes('Enable');
    
    if (confirm(`Are you sure you want to ${isEnabled ? 'enable' : 'disable'} two-factor authentication?`)) {
        btn.textContent = isEnabled 
            ? 'Disable Two-Factor Authentication' 
            : 'Enable Two-Factor Authentication';
        alert(`Two-factor authentication ${isEnabled ? 'enabled' : 'disabled'} successfully!`);
    }
}

function loadPolicies() {
    const activePolicyTable = document.getElementById("active-policy-table");
    const policyTable = document.getElementById("policy-table");

    const activePolicy = JSON.parse(localStorage.getItem("activePolicy"));
    const policyHistory = JSON.parse(localStorage.getItem("policies")) || [];

    if (activePolicy) {
        activePolicyTable.innerHTML = `
            <tr>
                <td>${activePolicy.name}</td>
                <td>₹${activePolicy.amount.toFixed(2)}</td>
                <td>${new Date(activePolicy.dueDate).toLocaleDateString()}</td>
                <td>${activePolicy.status}</td>
            </tr>
        `;
    }

    policyTable.innerHTML = policyHistory.map(policy => `
        <tr>
            <td>${policy.name}</td>
            <td>₹${policy.amount.toFixed(2)}</td>
            <td>${new Date(policy.date).toLocaleDateString()}</td>
            <td><button onclick="downloadInvoice('${policy.name}', ${policy.amount}, '${policy.date}')">Download</button></td>
        </tr>
    `).join('');
}

function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem("activePolicy");
    window.location.href = "Homepage.html";
}

function downloadInvoice(policyName, amount, date) {
    const invoiceText = `Invoice\n\nPolicy: ${policyName}\nAmount: ₹${amount.toFixed(2)}\nDate: ${new Date(date).toLocaleDateString()}`;
    const blob = new Blob([invoiceText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${policyName.replace(/ /g, '_')}.txt`;
    link.click();
}
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