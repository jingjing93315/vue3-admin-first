import request from '../utils/request'

export default {
  login(params){
    return request({
      url: '/users/login',
      method: 'post',
      data: params,
      mock: false
    })
  },
  noticeCount(){
    return request({
      url: '/leave/count',
      method: 'get',
      mock: false,
      data: {}
    })
  },
  menuList(){
    return request({
      url: '/menu/list',
      method: 'get',
      // mock: true,
      data: {}
    })
  },
  permissionList(){
    return request({
      url: '/users/getPermissionList',
      method: 'get',
      // mock: true,
      data: {}
    })
  },
  userList(params){
    return request({
      url: '/users/list',
      method: 'get',
      mock: false,
      data: params
    })
  },
  userAllList(){
    return request({
      url: '/users/all/list',
      method: 'get',
      mock: false
    })
  },
  userDelete(params){
    return request({
      url: '/users/delete',
      method: 'post',
      // mock: true,
      data: params
    })
  },
  getRoleAllList(){
    return request({
      url: '/roles/allList',
      method: 'get',
      mock: false
    })
  },
  getDeptList(params){
    return request({
      url: '/dept/list',
      method: 'get',
      mock: false,
      data: params
    })
  },
  userSubmit(params){
    return request({
      url: '/users/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  menuSubmit(params){
    return request({
      url: '/menu/operate',
      method: 'post',
      // mock: true,
      data: params
    })
  },
  roleList(params){
    return request({
      url: '/roles/list',
      method: 'get',
      mock: false,
      data: params
    })
  },
  roleOperate(params){
    return request({
      url: '/roles/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  updatePermission(params){
    return request({
      url: '/roles/update/permission',
      method: 'post',
      mock: false,
      data: params
    })
  },
  deptOperate(params){
    return request({
      url: '/dept/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  // 审批列表
  getApplyList(params){
    return request({
      url: '/leave/list',
      method: 'get',
      mock: false,
      data: params
    })
  },
  leaveOperate(params){
    return request({
      url: '/leave/operate',
      method: 'post',
      mock: false,
      data: params
    })
  },
  leaveApprove(params) {
    return request({
        url: '/leave/approve',
        method: 'post',
        data: params,
        mock: false
    })
  }
};