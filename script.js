// Get elements from the DOM
const billInput = document.getElementById("billAmount");
const tipSelect = document.getElementById("tipPercentage");
const calculateBtn = document.getElementById("calculate");
const totalDisplay = document.getElementById("totalAmount");
const themeToggle = document.getElementById("themeToggle");

// Function to calculate the tip and total amount
function calculateTotal() {
    totalDisplay.innerText = "Total: $" + total.toFixed(2);

    let bill = billInput.value;
    let tip = tipSelect.value; 

    let total = bill + (bill * tip / 100);
}

// Function to toggle light/dark mode
function toggleTheme() {
    if (document.body.className === "dark") {
        document.body.className = "light";
        themeToggle.innerText = "Switch to Dark Mode";
    } else {
        document.body.classList.add("dark");
        themeToggle.innerText = "Switch to Light Mode";
    }
}

// Event listeners
calculateBtn.addEventListener("click", calculateTotal);
themeToggle.addEventListener("click", toggleTheme);
