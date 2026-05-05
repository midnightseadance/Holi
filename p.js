document.addEventListener("DOMContentLoaded", function () {
    const payNowButton = document.querySelector(".pay-btn");
    const paymentMethods = document.getElementById("payment-methods");
    const invoice = document.getElementById("invoice");
    const paymentModeSpan = document.getElementById("payment-mode");

    // Retrieve stored insurance data
    const policyData = JSON.parse(localStorage.getItem("currentPolicy")) || 
                      JSON.parse(localStorage.getItem("selectedPolicy"));
    
    // Get the amount - first try from policyData, then from localStorage, then default
    const totalAmount = policyData?.totalAmount || 
                       policyData?.finalAmount || 
                       localStorage.getItem("totalAmount") || 
                       0;

    // Check if a policy is selected
    if (!policyData) {
        alert("No policy selected! Please go back and choose one.");
        return;
    }

    // Display selected policy details in table
    document.getElementById("policy-name").textContent = policyData.type === "life" ? "Life Insurance" : "Home Insurance";
    document.getElementById("policy-amount").textContent = `₹${parseFloat(totalAmount).toFixed(2)}`;
    document.getElementById("policy-date").textContent = policyData.date || new Date().toISOString().split('T')[0];
    
    // Display in invoice section
    document.getElementById("invoice-policy").textContent = policyData.type === "life" ? "Life Insurance" : "Home Insurance";
    document.getElementById("invoice-amount").textContent = parseFloat(totalAmount).toFixed(2);

    // Rest of your existing code...

    // Display selected add-ons with their prices
    const addonsList = document.getElementById("addons-list");
    addonsList.innerHTML = ""; // Clear any existing add-ons
    
    if (policyData.addons && policyData.addons.length > 0) {
        policyData.addons.forEach(addon => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${addon.name}</strong>: ₹${addon.price.toFixed(2)}`;
            addonsList.appendChild(li);
        });
    } else if (selectedAddons.length > 0) {
        selectedAddons.forEach(addon => {
            const li = document.createElement("li");
            li.textContent = addon;
            addonsList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "No add-ons selected";
        addonsList.appendChild(li);
    }

    // Show payment methods when "Pay Now" is clicked
    payNowButton.addEventListener("click", function () {
        paymentMethods.style.display = "block";
        invoice.style.display = "none"; // Hide invoice
    });

    // Handle payment selection
    document.querySelectorAll(".method").forEach(method => {
        method.addEventListener("click", function () {
            const paymentType = this.querySelector("p").textContent;
            paymentModeSpan.textContent = paymentType;
            paymentMethods.style.display = "none";
            invoice.style.display = "block";

            // Create the active policy object with all details
            const activePolicy = {
                name: policyData.type === "life" ? "Life Insurance" : "Home Insurance",
                type: policyData.type,
                amount: totalAmount,
                date: policyData.date || new Date().toISOString().split('T')[0],
                dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(),
                addons: policyData.addons || selectedAddons.map(name => ({ name, price: 0 })),
                status: "Active",
                details: {
                    ...(policyData.type === "life" ? {
                        age: policyData.age,
                        smokingStatus: policyData.smokingStatus,
                        occupationRisk: policyData.occupationRisk
                    } : {
                        homeValue: policyData.homeValue,
                        disasterRisk: policyData.disasterRisk
                    })
                }
            };

            // Save the active policy to localStorage
            localStorage.setItem("activePolicy", JSON.stringify(activePolicy));

            // Add the active policy to the policy history
            const savedPolicies = JSON.parse(localStorage.getItem("policies")) || [];
            savedPolicies.push(activePolicy);
            localStorage.setItem("policies", JSON.stringify(savedPolicies));

            alert("Payment successful! Your policy is now active.");
        });
    });

    // Attach the function to the "My Profile" button
    document.querySelector("button[onclick='redirectToProfile()']").addEventListener("click", redirectToProfile);
});

function downloadInvoice() {
    alert("Your Invoice has been downloaded.");
    return;
}

function redirectToProfile() {
    window.location.href = "acc.html";
}