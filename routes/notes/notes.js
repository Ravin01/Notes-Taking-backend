import Express from "express";
import { notesModel } from "../../db/dbModels.js";
import { v4 } from "uuid";

export const notesRoute = Express.Router();

// Create new user notes
// Update all notes
notesRoute.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: payload.userEmail },
      { _id: 0, userEmail: 1, notes: 1 }
    );
    if (checkUser) {
      let note = payload.notes[0];
      let timeStamp = Date.now();
      let date = new Date(timeStamp);
      const updateUser = await notesModel.findOneAndUpdate(
        { userEmail: payload.userEmail },
        { $push: { notes: { ...note, id: v4(), date: date } } }
      );
      if (updateUser) {
        res.send("updated");
      }  
    } else {
      const objectEdit = {
        userEmail: payload.userEmail,
        folders: ["StickyNotes", "DailyTask"],
        notes: [
          {
            title: payload.notes[0].title,
            note: payload.notes[0].note,
            id: v4(),
          },
        ],
      };
      const newUser = await notesModel.create(objectEdit);
      if (newUser) {
        res.status(200).send(newUser);
      } else {
        res.send("Error while creating new User");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// get a data for respective user and folder data
notesRoute.get("/:email/:folder", async (req, res) => {
  const { email, folder } = req.params;
  try {
    const data = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, notes: 1, folders: 1 }
    );
    if (data) {
      let folderData = data.notes.filter(
        (file) => file.folder === `/${folder}/create`
      );
      res.send(folderData);
    } else {
      res.status(401).send("Users not yet use your application");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// get a data for respective user, folder and single note
notesRoute.get("/:email/:folder/:id", async (req, res) => {
  const { email, id, folder } = req.params;
  try {
    const result = await notesModel.findOne({ userEmail: email });
    if (result) {
      let folderData = result.notes.filter(
        (file) => file.folder === `/${folder}/create`
      );

      const note = folderData.find((note) => note.id === id);
      console.log(note);
      res.send(note);
    } else {
      res.status(401).send("Users not yet use your application");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

notesRoute.put("/:email/:id", async (req, res) => {
  const { email, id } = req.params;
  const payload = req.body;
  try {
    const result = await notesModel.findOne({ userEmail: email });
    if (result) {
      const note = result.notes.find((note) => note.id === id);
      const findIndex = result.notes.indexOf(note)
      let timeStamp = Date.now();
      let date = new Date(timeStamp);
      const editedNote = { ...payload.notes[0], id: id, date: date };
        result.notes.splice(findIndex, 1, editedNote)
    //   note.push(editedNote);
      await notesModel.findOneAndUpdate({ userEmail: email }, { notes: result.notes });
      res.send(note);
    } else {
      res.status(401).send("Users not yet use your application");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

notesRoute.delete("/:email/:id", async (req, res) => {
  const { email, id } = req.params;
  console.log(req.params);
  console.log("entering");
  try {
    const result = await notesModel.findOne({ userEmail: email });
    if (result) {
      const deleteNote = result.notes.filter((note) => note.id !== id);
      console.log(deleteNote);
      await notesModel.findOneAndUpdate(
        { userEmail: email },
        { notes: deleteNote }
      );
      res.send(deleteNote);
    } else {
      res.status(401).send("Users not yet use your application");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
