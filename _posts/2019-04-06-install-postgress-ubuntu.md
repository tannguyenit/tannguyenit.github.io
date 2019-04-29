---
layout: post
title:  "Cài đặt postgresql trên Ubuntu"
author: tannguyen
categories: [ Install-tool ]
image: assets/images/post/2019-04-29/postgres.png
description: "Cách cài đặt postgresql trên ubuntu"
featured: true
---
### 1 Cài đặt
Trong bài viết này mình hướng dẫn cài đặt *postgresql* trên *Ubuntu 16.04*

Trước khi cài đặt bạn nên update lại các pakage trong máy của mình: 
```text
sudo apt-get update
```
Tiếp theo chúng ta sẽ cài đặt ```postgresql``` và package ```postgresql-contrib``` để bổ sung thêm một số tiện ích

```text
sudo apt-get install postgresql postgresql-contrib
```
Đến đây là bạn đã cài đặt xong, bạn có thể kiểm tra lại bằng cách:
```text
psql --version // return curent version of postgresql 
```
### 2 Sử dụng postgres role và Database
Theo mặc định, Postgres sử dụng ```roles``` để xác thực việc xác thực đăng nhập (**authenticate**) và quyền hạn sử dụng (**authorization**)

Khi cài đặt, Postgres được thiết lập để xác thực việc xác thực đăng nhập (**authenticate**), 
điều đó có nghĩa là nó liên kết các ```role``` của Postgres với tài khoản hệ thống `Unix / Linux` phù hợp. 
Nếu một `role` tồn tại trong Postgres, tên người dùng `Unix / Linux` có cùng tên sẽ có thể đăng nhập với vai trò đó.
Hiểu đơn giản chỗ này là khi bạn cài đặt thì `Postgres` sẽ tạo ra 1 username là `postgres` và bạn có thể dùng username này để đăng nhập vào `Postgres`
### 3 Đăng nhập vào Postgres
```text
sudo -i -u postgres
```
Bây giờ bạn có thể truy cập Postgres ngay lập tức bằng cách nhập:
```text
psql
```

Và lúc này bạn có thể tương tác với cơ sở dữ liệu và dùng các lệnh của `Postgres`
Để đăng xuất khỏi `Postgres` bạn gõ lệnh `\q`
```text
postgres=# \q
```
### 4 Một số lệnh cơ bản tương tác với postgres
#### 4.1 PostgreSQL commands
 Command            |       Actions
--------------------|-------------------------------
`\c dbname `        | Connect to new database.            
`\dt`               | To view list of relations/tables     
`\d tablename`      | Describe the details of given table        
`\h `               | Get a help on syntax of SQL commands 
`\q `               | quit the psql:           
` \l`               | List all databases in the PostgreSQL database server
`\dn `              | List all schemas
`\df `              | List all stored procedures and functions
`\dv`               | List all views
`\dt `              | Lists all tables in a current database
`\dt+`              | Or to get more information on tables in the current database
`\dt table_name `   | Get detailed information on a table
`\du `              | List all users ( role )

#### 4.2 Managing databases
Command                                     |       Actions
--------------------------------------------|-------------------------------
`CREATE DATABASE [IF NOT EXISTS] db_name;`  | Create a new database
`DROP DATABASE [IF EXISTS] db_name; `       | Delete a database permanently

#### 4.3 Managing tables
Command                                                                     |       Actions
----------------------------------------------------------------------------|-------------------------------
`ALTER TABLE table_name ADD COLUMN new_column_name TYPE;`                   | Add a new column to a table
`ALTER TABLE table_name DROP COLUMN column_name;`                           | Drop a column in a table
`ALTER TABLE table_name RENAME column_name TO new_column_name; `            | Rename a column
`ALTER TABLE table_name ALTER COLUMN [SET DEFAULT value or DROP DEFAULT] `  | Set or remove a default value for a column
`ALTER TABLE table_name ADD PRIMARY KEY (column,...);`                      | Add a primary key to a table
`ALTER TABLE table_name DROP CONSTRAINT primary_key_constraint_name;`       | Remove the primary key from a table
`ALTER TABLE table_name RENAME TO new_table_name; `                         | Rename a table
`DROP TABLE [IF EXISTS] table_name CASCADE;`                                | Drop a table and its dependent objects

Ngoài ra còn một số câu lệnh về truy vấn các bạn có thể tìm hiểu thêm trên internet nhé 

