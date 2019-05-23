---
layout: post
title:  "Cài đặt Minikube trên Ubuntu 16.04"
author: tannguyen
categories: [ microservice ]
image: assets/images/post/2019-05-23/minikube.jpeg
description: "Trong bài viết lần này mình sẽ hướng dẫn các bạn cài đặt Minikube trên Ubuntu 16.04"
featured: true
hidden: true
---


## Minikube Installation on Ubuntu 16.04 LTS

Overview:
1. Install hypervisor (Virtualbox)
2. Get and install Kubectl (repositories)
3. Get and install Minikube last version
4. Start and Test Minikube local cluster and expose demo service

### Install VirtualBox hypervisor

Trong bài này mình sẽ giới thiệu các bạn cài đặt VirtualBox 5.2 trên Ubuntu 16.04

#### Step 1 – Prerequsities
Bạn phải đăng nhập vào máy chủ của mình bằng người dùng đặc quyền root hoặc sudo. 
Sau khi đăng nhập vào hệ thống của bạn, hãy cập nhật các gói hiện tại của hệ thống lên phiên bản mới nhất.

```text
sudo apt-get update
sudo apt-get upgrade
```

#### Step 2 – Configure Apt Repository
Bạn import các key public của Oracle vào hệ thống package bằng lệnh sau:

```text
wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -
wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo apt-key add -
```

Bây giờ bạn cần thêm `Oracle VirtualBox PPA` vào hệ thống bằng lệnh sau: 
```text
sudo add-apt-repository "deb http://download.virtualbox.org/virtualbox/debian xenial contrib"
```
Lệnh này sẽ thêm một mục vào cuối file `/etc/apt/source.list`

#### Step 3 – Install Oracle VirtualBox
Sau khi hoàn thành các bước trên, hãy để cài đặt VirtualBox bằng các lệnh sau. 
Nếu bạn đã cài đặt phiên bản VirtualBox cũ hơn, lệnh dưới đây sẽ tự động cập nhật.

```text
sudo apt-get update
sudo apt-get install virtualbox-5.2
```

Đến bước này là bạn đã xong quá trình cài đặt `Virtualbox`
Bạn có thể kiểm tra lại và chạy nó bằng lệnh 
```text
virtualbox
```
[<img src="https://i.ibb.co/w4KnKvC/image.png">](virtualbox)


### Get and install Kubectl
Tiếp theo ta cần cài `Kubectl` để tương tác với `Kubernetes cluster`

```text
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -

sudo touch /etc/apt/sources.list.d/kubernetes.list 

echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update

sudo apt-get install -y kubectl
```

Bạn có thể kiểm tra lại xem bạn đã cài đặt thành công hay chưa bằng cách: 
```text
kubectl version // xem version của kubectl
```

### Install Minikube
Bước này chúng ta download và cài đặt minikube, để chạy `node` trong Kubernetes cluster ở máy của bạn

```text
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
sudo mv -v minikube /usr/local/bin
minikube version // ở đây bạn check luôn phiên bản hiện tại đã cài nhé 
exit
```

### Start Kubernetes Cluster loccally with Minikube
Bạn start minikube bằng lệnh dưới 
```
minkube start
```

Tạo và chạy cụm Kubernetes. Lúc này sẽ download minikube và start nó lên 
[<img src="https://i.ibb.co/KK1FYvH/image.png">](minikube start)

### Test Kubernetes service
Dưới đây là 1 service demo đơn giản, bạn có thể chạy thử để biết được kết quả nhé

```text
 kubectl cluster-info // xem thông tin của cluster
 
 kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080 // khởi tạo 1 pod với port 8080
 kubectl expose deployment hello-minikube --type=NodePort // expose 1 service để có thể truy cập 
 kubectl get services  // xem tất cả service đang chạy
 minikube service hello-minikube --url  // run service `hello-minikube` dưới dạng 1 url 
 minikube dashboard // khởi động dashboard và nó tự mở trên browser 
 kubectl delete service hello-minikube  // Xóa service 
 kubectl delete deployment hello-minikube // Xóa deployment (các pod tạo ở bước 1 )
 minikube stop // Dừng minikube
```

C
