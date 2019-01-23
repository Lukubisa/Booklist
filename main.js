//create a book object
class Book{
  constructor(title, author, isbn){
    this.title=title;
    this.author = author;
    this.isbn= isbn;
  }
}
//Handle  UI task
class UI{
  static displayBooks(){
    
    const books = store.getBooks();

   books.forEach((book)=>
     UI.addBookToList(book));
  }
  static addBookToList(book){
    const list=document.querySelector('#book-list');
    const row =document.createElement('tr');
    row.innerHTML =`
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(el){
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className){
    const div= document.createElement('div');
    div.className=`alert text-center alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    container.insertBefore(div, form);
    setTimeout(() => document.querySelector('.alert').remove(), 5000);
  }
  static clearFields(){
    document.querySelector('#title').value='';
    document.querySelector('#author').value='';
    document.querySelector('#isbn').value='';
  }
}

//Handle storage

class store{

  static getBooks(){
     let books;
     if(localStorage.getItem('books')=== null){
       books =[];
     }else{
       books= JSON.parse(localStorage.getItem('books'));
     }
     return books;
  }
   static addBook(book){
    const books = store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

 static removeBook(isbn){
   const books = store.getBooks();
   books.forEach((book,index) =>{
     if(book.isbn === isbn){
       books.splice(index,1);
     }
   });
   localStorage.setItem('books', JSON.stringify(books));
  }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//add a book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
  const title= document.querySelector('#title').value;
  const author= document.querySelector('#author').value;
  const isbn= document.querySelector('#isbn').value;
  e.preventDefault();

  //validation of the book
  if(title==='' || author === '' || isbn === ''){
    UI.showAlert('please in empty boxes', 'danger');
  }else{
    //instatiate book
  const book=  new Book(title, author, isbn);
  store.addBook(book);
  
  UI.addBookToList(book);
  UI.showAlert('Upload successful', 'success');

  //clearing the fields
  UI.clearFields();

  }
  
  
});


//remove book
document.querySelector('#book-list').addEventListener('click',(e) =>{
  // remove book fro UI
  UI.deleteBook(e.target);
  //Remove book from store
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert("Book removed successfully", "success");
})