---
layout: post
title:  "Deploy Branch Dynamic Lên EC2 với Nginx SSL và GitHub Actions"
author: tannguyen
categories: [ ci-cd, server ]
image: assets/images/post/2025/github-action-nginx-ec2.webp
description: "Github Action, Nginx, EC2"
featured: false
hidden: false
---


## Hành Trình Deploy Branch Lên EC2 với Nginx SSL và GitHub Actions

Xin chào các bạn, mình là một developer đam mê với CI/CD và hôm nay mình muốn chia sẻ một trải nghiệm thực tế: cách tự động deploy các branch từ Git lên EC2, dùng Nginx để serve qua subdomain với SSL từ Certbot. Đây là một setup mình thấy rất thú vị, đặc biệt khi bạn cần preview code theo branch hoặc tạo môi trường staging. Hãy cùng mình đi qua hành trình này nhé!

### Bước 1: Ý tưởng và mục tiêu
Ý tưởng của mình là: mỗi khi push một branch lên GitHub, code sẽ tự động được clone vào một folder trên EC2, tên folder trùng với tên branch. Sau đó, mình dùng Nginx để serve nội dung qua subdomain (ví dụ: `feature-xyz.devserver.tannguyenit.dev`) và thêm SSL để bảo mật. Để làm được, mình cần kết hợp EC2, Nginx, Certbot và GitHub Actions.

### Bước 2: Chuẩn bị EC2
Mình bắt đầu với một instance EC2 chạy Amazon Linux 2. Để bảo mật, mình không dùng root mà tạo một user riêng tên deploy:

```text
sudo adduser deploy
sudo mkdir -p /home/deploy/www
sudo chown deploy:deploy /home/deploy/www
```

Tiếp theo, mình tạo SSH key cho user deploy để GitHub Actions có thể SSH vào và để clone repository từ GitHub:

```text
sudo -u deploy ssh-keygen -t rsa
```

Mình copy public key (`/home/deploy/.ssh/id_rsa.pub`) để dùng sau. Để GitHub Actions SSH được vào EC2, mình thêm public key này vào file `authorized_keys`:

```text
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh
sudo -u deploy bash -c 'cat /home/deploy/.ssh/id_rsa.pub >> /home/deploy/.ssh/authorized_keys'
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
```

Để git clone từ GitHub hoạt động, mình thêm host key của GitHub vào known_hosts và thêm public key vào GitHub Deploy Keys:

```text
sudo -u deploy ssh-keyscan -H github.com >> /home/deploy/.ssh/known_hosts
sudo chmod 600 /home/deploy/.ssh/known_hosts
sudo chown deploy:deploy /home/deploy/.ssh/known_hosts
```

Public key (`/home/deploy/.ssh/id_rsa.pub`) cần được thêm vào GitHub:

Vào repository → `Settings > Deploy keys > Add deploy key`, paste public key, bật "Allow write access" nếu cần push.

Private key (`/home/deploy/.ssh/id_rsa`) sẽ được thêm vào GitHub Secrets sau. Đừng quên cài Git trên EC2:

```text
sudo yum install -y git
```

### Bước 3: Cấu hình Nginx
Mình muốn mỗi branch được truy cập qua subdomain (ví dụ: `feature-xyz.devserver.tannguyenit.dev`). Trên Amazon Linux 2, mình cài Nginx trước:

```text
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Sau đó, tạo file cấu hình Nginx trong `/etc/nginx/conf.d/devserver.conf`:

```text
server {
    listen 80;

    server_name  *.devserver.tannguyenit.dev;
    set $root /home/deploy/www/main/;

	if ($host ~ "^(.+)\.devserver\.tannguyenit\.dev$") {
        set $root /home/deploy/www/$1;
    }
    root $root;

    location / {
        try_files $uri $uri/ /index.html =404;
    }
}
```
Kiểm tra và reload Nginx:

```text
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 4: Cài SSL với Certbot

Mình dùng Certbot để lấy wildcard certificate (`*.devserver.tannguyenit.dev`). Đầu tiên, cài Certbot trên Amazon Linux 2:

```text
sudo yum install -y python3 augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```

Sau đó, mình tạo wildcard certificate:

```text
sudo certbot certonly --manual \
  --preferred-challenges dns \
  --server https://acme-v02.api.letsencrypt.org/directory \
  -d "*.devserver.tannguyenit.dev" \
  -d "devserver.tannguyenit.dev"
```

Certbot yêu cầu thêm TXT record `_acme-challenge.devserver.tannguyenit.dev` vào DNS. Mình vào DNS provider, thêm record, chờ vài phút, rồi hoàn tất lệnh. Chứng chỉ được lưu ở `/etc/letsencrypt/live/devserver.tannguyenit.dev/`

