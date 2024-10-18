const QuotesDisplay = document.getElementById('quoteDisplay');
const GenBtn = document.getElementById('newQuote');


let quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal.", category: "Motivation" },
    { text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams." , category :"Love"},
    { text: "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that." , category : "Friendship"}
];

    const savedStorage = localStorage.getItem('quotes');
    if(savedStorage){
        quotes = JSON.parse(savedStorage);
    };

function randomQuotes(){

    let randomQuotes = Math.floor(Math.random() * quotes.length );
    let randomTextQuotes = quotes[randomQuotes].text;
    let randomCategory = quotes[randomQuotes].category;
    

    QuotesDisplay.innerHTML = `

        <p>${randomTextQuotes}</p>
        <p><strong>Category:</strong>${randomCategory} </p>

    `;

}

GenBtn.addEventListener('click',randomQuotes);

function addQuote (){

    const quotesText = document.getElementById('newQuoteText').value.trim();
    const quotesCategory = document.getElementById('newQuoteCategory').value.trim();


    if(quotesText && quotesCategory ){
        quotes.push({text:quotesText , category: quotesCategory })

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
         
        localStorage.setItem('quotes',JSON.stringify(quotes));


        console.log('Quote added succesfully!');

    } else{
        console.log('please Enter quote')
    };


    
}



function exportQuotes() {
    const json = JSON.stringify( quotes,null,2);
    const blob = new Blob([json],{type : 'application / json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url ;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function importFromJsonFile(event) {
    const fileReader = new FileReader(); 
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result); 
        quotes.push(...importedQuotes); 
        localStorage.setItem('quotes', JSON.stringify(quotes)); 
        console.log('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]); 
}



// Populate the categories dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    let filteredQuotes = quotes;

    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    const quotesDisplay = document.getElementById('quotesDisplay');
    quotesDisplay.innerHTML = '';

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.textContent = `Text: ${quote.text} - Category: ${quote.category}`;
        quotesDisplay.appendChild(quoteElement);
    });

    localStorage.setItem('selectedCategory', selectedCategory);
}

// Add a new quote and update categories
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        localStorage.setItem('quotes', JSON.stringify(quotes));

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        populateCategories();
        console.log('Quote added successfully!');
    } else {
        console.log('Please enter both a quote and a category');
    }
}

// Initial population of categories and quotes
populateCategories();
filterQuotes();






