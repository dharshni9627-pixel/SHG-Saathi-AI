// ==========================================
// SHG SAATHI AI
// Product Costing and Listing Assistant
// ==========================================

// 1. HELPER FUNCTIONS

function formatRupees(amount) {
return "₹" + Number(amount).toLocaleString("en-IN", {
minimumFractionDigits: 2,
maximumFractionDigits: 2
});
}

function escapeHTML(value) {
return String(value).replace(/[&<>"']/g, function (character) {
const characters = {
"&": "&",
"<": "<",
">": ">",
'"': """,
"'": "'"
};

```
    return characters[character];
});
```

}

// 2. LOAD SAVED PRODUCTS

let savedProducts = [];

try {
savedProducts = JSON.parse(
localStorage.getItem("shgProducts")
) || [];

```
if (!Array.isArray(savedProducts)) {
    savedProducts = [];
}
```

} catch (error) {
savedProducts = [];
}

// 3. DISPLAY SAVED PRODUCTS

function displaySavedProducts() {
const list = document.getElementById("savedProductsList");

```
if (!list) {
    return;
}

if (savedProducts.length === 0) {
    list.innerHTML = "<p>No products saved yet. Calculate a product cost to get started.</p>";
    return;
}

list.innerHTML = "";

savedProducts.forEach(function (product, index) {
    const card = document.createElement("div");
    card.className = "feature-card";

    const title = document.createElement("h3");
    title.textContent = "📦 " + product.name;

    const quantity = document.createElement("p");
    quantity.textContent = "Quantity: " + product.quantity;

    const total = document.createElement("p");
    total.textContent = "Total production cost: " +
        formatRupees(product.totalCost);

    const unit = document.createElement("p");
    unit.textContent = "Cost per product: " +
        formatRupees(product.unitCost);

    const price = document.createElement("p");
    price.textContent = "Suggested selling price: " +
        formatRupees(product.sellingPrice);

    const profit = document.createElement("p");
    profit.textContent = "Estimated batch profit: " +
        formatRupees(product.batchProfit);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "🗑️ Delete";
    deleteButton.addEventListener("click", function () {
        deleteSavedProduct(index);
    });

    card.appendChild(title);
    card.appendChild(quantity);
    card.appendChild(total);
    card.appendChild(unit);
    card.appendChild(price);
    card.appendChild(profit);
    card.appendChild(deleteButton);

    list.appendChild(card);
});
```

}

// 4. SAVE A PRODUCT

function saveProduct(product) {
savedProducts.push(product);

```
try {
    localStorage.setItem(
        "shgProducts",
        JSON.stringify(savedProducts)
    );

    displaySavedProducts();
} catch (error) {
    savedProducts.pop();

    alert("Unable to save the product in this browser.");
}
```

}

// 5. DELETE A SAVED PRODUCT

function deleteSavedProduct(index) {
if (index < 0 || index >= savedProducts.length) {
return;
}

```
const confirmed = confirm(
    "Are you sure you want to delete this product?"
);

if (!confirmed) {
    return;
}

savedProducts.splice(index, 1);

try {
    localStorage.setItem(
        "shgProducts",
        JSON.stringify(savedProducts)
    );

    displaySavedProducts();
} catch (error) {
    alert("Unable to update saved products.");
}
```

}

// 6. PRODUCT COST CALCULATOR

const costForm = document.getElementById("costForm");

if (costForm) {
costForm.addEventListener("submit", function (event) {
event.preventDefault();

```
    const productName = document
        .getElementById("productName").value.trim();

    const quantity = Number(
        document.getElementById("quantity").value
    );

    const materials = Number(
        document.getElementById("materials").value
    );

    const labour = Number(
        document.getElementById("labour").value
    );

    const packaging = Number(
        document.getElementById("packaging").value
    );

    const transport = Number(
        document.getElementById("transport").value
    );

    const other = Number(
        document.getElementById("other").value
    );

    const margin = Number(
        document.getElementById("margin").value
    );

    const costValues = [
        materials,
        labour,
        packaging,
        transport,
        other
    ];

    if (
        !productName ||
        !Number.isFinite(quantity) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(margin) ||
        margin < 0 ||
        margin > 500 ||
        costValues.some(function (value) {
            return !Number.isFinite(value) || value < 0;
        })
    ) {
        alert("Please enter a valid product name, whole-number quantity, and non-negative costs. Profit margin must be between 0% and 500%.");
        return;
    }

    // Calculate total production expenses
    const totalCost =
        materials + labour + packaging + transport + other;

    // Calculate cost per product
    const costPerProduct = totalCost / quantity;

    // Calculate profit per product
    const profitPerProduct =
        costPerProduct * (margin / 100);

    // Calculate suggested selling price
    const sellingPrice =
        costPerProduct + profitPerProduct;

    // Calculate profit for the complete batch
    const batchProfit = profitPerProduct * quantity;

    const result = document.getElementById("result");

    if (!result) {
        alert("The cost report section was not found.");
        return;
    }

    result.innerHTML = `
        <h3>🌿 Your Cost Report</h3>
        <p>Product: <strong>${escapeHTML(productName)}</strong></p>
        <p>Total production cost: <strong>${formatRupees(totalCost)}</strong></p>
        <p>Quantity produced: <strong>${quantity}</strong></p>
        <p>Cost per product: <strong>${formatRupees(costPerProduct)}</strong></p>
        <p>Estimated profit per product: <strong>${formatRupees(profitPerProduct)}</strong></p>
        <p>Suggested selling price: <strong>${formatRupees(sellingPrice)}</strong></p>
        <p>Estimated batch profit: <strong>${formatRupees(batchProfit)}</strong></p>
        <p><small>This estimate excludes expenses you have not entered, taxes, and selling-platform fees. The margin is a markup on production cost, not a percentage of the final selling price.</small></p>
    `;

    // Save the calculated product
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

// 7. PRODUCT LISTING GENERATOR

const listingForm = document.getElementById("listingForm");

if (listingForm) {
listingForm.addEventListener("submit", function (event) {
event.preventDefault();

```
    const nameElement = document.getElementById("listingName");
    const categoryElement = document.getElementById("category");
    const materialsElement = document.getElementById("materialsUsed");
    const featuresElement = document.getElementById("featuresInput");
    const languageElement = document.getElementById("language");
    const output = document.getElementById("listingOutput");

    if (
        !nameElement ||
        !categoryElement ||
        !materialsElement ||
        !featuresElement ||
        !languageElement ||
        !output
    ) {
        alert("Some listing form fields are missing. Please check your HTML.");
        return;
    }

    const name = nameElement.value.trim();
    const category = categoryElement.value.trim();
    const materials = materialsElement.value.trim();
    const features = featuresElement.value.trim();
    const language = languageElement.value;

    if (!name || !category || !materials || !features) {
        alert("Please fill in all product listing fields.");
        return;
    }

    let listing = "";

    if (language.toLowerCase().includes("tamil")) {
        listing =
            "🌿 " + name + "\n\n" +
            "வகை: " + category + "\n" +
            "பயன்படுத்திய பொருட்கள்: " + materials + "\n\n" +
            "சிறப்பம்சங்கள்:\n" + features + "\n\n" +
            "பெண்கள் சுய உதவிக் குழுவினரால் தயாரிக்கப்பட்ட தயாரிப்பு. " +
            "உள்ளூர் தொழில்முனைவோரை ஆதரியுங்கள்!\n\n" +
            "SHG Saathi AI — Smart Pricing. Better Livelihoods.";
    } else {
        listing =
            "🌿 " + name + "\n\n" +
            "Category: " + category + "\n" +
            "Materials: " + materials + "\n\n" +
            "Product Highlights:\n" + features + "\n\n" +
            "Proudly prepared by a Women's Self-Help Group. " +
            "Support local makers and sustainable livelihoods!\n\n" +
            "SHG Saathi AI — Smart Pricing. Better Livelihoods.";
    }

    output.textContent = listing;

    if (!output.querySelector(".copy-listing-button")) {
        const copyButton = document.createElement("button");

        copyButton.type = "button";
        copyButton.className = "copy-listing-button";
        copyButton.textContent = "📋 Copy Listing";

        copyButton.addEventListener("click", function () {
            copyListing(listing);
        });

        output.appendChild(document.createElement("br"));
        output.appendChild(document.createElement("br"));
        output.appendChild(copyButton);
    } else {
        const copyButton = output.querySelector(".copy-listing-button");

        copyButton.onclick = function () {
            copyListing(listing);
        };
    }
});
```

}

// 8. COPY PRODUCT LISTING

async function copyListing(text) {
try {
await navigator.clipboard.writeText(text);
alert("Product listing copied successfully!");
} catch (error) {
const textArea = document.createElement("textarea");

```
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    textArea.remove();

    if (copied) {
        alert("Product listing copied successfully!");
    } else {
        alert("Copy failed. Please select and copy the listing manually.");
    }
}
```

}

// 9. INITIALIZE THE PAGE

displaySavedProducts();


