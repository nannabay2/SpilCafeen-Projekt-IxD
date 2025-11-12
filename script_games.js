// Sort dropdown functionality
const sortButton = document.getElementById('sortButton');
const sortDropdown = document.getElementById('sortDropdown');

if (sortButton && sortDropdown) {
    sortButton.addEventListener('click', function(e) {
        e.stopPropagation();
        sortButton.classList.toggle('active');
        sortDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!sortButton.contains(e.target) && !sortDropdown.contains(e.target)) {
            sortButton.classList.remove('active');
            sortDropdown.classList.remove('active');
        }
    });

    // Handle sort option selection
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sortType = this.getAttribute('data-sort');
            console.log('Sortering valgt:', sortType);
            
            // Close dropdown after selection
            sortButton.classList.remove('active');
            sortDropdown.classList.remove('active');
            
            // Here you can add sorting logic
            sortGames(sortType);
        });
    });
}

// Sort games function
function sortGames(sortType) {
    const gamesGrid = document.querySelector('.games-grid');
    const gameCards = Array.from(gamesGrid.querySelectorAll('.game-card'));
    
    gameCards.sort((a, b) => {
        switch(sortType) {
            case 'name':
                const nameA = a.querySelector('.game-title').textContent;
                const nameB = b.querySelector('.game-title').textContent;
                return nameA.localeCompare(nameB, 'da');
            
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating-number').textContent);
                const ratingB = parseFloat(b.querySelector('.rating-number').textContent);
                return ratingB - ratingA; // Highest first
            
            case 'time':
                const timeA = parseInt(a.querySelector('.game-tag').textContent.match(/\d+/)[0]);
                const timeB = parseInt(b.querySelector('.game-tag').textContent.match(/\d+/)[0]);
                return timeA - timeB; // Shortest first
            
            case 'players':
                // Extract max player count
                const playersTextA = a.querySelectorAll('.game-tag')[1].textContent;
                const playersTextB = b.querySelectorAll('.game-tag')[1].textContent;
                const maxPlayersA = parseInt(playersTextA.match(/\d+/g).pop());
                const maxPlayersB = parseInt(playersTextB.match(/\d+/g).pop());
                return maxPlayersB - maxPlayersA; // Most players first
            
            case 'shelf':
                // Get shelf numbers (e.g., "C4", "G3", "K7", "09")
                const shelfA = a.querySelector('.shelf-number').textContent.trim();
                const shelfB = b.querySelector('.shelf-number').textContent.trim();
                
                // Extract letter and number parts
                const letterA = shelfA.match(/[A-Z]+/i)?.[0] || '';
                const letterB = shelfB.match(/[A-Z]+/i)?.[0] || '';
                const numberA = parseInt(shelfA.match(/\d+/)?.[0] || '999');
                const numberB = parseInt(shelfB.match(/\d+/)?.[0] || '999');
                
                // Items without letters come first (pure numbers like "09")
                if (!letterA && letterB) return -1;
                if (letterA && !letterB) return 1;
                
                // If both have no letters, compare numbers
                if (!letterA && !letterB) {
                    return numberA - numberB;
                }
                
                // First compare letters alphabetically
                const letterCompare = letterA.localeCompare(letterB);
                if (letterCompare !== 0) {
                    return letterCompare;
                }
                
                // If letters are the same, compare numbers
                return numberA - numberB;
            
            case 'age':
                // Extract age from JSON data by matching game title
                const titleA = a.querySelector('.game-title').textContent.trim();
                const titleB = b.querySelector('.game-title').textContent.trim();
                const gameA = gamesData.find(game => game.title === titleA);
                const gameB = gamesData.find(game => game.title === titleB);
                const ageA = gameA?.age || 0;
                const ageB = gameB?.age || 0;
                return ageA - ageB; // Youngest first
            
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    gameCards.forEach(card => gamesGrid.appendChild(card));
}

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            const gameTitle = card.querySelector('.game-title').textContent.toLowerCase();
            
            if (gameTitle.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Fetch games data from JSON
let gamesData = [];

async function fetchGamesData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json');
        gamesData = await response.json();
        console.log('Games data loaded:', gamesData);
        return gamesData;
    } catch (error) {
        console.error('Error fetching games data:', error);
        return [];
    }
}

// Get current location from filename
function getCurrentLocation() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    if (filename.includes('Aalborg')) return 'Aalborg';
    if (filename.includes('Fredensgade')) return 'Fredensgade';
    if (filename.includes('Vestergade')) return 'Vestergade';
    if (filename.includes('Kolding')) return 'Kolding';
    
    return null;
}

// Create game card HTML
function createGameCard(game) {
    return `
        <div class="game-card">
            <div class="game-image-container">
                <img src="${game.image || 'https://via.placeholder.com/300x200'}" alt="${game.title}" class="game-image">
                <div class="game-shelf-badge">
                    <img src="https://www.figma.com/api/mcp/asset/df94fc42-4551-4e02-8735-3a152d2e2407" alt="Shelf" class="shelf-icon">
                    <span class="shelf-number">${game.shelf}</span>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-rating">
                    <span class="star">⭐</span>
                    <span class="rating-number">${game.rating}</span>
                </div>
                                <div class="game-tags">
                    <span class="game-tag"><img src="Spilcaféen_icon/Group.png" alt="Time" class="time-icon"> ${game.playtime} min</span>
                    <span class="game-tag"><img src="Spilcaféen_icon/antal.png" alt="Players" class="players-icon"> ${game.players.min}-${game.players.max}</span>
                    <span class="game-tag"><img src="Spilcaféen_icon/genre.png" alt="Genre" class="genre-icon"> ${game.genre}</span>
                </div>
            </div>
        </div>
    `;
}

// Load games for current location with optional filters
function loadGamesForLocation(applyFilters = false) {
    const currentLocation = getCurrentLocation();
    
    console.log('Current location detected:', currentLocation);
    console.log('Total games available:', gamesData.length);
    
    if (!currentLocation) {
        console.log('No location detected');
        return;
    }
    
    console.log('Loading games for location:', currentLocation);
    
    // Filter games by current location
    let locationGames = gamesData.filter(game => game.location === currentLocation);
    
    // Apply filters if requested
    if (applyFilters) {
        console.log('Applying filters to games...');
        console.log('Games before filters:', locationGames.length);
        
        // Apply player count filter
        const savedPlayers = sessionStorage.getItem('filterPlayers');
        if (savedPlayers) {
            const selectedPlayers = JSON.parse(savedPlayers);
            console.log('Filtering by player count:', selectedPlayers);
            locationGames = locationGames.filter(game => {
                const minPlayers = game.players.min;
                const maxPlayers = game.players.max;
                return selectedPlayers.some(playerCount => {
                    const count = parseInt(playerCount);
                    if (count === 9) return maxPlayers >= 9;
                    return count >= minPlayers && count <= maxPlayers;
                });
            });
            console.log('Games after player filter:', locationGames.length);
        }
        
        // Apply difficulty filter
        const savedDifficulty = sessionStorage.getItem('filterDifficulty');
        if (savedDifficulty) {
            const selectedDifficulty = JSON.parse(savedDifficulty);
            console.log('Filtering by difficulty:', selectedDifficulty);
            locationGames = locationGames.filter(game => 
                selectedDifficulty.includes(game.difficulty)
            );
            console.log('Games after difficulty filter:', locationGames.length);
        }
        
        // Apply language filter
        const savedLanguage = sessionStorage.getItem('filterLanguage');
        if (savedLanguage) {
            const selectedLanguage = JSON.parse(savedLanguage);
            console.log('Filtering by language:', selectedLanguage);
            locationGames = locationGames.filter(game => 
                selectedLanguage.includes(game.language)
            );
            console.log('Games after language filter:', locationGames.length);
        }
        
        // Apply genre filter
        const savedGenre = sessionStorage.getItem('filterGenre');
        if (savedGenre) {
            const selectedGenre = JSON.parse(savedGenre);
            console.log('Filtering by genre:', selectedGenre);
            locationGames = locationGames.filter(game => 
                selectedGenre.includes(game.genre)
            );
            console.log('Games after genre filter:', locationGames.length);
        }
    }
    
    console.log(`Found ${locationGames.length} games for ${currentLocation}${applyFilters ? ' (after filters)' : ''}`);
    
    // Get games grid
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) {
        console.error('Games grid not found');
        return;
    }
    
    // Clear existing games
    gamesGrid.innerHTML = '';
    
    // Show/hide no results message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (locationGames.length === 0) {
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
    } else {
        if (noResultsMessage) noResultsMessage.style.display = 'none';
    }
    
    // Add games for this location
    locationGames.forEach((game, index) => {
        const cardHTML = createGameCard(game);
        gamesGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    // Add click event listeners to all game cards
    const gameCards = gamesGrid.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            openGameModal(locationGames[index]);
        });
    });
    
    console.log(`Successfully loaded ${locationGames.length} games for ${currentLocation}`);
}

