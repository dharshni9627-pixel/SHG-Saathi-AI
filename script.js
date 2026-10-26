
"use strict";

// ==========================================
// SHG SAATHI AI - PRODUCT COSTING ASSISTANT
// ==========================================

function formatRupees(amount) {
return "₹" + Number(amount).toLocaleString("en-IN", {
minimumFractionDigits: 2,
maximumFractionDigits: 2
});
}

function escapeHTML(value) {
return String(value).replace(/[&<>"']/g, function (character) {
const replacements = {
"&": "&",
"<": "<",
">": ">",
'"': """,
"'": "'"
};

```
    return replacements[character];
});
```

}


// Load products saved in this browser
let savedProducts = [];

try {
const storedProducts = localStorage.getItem("shgProducts");
savedProducts = storedProducts ? JSON.parse(storedProducts) : [];

```
if (!Array.isArray(savedProducts)) {
    savedProducts = [];
}
```

} catch (error) {
savedProducts = [];
}

// Display saved products
function displaySavedProducts() {
const list = document.getElementById("savedProductsList");

```
if (!list) return;

list.replaceChildren();

if (savedProducts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No products saved yet. Calculate a product cost to get started.";
    list.appendChild(message);
    return;
}

savedProducts.forEach(function (product, index) {
    const card = document.createElement("div");
    card.className = "feature-card";

    const title = document.createElement("h3");
    title.textContent = "📦 " + product.name;
    card.appendChild(title);

    const details = [
        "Quantity: " + product.quantity,
        "Total production cost: " + formatRupees(product.totalCost),
        "Cost per product: " + formatRupees(product.unitCost),
        "Suggested selling price: " + formatRupees(product.sellingPrice),
        "Estimated batch profit: " + formatRupees(product.batchProfit || 0)
    ];

    details.forEach(function (detail) {
        const paragraph = document.createElement("p");
        paragraph.textContent = detail;
        card.appendChild(paragraph);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Product";

    deleteButton.addEventListener("click", function () {
        deleteSavedProduct(index);
    });

    card.appendChild(deleteButton);
    list.appendChild(card);
});
```

}

// Save a product
function saveProduct(product) {
savedProducts.push(product);

```
try {
    localStorage.setItem("shgProducts", JSON.stringify(savedProducts));
    displaySavedProducts();
} catch (error) {
    savedProducts.pop();
    alert("Could not save this product in your browser.");
}
```

}

// Delete a product
function deleteSavedProduct(index) {
if (!confirm("Do you want to delete this product?")) return;

```
savedProducts.splice(index, 1);

try {
    localStorage.setItem("shgProducts", JSON.stringify(savedProducts));
    displaySavedProducts();
} catch (error) {
    alert("Could not update your saved products.");
}
```

}

// ==========================================
// PRODUCT COST CALCULATOR
// ==========================================

const costForm = document.getElementById("costForm");

if (costForm) {
costForm.addEventListener("submit", function (event) {
event.preventDefault();

```
    const productName = document.getElementById("productName").value.trim();
    const quantity = Number(document.getElementById("quantity").value);
    const materials = Number(document.getElementById("materials").value);
    const labour = Number(document.getElementById("labour").value);
    const packaging = Number(document.getElementById("packaging").value);
    const transport = Number(document.getElementById("transport").value);
    const other = Number(document.getElementById("other").value);
    const margin = Number(document.getElementById("margin").value);

    const expenses = [materials, labour, packaging, transport, other];

    if (
        !productName ||
        !Number.isFinite(quantity) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(margin) ||
        margin < 0 ||
        margin > 500 ||
        expenses.some(function (value) {
            return !Number.isFinite(value) || value < 0;
        })
    ) {
        alert("Enter a product name, a whole-number quantity, valid costs, and a margin between 0% and 500%.");
        return;
    }

    const totalCost = materials + labour + packaging + transport + other;
    const costPerProduct = totalCost / quantity;
    const profitPerProduct = costPerProduct * margin / 100;
    const sellingPrice = costPerProduct + profitPerProduct;
    const batchProfit = profitPerProduct * quantity;

    const result = document.getElementById("result");

    if (!result) {
        alert("Cost report section not found. Check that your HTML contains id='result'.");
        return;
    }

    result.innerHTML =
        "<h3>🌿 Your Cost Report</h3>" +
        "<p>Product: <strong>" + escapeHTML(productName) + "</strong></p>" +
        "<p>Total production cost: <strong>" + formatRupees(totalCost) + "</strong></p>" +
        "<p>Quantity produced: <strong>" + quantity + "</strong></p>" +
        "<p>Cost per product: <strong>" + formatRupees(costPerProduct) + "</strong></p>" +
        "<p>Estimated profit per product: <strong>" + formatRupees(profitPerProduct) + "</strong></p>" +
        "<p>Suggested selling price: <strong>" + formatRupees(sellingPrice) + "</strong></p>" +
        "<p>Estimated batch profit: <strong>" + formatRupees(batchProfit) + "</strong></p>" +
        "<p><small>Estimates exclude expenses not entered, taxes, and selling-platform fees. Margin is a markup on cost.</small></p>";

    saveProduct({
        name: productName,
        quantity: quantity,
        totalCost: Number(totalCost.toFixed(2)),
        unitCost: Number(costPerProduct.toFixed(2)),
        sellingPrice: Number(sellingPrice.toFixed(2)),
        batchProfit: Number(batchProfit.toFixed(2)),
        savedAt: new Date().toISOString()
    });
});
```

}

// ==========================================
// PRODUCT LISTING GENERATOR
// ==========================================

const listingForm = document.getElementById("listingForm");

if (listingForm) {
listingForm.addEventListener("submit", function (event) {
event.preventDefault();

```
    const name = document.getElementById("listingName").value.trim();
    const category = document.getElementById("category").value.trim();
    const materials = document.getElementById("materialsUsed").value.trim();
    const features = document.getElementById("featuresInput").value.trim();
    const language = document.getElementById("language").value;
    const output = document.getElementById("listingOutput");

    if (!name || !category || !materials || !features) {
        alert("Please fill in all product listing fields.");
        return;
    }

    let listing;

    if (language.toLowerCase().includes("tamil")) {
        listing =
            "🌿 " + name + "\n\n" +
            "வகை: " + category + "\n" +
            "பயன்படுத்திய பொருட்கள்: " + materials + "\n\n" +
            "சிறப்பம்சங்கள்:\n" + features + "\n\n" +
            "பெண்கள் சுய உதவிக் குழுவினரால் தயாரிக்கப்பட்ட தயாரிப்பு. உள்ளூர் தொழில்முனைவோரை ஆதரியுங்கள்!\n\n" +
            "SHG Saathi AI — Smart Pricing. Better Livelihoods.";
    } else {
        listing =
            "🌿 " + name + "\n\n" +
            "Category: " + category + "\n" +
            "Materials: " + materials + "\n\n" +
            "Product Highlights:\n" + features + "\n\n" +
            "Proudly prepared by a Women's Self-Help Group. Support local makers and sustainable livelihoods!\n\n" +
            "SHG Saathi AI — Smart Pricing. Better Livelihoods.";
    }

    output.textContent = listing;

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy Listing";

    copyButton.addEventListener("click", function () {
        copyListing(listing);
    });

    output.appendChild(document.createElement("br"));
    output.appendChild(document.createElement("br"));
    output.appendChild(copyButton);
});
```

}

// Copy generated listing
async function copyListing(listing) {
try {
await navigator.clipboard.writeText(listing);
alert("Product listing copied!");
} catch (error) {
const textArea = document.createElement("textarea");
textArea.value = listing;
document.body.appendChild(textArea);
textArea.select();

```
    const copied = document.execCommand("copy");
    textArea.remove();

    alert(copied ? "Product listing copied!" : "Please copy the listing manually.");
}
```

}

// Initialize saved products
displaySavedProducts();
