import Express from "express";
// import registrationModel from "../../db/models.js";
import { email } from "./forgotPass.js";
import bcrypt from "bcrypt";
import { registrationModel } from "../../db/dbModels.js";

export const resetPasswordRoute = Express.Router();

resetPasswordRoute.post("/", async (req, res) => {
  const payload = req.body.password
  console.log(email[0])
  try {
    const data = await registrationModel.find({ userEmail: email[0] });
    if (data) {  
      bcrypt.hash(payload, 10, async (err, hash) => {
        if (err) {
          res.status(500).send("Error while hash password");
        }
        await registrationModel.findOneAndUpdate(
          { userEmail: email[0] },
          { ...data, password: hash }
        )
        res.send("password updated successfully");
      });
    }
  } catch (err) {
    console.error(err);
    res.status(401).send(err);
  }
});