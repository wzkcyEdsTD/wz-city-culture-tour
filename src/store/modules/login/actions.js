import * as types from './mutation-types'

export const ChangeUsername = function({ commit }, data) {
  commit(types.SET_USERNAME, data)
}
