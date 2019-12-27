<template>
    <b-container>
        <b-row class="justify-content-center">
            <b-col cols="12" md="6">
                <h1>Group creation</h1>
                <b-form class="form" >
                    <span class="err">{{err}}</span>
                    <div class="m-3">
                        <b-form-input v-model="name" :state="name.length > 3" placeholder="Name" required></b-form-input>
                    </div>
                    <div >
                        <b-button @click="groupAdd()"  variant="success">Create</b-button>
                    </div>
                </b-form>
            </b-col>
        </b-row>
        <FindMembers @inputMembers="updateMembers"/>
    </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import GroupServices from '@/services/GroupServices'
import FindMembers from './GroupFindMembers'



export default {
    name: 'CreateGroup',
    data(){
        return {
            name: '',
            err: '',
            members: {}
        }
    },
    components:{
        FindMembers
    },
    methods: {
        async groupAdd() {
            try{
                const res = await GroupServices.groupAdd({
                    name: this.name,
                    members: this.members
                })
                this.$router.push(`/group/${res.data.group._id}`)
            } catch (e) {
                if(e.response == undefined){
                    console.error(e)
                } else if (e.response.status == 401) {
                    localStorage.clear()
                    this.$router.push('/user/login')
                } else {
                    console.error(e.response)
                }
            }
        },
        updateMembers(data){
            this.members = Object.assign({}, data)
        }
    }
}
</script>

<style>
    .err{
            color: red
        }
</style>