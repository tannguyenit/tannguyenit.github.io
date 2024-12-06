---
layout: post
title:  "Certificates, Identifiers & Profiles App IOS"
author: tannguyen
categories: [ ios ]
image: assets/images/post/2024/Certificates-Identifiers-Profiles.webp
description: "Certificates, Identifiers & Profiles App IOS"
featured: true
hidden: true
---

> Đặt vấn đề: Trong quá trình phát triển ứng dụng iOS, Certificates, Identifiers & Profiles là ba khái niệm quan trọng, liên kết chặt chẽ với nhau để đảm bảo tính bảo mật và xác thực của ứng dụng. Chúng hoạt động như một hệ thống xác thực ba lớp, giúp Apple xác định danh tính của nhà phát triển, ứng dụng và các thiết bị được phép cài đặt ứng dụng.

### Certificates (Chứng chỉ)
* **Vai trò:** Xác minh danh tính của nhà phát triển.
* **Hoạt động:** Khi bạn tạo một chứng chỉ, bạn sẽ tạo một cặp khóa công khai và riêng tư. Khóa công khai được gửi lên Apple, còn khóa riêng tư được lưu trữ trên máy của bạn. Khi bạn xây dựng ứng dụng, khóa riêng tư sẽ được sử dụng để ký vào ứng dụng, chứng minh rằng ứng dụng đó đến từ bạn.
* **Loại:** Có hai loại chứng chỉ chính:
  * **Development Certificate:** Dùng để phát triển và thử nghiệm ứng dụng trên các thiết bị thực.
  * **Distribution Certificate:** Dùng để phân phối ứng dụng lên App Store hoặc cài đặt trực tiếp lên các thiết bị.

### Identifiers (ID ứng dụng)
* **Vai trò:** Định danh duy nhất cho một ứng dụng.
* **Hoạt động:** Mỗi ứng dụng iOS cần có một App ID duy nhất, thường có dạng một chuỗi ký tự đảo ngược tên miền (ví dụ: com.yourcompany.yourapp). App ID này được sử dụng để liên kết ứng dụng với các dịch vụ khác của Apple, như Push Notifications, Game Center, In-App Purchases.
* **Loại:** Có hai loại App ID chính:
  * **Explicit App ID:** Một ID cụ thể cho một ứng dụng duy nhất.
  * **Wildcard App ID:** Một ID chung cho nhiều ứng dụng, thường dùng cho các ứng dụng có cấu trúc tương tự nhau.

### Provisioning Profiles (Hồ sơ cung cấp)
* **Vai trò:** Kết nối tất cả các thành phần lại với nhau.
* **Hoạt động:** Provisioning profile là một file cấu hình chứa thông tin về:
  * **App ID:** Xác định ứng dụng.
  * **Certificates:** Xác minh danh tính nhà phát triển.
  * **Devices:** Danh sách các thiết bị được phép cài đặt ứng dụng.
* **Loại:** Tùy thuộc vào mục đích sử dụng, có các loại provisioning profile khác nhau như:
  * **Development:** Dùng để phát triển và thử nghiệm.
  * **Distribution:** Dùng để phân phối.
  * **Ad Hoc:** Dùng để phân phối nội bộ cho một số lượng thiết bị giới hạn.

### Mối quan hệ giữa chúng
* **Certificates** xác minh rằng bạn là ai.
* **Identifiers** xác định ứng dụng của bạn là gì.
* **Provisioning Profiles** kết hợp cả hai và cho phép bạn cài đặt ứng dụng lên các thiết bị cụ thể.

Ví dụ: Khi bạn muốn cài đặt một ứng dụng lên iPhone của mình để thử nghiệm, bạn cần:

1. Tạo một Development Certificate để chứng minh bạn là nhà phát triển.
2. Tạo một App ID để định danh ứng dụng.
3. Tạo một Provisioning Profile kết hợp cả Certificate và App ID, đồng thời thêm iPhone của bạn vào danh sách các thiết bị được phép.
4. Nhúng Provisioning Profile vào ứng dụng và xây dựng lại.

**Tóm lại:** Hệ thống Certificates, Identifiers & Profiles là một cơ chế bảo mật quan trọng của Apple, giúp đảm bảo rằng chỉ những ứng dụng được xác thực mới có thể được cài đặt và chạy trên các thiết bị iOS. Việc hiểu rõ mối quan hệ giữa các thành phần này là rất cần thiết để phát triển ứng dụng iOS một cách hiệu quả.

