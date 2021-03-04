<template>
  <div id="fansEcharts" ref="fans">

  </div>
</template>

<script>
export default {
  name: 'Echarts',
  data () {
    return {
    }
  },
  mounted () {
    this.$chart.line1('fansEcharts')
  }
}
</script>

<style scoped lang="scss">
#fansEcharts{
  width: 600px;
  height: 400px;
  /*background-color: palegoldenrod;*/
}
</style>
