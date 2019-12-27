<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col cols="12" md="12">
        <h3>Members</h3>
        <b-form class="form" @submit.stop.prevent>
            <span class="err">{{err}}</span>
            <div class="m-3">
                <b-input-group>
                    <b-form-input v-model="memInput" placeholder="User e-mails separated by space"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="success" :disabled="memInput.length == 0" @click="findUsers()">Find</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <b-list-group class="m-3" v-for="(value, index) in members">
                <b-list-group-item>
                    {{value.name}}
                    <b-dropdown variant="outline-primary" dropright>
                        <b-dropdown-form >
                            <b-form-checkbox size="sm" v-model="members[index].addMembers" switch>Can add members</b-form-checkbox>
                            <b-form-checkbox size="sm" v-model="members[index].changeMembers"  switch>Can change members</b-form-checkbox>
                            <b-form-checkbox size="sm" v-model="members[index].deleteMembers" switch>Can delete members</b-form-checkbox>
                            <b-form-checkbox size="sm" v-model="members[index].changeGroup"  switch>Can change group</b-form-checkbox>
                            <b-form-checkbox size="sm" v-model="members[index].deleteGroup" switch>Can delete group</b-form-checkbox>
                            <b-form-checkbox size="sm" v-model="members[index].addProjects" switch>Can add Projects</b-form-checkbox>
                        </b-dropdown-form>
                    </b-dropdown>
                </b-list-group-item>
            </b-list-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import UserServices from '@/services/UserServices'
export default {
    name: 'FindMembers',
    data(){
        return {
            members: {},
            memInput: '',
            err: '',
        }
    },
    methods: {
        async findUsers() {
            try{
                var res = await UserServices.userFindByEmail(this.memInput)
     
                    var id = res.data._id

                    console.log(this.members[id])
                    if ( this.members[id] == undefined) {
                        this.$set(this.members, id, {
                            addMembers: false,
                            changeMembers: false,
                            deleteMembers: false,
                            changeGroup: false,
                            deleteGroup: false,
                            addProjects: true,
                            name: `${res.data.name}  (${res.data.email})`
                        })
                    }
                
                this.$emit('inputMembers', this.members)
            } catch(e) {
                console.error(e.response)
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