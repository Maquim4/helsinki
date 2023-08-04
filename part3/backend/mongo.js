const mongoose = require('mongoose');

const url =
  'mongodb+srv://maquim4:idfltslbsr231@cluster0.wu7yn7a.mongodb.net/testNoteApp?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'Second note',
  date: new Date(),
  important: true,
});

note.save().then((result) => {
  console.log('note saved!');
  mongoose.connection.close();
});

/* Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
 */
