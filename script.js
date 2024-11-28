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

const tokenMintAddress = "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump"; // Replace with your token mint address
const rpcUrl = "https://api.mainnet-beta.solana.com"; // Solana RPC endpoint

async function fetchTransactions() {
    try {
        const response = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getSignaturesForAddress",
                params: [tokenMintAddress, { limit: 10 }]
            })
        });

        const data = await response.json();
        const signatures = data.result;

        const transactions = await Promise.all(
            signatures.map(async (signatureInfo) => {
                const txResponse = await fetch(rpcUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: "getTransaction",
                        params: [signatureInfo.signature, { encoding: "json" }]
                    })
                });
                return await txResponse.json();
            })
        );

        const tableBody = document.getElementById("transactionTable");
        tableBody.innerHTML = ""; // Clear existing rows
        transactions.forEach((tx, index) => {
            if (tx.result) {
                const buyer = tx.result.transaction.message.accountKeys[0]; 
                const signature = signatures[index].signature;
                const amount = parseAmount(tx.result); 
                tableBody.innerHTML += `
                    <tr class="transaction-row">
                        <td>${buyer}</td>
                        <td>${amount} SOL</td>
                        <td>${signature}</td>
                    </tr>
                `;
            }
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        document.getElementById("transactionTable").innerHTML = `<tr><td colspan="3">Error fetching transactions</td></tr>`;
    }
}

function parseAmount(transaction) {
    const lamports = transaction.meta.postBalances[0] - transaction.meta.preBalances[0];
    return (lamports / 1e9).toFixed(2); // Convert lamports to SOL
}

// Fetch transactions every 30 seconds for real-time updates
setInterval(fetchTransactions, 30000);

// Initially fetch transactions when the page loads
document.addEventListener("DOMContentLoaded", fetchTransactions);
