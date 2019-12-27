<template>
  <b-container>
    <b-row class="justify-content-center">
        <b-col cols="12" md="12">
            <h1>Group list</h1>
            <b-list-group v-for="item in groups">
                <b-list-group-item :to="`/group/${item._id}`">{{item.name}}</b-list-group-item>
            </b-list-group>
            <router-link to="/group/create">Create group</router-link>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import GroupServices from '@/services/GroupServices'
export default {
    name: 'GroupList',
    data(){
        return {
            groups: []
        }
    },
    mounted() {
        this.findGroupByUser()
    },
    methods: {
        async findGroupByUser() {
            try{
                var res = await GroupServices.groupFindByUser()
                this.groups =res.data
                
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