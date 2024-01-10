import CryptoJS from 'crypto-js'

const MattsPublicKeyString = 'snra6h1yki7fvgzo'
const IVParameter = '46kd4xzguyt1xs3c'
const RecreationPublicKeyString = 'jbb9mn1vbhq1jiz'

/**
 * AES 加密
 * params: 加密参数
 * key: 16 位秘钥
 * iv：16 位秘钥向量
 * * */
export function encryptAES(params: string, key?: string | CryptoJS.lib.WordArray, iv?: CryptoJS.lib.WordArray) {
  params = JSON.stringify(params)
  const data = CryptoJS.enc.Utf8.parse(params)
  key = CryptoJS.enc.Utf8.parse(MattsPublicKeyString)
  iv = CryptoJS.enc.Utf8.parse(IVParameter)

  // 后端采用 CBC/Pkcs7
  let encrypted = CryptoJS.AES.encrypt(data, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })

  return encrypted.toString()
}

/**
 * AES 解密
 * params: 加密参数
 * key: 16 位秘钥
 * iv：16 位秘钥向量
 * * */
export function decryptedAES(
  params: string | CryptoJS.lib.CipherParams,
  key?: string | CryptoJS.lib.WordArray,
  iv?: CryptoJS.lib.WordArray
) {
  key = CryptoJS.enc.Utf8.parse(MattsPublicKeyString)
  iv = CryptoJS.enc.Utf8.parse(IVParameter)

  // 后端采用 CBC/Pkcs7
  let decrypt = CryptoJS.AES.decrypt(params, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

  return decryptedStr.toString()
}

/**
 * 娱乐区 AES 加密 兼容 Safari 采用 base64
 * params: 加密参数
 * key: 16 位秘钥
 * iv：16 位秘钥向量
 */
export function recreationEncryptAES<T>(params: T) {
  // 加密数据
  let encJson = CryptoJS.AES.encrypt(JSON.stringify(params), RecreationPublicKeyString).toString()
  // 对加密数据进行 base64 处理，原理：就是先将字符串转换为 utf8 字符数组，再转换为 base64 数据
  let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))

  return encData
}
