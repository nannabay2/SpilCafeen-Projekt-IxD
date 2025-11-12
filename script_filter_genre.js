// Get DOM elements
const showResultsBtn = document.getElementById('showResultsBtn');

// Fetch games data and generate genre options dynamically
async function loadGenreOptions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json');
        const games = await response.json();
        
        // Get unique genres
        const genres = new Set();
        games.forEach(game => {
            if (game.genre) {
                genres.add(game.genre);
            }
        });
        
        // Convert to sorted array
        const sortedGenres = Array.from(genres).sort((a, b) => a.localeCompare(b, 'da'));
        
        // Generate HTML for genre options
        const container = document.querySelector('.genre-options');
        container.innerHTML = '';
        
        sortedGenres.forEach((genre, index) => {
            // Create item
            const item = document.createElement('div');
            item.className = 'genre-item';
            const genreId = genre.toLowerCase().replace(/\s+/g, '-').replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a');
            item.innerHTML = `
                <span class="genre-label">${genre}</span>
                <input type="checkbox" class="genre-checkbox" id="genre-${genreId}" value="${genre}">
                <label for="genre-${genreId}" class="checkbox-label"></label>
            `;
            container.appendChild(item);
            
            // Add divider if not last
            if (index < sortedGenres.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'genre-divider';
                container.appendChild(divider);
            }
        });
        
        // Load saved selections after options are created
        loadSavedSelections();
        
    } catch (error) {
        console.error('Error loading genre options:', error);
    }
}

// Load saved selections from sessionStorage
function loadSavedSelections() {
    const savedGenre = sessionStorage.getItem('filterGenre');
    if (savedGenre) {
        const selectedGenre = JSON.parse(savedGenre);
        const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
        genreCheckboxes.forEach(checkbox => {
            if (selectedGenre.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

// Clear all selections
function clearAllSelections() {
    const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
    genreCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    sessionStorage.removeItem('filterGenre');
}

// Save selections and navigate
showResultsBtn.addEventListener('click', () => {
    const selectedGenre = [];
    const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
    genreCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedGenre.push(checkbox.value);
        }
    });
    
    // Save to sessionStorage
    if (selectedGenre.length > 0) {
        sessionStorage.setItem('filterGenre', JSON.stringify(selectedGenre));
    } else {
        sessionStorage.removeItem('filterGenre');
    }
    
    // Navigate back to filter.html to allow adding more filters
    window.location.href = 'filter.html';
});

// Load genre options on page load
loadGenreOptions();

// Listen for storage changes (if user clears filters from another tab/window)
window.addEventListener('storage', (e) => {
    if (e.key === 'filterGenre') {
        if (e.newValue === null) {
            clearAllSelections();
        } else {
            loadSavedSelections();
        }
    }
});
