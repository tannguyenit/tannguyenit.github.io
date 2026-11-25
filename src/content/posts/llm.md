---
title: "Prompt là gì? LLM hoạt động ra sao? Và làm sao để LLM có dữ liệu mới nhất?"
date: 2026-02-08
description: "LLM"
categories: ["LLM"]
---

> Bài viết này tổng hợp lại toàn bộ flow từ Prompt → LLM → Token → Transformer → Sampling → Output, và giải thích cách để LLM có thể trả lời dữ liệu mới nhất (RAG, Fine-tune, Retrain). Nội dung dành cho developer muốn hiểu bản chất thay vì chỉ dùng API.

* * *

1\. Prompt là gì?
-----------------

**Prompt** là input (đầu vào) mà chúng ta đưa vào một Large Language Model (LLM) để nó sinh ra output. Prompt về bản chất chỉ là một **string**.

Ví dụ:

    "Ronaldo là ai?"

Prompt có thể chứa:

*   câu hỏi
*   ngữ cảnh
*   format mong muốn
*   rule / constraint
*   persona / role

Nói đơn giản:
**Prompt là "cái mà mình nhét vào model" để model trả lời đúng ý mình.**

2\. Prompt Engineering là gì?
-----------------------------

**Prompt Engineering** là kỹ thuật thiết kế prompt sao cho:

*   model hiểu đúng ý
*   output đúng expectation
*   tránh trả lời sai hoặc lan man
*   format output đúng chuẩn
*   có thể tái sử dụng (reusable)

### Prompt Engineering giống code như thế nào?

Có thể hiểu giống như lập trình:

*   **Input** = prompt
*   **Business logic** = model reasoning (ẩn trong LLM)
*   **Output** = response

**Prompt engineering = viết prompt sao cho "chạy được" giống như code chạy đúng.**

* * *

3\. LLM là gì? Bản chất của LLM hoạt động như thế nào?
------------------------------------------------------

LLM (Large Language Model) là một AI model được train trên lượng text cực lớn (internet, sách, tài liệu…).

Nhưng bản chất của LLM rất đơn giản:

> LLM là hệ thống dự đoán token tiếp theo dựa trên xác suất.

4\. Token là gì?
-----------------

LLM **không đọc chữ theo kiểu con người đọc word**, mà nó đọc theo **token**.

👉 **Token** là một đơn vị nhỏ mà model dùng để xử lý input/output.

Token có thể là:

*   một từ (`football`)
*   một phần của từ (`foot` + `ball`)
*   dấu cách ( )
*   dấu chấm (`.`)
*   ký tự đặc biệt (`?`, `!`)
*   tiếng Việt có dấu sẽ bị tách khác nhau tùy tokenizer

### Ví dụ

Bạn nhập:

    Ronaldo là ai?

Model có thể tokenize thành kiểu như:

    ["Ronaldo", " là", " ai", "?"]

Hoặc có thể chi tiết hơn:

    ["Ron", "aldo", " là", " ai", "?"]

_(Lưu ý: đây chỉ là minh họa, token thực tế phụ thuộc vào tokenizer của từng model.)_

### Token quan trọng vì sao?

LLM hoạt động theo cơ chế: **dự đoán token tiếp theo, không phải dự đoán từ tiếp theo.**

Nên bản chất LLM giống như:

    Input tokens -> model -> output token tiếp theo -> nối vào -> repeat

Nó giống autocomplete, nhưng mạnh hơn rất nhiều.

### Token có phải ký tự không?

Không.

*   1 token có thể là 1 chữ
*   hoặc một cụm chữ
*   hoặc nửa chữ

Ví dụ tiếng Anh:

    unbelievable

Có thể thành:

    ["un", "believ", "able"]

5\. Context Window là gì?
--------------------------

**Context Window** là giới hạn bộ nhớ ngắn hạn của model trong một lần chat.

👉 Model có thể "nhìn thấy" tối đa bao nhiêu token trong input.

Một số mức context window phổ biến:

