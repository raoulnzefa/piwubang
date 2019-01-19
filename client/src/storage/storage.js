// 小程序端存储

const CACHE_TIME = 86400000 // 1day

function save(key, data) {
  try {
    wx.setStorageSync(key, {
      t: (+new Date()),
      d: data
    })
  } catch (e) {
    // console.log(`存储失败，原因：${e}`);
    
  }
}

function get(key) {
  const data = wx.getStorageSync(key) || null

  if (data) {
    const tstamp = data.t
    const offset = (+new Date()) - tstamp

    if (offset <= CACHE_TIME) {
      return data.d
    }
  }

  return null
}

function setAuthor(id, val) {
  setOp(`_atr_${id}`, val)
}

function getAuthor(id) {
  return getOp(`_atr_${id}`)
}

export default { save, get }