Quy trình:
1. Certbot sẽ yêu cầu bạn thêm TXT record vào DNS:
* Name: _acme-challenge.yourdomain.com
* Value: Một chuỗi dài Certbot cung cấp (ví dụ: X7k...)
2. Vào DNS provider (Cloudflare, Namecheap, AWS, v.v.), thêm TXT record.
3. Chờ vài phút để DNS propagate.
4. Nhấn Enter trong terminal Certbot để tiếp tục.

> Tại sao dùng chế độ manual thay vì nginx?

Bình thường, Certbot có plugin Nginx (`certbot --nginx`) tự động xác minh domain qua HTTP bằng cách thêm file tạm vào server. Nhưng vì mình dùng wildcard (`*.devserver.tannguyenit.dev`), Let's Encrypt yêu cầu xác minh qua DNS thay vì HTTP. Điều này là do wildcard không thể được xác thực qua một request HTTP đơn giản – nó cần chứng minh bạn sở hữu toàn bộ domain qua DNS. Chế độ manual với `--preferred-challenges dns` cho phép mình thêm TXT record để hoàn tất quá trình này. Dù hơi thủ công, nhưng đây là cách duy nhất để lấy wildcard certificate trong trường hợp của mình.

### Bước 5: Cập nhật Nginx với SSL
Mình chỉnh lại cấu hình Nginx trong `/etc/nginx/conf.d/devserver.conf` để dùng HTTPS:

```text
server {
    listen 80;
    server_name *.devserver.tannguyenit.dev devserver.tannguyenit.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name  *.devserver.tannguyenit.dev;
    set $root /home/deploy/www/main/;

	if ($host ~ "^(.+)\.devserver\.tannguyenit\.dev$") {
        set $root /home/deploy/www/$1;
    }
    root $root;

    location / {
        try_files $uri $uri/ /index.html =404;
    }
}
```

Reload Nginx:

```text
sudo systemctl reload nginx
```

### Bước 6: Cấu hình GitHub Actions
Bây giờ, khi EC2 và Nginx đã sẵn sàng, mình setup GitHub Actions để tự động hóa việc deploy. Mình vào repository trên GitHub, thêm các Secrets trong `Settings > Secrets and variables > Actions`:

```
EC2_HOST: IP của EC2
EC2_USER: deploy
EC2_SSH_KEY: Private key từ /home/deploy/.ssh/id_rsa (giữ nguyên định dạng -----BEGIN RSA PRIVATE KEY----- và -----END RSA PRIVATE KEY-----)
EC2_PATH: /home/deploy/www
REPO_URL: URL repo của mình (ví dụ: git@github.com:username/repo.git)
```

Lưu ý:

EC2_SSH_KEY phải khớp với public key trong `/home/deploy/.ssh/authorized_keys` trên EC2.
Public key của deploy phải được thêm vào GitHub Deploy Keys để git clone hoạt động.
Các biến như `EC2_PATH` không tự truyền vào SSH, cần export rõ ràng trong workflow.
Sau đó, tạo file workflow `.github/workflows/deploy.yml` :

```text
name: Deploy Branch to EC2

on:
  push:
    branches:
      - '*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to EC2
        env:
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ${{ secrets.EC2_USER }}
          EC2_SSH_KEY: ${{ secrets.EC2_SSH_KEY }}
          EC2_PATH: ${{ secrets.EC2_PATH }}
          REPO_URL: ${{ secrets.REPO_URL }}
          BRANCH_NAME: ${{ github.ref_name }}
        run: |
          echo "$EC2_SSH_KEY" > private_key.pem
          chmod 600 private_key.pem
          ssh -o StrictHostKeyChecking=no -i private_key.pem $EC2_USER@$EC2_HOST << EOF
            export EC2_PATH="$EC2_PATH"
            export REPO_URL="$REPO_URL"
            export BRANCH_NAME="$BRANCH_NAME"
            mkdir -p \$EC2_PATH
            rm -rf \$EC2_PATH/\$BRANCH_NAME
            git clone -b \$BRANCH_NAME \$REPO_URL \$EC2_PATH/\$BRANCH_NAME
            chmod -R 755 \$EC2_PATH/\$BRANCH_NAME
          EOF
          rm -f private_key.pem
```

Workflow này sẽ chạy mỗi khi mình push code, clone branch vào folder tương ứng trên EC2.
![deploy-success](assets/images/post/2025/github-action-deploy-success.png)

### Bước 7: Kiểm tra

