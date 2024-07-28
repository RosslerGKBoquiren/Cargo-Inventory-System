// Function to initialize storage units
function initializeStorageUnits() {
    // Get the storage units container element
    const storageUnitsContainer = document.getElementById('storage_units');

    // Create 30 storage units
    for (let i = 1; i <= 30; i++) {
        const storageUnit = document.createElement('div');
        storageUnit.classList.add('storage_unit');
        storageUnit.innerHTML = `<div class="unit-header">Unit ${i}</div><div class="unit-content"></div>`;

        // Add event listeners for drag-and-drop functionality
        storageUnit.addEventListener('dragover', handleDragOver);
        storageUnit.addEventListener('drop', handleDrop);

        // Append the storage unit to the container
        storageUnitsContainer.appendChild(storageUnit);
    }

    // Make the special units droppable
    document.getElementById('airport').addEventListener('dragover', handleDragOver);
    document.getElementById('airport').addEventListener('drop', handleDrop);
    document.getElementById('delete').addEventListener('dragover', handleDragOver);
    document.getElementById('delete').addEventListener('drop', handleDrop);
}

// Function to handle the start of dragging
function handleDragStart(event) {
    const data = event.target.innerText;
    event.dataTransfer.setData('text/plain', data);
    event.dataTransfer.setData('origin', event.target.closest('.storage_unit, #inventory_list').id);
}

// Function to allow dropping by preventing the default behavior
function handleDragOver(event) {
    event.preventDefault();
}

// Function to handle dropping
function handleDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const origin = event.dataTransfer.getData('origin');
    const target = event.target.closest('.storage_unit, #airport, #delete');

    if (!target) return;

    // Handle dropping into the 'Airport' unit
    if (target.id === 'airport') {
        archiveItem(data);
    } else if (target.id === 'delete') {
        confirmDeletion(data);
    } else {
        // Check if the target unit already has 2 items
        if (target.querySelector('.unit-content').childElementCount >= 2) {
            alert("A storage unit can only hold up to 2 items.");
            return;
        }

        // Create a new item element and add it to the storage unit
        const item = document.createElement('div');
        item.classList.add('stored_item');
        item.innerText = data;
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', handleDragStart);

        // Append the item to the unit content area
        target.querySelector('.unit-content').appendChild(item);

        // Adjust font size if necessary
        adjustFontSize(item);
    }

    // Remove the item from the origin location
    if (origin === 'inventory_list') {
        removeItemFromDisplayList(data);
    } else {
        const originElement = document.getElementById(origin);
        const items = Array.from(originElement.querySelector('.unit-content').children);
        items.forEach(item => {
            if (item.innerText === data) {
                originElement.querySelector('.unit-content').removeChild(item);
            }
        });
    }
}

// Function to adjust font size based on the length of the string
function adjustFontSize(element) {
    const text = element.innerText;
    let fontSize = 12; // Default font size
    if (text.length > 20) fontSize = 10;
    if (text.length > 30) fontSize = 8;
    element.style.fontSize = `${fontSize}px`;
}

// Function to archive an item when dragged to the 'Airport' unit
function archiveItem(data) {
    const archives = JSON.parse(localStorage.getItem('archives')) || [];
    archives.push(data);
    localStorage.setItem('archives', JSON.stringify(archives));
    displayArchives();
    alert(`Item "${data}" has been sent to the airport and archived.`);
    removeItemFromInventory(data);
}

// Function to confirm deletion of an item when dragged to the 'Delete' unit
function confirmDeletion(data) {
    const confirmation = confirm(`Are you sure you want to delete the item "${data}"?`);
    if (confirmation) {
        removeItemFromInventory(data);
        alert(`Item "${data}" has been deleted.`);
    }
}

// Function to remove an item from the display list
function removeItemFromDisplayList(data) {
    const inventoryList = document.getElementById('inventory_list');
    const items = Array.from(inventoryList.children);
    items.forEach(item => {
        if (item.innerText.includes(data)) {
            inventoryList.removeChild(item);
        }
    });
}

// Function to remove an item from local storage inventory
function removeItemFromInventory(data) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const updatedInventory = inventory.filter(item => `${item.name} - ${item.quantity} - ${item.departureTime} - ${item.connectingFlight}` !== data);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    displayInventory();
}

// Function to display archived items
function displayArchives() {
    const archivesList = document.getElementById('archives_list');
    archivesList.innerHTML = '';

    const archives = JSON.parse(localStorage.getItem('archives')) || [];
    archives.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerText = item;
        archivesList.appendChild(listItem);
    });
}

// Initialize storage units when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeStorageUnits();
    displayArchives();
});
