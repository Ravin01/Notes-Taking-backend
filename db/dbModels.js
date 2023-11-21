import mongoose from "mongoose";


export const registrationSchema = mongoose.Schema({
    userId: {
        type: "string",
        required: true,
      },
      userName: {
        type: "string",
        required: true,
      },
      userEmail: {
        type: "string",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
})

export const registrationModel = mongoose.model("users", registrationSchema)


export const notesSchema = mongoose.Schema({
    userEmail : {
        type : "string",
        required : true
    },
    folders : {
      type : [],
      required : true
    },
    notes : [{
        id : 'string',
        title : 'string',
        note : "string",
        date : Date
    }]
})

export const notesModel = mongoose.model("notes", notesSchema)