<template>
    <b-container>
        <b-row class="justify-content-center">
            <b-col cols="12" md="12">
                <h1>Projects</h1>
                <b-list-group v-for="item in projects">
                    <b-list-group-item :to="`/project/${item._id}`">{{item.name}}</b-list-group-item>
                </b-list-group>
                <router-link v-show="group.id == undefined" :to="{name:'ProjectCreate'}">
                    Create project
                </router-link>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import ProjectServices from '@/services/ProjectServices'

export default {
    name: 'ProjectList',
    data(){
        return {
            projects: [],
        }
    },
    props: {
        group:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    mounted() {
        this.findProject()
    },
    methods: {
        async findProject() {
            try{
                if(this.group.id != undefined) {
                    const res = await ProjectServices.projectListByGroup(this.group.id)
                    this.projects = res.data
                } else {
                    const res = await ProjectServices.projectListByUser()
                    this.projects = res.data
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
            
        }
    }
}
</script>

<style>
    .err{
            color: red
        }
</style>