// Get DOM elements
const showResultsBtn = document.getElementById('showResultsBtn');

// Fetch games data and generate language options dynamically
async function loadLanguageOptions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json');
        const games = await response.json();
        
        // Get unique languages
        const languages = new Set();
        games.forEach(game => {
            if (game.language) {
                languages.add(game.language);
            }
        });
        
        // Convert to sorted array
        const sortedLanguages = Array.from(languages).sort((a, b) => a.localeCompare(b, 'da'));
        
        // Language display names
        const languageNames = {
            'Dansk': 'Dansk',
            'English': 'Engelsk'
        };
        
        // Generate HTML for language options
        const container = document.querySelector('.language-options');
        container.innerHTML = '';
        
        sortedLanguages.forEach((lang, index) => {
            const displayName = languageNames[lang] || lang;
            const langId = lang.toLowerCase().replace(/\s+/g, '-');
            
            // Create item
            const item = document.createElement('div');
            item.className = 'language-item';
            item.innerHTML = `
                <span class="language-label">${displayName}</span>
                <input type="checkbox" class="language-checkbox" id="language-${langId}" value="${lang}">
                <label for="language-${langId}" class="checkbox-label"></label>
            `;
            container.appendChild(item);
            
            // Add divider if not last
            if (index < sortedLanguages.length - 1) {
                const divider = document.createElement('div');
                divider.className = 'language-divider';
                container.appendChild(divider);
            }
        });
        
        // Load saved selections after options are created
        loadSavedSelections();
        
    } catch (error) {
        console.error('Error loading language options:', error);
    }
}

// Load saved selections from sessionStorage
function loadSavedSelections() {
    const savedLanguage = sessionStorage.getItem('filterLanguage');
    if (savedLanguage) {
        const selectedLanguage = JSON.parse(savedLanguage);
        const languageCheckboxes = document.querySelectorAll('.language-checkbox');
        languageCheckboxes.forEach(checkbox => {
            if (selectedLanguage.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

// Clear all selections
function clearAllSelections() {
    const languageCheckboxes = document.querySelectorAll('.language-checkbox');
    languageCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    sessionStorage.removeItem('filterLanguage');
}

// Save selections and navigate
showResultsBtn.addEventListener('click', () => {
    const selectedLanguage = [];
    const languageCheckboxes = document.querySelectorAll('.language-checkbox');
    languageCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedLanguage.push(checkbox.value);
        }
    });
    
    // Save to sessionStorage
    if (selectedLanguage.length > 0) {
        sessionStorage.setItem('filterLanguage', JSON.stringify(selectedLanguage));
    } else {
        sessionStorage.removeItem('filterLanguage');
    }
    
    // Navigate back to filter.html to allow adding more filters
    window.location.href = 'filter.html';
});

// Load language options on page load
loadLanguageOptions();

// Listen for storage changes (if user clears filters from another tab/window)
window.addEventListener('storage', (e) => {
    if (e.key === 'filterLanguage') {
        if (e.newValue === null) {
            clearAllSelections();
        } else {
            loadSavedSelections();
        }
    }
});
