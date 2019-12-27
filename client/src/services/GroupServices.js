import Api from '@/services/Api'

export default{
    groupAdd(params){
        console.log(params)
        return Api().post('/group/create', params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupFindById(params){
        return Api().get(`/group/${params}`,{
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupFindByUser(){
        return Api().get(`/group`,{
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupUpdate(id, params){
        return Api().patch(`/group/${id}`,params,{
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupDelete(params){
        return Api().delete(`/group/${params}`,{
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupChangeMembers(id,params){
        return Api().patch(`/group/${id}/members/change`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupAddMembers(id,params){
        return Api().patch(`/group/${id}/members/add`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupDeleteMembers(id,params){
        return Api().patch(`/group/${id}/members/del`, params, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    },
    groupLeave(id){
        return Api().delete(`/group/${id}/leave`, {
            headers:{
                Authorization: 'Bearer ' + localStorage.token
            }
        })
    }
}