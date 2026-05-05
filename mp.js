
document.getElementById("pay-btn").addEventListener("click", function () {

    // Redirect to the payment page
    window.location.href = "payments.html";
});

function showPolicyDetails(policyType) {
    // Policy Details Mapping
    const policies = {
        
        life: {
            type: "Life Insurance",
            start: "04-July-2025",
            expiry: "04-July-2026",
            addons: "Critical Illness Cover",
        },
    };

    // Set Details
    document.getElementById("policy-type").innerText = policies[policyType].type;
    document.getElementById("policy-start").innerText = policies[policyType].start;
    document.getElementById("policy-expiry").innerText = policies[policyType].expiry;
    document.getElementById("policy-addons").innerText = policies[policyType].addons;

    // Show Details Section
    document.getElementById("policy-details").style.display = "block";

}
