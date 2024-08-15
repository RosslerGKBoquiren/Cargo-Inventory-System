// Function to initialize the application
function initializeApp() {
    // Clear the inventory in local storage
    localStorage.removeItem('inventory');

    // Initialize storage units
    // update
    initializeStorageUnits();

    // Display existing inventory (which will now be empty)
    displayInventory();
}

// Run the initializeApp function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
