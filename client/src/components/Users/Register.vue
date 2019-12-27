<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6">
        <h1>User Register</h1>
        <b-form class="form">
            <span class="err">{{err}}</span>
            <div class="m-3">
                <b-form-input v-model="name" :state="nameValidation" :value="1234" placeholder="Name" required></b-form-input>
            </div>
            <div class="m-3">
                <b-form-input v-model="email" :state="emailValidation" type="email" placeholder="Email"></b-form-input>
            </div>
            <div class="m-3">
                <b-form-input v-model="password" :state="passValidation" type="password" placeholder="Password"></b-form-input>
            </div>
            <div class="m-3">
                <b-form-input v-model="confirm" :state="confirmValidation" type="password" placeholder="Confirm password"></b-form-input>
            </div>
            <div class="m-3">
                <b-button @click="userAdd()" :disabled="validation" variant="success">Register</b-button>
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
    name: 'Register',
    data(){
        return {
            id : '',
            name: '',
            email: '',
            password: '',
            confirm: undefined,
            err: '',
            nameValidation: false,
            emailValidation: false,
            passValidation: false,
            confirmValidation: false,
        }
    },
    computed: {
        validation(){
            this.nameValidation = this.name.length > 3
            this.emailValidation = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
            this.passValidation = this.password.length > 6
            this.confirmValidation = this.confirm == this.password
            return !(this.nameValidation && this.emailValidation && this.passValidation && this.confirmValidation)
        }
    },
    methods: {
        async userAdd() {
            try {
                if (this.confirm == this.password){
                    const res = await UserServices.userAdd({
                        name: this.name,
                        email: this.email,
                        password: this.password
                    })
                    localStorage.token = res.data.token
                    this.$router.push('/')
                } else {
                    this.err = 'Check the password'
                }
            } catch (e)  {
                if (e.response.status == 500) {
                    this.err = e.response.data
                    console.log(e)
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