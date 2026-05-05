// File upload handling remains the same
const fileUpload = document.getElementById('file-upload');
const fileList = document.getElementById('file-list');

// Get policy data from storage
const policyData = JSON.parse(localStorage.getItem("currentPolicy")) || 
                   JSON.parse(localStorage.getItem("selectedPolicy")) || {};
                   
// Initialize and display due amount
let currentDueAmount = parseFloat(policyData.totalAmount) || 
                      parseFloat(policyData.finalAmount) || 
                      parseFloat(localStorage.getItem("totalAmount")) || 0;
document.getElementById("dueAmount").textContent = currentDueAmount.toFixed(2);

fileUpload.addEventListener('change', (event) => {
    const files = event.target.files;
    fileList.innerHTML = '';
    Array.from(files).forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.backgroundColor = '#A71941';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '5px';
        removeButton.style.marginLeft = '10px';
        removeButton.style.padding = '5px 10px';

        removeButton.addEventListener('click', () => {
            listItem.remove();
        });

        listItem.appendChild(removeButton);
        fileList.appendChild(listItem);
    });
});

document.addEventListener("DOMContentLoaded", async function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'Homepage.html';
        return;
    }

    // Display basic user info
    document.getElementById("user-name").textContent = currentUser.name;
    document.getElementById("user-email").textContent = currentUser.email;

    // Load additional user details
    await loadUserDetails(currentUser);
    
    // Display policy from localStorage
    displayPolicyFromStorage();
    
    setupEventListeners();
});

async function loadUserDetails(user) {
    try {
        const response = await fetch(`http://localhost:3001/api/user/${user.userId}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        
        const userData = await response.json();
        
        if (userData.mobile) {
            document.getElementById('user-phone').textContent = `+91 ${userData.mobile}`;
            document.getElementById('edit-phone').value = userData.mobile;
        }
        if (userData.address) {
            document.getElementById('user-address').textContent = userData.address;
            document.getElementById('edit-address').value = userData.address;
        }
    } catch (error) {
        console.error('Error loading user details:', error);
    }
}

function displayPolicyFromStorage() {
    const tableBody = document.querySelector('.policy-table tbody');
    const loadingElement = document.getElementById('loading-policies');
    const tableElement = document.getElementById('policy-table');
    const noPoliciesElement = document.getElementById('no-policies');

    if (!policyData || !policyData.type) {
        loadingElement.style.display = 'none';
        noPoliciesElement.style.display = 'block';
        tableElement.style.display = 'none';
        return;
    }

    loadingElement.style.display = 'none';
    tableElement.style.display = 'table';
    noPoliciesElement.style.display = 'none';

    // Create single policy row from stored data
    tableBody.innerHTML = `
    <tr>
        <td>${policyData.type === "life" ? "Life Insurance" : "Home Insurance"}</td>
        <td>${formatDate(policyData.date || new Date().toISOString())}</td>
        <td>${formatDate(new Date(new Date(policyData.date).setFullYear(new Date(policyData.date).getFullYear() + 1)))}</td>
        <td>${formatDate(new Date(new Date(policyData.date).setMonth(new Date(policyData.date).getMonth() + 1)))}</td>
        <td class="amount-due">₹${currentDueAmount.toFixed(2)}</td>
        <td class="status-active">Active</td>
        
    </tr>`;
}

function setupEventListeners() {
    // Edit/Save profile details
    const editDetailsBtn = document.getElementById('edit-details-btn');
    const saveDetailsBtn = document.getElementById('save-details-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const detailsView = document.getElementById('details-view');
    const editForm = document.getElementById('edit-form');

    editDetailsBtn.addEventListener('click', () => {
        detailsView.style.display = 'none';
        editForm.style.display = 'block';
    });
    
    cancelBtn.addEventListener('click', () => {
        detailsView.style.display = 'block';
        editForm.style.display = 'none';
    });
    
    saveDetailsBtn.addEventListener('click', async () => {
        const phone = document.getElementById('edit-phone').value;
        const address = document.getElementById('edit-address').value;
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        try {
            const response = await fetch(`http://localhost:3001/api/user/${currentUser.userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: phone,
                    address: address
                })
            });
            
            if (!response.ok) throw new Error('Failed to update profile');

            document.getElementById('user-phone').textContent = `+91 ${phone}`;
            document.getElementById('user-address').textContent = address;
            
            detailsView.style.display = 'block';
            editForm.style.display = 'none';
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update profile');
        }
    });

    // Policy payment handling
    document.querySelector('.policy-table').addEventListener('click', (e) => {
        if (e.target.classList.contains('pay-btn')) {
            const amountDue = parseFloat(e.target.dataset.amount);
            makePolicyPayment(amountDue);
        }
    });
    
    // Payment dashboard function
    window.updatePayment = function() {
        const paymentInput = document.getElementById('paymentInput');
        const payment = parseFloat(paymentInput.value);
        const paidAmountElement = document.getElementById('paidAmount');
        
        if (isNaN(payment) || payment <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }
        
        if (payment > currentDueAmount) {
            alert(`Payment amount cannot exceed due amount of ₹${currentDueAmount.toFixed(2)}`);
            return;
        }
        
        const totalPaid = parseFloat(paidAmountElement.textContent) + payment;
        currentDueAmount -= payment;
        
        paidAmountElement.textContent = totalPaid.toFixed(2);
        document.getElementById('dueAmount').textContent = currentDueAmount.toFixed(2);
        
        paymentInput.value = '';
        
        if (currentDueAmount === 0) {
            alert('Payment completed successfully!');
            const payBtn = document.querySelector('.pay-btn');
            if (payBtn) {
                payBtn.disabled = true;
                const statusCell = payBtn.closest('tr').querySelector('td:nth-child(6)');
                statusCell.textContent = 'Paid';
                statusCell.className = 'status-paid';
            }
        }
    };
}

function makePolicyPayment(amountDue) {
    const paymentAmount = parseFloat(prompt(`Enter payment amount (Due: ₹${amountDue.toFixed(2)})`, amountDue.toFixed(2)));
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (paymentAmount > amountDue) {
        alert(`Payment amount cannot exceed due amount of ₹${amountDue.toFixed(2)}`);
        return;
    }
    
    setTimeout(() => {
        alert(`Payment of ₹${paymentAmount.toFixed(2)} processed successfully!`);
        
        const payBtn = document.querySelector('.pay-btn');
        if (payBtn) {
            const row = payBtn.closest('tr');
            const amountCell = row.querySelector('td:nth-child(5)');
            const statusCell = row.querySelector('td:nth-child(6)');
            
            const newAmount = Math.max(0, amountDue - paymentAmount);
            amountCell.textContent = `₹${newAmount.toFixed(2)}`;
            
            currentDueAmount = newAmount;
            document.getElementById('dueAmount').textContent = newAmount.toFixed(2);
            document.getElementById('paidAmount').textContent = 
                (parseFloat(document.getElementById('paidAmount').textContent) + paymentAmount).toFixed(2);
            
            if (newAmount === 0) {
                statusCell.textContent = 'Paid';
                statusCell.className = 'status-paid';
                payBtn.disabled = true;
            }
        }
    }, 1000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}