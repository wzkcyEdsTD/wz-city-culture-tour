import router from './index'
import store from '../store'

router.beforeEach((to, from, next) => {
  store.dispatch('changeLoad', true)
  // 如果是需要登录的页面并且已经登陆了
  if (to.meta.requireLogin) {
    if (store.getters.isLogin) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})
router.afterEach((to, from) => {
  // 关闭加载提示
  store.dispatch('changeLoad', true)
})
