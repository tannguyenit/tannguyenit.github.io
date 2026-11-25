---
title: "Request lifecycle"
date: 2019-07-22
description: "Request life cycle"
categories: ["NodeJS"]
image: "/assets/images/post/2019-08-06/request-life-cycle.png"
---

# 🖥️ Từ URL đến Trang Web: Quá Trình Hoạt Động của Trình Duyệt và DNS  

Khi bạn nhập một URL vào trình duyệt (ví dụ: `https://example.com`), rất nhiều quá trình diễn ra phía sau để tải và hiển thị trang web. Bài viết này sẽ giúp bạn hiểu rõ **life cycle** của một yêu cầu từ trình duyệt, cách **DNS hoạt động**, và cách **browser render trang web**.  

---

## 🔍 1️⃣ Browser làm gì khi bạn nhập URL?  
Khi bạn nhập một địa chỉ web vào trình duyệt:  

### ✅ Kiểm tra Cache  
- **Browser cache**: Nếu đã tải trang này trước đó, trình duyệt có thể dùng lại dữ liệu.  
- **DNS cache**: Kiểm tra xem đã có địa chỉ IP của domain hay chưa.  

### ✅ Yêu cầu OS tìm IP của domain  
- Kiểm tra file **`/etc/hosts` (Linux/macOS) hoặc `C:\Windows\System32\drivers\etc\hosts` (Windows)**.  
- Nếu không tìm thấy, OS gửi truy vấn đến **DNS Resolver** (ví dụ: Google DNS `8.8.8.8`).  

---

## 🌍 2️⃣ DNS hoạt động như thế nào?  
Nếu OS không có IP trong cache, nó gửi truy vấn đến **DNS Resolver**. Quy trình tìm IP diễn ra như sau:  

1. **Resolver kiểm tra cache** (nếu có, trả về ngay).  
2. **Nếu không có**, nó truy vấn hệ thống DNS theo thứ tự:  
   - **Root DNS Server** (`.`) → Trỏ đến TLD  
   - **TLD DNS Server** (`.com`) → Trỏ đến Name Server của domain  
   - **Authoritative DNS Server** (ví dụ AWS Route 53) → Trả về IP của website  
3. **Resolver gửi IP về OS, OS gửi lại cho trình duyệt**.  

---

## 🔗 3️⃣ Browser kết nối đến Server  
Sau khi có IP, browser thực hiện:  
- **Mở kết nối TCP/TLS đến server**.  
- Nếu là **HTTPS**, thực hiện **TLS handshake** để mã hóa dữ liệu.  
- Gửi request **`GET / HTTP/1.1`** đến server.  

---

## 📡 4️⃣ Server phản hồi và gửi dữ liệu  
- Server xử lý request và trả về **HTTP Response**.  
- Dữ liệu trả về có thể là **HTML, CSS, JavaScript, JSON, hình ảnh...**.  

---

## 🎨 5️⃣ Browser phân tích và render trang web  
- **Parse HTML** → Tạo **DOM Tree**.  
- **Parse CSS** → Tạo **CSSOM** (CSS Object Model).  
- **Chạy JavaScript**, có thể cập nhật DOM.  
- **Kết hợp DOM + CSSOM → Render Tree → Layout → Paint**.  
- Sử dụng GPU để vẽ trang web.  

---

## ⚡ 6️⃣ Tóm tắt Life Cycle khi gõ URL  
```plaintext
1️⃣ Nhập URL → Browser kiểm tra cache  
2️⃣ Gửi yêu cầu tìm IP đến OS → OS kiểm tra /etc/hosts  
3️⃣ OS gửi truy vấn đến DNS Resolver → Lấy IP từ hệ thống DNS  
4️⃣ Browser mở kết nối TCP/TLS với server  
5️⃣ Gửi HTTP request → Server trả response  
6️⃣ Browser phân tích HTML, CSS, JS → Render trang web  
7️⃣ Hiển thị nội dung trên màn hình  
```