---
layout: post
title:  "Một số khái niệm trong Docker"
author: tannguyen
categories: [ docker ]
image: assets/images/post/2019-05-23/mot-so-khai-niem-trong-docker.png
description: "Thuật ngữ trong docker, Docker image, docker network"
featured: true
hidden: true
---

### Một số khái niệm trong Docker
* Image: 
 -- Là một khuôn mẫu, lớp chưá các file cần thiết để taọ nên 1 container
 -- Chứa các tài nguyên có sẵn 
 -- Không được tiếp cận vào CPU, memory,storage..
 * Container
 -- Được xem như 1 **Object** tồn tại trên host với một IP có các cổng được expose ra bên ngoài
 -- Được deploy, chạy, xoá bỏ thông qua remote client
 * Docker engine 
 -- Tạo và chạy các container
 -- Chạy các lệnh trong chế độ daemon
 -- Linux trở thành máy chủ Docker
 -- Các Container được deploy, chạy, xoá bỏ thông qua remote client 
 * Docker daemon
 -- Là tiến trình chạy ngầm quản lý các container
 * Docker client
 -- Kiểm soát hầu hết các workflow của Docker
 -- Giao tiếp với các máy chủ của Docker thông qua daemon
 * Docker Hub,
 -- Chứa các component Docker
 -- Lưu, sử dụng, tìm kiếm các image
 
 
 ### Một số lầm tưởng về Docker
 
 Dưới đây là một số lầm tưởng nhiều người hay gặp phải khi liên tưởng Docker với các công nghệ khác trên thị trường
 * **KHÔNG** phải là một công cụ quản lý thiết lập hay thiết lập tự động ( Peppet, chef)
 * **KHÔNG** phải là giải pháp ảo hoá phần cứng (VMWare KVM)
 * **KHÔNG** phải là một nền tảng điện toán đám mây ( OpenStack, CloudStack...)
 * **KHÔNG** phải là một deployment framwork ( Capistrano,Fabric .. dùng để chạy script deploy trên nhiều server khác nhau)
 * **KHÔNG** phải là một công cụ quản lý wokload (Mesos, Fleet...)
 * **KHÔNG** phải là một môi trường phát triển (vagrant)
 
 ### Docker life cycle
 
 <img src="https://i.ibb.co/3yjcMPB/image.png">
  
 ### Cơ chế lưu trữ của Docker
 * Docker sử dụng cơ chế lưu trữ `copy-on-write` - thay vì nói là tôi cần tạo 1 `container` thì sẽ nói 
  là tôi muốn tạo 1 bản sao của một khuôn mẫu có sẵn ( **image** ) bởi vì bản chất là tạo ra 1 container từ 1 bản image gốc,
 * Tạo một hệ thống mới ngay lập tức mà không cần copy tất cả file hệ thống - cứ mỗi khi tạo ra 1 thay đổi trên đó thì thay đổi được ghi lại nhưng ở 1 vùng lưu trữ khác 
 * Hệ thống lưu trữ lại mỗi thay đổi 
 
 ### Chạy các tiến trình trong Container
 
 **docker run**
 
 
 ### Liên kết các container
 
 1 Liên kết thông qua host
  <img src="https://i.ibb.co/MPx2GN0/image.png">
  
  Hướng tiếp cận này như sau, Từ 1 container liên kết đến máy host, host liên kết đến container thứ 2 --> chúng ta liên kết được 2 container với nhau
  bằng cách expose cổng trên mỗi container,
  
  <img src="https://i.ibb.co/QYbvTT4/image.png">
  
 2 Liên kết trực tiếp các container
 
  Tức là liên kết sao cho thông tin được truyền thẳng từ container A đến container B mà không thông qua host
  
  Step: 
   * Đầu tiên chúng ta run 1 container với name = `server`
   * Container server listen port 111
   * Tiếp theo ta cũng run 1 container với name = `client` nhưng thêm 1 param `--link server`
   * Dùng nestcat để ping tới container `server` với port 111 // `nc [name container] port 
   * Container `server` nhận thông tin và hiển thị trên màn hình console
   
  <img src="https://i.ibb.co/yQzQg6N/image.png">
  
  ???? Vậy làm thế nào mà với cái tên `server` mà container client connect được tới container server 
  
  Khi bạn thêm param `--link server` thì nó đã tự thêm 1 line vào file `/etc/hosts`
  Vì chính Docker chạy container server nên nó sẽ biết container server có `IP` là bao nhiêu
  
  Note: 
   * Tự động gán hostname khi container bắt đầu chạy 
   * Liên kết có thể bị đứt nên container `server` khởi động lại --> tính rủi ro khá cao
   
 ### Liên kết động giữa các container
 
  * Docker cung cấp tính năng tạo mạng riêng nội bộ // dễ dàng thêm/xoá các container vào mạng 
  * Name server với cơ chế quản lý `IP & name` // Các container sẽ tìm lẫn nhau qua tên 
  * Cần tạo lập mạng trước rồi chạy các container liên quan
  * Dùng lệnh sau để tạo mạng riêng: ` docker network create [OPTIONS] NETWORK
Ex:

```
docker network create demonetwork

docker run --rm -ti --net=demonetwork --name server ubuntu:14.04 bash // chạy container server nằm trong mạng demonetwork 

nc -l 111
```

```
docker run --rm -ti --link server --net=demonetwork --name client ubuntu:14.04 bash 

nc server 111
```

<img src="https://i.ibb.co/jH7JBW8/image.png">

  
