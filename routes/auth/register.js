import Express from "express";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { notesModel, registrationModel } from "../../db/dbModels.js";

export const registerRoute = Express.Router();

registerRoute.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const checkUser = await registrationModel.findOne({
      userEmail: payload.userEmail,
    });
    if (checkUser) {  
      const response = checkUser.toObject();
      res.status(401).send(response);
    } else {
      bcrypt.hash(payload.password, 10, async (err, hash) => {
        if (err) {
          res.status(500).send(err);
        } 
          const newUser = await registrationModel.create({
            ...payload,
            userId: v4(),
            password: hash,
          });
          const defaultValue = {
            userEmail : payload.userEmail,
            folders : ['StickyNotes','DailyTask','ImportantNotes'],
            notes : []
          }
          const createDefault = await notesModel.create(defaultValue)
          if (newUser && createDefault) {
            const newRegis = newUser.toObject()
            const accessToken = jwt.sign(newRegis, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.send({ ...newRegis, accessToken });

          } else {
            res.status(403).send("Error while register");
          }
        
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});
