// ============= CALCULATOR PAGE CODE =============
function toggleFields() {
    const type = document.getElementById("insuranceType").value;
    document.getElementById("lifeInsuranceFields").classList.toggle("hidden", type !== "life");
    document.getElementById("homeInsuranceFields").classList.toggle("hidden", type !== "home");
}

function calculatePremium() {
    const type = document.getElementById("insuranceType").value;
    let premium = 0;
    let policyDetails = {
        type: type,
        date: new Date().toISOString().split('T')[0] // Store current date in YYYY-MM-DD format
    };

    if (type === "life") {
        const age = parseInt(document.getElementById("age").value) || 0;
        const smoking = document.getElementById("smoking").value;
        const risk = document.getElementById("occupation").value;
        premium = 5000 + (age * 20) + (smoking === "yes" ? 2000 : 0) + (risk === "high" ? 3000 : 0);
        
        // Store life insurance specific details
        policyDetails.age = age;
        policyDetails.smokingStatus = smoking;
        policyDetails.occupationRisk = risk;
    } else if (type === "home") {
        const homeValue = parseFloat(document.getElementById("homeValue").value) || 0;
        const risk = document.getElementById("disasterRisk").value;
        premium = homeValue * 0.005 + (risk === "high" ? 5000 : 0);
        
        // Store home insurance specific details
        policyDetails.homeValue = homeValue;
        policyDetails.disasterRisk = risk;
    }

    policyDetails.basePremium = premium;
    
    // Store initial policy details in sessionStorage
    sessionStorage.setItem('currentPolicy', JSON.stringify(policyDetails));

    document.getElementById("result").innerText = `Estimated Premium: ₹${premium.toFixed(2)}`;
    document.getElementById("finish").classList.remove("hidden");
    
    // Store values in URL parameters when navigating to customize page
    document.querySelector('a[href="customize.html"]').addEventListener("click", function(e) {
        e.preventDefault();
        window.location.href = `customize.html?type=${type}&premium=${premium.toFixed(2)}`;
    });
}

// ============= CUSTOMIZE PAGE CODE =============
function initializeCustomizePage() {
    // Get insurance type and base premium from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedInsuranceType = urlParams.get('type');
    const basePremium = parseFloat(urlParams.get('premium')) || 0;
    
    // Retrieve and update policy details from sessionStorage
    let policyDetails = JSON.parse(sessionStorage.getItem('currentPolicy')) || {};
    policyDetails.basePremium = basePremium;
    policyDetails.addons = [];
    
    // Show only the relevant add-ons based on insurance type
    document.getElementById("home-addons").style.display = selectedInsuranceType === "home" ? "block" : "none";
    document.getElementById("life-addons").style.display = selectedInsuranceType === "life" ? "block" : "none";
    
    // Initialize total with base premium
    document.getElementById("total-amount").textContent = basePremium.toFixed(2);
    
    // Update total when add-ons are selected
    function updateTotalAmount() {
        let totalAmount = basePremium;
        const selectedAddons = document.querySelectorAll(".addon:checked");
        
        // Update addons in policy details
        policyDetails.addons = [];
        selectedAddons.forEach(addon => {
            const addonName = addon.nextElementSibling.alt;
            const addonPrice = parseFloat(addon.getAttribute("data-price"));
            totalAmount += addonPrice;
            
            policyDetails.addons.push({
                name: addonName,
                price: addonPrice
            });
        });
        
        // Update total in policy details
        policyDetails.totalAmount = totalAmount;
        
        // Store updated policy details
        sessionStorage.setItem('currentPolicy', JSON.stringify(policyDetails));
        
        document.getElementById("total-amount").textContent = totalAmount.toFixed(2);
        return totalAmount;
    }

    // Handle "Done" button click
    document.getElementById("done-button").addEventListener("click", function() {
    const selectedAddons = document.querySelectorAll(".addon:checked");
    let totalAmount = basePremium;
    let selectedItems = [];

    // Calculate total amount and collect selected add-ons
    selectedAddons.forEach(addon => {
        const addonPrice = parseFloat(addon.getAttribute("data-price"));
        totalAmount += addonPrice;
        selectedItems.push({
            name: addon.nextElementSibling.alt,
            price: addonPrice
        });
    });

    // Update policy details with final values
    policyDetails.finalAddons = selectedItems;
    policyDetails.finalAmount = totalAmount;
    policyDetails.purchaseDate = new Date().toISOString();
    
    // Store in both localStorage and sessionStorage
    localStorage.setItem("selectedPolicy", JSON.stringify({
        ...policyDetails,
        totalAmount: totalAmount  // Ensure totalAmount is included
    }));
    sessionStorage.setItem("currentPolicy", JSON.stringify({
        ...policyDetails,
        totalAmount: totalAmount  // Ensure totalAmount is included
    }));

    // Also store totalAmount separately for easy access
    localStorage.setItem("totalAmount", totalAmount);

    // Redirect to the payment page
    window.location.href = "payments.html";
});

    // Initialize total amount display
    updateTotalAmount();
    
    // Add event listeners to add-on checkboxes
    document.querySelectorAll(".addon").forEach(addon => {
        addon.addEventListener("change", updateTotalAmount);
    });
}

// ============= PAGE INITIALIZATION =============
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("insuranceType")) {
        // Calculator page
        document.getElementById("insuranceType").addEventListener("change", toggleFields);
    } else if (document.getElementById("home-addons")) {
        // Customize page
        initializeCustomizePage();
    }
});