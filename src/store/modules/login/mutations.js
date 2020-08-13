// 定义修改操作
import * as types from './mutation-types'

const mutations = {
  [types.SET_USERNAME](state, data) {
    console.log(arguments)
    state.username = data
  }
}
export default mutations
