---
layout: post
title:  "Một số lỗi thường gặp với authorize Serverless"
author: tannguyen
categories: [ serverless ]
image: assets/images/post/2019-06-16/serverless-custom-auth.png
description: "serverless, serverless custom authorize, authorize in servereless"
---

*Khi bạn build API thì bạn sẽ phải quan tâm đến việc authenticate và authorize, vậy làm sao để dùng 
authenticate và authorize trong serverless*

Trong bài này mình đang dùng serverless để build API cho phía client

### Lambda Authorizer Auth Workflow

![Lambda Authorizer Auth Workflow](https://docs.aws.amazon.com/en_us/apigateway/latest/developerguide/images/custom-auth-workflow.png)

1 : Client send request đến API Gateway, kèm theo `token` hoặc các `parameter`

2: API Gateway check authenticate có được config hay chưa, nếu có thì API Gateway sẽ gọi đến `Lambda functions` 

3: `Lambda functions` check Authenticate. ( get token từ request, kiểm tra DB... )

4: Nếu Bước 3 thành công, `lambda functions` sẽ cấp cho phép truy cập bằng cách trả về 1 `object` có chứa ít nhất 1 `IAM policy` và 1 `định danh` ( `principal identifier` )

5: API Gateway sẽ nhận policy và đánh giá/xem xét nó: 
 * Nếu không được phép truy cập thì API Gateway sẽ trả về mã code HTTP phù hợp (401/403/500)
 * Nếu được phép truy cập thì API sẽ thực thi phương thức. Nếu bạn bật caching trong `authorize caching` thì API Gateway cũng lưu cache lại `policy` đó để  `Lambda authorizer function` không cần phải gọi lại

### Example
#### Create a Token-Based Lambda Authorizer Function

Bài viết này mình sẽ dùng Nodejs 8.10
Dưới đây là đoạn code ví dụ về việc xác thực

```javascript
const jwt = require('jsonwebtoken')

/*
*  Check authorize User permission or role or another thing if you want
*  @return boolean
* */
const authorizeUser = (userScopes, methodArn) => {
  console.log(`authorizeUser ${JSON.stringify(userScopes)} ${methodArn}`)
  // Tại đây bạn có thể kiểm tra permission/ role ...
  return true
}

/*
*  Build IAM Policy of user
*  @return policy object
* */
const buildIAMPolicy = (userId, effect, resource, context = {}) => {
  console.log(`buildIAMPolicy ${userId} ${effect} ${resource}`)
  return {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  }
}

/*
*  Handle authenticate function
* */
module.exports.handler = (event, {}, callback) => {
  const { authorizationToken } = event
  if (!authorizationToken) {
    return callback('authorizationToken not parse from request')
  }

  const tokenParts = authorizationToken.split(' ')
  const token = tokenParts[1]
  if (!(tokenParts[0].toLowerCase() === 'bearer' && token)) {
    return callback('Invalid format for authenticate or token empty')
  }

  try {
    const decoded = jwt.verify(token, Buffer.from(process.env.JWT_SECRET, 'utf-8')) // Verify JWT
    const { user } = decoded // Checks if the user's scopes allow her to call the current endpoint ARN
    const effect = authorizeUser(user.id, event.methodArn) ? 'Allow' : 'Deny'

    // Return an IAM policy document for the current endpoint
    const userId = user.id
    const authorizerContext = { user: JSON.stringify(user) }
    const policyDocument = buildIAMPolicy(userId, effect, event.methodArn, authorizerContext)

    return callback(null, policyDocument)
  } catch (e) {
    return callback('Unauthorized')
  }
}

```

Trong ví dụ này, Khi API nhận được request thì API Gateway sẽ chuyển `token` tới `lambda functions` 
The Lambda authorizer function sẽ hoạt động như sau:

* Nếu `token` có giá trị là `Allow` thì `authorize functions` sẽ trả về 200 OK HTTP và `IAM policy` sẽ giống như đoạn dưới

```javascript
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "execute-api:Invoke",
      "Effect": "Allow",
      "Resource": "arn:aws:execute-api:us-east-1:123456789012:ivdtdhp7b5/ESTestInvoke-stage/GET/"
    }
  ]
}
``` 

* Nếu `token` có giá trị là `Deny` thì `authorize functions` sẽ trả về 403 Forbidden HTTP và `IAM policy` sẽ giống như đoạn dưới
```javascript
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "execute-api:Invoke",
      "Effect": "Deny",
      "Resource": "arn:aws:execute-api:us-east-1:123456789012:ivdtdhp7b5/ESTestInvoke-stage/GET/"
    }
  ]
}
``` 
* Nếu`token` có giá trị là `unauthorized`  thì `authorize functions` sẽ trả về 401 Unauthorized HTTP
* Còn lại nếu token có giá trị khác thì client sẽ nhận được mã lỗi 500

Tới đây là đã xong phần `Custom Authorizer Serverless`, và có một số vấn đề xảy ra khi làm việc với nó như sau:

### “message”: null
>{
   “Message”: “null”
 }

#### Problem
Khi debug với serverless-offline thì thấy ở màn hình console 
```javascript
Serverless: Running Authorization function for get /users (λ: authorize)
authorizationToken not parse from request: Authorization function returned an error response: (λ: authorize)
```

Nhưng khi deploy thì nó không hoạt động

#### Giải pháp
Bạn truy cập vào console của AWS và edit template mặc định của API Gateway

Bạn vào service `Amazon API Gateway` --> `Chọn API của bạn` --> `Chọn mục Gateway Responses`  và bạn cần sửa một số 
thông tin để phù hợp với nhu cầu của bạn. Đối với mình thì mình sửa như hình dưới,  thêm một số `Response Header` ( tránh `CORS` ) và mapping template

![handle 401 message](https://i.ibb.co/JKChNYd/image.png) 

### User is not authorized to access this resource
> {
   “Message”: “User is not authorized to access this resource”
  }
  
#### Problem 
Nguyên nhân là tất cả các API của bạn đề gửi `methodArn` trong `event`  và nó có dạng `arn:aws:execute-api:us-1:text:123/prod/POST/v1/hello`

#### Giải pháp 
Thay vì bạn gửi `event.methodArn` thì bạn nên gửi ký tự `*` 
```javascript
    const policyDocument = buildIAMPolicy(userId, effect, '*', authorizerContext)
```

hoặc 

```javascript
    const methodArn = [
        arn:aws:execute-api:us-1:text:123/prod/POST/v1/hello,
        arn:aws:execute-api:us-1:text:123/prod/GET/v1/hello,
        ...
    ]
    const policyDocument = buildIAMPolicy(userId, effect, methodArn, authorizerContext)
```

Ngoài ra còn một số lỗi về việc deploy, mình sẽ cố gắng chia sẻ lại các lỗi đó trong bài khác, Cảm ơn đã đọc bài 