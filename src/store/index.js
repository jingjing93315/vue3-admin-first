import { createStore } from 'vuex'

import mutations from './mutations'

import storage from '../utils/storage'

import api from '../api'

const state = {
  userInfo: storage.getItem('userInfo') || {},
  menuList: storage.getItem('menuList') || [],
  actionList: storage.getItem('actionList') || [],
  noticeCount: 0
}

const actions = {
  async noticeCountGet({commit}) {
    const res = await api.noticeCount()
    commit('saveNoticeCount', res)
  }
}
export default createStore({
  state, 
  mutations,
  actions
})