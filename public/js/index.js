const notes = document.getElementById('notes')
const btn = document.getElementById('nav')
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


const createCard = (note) => {
    const cardEl = document.createElement('div');
    cardEl.setAttribute('key', note.note_id);
  
    const cardHeaderEl = document.createElement('h4');
    cardHeaderEl.innerHTML = `${note.title} </br>`;
  
    const cardBodyEl = document.createElement('div');
    cardBodyEl.classList.add('card-body', 'bg-light', 'p-2');
    cardBodyEl.innerHTML = `<p>${note.note}</p>`;
  
    cardEl.appendChild(cardHeaderEl);
    cardEl.appendChild(cardBodyEl);
  
    notes.appendChild(cardEl);
  };
  
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error('Error:', error);
    });

const postNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
      createCard(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    getNotes().then((data) => data.forEach((note) => createCard(note)));

    const validate = (newNote) => {
        const { title, note } = newNote;

        const errorState = {
           note: '',
            title: '',
          };

  const noteCheck = note.length = 0;
  if (!noteCheck) {
    errorState.note = 'Notes have stuff in it you know...';
  }

  const titleCheck = title
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
  