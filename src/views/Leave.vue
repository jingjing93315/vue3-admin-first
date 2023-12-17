<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审批" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="审批拒绝" :value="3"></el-option>
            <el-option label="审批通过" :value="4"></el-option>
            <el-option label="作废" :value="5"></el-option>
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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table 
        :data="applyList" 
        style="width: 100%"
      >
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
          >查看</el-button
          >
          <el-button
            size="small"
            type="danger"
            >作废</el-button
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
      title="申请休假"
      v-model="showModal"
      width="70%"
      :before-close="handleClose"
    >
      <el-form 
        :model="leaveForm" 
        ref="dialogForm" 
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType" placeholder="请选择">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假日期" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker  
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="请选择开始日期"
                  @change="(val) => handleDateChange('startTime', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker  
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="请选择结束日期"
                  @change="(val) => handleDateChange('endTime', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime" required>
          {{leaveForm.leaveTime}}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input type="textarea" :rows="3" v-model="leaveForm.reasons" placeholder="请输入休假的原因"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose('dialogForm')">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, getCurrentInstance, toRaw } from 'vue'
import utils from '../utils/utils'
export default {
  name: 'Leave',
  setup(){
    //获取全局对象，类似于options api中的this
    const { proxy } = getCurrentInstance()
    // 生命周期函数
    onMounted(() => {
      getApplyList()
    })
    // 查询的条件
    const queryForm = reactive({
      applyState: ''
    }) // 引用数据类型 
    const applyList = ref([])

    const getApplyList = async() => {
      let params = { ...queryForm, ...pager }
      let { list, page } = await proxy.$api.getApplyList(params)
      applyList.value = list
      pager.total = page.total
    }
    // 表格列表配置
    const columns = reactive([
      {
       label: '单号',
        prop: 'orderNo'
      },
      {
        label: '休假时间',
        prop: '',
        formatter(row, column, value){
          return (utils.formatDate(new Date(row.startTime), 'yyyy-MM-dd' + '到' + utils.formatDate(new Date(row.endTime), 'yyyy-MM-dd')))
        }
        // 年月日 - 前端开发自己去处理
      },
      {
        label: '休假时长',
        prop: 'leaveTime'
      },
      {
        label: '休假类型',
        prop: 'applyType',
        formatter (row,column, value){
          // 字典处理
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[value]
        }
      },
      {
        label: '休假原因',
        prop: 'reasons'
      },
      {
        label: '申请时间',
        prop: 'createTime',
        formatter(row, column, value){
          return utils.formatDate(new Date(value))
        }
      },
      {
        label: '审批人',
        prop: 'auditUsers'
      },
          {
        label: '当前审批人',
        prop: 'currentAuditUserName'
      },
      {
        label: '审批状态',
        prop: 'applyType',
        formatter (row, column, value){
          // 字典处理
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废'
          }[value]
        }
      },
    ])
    // 分页配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10
    })
    // 查找
    const handleQuery = () => {
      getUserList()
    }

    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 分页交互
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }

    const action = ref('create')
    const showModal = ref(false)
    const leaveForm = reactive({
      applyType: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reasons: ''
    })
    const rules = reactive({
      startTime: [
        {
          type: 'date',
          required: true,
          message: '请输入开始时间',
          trigger: ['change', 'blur']
        }
      ],
      endTime: [
        {
          type: 'date',
          required: true,
          message: '请输入结束时间',
          trigger: ['change', 'blur']
        }
      ],
      reasons: [
        {
          required: true,
          message: '请输入休息原因',
          trigger: ['change', 'blur']
        }
      ]
    })
    // 申请休假
    const handleApply = () => {
      showModal.value = true
      action.value = 'create'
    }
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    const handleSubmit =() => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if(valid) {
          try {
            let params = { ...leaveForm, action: action.value }
            await proxy.$api.leaveOperate(params)
            proxy.$message.success('创建成功')
            handleClose()
            getApplyList()
          } catch (error) {}
        }
      })
    }
    const handleDateChange = (key, value) => {
      let {startTime, endTime} = leaveForm
      if(!startTime || !endTime) return 
      if(startTime > endTime) {
        proxy.$message.error(`开始日期不能晚于结束日期`)
        leaveForm.leaveTime = '0天'
        leaveForm[key] = ''
      } else {
        leaveForm.leaveTime = (endTime - startTime) / (24 * 60 * 60 *1000) + 1 + '天'
      }
    }
    return {
      queryForm,
      pager,
      showModal,
      applyList,
      columns,
      leaveForm,
      rules,
      action,
      handleQuery,
      handleCurrentChange,
      handleApply,
      handleClose,
      handleSubmit,
      handleDateChange
    }
  }
}
</script>