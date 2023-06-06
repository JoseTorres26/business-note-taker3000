const notes = document.getElementById('notes');
const btn = document.getElementById('nav');
const titleInput = document.getElementById('title');
const noteTextInput = document.getElementById('noteText');

btn.addEventListener('click', (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const noteText = noteTextInput.value;

  const newNote = {
    title: title,
    note: noteText,
  };

  postNote(newNote);
});

const getNotes = () =>
fetch('/api/notes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });

const postNote = async (note) => {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error('Unable to create note');
    }

    titleInput.value = '';
    noteTextInput.value = '';

    createCard(note);
  } catch (error) {
    console.error('Error:', error);
  }
};

const createCard = (note) => {
  const cardEl = document.createElement('div');
  cardEl.setAttribute('key', note.note_id);

  const cardHeaderEl = document.createElement('h4');
  cardHeaderEl.innerHTML = `${note.title} </br>`;

  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body', 'bg-light', 'p-2');
  cardBodyEl.innerHTML = `<p>${note.note}</p>`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '🗑️';
  deleteButton.addEventListener('click', () => {
    deleteCard(note.note_id);
  });

  cardEl.appendChild(cardHeaderEl);
  cardEl.appendChild(cardBodyEl);
  cardEl.appendChild(deleteButton);

  cardEl.addEventListener('click', () => {
    populateMainSection(note.title, note.note);
  });
  notes.insertBefore(cardEl, notes.firstChild);
};

const populateMainSection = (title, note) => {
  const mainTitle = document.getElementById('title');
  const mainNote = document.getElementById('noteText');

  mainTitle.value = title;
  mainNote.value = note;
};

const deleteCard = async (noteId) => {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Unable to delete note');
    }

    const data = await response.json();
    const cardEl = document.querySelector(`div[key="${noteId}"]`);
    if (cardEl) {
      cardEl.remove();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const validate = (newNote) => {
  const { title, note } = newNote;

  const errorState = {
    note: '',
    title: '',
  };

  const noteCheck = note.length === 0;
  if (!noteCheck) {
    errorState.note = 'Notes have stuff in it you know...';
  }

  const titleCheck = title;
  if (!titleCheck) {
    errorState.title = 'You need a title!';
  }

  const result = {
    isValid: !!(noteCheck && titleCheck),
    errors: errorState,
  };

  return result;
};

const showErrors = (err) => {
  const errors = Object.values(err);
  errors.forEach((error) => {
    if (error.length > 0) {
      alert(error);
    }
  });
};

getNotes()
.then((data) => data.forEach((note) => createCard(note)))
.catch((error) => console.error('Error:', error));
