const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./headers')
const {errorHandle,successHandle } = require('./responseHandles')
const todos = []
const requestListener = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk
  })
  if (req.url === '/todos' && req.method === 'GET') {
    successHandle(res,todos)
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if (title !== undefined) {
          const todo = {
            "title": title,
            "id": uuidv4()
          }
          todos.push(todo)
          successHandle(res,todos)
        } else {
          errorHandle(res)
        }
      } catch (err) {
        errorHandle(res)
      }

    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0
    successHandle(res,todos)
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop()
    const index = todos.findIndex(element => element.id === id)
    if (index !== -1) {
      todos.splice(index,1)
      successHandle(res,todos)
    }else{
      errorHandle(res)
    }
  }else if (req.url.startsWith('/todos/') && req.method === 'PATCH'){
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title // 要修改的 TODO
        const id = req.url.split('/').pop() // url 切出最後的id 字串
        const index = todos.findIndex(element => element.id === id) // 比對 url 上的 ID 有沒有在資料裡
        if (title !== undefined && index !== -1) {
          todos[index].title = title
          successHandle(res,todos)
        } else {
          errorHandle(res)
        }
      } catch (err) {
        errorHandle(res)
      }

    })
  }else if ( req.method === 'OPTIONS'){ // 跨網域
    res.writeHead(200, headers);
    res.end()

  }
  else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "false",
      "message": '沒有此路由'
    }))
    res.end()
  }

}
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005)