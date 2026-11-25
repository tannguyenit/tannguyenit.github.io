---
title: "Redis: 1. Redis overview"
date: 2025-03-15
description: "Redis"
categories: ["redis"]
image: "/assets/images/post/2025/redis.png"
series: redis
seriesOrder: 1
---

## Đặt vấn đề

Trong quá trình phát triển hệ thống, chúng ta thường gặp nhiều vấn đề liên quan đến hiệu suất, xử lý dữ liệu nhanh chóng và tối ưu tài nguyên. Trước khi Redis ra đời, nhiều bài toán phải được xử lý bằng cách truy vấn database truyền thống, gây chậm chạp và tiêu tốn nhiều tài nguyên. Vậy Redis giúp gì trong những tình huống này?

---

## **1. Những Bài Toán Trước Khi Redis Xuất Hiện**

### **1.1. Quản Lý Session Người Dùng**
**Vấn đề**:  
- Mỗi khi người dùng đăng nhập, hệ thống cần lưu session.  
- Nếu session lưu trong database, mỗi lần request phải kiểm tra DB, gây tải nặng.  
- Cần một cách nhanh hơn để truy xuất session.  

**Giải pháp trước Redis**:  
- Lưu session trong MySQL/PostgreSQL.  
- Caching session bằng file hệ thống hoặc Memcached.  

---

### **1.2. Xử Lý Hàng Đợi Công Việc (Job Queue)**
**Vấn đề**:  
- Khi hệ thống cần xử lý nhiều công việc (gửi email, xử lý dữ liệu), nếu thực hiện đồng bộ sẽ gây nghẽn.  
- Nếu dùng cơ sở dữ liệu để lưu danh sách công việc, sẽ tốn tài nguyên và truy vấn chậm.  

**Giải pháp trước Redis**:
- Lưu danh sách công việc trong MySQL nhưng phức tạp khi triển khai.  

---

### **1.3. Lưu Trữ Bảng Xếp Hạng (Leaderboard)**
**Vấn đề**:  
- Game hoặc ứng dụng thường có bảng xếp hạng theo điểm số.  
- Nếu lưu vào database, việc truy vấn lấy top 10 sẽ tốn kém tài nguyên.  

**Giải pháp trước Redis**:  
- Dùng SQL với `ORDER BY` và `LIMIT`, nhưng hiệu suất kém khi số lượng bản ghi lớn.  

---

### **1.4. Caching Dữ Liệu**
**Vấn đề**:
- Hệ thống có nhiều request giống nhau, ví dụ API lấy danh sách sản phẩm.  
- Mỗi lần request đều phải truy vấn database, gây tải lớn.  

**Giải pháp trước Redis**:  
- Sử dụng Memcached để cache dữ liệu, nhưng thiếu hỗ trợ TTL linh hoạt và không có cấu trúc dữ liệu phong phú.  

---

## **2. Redis Ra Đời Và Giải Quyết Vấn Đề Như Thế Nào?**

### **2.1. Quản Lý Session Hiệu Quả**
Redis giúp lưu session với thời gian sống (TTL), giúp truy xuất nhanh và tự động xoá session khi hết hạn.  
```bash
SETEX session:user123 3600 "valid"
GET session:user123
```

🔥 Lợi ích:
* ✔️ Tốc độ truy xuất nhanh hơn 10-100 lần so với database.
* ✔️ Không cần dọn dẹp session thủ công.

### **2.2. Hệ Thống Hàng Đợi (Job Queue)**
Redis hỗ trợ List để xử lý queue một cách đơn giản.
```bash
LPUSH job_queue "send_email"
BRPOP job_queue 0
```
🔥 Lợi ích:
* ✔️ Không mất job nếu hệ thống crash.
* ✔️ Dễ dàng mở rộng với nhiều worker.

