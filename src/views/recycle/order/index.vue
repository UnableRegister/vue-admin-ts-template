/*
 * @Author: Wind Rises
 * @Date: 2020-06-15 20:40:31
 * @Last Modified by: Wind Rises
 * @Last Modified time: 2020-06-21 17:43:29
 */
<template>
  <page-container>
    <div class="page-content">
      <!-- 状态 -->
      <div class="step-container">
        <el-steps
          :active="stepActive"
          align-center
          finish-status="success"
          process-status="error"
        >
          <el-step
            v-for="(step, index) in steps"
            :key="index"
            :title="step.title"
            :description="step.description"
          />
        </el-steps>
      </div>
      <div class="order-status-container">
        <div class="order-status">
          订单当前状态:待取件
        </div>
        <div class="btn-container">
          <el-button
            type="danger"
            size="small"
            @click="openRemarkDailog('delete')"
          >
            关闭订单
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="openRemarkDailog('remark')"
          >
            备注订单
          </el-button>
        </div>
      </div>

      <!-- 基本信息 -->
      <section>
        <div class="title">
          基本信息
        </div>
        <div class="baseinfo-table">
          <div class="table-header flex">
            <div
              v-for="key in Object.keys(baseinfo)"
              :key="key"
              class="cell f-c-c"
            >
              {{ getBaseTableHeader(key) }}
            </div>
          </div>
          <div class="table-content flex">
            <div
              v-for="key in Object.keys(baseinfo)"
              :key="key"
              class="cell f-c-c"
            >
              <span>{{ baseinfo[key] }}</span>
            </div>
          </div>
        </div>
        <div class="user-table">
          <div class="table-header flex">
            <div
              v-for="key in Object.keys(user)"
              :key="key"
              class="cell f-c-c"
              :class="{ address: key === 'address' }"
            >
              {{ getUserTableHeader(key) }}
            </div>
          </div>
          <div class="table-content flex">
            <div
              v-for="key in Object.keys(user)"
              :key="key"
              class="cell f-c-c"
              :class="{ address: key === 'address' }"
            >
              <span>{{ user[key] }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 物流信息 -->
      <section>
        <div class="title">
          物流信息
        </div>
        <div class="express-table">
          <div class="table-header flex">
            <div
              v-for="key in Object.keys(express)"
              :key="key"
              class="cell f-c-c"
            >
              {{ getExpressTableHeader(key) }}
            </div>
          </div>
          <div class="table-content flex">
            <div
              v-for="key in Object.keys(express)"
              :key="key"
              class="cell f-c-c"
            >
              <span>{{ express[key] }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 商品信息 -->
      <section>
        <div class="title">
          商品信息
        </div>
        <d2-crud
          ref="d2Crud"
          :columns="goodsColumns"
          :options="d2crudOptions"
          :data="goodsList"
        />
      </section>
      <!-- 商品信息--人工审核 -->
      <section>
        <div class="title">
          商品信息--人工审核
        </div>
        <d2-crud
          ref="d2Crud"
          :columns="checkTableColumns"
          :options="d2crudOptions"
          :data="goodsList"
        />
      </section>

      <!-- 商品信息--自动审核 -->
      <section>
        <div class="title">
          商品信息--自动审核
        </div>
        <d2-crud
          ref="d2Crud"
          :columns="autoTableColumns"
          :options="d2crudOptions"
          :data="goodsList"
        />
      </section>

      <!-- 日志信息 -->
      <section>
        <div class="title">
          日志信息
        </div>
        <d2-crud
          ref="d2Crud"
          :columns="logColumns"
          :options="d2crudOptions"
          :data="logList"
        />
      </section>

      <el-dialog
        :title="actionType === 'close' ? '订单备注' : '关闭订单'"
        :visible.sync="dialogVisible"
        width="420px"
      >
        <div class="dialog-content">
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in remarkList"
              :key="index"
              :timestamp="activity.timestamp"
              placement="top"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
          <el-divider />
          <el-input
            v-model="remark"
            type="textarea"
            placeholder="请输入备注内容"
            maxlength="100"
            rows="5"
            show-word-limit
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            @click="dialogVisible = false"
          >取 消</el-button>

          <el-button
            v-if="actionType === 'close'"
            type="danger"
            size="small"
            :disabled="!Boolean(remark.trim().length)"
            @click="closeOrder"
          >关闭订单
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            :disabled="!Boolean(remark.trim().length)"
            @click="addRemark"
          >添加备注</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- footer -->
    <div slot="footer" class="page-footer">
      <div class="table-header flex">
        <div v-for="key in Object.keys(result)" :key="key" class="cell f-c-c">
          {{ getResultTableHeader(key) }}
        </div>
      </div>
      <div class="table-content flex">
        <div v-for="key in Object.keys(result)" :key="key" class="cell f-c-c">
          <div v-if="key === 'reject_reason_sys'">
            <el-select
              v-model="result.reject_reason_sys"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in sysReasonOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-else-if="key === 'reject_reason_user'">
            <el-select
              v-model="result.reject_reason_user"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in userReasonOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-else-if="key === 'handle'" class="handle-wrap">
            <span @click="pass">订单通过</span>
            <span class="close" @click="reject">订单不通过</span>
          </div>
          <span v-else>{{ result[key] }}</span>
        </div>
      </div>
    </div>
  </page-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
class Order extends Vue {
  stepActive = 3
  steps: any[] = [
    {
      title: '提交订单',
      description: '2020-01-02 12:23:34'
    },
    {
      title: '订单审核',
      description: '2020-01-02 12:23:34'
    },
    {
      title: '快递取件',
      description: '2020-01-02 12:23:34'
    },
    {
      title: '包裹签收',
      description: '2020-01-02 12:23:34'
    },
    {
      title: '包裹验收',
      description: ''
    },
    {
      title: '订单完成',
      description: ''
    }
  ]

  // d2-crud样式配置
  d2crudOptions: any = {
    stripe: true,
    border: true
  }

  // 订单审核结果
  result = {
    total: 32,
    pass: 30,
    pending: 4,
    income: '230书费+50元',
    user_limit: '新用户-120',
    reject_reason_sys: '',
    reject_reason_user: '',
    handle: ''
  }

  // 物流信息
  express = {
    id: '',
    no: '',
    company: '',
    name: '',
    phone: '',
    handle: ''
  }

  // 订单基本信息
  baseinfo = {
    id: '', // 订单 ID
    ceated_at: '', // 下单时间
    time: '', // 预约取件时间
    num: '', // 图书数量
    income: '', // 预计收入
    order_type: '' // 订单类型
  }

  // 收件人信息
  user = {
    name: '',
    phone: '',
    address: ''
  }

  // 商品表格列表配置
  goodsColumns: any[] = [
    {
      title: '商品名称',
      key: 'name',
      width: '120',
      align: 'center'
    },
    {
      title: '图片',
      key: 'image',
      width: '100',
      align: 'center'
    },
    {
      title: 'ISBN',
      key: 'isbn',
      width: '139',
      align: 'center'
    },
    {
      title: 'R值',
      key: 'r_value',
      width: '80',
      align: 'center',
      component: {
        render: (h: any, scope: any) => {
          return h('span', scope.r_value)
        }
      }
    },
    {
      title: '原价',
      key: 'origin_price',
      width: '80',
      align: 'center'
    },
    {
      title: '预计收益',
      key: 'pre_income',
      width: '140',
      align: 'center'
    },
    {
      title: '实际收益',
      key: ' income',
      width: '140',
      align: 'center'
    },
    {
      title: '审核状态',
      key: 'audit_status',
      width: '120',
      align: 'center',
      component: {
        render: (h: any, scope: any) => {
          return h('span', scope.r_value)
        }
      }
    },
    {
      title: '验收状态',
      key: 'check_status',
      width: '120',
      align: 'center',
      component: {
        render: (h: any, scope: any) => {
          return h('span', scope.r_value)
        }
      }
    },
    {
      title: ' 品相',
      key: 'feature',
      width: '100',
      align: 'center'
    }
  ]

  goodsList: any[] = [
    {
      r_value: 89.8,
      name: '沧海变'
    }
  ]

  // 人工审核表格列表配置
  checkTableColumns: any[] = [
    {
      title: '商品名称',
      key: 'name',
      width: '160',
      align: 'center'
    },
    {
      title: '图片',
      key: 'image',
      width: '110',
      align: 'center'
    },
    {
      title: 'ISBN',
      key: 'type',
      width: '140',
      align: 'center'
    },
    {
      title: 'R值',
      key: 'result',
      width: '100',
      align: 'center'
    },
    {
      title: '原价',
      key: 'remark',
      width: '100',
      align: 'center'
    },
    {
      title: '预计书费',
      key: 'result',
      width: '100',
      align: 'center'
    },
    {
      title: '预计现金',
      key: 'remark',
      width: '100',
      align: 'center'
    },
    {
      title: '审核',
      key: 'result',
      width: '80',
      align: 'center'
    },
    {
      title: '操作',
      key: 'handle',
      width: '249',
      align: 'center'
    }
  ]

  // 自动审核表格列表配置
  autoTableColumns: any[] = [
    {
      title: '商品名称',
      key: 'name',
      width: '160',
      align: 'center'
    },
    {
      title: '图片',
      key: 'image',
      width: '110',
      align: 'center'
    },
    {
      title: 'ISBN',
      key: 'type',
      width: '140',
      align: 'center'
    },
    {
      title: 'R值',
      key: 'result',
      width: '100',
      align: 'center'
    },
    {
      title: '原价',
      key: 'remark',
      width: '100',
      align: 'center'
    },
    {
      title: '预计书费',
      key: 'result',
      width: '100',
      align: 'center'
    },
    {
      title: '预计现金',
      key: 'remark',
      width: '100',
      align: 'center'
    },
    {
      title: '审核',
      key: 'result',
      width: '80',
      align: 'center'
    },
    {
      title: '操作',
      key: 'handle',
      width: '249',
      align: 'center'
    }
  ]

  // 日志表格列表配置
  logColumns: any[] = [
    {
      title: '操作者',
      key: 'name',
      width: '150',
      align: 'center'
    },
    {
      title: '时间',
      key: 'create_at',
      width: '190',
      align: 'center'
    },
    {
      title: '类型',
      key: 'type',
      width: '150',
      align: 'center'
    },
    {
      title: '执行结果',
      key: 'result',
      width: '150',
      align: 'center'
    },
    {
      title: '备注',
      key: 'remark',
      width: '499',
      align: 'center'
    }
  ]

  logList: any[] = [
    {
      name: '蚩尤龟'
    }
  ]

  remarkList: any[] = [
    {
      content: '活动按期开始',
      timestamp: '2018-04-15'
    },
    {
      content: '通过审核',
      timestamp: '2018-04-13'
    },
    {
      content: '创建成功',
      timestamp: '2018-04-11'
    }
  ]

  remark = '' // 备注信息
  dialogVisible = false // dialog是否可见
  currentOrderId = '' // 当前操作的订单 ID
  actionType: 'close' | 'remark' = 'remark' // Dialog 操作类型

  // 审核不通过系统信息
  sysReasonOptions: any[] = [
    {
      value: '教辅书籍过多',
      label: '教辅书籍过多'
    },
    {
      value: '工具书或专业性书籍太多',
      label: '工具书或专业性书籍太多'
    },
    {
      value: '书籍内容太过老旧或内容较差',
      label: '书籍内容太过老旧或内容较差'
    },
    {
      value: '书籍资料太少',
      label: '书籍资料太少'
    },
    {
      value: '疑似盗版书籍',
      label: '疑似盗版书籍'
    }
  ]

  // 审核不通过用户原因
  userReasonOptions: any[] = [
    {
      value: '书籍流转率较低，暂不支持回收',
      label: '书籍流转率较低，暂不支持回收'
    },
    {
      value: '书籍为原版书，转换人民币价格后不满足回收条件，请重新下单',
      label: '书籍为原版书，转换人民币价格后不满足回收条件，请重新下单'
    },
    {
      value: '书籍暂不支持回收，具体情况可咨询客服',
      label: '书籍暂不支持回收，具体情况可咨询客服'
    },
    {
      value: '部分教材教辅暂不支持回收，请提交其他书籍',
      label: '部分教材教辅暂不支持回收，请提交其他书籍'
    },
    {
      value: '部分杂志、期刊暂不支持回收，请提交其他书籍',
      label: '部分杂志、期刊暂不支持回收，请提交其他书籍'
    },
    {
      value: '商品暂不支持回收，具体情况可咨询客服',
      label: '商品暂不支持回收，具体情况可咨询客服'
    },
    {
      value: '商品定价较高，建议重新定价再提交哦',
      label: '商品定价较高，建议重新定价再提交哦'
    },
    {
      value: '商品有明显污渍、破损、泛黄、毛边',
      label: '商品有明显污渍、破损、泛黄、毛边'
    },
    {
      value: '新品有使用痕迹',
      label: '新品有使用痕迹'
    },
    {
      value: '订单金额未达到回收门槛，请继续添加',
      label: '订单金额未达到回收门槛，请继续添加'
    }
  ]

  getResultTableHeader(key: string) {
    const map: any = {
      total: '提交本数',
      pass: '通过本数',
      pending: '待审核本数',
      income: '预计收入',
      user_limit: '用户状态-门槛',
      reject_reason_sys: '不通过原因(系统)',
      reject_reason_user: '不通过原因(用户)',
      handle: '操作'
    }
    return map[key]
  }

  getExpressTableHeader(key: string) {
    const map: any = {
      id: '物流信息 ID',
      no: ' 运单号',
      company: '快递公司',
      name: '揽件员信息',
      phone: '揽件员电话',
      handle: '操作'
    }
    return map[key]
  }

  getBaseTableHeader(key: string) {
    const map: any = {
      id: '订单ID',
      ceated_at: '下单时间',
      time: '预约取件时间',
      num: '图书数量',
      income: '预计收入',
      order_type: '订单类型'
    }
    return map[key]
  }

  getUserTableHeader(key: string) {
    const map: any = {
      name: '用户名',
      phone: '联系电话',
      address: '取件地址'
    }
    return map[key]
  }

  // 审核通过
  pass() {
    console.log('pass')
  }

  // 审核不通过
  reject() {
    console.log('reject')
  }

  openRemarkDailog(actionType: 'close' | 'remark') {
    this.remark = ''
    this.actionType = actionType
    this.dialogVisible = true
  }

  addRemark() {
    this.dialogVisible = false
    console.log('add remark')
  }

  closeOrder() {
    this.dialogVisible = false
    // TODO API
    // this.$http
    //   .put('/rms/recycle/order/close', {
    //     id: this.currentOrderId,
    //     reason: this.remark
    //   })
    //   .then(() => {
    //     this.$message.success('订单关闭成功！')
    //   })
  }
}
export default Order
</script>

    <style lang="stylus" scoped>
    @import './index.styl'
</style>
