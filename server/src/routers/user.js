const express = require("express")
const User = require("./../models/user")
const router = new express.Router()
const auth = require('./../middleware/auth');

router.post("/user/find", async (req, res) => {
    console.log(req.body)
    const users = await User.find()
    console.log(users.map(user => String(user.toObject()._id)))
    users.forEach(user => console.log(req.body.indexOf(user._id)))
    res.status(200).send(users.filter(user => req.body.includes(String(user.toObject()._id))))
})

router.post("/user/register", async (req, res)=>{
    try {
        let user = new User(req.body);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user, token});
    }
    catch(err) {
        res.status(403).send(err.message)
    };
});

router.post("/user/login", async(req, res) => {
    try {
        const user = await User.findOneByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch(err) {
        res.status(400).send(err.message)
    }
});

router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save()
        res.status(200).send("Logout successfull");
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send("Logout from all devices successfull");
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.get('/user/me', auth, async (req, res) => {
    await req.user.populate("tasks").execPopulate();
    console.log(req.user);
    res.send(req.user)
})

router.get("/user/list", auth, (req, res) => {
    User.find().then((users)=>{
        res.status(200).send(users)
    }).catch((err)=>{
        res.status(500).send(err.message)
    })
})

router.get("/user/email/:email", async (req, res) => {
    const { email } = req.params
    const user = await User.findOne({ email })
    res.status(200).send(user)
})

router.get("/user/view/:id", auth, (req, res) => {
    User.findById(req.params.id).then((user) => {
        res.status(200).send(user);
    }).catch((error) => {
        res.status(401).send(error.message);
    });
})

router.patch('/user/me', auth, async (req, res) => {
    try {
        const user = req.user;
        const updates = ['name', 'email', 'password', 'age'];
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete("/user/me", auth, (req, res) => {
    try {
        req.user.remove();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/user/:id', async(req, res)=>{
    let user = await Task.findById(req.params.id);
    await user.delete();
    res.status(200).send(user);
})

module.exports = router