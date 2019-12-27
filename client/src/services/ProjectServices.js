import Api from '@/services/Api'

export default{
    projectListByGroup(params){
        return Api().post('/project', params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectListByUser(){
        return Api().get('/project', {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectAdd(params){
        return Api().post('/project/create', params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectFindById(params){
        return Api().get(`/project/${params}`, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectDelete(params){
        return Api().delete(`/project/${params}`,{
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectUpdate(id, params){
        return Api().patch(`/project/${id}`,params,{
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectChangeMembers(id,params){
        return Api().patch(`/project/${id}/members/change`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectAddMembers(id,params){
        return Api().patch(`/project/${id}/members/add`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectDeleteMembers(id,params){
        return Api().patch(`/project/${id}/members/del`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    projectLeave(id){
        return Api().delete(`/project/${id}/leave`, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    }
}