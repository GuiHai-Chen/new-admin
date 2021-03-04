import echarts from 'echarts'
const install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get () {
        return {
          // 画一条简单的线
          line1: function (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.clear()

            const optionData = {
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '直接访问',
                  type: 'bar',
                  barWidth: '60%',
                  data: [10, 52, 200, 334, 390, 330, 220]
                }
              ]
            }

            this.chart.setOption(optionData)
          }
        }
      }
    }
  })
}

export default {
  install
}