*   4k tokens
*   8k tokens
*   32k tokens
*   128k tokens

Nếu vượt quá giới hạn, model sẽ không thể đọc hết toàn bộ cuộc hội thoại hoặc tài liệu.

### Context Window bao gồm những gì?

Context window không chỉ gồm câu hỏi của bạn, mà gồm toàn bộ:

*   System prompt (instruction gốc)
*   Chat history (các tin nhắn trước đó)
*   Prompt hiện tại
*   Dữ liệu bạn nhét vào (RAG documents, tool outputs)
*   Và cả output mà model đang generate

👉 Tất cả đều tính vào token budget.

6\. Tại sao Context Window lại quan trọng?
-------------------------------------------

Vì nếu bạn chat dài quá:

*   model sẽ bắt đầu **quên các tin nhắn cũ**
*   hoặc framework sẽ tự động **cắt bớt history**
*   dẫn tới việc model trả lời kiểu mất logic, quên context

Ví dụ bạn chat 30 phút, tới phút 31 bạn hỏi:

    "còn cái ý số 3 hồi nãy?"

Model có thể trả lời sai vì **ý số 3 đã bị rớt khỏi context window**.

7\. LLM có "memory" không?
---------------------------

Bản chất LLM **không có memory lâu dài**.

Nó chỉ có:

*   **Context window** (short-term memory)
*   **Weights** (kiến thức đã train từ trước)

Nếu dữ liệu nằm ngoài context window, model gần như coi như không biết.

8\. Mối liên hệ giữa Token và Context Window
---------------------------------------------

Context window được đo bằng token.

Ví dụ model có context window = **8192 tokens**, nghĩa là:

👉 tổng input + history + output không được vượt quá ~8192 tokens.

9\. Context Window = "RAM" của LLM
-----------------------------------

Context window giống RAM hơn là ổ cứng:

*   **RAM:** nhanh nhưng giới hạn
*   **Ổ cứng:** lưu lâu nhưng model không tự truy cập được

👉 Context window là RAM.

Còn dữ liệu "thế giới" của model nằm trong weights (giống firmware/ROM).

10\. Ví dụ thực tế: Context Window bị cắt
------------------------------------------

Giả sử model context window chỉ có **10 tokens** (ví dụ giả lập).

Bạn chat như sau:

    Bạn là trợ lý AI.
    Ronaldo là ai?

Nếu tokenizer biến thành 12 tokens → vượt 10 tokens → hệ thống phải **cắt bớt**.

Ví dụ nó cắt mất câu:

    Bạn là trợ lý AI.

Thì model không còn biết vai trò nữa. Đó là lý do đôi khi bạn thấy model:

*   lúc đầu nói lịch sự
*   sau đó tự nhiên mất style

Vì instruction bị drop khỏi context window.

11\. Hallucination
---------------------------------------------------------

Hallucination là hiện tượng LLM trả lời **rất tự tin** nhưng nội dung lại **sai** hoặc **không có thật**. Một trong những nguyên nhân phổ biến nhất dẫn tới hallucination chính là việc **context window bị đầy** và hệ thống phải **cắt bớt token**.

### 1) Khi token bị cắt thì điều gì xảy ra?

Trong một cuộc hội thoại dài, prompt không chỉ bao gồm câu hỏi hiện tại mà còn bao gồm:

*   System prompt (instruction ban đầu)
*   Lịch sử chat (các message trước đó)
*   Dữ liệu từ RAG (tài liệu được nhét vào prompt)
*   Các output cũ

Khi tổng số token vượt quá giới hạn context window, hệ thống sẽ phải thực hiện **truncate** (cắt bớt một phần nội dung cũ).

Thông thường, các đoạn bị cắt sẽ là phần cũ nhất trong conversation.

### 2) Vì sao token bị cắt dễ gây hallucination?

LLM không phải là một hệ thống "search database" hoặc "lookup knowledge". Nó hoạt động bằng cách:

    Nhìn context hiện tại → dự đoán token tiếp theo → nối vào output → lặp lại

