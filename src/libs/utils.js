// 获取数据类型
export function getType (item) {
  const reg = /\s[A-Z][a-z]+/g
  return Object.prototype.toString.call(item).match(reg)[0].trim()
}

// 深拷贝
export function deepCopy (obj) {
  if (typeof obj !== 'object') return obj
  if (getType(obj) === 'Array') {
    const temp = []
    obj.forEach(item => {
      temp.push(deepCopy(item))
    })
    return temp
  }
  if (getType(obj) === 'Object') {
    const temp = {}
    Object.keys(obj).forEach(key => {
      temp[key] = deepCopy(obj[key])
    })
    return temp
  }
}
