"use strict";

// ====================================
// SHG SAATHI AI
// ====================================

function formatRupees(amount) {
return "Rs. " + Number(amount).toFixed(2);
}

function escapeHTML(value) {
return String(value)
.split("&").join("&")
.split("<").join("<")
.split(">").join(">")
.split('"').join(""")
.split("'").join("'");
}

// ====================================
// LOAD SAVED PRODUCTS
// ====================================

let savedProducts = [];

try {
savedProducts = JSON.parse(localStorage.getItem("shgProducts") || "[]");

```
if (!Array.isArray(savedProducts)) {
    savedProducts = [];
}
```

} catch (error) {
savedProducts = [];
}

// ====================================
// DISPLAY SAVED PRODUCTS
// ====================================

function displaySavedProducts() {
const list = document.getElementById("savedProductsList");

```
if (!list) {
    return;
}

list.innerHTML = "";

if (savedProducts.length === 0) {
    list.textContent = "No products saved yet. Calculate a product cost to get started.";
    return;
}

savedProducts.forEach(function (product, index) {
    const card = document.createElement("div");
    card.className = "feature-card";

    const title = document.createElement("h3");
    title.textContent = "Product: " + product.name;
    card.appendChild(title);

    const details = [
        "Quantity: " + product.quantity,
        "Total cost: " + formatRupees(product.totalCost),
        "Cost per unit: " + formatRupees(product.unitCost),
        "Selling price per unit: " + formatRupees(product.sellingPrice),
        "Estimated batch profit: " + formatRupees(product.batchProfit)
    ];

    details.forEach(function (detail) {
        const paragraph = document.createElement("p");
        paragraph.textContent = detail;
        card.appendChild(paragraph);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Product";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
        savedProducts.splice(index, 1);

        try {
            localStorage.setItem("shgProducts", JSON.stringify(savedProducts));
            displaySavedProducts();
        } catch (error) {
            alert("Unable to update saved products.");
        }
    });

    card.appendChild(deleteButton);
    list.appendChild(card);
});
```

}

// ====================================
// SAVE PRODUCT
// ====================================

function saveProduct(product) {
savedProducts.push(product);

```
try {
    localStorage.setItem("shgProducts", JSON.stringify(savedProducts));
    displaySavedProducts();
    alert("Product calculated and saved successfully!");
} catch (error) {
    savedProducts.pop();
    alert("Could not save the product. Check browser storage.");
}
```

}

// ====================================
// COST CALCULATOR
// ====================================

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

    const costs = [materials, labour, packaging, transport, other];

    if (
        productName === "" ||
        !Number.isFinite(quantity) ||
        quantity < 1 ||
        !Number.isInteger(quantity) ||
        !Number.isFinite(margin) ||
        margin < 0 ||
        margin > 500 ||
        costs.some(function (cost) {
            return !Number.isFinite(cost) || cost < 0;
        })
    ) {
        alert("Enter a product name, valid quantity, non-negative costs, and a margin between 0 and 500.");
        return;
    }

    const totalCost = materials + labour + packaging + transport + other;
    const unitCost = totalCost / quantity;
    const profitPerUnit = unitCost * margin / 100;
    const sellingPrice = unitCost + profitPerUnit;
    const batchProfit = profitPerUnit * quantity;

    const result = document.getElementById("result");

    if (!result) {
        alert("Cannot find the result area. Check the HTML element with id=result.");
        return;
    }

    result.innerHTML =
        "<h3>Your Cost Report</h3>" +
        "<p>Product: <strong>" + escapeHTML(productName) + "</strong></p>" +
        "<p>Total production cost: <strong>" + formatRupees(totalCost) + "</strong></p>" +
        "<p>Quantity: <strong>" + quantity + "</strong></p>" +
        "<p>Cost per product: <strong>" + formatRupees(unitCost) + "</strong></p>" +
        "<p>Profit per product: <strong>" + formatRupees(profitPerUnit) + "</strong></p>" +
        "<p>Selling price per product: <strong>" + formatRupees(sellingPrice) + "</strong></p>" +
        "<p>Estimated batch profit: <strong>" + formatRupees(batchProfit) + "</strong></p>";

    saveProduct({
        name: productName,
        quantity: quantity,
        totalCost: Number(totalCost.toFixed(2)),
        unitCost: Number(unitCost.toFixed(2)),
        sellingPrice: Number(sellingPrice.toFixed(2)),
        batchProfit: Number(batchProfit.toFixed(2))
    });
});
```

}

// ====================================
// PRODUCT LISTING GENERATOR
// ====================================

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
            name + "\n\n" +
            "வகை: " + category + "\n" +
            "பயன்படுத்திய பொருட்கள்: " + materials + "\n" +
            "சிறப்பம்சங்கள்: " + features + "\n\n" +
            "பெண்கள் சுய உதவிக் குழுவினரால் தயாரிக்கப்பட்ட தயாரிப்பு. உள்ளூர் தொழில்முனைவோரை ஆதரியுங்கள்!";
    } else {
        listing =
            name + "\n\n" +
            "Category: " + category + "\n" +
            "Materials: " + materials + "\n" +
            "Features: " + features + "\n\n" +
            "Proudly made by a Women's Self-Help Group. Support local businesses!";
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

// ====================================
// COPY LISTING
// ====================================

function copyListing(listing) {
const textArea = document.createElement("textarea");
textArea.value = listing;
document.body.appendChild(textArea);
textArea.select();

```
try {
    document.execCommand("copy");
    alert("Product listing copied!");
} catch (error) {
    alert("Please select and copy the listing manually.");
}

textArea.remove();
```

}

// ====================================
// INITIALIZE
// ====================================

displaySavedProducts();
