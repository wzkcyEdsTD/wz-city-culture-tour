// 定义修改操作
import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO](state, data) {
    state.userInfo = data
  },
  changeLoad(state, data) {
    state.isLoading = data
  },
  [types.SET_RESIZE](state, data) {
    state.resize = data
  }
}
export default mutations
