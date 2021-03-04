import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
const Login = (resolve) => {
  import('../views/Login').then((module) => {
    resolve(module)
  })
}
const Main = (resolve) => {
  import('../views/Main').then((module) => {
    resolve(module)
  })
}
const Home = (resolve) => {
  import('../components/Home').then((module) => {
    resolve(module)
  })
}
const Article = (resolve) => {
  import('../components/Article').then((module) => {
    resolve(module)
  })
}
const Comment = (resolve) => {
  import('../components/Comment').then((module) => {
    resolve(module)
  })
}
const Content = (resolve) => {
  import('../components/Content').then((module) => {
    resolve(module)
  })
}
const Fans = (resolve) => {
  import('../components/Fans').then((module) => {
    resolve(module)
  })
}
const Material = (resolve) => {
  import('../components/Material').then((module) => {
    resolve(module)
  })
}
const Personset = (resolve) => {
  import('../components/Personset').then((module) => {
    resolve(module)
  })
}

Vue.use(VueRouter)

const routes = [
  // { path: '/', redirect: '/Login' },
  { path: '/', redirect: '/Login' },
  { path: '/Login', name: 'Login', component: Login },
  {
    path: '/Main',
    // name: 'Main',
    component: Main,
    children: [
      { path: '/', redirect: 'Home' },
      { path: 'Home', name: 'Home', component: Home },
      { path: 'Article', name: 'Article', component: Article },
      { path: 'Comment', name: 'Comment', component: Comment },
      { path: 'Content', name: 'Content', component: Content },
      { path: 'Fans', name: 'Fans', component: Fans },
      { path: 'Material', name: 'Material', component: Material },
      { path: 'Personset', name: 'Personset', component: Personset }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/Login') {
    next()
    return
  }
  if (sessionStorage.getItem('data')) {
    next()
  } else {
    next('/Login')
  }
})
router.afterEach((to, from) => {
  NProgress.done()
})

export default router
