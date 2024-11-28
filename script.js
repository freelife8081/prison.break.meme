// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Copy Donation Address to Clipboard
document.querySelector(".donate strong").addEventListener("click", function () {
    const donationAddress = this.textContent;
    navigator.clipboard.writeText(donationAddress).then(
        () => {
            alert("Donation address copied to clipboard!");
        },
        () => {
            alert("Failed to copy donation address. Please try again..");
        }
    );
});

// Placeholder: Replace this with real blockchain data fetch logic
async function fetchTransactions() {
    // Example transactions (Replace with API calls)
    const transactions = [
        { buyer: "Address_1", amount: 5 },
        { buyer: "Address_2", amount: 10 },
        { buyer: "Address_3", amount: 15 },
    ];

    // Calculate total amount
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // Populate the table
    const tableBody = document.getElementById("transactionTable");
    tableBody.innerHTML = ""; // Clear table before adding rows
    transactions.forEach((tx) => {
        const percentage = ((tx.amount / total) * 100).toFixed(2);
        const row = `
            <tr>
                <td>${tx.buyer}</td>
                <td>${tx.amount.toFixed(2)} SOL</td>
                <td>${percentage}%</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Fetch and display transactions on page load
document.addEventListener("DOMContentLoaded", fetchTransactions);
