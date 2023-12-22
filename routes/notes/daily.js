import Express from "express";
import { notesModel } from "../../db/dbModels.js";
import { v4 } from "uuid";
import { nanoid } from "nanoid";
export const dailyRoute = Express.Router();

// get call for getting whole daily task
dailyRoute.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, dailyTask: 1 }
    );
    if (checkUser) {
      res.send(checkUser);
    } else {
      res.send("Create a new task");
    }
  } catch (err) {
    console.log(err);
  }
});

// get call for getting specific day task
dailyRoute.get("/:email/:id", async (req, res) => {
  const { email, id } = req.params;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, dailyTask: 1 }
    );
    if (checkUser) {
      const filterData = checkUser.dailyTask.find((day) => day.id === id);
      res.send(filterData);
    } else {
      res.status(409).send("Create a new task");
    }
  } catch (err) {
    console.log(err);
  }
});

// post call for creating new DailyTask
dailyRoute.post("/:email", async (req, res) => {
  const payload = req.body;
  const { email } = req.params;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, dailyTask: 1 }
    );
    if (checkUser) {
      let newTask = {
        id: v4(),
        date: Date.now(),
        taskName: payload.taskName,
        task: [],
      };
      const createTask = await notesModel.findOneAndUpdate(
        { userEmail: email },
        { $push: { dailyTask: newTask } }
      );
      if (createTask) {
        res.send(createTask);
      } else {
        res.status(403).send("Error while creating task");
      }
    } else {
      res.status(401).send("cannot find user");
    }
  } catch (err) {
    console.log(err);
  }
});

// post call for creating a new task related to a day
dailyRoute.post("/:email/:id", async (req, res) => {
  const payload = req.body;
  const { email, id } = req.params;
  try {
    const checkUser = await notesModel.findOne(
      { userEmail: email },
      { _id: 0, userEmail: 1, dailyTask: 1 }
    );
    if (checkUser) {
        let arr = checkUser.dailyTask
      const findData = arr.find((day) => day.id === id);
      const findIndex = arr.indexOf(findData)
      const newTask = {
            taskId: nanoid(),
            name: payload.name,
            mode: payload.mode
          };
          findData.task.push(newTask);
          arr.splice(findIndex, 1, findData)
      const updateData = await notesModel.findOneAndUpdate(
        { userEmail: email },
        { dailyTask: arr } 
      );
      if (updateData) {
        res.send(updateData);
      }
    } else {
      res.send("Create a new task");
    }
  } catch (err) {
    console.log(err);
  }
});


dailyRoute.put("/:email/:id/:nano/:mode", async (req, res) => {
    const { email, id, nano, mode } = req.params;
    try {
      const checkUser = await notesModel.findOne(
        { userEmail: email },
        { _id: 0, userEmail: 1, dailyTask: 1 }
      );
      if (checkUser) {
          let arr = checkUser.dailyTask
        const findData = arr.find((day) => day.id === id);
        const findIndex = arr.indexOf(findData)
        const findTask = findData.task.find((task) => task.taskId === nano)
        const findIndexTask = findData.task.indexOf(findTask)
        const updatedMode = {
            taskId: findTask.taskId,
            name: findTask.name,
            mode: mode 
          }
          findData.task.splice(findIndexTask, 1, updatedMode)
            arr.splice(findIndex, 1, findData)
        const updateData = await notesModel.findOneAndUpdate(
          { userEmail: email },
          { dailyTask: arr } 
        );
        if (updateData) {
          res.send(updateData);
        }
      } else {
        res.send("Create a new task");
      }
    } catch (err) {
      console.log(err);
    }
  });