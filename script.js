```javascript
"use strict";

// Format money in Indian Rupees
function formatRupees(amount) {
    return "₹" + Number(amount).toFixed(2);
}

// Safely display text
function escapeHTML(value) {
    return String(value)
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#39;");
}

// Get saved products from browser storage
let savedProducts = [];

try {
    const storedProducts = localStorage.getItem("shgProducts");

    if (storedProducts) {
        savedProducts = JSON.parse(storedProducts);

        if (!Array.isArray(savedProducts)) {
            savedProducts = [];
        }
    }
} catch (error) {
    savedProducts = [];
}

// Save products in browser storage
function storeProducts() {
    try {
        localStorage.setItem("shgProducts", JSON.stringify(savedProducts));
    } catch (error) {
        console.error("Unable to save products:", error);
    }
}

// PRODUCT COST CALCULATOR
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

        const result = document.getElementById("result");

        if (!productName) {
            alert("Please enter a product name.");
            return;
        }

        if (!Number.isFinite(quantity) || quantity < 1) {
            alert("Quantity must be at least 1.");
            return;
        }

        const costs = [materials, labour, packaging, transport, other];

        for (let i = 0; i < costs.length; i++) {
            if (!Number.isFinite(costs[i]) || costs[i] < 0) {
                alert("Please enter valid costs. Costs cannot be negative.");
                return;
            }
        }

        if (!Number.isFinite(margin) || margin < 0 || margin > 500) {
            alert("Profit margin must be between 0 and 500%.");
            return;
        }

        const totalCost = materials + labour + packaging + transport + other;
        const costPerProduct = totalCost / quantity;
        const profitPerProduct = costPerProduct * margin / 100;
        const sellingPrice = costPerProduct + profitPerProduct;
        const batchProfit = profitPerProduct * quantity;

        result.innerHTML = `
            <div class="feature-card">
                <h3>📊 Cost Calculation Result</h3>
                <p><strong>Product:</strong> ${escapeHTML(productName)}</p>
                <p><strong>Quantity:</strong> ${quantity}</p>
                <p><strong>Total Batch Cost:</strong> ${formatRupees(totalCost)}</p>
                <p><strong>Cost per Product:</strong> ${formatRupees(costPerProduct)}</p>
                <p><strong>Profit per Product:</strong> ${formatRupees(profitPerProduct)}</p>
                <p><strong>Suggested Selling Price:</strong> ${formatRupees(sellingPrice)}</p>
                <p><strong>Total Batch Profit:</strong> ${formatRupees(batchProfit)}</p>
                <button type="button" id="saveProductButton">💾 Save Product</button>
            </div>
        `;

        document.getElementById("saveProductButton").addEventListener("click", function () {
            const product = {
                id: Date.now(),
                name: productName,
                quantity: quantity,
                totalCost: totalCost,
                costPerProduct: costPerProduct,
                sellingPrice: sellingPrice,
                batchProfit: batchProfit
            };

            savedProducts.push(product);
            storeProducts();
            displaySavedProducts();

            this.textContent = "✓ Product Saved";
            this.disabled = true;
        });
    });
}

// MY PRODUCTS
function displaySavedProducts() {
    const list = document.getElementById("savedProductsList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (savedProducts.length === 0) {
        list.textContent = "No saved products yet. Calculate a cost and save your first product!";
        return;
    }

    savedProducts.forEach(function (product) {
        const card = document.createElement("div");
        card.className = "feature-card";

        const title = document.createElement("h3");
        title.textContent = "📦 " + product.name;

        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + product.quantity;

        const total = document.createElement("p");
        total.textContent = "Total Cost: " + formatRupees(product.totalCost);

        const price = document.createElement("p");
        price.textContent = "Selling Price per Product: " + formatRupees(product.sellingPrice);

        const profit = document.createElement("p");
        profit.textContent = "Batch Profit: " + formatRupees(product.batchProfit);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "🗑️ Delete";

        deleteButton.addEventListener("click", function () {
            savedProducts = savedProducts.filter(function (item) {
                return item.id !== product.id;
            });

            storeProducts();
            displaySavedProducts();
        });

        card.appendChild(title);
        card.appendChild(quantity);
        card.appendChild(total);
        card.appendChild(price);
        card.appendChild(profit);
        card.appendChild(deleteButton);

        list.appendChild(card);
    });
}

// PRODUCT LISTING GENERATOR
const listingForm = document.getElementById("listingForm");

if (listingForm) {
    listingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("listingName").value.trim();
        const category = document.getElementById("category").value;
        const materials = document.getElementById("materialsUsed").value.trim();
        const features = document.getElementById("featuresInput").value.trim();
        const language = document.getElementById("language").value;
        const output = document.getElementById("listingOutput");

        if (!name) {
            alert("Please enter the product name.");
            return;
        }

        const listing = [
            "PRODUCT: " + name,
            "CATEGORY: " + (category || "Handmade Products"),
            "DESCRIPTION: " + name + " is a handmade product prepared with care by a Self-Help Group.",
            "MATERIALS USED: " + (materials || "Quality materials"),
            "KEY FEATURES: " + (features || "Handmade, useful, and carefully prepared"),
            "LANGUAGE: " + (language || "English"),
            "",
            "WHY BUY THIS PRODUCT?",
            "Support local women entrepreneurs and help strengthen rural livelihoods.",
            "",
            "Note: Please verify all product claims before publishing this listing."
        ].join("\n");

        output.textContent = listing;

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.textContent = "📋 Copy Listing";
        copyButton.addEventListener("click", async function () {
            try {
                await navigator.clipboard.writeText(listing);
                copyButton.textContent = "✓ Copied!";
            } catch (error) {
                alert("Please select and copy the listing text manually.");
            }
        });

        output.appendChild(document.createElement("br"));
        output.appendChild(copyButton);
    });
}

// Display existing products when the page opens
document.addEventListener("DOMContentLoaded", function () {
    displaySavedProducts();
});
```