// Display active filters
function displayActiveFilters() {
    const activeFiltersContainer = document.querySelector('.active-filters-container');
    const activeFiltersSection = document.getElementById('activeFilters');
    
    if (!activeFiltersContainer || !activeFiltersSection) return;
    
    // Clear existing badges
    activeFiltersContainer.innerHTML = '';
    
    let hasFilters = false;
    
    // Check for player filter
    const savedPlayers = sessionStorage.getItem('filterPlayers');
    if (savedPlayers) {
        const players = JSON.parse(savedPlayers);
        players.forEach(count => {
            hasFilters = true;
            const badge = document.createElement('div');
            badge.className = 'filter-badge';
            badge.innerHTML = `
                <span>${count} spillere</span>
                <button class="remove-filter" data-filter-type="players" data-value="${count}">×</button>
            `;
            activeFiltersContainer.appendChild(badge);
        });
    }
    
    // Check for difficulty filter
    const savedDifficulty = sessionStorage.getItem('filterDifficulty');
    if (savedDifficulty) {
        const difficulties = JSON.parse(savedDifficulty);
        difficulties.forEach(level => {
            hasFilters = true;
            const badge = document.createElement('div');
            badge.className = 'filter-badge';
            badge.innerHTML = `
                <span>${level}</span>
                <span class="filter-badge-remove" data-filter="difficulty" data-value="${level}">✕</span>
            `;
            activeFiltersContainer.appendChild(badge);
        });
    }
    
    // Check for language filter
    const savedLanguage = sessionStorage.getItem('filterLanguage');
    if (savedLanguage) {
        const languages = JSON.parse(savedLanguage);
        languages.forEach(lang => {
            hasFilters = true;
            const badge = document.createElement('div');
            badge.className = 'filter-badge';
            const flag = lang === 'Dansk' ? '🇩🇰' : '🇬🇧';
            badge.innerHTML = `
                <span>${flag} ${lang}</span>
                <span class="filter-badge-remove" data-filter="language" data-value="${lang}">✕</span>
            `;
            activeFiltersContainer.appendChild(badge);
        });
    }
    
    // Check for genre filter
    const savedGenre = sessionStorage.getItem('filterGenre');
    if (savedGenre) {
        const genres = JSON.parse(savedGenre);
        genres.forEach(genre => {
            hasFilters = true;
            const badge = document.createElement('div');
            badge.className = 'filter-badge';
            badge.innerHTML = `
                <span>${genre}</span>
                <span class="filter-badge-remove" data-filter="genre" data-value="${genre}">✕</span>
            `;
            activeFiltersContainer.appendChild(badge);
        });
    }
    
    // Show or hide the filters section
    activeFiltersSection.style.display = hasFilters ? 'block' : 'none';
    
    // Adjust games-grid position based on filters
    const gamesGrid = document.querySelector('.games-grid');
    if (gamesGrid) {
        gamesGrid.style.top = hasFilters ? '460px' : '405px';
    }
    
    // Add click handlers to remove individual filters
    document.querySelectorAll('.filter-badge-remove').forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            removeFilter(filterType, filterValue);
        });
    });
}

