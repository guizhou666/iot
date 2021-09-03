/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @description: 电话和手机号码
 * @param {*}
 * @return {*}
 */
export function checkPhone(mobile) {
  var tel = /^0\d{2,3}-?\d{7,8}$/
  var phone = /^1[3456789]\d{9}$/
  if (mobile.length == 11) {
    //手机号码
    if (phone.test(mobile)) {
      return true
    }
  } else if (mobile.length == 13 && mobile.indexOf('-') != -1) {
    //电话号码
    if (tel.test(mobile)) {
      return true
    }
  }
  return false
}

export function validatePhone(rule, value, callback) {
  if (value && !checkPhone(value)) {
    callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}

/**
 * @description: 邮箱校验
 * @param {*}
 * @return {*}
 */

function checkMail(mail) {
  if (mail != '') {
    var strRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (!strRegex.test(mail)) {
      return false
    }
  }
  return true
}

export function validateMail(rule, value, callback) {
  if (value && !checkMail(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

/**
 * @description: 校验域名
 * @param {*}
 * @return {*}
 */

export function checkURL(url) {
  //验证一般的域名 比如说 www.baidu.com
  var regStr = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
  if (regStr.test(url)) {
    return true
  }
  return false
}

export function validateUrl(rule, value, callback) {
  if (!checkURL(value)) {
    callback(new Error('请输入正确的url'))
  } else {
    callback()
  }
}

/**
 * @description: 校验重复密码
 * @param {*}
 * @return {*}
 */

// export function validatePassword(psd) {
//   return (rule,value,callback) =>{
//     if(value !== psd) {
//       callback(new Error('请输入正确的密码'))
//     }else {
//       callback()
//     }
//   }
// }

/**
 * @description: 匹配中文
 * @param {*}
 * @return {*}
 */
function checkChinese(word) {
  let strExp = /[\u4e00-\u9fa5]/
  if (strExp.test(word)) {
    return true
  }
  return false
}

export function validateChinese(rule, value, callback) {
  if (!checkChinese(value)) {
    callback(new Error('请输入中文名'))
  } else {
    callback()
  }
}

function checkIdCard(idCard) {
  let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
  // 校验身份证：
  if (_IDRe18.test(idCard) || _IDre15.test(idCard)) {
    return true
  }
  return false
}

export function validateIdCard(rule, value, callback) {
  if (!checkIdCard(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}



// 校验IP
function checkIP(ip) {
  let IP = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
  if (IP.test(ip)) {
    return true
  }
  return false
}

export function validateIP(rule, value, callback) {
  if (!checkIP(value)) {
    callback(new Error('请输入正确的IP地址'))
  } else {
    callback()
  }
}

// 校验IP
function checkPort(port) {
  let Port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  if (Port.test(port)) {
    return true
  }
  return false
}

export function validatePort(rule, value, callback) {
  if (!checkPort(value)) {
    callback(new Error('请输入正确的端口号'))
  } else {
    callback()
  }
}


// 校验二级域名
function checkSubDomain(domain) {
  let subDomain = /^[^\.]+(\.[^\.]+){2}$/
  if (subDomain.test(domain)) {
    return true
  }
  return false
}

export function validateSubDomain(rule, value, callback) {
  if (!checkSubDomain(value)) {
    callback(new Error('请输入正确的二级域名'))
  } else {
    callback()
  }
}



export function validateLenth(length,rule, value, callback) {
  if (value.length > length) {
    callback(new Error('域名长度不超过11位'))
  } else {
    callback()
  }
}
