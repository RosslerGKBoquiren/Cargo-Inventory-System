// Function to add an item to the inventory
function addItem(itemName, itemQuantity, departureTime, connectingFlight) {
    // Validate item name format (3 capital letters)
    const nameFormat = /^[A-Z]{3}$/;
    if (!nameFormat.test(itemName)) {
        alert("Item name must be 3 capital letters.");
        return;
    }
// update

    // Validate quantity (positive number)
    if (itemQuantity <= 0) {
        alert("Quantity must be a positive number.");
        return;
    }

    // Validate connecting flight name format (if provided)
    if (connectingFlight && !nameFormat.test(connectingFlight)) {
        alert("Connecting flight name must be 3 capital letters.");
        return;
    }

    // Get existing inventory from local storage or create an empty array
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    // Add the new item to the inventory array
    inventory.push({
        name: itemName,
        quantity: itemQuantity,
        departureTime: departureTime,
        connectingFlight: connectingFlight || ''
    });

    // Save the updated inventory back to local storage
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Refresh the displayed inventory list
    displayInventory();
}

// Function to display inventory items on the page
function displayInventory() {
    // Get the inventory list element
    const inventoryList = document.getElementById('inventory_list');

    // Clear the current inventory list
    inventoryList.innerHTML = '';

    // Get inventory from local storage or create an empty array
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    // Loop through each item in the inventory and add it to the list
    inventory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ${item.quantity} - ${item.departureTime} - ${item.connectingFlight}`;
        listItem.setAttribute('draggable', true);
        listItem.addEventListener('dragstart', handleDragStart);
        inventoryList.appendChild(listItem);
    });
}
// getElementById redundant. Boxes currently dont have IDs 

// Add event listener for the inventory form submission
document.getElementById('inventory_form').addEventListener('submit', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the item name, quantity, departure time, and connecting flight from the form inputs
    const itemName = document.getElementById('item_name').value.toUpperCase();
    const itemQuantity = document.getElementById('item_quantity').value;
    const departureTime = document.getElementById('departure_time').value;
    const connectingFlight = document.getElementById('connecting_flight').value.toUpperCase();

    // Add the item to the inventory
    addItem(itemName, itemQuantity, departureTime, connectingFlight);

    // Clear the form inputs
    document.getElementById('inventory_form').reset();
});

// Event listener to convert item name to uppercase
document.getElementById('item_name').addEventListener('input', function (event) {
    event.target.value = event.target.value.toUpperCase();
});

// Event listener to convert connecting flight name to uppercase
document.getElementById('connecting_flight').addEventListener('input', function (event) {
    event.target.value = event.target.value.toUpperCase();
});

// Function to handle the start of dragging
function handleDragStart(event) {
    const data = event.target.textContent;
    event.dataTransfer.setData('text/plain', data);
}

// Display the inventory when the page loads
displayInventory();
