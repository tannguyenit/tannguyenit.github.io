---
layout: post
title:  "Git submodule"
author: tannguyen
categories: [ serverless ]
image: assets/images/post/2019-08-06/tim-hieu-ve-git-submodule.png
description: "Git submodule, submodule, git"
featured: true
hidden: true
---

*Git cho phép bạn đưa/thêm 1 repo khác vào repo chính của bạn gọi là `submodule`. Điều này cho phép bạn tracking các thay đổi thông qua repo chính. 
 Repo của `submodule` được lồng trong repo chính với đường dẫn cụ thể và có thể đặt bất cứ đâu, miễn là trong repo chính là được. Thư mục làm việc được cấu hình thông qua tệp `.gitmodules` ở root repo
 File này chứa các submodule và các path URL  nào sẽ được dùng để clone và fetching repo.*

### 1 Submodule - Repository trong 1 repository khác
#### 1.1 Sử dụng Git repository trong 1 repo khác

Git cho phép bạn đưa/thêm 1 repo khác vào repo chính của bạn gọi là `submodule`. Điều này cho phép bạn tracking các thay đổi thông qua repo chính. 
Repo của `submodule` được lồng trong repo chính với đường dẫn cụ thể và có thể đặt bất cứ đâu, miễn là trong repo chính là được. Thư mục làm việc được cấu hình thông qua tệp `.gitmodules` ở root repo
File này chứa các submodule và các path URL  nào sẽ được dùng để clone và fetching repo.

Git cho phéo bạn commit,pull,push lên submodule 1 cách độc lập. Nó cho phép bạn giữ các project/module nhỏ ở các repo riêng biệt nhưng vẫn có thể refernce chúng như là 1 thư mục

### 2 Làm việc với repo có chứa submodule

#### 2.1 Clone repo có submodule

Trường hợp 1: Nếu bạn muốn clone repo có chứa submodules thì bạn thêm tham số `--recursive`

```text
git clone --recursive [URL repo]
```

Trường hợp 2: Nếu bạn đã clone repo rồi và bạn muốn clone `submodules`, bạn có thể dùng `submodul update`

```text
git submodule update --init
```
 * Nếu có các module lồng nhau thì bạn thêm `--recursive`
 ```text
git submodule update --init --recursive
```

#### 2.2 Clone nhiều submodule 1 lúc

Có thể trong project của bạn có nhiều submodule, và để clone hết chung thì cần nhiều thời gian.
Bạn có thể clone 5 submodule 1 lần bằng lệnh dưới
```text
#old versions
git submodule update --init --recursive --jobs 5
git clone --recursive --jobs 5 [URL repo]
# new version
git submodule update --init --recursive -j 5
```

#### 2.3 Pull source với submodule
Khi trong source bạn đã có submodule thì bạn có thể update lại repo với lệnh pull như bình thường,
Để pull hết các submodule có trong repo thì bạn sử dụng param `--recurse-submodules` và `--remote` trong lệnh  `git pull`

```text
# pull all changes in the repo including changes in the submodules
git pull --recurse-submodules

# pull all changes for the submodules
git submodule update --remote
```
### 3 Tạo Repo mới với submodule
#### 3.1 Tạo thêm 1 submodule trong repo và tracking branch

Khi bạn thêm submodule vào Repo thì bạn có thể chỉ định branch mà bạn muốn tracking thông qua params `-b` của `submodule` .
Nếu không bạn có thể bỏ qua param đó. Tiếp theo bạn chạy lệnh `git submodule init` để git tạo ra 1 file config cho submodule đó 

```shell
# add submodule and define the master branch as the one you want to track
git submodule add -b master [URL to Git repo]   (1)
git submodule init                              (2)
```

(1) Thêm submodule mới vào Repo đã tồn tại và khai báo branch cần tracked
(2) Init một file submodule config mới 

#### 3.2 Xóa một submodule
Để xóa một submodule thì bạn cần làm theo các bước sau: 

* git submodule deinit -f — mymodule
  
* rm -rf .git/modules/mymodule
  
* git rm -f mymodule

Một số chú ý:

* Git submodule nó sẽ chứa trong 1 thư mục nào đó, nên việc triển khai thư mục bạn nên chú ý phần này, 
  hãy đưa tất cả các module bạn sẽ thực hiện vào trong 1 thư mục
* Khi nghĩ tới đây thì có bạn( mình lúc bắt đầu nữa :) ) sẽ có suy nghĩ là tạo ra 1 module mới, 
  rồi làm việc trên module đó, còn repo chính sẽ đưa thư mục submodule đó vào trong .gitignore để không đưa code trong module đó lên, :) 
  nhưng không phải như vậy nhé. Phần dưới mình sẽ giải thích
  
#### Demo nhỏ nhỏ: 

Vào souce code vào thêm module nào:
```shell
cd /path/to/source
git submodule add https://github.com/username/demo.git
 ```

Chúng ta hãy xem có gì thay đổi không nhé

```shell 
git status
```
--> Kết quả bạn sẽ nhìn thấy như này :v 
```shell
On branch develop
Your branch is up-to-date with 'origin/dev’.
Changes to be committed:
(use "git reset HEAD ..." to unstage)

new file:   .gitmodules
new file:   demo
```

Khi bạn chạy lệnh trên thì git nó sẽ tạo cho bạn 1 file `.gitmodules` . File này chứa config của module đó.

Okay, bạn hãy push hai file này lên nhé. Mình sẽ giải thích đoạn này. 
Khi bạn push lên thì file `.gitmodules` và folder demo sẽ được push lên luôn, nhưng khi tạo pull thì bạn hãy xem folder 
demo đó nó sẽ symlink tới repo demo. Đây là lý do tại sao ở trên mình bảo không nên thêm folder này vào trong `.gitignore` 
và còn 1 lý do nữa sẽ giải thích phần dưới

Giờ bạn hãy chỉnh sửa trong module và push code lên nhé

```shell
cd demo
echo "# demo" >> README.md
git add .
git commit -m "add readme"
git push origin master
```
Sau khi xong bước này thì trên repo demo ( submodule) của bạn đã có code mới nhất

Bạn ra thư mục gốc của project và `git status` , bạn sẽ thấy như này:

```shell 
On branch develop
Your branch is up-to-date with 'origin/develop'.
Changes not staged for commit:
(use "git add ..." to update what will be committed)
(use "git checkout -- ..." to discard changes in working directory)
modified:   demo (new commits)
no changes added to commit (use "git add" and/or "git commit -a")
```

Lúc này bạn sẽ thấy git báo là new commit, đó là commit cuối cùng của submodule và `git` của bạn cần biết id commit đó 
để khi bạn update submodule git sẽ dựa vào id commit đó mà checkout

Bạn hãy push tất cả lên, và check pull request bạn sẽ thấy giông như này:

```text
Subproject commit e2378a36a5dcafb798300dab9f9d59c5f8f7ea87
```

Khi một member trong team pull code về và muốn dùng module đó thì chỉ cần update submodule

```text
git submodule update
```

git sẽ dựa vào file `.gitmodule` và `last commit` của submodule để đến path của submodule và 
checkout đến commit `e2378a36a5dcafb798300dab9f9d59c5f8f7ea87`

Cảm ơn mọi người đã đọc, mình trình bày không tốt lắm nên có gì mọi người để lại bình luận mình sẽ giải thích nhé :bow