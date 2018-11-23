var aes = require('./aes.js');
var md5 = require('./md5.min.js');

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDay(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  return [year, month, day].map(formatNumber).join('-');
}

function formatTime(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [hour, minute, second].map(formatNumber).join(':');
}

function aes_enc(plaintext, key_hexstr_16, iv_hexstr_16, output_base64) {
  var key = aes.CryptoJS.enc.Utf8.parse(key_hexstr_16);
  var iv = aes.CryptoJS.enc.Utf8.parse(iv_hexstr_16);

  var srcs = aes.CryptoJS.enc.Utf8.parse(plaintext);
  var encrypted = aes.CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: aes.CryptoJS.mode.ECB, padding: aes.CryptoJS.pad.Pkcs7 });

  if(output_base64 == 1) {
    return encrypted.toString();
  }
  else {
    return encrypted.ciphertext.toString().toUpperCase();
  }
}

function aes_dec(ciphertext, key_hexstr_16, iv_hexstr_16) {
  var key = aes.CryptoJS.enc.Utf8.parse(key_hexstr_16);
  var iv = aes.CryptoJS.enc.Utf8.parse(iv_hexstr_16);

  var encryptedHexStr = aes.CryptoJS.enc.Hex.parse(ciphertext);
  var srcs = aes.CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = aes.CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: aes.CryptoJS.mode.ECB, padding: aes.CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(aes.CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

module.exports = {
  formatTime: formatTime,
  formatDay: formatDay,
  formatDate: formatDate,
  aes_enc: aes_enc,
  aes_dec: aes_dec,
  md5: md5
}
