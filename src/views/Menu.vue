<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState" placeholder="请选择状态">
            <el-option label="停用" :value="2"></el-option>
            <el-option label="正常" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table 
        :data="menuList" 
        style="width: 100%"
        row-key="_id"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :formatter="item.formatter"
         />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" size="small"
            @click="handleAdd(2,scope.row)"
            >新增</el-button
          >
          <el-button size="small"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row._id)"
            >删除</el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="菜单新增"
      v-model="showModal"
      :before-close="handleClose"
    >
      <el-form :model="menuForm" ref="dialogForm" label-width="100px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            :options="menuList"
            v-model="menuForm.parentId"
            placeholder="请选择父级菜单"
            :props="{ checkStrictly: true, value:'_id', label: 'menuName' }"
            clearable
          >
          </el-cascader>
          <span>不选则默认是创建一级菜单</span>
        </el-form-item>
         <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="menuForm.menuType">
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
         <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils/utils'
export default {
  name: 'Menu',
  data(){
    return {
      queryForm: {
        menuName: '',
        menuState: 1
      },
      menuList: [],
      columns: [
        {
          label: '菜单名称',
          prop: 'menuName'
        },
        {
          label: '图标',
          prop: 'menuIcon'
        },
        {
          label: '权限标识',
          prop: 'menuCode'
        },
        {
          label: '路由地址',
          prop: 'path'
        },
        {
          label: '组件路径',
          prop: 'component'
        },
        {
          label: '菜单状态',
          prop: 'menuState',
          formatter(row, column, value){
            return {
              1: '正常',
              2: '停用'
            }[value]
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value){
            return utils.formatDate(new Date(value))
          }
        }
      ],
      showModal: false,
      action: 'add',
      menuForm: {
        menuType: 1,
        menuState: 1,
        parentId: [null]
      },
      rules: {
        menuName: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在2-8个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const res = await this.$api.menuList(this.menuForm)
      this.menuList = res
    },
    handleQuery(){
      this.menuForm.menuState = this.queryForm.menuState
      this.menuForm.menuName = this.queryForm.menuName
      this.getMenuList()
    },
    handleReset(form){
      this.$refs[form].resetFields()
    },
    handleAdd(type, row){
      this.showModal= true
      this.action = 'add'
      if(type == 2){
        this.menuForm.parentId = [...row.parentId, row._id].filter(item => (item))
      }
    },
    handleEdit(row){
      this.showModal= true
      this.action = 'edit'
      this.$nextTick(() => {
        Object.assign(this.menuForm, row)
      })
    },
    async handleDelete(_id){
      await this.$api.menuSubmit({_id, action: 'delete'})
      this.$message.success('删除成功')
      this.getMenuList()
    },
    handleClose(){
      this.showModal = false
      this.handleReset('dialogForm')
    },
    handleSubmit(){
      this.$refs.dialogForm.validate(async valid => {
        if(valid){
          let { action, menuForm } = this
          let params = { ...menuForm, action}
          await this.$api.menuSubmit(params)
          this.showModal = false
          this.$message.success('操作成功')
          this.handleReset('dialogForm')
          this.getMenuList()
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
