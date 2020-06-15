/*
 * @Author: Wind Rises
 * @Date: 2020-06-15 20:36:54
 * @Last Modified by: Wind Rises
 * @Last Modified time: 2020-06-15 22:01:33
 */
<template>
  <PageCantainer>
    <div slot="header" class="header">
      header
    </div>
    <div class="content">
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"
        :options="options"
      />
    </div>
    <div slot="footer" class="header">
      footer
    </div>
  </PageCantainer>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import PageCantainer from '@/components/PageCantainer/index.vue'

@Component({
  components: { PageCantainer }
})
export default class Cls extends Vue {
  columns: any[] = [
    {
      title: '名字',
      key: 'name',
      width: '140'
    },
    {
      title: '名字',
      key: 'age',
      width: '140'
    }
  ]

  data: any[] = [
    {
      name: 'ALI',
      age: 18
    },
    {
      name: 'Hsak',
      age: 48
    }
  ]

  options = {
    border: true
  }
}
</script>

<style lang='scss'>
.order-list {
  height: 100%;
}
</style>