Nếu các token quan trọng bị cắt (ví dụ: định nghĩa, rule business, dữ liệu gốc), thì model sẽ **không còn đủ thông tin** để trả lời chính xác.

Tuy nhiên, LLM vẫn phải tiếp tục generate output. Và vì bản chất của nó là một hệ thống dự đoán xác suất, nó sẽ chọn câu trả lời "có vẻ hợp lý nhất" dựa vào các pattern trong dữ liệu training.

👉 Kết quả là model có thể **tự bịa ra câu trả lời**. Đó chính là hallucination.

### 3) Ví dụ hallucination do context window bị cắt

Giả sử ở đầu cuộc chat bạn định nghĩa:

    Trong hệ thống này, user role = ADMIN thì được xóa tenant.

Sau khi chat dài, đoạn này bị cắt khỏi context window.

Bạn hỏi tiếp:

    Role STAFF có được xóa tenant không?

Vì model không còn thấy rule ban đầu nữa, nó sẽ trả lời theo kiểu suy luận phổ biến:

    Không, STAFF thường không có quyền xóa tenant.

Nhưng nếu business rule thật sự của bạn là:

    STAFF vẫn được xóa tenant nếu có permission flag đặc biệt.

Thì model đã trả lời sai, nhưng lại trả lời rất tự tin.

👉 Đây chính là hallucination.

### 4) Hallucination không phải bug, mà là bản chất

Hallucination không hẳn là "lỗi phần mềm", mà là hậu quả tự nhiên của cách LLM hoạt động:

*   LLM không truy cập database thật
*   LLM không verify fact
*   LLM chỉ dự đoán token tiếp theo dựa trên context đang có

Nếu context bị thiếu, model sẽ tự "điền" phần còn thiếu bằng kiến thức thống kê đã học.

### 5) Một số dạng hallucination phổ biến do token bị cắt

*   **Quên format output:** bạn yêu cầu output JSON nhưng đoạn instruction bị cắt → model trả về text bình thường.
*   **Bịa ra số liệu:** bạn hỏi doanh thu tháng 1 nhưng dữ liệu đã bị cắt khỏi context → model tự đoán.
*   **Bịa tên class/function:** bạn nói có class `NotificationProcessor` nhưng bị cắt → model tự sinh ra class khác.
*   **Bịa logic business:** model mất rule ban đầu → suy luận theo logic phổ biến nhưng sai với hệ thống của bạn.

### 6) Tóm tắt

    Token bị cắt → mất dữ liệu input → model thiếu context → model đoán theo thống kê → hallucination

Nên hallucination đôi khi chỉ đơn giản là:

> "LLM đang trả lời một câu hỏi mà nó không còn đủ context để trả lời đúng."

* * *

12\. Ví dụ thực tế: Khi hỏi "Ronaldo là ai?" thì chuyện gì xảy ra?
------------------------------------------------------------

User nhập:

    Ronaldo là ai?

LLM sẽ chạy pipeline nội bộ:

*   tokenize input
*   biến token thành vector
*   transformer xử lý context
*   dự đoán token tiếp theo
*   lặp đến khi đủ câu trả lời

13\. Step-by-step Flow khi LLM nhận câu hỏi
--------------------------------------------

*   **Step 1:** Nhận prompt
*   **Step 2:** Tokenization
*   **Step 3:** Embedding
*   **Step 4:** Transformer xử lý ngữ cảnh
*   **Step 5:** Predict token tiếp theo
*   **Step 6:** Sampling
*   **Step 7:** Append token và lặp
*   **Step 8:** Stop condition

14\. Diagram Flow LLM
---------------------

    USER INPUT
       ↓
    TOKENIZATION
       ↓
    EMBEDDING
       ↓
    TRANSFORMER
       ↓
    LOGITS
       ↓
    SOFTMAX
       ↓
    SAMPLING
       ↓
    NEXT TOKEN
       ↓
    LOOP
       ↓
    FINAL RESPONSE

