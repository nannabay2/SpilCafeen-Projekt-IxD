// Filter spillerantal functionality
console.log('Filter spillerantal page loaded');

// Fetch games data and generate player count options dynamically
async function loadPlayerCountOptions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json');
        const games = await response.json();
        
        // Get unique player counts
        const playerCounts = new Set();
        games.forEach(game => {
            const min = game.players.min;
            const max = game.players.max;
            
            // Add all counts in the range
            for (let i = min; i <= max; i++) {
                playerCounts.add(i);
            }
        });
        
        // Convert to sorted array
        const sortedCounts = Array.from(playerCounts).sort((a, b) => a - b);
        
        // Generate HTML for player count options
        const container = document.querySelector('.player-count-options');
        container.innerHTML = '';
        
        sortedCounts.forEach((count, index) => {
            const displayCount = count >= 9 ? '9+' : count;
            const value = count >= 9 ? '9' : count;
            
            // Create item
            const item = document.createElement('div');
            item.className = 'player-count-item';
            item.innerHTML = `
                <span class="player-count-number">${displayCount}</span>
                <input type="checkbox" class="player-checkbox" id="player${count}" value="${value}">
                <label for="player${count}" class="checkbox-label"></label>
            `;
            container.appendChild(item);
            
            // Add divider if not last
            if (index < sortedCounts.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'player-count-divider';
                container.appendChild(divider);
            }
        });
        
        // Load saved selections after options are created
        loadSavedSelections();
        
    } catch (error) {
        console.error('Error loading player count options:', error);
    }
}

// Handle show results button
const showResultsBtn = document.getElementById('showResultsBtn');

if (showResultsBtn) {
    showResultsBtn.addEventListener('click', function() {
        // Get selected player counts
        const selectedPlayers = [];
        const checkboxes = document.querySelectorAll('.player-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedPlayers.push(checkbox.value);
            }
        });
        
        console.log('Selected player counts:', selectedPlayers);
        
        // Store selections in sessionStorage
        sessionStorage.setItem('filterPlayers', JSON.stringify(selectedPlayers));
        
        // Navigate back to filter.html to allow adding more filters
        window.location.href = 'filter.html';
    });
}

// Load previously selected values from sessionStorage
function loadSavedSelections() {
    const savedPlayers = sessionStorage.getItem('filterPlayers');
    if (savedPlayers) {
        const selectedPlayers = JSON.parse(savedPlayers);
        checkboxes.forEach(checkbox => {
            if (selectedPlayers.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

loadSavedSelections();

// Function to clear all selections
function clearAllSelections() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    sessionStorage.removeItem('filterPlayers');
}

// Listen for storage changes (when cleared from another page)
window.addEventListener('storage', function(e) {
    if (e.key === 'filterPlayers' && e.newValue === null) {
        clearAllSelections();
    }
});

// Load player count options on page load
loadPlayerCountOptions();
