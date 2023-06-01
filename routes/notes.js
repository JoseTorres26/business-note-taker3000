const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the tips
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific tip
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific tip
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);

      // Respond to the DELETE request
      res.json(` ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, note } = req.body;

  if (req.body) {
    const newNote = {
      note,
      title,
      tip_id: uuidv4(),
    };

    readAndAppend(newNote, './db/notes.json');
    res.json(`added successfully 🚀`);
  } else {
    res.error('Error');
  }
});

module.exports = notes;
