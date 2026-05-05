document.addEventListener("DOMContentLoaded", function () {
    const homeAddons = document.getElementById("home-addons");
    const lifeAddons = document.getElementById("life-addons");
    const insuranceTypeRadios = document.querySelectorAll("input[name='insuranceType']");
    const doneButton = document.getElementById("done-button");
    const totalAmountDisplay = document.getElementById("total-amount");
    const basePremiumInput = document.getElementById("base-premium");

    // Retrieve base premium from localStorage (calculated in the calculator)
    const basePremium = parseFloat(localStorage.getItem("basePremium")) || 0;
    basePremiumInput.value = basePremium; // Set the hidden input value

    // Function to update add-ons display based on selected insurance type
    function updateAddonsDisplay() {
        const selectedInsuranceType = document.querySelector("input[name='insuranceType']:checked").value;
        
        if (selectedInsuranceType === "home") {
            homeAddons.style.display = "block";
            lifeAddons.style.display = "none";
        } else {
            homeAddons.style.display = "none";
            lifeAddons.style.display = "block";
        }
    }

    // Function to calculate and update the total amount
    function updateTotalAmount() {
        const selectedAddons = document.querySelectorAll(".addon:checked");
        let totalAmount = parseFloat(basePremiumInput.value); // Start with the base premium

        // Add the cost of selected add-ons
        selectedAddons.forEach(addon => {
            totalAmount += parseFloat(addon.getAttribute("data-price"));
        });

        // Update the total amount display
        totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }

    // Add event listeners to insurance type radio buttons
    insuranceTypeRadios.forEach(radio => {
        radio.addEventListener("change", updateAddonsDisplay);
    });

    // Add event listeners to add-on checkboxes
    document.querySelectorAll(".addon").forEach(addon => {
        addon.addEventListener("change", updateTotalAmount);
    });

    // Ensure the correct add-ons are displayed on page load
    updateAddonsDisplay();

    // Handle "Done" button click
    doneButton.addEventListener("click", function () {
        // Get the selected insurance type
        const selectedInsuranceType = document.querySelector("input[name='insuranceType']:checked").value;

        // Get all selected add-ons
        const selectedAddons = document.querySelectorAll(".addon:checked");
        let totalAmount = parseFloat(basePremiumInput.value); // Start with the base premium
        let selectedItems = [];

        // Calculate total amount and collect selected add-ons
        selectedAddons.forEach(addon => {
            totalAmount += parseFloat(addon.getAttribute("data-price"));
            selectedItems.push(addon.nextElementSibling.alt);
        });

        // Store selected policy, add-ons, and total amount in localStorage
        localStorage.setItem("selectedPolicy", selectedInsuranceType);
        localStorage.setItem("selectedAddons", JSON.stringify(selectedItems));
        localStorage.setItem("totalAmount", totalAmount);

        // Redirect to the payment page
        window.location.href = "payments.html";
    });

    // Initialize total amount display
    updateTotalAmount();
});