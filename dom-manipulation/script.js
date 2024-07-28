// Initialize an array to store quote objects  
let quotes = [  
    { text: "Believe you can and you're halfway there.", category: "Inspirational" },  
    { text: "The only way to do great work is to love what you do.", category: "Motivational" },  
    // Add more quotes here...  
  ];  
    
  // Function to display a random quote  
  function showRandomQuote() {  
    const randomIndex = Math.floor(Math.random() * quotes.length);  
    const randomQuote = quotes[randomIndex];  
    document.getElementById("quoteDisplay").innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;  
  }  
    
  // Function to create and display the add quote form  
  function createAddQuoteForm() {  
    const addQuoteForm = document.getElementById("addQuoteForm");  
    addQuoteForm.style.display = "block";  
  }  
    
  // Function to add a new quote  
  function addQuote() {  
    const newQuoteText = document.getElementById("newQuoteText").value;  
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;  
    const newQuote = { text: newQuoteText, category: newQuoteCategory };  
    quotes.push(newQuote);  
    document.getElementById("newQuoteText").value = "";  
    document.getElementById("newQuoteCategory").value = "";  
    showRandomQuote();  
  }  
    
  // Event listeners  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);  
  document.getElementById("addQuote").addEventListener("click", addQuote);  
    
  // Initialize the application by displaying a random quote  
  showRandomQuote();
  