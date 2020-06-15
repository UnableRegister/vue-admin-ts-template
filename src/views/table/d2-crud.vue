/*
 * @Author: Wind Rises
 * @Date: 2020-05-27 09:26:34
 * @Last Modified by: Wind Rises
 * @Last Modified time: 2020-06-15 21:02:57
 */
<template>
  <d2-container>
    <d2-crud ref="d2Crud" :columns="columns" :data="data" :options="options" />
  </d2-container>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
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
