// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const quotesUrl = "http://localhost:3000/quotes?_embed=likes"
const quotesUl = document.getElementById("quote-list")
const quotesPostUrl = 'http://localhost:3000/quotes'
const likesUpdateUrl = 'http://localhost:3000/likes'
const newQuoteForm = document.getElementById("new-quote-form")

document.addEventListener("DOMContentLoaded", function() { 
    fetchQuotes();
});

function fetchQuotes() {
    fetch(quotesUrl)
        .then(resp => resp.json())
        .then(quotes => {
            quotes.map(quote => quoteForm(quote))
        });
};

function quoteForm(quote) {
    const li = document.createElement("li");
    quotesUl.appendChild(li);
    li.className = "quote-card";
    li.id = "quote" + quote.id;

    const blockquote = document.createElement("blockquote");
    li.appendChild(blockquote);
    blockquote.className = "blockquote";

    const p = document.createElement("p");
    blockquote.appendChild(p);
    p.className = "mb-0";
    p.textContent = quote.quote;

    const footer = document.createElement("footer");
    blockquote.appendChild(footer);
    footer.className = "blockquote-footer";
    footer.textContent = quote.author;

    const br = document.createElement("br");
    footer.appendChild(br);

    const likeButton = document.createElement("button");
    blockquote.appendChild(likeButton);
    likeButton.className = "btn-success";
    likeButton.textContent = "Likes: ";
    likeButton.addEventListener("click", () => likeQuote(quote));

    const span = document.createElement("span");
    likeButton.appendChild(span);
    span.textContent = quote.likes ? quote.likes.length : 0;

    const deleteButton = document.createElement("button");
    blockquote.appendChild(deleteButton);
    deleteButton.className = "btn-danger";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteQuote(quote));
};


function deleteQuote(quote) {
    const id = quote.id;
    fetch(quotesPostUrl + "/" + id, {
        method:"DELETE",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ id })
    })
    .then( () => removeDisplay(id) );
};

function removeDisplay(quoteid) {
    document.getElementById("quote" + quoteid).remove();
};


function likeQuote(quote) {
    const quoteId = quote.id;

    fetch(likesUpdateUrl, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ quoteId })
    })
    .then(resp => checkStatus(resp))
    .then(resp => resp.json())
    .then(newLike => updateLike(newLike));
};

function checkStatus(resp) {
    if ( resp.status === 201 ) {
        return resp
    };
};

function updateLike(newLike) {
    const span = document.querySelector(`#quote${newLike.quoteId} span`);
    const likes = parseInt(span.textContent) + 1;
    span.textContent = likes;
};

newQuoteForm.addEventListener("submit", (event) => createNewQuote(event));

function createNewQuote(event) {
    event.preventDefault();
    let quote = document.getElementById('new-quote').value;
    let author = document.getElementById('author').value;

    fetch(quotesPostUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ author, quote })
    })
    .then(resp => resp.json())
    .then(data => quoteForm(data))
    .then( () => {
        newQuoteForm.reset()
    });
};