15\. Xác suất token dựa vào đâu?
---------------------------------

Model được train bằng cách đọc hàng tỷ câu text và học dự đoán token tiếp theo.

Xác suất token nằm trong khoảng **0 đến 1** và tổng xác suất của toàn bộ token luôn bằng **1**.

* * *

16\. Làm sao để LLM có dữ liệu mới nhất?
------------------------------------------

LLM không tự update realtime. Có 3 cách:

*   **Train lại model** (rất tốn kém)
*   **Fine-tune** (học thêm domain/style)
*   **RAG** (phổ biến nhất)

17\. Diagram kiến trúc RAG
---------------------------

    USER
      ↓
    BACKEND API
      ↓
    DATABASE / VECTOR DB
      ↓
    RETRIEVED CONTEXT
      ↓
    PROMPT CONSTRUCTION
      ↓
    LLM
      ↓
    FINAL RESPONSE

* * *

18\. Prompt Template chuẩn cho Developer
-----------------------------------------

### Template 1: Role + Task + Constraints

    You are a senior software engineer.

    Task:
    Explain what a database index is.

    Constraints:
    - Use Vietnamese
    - Use bullet points
    - Provide at least 1 real SQL example
    - Keep it short (max 200 words)

    Output format:
    - Definition
    - Example
    - Notes

### Template 2: System + Context + Question

    System:
    You are an expert assistant.

    Context:
    We are building a NestJS backend. The database is PostgreSQL.

    Question:
    How to optimize queries with indexes?

    Rules:
    - Mention B-Tree
    - Mention EXPLAIN ANALYZE
    - Give example query

### Template 3: Few-shot

    You are an assistant that converts user requirements into SQL.

    Example:
    User: List all employees
    Output:
    SELECT * FROM employees;

    Example:
    User: List employees older than 30
    Output:
    SELECT * FROM employees WHERE age > 30;

    Now answer this:
    User: List employees in department IT older than 25
    Output:

### Template 4: Prompt chuẩn cho RAG

    You are a helpful assistant.

    Use ONLY the following context to answer the question.
    If the answer is not in the context, say "I don't know".

    Context:
    {{context}}

    Question:
    {{question}}

    Answer:

* * *

19\. Ollama là gì?
-------------------

Ollama là tool giúp chạy LLM local nhanh và expose API tại localhost.

20\. HuggingFace Transformers là gì?
--------------------------------------

HuggingFace Transformers là thư viện Python giúp load model, tokenize, chạy inference, debug tokenization/logits.

21\. Ollama vs HuggingFace
---------------------------

| Tiêu chí                | Ollama   | HuggingFace Transformers |
| ----------------------- | -------- | ------------------------ |
| Dễ cài                  | ✅ Rất dễ | ❌ phức tạp hơn           |
| Chạy model local nhanh  | ✅        | ✅                        |
| Dễ gọi API              | ✅        | ❌                        |
| Debug token, logits     | ❌ khó    | ✅ rất mạnh               |
| Phù hợp demo / test     | ✅        | ⚠️                       |
| Phù hợp nghiên cứu flow | ❌        | ✅                        |

22\. Code mẫu gọi Ollama API
------------------------------

    import requests

    url = "http://localhost:11434/api/generate"

    payload = {
        "model": "llama3.2",
        "prompt": "Ronaldo là ai?",
        "stream": False
    }

    response = requests.post(url, json=payload)
    data = response.json()

    print("Response:", data["response"])

