/*
 * @Author: Wind Rises
 * @Date: 2020-05-24 16:13:27
 * @Last Modified by: Wind Rises
 * @Last Modified time: 2020-06-21 16:14:40
 */
<template>
  <page-container>
    <!-- header -->
    <div slot="header" class="page-header">
      <div class="list-container flex">
        <el-button
          v-for="item in statusList"
          :key="item.status"
          class="list-item fcc"
          :class="{ active: status === item.status }"
          @click="status = item.status"
        >
          <span>{{ item.text }}(</span>
          <span class="num">{{ item.num }}</span>
          <span>)</span>
        </el-button>
      </div>
      <div class="query-form" flex="cross:center">
        <div class="select-wrap-1">
          <el-select
            slot="prepend"
            v-model="inputOption"
            clearable
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in inputOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-wrap">
          <el-input v-model="input" placeholder="请输入" size="small" />
        </div>
        <div class="select-wrap-2" flex="cross:center">
          <div class="order-type">
            订单类型:
          </div>
          <el-select
            slot="prepend"
            v-model="orderType"
            clearable
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in orderTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="date-wrap" flex="cross:center">
          <div class="order-time">
            下单时间:
          </div>
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          />
        </div>

        <el-button type="primary" size="small" @click="query">
          搜索
        </el-button>
        <el-button type="danger" size="small" @click="reset">
          重置
        </el-button>
      </div>
    </div>

    <div class="table-wrap">
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :options="d2crudOptions"
        :data="orderList"
      />
    </div>

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
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>

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
        >添加备注
        </el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <pagination
      slot="footer"
      :page="page.page"
      :limit="page.limit"
      :total="page.total"
      @pagination="onPageChange"
    />
  </page-container>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import PaginationPage from '@/models/page'

@Component
class OrderList extends Vue {
  status = 0 // 查询条件：订单状态
  statusList = [
    {
      status: 0,
      text: '全部订单',
      num: 100
    },
    {
      status: 1,
      text: '待审核',
      num: 100
    },
    {
      status: 2,
      text: '代签收',
      num: 100
    },
    {
      status: 3,
      text: '待验收',
      num: 100
    },
    {
      status: 4,
      text: '已完成',
      num: 100
    },
    {
      status: 5,
      text: '已取消',
      num: 100
    },
    {
      status: 6,
      text: '已关闭',
      num: 100
    },
    {
      status: 7,
      text: '异常订单',
      num: 100
    }
  ]

  inputOptions = [
    {
      value: '1',
      label: '全部'
    },
    {
      value: '2',
      label: '订单ID'
    },
    {
      value: '3',
      label: '用户昵称'
    },
    {
      value: '4',
      label: '手机号'
    },
    {
      value: '5',
      label: '运单号'
    },
    {
      value: '6',
      label: 'ISBN'
    },
    {
      value: '7',
      label: '商品名称'
    }
  ]

  inputOption = ''
  input = ''

