// Get elements from the DOM
const billInput = document.getElementById("billAmount");
const tipSelect = document.getElementById("tipPercentage");
const calculateBtn = document.getElementById("calculate");
const totalDisplay = document.getElementById("totalAmount");
const themeToggle = document.getElementById("themeToggle");
const form = document.querySelector(".calculator");

// Function to calculate the tip and total amount
function calculateTotal(event) {
  // Prevent the form from submitting
  event.preventDefault();

  // Get the bill amount and tip percentage from the inputs
  let bill = billInput.value;
  let tip = tipSelect.value; 

  // Calculate the total amount
  let total = bill + (bill * tip / 100);

  // Display the total amount as a decimal
  totalDisplay.innerText = `Total: $${total.toFixed(2)}`; // Format number to a fixed number of (2) decimal places
}

// Function to toggle light/dark mode
function toggleTheme() {
  // Toggle the 'dark' class on the body
  document.body.classList.toggle("dark");
  
  // Update the button text and icon based on the current theme
  if (document.body.classList.contains("dark")) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Switch to Light Mode';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Switch to Dark Mode';
  }
}

// Event listeners
form.addEventListener("submit", calculateTotal);
themeToggle.addEventListener("click", toggleTheme);
