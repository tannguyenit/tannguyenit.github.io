---
layout: post
title:  "Typescript Express #1 - Init source code"
author: tannguyen
categories: [ NodeJS ]
image: assets/images/post/2019-10/Typescript-Express-1.png
description: "Typescript, Typescript-express"
featured: true
hidden: true
---
Đây là phần thứ 1 trong series tìm hiểu Typescript-express

1 Typescript express: Init source code ( bài này )
2 ...

Đây là series mới, mình sẽ build 1 ứng dụng với `Typescript Express`. Trong loạt bài này mình tập trung chủ yếu về `express framework`, bạn cần có một số kiến thức căn bản về `Typescript` để dễ dàng tiếp cận hơn.

`Express` là một framework của `NodeJS` được sử dụng để build các ứng dụng web. Nó không được đánh giá cao, có nghĩa là bạn có thể sử dụng nó theo cách mà bạn thấy phù hợp. Hoặc bạn có thể tham khảo cách mà mình đang dùng. 

#### Starting up the project

Đầu tiên bạn cần cài đặt những package cần thiết cho project của bạn thông qua `npm`

```javascript
npm init
npm install typescript express ts-node
```

Chúng ta sẽ có 1 file cấu hình `typescript` : `tsconfig.json`

tsconfig.json
```javascript
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist"
  },
  "lib": [
    "es2015"
  ],
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

Để chạy project, bạn cần thêm 1 đoạn script vào file `package.json`

package.json
```javascript
"scripts": {
  "dev": "ts-node ./src/index.ts"
}
```

Đoạn script trên chúng ta khai báo app của chúng ta sẽ start file `index.ts` trong thư mục `src`. Thêm đoạn code dưới vào file `index.ts`

*src/index.ts*
```javascript
import * as express from 'express'
 
const app = express()
 
app.get('/', (request, response) => {
  response.send('Hello world!')
})
 
app.listen(3000)
```

* function `express()` sẽ khởi tạo `Express application` là ứng dụng mà chúng ta sẽ tương tác tới 
* `app.get()` hiểu nôm na là ứng dụng sẽ lắng nghe phương thức `GET` với path `/` thì sẽ trả về client `Hello world!`
* `app.listen(3000)` nói rằng ứng dụng sẽ lắng nghe cổng 3000

Để kiểm tra ứng dụng chúng ta chạy OK hay không thì chúng ta dùng `POSTMAN` để test nhé. 

Trước khi vào `POSTMAN` các bạn chạy app của mình lên bằng lệnh

```javascript
npm run dev
```

#### Routing
> Là cách bạn định nghĩa các end point cho app với các method khác nhau 

Bạn có thể định nghĩa các HTTP request cho app của mình giống như ví dụ ở trên `app.get` hay `app.post`. Bạn cũng có thể dùng một số `method` khác như `GET, POST, PUT, PATCH, DELETE`. Bạn có thể tham khảo thêm [trong document này](https://expressjs.com/en/api.html#app.METHOD)

Ngoài ra, còn một cách nữa để bạn có thể định nghĩa các request là sử dụng `Router` của thèn `express`. Khi bạn khởi tạo `Router` thì bạn có thể dùng các method `get, post, put, patch, delete` giống như thèn `app`

*src/index.ts*
```javascript
import { Router, Response, Request } from 'express'

const router: Router = Router()

router.get('/', (req: Request, res: Response) => res.status(200).send('Hello World!'))
```

Tiếp theo bạn cần nói với thèn `app` sử dụng `router` này cho app của mình.

*src/index.ts*
```javascript
app.use('/', router);
```

Địa chỉ của các `router` là sự kết hợp của các đường dẫn được cung cấp cho `app.use` và `router.METHOD`.

*src/index.ts*
```javascript
router.get('/hello', (req: Request, res: Response) => res.status(200).send('Hello World API!'))
 
