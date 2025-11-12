// Filter page functionality
console.log('Filter page loaded');

// Display active filters summary
function displayFilterSummary() {
    const filterSummary = document.getElementById('filterSummary');
    const filterSummaryBadges = document.getElementById('filterSummaryBadges');
    const showResultsBtn = document.getElementById('showFilteredResults');
    
    if (!filterSummary || !filterSummaryBadges || !showResultsBtn) return;
    
    // Clear existing badges
    filterSummaryBadges.innerHTML = '';
    
    let hasFilters = false;
    
    // Check for player filter
    const savedPlayers = sessionStorage.getItem('filterPlayers');
    if (savedPlayers) {
        const players = JSON.parse(savedPlayers);
        players.forEach(count => {
            hasFilters = true;
            const badge = document.createElement('span');
            badge.className = 'filter-summary-badge';
            badge.textContent = `${count} spillere`;
            filterSummaryBadges.appendChild(badge);
        });
    }
    
    // Check for difficulty filter
    const savedDifficulty = sessionStorage.getItem('filterDifficulty');
    if (savedDifficulty) {
        const difficulties = JSON.parse(savedDifficulty);
        difficulties.forEach(level => {
            hasFilters = true;
            const badge = document.createElement('span');
            badge.className = 'filter-summary-badge';
            badge.textContent = `${level}`;
            filterSummaryBadges.appendChild(badge);
        });
    }
    
    // Check for language filter
    const savedLanguage = sessionStorage.getItem('filterLanguage');
    if (savedLanguage) {
        const languages = JSON.parse(savedLanguage);
        languages.forEach(lang => {
            hasFilters = true;
            const badge = document.createElement('span');
            badge.className = 'filter-summary-badge';
            const flag = lang === 'Dansk' ? '🇩🇰' : '🇬🇧';
            badge.textContent = `${flag} ${lang}`;
            filterSummaryBadges.appendChild(badge);
        });
    }
    
    // Check for genre filter
    const savedGenre = sessionStorage.getItem('filterGenre');
    if (savedGenre) {
        const genres = JSON.parse(savedGenre);
        genres.forEach(genre => {
            hasFilters = true;
            const badge = document.createElement('span');
            badge.className = 'filter-summary-badge';
            badge.textContent = `${genre}`;
            filterSummaryBadges.appendChild(badge);
        });
    }
    
    // Show or hide the summary and button
    filterSummary.style.display = hasFilters ? 'block' : 'none';
    showResultsBtn.style.display = hasFilters ? 'block' : 'none';
}

// Show results button click handler
const showResultsBtn = document.getElementById('showFilteredResults');
if (showResultsBtn) {
    showResultsBtn.addEventListener('click', function() {
        console.log('Show results button clicked!');
        // Get the referring page from sessionStorage or default to Aalborg
        const referringPage = sessionStorage.getItem('filterReferringPage') || 'Aalborg-games.html';
        console.log('Referring page:', referringPage);
        const targetUrl = referringPage + '?filter=applied';
        console.log('Navigating to:', targetUrl);
        window.location.href = targetUrl;
    });
} else {
    console.error('Show results button not found!');
}

// Update filter referring page from URL if coming from a games page
const urlParams = new URLSearchParams(window.location.search);
const fromPage = urlParams.get('from');
if (fromPage) {
    sessionStorage.setItem('filterReferringPage', fromPage);
}

// Update back button to go to correct page
const backButton = document.getElementById('filterBackButton');
if (backButton) {
    const referringPage = sessionStorage.getItem('filterReferringPage') || 'Aalborg-games.html';
    backButton.href = referringPage;
}

// Display filter summary on page load
displayFilterSummary();

// Update display when returning to the page
window.addEventListener('pageshow', function(event) {
    // Update filter summary in case filters were changed
    displayFilterSummary();
});

// Back button functionality is handled by the link href

// Filter option click handlers
const filterPlayers = document.getElementById('filterPlayers');
const filterDifficulty = document.getElementById('filterDifficulty');
const filterLanguage = document.getElementById('filterLanguage');
const filterGenre = document.getElementById('filterGenre');

if (filterPlayers) {
    filterPlayers.addEventListener('click', function(e) {
        console.log('Filter by players clicked - navigating to filter-spillerantal.html');
        // Link navigation is handled by href attribute
    });
}

if (filterDifficulty) {
    filterDifficulty.addEventListener('click', function(e) {
        console.log('Filter by difficulty clicked - navigating to filter-svaerhedsgrad.html');
        // Link navigation is handled by href attribute
    });
}

if (filterLanguage) {
    filterLanguage.addEventListener('click', function(e) {
        console.log('Filter by language clicked - navigating to filter-sprog.html');
        // Link navigation is handled by href attribute
    });
}

if (filterGenre) {
    filterGenre.addEventListener('click', function(e) {
        console.log('Filter by genre clicked - navigating to filter-genre.html');
        // Link navigation is handled by href attribute
    });
}
