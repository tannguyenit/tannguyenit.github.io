---
title: "Database research"
date: 2025-03-18
description: "Postgresql, Mysql"
categories: ["database"]
image: "/assets/images/post/2025/mysql-postgresql.png"
---

# Tổng hợp những gì đã tìm hiểu về Database, MySQL, PostgreSQL, Partitioning, Sharding, ProxySQL

## 1. **MySQL vs PostgreSQL** – Chọn cái nào?
### 🔹 **MySQL**
- Dễ dùng, phổ biến, nhiều tài liệu hỗ trợ.
- Hiệu suất cao với workload có nhiều **READ (SELECT)**.
- Không hỗ trợ MVCC hoàn toàn, dễ bị lock khi có nhiều transaction.
- Hỗ trợ replication, nhưng scaling ngang (Sharding) không mạnh như PostgreSQL.

### 🔹 **PostgreSQL**
- Hỗ trợ **ACID** tốt hơn, dùng **MVCC** giúp transaction không bị block.
- Hỗ trợ **JSON, Full-text Search**, partitioning mạnh hơn MySQL.
- Thích hợp cho **OLTP (Online Transaction Processing)** và **phân tích dữ liệu phức tạp**.
- Sharding native chưa mạnh, nhưng có thể kết hợp với Citus để scale tốt hơn.

### **🆚 Các tiêu chí so sánh chi tiết**

| Tiêu chí | MySQL | PostgreSQL |
|---------|------|------------|
| **ACID Compliance** | Có nhưng không mạnh như PostgreSQL | Hỗ trợ ACID hoàn chỉnh |
| **MVCC** | Không hỗ trợ hoàn toàn, dễ bị lock | Hỗ trợ MVCC, tránh block transaction |
| **JSON Support** | Có, nhưng hạn chế hơn | Hỗ trợ JSON mạnh mẽ hơn |
| **Partitioning** | Có nhưng khó dùng hơn | Hỗ trợ declarative partitioning |
| **Replication** | Hỗ trợ master-slave, không có built-in logical replication | Hỗ trợ replication mạnh hơn, logical replication tốt |
| **Sharding** | Không hỗ trợ native, cần ProxySQL hoặc Vitess | Hỗ trợ qua Citus, mạnh hơn |
| **Full-text Search** | Cơ bản | Tốt hơn nhiều |
| **Concurrency Handling** | Dễ bị lock | Ít lock hơn nhờ MVCC |
| **CTE (Common Table Expression)** | Hỗ trợ hạn chế | Hỗ trợ mạnh, có thể đệ quy |

➡ **Tóm lại:** Nếu cần hiệu suất cao với query đơn giản → MySQL. Nếu cần transaction mạnh mẽ, xử lý dữ liệu phức tạp → PostgreSQL.

---
## 2. **Partitioning trong Database**
Partitioning giúp chia nhỏ bảng lớn thành nhiều phần nhỏ, giúp **tăng tốc query** và **quản lý dữ liệu dễ dàng hơn**.

### 🔹 **Partitioning trong MySQL**
- Hỗ trợ **RANGE, LIST, HASH, KEY Partitioning**.
- Dữ liệu được lưu trên cùng một server, không hỗ trợ scale-out.
- Ví dụ tạo partition theo năm:

```sql
CREATE TABLE orders (
    id INT NOT NULL,
    order_date DATE NOT NULL,
    amount DECIMAL(10,2),
    PRIMARY KEY (id, order_date)
)
PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2023 VALUES LESS THAN (2023),
    PARTITION p2024 VALUES LESS THAN (2024)
);
```

### 🔹 **Partitioning trong PostgreSQL**

- PostgreSQL hỗ trợ **Declarative Partitioning**, dễ dùng hơn MySQL.
- Partition key **phải nằm trong PRIMARY KEY**.
- Ví dụ tạo partition theo tháng:

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2024_01 PARTITION OF orders 
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

➡ **Tóm lại:** PostgreSQL hỗ trợ partitioning dễ dùng hơn, nhưng MySQL cũng có thể làm được.

---
## 3. **Sharding – Chia Database để Scale**
Sharding giúp chia database thành nhiều phần nhỏ **để giảm tải cho một server duy nhất**.

### 🔹 **Sharding có gì khác Partitioning?**

| Tiêu chí | Partitioning | Sharding |
|---------|-------------|----------|
| **Mục đích** | Tăng tốc truy vấn trong một server | Scale database ngang bằng nhiều server |
| **Cách hoạt động** | Chia nhỏ bảng trong **cùng một DB** | Chia database thành nhiều DB nhỏ |
| **Quản lý** | Cơ sở dữ liệu vẫn nằm trên một máy chủ | Backend phải tự connect đến đúng shard |

### 🔹 **Ví dụ về Sharding**

- User có `user_id MOD 2 = 0` vào **shard 1**, còn `user_id MOD 2 = 1` vào **shard 2**.
- Ứng dụng backend phải quyết định kết nối vào database nào.

```js
const userId = 123;
const shard = userId % 2 === 0 ? 'shard1' : 'shard2';
connectToDB(shard).query('SELECT * FROM users WHERE id = ?', [userId]);
```

### 🔹 **ProxySQL trong Sharding**
- ProxySQL có thể giúp **backend không cần tự quyết định shard nào**, chỉ cần kết nối vào ProxySQL và nó sẽ xử lý routing.
- Dùng **mysql_query_rules** để route query đến đúng shard.

➡ **Tóm lại:** Partitioning giúp tối ưu query, còn Sharding giúp scale-out database.

---

### 3.1. **ProxySQL – Load Balancer cho MySQL**
ProxySQL giúp **cân bằng tải, route query, cache, và tối ưu query** cho MySQL.

#### 🔹 **ProxySQL có 2 cổng chính:**

| Port | Chức năng |
|------|----------|
| **6032** | Admin – Dùng để cấu hình ProxySQL |
| **6033** | MySQL Frontend – Ứng dụng kết nối vào đây thay vì MySQL trực tiếp |

#### 🔹 **mysql_query_rules – Tạo rule để route query**
Dùng để **route query đến shard hoặc replica phù hợp**.

Ví dụ: Chuyển tất cả `SELECT` sang replica (hostgroup 2):

```sql
INSERT INTO mysql_query_rules (rule_id, active, match_pattern, destination_hostgroup, apply)
VALUES (1, 1, '^SELECT', 2, 1);
LOAD MYSQL QUERY RULES TO RUNTIME;
SAVE MYSQL QUERY RULES TO DISK;
```

➡ **Tóm lại:** ProxySQL giúp **quản lý kết nối, load balancing, query routing**, rất hữu ích khi dùng nhiều replica hoặc sharding.

---
## **🔚 Kết luận**

- MySQL vs PostgreSQL: Chọn tùy theo nhu cầu (MySQL nhanh, PostgreSQL mạnh về transaction).
- ACID và MVCC giúp PostgreSQL ít bị lock hơn so với MySQL.
- Partitioning giúp tối ưu query trong một database, còn Sharding giúp scale-out qua nhiều database.
- ProxySQL giúp **quản lý kết nối, load balancing, query routing**, rất hữu ích khi dùng nhiều replica hoặc sharding.
- CTE giúp viết query phức tạp dễ đọc hơn, PostgreSQL hỗ trợ mạnh hơn MySQL.

