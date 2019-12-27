<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6">
        <b-form class="form">
            <span class="err">{{err}}</span>
            <div class="m-3">
                <b-button @click="userLogout()">Logout</b-button>
            </div>
            <div class="m-3">
                <p>Name</p>
                <b-form-input v-model="name" :value="1234" placeholder="Name"></b-form-input>
            </div>
            <div class="m-3">
                <p>Email</p>
                <b-form-input v-model="email" type="email" placeholder="Email"></b-form-input>
            </div>
            <div class="m-3">
                <p>Password</p>
                <b-form-input v-model="password" type="password" placeholder="Password"></b-form-input>
            </div>
            <div class="m-3" v-show="password">
                <p>Confirm password</p>
                <b-form-input v-model="confirm" :state="validation" type="password" placeholder="Confirm password"></b-form-input>
            </div>
            <div class="m-3">
                <b-button @click="userPatch()" variant="success">Update</b-button>
                <b-button @click="userDelete()" variant="danger">Delete</b-button>
            </div>
            
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
    name: 'Me',
    data(){
        return {
            id : '',
            name: '',
            email: '',
            password: '',
            confirm: '',
            err: '',
        }
    },
    computed: {
      validation() {
        return this.confirm == this.password
      }
    },
    mounted() {
        this.userShow()
    },
    methods: {
        async userShow() {
            try {
                const res = await UserServices.userShow()
                this.id = res.data.id
                this.name = res.data.name
                this.email = res.data.email
            } catch (e)  {
                if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                }
                if (e.response.status == 500) {
                    this.err = e.response.data
                }
            }
        },
        async userPatch() {
            try {
                if (this.confirm == this.password){
                    let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                        size: 'md',
                        buttonSize: 'md',
                        okVariant: 'danger',
                        okTitle: 'YES',
                        centered: true
                    })
                    if (value) {
                        const res = await UserServices.userPatch({
                            name: this.name,
                            email: this.email,
                            password: this.password
                        })
                        this.$router.push('/')
                    }
                } else {
                    this.err = 'Check the password'
                }
            } catch (e)  {
                if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                }
                if (e.response.status == 500) {
                    this.err = e.response.data
                    console.log(e)
                }
            }
        },
        async userDelete() {
            try {
                let value = await this.$bvModal.msgBoxConfirm('Are you sure?', {
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    centered: true
                })
                if(value) {
                    await UserServices.userDelete()
                    delete localStorage.token
                    delete localStorage.user
                    this.$router.push('/user/login')
                }
            } catch (e)  {
                if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                }
                if (e.response.status == 500) {
                    this.err = e.response.data
                }
            }
        },
        async userLogout() {
            try {
                await UserServices.userLogout()
                localStorage.clear()
                this.$router.push('/user/login')
            } catch (e)  {
                if (e.response.status == 401) {
                    delete localStorage.user
                    this.$router.push('/user/login')
                }
                if (e.response.status == 500) {
                    this.err = e.response.data
                }
            }
        },
    }
}
</script>

<style>
    .err{
            color: red
        }
</style>