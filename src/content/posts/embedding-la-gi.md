---
title: "Embedding là gì? Vì sao máy tìm được thứ 'gần nghĩa'"
date: 2026-11-24
description: "Bài mẫu để xem giao diện series có lab tương tác. Nội dung lấy từ Lab 01 của Embedding Labs."
categories: ["LLM", "embeddings"]
series: embeddings
seriesOrder: 1
lab: embeddings/01-embedding-space
---

## Đặt vấn đề

**ShopViet** là cửa hàng điện tử online, có trợ lý chat trả lời khách dựa trên khoảng 1 triệu đoạn chính sách, hướng dẫn và mô tả sản phẩm.

Khách gõ *"tai nghe không dây bị rè"*. Bài hướng dẫn đúng lại có tiêu đề *"Khắc phục lỗi âm thanh headphone bluetooth"*. Hai câu không có từ nào trùng, nên tìm theo từ khoá sẽ không ra.

Nếu mỗi từ chỉ là một mã số, máy không có cách nào biết từ nào gần nghĩa từ nào. Câu hỏi của bài này: làm sao biểu diễn từ để máy đo được "gần nghĩa" bằng một phép tính đơn giản?

## Lab: đặt từ vào không gian

Bấm **Mã số (one-hot)** để thấy mọi từ cách nhau như nhau. Bấm **Embedding** để thấy các từ tự gom nhóm. Thử chạy phép `king − man + woman`.

<div data-lab-slot></div>

## Embedding giải quyết gì

- **Biểu diễn ngữ nghĩa**: one-hot phân biệt danh tính từ nhưng không biểu diễn quan hệ ý nghĩa. Embedding có thể đặt "cat" và "kitten" gần nhau.
- **Giảm chiều**: vocabulary 100.000 từ cần 100.000 chiều với one-hot. Embedding chỉ cần 384 đến 3072 chiều mà chứa nhiều thông tin hơn.
- **Tính toán similarity**: đo "khoảng cách ý nghĩa" giữa hai khái niệm bất kỳ bằng phép toán vector đơn giản.
- **Transfer learning**: embedding được train trên dataset lớn có thể dùng cho task khác, không cần train lại từ đầu.
- **Multimodal bridge**: đặt text, image, audio vào cùng một không gian để so sánh chéo.

## Lịch sử rút gọn

| Thế hệ | Giải quyết gì | Còn thiếu gì |
|---|---|---|
| Static (Word2Vec, GloVe, FastText) | Học vector từ ngữ cảnh | Mỗi từ đúng 1 vector, "bank" ngân hàng và "bank" bờ sông dùng chung |
| Contextual (Transformer) | Vector đổi theo câu chứa từ đó | Chậm hơn, cần GPU |
| Sentence (Sentence-BERT) | Một vector cho cả câu, nhanh cho search | Kích thước cố định, tốn RAM khi kho lớn |
| Flexible (Matryoshka, model 2024-2026) | Cắt bớt chiều mà giữ chất lượng | Phải tự đo chất lượng sau khi cắt |

## Tiếp theo

Có vector rồi thì phải chọn thước đo để so hai vector. Bài sau: cosine, dot product và L2, và vì sao cùng hai vector mà ba thước đo cho ba thứ hạng khác nhau.
