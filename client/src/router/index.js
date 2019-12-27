import Vue from 'vue'
import Router from 'vue-router'

import User from '@/components/Users/User'
import UserLogin from '@/components/Users/Login'
import UserRegister from '@/components/Users/Register'
import UserMe from '@/components/Users/Me'

import Group from '@/components/Groups/Group'
import CreateGroup from '@/components/Groups/CreateGroup'
import GroupMembers from '@/components/Groups/GroupMembers'
import ViewGroup from '@/components/Groups/ViewGroup'
import GroupList from '@/components/Groups/GroupList'

import Task from '@/components/Tasks/Task'
import TaskList from '@/components/Tasks/TaskList'

import Project from '@/components/Projects/Project'
import ProjectList from '@/components/Projects/ProjectList'
import ProjectCreate from '@/components/Projects/ProjectCreate'
import ProjectView from '@/components/Projects/ProjectView'
import ProjectMembers from '@/components/Projects/ProjectMembers'

Vue.use(Router)
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/task/list'
    },
    {
      path: '/user',
      redirect: '/user/me',
      name: 'User',
      component: User,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: UserLogin,
          meta : { guest: true }
        },
        {
          path: 'register',
          name: 'Register',
          component: UserRegister,
          meta : { guest: true }
        },
        {
          path: 'me',
          name: 'Me',
          component: UserMe,
          meta: { auth: true }
        }
      ]
    },
    {
      path: '/group',
      name: 'Group',
      redirect: '/group/list',
      component: Group,
      children: [
        {
          path: 'create',
          name: 'GroupCreate',
          component: CreateGroup,
          meta: { auth: true }
        },
        {
          path: 'list',
          name: 'GroupList',
          component: GroupList,
          meta: { auth: true }
        },
        {
          path: '/group/:id/members',
          name: 'GroupMembers',
          component: GroupMembers,
          meta: { auth: true }
        },
        {
          path: '/group/:id',
          name: 'ViewGroup',
          component: ViewGroup,
          meta: {auth: true}
        }
      ]
    },
    {
      path:'/task',
      name:'Task',
      redirect: '/task/list',
      component: Task,
      children: [
        {
          path: 'list',
          name: 'TaskList',
          component: TaskList,
          meta: {auth: true}
        }
      ]
    },
    {
      path:'/project',
      name:'Project',
      redirect:'/project/list',
      component: Project,
      children: [
        {
          path: 'list',
          name: 'ProjectList',
          component: ProjectList,
          meta: {auth: true}
        },
        {
          path: 'create',
          name: 'ProjectCreate',
          component: ProjectCreate,
          meta: {auth: true}
        },
        {
          path: '/project/:id',
          name: 'ProjectView',
          component: ProjectView,
          meta: {auth: true}
        },
        {
          path: '/project/:id/members',
          name: 'ProjectMembers',
          component: ProjectMembers,
          meta: { auth: true }
        }
      ]
    }
  ]
})


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.auth)) {
    if (localStorage.token == undefined) {
      next({
        path: '/user/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else if(to.matched.some(record => record.meta.guest)) {
    if(localStorage.token == undefined){
      next()
    }
    else{
      next({ path: '/user/me'})
    }
  }else {
    next()
  }
})

export default router