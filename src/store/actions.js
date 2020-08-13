import * as types from './mutation-types'
// 设置用户信息
export const SetUserInfo = function({ commit }, data) {
  sessionStorage.setItem('user', JSON.stringify(data))
  commit(types.SET_USER_INFO, data)
}
export const changeLoad = function({ commit }, data) {
  commit('changeLoad', data)
}
// 设置屏幕宽高
export const SetResize = function({ commit }, data) {
  commit(types.SET_RESIZE, data)
}
