// import Vue from 'vue'
// import Router from 'vue-router'
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'

// Vue.use(Router)

// const router = new Router({
//   routes: [
//     { path: '/', redirect: '/login' },
//     { path: '/login', component: Login },
//     { path: '/home', component: Home }
//   ]
// })
//写一遍加深映象
import vue from "vue"
import Router from "vue-router"
import login from "./components/Login.vue"
import home from "./components/Home.vue"
import right from "./components/quanxian/Right.vue"
import users from "./components/user/users.vue"
import roles from "./components/quanxian/Roles.vue"
vue.use(Router)
const router = new Router({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: login },
    {
      path: "/home", component: home, children: [
        { path: "/rights", component: right },
        { path: "/users", component: users },
        { path: "/roles", component: roles },
      ]
    },
  ]
})
// export default router
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
