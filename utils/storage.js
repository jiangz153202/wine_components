/**
 * @todo 小程序设置定时缓存
 */
class storage {
  constructor(props){
    this.props = props || {}
    this.source = wx || this.props.source
  }

  get(key){
    const data = this.source,
          timeout = (data.getStorageSync(`${key}__expires__`) || 0)
    //过期失效
    if(Date.now() >= timeout){
      this.remove(key);
      return;
    }
    const value = data.getStorageSync(key);
    return value;

  }
  // timeout 过期时间 （分钟）
  set(key,value,timeout){
    let data = this.source;
    let _timeout = timeout || 120; 
    data.setStorageSync(key, (value));
    data.setStorageSync(`${key}__expires__`,(Date.now() + 1000 * 60 * _timeout))

    return value;
  }

  remove(key){
    let data = this.source
        data.removeStorageSync(key)
        data.removeStorageSync(`${key}__expires__`)
    return undefined;

  }
}

module.exports = new storage();