Mình push branch feature-b, vào [https://feature-b.devserver.tannguyenit.dev](https://feature-b.devserver.tannguyenit.dev) – trang load với HTTPS hoàn hảo! Certbot cũng tự động gia hạn certificate (test bằng `sudo certbot renew --dry-run`). Log GitHub Actions cho mình thấy mọi thứ diễn ra mượt mà.

![demo](assets/images/post/2025/branch-domain.png)

### Bước 8: Tối ưu

Trong quá trình phát triển, số lượng branch có thể tăng lên nhanh chóng, đặc biệt khi team của bạn làm việc trên nhiều feature, bug fix hay thử nghiệm cùng lúc. Mỗi branch được deploy sẽ tạo ra một folder trên EC2, và nếu không quản lý, những folder này sẽ tích lũy theo thời gian, gây ra một số vấn đề:
* **Lãng phí tài nguyên:** 

  EC2 thường có giới hạn dung lượng lưu trữ, nhất là với các instance nhỏ như t2.micro. Khi folder không còn cần thiết (branch đã merged), việc giữ lại chúng chỉ lãng phí không gian đĩa. Xóa folder sau khi merged giúp bạn duy trì dung lượng trống, tránh tình trạng "disk full" làm gián đoạn dịch vụ.
* **Nhầm lẫn và lỗi truy cập:**

  Nếu folder cũ vẫn tồn tại, ai đó có thể vô tình truy cập subdomain cũ (ví dụ: `feature-xyz.devserver.tannguyenit.dev`) và thấy nội dung không còn liên quan, gây nhầm lẫn. Xóa folder đảm bảo rằng chỉ các branch đang hoạt động mới có thể truy cập, giữ hệ thống gọn gàng và nhất quán.
* **Hiệu suất nginx:** 

  Nginx phục vụ nội dung dựa trên cấu hình động (root /home/deploy/www/$branch). Khi số lượng folder tăng quá nhiều, việc quét thư mục hoặc xử lý request có thể chậm lại, dù ảnh hưởng không lớn. Dọn dẹp folder giúp giảm tải không cần thiết cho server.
* **Quản lý:**

  Nếu không có cơ chế tự động xoá những branch đã merged, việc xoá thủ công dễ gây nhầm lẫn và tốn thơì gian
* **Bảo mật:** 

  Để folder cũ tồn tại có thể dẫn đến rủi ro nhỏ như lộ code không còn được duy trì hoặc gây hiểu nhầm về trạng thái dự án. Việc xóa folder sau khi merged thể hiện sự chuyên nghiệp trong quản lý hạ tầng và giảm bề mặt tấn công tiềm ẩn.

Implement:

Để theo dõi branch merged và xóa folder, mình tạo file `.github/workflows/clean-folder.yml`

```text
name: Clean Merged Branch Folders

on:
  pull_request:
    types: [closed]

jobs:
  clean:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - name: Clean Folder on EC2
        env:
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ${{ secrets.EC2_USER }}
          EC2_SSH_KEY: ${{ secrets.EC2_SSH_KEY }}
          EC2_PATH: ${{ secrets.EC2_PATH }}
          BRANCH_NAME: ${{ github.event.pull_request.head.ref }}
        run: |
          echo "$EC2_SSH_KEY" > private_key.pem
          chmod 600 private_key.pem
          ssh -o StrictHostKeyChecking=no -i private_key.pem $EC2_USER@$EC2_HOST << EOF
            export EC2_PATH="$EC2_PATH"
            export BRANCH_NAME="$BRANCH_NAME"
            rm -rf \$EC2_PATH/\$BRANCH_NAME
            echo "Deleted folder \$EC2_PATH/\$BRANCH_NAME as branch was merged"
          EOF
          rm -f private_key.pem
```

Giải thích:
* Trigger trên pull_request với types: [closed].
* Điều kiện if: github.event.pull_request.merged == true đảm bảo chỉ chạy khi PR được merged.
* BRANCH_NAME lấy từ github.event.pull_request.head.ref (branch nguồn của PR).
* Xóa folder tương ứng trên EC2.

Kinh nghiệm rút ra
* DNS: Đảm bảo wildcard DNS (`*.devserver.tannguyenit.dev`) trỏ đúng IP EC2 trước khi chạy Certbot.
* SSH: Public key của deploy phải thêm vào GitHub, và known_hosts cần có khóa của github.com.
* Secrets: Copy private key cẩn thận, giữ nguyên định dạng. Nếu gặp lỗi error in libcrypto, kiểm tra lại EC2_SSH_KEY.
* Workflow: Export biến trong SSH để tránh lỗi missing operand.
* Tối ưu: Workflow `clean-folder.yml` giúp xóa folder khi branch merged, tiết kiệm dung lượng EC2 khi số branch tăng.

### Kết luận

Setup này giúp mình preview code nhanh chóng theo branch mà không cần deploy thủ công. Nó cực kỳ hữu ích cho team muốn test feature trước khi merge. Nếu bạn muốn thử, cứ làm theo các bước trên – có gì thắc mắc thì comment nhé.
