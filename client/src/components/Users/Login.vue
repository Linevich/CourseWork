<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col cols="12" md="6">
        <h1>User Login</h1>
        <div class="form">
          <span class="err">{{err}}</span>
          <div class="m-3">
            <router-link to="/user/register">Registration</router-link>
          </div>
          <div class="m-3">
            <b-form-input v-model="email" placeholder="Email" type="email" required></b-form-input>
          </div>
          <div class="m-3">
            <b-form-input v-model="password" placeholder="Password" type="password" required></b-form-input>
          </div>
          <div class="m-3">
            <b-button variant="success" @click="userLogin()">Login</b-button>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import UserServices from '@/services/UserServices'

export default {
    name: 'Login',
    data(){
        return {
            email: '',
            password: '',
            err: '',
        }
    },
    methods: {
        async userLogin() {
            try {
                const res = await UserServices.userLogin({
                    email: this.email,
                    password: this.password
                })

                localStorage.setItem("token",  res.data.token)
                localStorage.setItem("user",  res.data.user.id)

                this.$router.push('/')
            } catch (e)  {
                if (e.response.status == 500) {
                    this.err = e.response.data
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