```javascript
// ========================================
// SHG SAATHI AI - MAIN JAVASCRIPT
// ========================================

// Dashboard statistics
let savedProducts = 0;
let totalProductionCost = 0;
let totalPotentialProfit = 0;

// Currency formatting
function formatRupees(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

// ========================================
// PRODUCT COST CALCULATOR
// ========================================

const costForm = document.getElementById("costForm");

if (costForm) {
    costForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const productName = document.getElementById("productName").value.trim();
        const quantity = Number(document.getElementById("quantity").value);
        const materials = Number(document.getElementById("materials").value);
        const labour = Number(document.getElementById("labour").value);
        const packaging = Number(document.getElementById("packaging").value);
        const transport = Number(document.getElementById("transport").value);
        const other = Number(document.getElementById("other").value);
        const margin = Number(document.getElementById("margin").value);

        if (
            !productName ||
            quantity < 1 ||
            materials < 0 ||
            labour < 0 ||
            packaging < 0 ||
            transport < 0 ||
            other < 0 ||
            margin < 0 ||
            margin > 500
        ) {
            alert("Please enter valid product details and costs.");
            return;
        }

        // Add all production expenses
        const totalCost = materials + labour + packaging + transport + other;

        // Calculate the cost of making one product
        const costPerProduct = totalCost / quantity;

        // Profit is calculated as a percentage of the cost
        const profitPerProduct = costPerProduct * (margin / 100);

        // Suggested selling price for one product
        const sellingPrice = costPerProduct + profitPerProduct;

        // Estimated profit if the complete batch is sold
        const batchProfit = profitPerProduct * quantity;

        const result = document.getElementById("result");

        result.innerHTML = `
            <h3>🌿 Your Cost Report</h3>
            <p>Product: <strong>${escapeHTML(productName)}</strong></p>
            <p>Total production cost: <strong>${formatRupees(totalCost)}</strong></p>
            <p>Quantity produced: <strong>${quantity}</strong></p>
            <p>Cost per product: <strong>${formatRupees(costPerProduct)}</strong></p>
            <p>Estimated profit per product: <strong>${formatRupees(profitPerProduct)}</strong></p>
            <p>Suggested selling price: <strong>${formatRupees(sellingPrice)}</strong></p>
            <p>Estimated batch profit: <strong>${formatRupees(batchProfit)}</strong></p>
            <p><small>This estimate excludes any expenses you have not entered, taxes, and selling-platform fees.</small></p>
        `;

        // Update dashboard statistics for this calculation
        savedProducts += 1;
        totalProductionCost += totalCost;
        totalPotentialProfit += batchProfit;

        document.getElementById("productCount").textContent = savedProducts;
        document.getElementById("productionValue").textContent =
            formatRupees(totalProductionCost);
        document.getElementById("potentialProfit").textContent =
            formatRupees(totalPotentialProfit);
    });
}

// ========================================
// BASIC PRODUCT LISTING GENERATOR
// ========================================

// Important: this creates a template-based description.
// It does not call an AI model yet.
// We will connect a real AI service through a secure backend later.

const listingForm = document.getElementById("listingForm");

if (listingForm) {
    listingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("listingName").value.trim();
        const category = document.getElementById("category").value;
        const materials = document.getElementById("materialsUsed").value.trim();
        const features = document.getElementById("featuresInput").value.trim();
        const language = document.getElementById("language").value;

        if (!name) {
            alert("Please enter your product name.");
            return;
        }

        let description;

        if (language === "Tamil") {
            description = `
                <h3>🌿 உங்கள் தயா
```
