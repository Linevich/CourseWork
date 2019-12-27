import Api from '@/services/Api'

export default {
    userLogin(params) {
        return Api().post('/user/login', params)
    },
    userShow() {
        return Api().get('/user/me', {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    userPatch(params) {
        return Api().patch('/user/me', params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    userDelete() {
        return Api().delete('/user/me', {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    userAdd(params) {
        return Api().post('/user/register', params)
    },

    userFindByEmail(email) {
        return Api().get(`/user/email/${email}`)
    },
    userFindListById(params) {
        return Api().post('/user/find', params)
    },
    userLogout(){
        return Api().post('/user/logout', null, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    }
}