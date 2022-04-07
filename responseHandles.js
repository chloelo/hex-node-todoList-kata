const headers = require('./headers')
const errorHandle = (res) => {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": '欄位未填寫正確，或無此 uuid'
  }))
  res.end()
}
const successHandle = (res,todos) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    "status": "success",
    "data": todos
  }))
  res.end()
}
module.exports = {
  errorHandle,
  successHandle
}