  // 订单类型可选值
  orderTypes = [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '漫游鲸-图书'
    },
    {
      value: '2',
      label: '漫游鲸-多品类'
    },
    {
      value: '3',
      label: '京东图书'
    }
  ]

  orderType = '' // 查询条件：订单类型
  daterange = '' // 查询条件：时间区间
  page: PaginationPage = new PaginationPage()

  // d2-crud 列表配置
  columns: any[] = [
    {
      title: '订单ID',
      key: 'id',
      width: '90',
      align: 'center'
    },
    {
      title: '用户昵称',
      key: 'nickname',
      width: '80',
      align: 'center'
    },
    {
      title: '联系电话',
      key: 'phone',
      width: '110',
      align: 'center'
    },
    {
      title: '回收本数',
      key: 'num',
      width: '90',
      align: 'center'
    },
    {
      title: '预估金额',
      key: 'valuation',
      width: '134',
      align: 'center'
    },
    {
      title: '实际支付',
      key: 'pay',
      width: '134',
      align: 'center'
    },
    {
      title: '运单号',
      key: 'express_no',
      width: '111',
      align: 'center'
    },
    {
      title: '订单状态',
      key: 'status',
      width: '80',
      align: 'center',
      component: {
        render: (h: any, scope: any) => {
          return h(
            'div',
            {
              class: {
                'status-wrap': true
              }
            },
            [
              h('span', `${scope.status}`),
              h(
                'span',
                {
                  style: {
                    color: '#FF6600'
                  }
                },
                scope.status_remark
              )
            ]
          )
        }
      }
    },
    {
      title: '下单时间',
      key: 'create_at',
      width: '100',
      align: 'center',
      sortable: true
    },
    {
      title: '预约时间',
      key: 'time',
      width: '100',
      align: 'center',
      sortable: true
    },
    {
      title: '订单类型',
      key: 'order_type',
      width: '100',
      align: 'center'
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center',
      width: '140',
      component: {
        render: (h: any, scope: any) => {
          return h(
            'div',
            {
              class: {
                'item-remark': true
              },
              on: {
                click: () => this.openRemarkDailog(scope.id, 'remark')
              }
            },
            scope.remark
          )
        }
      }
    },
    {
      title: '操作',
      key: 'row_handle',
      align: 'center',
      width: '130',
      component: {
        render: (h: any, scope: any) => {
          const handle = scope.row_handle || []
          return h(
            'div',
            {
              class: {
                'handle-container': true
              }
            },
            handle.map((item: any) => {
              return h(
                'span',
                {
                  class: { close: item === '关闭订单' },
                  on: {
                    click:
                      item === '关闭订单'
                        ? () => this.openRemarkDailog(scope.id, 'close')
                        : () => this.gotoOrder(scope.id)
                  }
                },
                item
              )
            })
          )
        }
      }
    }
  ]

  // d2-crud 配置
  d2crudOptions: any = {
    stripe: true,
    border: true
  }

  // 订单列表
  orderList: any[] = [
    {
      id: '1232415550309376',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309374',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309374',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309376',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309374',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309374',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309376',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309374',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309777',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309666',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309555',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550304444',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309333',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309222',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309111',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309399',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309388',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309377',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309366',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309355',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309344',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
    },
    {
      id: '1232415550309333',
      nickname: '',
      status: '待审核',
      create_at: '2020-05-20 12:34:34',
      time: '2020-05-20 12:10',
      row_handle: ['查看']
    },
    {
      id: '1232415550309322',
      nickname: '',
      status: '异常',
      status_remark: '签收超时',
      create_at: '2020-05-20 13:34:34',
      time: '2020-05-20 12:40',
      row_handle: ['审核', '关闭订单']
    },
    {
      id: '1232415550309311',
      nickname: '陈三',
      status: '异常',
      phone: '17834737384',
      status_remark: '支付超时',
      create_at: '2020-05-20 14:34:34',
      time: '2020-05-20 12:30',
      row_handle: ['查看', '关闭订单'],
      remark: '系统提示：两次提交回收订单时间小于7天'
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

  // 重置搜索条件
  reset() {
    this.status = 0
    this.inputOption = ''
    this.daterange = ''
    this.orderType = ''
    this.page.page = 1
  }

  query() {
    // TODO 查询条件
    // const data = {}
    // this.$http.put('/rms/recycle/order/close', data).then((res) => {
    //   this.page.total = res.total
    // })
  }

  // 处理分页
  onPageChange(page: PaginationPage) {
    this.page.limit = page.limit
    this.page.page = page.page
    this.query()
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

  gotoOrder(id: string) {
    console.log('goto order')
    this.$router.push(`/recycle/order/${id}`)
  }

  openRemarkDailog(id: string, actionType: 'close' | 'remark') {
    this.remark = ''
    this.actionType = actionType
    this.currentOrderId = id
    this.dialogVisible = true
  }

  addRemark() {
    this.dialogVisible = false
    console.log('add remark')
  }
}
export default OrderList
</script>

<style lang='stylus' scoped>
@import './index.styl'
</style>
