---
layout: post
title:  "Viết code PHP chuẩn không cần chỉnh"
author: tannguyen
categories: [ php ]
image: assets/images/post/2019-03-18/php-standard-recommendation.jpg
description: "Tìm hiểu về PSR - PHP Standard Recommendation trong lập trình PHP"
---

Khi code 1 ngôn ngữ nào đó thì mỗi người có 1 cách viết khác nhau từ cách đặt tên biến, khai báo <code>function</code> 
vâng vâng và mây mây. Do đó khi chúng ta làm việc nhóm thì chúng ta cần phải thống nhất 
 style code với nhau, nếu không sau này dự án nhìn vào rất lộn xộn
 
Ở mỗi ngôn ngữ sẽ có 1 chuẩn riêng, và với <code>PHP</code> cũng có 1 tiêu chuẩn đó là <code>PSR - PHP Standard Recommendation </code>
Trong bài viết này chúng ta cùng tìm hiểu <code> PSR</code> là gì và tại sao các PHP developer cần tuân thủ theo chuẩn này

## PSR là gì?
PSR có nghĩa là PHP Standards Recommendations, nó là tiêu chuẩn được khuyến nghị áp dụng khi lập trình PHP và được các lập trình viên, tổ chức chấp nhận sử dụng.

PSR được soạn thảo, đánh giá và khuyến khích sử dụng bởi một nhóm chuyên gia PHP những người phát triển cho các Framework và hệ thống PHP phổ biến ([thành viên PSR](https://www.php-fig.org/personnel/)).
PSR bao gồm 7 phần (http://www.php-fig.org/psr/) từ PSR-0, PSR-1, PSR-2, PSR-3, PSR-4, PSR-6, PSR-7.

Các tiêu chuẩn thành phần hoàn chỉnh của PSR đó gồm:

* PSR-0 - Autoloading : Tiêu chuẩn về autoload 
* PSR-1 - Basic Coding Standard: Tiêu chuẩn cơ bản khi viết code PHP
* PSR-2 - Coding Style Guide: Tiêu chuẩn trình bày code
* PSR-3 - Logger Interface: Giao diện logger
* PSR-4 - Autoloading Standard: Tiêu chuẩn về autoload - cải tiến của PSR-0
* PSR-6 - Caching Interface: Giao diện về Caching
* PSR-7 - HTTP Message Interface: Tiêu chuẩn Giao diện thông điệp HTTP

## 1. PSR-1 Basic Coding Standard (Tiêu chuẩn cơ bản khi viết code PHP)


PRS-1 là các nguyên tắc mỗi lập trình viên PHP nên theo để đảm bảo code dễ đọc, bảo trì, và dễ sử dụng lại

#### 1.1 Tổng quan 
* Các file code PHẢI sử dụng thẻ <code><?php</code> hoặc <code><?</code>
* File code PHP PHẢI sử dụng encode: UTF-8 without BOOM
* Các Files NÊN hoặc dùng để khai báo các thành phần PHP (các lớp, hàm, hằng …) hoặc dùng với mục đích làm hiệu ứng phụ 
(như include, thiết lập ini cho PHP …), nhưng KHÔNG NÊN dùng cả 2 cùng lúc trong 1 file (Xem ví dụ này ở  Ví dụ 1)
* Các Namespace và classes PHẢI theo chuẩn “autoloading” PSR: [PSR-0, PRS-4]
* Tên lớp PHẢI có dạng NameClass
* Hằng số trong class tất cả PHẢI viết HOA và chia ra bởi dấu _ (Ex: PERMISSION_USERS)
* Tên phương thức của lớp PHẢI ở dạng camelCase
#### 1.2 File
##### 1.2.1 PHP tag 
PHP PHẢI sử dụng tag đầy đủ ```<?php ?>``` hoặc tag rút gọn ```<?= ?>```
##### 1.2.2 Character Encoding - Mã hóa ký tự
Code PHP PHẢI chỉ sử dụng UTF-8 mà không có BOM.
##### 1.2.3 Side Effects
Như có giải thích ở trên thì 1 file PHP chỉ nên dùng để khai báo các thành phần như Class, function, constant hoặc là dùng 
 để làm các chức năng phụ như là thiết lập ini, inclue chứ không nên làm cả 2 trong 1
 
 Dưới đây là ví dụ để làm rõ ý trên
 ```php
 <?php
 // side effect: change ini settings
 ini_set('error_reporting', E_ALL);
 
 // side effect: loads a file
 include "file.php";
 
 // side effect: generates output
 echo "<html>\n";
 
 // declaration
 function foo()
 {
     // function body
 }
 ``` 
 File trên vừa include vừa khai báo function không đạt chuẩn PSR-1
```php
<?php
// declaration
function foo()
{
    // function body
}

// conditional declaration is *not* a side effect
if (! function_exists('bar')) {
    function bar()
    {
        // function body
    }
}
```
Và đây là 1 file chuẩn theo PSR-1.
##### 1.2.3 NameSpace và Class Names
Namespace và Lớp ```PHẢI``` theo chuẩn “autoloading” PSR: [PSR-0, PSR-4]

Tên lớp lại ```PHẢI``` đúng dạng NameClass.

Ví dụ:
```php
<?php
// PHP 5.3 and later:
namespace Vendor\Model;

class Foo
{
}
```
##### 1.2.4 Class Constants, Properties, and Methods
```Hằng``` theo chuẩn ở trên, tất cả PHẢI viết hoa, phân cách từ bởi _

Ví dụ: 
```php
<?php
namespace Vendor\Model;

class Foo
{
    const VERSION = '1.0';
    const DATE_APPROVED = '2019-03-18';
}
```
```Method``` PHẢI được khai báo kiểu camelCase ().
#### 2. PSR-2 Coding Style Guide (Tiêu chuẩn trình bày code)
PSR-2 sẽ tạo cho bạn thói quen viết code đúng chuẩn, dễ đọc, đẹp.
#### 2.1 Tổng quan 
* Code ```PHẢI``` tuân thủ PSR-1
* Code ```PHẢI``` sử dụng 4 ký tự space để lùi khối (không dùng tab)
* Mỗi dòng code ```PHẢI``` dưới 120 ký tự, ```NÊN``` dưới 80 ký tự.
* ```PHẢI``` có 1 dòng trắng sau **namespace**, và ```PHẢI``` có một dòng trắng sau mỗi khối code.
* Ký tự mở Class **{** ```PHẢI``` ở dòng tiếp theo, và đóng Class **}** ```PHẢI``` ở dòng tiếp theo của body class.
* Ký tự  **{**  cho function ```PHẢI``` ở dòng tiếp theo, và ký tự **}** kết thúc hàm ```PHẢI``` ở dòng tiếp theo của body function.
* Các visibility (**public, private, protected**)  ```PHẢI``` được khai báo cho tất cả các hàm và các thuộc tính của Class;
* Các từ khóa điều khiển khối(**if, elseif, else**) ```PHẢI``` có một khoảng trống sau chúng; fucntion và Class thì ```KHÔNG ĐƯỢC``` làm như vậy.
* Mở khối  **{** cho cấu trúc điều khiển ```PHẢI``` trên cùng một dòng; và đóng khối này  **}** với ở dòng tiếp theo của thân khối.
* Hằng số **true, false, null** ```PHẢI``` viết với chữ thường.
* Từ khóa ```extends``` và ```implements``` phải cùng dòng với Class.
* ```implements``` nhiều lớp, thì mỗi lớp trên một dòng
* **keyword** var ```KHÔNG ĐƯỢC``` dùng sử dụng khai báo **property**.
* Tên property ```KHÔNG NÊN``` có tiền tố _ nhằm thể hiện thuộc protect hay private.
* Tham số cho hàm, phương thức: ```KHÔNG``` được thêm space vào trước dấu , và ```PHẢI``` có một space sau ,. Các tham số CÓ THỂ trên nhiều dòng, nếu làm như vậy thì PHẢI mỗi dòng 1 tham số.
* **abstract, final** ```PHẢI``` đứng trước visibility, còn **static** ```PHẢI``` đi sau.

##### Ví dụ dưới sẽ bao gồm nột số quy tắc ở trên một cách tổng quát: 
```php
<?php
namespace Vendor\Package;

use FooInterface;
use BarClass as Bar;
use OtherVendor\OtherPackage\BazClass;

class Foo extends Bar implements
    \ArrayAccess,
    \Countable,
    \Serializable
{
    public function sampleMethod($a, $b = null)
    {
        if ($a === $b) {
            bar();
        } elseif ($a > $b) {
            $foo->bar($arg1);
        } else {
            BazClass::bar($arg2, $arg3);
        }
    }

    final public static function bar()
    {
        // method body
    }
}
```
#### Ví dụ về Control Structures (cấu trúc điều khiển - if, elseif, else | switch, case ... )

```php
<?php

if ($expr1) {
    // if body
} elseif ($expr2) {
    // elseif body
} else {
    // else body;
}

// Switch - Case 
switch ($expr) {
    case 0:
        echo 'First case, with a break';
        break;
    case 1:
        echo 'Second case, which falls through';
        // no break
    case 2:
    case 3:
    case 4:
        echo 'Third case, return instead of break';
        return;
    default:
        echo 'Default case';
        break;
}

// While 
while ($expr) {
    // structure body
}

//do while
do {
    // structure body;
} while ($expr);

// For 
for ($i = 0; $i < 10; $i++) {
    // for body
}

// foreach
foreach ($iterable as $key => $value) {
    // foreach body
}

// try - catch 
try {
    // try body
} catch (FirstExceptionType $e) {
    // catch body
} catch (OtherExceptionType $e) {
    // catch body
}

// Closures

$closureWithArgs = function ($arg1, $arg2) {
    // body
};

$closureWithArgsAndVars = function ($arg1, $arg2) use ($var1, $var2) {
    // body
};
```

#### 3. PSR-3 Logger Interface (Giao diện logger)
PSR-3 Logger Interface: trình bày về các thành phần cần phải có của một Logger (ghi lại dấu vết của ứng dụng).

#### 3.1 Tổng quan

* LoggerInterface với 8 phương thức ghi log theo chuẩn RFC 5424 thương sẽ được chia thành key log: ```debug, info, notice, warning, error, critical, alert, emergency```
* Mọi method chỉ chấp nhận một string message, hoặc object dùng method a__toString() để chuyển tất cả sang tring.
* Message phải chứa placeholders với implementors phải replace giá trị từ array.
* Tên placeholders phải phù hợp với key log.
* Tên placeholders phải được phân cách bằng dấu ngoặc nhọn { và dấu ngoặc nhọn }.
* KHÔNG được chứa bất kỳ khoảng trắng giữa các ký tự tên placeholders.
* chỉ NÊN gồm các ký tự A-Z, a-z, 0-9, dấu gạch dưới _, và thời gian,.. 
Việc sử dụng các ký tự khác thì để xem trong tương lai có được áp dụng không.
Implementors CÓ THỂ sử dụng giữ chỗ để thực hiện các chiến lược thoát khác nhau và dịch các bản ghi để hiển thị. 
Người dùng KHÔNG NÊN pre-escape giá trị giữ chỗ vì họ không thể biết trong đó bối cảnh các dữ liệu sẽ được hiển thị.