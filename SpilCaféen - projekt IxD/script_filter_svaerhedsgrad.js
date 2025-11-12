// Get DOM elements
const showResultsBtn = document.getElementById('showResultsBtn');

// Fetch games data and generate difficulty options dynamically
async function loadDifficultyOptions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json');
        const games = await response.json();
        
        // Get unique difficulties
        const difficulties = new Set();
        games.forEach(game => {
            if (game.difficulty) {
                difficulties.add(game.difficulty);
            }
        });
        
        // Convert to sorted array (Let, Mellem, Svær)
        const sortOrder = { 'Let': 1, 'Mellem': 2, 'Svær': 3 };
        const sortedDifficulties = Array.from(difficulties).sort((a, b) => 
            (sortOrder[a] || 99) - (sortOrder[b] || 99)
        );
        
        // Generate HTML for difficulty options
        const container = document.querySelector('.difficulty-options');
        container.innerHTML = '';
        
        sortedDifficulties.forEach((difficulty, index) => {
            const difficultyId = difficulty.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a');
            
            // Create item
            const item = document.createElement('div');
            item.className = 'difficulty-item';
            item.innerHTML = `
                <span class="difficulty-label">${difficulty}</span>
                <input type="checkbox" class="difficulty-checkbox" id="difficulty-${difficultyId}" value="${difficulty}">
                <label for="difficulty-${difficultyId}" class="checkbox-label"></label>
            `;
            container.appendChild(item);
            
            // Add divider if not last
            if (index < sortedDifficulties.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'difficulty-divider';
                container.appendChild(divider);
            }
        });
        
        // Load saved selections after options are created
        loadSavedSelections();
        
    } catch (error) {
        console.error('Error loading difficulty options:', error);
    }
}

// Load saved selections from sessionStorage
function loadSavedSelections() {
    const savedDifficulty = sessionStorage.getItem('filterDifficulty');
    if (savedDifficulty) {
        const selectedDifficulty = JSON.parse(savedDifficulty);
        const difficultyCheckboxes = document.querySelectorAll('.difficulty-checkbox');
        difficultyCheckboxes.forEach(checkbox => {
            if (selectedDifficulty.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

// Clear all selections
function clearAllSelections() {
    const difficultyCheckboxes = document.querySelectorAll('.difficulty-checkbox');
    difficultyCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    sessionStorage.removeItem('filterDifficulty');
}

// Save selections and navigate
showResultsBtn.addEventListener('click', () => {
    const selectedDifficulty = [];
    const difficultyCheckboxes = document.querySelectorAll('.difficulty-checkbox');
    difficultyCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedDifficulty.push(checkbox.value);
        }
    });
    
    // Save to sessionStorage
    if (selectedDifficulty.length > 0) {
        sessionStorage.setItem('filterDifficulty', JSON.stringify(selectedDifficulty));
    } else {
        sessionStorage.removeItem('filterDifficulty');
    }
    
    // Navigate back to filter.html to allow adding more filters
    window.location.href = 'filter.html';
});

// Load difficulty options on page load
loadDifficultyOptions();

// Listen for storage changes (if user clears filters from another tab/window)
window.addEventListener('storage', (e) => {
    if (e.key === 'filterDifficulty') {
        if (e.newValue === null) {
            clearAllSelections();
        } else {
            loadSavedSelections();
        }
    }
});
