// Quotes array to store quotes
let quotes = [];

// Simulated server URL (using JSONPlaceholder or a mock API)
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Fetch and sync quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    
    // Transform server data to match the quote structure
    const fetchedQuotes = serverQuotes.map(quote => ({
      text: quote.title,
      category: 'Server Category' // Placeholder category for now
    }));

    // Resolve conflicts by giving server data precedence
    syncQuotes(fetchedQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Sync quotes between server and local storage
function syncQuotes(fetchedQuotes) {
  let hasConflict = false;

  // Merge server quotes with local ones
  fetchedQuotes.forEach(serverQuote => {
    if (!quotes.some(localQuote => localQuote.text === serverQuote.text)) {
      quotes.push(serverQuote);
      hasConflict = true;
    }
  });

  if (hasConflict) {
    alert('Data synced with server. New quotes added.');
    saveQuotes();  // Save updated quotes to local storage
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage on page load
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
  }

  populateCategories();
  filterQuotes();  // Apply the filter based on the last selected category
}

// Add a new quote with category input from the user
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();

    // Update categories dropdown
    populateCategories();
    alert('New quote added successfully!');

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please fill in both fields.');
  }
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];

  // Clear existing options, keeping "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add categories as options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;

  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${quote.text}" - Category: ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });

  // Save selected filter to localStorage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const exportBtn = document.createElement('a');
  exportBtn.href = url;
  exportBtn.download = 'quotes.json';
  exportBtn.click();

  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);  // Merge imported quotes with existing ones
    saveQuotes();  // Save to localStorage
    alert('Quotes imported successfully!');
    populateCategories();
    filterQuotes(); // Reapply filtering
  };

  fileReader.readAsText(event.target.files[0]);
}

// Load the last viewed quote from session storage
function loadLastQuote() {
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const parsedQuote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `<p>"${parsedQuote.text}" - Category: ${parsedQuote.category}</p>`;
  }
}

// Show a random quote and save it to session storage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - Category: ${randomQuote.category}</p>`;

  // Save last viewed quote to session storage
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Periodically fetch new quotes from the server (every 60 seconds)
setInterval(fetchQuotesFromServer, 60000);

// Run on page load
window.onload = function() {
  loadQuotes(); // Load quotes from localStorage
  loadLastQuote(); // Load last viewed quote from sessionStorage
  fetchQuotesFromServer(); // Fetch initial quotes from server
};
