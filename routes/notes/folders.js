import Express from "express";
import { notesModel } from "../../db/dbModels.js";

export const FoldersRoute = Express.Router()

FoldersRoute.post('/', async(req,res)=>{
    const payload = req.body
    try{
        const checkUser = await notesModel.findOne({userEmail : payload.userEmail},{_id:0,userEmail:1,notes:1})
        if(checkUser){
            let note = payload.folder
            const updateUser = await notesModel.findOneAndUpdate({userEmail:payload.userEmail}, {$push : {"folders" : note }})
            if(updateUser){
                res.send("Folder updated")
            }
        }
    }catch(err){
console.log(err)
    }
})



// notesRoute.get('/:email', async(req,res)=>{
//     const {email} = req.params
//     try{
//         const data = await notesModel.findOne({userEmail : email},{_id:0, userEmail:1, notes:1, folders : 1})
//         if(data){
//             res.send(data)
//         }else{
//             res.status(401).send('Users not yet use your application')
//         }
//     }catch(err){
//         console.log(err)
//         res.status(500).send(err)
//     }
// })

// notesRoute.get('/:email/:id', async(req,res)=>{
//     const {email,id} = req.params
//     try{
//         const result = await notesModel.findOne({"userEmail" : email})
//         if(result){
//                 const note = result.notes.find(note => note.id === id);
//                 console.log(note);
//                 res.send(note)
//         }else{
//             res.status(401).send('Users not yet use your application')
//         }
//     }catch(err){
//         console.log(err)
//         res.status(500).send(err)
//     }
// })




// notesRoute.delete('/:email/:_id', async(req,res)=>{
//     const {email} = req.params
//     console.log(req.params)
//     try{
//         const data = await notesModel.findOne({userEmail : email})
//         if(data){
//             res.send(data)
//         }else{
//             res.status(401).send('Users not yet use your application')
//         }
//     }catch(err){
//         console.log(err)
//         res.status(500).send(err)
//     }
// })