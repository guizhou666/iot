import storage from 'store'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
// 深拷贝
export function deepCopy(obj) {
  let result = obj
  if (typeof obj === 'object' && obj !== null) {
    result = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {}
    for (let prop in obj) {
      result[prop] = deepCopy(obj[prop])
    }
  }
  return result
}

/**
 * @description: 平级数据转换为树状数据
 * @param {*}
 * @return {*}
 */
export function toTree(dataSource, parentId = '-1', childKey = 'childList') {
  let tree = []
  dataSource.map(item => {
    if (item.parentId === parentId) {
      item[childKey] = toTree(dataSource, item.id, childKey)
      tree.push(item)
    }
  })
  return tree
}

/**
 * @description: 把要被比较的数据扁平化，并且去掉所有的childList，便于比较
 * @param {*} arr delkey 被比较的数组
 * @return {*}
 */
export function flat(arr, delKey = 'childList') {
  return arr.reduce((prev, current) => {
    prev.push(current)
    if (current[delKey] && current[delKey].length) {
      prev = [...prev, ...flat(current[delKey])]
    }
    delete current[delKey]
    return prev
  }, [])
}




// 过滤checking 是 -1的资源
export const filterChecking = (tree) => {
  const flatTree = flat(deepCopy(tree))
  const checkNode = flatTree.filter(item => item.checking == 1)
  let result = deepCopy(checkNode)
  let checkList = getParent(checkNode, flatTree)
  return toTree(checkList)
}
const getParent = (checkList, tree) => {
  checkList.map(item => {
    // 取出所有的父级节点
    let parent = tree.filter(v => v.id == item.parentId)
    if (parent.length) {
      if (!checkList.includes(parent[0])) {
        // parent[0].
        checkList.push(parent[0])
        getParent(checkList, tree)
      }
    }
  })
  return checkList
}


export function debounce(callback, wait = 1000) {
  var timeId = null;

  // 闭包的应用
  return function () {
    var self = this;
    var args = arguments;
    // 清除可能存在的timeId

    if (timeId !== null) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      // TODO: 必须使用apply或者call,将回调函数的this指向Vue
      callback.apply(self, args);
    }, wait)
  }
}

export function throttle(fn, delay) {

  // 记录上一次函数触发的时间以及定义一个定时器
  var lastTime, timer;
  // 延迟多长时间
  var delay = delay || 2000;
  return function () {
    var args = arguments;
    // 记录当前函数触发的时间
    var nowTime = Date.now();
    if (lastTime && nowTime - lastTime < delay) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        // 记录上一次函数触发的时间
        lastTime = nowTime;
        // 修正this指向问题
        fn.apply(this, args);
      }, delay);
    } else {
      lastTime = nowTime;
      fn.apply(this, args);
    }
  }
}




// 判断对象为空
export const isNull = (obj) => {
  return Object.keys(obj).length == 0
}

// 获取第一个对象
var firstNode
export const getFirst = (list) => {
  firstNode = null
  return map(list)
}

const map = (list) => {
  for (let i = 0; i < list.length; i++) {
    if (firstNode) break
    if (list[i].url && list[i].url !== '/home') {
      firstNode = list[i]
    } else {
      list[i].childList && map(list[i].childList)
    }
  }

  return firstNode
}






// 清除树状结构最后childlist = []
export function clearEmptyChild(array, clearKey) {
  return array.map(item => {
    if (item[clearKey]) {
      if (item[clearKey].length) {
       clearEmptyChild(item[clearKey],clearKey)
       return item
      } else {
        delete item[clearKey]
        return item
      }
    }
  })
}
