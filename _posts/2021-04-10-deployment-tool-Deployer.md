---
layout: post
title:  "Learn about the deployment tool Deployer"
author: tannguyen
categories: [ server, ci-cd ]
image: assets/images/post/2021/deployer_cover.jpeg
description: "PHP Deployment, Deployer, Deployer la gi, Deployer là gì"
featured: true
hidden: true
---

> Đặt vấn đề: Khi bạn làm việc trong một dự án thì bạn sẽ có lúc gặp vấn đề về deploy code lên Server. Cách đầu tiên là bạn chọn cách deploy thủ công, tự mình làm từ a-z, điều này dẫn đến việc deploy dễ bị sai sót. Cách thứ 2 là chọn 1 thèn thứ 3 nào đó nó làm giúp việc đó cho mình, thì hôm nay mình sẽ giới thiệu với các bạn 1 tool deploy dành cho PHP. Đó là Deployer

## 1 What is Deployer?

> Như đã nói ở trên, Đây là một deployment tool viết bằng PHP và nó support cho nhiều framework như Laravel, codeigniter ... Bạn có thể tìm hiểu thêm ở [đây](https://github.com/deployphp/deployer/tree/master/recipe)

Một số tính năng nổi bật:

* Dễ setup và dễ học
* Sử dụng `recipes` cho các framework
* Có thể chạy các task song song mà không cần extenssion
* Rollback lại bản release trước nếu gặp sự cố khi deploy
* Xác thực với SSH
* Nói **KHÔNG** với downtime deployments

> Main concept của Deployer là recipe, một file PHP định nghĩa các task cần thực hiện trong quá trình deploy. recipe có thể require và extend hoặc override các recipe khác.

## 2 Installation

Có 3 cách để setup Deployer
* Download file `.phar`
* Install thông qua `composer`
* Install qua các distribution composer

Mình sẽ hướng dẫn các bạn cài đặt cách đầu tiên, Nếu bạn muốn tìm hiểu thêm có thể vào [đây](https://deployer.org/docs/installation.html)

```bash
curl -LO https://deployer.org/deployer.phar
mv deployer.phar /usr/local/bin/dep
chmod +x /usr/local/bin/dep
```
Sau khi setup xong thì bạn chuyển đến folder dự án và chạy 
```bash
dep init
```

Lệnh này sẽ tạo ra một file `deploy.php` trong thư mục hiện tại. File này chính là 1 recipe chứa cấu hình và các task để triển khai trong quá trình deploy. 
Mặc định, tất cả các recipe đều extends từ các [common recipe](https://github.com/deployphp/deployer/blob/master/recipe/common.php)

## 3 Configuration

Deployer cho phép chúng ta config và get  các param thông qua `set`, `get` function. Trong đó, params có thể là giá trị hoặc 1 function.

```php
set('param', 'value');

set('current_path', function () {
    return run('pwd');
});

task('deploy', function () {
    $param = get('param');
});
```

Bạn có thể sử dụng hai cặp ngoặc nhọn {{ }} hoặc sử dụng nối chuỗi và hàm get đê bind các params vào command

```php
run('cd {{release_path}} && command');
run('cd ' . get('release_path') . ' && command');
```

Một số params mà chúng ta cần quan tâm khi cấu hình hệ thống gồm.

| Params               	| Description                                                                                                                                              	|
|----------------------	|----------------------------------------------------------------------------------------------------------------------------------------------------------	|
| deploy_path          	| Định nghĩa đường dẫn tới thư mục được tạo ra trên server khi deploy dự án                                                                                	|
| hostname             	| Server name hoặc IP                                                                                                                                       |
| user                 	| Username, mặc định là username account git của bạn. Hoặc bạn có thể setup như vậy                                                                        	|
| release_path         	| Đường dẫn đầy đủ đến thư mục chứa bản release hiện tại                                                                                                   	|
| previous_release     	| Đường dẫn tới bản release trước (nếu có)                                                                                                                 	|
| ssh_multiplexing     	| Nên set giá trị là true: set('ssh_multiplexing', true);                                                                                                  	|
| default_stage        	| Nếu host của bạn có chứa nhiều stages, bạn cần định nghĩa stage mặc định được deploy khi không chỉ định stage                                            	|
| keep_releases        	| Số lượng bản release cần lưu lại, mặc định là 5. Giá trị -1, tương ứng với việc giữ lại toàn bộ các bản released                                         	|
| repository           	| Git repository                                                                                                                                           	|
| git_tty              	| Cho phép việc thực hiện lệnh git clone, mặc định là false. Bạn có thể set true bằng hàm: set('git_tty', true);                                           	|
| branch               	| Nhánh được deploy                                                                                                                                        	|
| shared_dirs          	| Thư mục chứa các dữ liệu bạn muốn cache lại sau khi deploy để theo dõi quá trình vận hành hệ thống.                                                      	|
| copy_dirs            	| Danh sách files cần copy giữa các bản release                                                                                                            	|
| writable_dirs        	| Các thư mục cho phép ghi trên server                                                                                                                     	|
| writable_use_sudo    	| Lệnh ghi chỉ được thực hiện với sudo. Mặc định là false                                                                                                  	|
| clear_paths          	| Danh sách đường dẫn cần xóa sau khi update                                                                                                               	|
| clear_use_sudo       	| Yêu cầu sudo với clear_paths. mặc định là false                                                                                                          	|
| cleanup_use_sudo     	| Yêu cầu sudo với task cleanup. mặc định là false                                                                                                         	|
| use_relative_symlink 	| Có cho phép sử dụng relative symlinkhay không. Mặc định, deployer sẽ dò xem hệ thống có hỗ trợ các relative symlink hay không để cho phép sử dụng chúng. 	|
| use_atomic_symlink   	| Tương tự use_relative_symlink. nhưng ở đây là atomic symlink                                                                                             	|
| composer_action      	| Mặc định là install                                                                                                                                      	|
| composer_options     	| Danh sách options cho composer                                                                                                                           	|
| env                  	| Danh sách biến môi trường                                                                                                                                	|

## 4 Tasks

Các repice sẽ định nghĩa các task, sau đó chúng ta có thể sử dụng dep để thực thi các tác vụ này. Ngoài ra bạn có thể 
thêm mô tả cho task thông qua hàm `desc`

```php
desc('My task');
task('my_task', function () {
    run(...);
});
```
Run task 

```bash
dep my_task
```

Nếu task của bạn chỉ có lệnh `run` hoặc chỉ chạy 1 command thì bạn có thể define 1 task đơn giản như này: 

```php
task('build', 'npm build');
```
> Mặc định thì các task này sẽ cd tới `release_path`

Bạn cũng có thể define nhiều command như dưới: 
```php
task('build', '
    gulp build;
    webpack -p;
    echo "Build done";
');
```
Bạn có thể combine các task lại thành 1 group như này: 

```php
task('deploy', [
    'deploy:prepare',
    'deploy:update_code',
    'deploy:vendors',
    'build',
    'deploy:symlink',
    'cleanup'
]);
```
Ngoài ra bạn có thể define task chạy trước hoặc sau một số task cụ thể:
```php
// Trước khi chạy task artisan:migrate thì run task deploy:symlink
before('deploy:symlink', 'artisan:migrate');

// Sau khi deploy:failed run thì sẽ run task deploy:unlock
after('deploy:failed', 'deploy:unlock');
```

### Filtering

#### Once
> chỉ thực hiện task duy nhất 1 lần

```php
task('do', ...)->once();
```
#### By stage
> chỉ run trên stage được define

```php
task('test', function () {
    ...
})->onStage('staging');
```

#### By roles
> chỉ run trên role được define

```php
desc('Migrate database');
task('migrate', function () {
    ...
})->onRoles('db');
```

> Note: chúng ta có thể define chạy trên nhiều role. onRoles('app', 'db', ...)

#### By hosts
> chỉ run trên host được define

```php
desc('Migrate database');
task('migrate', function () {
    ...
})->onHosts('db.domain.com');

```
> Note: tương tự với role, chúng ta có thể define chạy trên nhiều host. onHosts('db.domain.com', 'api.domain.com', ...)

#### Local tasks
> Chạy task dưới local và chỉ chạy 1 lần

```php
task('build', function () {
    ...
})->local();
```

#### Overriding tasks

Đôi khi bạn muốn các task chạy các command khác so với default thì bạn có thể overide lại bằng cách: 

```php
task('deploy:update_code', function () {
    // Your custom update code
    upload(...);
});
```
#### Parallel task execution
Khi bạn phải deploy lên nhiều server, Deployer sẽ chạy từng task trên các server đó, như hình dưới

![Deployer-multiple-host](/assets/images/post/2021/deploy-multiple-host.png)

Để deploy nhanh hơn thì `Deployer` cho phép ta chạy các task song song trên các server bằng cách thêm `--parallel` hoặc `-p`

![deploy-multiple-host-with-parallel](/assets/images/post/2021/deploy-multiple-host-with-parallel.png)

Bạn có thể limit lại số concurrent task, Mặc định sẽ có tối đa 10 task được chạy đồng thời

```bash
dep deploy --parallel --limit 2
```
![deploy-multiple-host-with-limit](/assets/images/post/2021/deploy-multiple-host-with-limit.png)

## 5 Hosts

Define host trong Deployer là cần thiết để deploy application. Nó có thể là remote machine, local machine hoặc EC2 ...
Mỗi host gồm `hostname`, `stage` 1 hoặc nhiều `roles` và một số `parameters`

Bạn có thể định nghĩa host thông qua `host` function trong file `deploy.php`

```php
host('domain.com')
    ->stage('production')
    ->roles('app')
    ->set('deploy_path', '~/app');
```

Host có thể được viết bằng file `yaml` như ví dụ dưới `hosts.yml`

```yaml
domain.com:
  stage: production
  roles: app
  deploy_path: ~/app
```

Nếu bạn dùng file `yaml` để define host thì bạn cần phải thêm dòng này vào file `deploy.php`

```php
inventory('hosts.yml');
```

File `hosts.yml` có thể chưa nhiều definitions giống nhau thì bạn có thể dùng YAML extend syntax:

```yaml
.base: &base
  roles: app
  deploy_path: ~/app
  ...

www1.domain.com:
  <<: *base
  stage: production
  
beta1.domain.com:
  <<: *base
  stage: beta
    
...
```

Bài viết này mình chỉ giới thiệu về `Deployer`, Bài viết tiếp theo mình sẽ giới thiệu về cách deploy 
Laravel project lên EC2 bằng `Deployer` thông qua `Bitbucket pipeline` tại [đây](https://tannguyenit.github.io/deploy-laravel-to-ec2-using-deployer-via-bitbucket)