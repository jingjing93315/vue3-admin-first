<template>
  <template v-for="menu in userMenu">
    <el-sub-menu 
      v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1"
      :key="menu._id"
      :index="menu.path"
    >
    <template #title>
      <el-icon :class="menu.icon">
        <!-- <setting /> -->
        <component :is="handleIcon(menu.icon)"></component>
      </el-icon>
      <span>{{menu.menuName}}</span>
    </template>
    <tree-menu :userMenu="menu.children"></tree-menu>
  </el-sub-menu>
  <el-menu-item 
    v-else-if="menu.menuType ==1" 
    :key="menu._id"
    :index="menu.path"
  >
    {{menu.menuName}}</el-menu-item>
  </template>
</template>
<script>
export default {
  name: 'TreeMenu',
  props: {
    userMenu: {
      type: Array,
      default(){
        return []
      }
    }
  },
  methods: {
    handleIcon(icon){
      const iconArr = icon.split('-')
      let iconStr = iconArr[iconArr.length - 1]
      return iconStr.slice(0,1).toUpperCase() + iconStr.slice(1)
    }
  }
}
</script>

