<template>
    <b-container>
        <b-row class="justify-content-center">
            <span class="err">{{err}}</span>
            <b-col cols="6" v-if="project._id == undefined">
                <b-list-group v-for="(value, index) in tasks">
                    <b-list-group-item class="m-3">
                        <b-form-checkbox v-if="value.subCol == 0" size="lg" v-model="tasks[index].complited" @change="updateTasks(value)">
                            <h4 :class="{complited: value.complited}">{{value.description}}</h4>
                        </b-form-checkbox>

                        <h4 v-if="value.subCol != 0" :class="{complited: value.complited}">{{value.description}}</h4>
                        <div v-for="(item, key in value.subtask" inline>
                            <b-row>
                                <b-col>
                                    <b-form-checkbox size="sm" v-model="tasks[index].subtask[key]" @change="updateSubtasks(value)">
                                        <span :class="{complited: value.complited}">{{key}}</span>
                                    </b-form-checkbox>
                                </b-col>
                                <b-col>
                                    <b-button variant="danger"  @click="deleteSubtask(tasks[index], key)">X</b-button>
                                </b-col>
                            </b-row>
                        </div>
                        <b-input-group class="m-3">
                            <b-form-input v-model="tasks[index].subNew" placeholder="New subtask"></b-form-input>
                            <b-input-group-append>
                                <b-button variant="success" :disabled="tasks[index].subNew == 0 " @click="addSubtask(tasks[index])">Add</b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <b-button  variant="danger" @click="deleteTasks(tasks[index])">Delete</b-button>     
                    </b-list-group-item>
                </b-list-group> 
                <div class="m-3">
                    <b-input-group>
                        <b-form-input v-model="taskName" placeholder="New task"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="success" :disabled="taskName.length == 0" @click="addTask()">Add</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </b-col>
            <b-col cols="6" v-else>
                <b-list-group v-for="(value, index) in tasks">
                    <b-list-group-item class="m-3">
                        <b-form-checkbox v-if="value.subCol == 0 && project.user.changeTasks" size="lg" v-model="tasks[index].complited" @change="updateTasks(value)">
                            <h4 :class="{complited: value.complited}">{{value.description}}</h4>
                        </b-form-checkbox>

                        <h4 v-if="value.subCol != 0 || !project.user.changeTasks" :class="{complited: value.complited}">{{value.description}}</h4>
                        <div v-for="(item, key in value.subtask" inline>
                            <b-row v-if="project.user.changeTasks">
                                <b-col>
                                    <b-form-checkbox size="sm" v-model="tasks[index].subtask[key]" @change="updateSubtasks(value)">
                                        <span :class="{complited: value.complited}">{{key}}</span>
                                    </b-form-checkbox>
                                </b-col>
                                <b-col>
                                    <b-button variant="danger"  @click="deleteSubtask(tasks[index], key)">X</b-button>
                                </b-col>
                            </b-row>
                            <span v-if="!project.user.changeTasks" :class="{complited: value.complited}">{{key}}</span>
                        </div>
                        <b-input-group class="m-3" v-if="project.user.changeTasks">
                            <b-form-input v-model="tasks[index].subNew" placeholder="New subtask"></b-form-input>
                            <b-input-group-append>
                                <b-button variant="success" :disabled="tasks[index].subNew == 0 " @click="addSubtask(tasks[index])">Add</b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <b-button v-if="project.user.deleteTasks" @click="deleteTasks(tasks[index])" variant="danger">Delete</b-button>
                             
                    </b-list-group-item>
                </b-list-group> 
                <div class="m-3" v-if="project.user.addTasks">
                    <b-input-group>
                        <b-form-input v-model="taskName" placeholder="New task"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="success" :disabled="taskName.length == 0" @click="addTask()">Add</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import TaskServices from '@/services/TaskServices'
// eslint-disable-next-line
/* eslint-disable */
export default {
name: 'TaskList',
    data(){
        return {
            tasks: [],
            err: '',
            taskName: ''
        }
    },
    props:{
        project:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    mounted(){
        this.taskGet()
    },
    methods: {
        async taskGet(){
            try{
                if(this.project._id){
                    const res = await TaskServices.getTaskByProject(this.project._id)
                    this.tasks = res.data
                    for (const key in this.tasks) {
                        this.$set(this.tasks[key], 'subCol', Object.keys(this.tasks[key].subtask).length)
                        this.$set(this.tasks[key], 'subNew', '')
                    } 
                } else {
                    const res = await TaskServices.getTaskByUser()
                    this.tasks = res.data
                    for (const key in this.tasks) {
                        this.$set(this.tasks[key], 'subCol', Object.keys(this.tasks[key].subtask).length)
                        this.$set(this.tasks[key], 'subNew', '')
                    }    
                }
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        },
        async addTask(){
            try{
                if(this.project._id){
                    if(this.project.user.addTasks){
                        const res = await TaskServices.taskAdd({
                            description: this.taskName,
                            project: this.project.id
                        })
                        this.taskGet() 
                    }
                } else {
                    const res = await TaskServices.taskAdd({
                        description: this.taskName,
                        owner: localStorage.user
                    })
                    this.taskGet()
                }
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        },
        async updateTasks(task){
            try{
                if(this.project._id && !this.project.user.changeTasks){
                    return
                }
                const res = await TaskServices.taskUpdate(task._id,task)
                this.taskGet()
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        },
        async deleteTasks(task){
             try{
                if(this.project._id && !this.project.user.deleteTasks){
                    return
                }
                const res = await TaskServices.taskDelete(task._id)
                this.taskGet()
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        },
        async addSubtask(task){
            console.log(task)
            try{
                if(this.project._id && !this.project.user.changeTasks){
                    return
                }
                var name = task.subNew
                if (task.subtsask && task.subtask[name] != undefined){
                    return
                }
                if (!task.subtask) {
                    this.$set(task, 'subtask', {})
                }
                this.$set(task.subtask, name, false)
                console.log(task.subtask)
                const res = await TaskServices.subtaskUpdate(task._id,task.subtask)
                task.subNew = ''
                this.taskGet()
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        },
        async updateSubtasks(task){
            try{
                if(this.project._id && !this.project.user.changeTasks){
                    return
                }
                const res = await TaskServices.subtaskUpdate(task._id,task.subtask)
                this.taskGet()
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        },
        async deleteSubtask(task, item){
            console.log(task, item)
            try{
                if(this.project._id && !this.project.user.changeTasks){
                    return
                }
                const res = await TaskServices.subtaskDelete(task._id,item)
                this.taskGet()
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                }
                console.error(e)
            }
        }
    }
}
</script>

<style>
    .err{
        color: red
    }
    .complited{
        text-decoration: line-through
    }
    span{
        font-size:  10pt
    }
</style>