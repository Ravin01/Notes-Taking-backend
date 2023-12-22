import Express from "express";
import { notesModel } from "../../db/dbModels.js";

export const FoldersRoute = Express.Router();

// Create a new Folder
FoldersRoute.post("/:email", async (req, res) => {
  const payload = req.body;
  const { email } = req.params;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, notes: 1, folders: 1 }
    );  
    let note = payload.folder;
    let checkFolder = checkUser.folders.find((n) => n === note);
    if (checkUser && !checkFolder) {
      const updateUser = await notesModel.findOneAndUpdate(
        { userEmail: email },
        { $push: { folders: note } }
      );
      if (updateUser) {
        res.send(updateUser);
      }
    } else {
      res.status(401).send(payload);
    }
  } catch (err) {
    console.log(err);
  }
});

FoldersRoute.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const data = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, notes: 1, folders: 1 }
    );
    if (data) {
      res.send(data);
    } else {
      res.status(401).send("Users not yet use your application");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

FoldersRoute.delete("/:email/:name", async (req, res) => {
  const { email, name } = req.params;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, notes: 1, folders: 1 }
    );
    if (checkUser) {
      let filterFolder = checkUser.folders.filter((fol) => fol !== name);
      let filterNotes = checkUser.notes.filter(
        (note) => note.folder !== `/${name}/create`
      );
      let deleteFolder = await notesModel.findOneAndUpdate(
        { userEmail: email },
        { $set: { notes: filterNotes }, $set: { folders: filterFolder } }
      );
      res.send(deleteFolder);
    }
  } catch (err) {
    console.log(err);
  }
});
