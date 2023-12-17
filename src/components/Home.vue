<script>
import TreeMenu from './TreeMenu.vue'
import Breadcrumb from './BreadCrumb.vue'
import storage from '../utils/storage'
export default {
  name: 'home',
  components: {
    TreeMenu,
    Breadcrumb
  },
  data(){
    return {
      userInfo: this.$store.state.userInfo || {},
      isCollapse: false,
      userMenu: []
    }
  },
  computed:{
    noticeCount() {
      return this.$store.state.noticeCount
    }
  },
  mounted(){
    this.getMenuList()
    this.getNoticeCount()
  },
  methods: {
    handleLogout(key){
      if(key == 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
      window.localStorage.clear()
    },
    toggle(){
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount() {
      await this.$store.dispatch("noticeCountGet")
    },
    async getMenuList(){
      const { menuList, actionList } = await this.$api.permissionList()
      this.userMenu = menuList
      this.$store.commit('saveMenuList', menuList)
      this.$store.commit('saveActionList', actionList)
    }
  }
}
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold': 'unfold']">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu
        default-active="2"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <tree-menu :user-menu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold': 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <fold class="menu-fold" @click="toggle"></fold>
          <div class="bread">
            <breadcrumb />
          </div>
        </div>
        <div class="user-info" v-if="userInfo">
          <el-badge 
            :is-dot="noticeCount > 0 ? true: false" 
            class="user-badge"
          >
            <el-icon class="el-icon-bell">
              <bell></bell>
            </el-icon>
          </el-badge>
          <el-dropdown class="dropdown" @command="handleLogout">
            <span class="user-link">
             {{userInfo.userName}}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱:{{userInfo.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    // overflow-y: auto;
    transition: width 0.5s;
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 15px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      .menu-setting {
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }
      border-right: none;
      height: calc(100vh - 50px);
    }

  }
  .content-right {
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        z-index: 1;
        .menu-fold{
          width: 25px;
          height: 25px;
          margin-right: 15px;
        }
      }
      .user-info {
        .user-badge {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #4091ff;
        }
        .el-dropdown  {
          vertical-align: text-top;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%; // 相对屏幕
        background-color: #fff;
      }
    }
  }
}
</style>