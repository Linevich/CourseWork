const express = require("express")
const Group = require("./../models/group")
const router = new express.Router()
const auth = require('./../middleware/auth');
const Project = require("./../models/project")
const Task = require("./../models/task")

router.post("/group/create",auth, async (req, res)=>{
    try {
        let group = new Group({
            ...req.body,
            owner: req.user.id
        });
        group.members[req.user.id]= {
            addMembers: true,
	        changeMembers: true,
	        deleteMembers: true, 
	        changeGroup: true,  
	        deleteGroup: true,   
	        addProjects: true   
        }
        await group.save();
        res.status(201).send({group});
    }
    catch(err) {
        res.status(403).send(err.message)
    };
});
router.delete('/group/:id',auth, async(req, res)=>{
    try{
       let group = await Group.findById(req.params.id);
    if(!group){
        res.status(404);
        throw new Error("This group does not exist")
    }
    if(!group.members[req.user.id]){
        res.status(404);
        throw new Error("You are not a member of this group")
    }
    if (!group.members[req.user.id].deleteGroup) {
        res.status(404);
        throw new Error("No permit to delete")
    }
    let  project = await Project.find({group:req.params.id}) 
    console.log(project)
    for (const key in project) {
        await Task.deleteMany({project: project[key].id})
    }

    await Project.deleteMany({group:req.params.id});
    await group.delete();
    res.status(200).send(); 
    }catch(error) {
        res.send(error.message);
    }
    
});

router.get("/group/:id", auth, async (req, res) => {
    try{
        let userId = req.user.id
        let group = await Group.findById(req.params.id);
        if(!group){
            res.status(404);
            throw new Error("This group does not exist")
        }
        if (!group.members[req.user.id]) {
            res.status(404);
            throw new Error("This is not your group")
        }
        res.status(200).send(group);
    } catch(error) {
        res.send(error.message);
    }
});

router.patch('/group/:id',auth, async (req, res) => {
    try{
        let group = await Group.findById(req.params.id);
        if(!group){
            res.status(404);
            throw new Error("This group does not exist")
        }
        if(!group.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this group")
        }
        if (!group.members[req.user.id].changeGroup) {
            res.status(404);
            throw new Error("No permit to change")
        }
        if (req.body.name) {
            group.name = req.body.name;
        }
        
        if (req.body.owner && group.owner == req.user.id) {
            if (!group.members[req.body.owner]) {
                res.status(404);
                throw new Error("This user is not in the group")
            } 
                group.owner = req.body.owner;
                group.members[group.owner] = {
                addMembers: true,
                changeMembers: true,
                deleteMembers: true, 
                changeGroup: true,  
                deleteGroup: true,   
                addProjects: true   
            }
        } else {
            res.status(404);
            throw new Error("No permit to change owner") 
        }
        await group.save();
        res.status(200).send(group);
     }catch(error) {
         res.send(error.message);
     }
});

router.get("/group", auth, async (req, res) => {
    try{
        let userId = req.user.id
        let group = await Group.find()

        group = group.filter(group => {
            if (group.members[userId]) return true
        })
        console.log(group)
        res.status(200).send(group);
    } catch(error) {
        res.send(error.message);
    }
});

router.delete("/group/:id/leave", auth, async (req, res) => {
    try {
        let userId = req.user.id;
        let group = await Group.findById(req.params.id);
        if(!group){
            res.status(404);
            throw new Error("This group does not exist")
        }
        if(!group.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this group")
        }
        if (group.owner == req.user.id) {
            res.status(404);
             throw new Error("You cannot leave the group")
        }
        delete (group.members[userId]);
        await group.save();
        res.status(200).send(group);
    } catch(e) {
        res.status(500).send(e.message)
    }
});

router.patch('/group/:id/members/add',auth, async (req, res) => {
    try{
        let group = await Group.findById(req.params.id);
        if(!group){
            res.status(404);
            throw new Error("This group does not exist")
        }
        if(!group.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this group")
        }
        if (!group.members[req.user.id].addMembers) {
            res.status(404);
            throw new Error("No permit to change")
        }
        for(var prop in req.body){
            if(group.members[prop]!=undefined) {
                continue
            } else {
                group.members[prop] = req.body[prop];
                if(req.body[prop].addProjects == undefined){
                    group.members[prop].addProjects = false
                } 
            }
        }
        await group.save();
        res.status(200).send(group);
     }catch(error) {
         res.send(error.message);
     }
});

router.delete('/group/:id/members/del',auth, async (req, res) => {
    try{
        let group = await Group.findById(req.params.id);
        if(!group){
            res.status(404);
            throw new Error("This group does not exist")
        }
        if(!group.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this group")
        }
        if (!group.members[req.user.id].deleteMembers) {
            res.status(404);
            throw new Error("No permit to change")
        }
        for(var prop in req.body){
            if(!group.members[prop]) {
                continue
            } else {
                delete (group.members[prop]);                
            }
        }
        await group.save();
        res.status(200).send(group);
     }catch(error) {
         res.send(error.message);
     }
});

router.patch('/group/:id/members/change',auth, async (req, res) => {
    try{
        let group = await Group.findById(req.params.id);
        if(!group){
            res.status(404);
            throw new Error("This group does not exist")
        }
        if(!group.members[req.user.id]){
            res.status(404);
            throw new Error("You are not a member of this group")
        }
        if (!group.members[req.user.id].changeMembers) {
            res.status(404);
            throw new Error("No permit to change")
        }
        for(var prop in req.body){
            if(group.members[prop]==undefined || prop == group.owner) {
                continue
            } else {
                group.members[prop] = req.body[prop];
                if(req.body[prop].addProjects == undefined){
                    group.members[prop].addProjects = false
                } 
            }
        }
        await group.save();
        res.status(200).send(group);
     }catch(error) {
         res.send(error.message);
     }
});







module.exports = router