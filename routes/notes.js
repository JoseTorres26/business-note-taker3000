const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

const notes = express.Router();

notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0 ? res.json(result) : res.json('No note with that ID');
    });
});

notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id !== noteId);

      writeToFile('./db/notes.json', result)
        .then(() => {
          res.json(`${noteId} has been deleted 🗑️`);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Failed to delete note' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete note' });
    });
});

notes.post('/', (req, res) => {
  const { title, note } = req.body;

  if (title && note) {
    const newNote = {
      note,
      title,
      note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/notes.json');
    res.json('Note added successfully 🚀');
  } else {
    res.status(400).json({ error: 'Title and note are required' });
  }
});

module.exports = notes;