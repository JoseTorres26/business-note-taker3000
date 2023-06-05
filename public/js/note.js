const btn = document.getElementById('nav');
const notes = document.getElementById('notes');

btn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = '/';
});

if (notes) {
  notes.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = document.getElementById('title').value;
    let text = document.getElementById('noteText').value;

    const newNote = {
      title,
      note: text,
    };

    fetch('/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.status);
        text = '';
        title = '';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}