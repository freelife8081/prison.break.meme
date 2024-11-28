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
            alert("Failed to copy donation address. Please try again.");
        }
    );
});