### **2.3. Bảng Xếp Hạng Với Sorted Set**
Redis hỗ trợ Zset giúp lưu bảng xếp hạng tối ưu.
```bash
ZADD leaderboard 100 player1
ZADD leaderboard 200 player2
ZREVRANGE leaderboard 0 9 WITHSCORES
```
🔥 Lợi ích:
* ✔️ Lấy top N chỉ trong mili giây.
* ✔️ Hỗ trợ cập nhật điểm nhanh chóng.

### **2.4. Cache API Hiệu Quả**
Redis giúp cache dữ liệu với TTL để giảm tải cho database.

```bash
SETEX product:123 600 "{'name': 'Laptop', 'price': 1000}"
GET product:123
```

🔥 Lợi ích:
* ✔️ Giảm tải database, tăng tốc độ phản hồi API.
* ✔️ Hỗ trợ TTL để cache tự động hết hạn.

## **3. Vậy Redis Là Gì?**:

Redis (Remote Dictionary Server) là một **cơ sở dữ liệu NoSQL dạng key-value** hoạt động trên bộ nhớ (in-memory). Redis được sử dụng phổ biến để làm **cache**, **message broker**, **queue**, và **cơ sở dữ liệu tạm thời** cho các hệ thống yêu cầu tốc độ truy xuất cao.

### **3.1. Tại Sao Redis Nhanh?**

- **Lưu trữ trên RAM**: Không cần truy cập ổ đĩa như cơ sở dữ liệu truyền thống.
- **Cấu trúc dữ liệu tối ưu**: Hỗ trợ nhiều kiểu dữ liệu khác nhau.
- **Cơ chế single-threaded**: Tránh overhead của xử lý đa luồng.
- **Sử dụng epoll/kqueue**: Giúp tối ưu hiệu suất mạng.

### **3.2 Các Kiểu Dữ Liệu Trong Redis**

Redis không chỉ là một key-value store đơn giản mà còn hỗ trợ nhiều kiểu dữ liệu mạnh mẽ:

- **String**: Chuỗi ký tự, có thể lưu JSON, số, hoặc binary.
- **List**: Danh sách các phần tử theo thứ tự chèn vào.
- **Set**: Tập hợp không trùng lặp.
- **Sorted Set (Zset)**: Tập hợp có trọng số, hỗ trợ sắp xếp.
- **Hash**: Key-value dạng bảng băm.
- **Stream**: Cấu trúc dữ liệu cho message queue.

### **3.3. Redis Được Dùng Ở Đâu?**

- **Cache dữ liệu**: Giảm tải cho database SQL.
- **Session store**: Lưu trữ phiên đăng nhập của người dùng.
- **Queue system**: Quản lý hàng đợi công việc (job queue).
- **Real-time analytics**: Đếm số lượt truy cập, tracking hành vi.
- **Message broker**: Hỗ trợ Pub/Sub để gửi tin nhắn giữa các dịch vụ.

## **3.4. So Sánh Redis Với SQL Và NoSQL Khác**

| Đặc điểm  | Redis | SQL (MySQL, PostgreSQL) | NoSQL khác (MongoDB, Cassandra) |
|-----------|-------|--------------------|----------------------|
| **Kiểu lưu trữ** | In-memory | Disk-based | Disk-based |
| **Tốc độ** | Rất nhanh | Trung bình | Nhanh |
| **Hỗ trợ transaction** | Hạn chế | Có | Có (tùy hệ thống) |
| **Cấu trúc dữ liệu** | Key-Value | Bảng (Table) | Document, Column |
| **Trường hợp sử dụng** | Cache, Queue, Realtime | CRUD, transaction | Big Data, Logging |

## 6. Kết Luận

Redis là một công cụ mạnh mẽ và linh hoạt, giúp tối ưu hiệu suất của các hệ thống hiện đại. Tùy vào nhu cầu, bạn có thể sử dụng Redis như một **cache layer**, **message broker**, hoặc thậm chí là một database NoSQL hiệu suất cao. Nếu bạn đang phát triển một hệ thống yêu cầu tốc độ, Redis có thể là một lựa chọn hoàn hảo!
