---
layout: post
title:  "Hướng dẫn cài đặt LEMP trên Ubuntu"
author: tannguyen
categories: [ tutorial ]
image: assets/images/post/2019-03-16/lemp.png
description: "Trong bài này mình xin hướng dẫn các bạn cài đặt LEMP trên Ubuntu"
featured: true
hidden: true
---

Trong bài này mình xin hướng dẫn các bạn cài đặt LEMP trên Ubuntu. Giới thiệu sơ qua . LEMP là 1 nhóm phần mềm được sử dụng để chạy các trang web và ứng dụng web động. LEMP là viết tắt của Linux, Nginx (phát âm là : Engine-X), MySql và PHP.
Bắt đầu !
## Step 1 – Cài đặt Nginx Web Server
```text
sudo apt update
sudo apt install nginx
```
Nếu bạn đang bật tường lửa <code>ufw</code> thì bạn cần enable cho Nginx 
```text
sudo ufw allow 'Nginx HTTP'
```

Bạn truy cập vào trình duyệt và nó sẽ đưa bạn đến trang mặc định của Nginx

```text
http://server_domain_or_IP
```

![nginx default](/assets/images/post/2019-03-16/nginx-default.png)

Nếu bạn nhận được trang như hình trên thì bạn đã cài đặt thành công Nginx
## Step 2: Cài đặt MySql để quản lý data
Bây giờ bạn có một máy chủ web, bạn cần cài đặt MySQL (một hệ thống quản lý cơ sở dữ liệu) để lưu trữ và quản lý dữ liệu cho trang web của bạn.
Cài đặt MySQL bằng cách gõ:
```text
sudo apt install mysql-server
```
## Step 3: Cài đặt PHP và cấu hình Nginx chạy PHP 
Đến bây giờ bạn đã cài thành công Nginx làm Web-Server và bạn cũng đã cài MySQL để quản lý data. Tuy nhiên vẫn chưa có PHP để có thể build 1 trang web động. 
Vì Nginx không xử lý được PHP như một số Web-Server khác nên chúng ta cần phải cài đặt <code>php-fpm</code> viết tắt của "fastCGI Process Manager". Chúng ta sẽ yêu cầu Nginx chuyển các PHP request đến thằng này để xử lý 
Và để PHP connect được với database thì chúng ta cũng cần cài thêm 1 module nữa là <code>php-mysql</code>
Ngoài ra thì chúng ta cũng cần cài thêm 1 số module liên quan để phục vụ cho việc code.

Ở đây mình xin cài phiên bản php7.2 :
```text
sudo apt-get install -y php7.2 php7.2-fpm php7.2-mysql php7.2-cli php7.2-common php7.2-mbstring php7.2-gd php7.2-intl php7.2-xml 
```

Sau khi cài đặt xong bạn có thể kiểm tra lại 1 lần nữa xem trên máy chúng ta đã có chưa bằng lệnh 
```text
php -v
```

Lúc này thì chúng ta đã cài đặt tất cả những module/software cần thiết cho LEMP, nhưng bạn vẫn cần thực hiện một vài thay đổi cấu hình để yêu cầu Nginx sử dụng bộ xử lý PHP cho web của chúng ta.

Tiếp theo chúng ta sẽ cấu hình cho Nginx nhé.Chúng ta sẽ cấu hình trên khối server (server block) của Nginx (các block này tương tự tạo host ảo trên Apache). Hãy mở block mặc định của Nginx bằng cách:

```text
cd /etc/nginx/site-available
cp default example.conf
```
Đến đây bạn sẽ config trên file example.conf như dưới 
```text

server {
    listen 80;
    server_name example.local;
    root /var/www/html;
    index index.php index.html index.htm index.nginx-debian.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        fastcgi_param SERVER_NAME $host;
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Giải thích sơ về block trên 
* listen  - Xác định cổng nào Nginx sẽ nghe. Trong trường hợp này, nó sẽ lắng nghe trên cổng 80, cổng mặc định cho HTTP.
* root - Xác định nơi chứa code của mình
* index - Nói cho Nginx biết là nên ưu tiên file có tên là <code>index.php</code> nếu chúng có sẵn
* server_name - Hiểu đơn giản chỗ này là mình điền domain của mình vào.
* location / - Block này bao gồm một lệnh try_files, kiểm tra sự tồn tại của các tệp khớp với yêu cầu URI. Nếu Nginx không thể tìm thấy tệp thích hợp, nó sẽ trả về lỗi 404.
* location ~ \ .php $ - Block này hiểu đơn giản là báo cho Nginx chuyển request đến <code>fastcgi-php.conf</code> để xử lý
* location ~ /\.html - Block này hiểu đơn giản là những file có dạng <code>.htxxx</code> thì <code>deny all</code>

Sau khi cấu hình xong, bạn lưu file lại, Mặc định, Nginx sẽ load tất cả những file config trong <code>/etc/nginx/sites-enabled/</code> Nên chúng ta sẽ tạo 1 symbolic link với file vừa config vừa tạo như sau. 
```text
sudo ln -s /etc/nginx/sites-available/example.conf /etc/nginx/sites-enabled/
```

Tiếp theo kiểm tra xem file config của mình có gặp lỗi cú pháp gì không bằng cách: 
```text
sudo nginx -t
```
Nếu có thông báo lỗi thì chúng ta đọc lỗi xem dòng nào, và quay lại sửa file <code>/etc/nginx/site-available/exampleconf</code>

Để domain hoạt động OK thì bạn cần sửa tiếp 1 file hosts trong <code>/etc/hosts</code>
```text
#Add to file hosts
example.local 127.0.0.1 
```
Tiếp theo điều chúng ta cần làm là restart lại webserver để nó nhận được các config của chúng ta 
```text
sudo service nginx restart
# OR
sudo systemctl restart nginx
```
## Step 4: Tạo 1 file PHP và kiểm tra cấu hình
Để thực hiện việc này, hãy sử dụng trình soạn thảo văn bản của bạn để tạo một tệp PHP thử nghiệm có tên là info.php trong <code>/var/www/html</code>:

```text
cd 
nano /var/www/html/info.php
```
Nhập các dòng sau vào file info.php và lưu lại.
```php
<?php
phpinfo();
```
Bây giờ, bạn có thể truy cập trang này trong trình duyệt web của mình bằng cách truy cập tên miền hoặc địa chỉ IP công khai của máy chủ của bạn theo sau là /info.php:

```text
http://your_server_domain_or_IP/info.php
```

![php info](/assets/images/post/2019-03-16/php_info.png)

Nếu xuất hiện được như hình này thì bạn đã thành công. Cảm ơn các bạn đã đọc 