const express = require('express');
const notesRouter = require('./notes');

const router = express.Router();

router.use('/notes', notesRouter);

module.exports = router;