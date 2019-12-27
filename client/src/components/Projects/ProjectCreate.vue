<template>
    <b-container>
        <b-row class="justify-content-center">
            <b-col cols="12" md="6">
                <h1>Project creation</h1>
                <b-form class="form" >
                    <span class="err">{{err}}</span>
                    <div class="m-3">
                        <b-form-input v-model="name" :state="name.length > 3" placeholder="Name" required></b-form-input>
                    </div>
                    <div >
                        <b-button @click="projectAdd()"  variant="success">Create</b-button>
                    </div>
                </b-form>
            </b-col>
        </b-row>
        <FindMembers v-if="groupId ==''" @inputMembers="updateMembers"/>  
    </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import ProjectServices from '@/services/ProjectServices'
import FindMembers from './ProjectFindMembers'

export default {
    name: 'ProjectCreate',
    data(){
        return {
            name: '',
            err: '',
            members: {}
        }
    },
    props:{
        groupId: {
            type: String,
            default(){
                return ''
            }
        }
    },
    components:{
        FindMembers
    },
    methods: {
        async projectAdd() {
            try{
                var params;
                if(this.groupId != '') {
                    params = {
                        name: this.name,
                        group: this.groupId
                    }
                } else {
                    params = {
                        name: this.name,
                        members: this.members,
                        owner: localStorage.user
                    }
                }
                const res = await ProjectServices.projectAdd(params)   
                console.log(res)   
                this.$router.push(`/project/${res.data.project._id}`)
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
        updateMembers(data){
            this.members = Object.assign({}, data)
        }
    }
}
</script>

<style>

</style>