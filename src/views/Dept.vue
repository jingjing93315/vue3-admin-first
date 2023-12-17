<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" ref="queryForm" :model="queryForm" label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{
          children: 'children'
        }"
        style="width: 100%"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          width="width"
          v-bind="item"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog 
      :title="action === 'create' ? '创建部门': '编辑部门'"
      v-model="showModel"
    >
      <el-form
        ref="deptForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            :options="deptList"
            v-model="deptForm.parentId"
            placeholder="请选择部门"
            :props="{ checkStrictly: true, value:'_id', label: 'deptName' }"
            clearable
            :show-all-levels="true"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select v-model="deptForm.userName" placeholder="请选择负责人" @change="handleUser">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" placeholder="请输入邮箱" disabled></el-input>
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
  name: 'Dept',
  data(){
    return {
      queryForm: {
        deptName: ''
      },
      columns: [
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '负责人',
          prop: 'userName'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          formatter(row, column, value){
            return utils.formatDate(new Date(value))
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
      deptList: [],
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      showModel: false,
      action: 'create',
      deptForm: {
        parentId: [null]
      },
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级部门',
            trigger: 'blur'
          }
        ],
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'blur'
          }
        ],
      },
      userList: []
    }
  },
  mounted() {
    this.getDeptList()
    this.getAllUserList()
  },
  methods: {
   async getDeptList(){
      let list = await this.$api.getDeptList(this.queryForm)
      this.deptList = list
    },
    async getAllUserList(){
      let list = await this.$api.userAllList()
      this.userList = list
    },
    handleEdit(row){
      this.action = 'edit'
      this.showModel = true
      this.$nextTick(() => {
        Object.assign(this.deptForm, row)
        const res = this.userList.find(item => {
          return item.userId == row.userId
        })
        this.deptForm.userEmail = res.userEmail
      })

    },
    async handleDelete(_id){
      this.action = 'delete'
      await this.$api.deptOperate({ action: this.action, _id })
      this.$message.success('删除成功')
      this.getDeptList()
    },
    handleOpen(){
      this.showModel = true
      this.action = 'create'
    },
    handleClose(){
      this.showModel = false
      this.handleReset('deptForm')
    },
    handleSubmit(){
      this.$refs.deptForm.validate(async valid => {
        if(valid){
          let params = {...this.deptForm, action: this.action}
          delete params.userEmail
          let res = await this.$api.deptOperate(params)
          if(res){
            this.$message.success('操作成功')
            this.handleClose()
            this.getDeptList()
          }
        }
      })
    },
    handleReset(form){
      this.$refs[form].resetFields()
    },
    handleUser(val){
      const [userId, userName, userEmail] = val.split('/')
      Object.assign(this.deptForm, {
        userId,
        userName,
        userEmail
      })
    }
  }
}
</script>

<style>

</style>
