/*
 * @Author: Wind Rises
 * @Date: 2020-06-15 21:26:04
 * @Last Modified by: Wind Rises
 * @Last Modified time: 2020-06-21 17:44:39
 */
<template>
  <div class="page-container">
    <div v-if="$slots.header" ref="header" class="page-container__header">
      <slot name="header" />
    </div>
    <div ref="body" class="page-container__body">
      <slot />
    </div>
    <div v-if="$slots.footer" ref="footer" class="page-container__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { throttle } from 'lodash'

@Component
export default class PageCantainer extends Vue {
  handleScroll: any = null
  scrollDelay = 10

  mounted() {
    // 增加滚动事件监听
    this.addScrollListener()
  }

  beforeDestroy() {
    // 移除滚动事件监听
    this.removeScrollListener()
  }

  // 增加滚动事件监听
  addScrollListener() {
    if (typeof this.handleScroll !== 'function') {
      // mounted 生命周期内调用这个方法的时候会进入这里的判断
      this.handleScroll = this.handleMaker(this.scrollDelay)
    }
    // 添加监听
    const el: any = this.$refs.body
    el.addEventListener('scroll', this.handleScroll)
  }

  // 移除滚动事件监听
  removeScrollListener() {
    const el: any = this.$refs.body
    el.removeEventListener('scroll', this.handleScroll)
  }

  // 外部调用的方法 返回顶部
  scrollToTop() {
    const smoothscroll = () => {
      const el: any = this.$refs.body
      const currentScroll = el.scrollTop
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll)
        el.scrollTo(0, currentScroll - currentScroll / 5)
      }
    }
    smoothscroll()
  }

  // 生成滚动事件的 handler
  handleMaker(wait: number) {
    return throttle((e) => {
      this.$emit('scroll', {
        x: e.target.scrollLeft,
        y: e.target.scrollTop
      })
    }, wait)
  }
}
</script>

<style lang='scss' scoped>
.page-container {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .page-container__header {
    padding: 20px;
  }
  .page-container__body {
    flex-grow: 1;
    padding: 20px 20px;
    overflow: auto;
    position: relative;
  }
  .page-container__footer {
    padding: 20px;
  }
}
</style>