23\. Code debug HuggingFace (token + logits)
---------------------------------------------

    import torch
    from transformers import AutoTokenizer, AutoModelForCausalLM

    MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

    prompt = "Who is Obama?"
    inputs = tokenizer(prompt, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    last_token_logits = logits[0, -1]

    probs = torch.softmax(last_token_logits, dim=-1)
    top_probs, top_indices = torch.topk(probs, 5)

    print("Top 5 next token predictions:")
    for prob, idx in zip(top_probs, top_indices):
        token = tokenizer.decode([idx.item()])
        print(f"Token: {repr(token)} - Prob: {prob.item():.4f}")

Output:
```
=== PROMPT ===
Who is Obama?

=== TOKENS ===
['Who', 'Ġis', 'ĠObama', '?']

=== GENERATION DEBUG ===

--- Step 1 ---
Token: '\n'            | Prob: 0.3131
Token: ' What'         | Prob: 0.0408
Token: ' Why'          | Prob: 0.0254
Token: ' Who'          | Prob: 0.0240
Token: ' The'          | Prob: 0.0238
Current output: Who is Obama?


--- Step 2 ---
Token: '\n'            | Prob: 0.9846
Token: 'The'           | Prob: 0.0021
Token: 'In'            | Prob: 0.0007
Token: 'I'             | Prob: 0.0007
Token: 'This'          | Prob: 0.0006
Current output: Who is Obama?


--- Step 3 ---
Token: 'Obama'         | Prob: 0.1506
Token: 'The'           | Prob: 0.0894
Token: 'In'            | Prob: 0.0314
Token: 'It'            | Prob: 0.0222
Token: '"'             | Prob: 0.0221
Current output: Who is Obama?

Obama

--- Step 4 ---
Token: ' is'           | Prob: 0.2831
Token: ' has'          | Prob: 0.1094
Token: "'s"            | Prob: 0.0875
Token: ' was'          | Prob: 0.0668
Token: ','             | Prob: 0.0537
Current output: Who is Obama?

Obama is

--- Step 5 ---
Token: ' the'          | Prob: 0.2499
Token: ' a'            | Prob: 0.2078
Token: ' not'          | Prob: 0.0794
Token: ' an'           | Prob: 0.0417
Token: ' Obama'        | Prob: 0.0192
Current output: Who is Obama?

Obama is the

--- Step 6 ---
Token: ' president'    | Prob: 0.1474
Token: ' most'         | Prob: 0.0543
Token: ' first'        | Prob: 0.0492
Token: ' only'         | Prob: 0.0389
Token: ' President'    | Prob: 0.0301
Current output: Who is Obama?

Obama is the president

--- Step 7 ---
Token: ' of'           | Prob: 0.5815
Token: ' who'          | Prob: 0.1236
Token: '.'             | Prob: 0.0478
Token: ','             | Prob: 0.0376
Token: '-'             | Prob: 0.0302
Current output: Who is Obama?

Obama is the president of

--- Step 8 ---
Token: ' the'          | Prob: 0.8773
Token: ' a'            | Prob: 0.0176
Token: ' America'      | Prob: 0.0105
Token: ' our'          | Prob: 0.0062
Token: ' United'       | Prob: 0.0058
Current output: Who is Obama?

Obama is the president of the

--- Step 9 ---
Token: ' United'       | Prob: 0.9511
Token: ' U'            | Prob: 0.0059
Token: ' world'        | Prob: 0.0059
Token: ' USA'          | Prob: 0.0041
Token: ' US'           | Prob: 0.0036
Current output: Who is Obama?

Obama is the president of the United

--- Step 10 ---
Token: ' States'       | Prob: 0.9983
Token: ' State'        | Prob: 0.0004
Token: ' Nations'      | Prob: 0.0004
Token: ' Kingdom'      | Prob: 0.0002
Token: ' Arab'         | Prob: 0.0001
Current output: Who is Obama?

Obama is the president of the United States

=== FINAL OUTPUT ===
Who is Obama?

Obama is the president of the United States
```

* * *

24\. Tổng kết (TL;DR)
----------------------

*   Prompt là string
*   Prompt engineering giống viết code
*   LLM dự đoán token tiếp theo dựa trên xác suất
*   Token là đơn vị xử lý cơ bản, không phải từ hay ký tự
*   Context window là "RAM" của LLM - có giới hạn token
*   Token bị cắt → mất context → model hallucinate
*   Muốn dữ liệu mới nhất: dùng RAG
