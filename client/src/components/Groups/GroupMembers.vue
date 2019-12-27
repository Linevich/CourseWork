<template>
    <b-container>
        <b-row class="justify-content-center">
            <span class="err">{{err}}</span>
            <b-col cols="12" md="6">
                <h3>Members</h3>
                <div v-if="user.addMembers">
                    <b-input-group>
                        <b-form-input v-model="memInput" placeholder="User e-mails separated by space"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="success" :disabled="memInput.length == 0" @click="findUsers()">Find</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </div>
                <b-list-group v-for="(value, index) in members">
                    <b-list-group-item>
                        <p><b>{{value.name}}</b></p>
                        <b-form-checkbox size="sm" v-model="members[index].addMembers"  :disabled="!changeUser(index)">Can add members</b-form-checkbox>
                        <b-form-checkbox size="sm" v-model="members[index].changeMembers" :disabled="!changeUser(index)">Can change members</b-form-checkbox>
                        <b-form-checkbox size="sm" v-model="members[index].deleteMembers" :disabled="!changeUser(index)">Can delete members</b-form-checkbox>
                        <b-form-checkbox size="sm" v-model="members[index].changeGroup"  :disabled="!changeUser(index)">Can change group</b-form-checkbox>
                        <b-form-checkbox size="sm" v-model="members[index].deleteGroup" :disabled="!changeUser(index)">Can delete group</b-form-checkbox>
                        <b-form-checkbox size="sm" v-model="members[index].addProjects" :disabled="!changeUser(index)">Can add Projects</b-form-checkbox>
                    </b-list-group-item>
                    <b-button  variant="danger" v-if="deleteUser(index)" @click="deleteMember(index)">Delete</b-button>
                </b-list-group> 
                <div class="m-3">
                    <b-button variant="success" @click="changeMembers()" v-if="user.changeMembers || user.addMembers">Confirm</b-button>
                    <b-button :to="`/group/${id}`">Cancel</b-button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import GroupServices from '@/services/GroupServices'
import UserServices from '@/services/UserServices'

export default {
    name: 'GroupMembers',
    data(){
        return {
            id: '',
            members: {},
            memInput: '',
            owner: {},
            err: '',
            user: {},
            update: false,
            isOwner: false
        }
    },
    mounted(){
        this.id = this.$route.params.id
        this.groupGet()
    },
    methods: {
        async groupGet(){
            try{
                const res = await GroupServices.groupFindById(this.id)
                const users = await UserServices.userFindListById(Object.keys(res.data.members))
                this.name = res.data.name
                this.members = Object.assign({},this.members, res.data.members)
                if (users.length != this.members.length) {
                    throw new Error("Some users not found")
                }
                for (var i = 0; i<users.data.length; i++) {
                    var id = users.data[i].id
                    var name = users.data[i].name
                    var email = users.data[i].email
                    this.$set(this.members[id], 'name', `${name} (${email})`)
                }
                this.owner = res.data.owner
                this.user = Object.assign({}, this.members[localStorage.user])
                this.isOwner = res.data.owner == localStorage.user
            } catch (e){
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
        async findUsers() {
            try{
                var res = await UserServices.userFindByEmail(this.memInput)
                for (var i = 0; i< res.data.length; i++) {
                    var id = res.data[i].id
                    if (this.members[id] == undefined) {
                        this.$set(this.members, id, {
                            addMembers: false,
                            changeMembers: false,
                            deleteMembers: false,
                            changeGroup: false,
                            deleteGroup: false,
                            addProjects: true,
                            name: `${res.data[i].name}  (${res.data[i].email})`
                        })
                    }
                }
                this.$emit('inputMembers', this.members)
            } catch(e) {
                console.error(e.response)
            }  
        },
        async changeMembers(){
            try{
                let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    centered: true
                })
                if (value && this.user.addMembers) {
                    await GroupServices.groupAddMembers(this.id, this.members)
                }
                if (value && this.user.changeMembers) {
                    await GroupServices.groupChangeMembers(this.id, this.members)
                }
                this.$router.push(`/group/${this.id}`)
            } catch(e) {
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
        async  deleteMember(user) {
            try{
                let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    centered: true
                })
                if (value && this.user.deleteMembers) {
                    await GroupServices.groupDeleteMembers(this.id, [user])
                    delete this.members[user]
                    this.groupGet()
                }
            } catch(e) {
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
        deleteUser(id){
            if(id != this.owner && this.user.deleteMembers){
                return true
            } else {
                return false
            }
        },
        changeUser(id){
            if(id != this.owner && this.user.changeMembers){
                return true
            } else {
                return false
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