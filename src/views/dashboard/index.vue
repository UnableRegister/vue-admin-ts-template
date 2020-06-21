<template>
  <page-container>
    <chart />
  </page-container>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js'
import { Component, Vue } from 'vue-property-decorator'
import Chart from './components/Chart.vue'

@Component({
  name: 'Dashboard',
  components: {
    Chart
  }
})
export default class extends Vue {}
</script>
