// Deklarasiin semua kriteria yg diminta 

document.addEventListener('DOMContentLoaded', function () {
  const inputBookTitle = document.querySelector('#inputBookTitle');
  const inputBookAuthor = document.querySelector('#inputBookAuthor');
  const inputBookYear = document.querySelector('#inputBookYear');
  const inputBookIsComplete = document.querySelector('#inputBookIsComplete');
  const bookSubmit = document.querySelector('#bookSubmit');
  const searchBookTitle = document.querySelector('#searchBookTitle');
  const searchSubmit = document.querySelector('#searchSubmit');
  const incompleteBookshelfList = document.querySelector('#incompleteBookshelfList');
  const completeBookshelfList = document.querySelector('#completeBookshelfList');

  // ngecek localStorage udah terisi dengan data buku apa belum
  const booksData = JSON.parse(localStorage.getItem('booksData')) || {
    incomplete: [],
    complete: []
  };

  //fungsi buat memperbarui tampilan rak buku
  function refreshBookshelf() {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    booksData.incomplete.forEach((book, index) => {
      createBookCard(book, index, false);
    });

    booksData.complete.forEach((book, index) => {
      createBookCard(book, index, true);
    });
  }

  //fungsi buat icon buku seperti kartu
  function createBookCard(book, index, isComplete) {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.dataset.index = index; 

    const action = document.createElement('div');
    action.classList.add('action');

    const deleteButton = document.createElement('button');
    deleteButton.className = 'red';
    deleteButton.textContent = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
      deleteBook(index, isComplete);

    });

    action.appendChild(deleteButton);

    if (book) {
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="green">${isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}</button>
          
        </div>
      `;

    } else { //pesan kesalahan kalo semisal objek buku tidak ada(opsional)
      bookItem.innerHTML = '<p>Error: Data buku tidak ditemukan.</p>';
    }

    bookItem.appendChild(action);

    if (isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }

  //fungsi buat menambahkan buku baru
  function addBook() {
    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const year = inputBookYear.value;
    const isComplete = inputBookIsComplete.checked;

    if (title && author && year) {
      const book = {
        id: Date.now(),
        title,
        author,
        year,
      };

      if (isComplete) {
        booksData.complete.push(book);
      } else {
        booksData.incomplete.push(book);
      }

      localStorage.setItem('booksData', JSON.stringify(booksData));

      inputBookTitle.value = '';
      inputBookAuthor.value = '';
      inputBookYear.value = '';
      inputBookIsComplete.checked = false;

      refreshBookshelf();
    }
  }

  //fungsi buat mindahin buku antar rak
  function moveBook(index, isComplete) {
    const book = isComplete ? booksData.complete[index] : booksData.incomplete[index];

    if (isComplete) {
      booksData.complete.splice(index, 1);
      booksData.incomplete.push(book);
    } else {
      booksData.incomplete.splice(index, 1);
      booksData.complete.push(book);
    }

    localStorage.setItem('booksData', JSON.stringify(booksData));
    refreshBookshelf();
  }

  //fungsi buat menghapus data buku
  function deleteBook(index, isComplete) { 
    if (isComplete) {
      booksData.complete.splice(index, 1);
    } else {
      booksData.incomplete.splice(index, 1);
    }
    localStorage.setItem('booksData', JSON.stringify(booksData));
    refreshBookshelf();
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('red')) {
      const index = e.target.dataset.index;
      const isComplete = e.target.dataset.isComplete === 'true';
      deleteBook(index, isComplete);
    }
  });

  /* buat fungsi event(click, change, mouseout, dll). 
  event listener digunakan untuk membuat event untuk memanipulasi DOM
  */

  //event buat menambahkan buku baru
  bookSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    addBook();
  });

  //event buat mencari data buku
  searchSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    const searchTerm = searchBookTitle.value.toLowerCase();
    const searchResult = booksData.incomplete.concat(booksData.complete).filter(book => book.title.toLowerCase().includes(searchTerm));
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
    searchResult.forEach((book, index) => {
      createBookCard(book, index, booksData.complete.includes(book));
    });
  });

  //event buat mindahin buku antar rak (untuk buku yg belum selesai dibaca)
  incompleteBookshelfList.addEventListener('click', function (e) {
    if (e.target.classList.contains('green')) {
      const index = e.target.parentElement.parentElement.dataset.index;
      moveBook(index, false);
    }
  });

  //event buat mindahin buku antar rak (untuk buku yg sudah selesai dibaca)
  completeBookshelfList.addEventListener('click', function (e) {
    if (e.target.classList.contains('green')) {
      const index = e.target.parentElement.parentElement.dataset.index;
      moveBook(index, true);
    }
  });

  refreshBookshelf();
});