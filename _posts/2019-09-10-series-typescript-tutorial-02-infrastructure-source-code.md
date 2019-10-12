---
layout: post
title:  "Typescript Express #2 Build Infrastructure Source Code"
author: tannguyen
categories: [ NodeJS ]
image: assets/images/post/2019-10/Typescript-Express-2.png
description: "Typescript, Typescript-express, infrastructure source code"
featured: true
hidden: true
---
Đây là phần thứ 2 trong series tìm hiểu Typescript-express

1 [Typescript express #1: Init source code](https://tannguyenit.github.io/series-typescript-tutorial-01/)

2 Typescript Express #2 Build Infrastructure Source Code ( bài này )

Trong bài viết này mình sẽ giới thiệu đến các bạn cấu trúc source code mà mình đã build và cảm thấy nó phù hợp nhất với mình cho đến thời điểm hiện tại, Các bạn có thể tham khảo và có ý kiến gì thì cứ góp ý cho mình nhé. 

Để cho việc coding trở nên thoải mái và dễ dàng hơn thì việc phân chia cấu trúc thư mục một cách hợp lý cũng ảnh hưởng rất nhiều. Cùng mình tìm hiểu nhé !

#### Overview

Cấu trúc folder sẽ giống như này:

```text
.
├── package-lock.json
├── package.json
├── src
│   ├── App.ts
│   ├── Infrastructures
│   │   ├── Constants
│   │   │   └── index.ts
│   │   ├── Contracts
│   │   │   └── ResponseTrait.ts
│   │   ├── Controllers
│   │   │   ├── BaseController.ts
│   │   │   └── index.ts
│   │   ├── Exceptions
│   │   │   ├── HttpException.ts
│   │   │   ├── NotAuthorizationException.ts
│   │   │   ├── NotFoundException.ts
│   │   │   └── index.ts
│   │   ├── Helpers
│   │   │   └── index.ts
│   │   ├── Middlewares
│   │   │   ├── ErrorMiddleware.ts
│   │   │   ├── LoggerMiddleware.ts
│   │   │   └── index.ts
│   │   ├── Repositories
│   │   │   ├── BaseRepository.ts
│   │   │   └── index.ts
│   │   ├── Requests
│   │   │   ├── ValidateRequest.ts
│   │   │   └── index.ts
│   │   ├── Traits
│   │   │   └── ResponseTraits.ts
│   │   └── Utils
│   │       ├── axiosClient.ts
│   │       └── index.ts
│   ├── Routes
│   │   └── index.ts
│   ├── api
│   │   └── Users
│   │       ├── Controllers
│   │       │   └── UserController.ts
│   │       ├── Middlewares
│   │       │   └── UserMiddleware.ts
│   │       ├── Requests
│   │       │   └── UserRequest.ts
│   │       ├── Routes
│   │       │   └── index.ts
│   │       ├── Services
│   │       |   └── UserService.ts
│   │       └── Repository
│   │           └── UserRepository.ts
│   └── index.ts
├── tsconfig.json
└── tslint.json
```

Folder `Infrastructures` chứa những  `Common source code ` hoặc là `Base source code`

Folder `Routes` sẽ là nơi tổng hợp tất cả các `Routing` của ứng dụng.

File `index.ts` là file sẽ chạy khi start app và mình chỉ định nghĩa các port nào cho app

File `App.ts` mình init `express` app và attach các router, middleware...

Folder `api` chứa các `modules` như `Users`, `Auth`, ...
Trong mỗi modules bao gồm các sub folder như:
* Controllers   // Handle request, chúng ta ko xử lý logic tại đây mà sẽ đưa cho `Service` đảm nhận 
* Middlewares   // Có thể viết thêm các middleware dành riêng cho module
* Requests      // Định nghĩa các rule cho việc validate request trước khi vào `Controller`
* Routes        // Khai báo tất cả các router của module
* Services      // Sẽ xử lý phía logic của module
* Repository    // Access vào DB truy vấn data

Trên đây là cách mình tổ chức thư mục cho project, cảm ơn bạn đã đọc bài viết này, và bài tiếp theo sẽ hướng dẫn các bạn implement nó
