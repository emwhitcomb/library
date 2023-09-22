let myLibrary = [];
let readStatus = false;
let indexOfBook;

const myBooks = document.getElementById("my-books");
const getForm = document.getElementById("get-form");
const bookModal = document.getElementById("book-modal");
const bookData = document.getElementById("book-data");
const title = document.getElementById("title");
const author = document.getElementById("author");
const pages = document.getElementById("pages");
const category = document.getElementById("category");
const haveRead = document.getElementById("have-read");
const cardSwitch = document.querySelectorAll(".card-switch");

const submission = document.getElementById("submission");
const cancel = document.getElementById("cancel");

function Book(title, author, pages, category, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.category = category;
    this.read = read;
}

/* Pre-load sample books */
myLibrary = [
    {
        "title": "THE WORLD ACCORDING TO GARP",
        "author": "JOHN IRVING",
        "pages": 437,
        "category": "FICTION",
        "read": true
    },
    {
        "title": "INTERVIEW WITH THE VAMPIRE",
        "author": "ANNE RICE",
        "pages": 340,
        "category": "FICTION",
        "read": false
    },
    {
        "title": "MEMOIRS OF A GEISHA",
        "author": "ARTHUR GOLDEN",
        "pages": 428,
        "category": "FICTION",
        "read": true
    },
    {
        "title": "THE GOD DELUSION",
        "author": "RICHARD DAWKINS",
        "pages": 406,
        "category": "NON-FICTION",
        "read": true
    }
];    

updateDisplay();

haveRead.addEventListener("change", (e) => {
    if (e.target.checked) {
        readStatus = true;
    } else {
        readStatus = false;
    }
});

getForm.addEventListener("click", (e) => {
    bookData.reset();
    submission.innerHTML = "ADD";
    bookModal.showModal();
});

bookData.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submission.innerHTML == "ADD") {
        addBookToLibrary();
    }
    else if (submission.innerHTML == "UPDATE") {
        updateLibrary(indexOfBook);
    }
    updateDisplay();
});

cancel.addEventListener("click", (e) => {
    e.preventDefault();
    bookData.reset();
    bookModal.close();
});

function addBookToLibrary() {
    let book = new Book(title.value.toUpperCase(), author.value.toUpperCase(), pages.value, category.value, readStatus);
    myLibrary.push(book);
    bookModal.close();
}

function updateLibrary(index) {
    console.log("index: ", index);
    console.log(myLibrary);
    myLibrary[index].title = title.value.toUpperCase();
    myLibrary[index].author = author.value.toUpperCase();
    myLibrary[index].pages = pages.value;
    myLibrary[index].category = category.value;
    myLibrary[index].read = readStatus;
    console.log(myLibrary);
    bookModal.close();
}

function updateDisplay() {
    const cardArray = [...myLibrary];
    document.querySelectorAll(".card").forEach(e => e.remove());

    cardArray.sort((x, y) => (x.title < y.title) ? -1 : 1);

    let index = 0;
    cardArray.forEach(item => {
        index++;
        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        newCard.setAttribute("id", "card" + index);
        myBooks.appendChild(newCard);

        newCard.innerHTML = `
            <span class="card-title" id="card-title${index}">${item["title"]}</span>
            <div>
                <span class="card-label">Author: </span><span class="card-value" id="card-author${index}">${item["author"]}</span>
            </div>
            <div>
                <span class="card-label">Category: </span><span class="card-value" id="card-category${index}">${item["category"]}</span>
            </div>
            <div>
                <span class="card-label">Pages: </span><span class="card-value" id="card-pages${index}">${item["pages"]}</span>
            </div>
        `;
        if (item.read === true) {
            newCard.innerHTML += `
                <div>
                    <span class="card-label">Previously Read:</span>
                    <input class="card-switch" name="card-status" id="card-status${index}" type="checkbox" checked onchange="changeRead(${index}, false)">
                    <label class="toggle" for="card-status${index}"></label>
                </div>
            `;
        }
        else {
            newCard.innerHTML += `
                <div>
                    <span class="card-label">Previously Read:</span>
                    <input class="card-switch" name="card-status" id="card-status${index}" type="checkbox" onchange="changeRead(${index}, true)">
                    <label class="toggle" for="card-status${index}"></label>
                </div>
            `;
        }
        newCard.innerHTML += `
                <div id="button-row">
                    <img class="icon" id="delete-btn${index}" type="button" src="images/delete.svg" alt="trash" onclick="deleteBook(${index})">
                    <img class="icon" id="edit-btn${index}" type="button" src="images/edit.svg" alt="edit" onclick="editBook(${index})">
                </div>
        `;
    });
}

function deleteBook(index) {
    const cardTitle = document.getElementById("card-title" + index).innerHTML;
    const indexOfBook = myLibrary.findIndex(item => item.title === cardTitle);

    myLibrary.splice(indexOfBook, 1);
    updateDisplay();
}

function changeRead(index, newStatus) {
    const cardTitle = document.getElementById("card-title" + index).innerHTML;
    const indexOfBook = myLibrary.findIndex(item => item.title === cardTitle);

    myLibrary[indexOfBook].read = newStatus;
}

function editBook(index) {
    const cardTitle = document.getElementById("card-title" + index).innerHTML;
    indexOfBook = myLibrary.findIndex(item => item.title == cardTitle);

    bookData.reset();

    title.value = myLibrary[indexOfBook].title;
    author.value = myLibrary[indexOfBook].author;
    pages.value = myLibrary[indexOfBook].pages;

    if (myLibrary[indexOfBook].category == "") {
        category.selectedIndex = 0;
    }
    else if (myLibrary[indexOfBook].category == "FICTION") {
        category.selectedIndex = 1;
    }
    else if (myLibrary[indexOfBook].category == "NON-FICTION"){
        category.selectedIndex = 2;
    }

    if (myLibrary[indexOfBook].read == true) {
        haveRead.checked = true;
    }

    submission.innerHTML = "UPDATE";
    bookModal.showModal();
    title.setSelectionRange(0, 0);
}