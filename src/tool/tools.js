// 添加cookie
export const addCookie = (key, value, day, path, domain) => {
  // 1.处理路径
  const index = window.location.pathname.lastIndexOf('/')
  const currentPath = window.location.pathname.slice(0, index)
  path = path || currentPath
  // 2.处理域名
  domain = domain || document.domain
  // 3.处理时间
  if (!day) {
    document.cookie = key + '=' + value + ';path=' + path + ';domain=' + domain + ';'
  } else {
    const date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = key + '=' + value + ';expires=' + date.toGMTString() + ';path=' + path + ';domain=' + domain + ';'
  }
}
// 获取cookie
export const getCookie = (key) => {
  // console.log(document.cookie);
  // console.log(document.cookie.split(";"));
  const arr = document.cookie.split(';')
  for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i]);
    const temp = arr[i].split('=')
    if (temp[0].trim() === key) {
      return temp[1]
    }
  }
}
// 删除cookie
export const delCookie = (key, path) => {
  addCookie(key, getCookie(key), -1, path)
}
// 阻止事件冒泡
export const stopPropagation = (event) => {
  // 兼容性写法
  if (event.cancelBubble) {
    event.cancelBubble = true
  } else {
    event.stopPropagation()
  }
}
// 获取两个时间的差值
export const formartTime = (time) => {
  // 2.得到两个时间之间的差值(秒)
  const differSecond = time
  // 3.利用相差的总秒数 / 每一天的秒数 = 相差的天数
  let day = Math.floor(differSecond / (60 * 60 * 24))
  day = day >= 10 ? day : '0' + day
  // 4.利用相差的总秒数 / 小时 % 24;
  let hour = Math.floor(differSecond / (60 * 60) % 24)
  hour = hour >= 10 ? hour : '0' + hour
  // 5.利用相差的总秒数 / 分钟 % 60;
  let minute = Math.floor(differSecond / 60 % 60)
  minute = minute >= 10 ? minute : '0' + minute
  // 6.利用相差的总秒数 % 秒数
  let second = Math.floor(differSecond % 60)
  second = second >= 10 ? second : '0' + second
  return {
    day: day,
    hour: hour,
    minute: minute,
    second: second
  }
}
