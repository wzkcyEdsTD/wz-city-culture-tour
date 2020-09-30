/**
 * 返回日期
 * @returns {string}
 */
export function getDate() {
  var myDate = new Date()
  // 获取当前年
  var year = myDate.getFullYear()
  // 获取当前月
  var month = myDate.getMonth() + 1
  // 获取当前日
  var date = myDate.getDate()
  var h = myDate.getHours() // 获取当前小时数(0-23)
  var m = myDate.getMinutes() // 获取当前分钟数(0-59)
  var s = myDate.getSeconds()
  // 获取当前时间
  return year + '-' + conver(month) + '-' + conver(date) + ' ' + conver(h) + ':' + conver(m) + ':' + conver(s)
}

function conver(s) {
  return s < 10 ? '0' + s : s
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
  for (var key in obj) {
    return false// 返回false，不为空对象
  }
  return true// 返回true，为空对象
}

/**
 * 睡觉函数
 * @param func
 * @param delay
 * @returns {function(...[*]=)}
 */
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 生成唯一码UUID
 * @returns {string}
 */
export function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

// 递归用到的变量
let findDataFromTreeLists = []

// 递归的方法
function findDataFromTree(key, value, list) {
  list.filter((item) => {
    if (item[key] === value) {
      findDataFromTreeLists.push(item)
    } else {
      if (item.children && item.children.length) {
        return findDataFromTree(key, value, item.children)
      }
    }
  })
}

/**
 * 递归查找
 * @param key
 * @param value
 * @param list
 * @returns {*}
 */
export function getSpecalNameFromTree(key, value, list) {
  findDataFromTreeLists = []
  findDataFromTree(key, value, list)
  return findDataFromTreeLists && findDataFromTreeLists[0]
}

const appWidth = parseInt(window.getComputedStyle(document.getElementById('app')).width)

/**
 * 计算rem大小
 * @param num
 * @returns {number}
 */
export function getRem(num) {
  let defaultNum = 1
  switch (appWidth) {
    case 1920:
      defaultNum = 100
      break
    case 5760:
      defaultNum = 175
      break
  }
  const res = parseInt(num * defaultNum / 100)
  return res
}

export function parseQueryString(url) {
  var reg_url = /^[^\?]+\?([\w\W]+)$/,
    reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
    arr_url = reg_url.exec(url),
    ret = {};
  if (arr_url && arr_url[1]) {
    var str_para = arr_url[1], result;
    while ((result = reg_para.exec(str_para)) != null) {
      ret[result[1]] = result[2];
    }
  }
  return ret;
}
