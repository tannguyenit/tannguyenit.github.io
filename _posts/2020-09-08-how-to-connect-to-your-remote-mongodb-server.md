---
layout: post
title:  "How to connect to your remote mongoDB server"
author: tannguyen
categories: [ server ]
image: assets/images/post/2020-08/mongodb.jpeg
description: "MongoDB, AWS EC2, Connection to mongodb"
---

## Problem

Mình có MongoDB đang chạy trên Ubuntu Server trên Amazon EC2. Sau khi cài đặt xong mình muốn có thể access vào DB từ localhost để test/check DB khi cần thiết. Vậy làm như thế nào ??

## Problem solving

Sau khi tìm hiểu thì mình đã tìm ra cách giải quyết nó, và dưới đây là các step nhé :

### 1 Set up user

Đầu tiên bạn cần `ssh` lên server và truy cập vào mongo shell bằng cách nhập `mongo`. Trong ví dụ này mình sẽ setup 1 user name `tannguyen`, có quyền read & write lên `mongo_db` databse.

```
use mongo_db

db.createUser({
    user: 'tannguyen',
    pwd: 'your_password',
    roles: [{ role: 'readWrite', db:'mongo_db'}]
})
```

### 2. Enable auth and open MongoDB access up to all IPs

Bạn edit file `/etc/mongod.conf`, ở đây mình edit bằng nano

```
sudo nano /etc/mongod.conf
```

Bạn scroll xuống, nhìn thấy dòng `bindIp`, thì mặc định nó sẽ là 127.0.0.1, tức là MongoDB hiện tại chỉ cho phép kết nối từ localhost, vì vậy bạn muốn access từ local thì bạn phải comment đoạn này lại nhé

```
# network interfaces
net:
  port: 27017
#  bindIp: 127.0.0.1  <- comment out this line
```

Và nếu như mình đã cho phép tất cả các nơi đều có thể access vào DB thì bạn cần phải thêm 1 config nữa là chỉ cho phép những user có trong system mới được login.
Bạn scroll xuống dưới 1 tí nữa sẽ thấy đoạn `#security`, và giờ chúng ta sửa thành như này nhé

```
security:
  authorization: 'enabled'
```

### 3 Open port 27017 on your EC2 instance

Chắc các bạn xài EC2 sẽ biết đến `Security Groups` của 1 instance, nếu bên trong bạn listen port `27017` mà bạn không thêm nó vào `Security Groups` thì sẽ không thể nào connect đến được, 

* Vào trang dashboard của EC2: https://console.aws.amazon.com/ec2/
* Đi đến EC2 Instance của bạn và scroll xuống, bạn sẽ thấy 1 cái `Security Groups`
* Click vào `Security Groups` và edit `Inbound` tab
* Chọn `Edit Inbound Rules` và tạo 1 `Custom TCP` cho port `27017` và Source bạn chọn `Anywhere`

### 4. Last step: Restart mongo daemon (mongod)

Đến đây là xong bước config cho MongoDB, bạn chỉ cần restart lại là OK

```
sudo service mongod restart
```
## Check result

Bước này bạn cần test lại xem thử việc mình config nó có thực sự hoạt động tốt hay không bằng cách chạy command dưới:
Giả sử EC2 bạn có IP là: `12.34.56.78`

```
mongo -u tannguyen -p your_password 12.34.56.78/cool_db
```

Nếu báo kết nối success là OK 
Hoặc bạn có thể dùng 1 tool nào khác để test cũng được

Cảm ơn các bạn đã đọc