// Remove individual filter
function removeFilter(filterType, value) {
    const storageKey = `filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
    const saved = sessionStorage.getItem(storageKey);
    
    if (saved) {
        let filters = JSON.parse(saved);
        filters = filters.filter(item => item !== value);
        
        if (filters.length > 0) {
            sessionStorage.setItem(storageKey, JSON.stringify(filters));
        } else {
            sessionStorage.removeItem(storageKey);
        }
        
        // Reload games and update display
        loadGamesForLocation();
        applyFiltersFromSessionStorage();
        displayActiveFilters();
    }
}

// Initialize games data on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, starting to fetch games data');
    
    fetchGamesData().then(() => {
        console.log('Games data loaded successfully, total games:', gamesData.length);
        
        // Load games for current location
        loadGamesForLocation();
        
        // Display active filters
        displayActiveFilters();
        
        // Apply filters if coming from filter page
        applyFiltersFromSessionStorage();
    }).catch(error => {
        console.error('Error loading games:', error);
    });
});

// Apply filters based on session storage
function applyFiltersFromSessionStorage() {
    console.log('=== applyFiltersFromSessionStorage called ===');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    
    const urlParams = new URLSearchParams(window.location.search);
    const filterType = urlParams.get('filter');
    
    console.log('Checking for filters, filterType:', filterType);
    console.log('Player filter:', sessionStorage.getItem('filterPlayers'));
    console.log('Difficulty filter:', sessionStorage.getItem('filterDifficulty'));
    console.log('Language filter:', sessionStorage.getItem('filterLanguage'));
    console.log('Genre filter:', sessionStorage.getItem('filterGenre'));
    
    // Check if we have any filters in sessionStorage
    const hasFilters = sessionStorage.getItem('filterPlayers') || 
                      sessionStorage.getItem('filterDifficulty') || 
                      sessionStorage.getItem('filterLanguage') || 
                      sessionStorage.getItem('filterGenre');
    
    console.log('Has filters in storage:', !!hasFilters);
    
    // If we have filters in storage, apply them regardless of URL parameter
    if (hasFilters) {
        console.log('Applying filters from sessionStorage');
        loadGamesForLocation(true);
    } else if (filterType && filterType !== 'none') {
        console.log('Applying filters based on URL parameter');
        loadGamesForLocation(true);
    } else {
        console.log('No filters to apply');
    }
}

// Filter games by player count
function filterGamesByPlayers(selectedPlayers) {
    console.log('Filtering games by players:', selectedPlayers);
    console.log('Games data available:', gamesData.length);
    
    if (gamesData.length === 0) {
        console.error('Games data not loaded yet!');
        return;
    }
    
    const gameCards = document.querySelectorAll('.game-card');
    let hiddenCount = 0;
    let shownCount = 0;
    
    gameCards.forEach(card => {
        const gameTitle = card.querySelector('.game-title').textContent.trim();
        const gameInfo = gamesData.find(game => game.title === gameTitle);
        
        if (gameInfo) {
            const minPlayers = gameInfo.players.min;
            const maxPlayers = gameInfo.players.max;
            
            console.log(`Checking ${gameTitle}: ${minPlayers}-${maxPlayers} players`);
            
            // Check if any selected player count falls within the game's range
            const matches = selectedPlayers.some(playerCount => {
                const count = parseInt(playerCount);
                // For 9+, check if max players is 9 or more
                if (count === 9) {
                    return maxPlayers >= 9;
                }
                // Check if the selected count is within the game's player range
                return count >= minPlayers && count <= maxPlayers;
            });
            
            if (matches) {
                card.style.display = 'block';
                shownCount++;
                console.log(`  ✓ Showing ${gameTitle}`);
            } else {
                card.style.display = 'none';
                hiddenCount++;
                console.log(`  ✗ Hiding ${gameTitle}`);
            }
        } else {
            console.warn(`Game not found in JSON: ${gameTitle}`);
            card.style.display = 'none';
            hiddenCount++;
        }
    });
    
    console.log(`Filter results: ${shownCount} shown, ${hiddenCount} hidden`);
    
    // Show/hide "no results" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        if (shownCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Filter games by difficulty
function filterGamesByDifficulty(selectedDifficulty) {
    console.log('Filtering games by difficulty:', selectedDifficulty);
    console.log('Games data available:', gamesData.length);
    
    if (gamesData.length === 0) {
        console.error('Games data not loaded yet!');
        return;
    }
    
    const gameCards = document.querySelectorAll('.game-card');
    let hiddenCount = 0;
    let shownCount = 0;
    
    gameCards.forEach(card => {
        const gameTitle = card.querySelector('.game-title').textContent.trim();
        const gameInfo = gamesData.find(game => game.title === gameTitle);
        
        if (gameInfo) {
            const gameDifficulty = gameInfo.difficulty;
            
            console.log(`Checking ${gameTitle}: difficulty = ${gameDifficulty}`);
            
            // Check if game's difficulty matches any selected difficulty
            const matches = selectedDifficulty.some(difficulty => {
                // Match the difficulty values
                return gameDifficulty === difficulty;
            });
            
            if (matches) {
                card.style.display = 'block';
                shownCount++;
                console.log(`  ✓ Showing ${gameTitle}`);
            } else {
                card.style.display = 'none';
                hiddenCount++;
                console.log(`  ✗ Hiding ${gameTitle}`);
            }
        } else {
            console.warn(`Game not found in JSON: ${gameTitle}`);
            card.style.display = 'none';
            hiddenCount++;
        }
    });
    
    console.log(`Filter results: ${shownCount} shown, ${hiddenCount} hidden`);
    
    // Show/hide "no results" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        if (shownCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Filter games by language
function filterGamesByLanguage(selectedLanguage) {
    console.log('Filtering games by language:', selectedLanguage);
    console.log('Games data available:', gamesData.length);
    
    if (gamesData.length === 0) {
        console.error('Games data not loaded yet!');
        return;
    }
    
    const gameCards = document.querySelectorAll('.game-card');
    let hiddenCount = 0;
    let shownCount = 0;
    
    gameCards.forEach(card => {
        const gameTitle = card.querySelector('.game-title').textContent.trim();
        const gameInfo = gamesData.find(game => game.title === gameTitle);
        
        if (gameInfo) {
            const gameLanguage = gameInfo.language;
            
            console.log(`Checking ${gameTitle}: language = ${gameLanguage}`);
            
            // Check if game's language matches any selected language
            const matches = selectedLanguage.some(language => {
                // Match the language values
                return gameLanguage === language;
            });
            
            if (matches) {
                card.style.display = 'block';
                shownCount++;
                console.log(`  ✓ Showing ${gameTitle}`);
            } else {
                card.style.display = 'none';
                hiddenCount++;
                console.log(`  ✗ Hiding ${gameTitle}`);
            }
        } else {
            console.warn(`Game not found in JSON: ${gameTitle}`);
            card.style.display = 'none';
            hiddenCount++;
        }
    });
    
    console.log(`Filter results: ${shownCount} shown, ${hiddenCount} hidden`);
    
    // Show/hide "no results" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        if (shownCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Filter games by genre
function filterGamesByGenre(selectedGenre) {
    console.log('Filtering games by genre:', selectedGenre);
    console.log('Games data available:', gamesData.length);
    
    if (gamesData.length === 0) {
        console.error('Games data not loaded yet!');
        return;
    }
    
    const gameCards = document.querySelectorAll('.game-card');
    let hiddenCount = 0;
    let shownCount = 0;
    
    gameCards.forEach(card => {
        const gameTitle = card.querySelector('.game-title').textContent.trim();
        const gameInfo = gamesData.find(game => game.title === gameTitle);
        
        if (gameInfo) {
            const gameGenre = gameInfo.genre;
            
            console.log(`Checking ${gameTitle}: genre = ${gameGenre}`);
            
            // Check if game's genre matches any selected genre
            const matches = selectedGenre.some(genre => {
                return gameGenre === genre;
            });
            
            if (matches) {
                card.style.display = 'block';
                shownCount++;
                console.log(`  ✓ Showing ${gameTitle}`);
            } else {
                card.style.display = 'none';
                hiddenCount++;
                console.log(`  ✗ Hiding ${gameTitle}`);
            }
        } else {
            console.warn(`Game not found in JSON: ${gameTitle}`);
            card.style.display = 'none';
            hiddenCount++;
        }
    });
    
    console.log(`Filter results: ${shownCount} shown, ${hiddenCount} hidden`);
    
    // Show/hide "no results" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        if (shownCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Game card click functionality - open modal with game details
document.addEventListener('click', function(e) {
    const gameCard = e.target.closest('.game-card');
    if (gameCard) {
        const gameTitle = gameCard.querySelector('.game-title').textContent.trim();
        const gameInfo = gamesData.find(game => game.title === gameTitle);
        
        if (gameInfo) {
            openGameModal(gameInfo);
        } else {
            console.log('Game not found:', gameTitle);
        }
    }
});

// Open game modal with detailed information
function openGameModal(game) {
    console.log('Opening modal for:', game);
    
    const modal = document.getElementById('gameModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalRating = document.getElementById('modalRating');
    const modalFlag = document.getElementById('modalFlag');
    const modalLanguage = document.getElementById('modalLanguage');
    const modalAge = document.getElementById('modalAge');
    const modalDifficulty = document.getElementById('modalDifficulty');
    const modalGenre = document.getElementById('modalGenre');
    const modalPlayers = document.getElementById('modalPlayers');
    const modalPlaytime = document.getElementById('modalPlaytime');
    const modalRules = document.getElementById('modalRules');
    
    // Populate modal with game data from JSON
    modalImage.src = game.image || '';
    modalImage.alt = game.title;
    modalTitle.textContent = game.title;
    modalRating.textContent = game.rating || 'N/A';
    
    // Set language and flag
    const languageFlags = {
        'Dansk': '🇩🇰',
        'English': '🇬🇧',
        'Engelsk': '🇬🇧',
        'Tysk': '🇩🇪',
        'Fransk': '🇫🇷'
    };
    modalFlag.textContent = languageFlags[game.language] || '🌍';
    modalLanguage.textContent = game.language || 'N/A';
    
    // Populate tags
    modalAge.textContent = `${game.age}+ År`;
    modalDifficulty.textContent = game.difficulty || 'N/A';
    modalGenre.textContent = game.genre || 'N/A';
    modalPlayers.textContent = `${game.players.min}-${game.players.max} spillere`;
    modalPlaytime.textContent = `${game.playtime} min`;
    
    // Set rules
    modalRules.textContent = game.rules || 'Ingen regler tilgængelige.';
    
    // Show modal
    modal.classList.add('active');
}

// Close modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('gameModal');
    const closeButton = document.querySelector('.modal-close');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
});

// Clear filter button functionality
const clearFilterBtn = document.getElementById('clearFilterBtn');
if (clearFilterBtn) {
    // Check if filters are active and update button visibility
    function updateClearFilterButton() {
        const hasFilters = sessionStorage.getItem('filterPlayers') !== null ||
                          sessionStorage.getItem('filterDifficulty') !== null ||
                          sessionStorage.getItem('filterLanguage') !== null ||
                          sessionStorage.getItem('filterGenre') !== null;
        
        if (hasFilters) {
            clearFilterBtn.style.display = 'flex';
        } else {
            clearFilterBtn.style.display = 'none';
        }
    }
    
    updateClearFilterButton();
    
    clearFilterBtn.addEventListener('click', function() {
        console.log('Clear filters clicked');
        
        // Clear all filters from sessionStorage
        sessionStorage.removeItem('filterPlayers');
        sessionStorage.removeItem('filterDifficulty');
        sessionStorage.removeItem('filterLanguage');
        sessionStorage.removeItem('filterGenre');
        
        // Reload games for location (will show all games)
        loadGamesForLocation();
        
        // Update active filters display
        displayActiveFilters();
        
        // Hide no results message
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
        
        // Remove filter parameter from URL
        const url = new URL(window.location);
        url.searchParams.delete('filter');
        window.history.replaceState({}, '', url);
        
        // Update button state
        updateClearFilterButton();
        
        console.log('All filters cleared');
    });
}

// Menu overlay functionality
const menuButton = document.querySelector('.menu-button-location');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.querySelector('.menu-close');

if (menuButton && menuOverlay) {
    // Open menu
    menuButton.addEventListener('click', function() {
        console.log('Menu button clicked');
        menuOverlay.classList.add('active');
    });
    
    // Close menu
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            menuOverlay.classList.remove('active');
        });
    }
    
    // Close menu when clicking outside
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            menuOverlay.classList.remove('active');
        }
    });
}

