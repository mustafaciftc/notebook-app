const express = require("express");
const router = express.Router();
const { addNote, getNotes, getNoteById, updateNote, deleteNote } = require("../controllers/noteController");

router.route("/").post(addNote).get(getNotes);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

module.exports = router;
