import Api from '@/services/Api'

export default{
    getTaskByUser(){
        return Api().get('/task', {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    getTaskByProject(params){
        return Api().post('/task', params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    taskUpdate(id,params){
        return Api().patch(`/task/${id}`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    taskDelete(id){
        return Api().delete(`/task/${id}`, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    taskAdd(params){
        return Api().post('/task/create', params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    subtaskUpdate(id,params){
        return Api().patch(`/task/${id}/subtask`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    subtaskDelete(id, name){
        return Api().delete(`/task/${id}/${name}`, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    }
}