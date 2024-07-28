let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Success is not how high you have climbed, but how you make a positive difference to the world.", category: "Success" }
];

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = "No quotes available in this category.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = quote.text;
    sessionStorage.setItem('lastViewedQuote', quote.text);
}

// Add a new quote
async function createAddQuoteForm() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        await postQuoteToServer(newQuote);
        populateCategories();
        filterQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    categoryFilter.value = selectedCategory;
}

// Get quotes filtered by selected category
function getFilteredQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    return selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
}

// Filter quotes by category
function filterQuotes() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        document.getElementById('quoteDisplay').innerText = quote.text;
    } else {
        document.getElementById('quoteDisplay').innerText = 'No quotes available in this category.';
    }
    localStorage.setItem('selectedCategory', document.getElementById('categoryFilter').value);
}

// Export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.title, category: 'Server' }));
        return serverQuotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(quote),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        console.log('Quote posted to server:', data);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Sync quotes with server
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const mergedQuotes = mergeQuotes(serverQuotes, quotes);
    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    displayNotification('Quotes synchronized with server successfully!');
}

// Merge server quotes with local quotes, giving precedence to server data
function mergeQuotes(serverQuotes, localQuotes) {
    const mergedQuotes = [...localQuotes];
    const localQuotesSet = new Set(localQuotes.map(quote => quote.text));

    serverQuotes.forEach(quote => {
        if (!localQuotesSet.has(quote.text)) {
            mergedQuotes.push(quote);
        }
    });

    return mergedQuotes;
}

// Display a notification
function displayNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Periodically sync quotes with server
setInterval(syncQuotes, 60000); // Sync quotes every 60 seconds

// Event listener for showing a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Load the last selected category filter from local storage (if exists)
const lastSelectedCategory = localStorage.getItem('selectedCategory');
if (lastSelectedCategory) {
    document.getElementById('categoryFilter').value = lastSelectedCategory;
}

// Load the last viewed quote from session storage (if exists)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
    document.getElementById('quoteDisplay').innerText = lastViewedQuote;
} else {
    showRandomQuote();
}

// Initial call to populate categories and display a quote when the page loads
populateCategories();
filterQuotes();
