<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state" placeholder="请选择状态">
            <el-option label="所有" :value="0"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-add'">新增</el-button>
        <el-button type="danger" @click="handleBatchDelete" v-has="'user-batchDelete'">批量删除</el-button>
      </div>
      <el-table 
        :data="userList" 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop" 
          :label="item.label" 
          :width="item.width"
          :formatter="item.formatter"
         />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button 
            type="primary" 
            size="small"
            @click="handleEdit(scope.row)"
            v-has="'user-edit'"
          >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            v-has="'user-delete'"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
        </el-table-column>
      </el-table>
      <el-pagination 
        class="pagination" 
        background 
        layout="prev, pager, next" 
        :total="pager.total"
        @current-change="handleCurrentChange"
         />
    </div>
    <el-dialog
      title="用户新增"
      v-model="showModal"
      :before-close="handleClose"
    >
      <el-form :model="userForm" ref="dialogForm" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" :disabled="action == 'edit'" />
        </el-form-item>
         <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入邮箱" :disabled="action === 'edit'">
            <template #append>@163.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state" placeholder="请选择">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple>
            <el-option 
              v-for="role in roleList" 
              :key="role._id" 
              :value="role._id"
              :label="role.roleName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            :options="deptList"
            v-model="userForm.deptId"
            placeholder="请选择部门"
            :props="{ checkStrictly: true, value:'_id', label: 'deptName' }"
            clearable
            >
          </el-cascader>
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
import { onMounted, reactive, ref, getCurrentInstance, toRaw } from 'vue'
import utils from '../utils/utils'
export default {
  name: 'User',
  setup(){
    //获取全局对象，类似于options api中的this
    const { proxy } = getCurrentInstance()
    // 生命周期数据
    onMounted(() => {
      getUserList()
      getRoleList()
      getDeptList()
    })
    // 查找的数据
    const user = reactive({
      state: 1
    }) // 引用数据类型 
    const userList = ref([])
    // 表格列表配置
    const columns = reactive([
      {
       label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter (row,column, value){
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter (row,column, value){
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime',
        formatter(row, column, value){
          return utils.formatDate(new Date(value))
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        formatter(row, column, value){
          return utils.formatDate(new Date(value))
        }
      }
    ])
    // 分页配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10
    })
    // 用户列表
    const getUserList = async() => {
      let params = {
        ...user,
        ...pager
      }
      const { page, list } = await proxy.$api.userList(params)
      pager.total = page.total
      userList.value = list
    }
    // 查找
    const handleQuery = () => {
      getUserList()
    }
    // 查找重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 分页交互
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 用户单个删除
    const handleDelete = async(row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId]
      })
      if(res.modifiedCount > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.error('删除失败')
      }
    }

    const checkedUsersIds = ref([])
    // 用户批量删除
    const handleBatchDelete = async () => {
      if(checkedUsersIds.value.length === 0){
        proxy.$message.error('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.userDelete({
        userIds: checkedUsersIds.value
      })
      if(res.modifiedCount > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.error('删除失败')

      }
    }

    const handleSelectionChange = (list) => {
      let arr = []
      list.forEach(ele => {
        arr.push(ele.userId)
      })
      checkedUsersIds.value = arr
    }

    const showModal = ref(false)

    const handleCreate = () => {
      action.value = 'add'
      showModal.value = true
    }

    const userForm = reactive({
      state: 1
    })

    const rules = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: '请输入正确的手机格式',
          trigger: 'blur'
        }
      ]
    })

    const roleList = ref([])
    const getRoleList = async() => {
      const res = await proxy.$api.getRoleAllList()
      roleList.value = res.list
    }
    const deptList = ref([])
    const getDeptList = async() => {
      const res = await proxy.$api.getDeptList()
      deptList.value = res
    }

    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    const action = ref('add')
    const handleSubmit =() => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if(valid) {
          let params = toRaw(userForm)
          params.userEmail += '@163.com'
          params.action = action.value
          let res = await proxy.$api.userSubmit(params)
          if(res) {
            showModal.value = false
            if(action.value === 'add') {
              proxy.$message.success('新增用户成功')
            } else {
              proxy.$message.success('编辑用户成功')
            }
            handleReset('dialogForm')
            getUserList()
          }
        }
      })
    }

    const handleEdit =(row)=> {
      action.value = 'edit'
      showModal.value = true
      proxy.$nextTick(() => {
        // row.state = Number(row.state)
        row.state -= 0
        Object.assign(userForm, row)
      })
    }
    return {
      user,
      pager,
      userList,
      columns,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handleBatchDelete,
      checkedUsersIds,
      handleSelectionChange,
      showModal,
      handleCreate,
      userForm,
      rules,
      roleList,
      deptList,
      handleClose,
      handleSubmit,
      handleEdit,
      action
    }
  }

}
</script>

<style lang="scss">

</style>
