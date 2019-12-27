<template>
    <b-container>
        <b-row class="justify-content-center">
            <span class="err">{{err}}</span>
            <b-col cols="12" md="3">
                <h3>Members</h3>
                <b-list-group class="m-3" v-for="(value, index) in members">
                    <b-list-group-item>
                        {{value.name}}
                    </b-list-group-item>
                </b-list-group>
                <div class="m-3">
                    <b-button :to="`/project/${id}/members`">View</b-button>
                    <b-button @click="projectLeave()" variant="danger" v-if="!isOwner">Leave</b-button>
                </div>
            </b-col>
            <b-col cols="12" md="9" v-if="update">
                <div class="m-3">
                    <p>Name</p>
                    <b-form-input v-model="name" placeholder="Name"></b-form-input>
                </div>
                <div class="m-3" v-if="isOwner">
                    <b-form-select v-model="owner" class="mb-3">
                        <p>Name</p>
                        <option :value="index" v-for="(value, index) in members">{{value.name}}</option>
                    </b-form-select>
                </div>
                <div class="m-3">
                    <b-button variant="success" @click="projectUpdate()" v-if="user.changeProject">Confirm</b-button>
                    <b-button @click="update=!update">Cancel</b-button>
                </div>
            </b-col>
            <b-col cols="12" md="9">
                <h1>Project {{name}}</h1>
                
                <div class="m-3">
                    <b-button @click="update=!update" variant="success" v-if="user.changeProject">Update</b-button>
                    <b-button @click="projectDelete()" variant="danger" v-if="user.deleteProject">Delete</b-button>
                </div>
                <TaskList :project="{id:id, user:user}"/>
            </b-col>
            
        </b-row>
    </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import ProjectServices from '@/services/ProjectServices'
import UserServices from '@/services/UserServices'
import TaskList from '@/components/Tasks/TaskList'

export default {
    name: 'ViewGroup',
    data(){
        return {
            id: '',
            name: '',
            members: {},
            owner: {},
            err: '',
            user: {},
            update: false,
            isOwner: false
        }
    },
    components: {
        TaskList
    },
    mounted(){
        this.id = this.$route.params.id
        this.projectGet()
    },
    methods: {
        async projectGet(){
            try{
                const res = await ProjectServices.projectFindById(this.id)
                const users = await UserServices.userFindListById(Object.keys(res.data.members))
                console.log(users)
                this.name = res.data.name
                this.members = Object.assign({},this.members, res.data.members)
                if (users.length != this.members.length) {
                    throw new Error("Some users not found")
                }
                for (var i = 0; i<users.data.length; i++) {
                    var id = users.data[i]._id
                    var name = users.data[i].name
                    var email = users.data[i].email
                    this.$set(this.members[id], 'name', `${name} (${email})`)
                }
                this.owner = res.data.owner
                this.user = Object.assign({}, this.members[localStorage.user])
                this.isOwner = res.data.owner == localStorage.user
            } catch (e){
                if (e.response != undefined){
                    if (e.response.status == 401) {
                        delete localStorage.user
                        this.$router.push('/user/login')
                    }
                    console.error(e.response)
                } else {
                    console.error(e)
                }
                
                
            }
        },
        async projectDelete(){
            try {
                let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    centered: true
                })
                if (value && this.user.deleteProject) {
                    const res = await ProjectServices.projectDelete(this.id)
                    this.$router.push('/project')
                }
            } catch (e) {
                 if(e.response == undefined){
                    console.error(e)
                } else if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                } else {
                    console.error(e.response)
                }
            }
        },
        async projectUpdate(){
            try {
                let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    centered: true
                })
                if (value && this.user.changeProject) {
                    const res = await ProjectServices.projectUpdate(this.id, {
                        name: this.name,
                        owner: this.owner
                    })
                    this.update = !this.update
                    this.isOwner = this.owner == localStorage.user
                }
            } catch (e) {
                if(e.response == undefined){
                    console.error(e)
                } else if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                } else {
                    console.error(e.response)
                }
            }
        },
        async projectLeave(){
            try {
                let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    centered: true
                })
                if (value && this.owner != localStorage.user) {
                    await ProjectServices.projectLeave(this.id)
                    this.$router.push('/project')
                }
            } catch (e) {
                if(e.response == undefined){
                    console.error(e)
                } else if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                } else {
                    console.error(e.response)
                }
            }
        }
    }
}
</script>

<style>
    .err{
            color: red
        }
</style>