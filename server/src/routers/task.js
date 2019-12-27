const express = require("express")
const Task = require("./../models/task")
const router = new express.Router()
const auth = require('./../middleware/auth');
const Project = require("./../models/project")

//Створення task
router.post("/task/create", auth, async (req, res)=>{
    try {
        const task = new Task({
            ...req.body,
        });
        if(task.project==undefined){
            task.owner=req.user.id
            task.project = null
        }else {
            let project = await Project.findById(task.project);
            if(!project){
                res.status(500);
                throw new Error("Project not found")
            }
            if(!project.members[req.user.id]){
                res.status(404);
                throw new Error("No permit to create")
            }
            task.owner = null;
        }
        task.subtask = null;
        await task.save();
        res.status(201).send(task);
    } catch(error) {
        res.status(500).send(err.message);
    }
});
//Редагування task
router.patch('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        if(task.project != null){
            let project = await Project.findById(task.project);
            if(!project.members[req.user.id].changeTasks){
                res.status(404);
                throw new Error("No permit to change")
            }
        }
        if (req.body.description) {
            task.description = req.body.description;
        }
        if (req.body.complited) {
            task.complited = req.body.complited;
        }
        await task.save();
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
//Видалення task
router.delete('/task/:id', async(req, res)=>{
    let task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).send();
    }
    if(task.project != null){
        let project = await Project.findById(task.project);
        if(!project.members[req.user.id].deleteTasks){
            res.status(404);
            throw new Error("No permit to change")
        }
    }
    await task.delete();
    res.status(200).send(task);
})
//Редагування subtask
router.patch('/task/:id/subtask', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        if(task.project != null){
            let project = await Project.findById(task.project);
            if(!project.members[req.user.id].changeTasks){
                res.status(404);
                throw new Error("No permit to change")
            }
        }
        let tmp = req.body;
        task.complited = true;
        for(value in tmp){
            if (value == "")
                continue
            if (task.subtask == null) 
                task.subtask= {}
            task.subtask[value] = tmp[value];
        }
        if(Object.values(task.subtask).indexOf(false) != -1){
            task.complited = false;
        }
        await Task.findByIdAndUpdate(req.params.id, task)
        await task.save();
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/task/:id/:name', auth, async(req, res)=>{
    
    const task = await Task.findById(req.params.id)
    delete task.subtask[req.params.name]
    await Task.findByIdAndUpdate(req.params.id, task)
    res.status(200).send(task);
});
//Видалення subtask
router.patch('/task/:id/subtask', auth, async(req, res)=>{
    console.log(1)
    let task = await Task.findById(req.params.id);
    console.log(task)
    if (!task) {
        return res.status(404).send();
    }
    if(task.project != null){
        let project = await Project.findById(task.project);
        console.log(project.members)
        if(!project.members[req.user.id].deleteTasks){
            res.status(404);
            throw new Error("No permit to change")
        }
    }
    let tmp = req.body;
    task.complited = true;
    console.log(tmp)
    for(value in tmp){
        if (task.subtask == null) 
            break
        console.log(tmp[value])
        if (task.subtask[tmp[value]] != undefined){
            delete task.subtask[tmp[value]];
        }
        if (Object.keys(task.subtask).length == 0){
            task.subtask = {}
            break
        }
    }
    if(Object.values(task.subtask).indexOf(false) != -1){
        task.complited = false;
    }
    await task.save();
    res.status(200).send(task);
});
//Показ task
router.get("/task/:id", auth, async (req, res) => {
    try{
        let task = await Task.findById(req.params.id);
        if(task.owner != null){
            if (task.owner != req.user.id) {
                res.status(404);
                throw new Error("This is not your task")
            }
        } else {
            let project = await Project.findById(task.project);
            if(!project || project.members[req.user.id] == undefined){
                res.status(404);
                throw new Error("Project not found")
            }
        }
        res.status(201).send(task);
    } catch(error) {
        res.send(error.message);
    }
});
//Показ task project
router.post("/task", auth, async (req, res) => {
    try{
        let project = await Project.findById(req.body.id);
        if(!project){
            res.status(404);
            throw new Error("Project not found")
        }
        if(project.members[req.user.id] == undefined){
            res.status(404);
            throw new Error("No permit")
        }
        let task = await Task.find({project: req.body.id})
        res.status(201).send(task);
    } catch(error) {
        res.send(error.message);
    }
});

//Показ by member
router.get("/task", auth, async (req, res) => {
    try{
        let task = await Task.find({owner: req.user.id});
        res.status(201).send(task);
    } catch(error) {
        res.send(error.message);
    }
})

module.exports = router