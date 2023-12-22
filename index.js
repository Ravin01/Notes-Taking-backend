import Express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import { connectToDB } from "./db/dbConnections.js";
import { registerRoute } from "./routes/auth/register.js";
import { loginRoute } from "./routes/auth/login.js";
import { forgotPassRoute } from "./routes/auth/forgotPass.js";
import { resetPasswordRoute } from "./routes/auth/resetPass.js";
import { notesRoute } from "./routes/notes/notes.js";
import { FoldersRoute } from "./routes/notes/folders.js";
import { dailyRoute } from "./routes/notes/daily.js";

const port = process.env.PORT || 8050;

const app = Express();

// DB connection
await connectToDB();

// Default middleware
app.use(cors());

app.use(Express.json());

const authMiddleWare = (req, res, next) => {
  const token = req.headers["auth-token"];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ msg: "unauthorized" });
  }
};  
 
// Routes middleware
app.use("/notes", authMiddleWare,  notesRoute);
// app.use("/notes", notesRoute);

app.use("/folders",authMiddleWare,  FoldersRoute);
// app.use("/folders", FoldersRoute); 

app.use("/daily", dailyRoute);

app.use("/register", registerRoute);

app.use("/login", loginRoute);

app.use("/forgotPass", forgotPassRoute);

app.use("/resetPass", resetPasswordRoute);

app.get("/", (req, res) => {
  try {
    res.send("Notes Taking Application");
  } catch (err) {
    console.log(err);
  }
});

// port listening
app.listen(port, () => {
  console.log("server is running on ", port);
});