app.use('/api', router)
```

Đoạn code này sẽ tạo 1 router mới với path `/api/hello` và response `Hello World API!`

#### Request

> `Request` object chứa thông tin về HTTP request như headers, query và các parameters.

`Request` kế thừa từ class [http.IncomeMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) nên nó sẽ có các fields và method của lớp cha

```javascript
http.IncomingMessage.prototype.isPrototypeOf(request); // true
```

*src/index.ts*
```javascript
router.get('/:param_name', (req: Request, res: Response) => {
  const { headers, url, credentials, method, mode, referrer, baseUrl, params, query, body } = req

  return res.status(200).send({ headers, url, credentials, method, mode, referrer, baseUrl, params, query, body })
})
```

![Request](/assets/images/post/2019-10/request.png)

Chúng ta sẽ tìm hiểu sâu hơn ở các bài tiếp theo

#### Response 
> `Response` object đại diện cho HTTP Response mà ứng dụng sẽ trả về cho client khi nhận được HTTP Request

Response kế thừa từ  class [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse)

```javascript
http.ServerResponse.prototype.isPrototypeOf(response); // true
```

method quan trọng nhất ở đây là `send`. Nó sẽ gửi HTTP response để phía Client có thể nhận được data.
Ngoài method `send` thì còn một số method tương tự để kết thúc 1 request và chúng ta sẽ tìm hiểu nó ở phần tiếp theo

#### Middleware

> `Middleware` có thể truy cập vào `request` object và `response` object. Nó có thể truy cập ở mọi nơi trong `request-response cycle`.

Bạn có thể hình dung `Middleware` nằm ở trung gian `request` và `response` 

![Middleware](/assets/images/post/2019-10/middleware.png)

Tham số thứ 3 trong `middleware` nhận là 1 `next` function. Khi gọi nó thì `middleware` tiếp theo sẽ được thực thi. 
Dưới đây mình sẽ có 1 ví dụ nhỏ về việc sử dụng 1 `middleware` để ghi log lại `method` và `path` của `request`

*src/middleware/loggerMiddleware.ts*
```javascript
import { Request, Response, NextFunction } from 'express'

function loggerMiddleware(request: Request, response: Response, next: NextFunction): void {
  console.log(`${ request.method } ${ request.path }`)
  next()
}

export default loggerMiddleware
```

Tiếp theo bạn thêm đoạn code dưới vào file *src/index.ts*

*src/index.ts*
```javascript
import loggerMiddleware from './middleware/loggerMiddleware'

app.use(loggerMiddleware)
```

Trong ví dụ này, khi có 1 request được gửi đến `/api/hello`, `GET /api/hello` được in ra màn hình console khi app chạy. Thực tế thì khi có bất khì 1 request nào gửi đến app thì trên màn hình console cũng in ra `METHOD PATH`.
Khi gọi tiếp method `next()` thì việc control request sẽ được thực thi tiếp.( có thể là vào 1 controller nào đó hoặc là tiếp đến 1 vài lớp middleware khác - cái này tuỳ thuộc vào yêu cầu của mỗi project mà bạn áp dụng cho phù hợp )

Có rất nhiều `middleware` có sẵn để bạn có thể attach và app của mình và theo mình nghĩ 1 trong số middleware cần thiết là [body-parser](https://www.npmjs.com/package/body-parser).
 Middleware này sẽ parse body của request và gán vào property `body` của request. Nếu không có middleware này thì property `body` của request sẽ ko truy cập được.
Trong ví dụ này mình sẽ dùng middleware `bodyParser.json` để parse `json` data.

```javascript
npm install body-parser
```

*src/index.ts*
```javascript
import * as bodyParser from 'body-parser'

app.use(bodyParser.json())
```

#### Summary

Trong bài viết này, mình đã giới thiệu những cái cơ bản để bắt đầu build RESTfull application với `Typescript Express`. Nó bao gồm init project, việc sử dụng các `router, request, response, middleware `. Mình hi vọng bài viết này sẽ hữu ích với bạn và mình sẽ chia sẻ tiếp trong bài viết tiếp theo. Cảm ơn các bạn đã đọc 
