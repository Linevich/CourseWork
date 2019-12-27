const express = require("express")
const Project = require("./../models/project")
const router = new express.Router()
const auth = require('./../middleware/auth')
const Group = require("./../models/group")
const Task = require("./../models/task")

//Створення project
router.post("/project/create",auth, async (req, res)=>{
    try {
        let project = new Project({
            ...req.body,
            owner: req.user.id
        });

        if(project.group==undefined){
            project.members[req.user.id] = {
                addMembers: true,
                changeMembers: true,
                deleteMembers: true, 
                changeProject: true,  
                deleteProject: true,   
                addTasks: true ,
                deleteTasks: true,
                changeTasks: true  
            }
        }else if(project.group != undefined){
            let group = await Group.findById(project.group)
            console.log(group)
            console.log(req.user.id)
            if(!group.members[req.user.id].addProjects){
                res.status(404);
                throw new Error("Oshibka")
            }
            console.log(project)
            if(Object.keys(group.members).length == 0){
                console.log(12345)
                for(variable in group.members) {
                    project.members[variable] = {
                        addMembers: false,
                        changeMembers: false,
                        deleteMembers: false, 
                        changeProject: false,  
                        deleteProject: false,   
                        addTasks: true ,
                        deleteTasks: true,
                        changeTasks: true  
                    }
                }
            } 
            group.members[req.user.id] = {
                addMembers: true,
                changeMembers: true,
                deleteMembers: true, 
                changeProject: true,  
                deleteProject: true,   
                addTasks: true ,
                deleteTasks: true,
                changeTasks: true  
            } 
        } else {
            res.status(500);
            throw new Error("Invalid group Id")
        }
        console.log(project)
        await project.save();
        console.log(project)
        res.status(201).send({project});
    }
    catch(err) {
        res.status(403).send(err.message)
    };
});
//Редагування project
router.patch('/project/:id',auth, async (req, res) => {
    try{
        let project = await Project.findById(req.params.id);
        if(!project){
            res.status(404);
            throw new Error("This project does not exist")
        }
        if(!project.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this project")
        }
        if (!project.members[req.user.id].changeProject) {
            res.status(404);
            throw new Error("No permit to change")
        }
        if (req.body.name) {
            project.name = req.body.name;
        }
        
        if (req.body.owner && project.owner == req.user.id) {
            if (!project.members[req.body.owner]) {
                res.status(404);
                throw new Error("This user is not in the project")
            } 
            project.owner = req.body.owner;
            project.members[project.owner] = {
                addMembers: true,
                changeMembers: true,
                deleteMembers: true, 
                changeProject: true,  
                deleteProject: true,   
                addTasks: true ,
                deleteTasks: true,
                changeTasks: true  
            }
        } else {
            res.status(404);
            throw new Error("No permit to change owner") 
        }
        await project.save();
        res.status(200).send(project);
     }catch(error) {
         res.send(error.message);
     }
});
//Видалення project
router.delete('/project/:id',auth, async(req, res)=>{
    try{
       let project = await Project.findById(req.params.id);
    if(!project){
        res.status(404);
        throw new Error("This project does not exist")
    }
    if(!project.members[req.user.id]){
        res.status(404);
        throw new Error("You are not a member of this project")
    }
    if (!project.members[req.user.id].deleteProject) {
        res.status(404);
        throw new Error("No permit to delete")
    }
    
    await project.delete();
    await Task.deleteMany({project: project.id})
    res.status(200).send(); 
    }catch(error) {
        res.send(error.message);
    }
    
});
//Додавання member в project
router.patch('/project/:id/members/add',auth, async (req, res) => {
    try{
        let project = await Project.findById(req.params.id);
        if(!project){
            res.status(404);
            throw new Error("This project does not exist")
        }
        if(!project.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this project")
        }
        if (!project.members[req.user.id].addMembers) {
            res.status(404);
            throw new Error("No permit to change")
        }
        for(var prop in req.body){
            if(project.members[prop]!=undefined) {
                continue
            } else {
                project.members[prop] = req.body[prop];
                if(req.body[prop].addTasks == undefined){
                    project.members[prop].addTasks = false
                } 
            }
        }
        await project.save();
        res.status(200).send(project);
     }catch(error) {
         res.send(error.message);
     }
});
//Видалення member з project
router.delete('/project/:id/members/del',auth, async (req, res) => {
    try{
        let project = await Project.findById(req.params.id);
        if(!project){
            res.status(404);
            throw new Error("This project does not exist")
        }
        if(!project.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this project")
        }
        if (!project.members[req.user.id].deleteMembers) {
            res.status(404);
            throw new Error("No permit to change")
        }
        for(var prop in req.body){
            if(!project.members[prop]) {
                continue
            } else {
                delete (project.members[prop]);                
            }
        }
        await project.save();
        res.status(200).send(project);
     }catch(error) {
         res.send(error.message);
     }
});
//Змінити member в project
router.patch('/project/:id/members/change',auth, async (req, res) => {
    try{
        let project = await Project.findById(req.params.id);
        if(!project){
            res.status(404);
            throw new Error("This project does not exist")
        }
        if(!project.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this project")
        }
        if (!project.members[req.user.id].changeMembers) {
            res.status(404);
            throw new Error("No permit to change")
        }
        for(var prop in req.body){
            console.log(prop)
            
            if(project.members[prop]==undefined || prop == project.owner) {
                console.log(project.members[prop]==undefined || prop == project.owner)
                continue
            } else {
                console.log(2)
                project.members[prop] = req.body[prop];
                console.log(project.members[prop])
                if(req.body[prop].addTasks == undefined){
                    project.members[prop].addTasks = false
                } 
            }
        }
        await Project.findByIdAndUpdate(req.params.id, project.toObject())
        // await project.save(e => {
        //     console.log(e)
        // });
        res.status(200).send(project);
     }catch(error) {
         res.send(error.message);
     }
});
//Вийти з project
router.delete("/project/:id/leave", auth, async (req, res) => {
    try {
        let userId = req.user.id;
        let project = await Project.findById(req.params.id);
        if(!project.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this project")
        }
        if (project.owner == req.user.id) {
            res.status(404);
             throw new Error("You cannot leave the project")
        }
        delete (project.members[userId]);
        await project.save();
        res.status(200).send(project);
    } catch(e) {
        res.status(500).send(e.message)
    }
});
//Показати project
router.get("/project/:id", auth, async (req, res) => {
    try{
        let userId = req.user.id
        let project = await Project.findById(req.params.id);
        if(!project){
            res.status(404);
            throw new Error("This project does not exist")
        }
        if (!project.members[req.user.id]) {
            res.status(404);
            throw new Error("This is not your project")
        }
        res.status(200).send(project);
    } catch(error) {
        res.send(error.message);
    }
});
//Показ by owner
router.get("/project", auth, async (req, res) => {
    try{
        let userId = req.user.id
        let project = await Project.find()

        console.log(project)

 
        res.status(200).send(project.filter(project => String(project.toObject().owner) === req.user.id));
    } catch(error) {
        res.send(error.message);
    }
});
//Показ by group
router.post("/project", auth, async (req, res) => {
    try{
        let userId = req.user.id
        let project = await Project.find({group: req.body.id});
        if(!project){
            res.status(404);
            throw new Error("This project does not exist")
        }
        res.status(200).send(project);
    } catch(error) {
        res.send(error.message);
    }
});


module.exports = router