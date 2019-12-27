const express = require("express")
require("./db/mongoose.js");
const validator = require("validator")
const cors = require("cors")

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const groupRouter = require("./routers/group");
const projectRouter = require("./routers/project");


const app = express()
app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(groupRouter)
app.use(projectRouter)


app.listen(8081, ()=>{
    console.log("Server listening on 8081 port")
})