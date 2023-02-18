function deepCopy(config) {
  let newData = {};
  const dataKeys = Object.keys(config);
  dataKeys.forEach(value => {
    const currentValue = config[value];
    // 基本数据类型的值和函数直接赋值拷贝 
    if (typeof currentValue !== "object" || currentValue === null) {
      newData[value] = currentValue;
    } else if (Array.isArray(currentValue)) {
      // 实现数组的深拷贝
      newData[value] = [...currentValue];
    } else if (Object.prototype.toString.call(currentValue) === '[object Object]') {
      // 普通对象则递归赋值
      newData[value] = deepCopy(currentValue);
    }
  });
  return newData;
}

export default deepCopy