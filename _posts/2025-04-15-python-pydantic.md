---
layout: post
title:  "Tìm Hiểu Pydantic - Tổng Hợp Khái Niệm và So Sánh Với Laravel"
author: tannguyen
categories: [ pydantic ]
image: assets/images/post/2025/pydantic.png
description: "Pydantic"
featured: false
hidden: false
---

# 🎥 Tìm Hiểu Pydantic - Tổng Hợp Khái Niệm và So Sánh Với Laravel

Xin chào mọi người! 👋 Chào mừng các bạn đến với vlog công nghệ của mình! Hôm nay, mình sẽ chia sẻ về **Pydantic**, một thư viện Python cực kỳ mạnh mẽ dùng để xác thực và xử lý dữ liệu. Mình đã tìm hiểu Pydantic trong thời gian qua, và mình muốn tổng hợp lại tất cả các khái niệm chính để các bạn dễ nắm bắt. Vì mình biết nhiều bạn quen với Laravel (PHP), mình sẽ so sánh trực tiếp từng khái niệm của Pydantic với Laravel để các bạn dễ hình dung. Dù bạn mới bắt đầu hay muốn ôn lại kiến thức, bài viết này sẽ rất hữu ích. Cùng bắt đầu nào! 🚀

---

## 📌 Pydantic Là Gì?

Pydantic là một thư viện Python giúp bạn **xác thực** và **chuyển đổi dữ liệu** (serialize) dựa trên type hints. Nó thường được dùng trong các dự án như FastAPI để xây dựng API, xử lý JSON, và đảm bảo dữ liệu đúng định dạng. Hãy nghĩ Pydantic như một "người gác cổng" thông minh cho code của bạn! 😎

Mình đang dùng Pydantic phiên bản 2.10, và dưới đây là tổng hợp các khái niệm chính, cùng với so sánh trực tiếp với Laravel.

---

## 1. Models (Mô Hình) 📋

### Pydantic: Models là gì?

**Models** là nền tảng của Pydantic. Bạn tạo một mô hình bằng cách kế thừa từ `BaseModel`. Mỗi trường trong mô hình được khai báo với type hints, và Pydantic tự động xác thực dữ liệu.

#### Ví dụ: Mô hình Person

Đây là một mô hình `Person` mà mình đã làm:

```python
from pydantic import BaseModel, EmailStr, PositiveInt

class Person(BaseModel):
    name: str
    age: PositiveInt
    email: EmailStr

person = Person(name="John", age=30, email="john@example.com")
print(person)  # Person(name='John', age=30, email='john@example.com')
```

- `name: str`: Tên là một chuỗi.
- `age: PositiveInt`: Tuổi phải là số nguyên dương.
- `email: EmailStr`: Email phải đúng định dạng.

Nếu mình nhập sai, như `age=-5` hoặc `email="khong-phai-email"`, Pydantic sẽ báo lỗi `ValidationError`.

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **Eloquent Model**. Eloquent Model vừa dùng để ánh xạ dữ liệu từ database, vừa có thể xác thực dữ liệu (dù không mạnh bằng Pydantic).

#### Ví dụ trong Laravel:

```php
class Person extends Model
{
    protected $fillable = ['name', 'age', 'email'];
}

$person = Person::create([
    'name' => 'John',
    'age' => 30,
    'email' => 'john@example.com'
]);
```

#### Điểm khác biệt:

- **Pydantic**: Tập trung vào xác thực dữ liệu dựa trên type hints (`str`, `PositiveInt`), không liên quan đến database.
- **Laravel**: Eloquent chủ yếu để làm việc với database, còn xác thực thường nằm trong controller hoặc request:

  ```php
  $request->validate([
      'name' => 'required|string',
      'age' => 'required|integer|min:1',
      'email' => 'required|email',
  ]);
  ```

---

## 2. Fields (Trường) 🛠️

### Pydantic: Fields là gì?

**Fields** cho phép bạn thêm thông tin bổ sung cho các trường trong mô hình, như giá trị mặc định, ràng buộc, hoặc mô tả, bằng cách dùng `Field`.

#### Ví dụ: Thêm mô tả

Mình đã dùng `Field` trong một mô hình chatbot:

```python
class BaseChatBotRead(BaseModel):
    name: str = Field(description="Tên của chatbot.")
    title: str = Field(description="Tiêu đề của chatbot.")

chatbot = BaseChatBotRead(name="Bot", title="Chào mừng")
print(chatbot)  # BaseChatBotRead(name='Bot', title='Chào mừng')
```

- `description`: Thêm mô tả, rất hữu ích khi tạo tài liệu API với FastAPI.
- Có thể thêm ràng buộc như `min_length`, `max_length`, hoặc `default`.

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **quy tắc xác thực** trong `$request->validate()` hoặc **casts** trong Eloquent Model.

#### Ví dụ trong Laravel:

Xác thực trong controller:

```php
$request->validate([
    'name' => 'required|string',
    'title' => 'required|string',
]);
```

Hoặc định nghĩa trong Eloquent Model:

```php
class ChatBot extends Model
{
    protected $casts = [
        'name' => 'string',
        'title' => 'string',
    ];
}
```

#### Điểm khác biệt:

- **Pydantic**: Dùng `Field` để khai báo ràng buộc trực tiếp trong mô hình, dựa trên type hints.
- **Laravel**: Quy tắc xác thực nằm trong controller hoặc request, không gắn chặt với model.

---

## 3. JSON Schema (Lược Đồ JSON) 📜

### Pydantic: JSON Schema là gì?

Pydantic tự động tạo **JSON Schema** cho mô hình, mô tả cấu trúc dữ liệu (các trường, kiểu, ràng buộc). Điều này rất hữu ích khi làm việc với FastAPI để tạo tài liệu API.

#### Ví dụ: Tạo lược đồ

Với mô hình `Person`:

```python
print(Person.model_json_schema())
```

Kết quả sẽ giống như:

```json
{
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer", "minimum": 1},
        "email": {"type": "string", "format": "email"}
    },
    "required": ["name", "age", "email"]
}
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **OpenAPI/Swagger**. Bạn có thể dùng các gói như `swagger-php` để tạo tài liệu API.

#### Ví dụ trong Laravel:

```php
/**
 * @OA\Post(
 *     path="/person",
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="age", type="integer", minimum=1),
 *             @OA\Property(property="email", type="string", format="email")
 *         )
 *     )
 * )
 */
public function store(Request $request) { ... }
```

#### Điểm khác biệt:

- **Pydantic**: Tự động tạo JSON Schema từ mô hình, tích hợp sẵn với FastAPI.
- **Laravel**: Cần dùng công cụ bên ngoài như Swagger và viết thủ công annotation.

---

## 4. JSON 🔄

### Pydantic: JSON là gì?

Pydantic giúp bạn dễ dàng **serialize** (chuyển mô hình thành JSON) và **deserialize** (chuyển JSON thành mô hình).

#### Ví dụ: Làm việc với JSON

Mình đã dùng Pydantic để tải danh sách người từ file JSON:

```python
import pathlib
from pydantic import TypeAdapter

person_list_adapter = TypeAdapter(list[Person])
json_string = pathlib.Path('people.json').read_text()
people = person_list_adapter.validate_json(json_string)
print(people)  # [Person(name='John', ...), Person(name='Jane', ...)]
```

### So sánh với Laravel

Trong Laravel, Eloquent Model tự động hỗ trợ serialize sang JSON bằng `toJson()` hoặc `toArray()`.

#### Ví dụ trong Laravel:

```php
$person = Person::create(['name' => 'John', 'age' => 30, 'email' => 'john@example.com']);
return $person->toJson(); // {"name": "John", "age": 30, "email": "john@example.com"}
```

#### Điểm khác biệt:

- **Pydantic**: Tích hợp xác thực chặt chẽ khi deserialize (như kiểm tra email hợp lệ).
- **Laravel**: Serialize dễ dàng, nhưng không tự động xác thực khi chuyển từ JSON về model.

---

## 5. Types (Kiểu Dữ Liệu) 📏

### Pydantic: Types là gì?

Pydantic cung cấp các kiểu dữ liệu đặc biệt như `EmailStr`, `PositiveInt`, `HttpUrl`, v.v., để xác thực dễ dàng hơn.

#### Ví dụ: Dùng kiểu đặc biệt

Trong mô hình `Person`:

```python
age: PositiveInt  # Phải là số nguyên dương
email: EmailStr   # Phải là email hợp lệ
```

Nếu mình nhập `email="khong-hop-le"`, Pydantic sẽ báo lỗi:

```python
person = Person(name="John", age=30, email="khong-hop-le")  # ValidationError: Email không hợp lệ
```

### So sánh với Laravel

Trong Laravel, bạn dùng **quy tắc xác thực** để đạt hiệu quả tương tự.

#### Ví dụ trong Laravel:

```php
$request->validate([
    'age' => 'required|integer|min:1',
    'email' => 'required|email',
]);
```

#### Điểm khác biệt:

- **Pydantic**: Dựa vào type hints (`EmailStr`, `PositiveInt`), tự động và gắn liền với mô hình.
- **Laravel**: Quy tắc xác thực thủ công, nằm trong controller hoặc request.

---

## 6. Unions (Hợp Nhất Kiểu) 🤝

### Pydantic: Unions là gì?

Pydantic hỗ trợ **Union** để một trường có thể nhận nhiều kiểu dữ liệu. **Discriminated Unions** dùng một trường (discriminator) để phân biệt kiểu.

#### Ví dụ: Discriminated Union

Mình đã thử với một mô hình thú cưng:

```python
from pydantic import BaseModel, Field
from typing import Literal, Union

class Cat(BaseModel):
    type: Literal["cat"] = Field(..., discriminator="type")
    meow: str

class Dog(BaseModel):
    type: Literal["dog"] = Field(..., discriminator="type")
    bark: str

class Pet(BaseModel):
    animal: Union[Cat, Dog]

pet = Pet(animal={"type": "cat", "meow": "Meo meo!"})
print(pet)  # Pet(animal=Cat(type='cat', meow='Meo meo!'))
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **polymorphic relationships** trong Eloquent, hoặc logic thủ công trong xác thực.

#### Ví dụ trong Laravel:

```php
class Pet extends Model
{
    public function animal()
    {
        return $this->morphTo();
    }
}

$pet = Pet::create(['animal_type' => 'cat', 'animal_id' => 1]);
```

Hoặc xác thực thủ công:

```php
$request->validate([
    'animal.type' => 'required|in:cat,dog',
    'animal.meow' => 'required_if:animal.type,cat',
    'animal.bark' => 'required_if:animal.type,dog',
]);
```

#### Điểm khác biệt:

- **Pydantic**: Tự động hóa với `Union` và `discriminator`, dựa trên type hints.
- **Laravel**: Cần viết logic thủ công hoặc dùng quan hệ đa hình.

---

## 7. Alias (Bí Danh) 🔄

### Pydantic: Alias là gì?

**Alias** cho phép dùng tên khác cho trường trong JSON, nhưng vẫn giữ tên thân thiện trong code Python.

#### Ví dụ: Dùng bí danh

Mình có thể chỉnh `Person` như sau:

```python
class Person(BaseModel):
    full_name: str = Field(..., alias="fullName")

person = Person.model_validate({"fullName": "John Doe"})
print(person.full_name)  # John Doe
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **accessors** hoặc **attribute casting**.

#### Ví dụ trong Laravel:

```php
class Person extends Model
{
    protected $appends = ['fullName'];

    public function getFullNameAttribute()
    {
        return $this->attributes['full_name'];
    }
}

$person = Person::create(['full_name' => 'John Doe']);
return $person->toArray(); // ['full_name' => 'John Doe', 'fullName' => 'John Doe']
```

#### Điểm khác biệt:

- **Pydantic**: Alias tích hợp sẵn trong mô hình, tự động ánh xạ khi serialize/deserialize.
- **Laravel**: Cần viết accessor hoặc dùng `$casts` để xử lý thủ công.

---

## 8. Configuration (Cấu Hình) ⚙️

### Pydantic: Configuration là gì?

Pydantic cho phép cấu hình mô hình qua `model_config` (hoặc `ConfigDict`) để thay đổi hành vi mặc định.

#### Ví dụ: Ánh xạ từ ORM

Mình đã dùng `ConfigDict` trong một mô hình công ty:

```python
class CompanyModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    public_key: str
    domains: list[str]
```

- `from_attributes=True`: Cho phép ánh xạ từ đối tượng ORM (như SQLAlchemy).

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **cấu hình model** qua các thuộc tính như `$hidden`, `$casts`.

#### Ví dụ trong Laravel:

```php
class Company extends Model
{
    protected $hidden = ['password'];
    protected $casts = ['domains' => 'array'];
}
```

#### Điểm khác biệt:

- **Pydantic**: Cấu hình linh hoạt, gắn trực tiếp với mô hình, hỗ trợ nhiều tùy chọn (như `exclude`, `from_attributes`).
- **Laravel**: Cấu hình trong model, nhưng tập trung vào database hơn là xác thực.

---

## 9. Serialization (Chuyển Đổi Dữ Liệu) 📤

### Pydantic: Serialization là gì?

Pydantic hỗ trợ **serialize** (chuyển mô hình thành JSON/dict) và **deserialize** (chuyển JSON/dict thành mô hình).

#### Ví dụ: Serialize và Deserialize

Mình đã dùng `TypeAdapter` để deserialize JSON:

```python
person_list_adapter = TypeAdapter(list[Person])
json_string = pathlib.Path('people.json').read_text()
people = person_list_adapter.validate_json(json_string)
```

### So sánh với Laravel

Trong Laravel, Eloquent Model tự động hỗ trợ serialize bằng `toJson()` hoặc `toArray()`.

#### Ví dụ trong Laravel:

```php
$company = Company::first();
return $company->toJson();
```

#### Điểm khác biệt:

- **Pydantic**: Tích hợp xác thực khi deserialize, đảm bảo dữ liệu đầu vào đúng định dạng.
- **Laravel**: Serialize dễ dàng, nhưng không tự động xác thực khi deserialize.

---

## 10. Validators (Xác Thực Tùy Chỉnh) ✅

### Pydantic: Validators là gì?

Pydantic cho phép định nghĩa **validators** tùy chỉnh để kiểm tra hoặc biến đổi dữ liệu.

#### Ví dụ: Validator tùy chỉnh

Mình có thể thêm validator cho `Person`:

```python
from pydantic import BaseModel, field_validator

class Person(BaseModel):
    name: str

    @field_validator("name")
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Tên không được để trống")
        return v
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **custom validation rules**.

#### Ví dụ trong Laravel:

```php
$request->validate([
    'name' => ['required', function ($attribute, $value, $fail) {
        if (empty(trim($value))) {
            $fail('Tên không được để trống.');
        }
    }],
]);
```

#### Điểm khác biệt:

- **Pydantic**: Validator gắn trực tiếp với mô hình, dựa trên type hints.
- **Laravel**: Validator nằm trong controller/request, cần viết logic thủ công.

---

## 11. Dataclasses (Lớp Dữ Liệu) 📦

### Pydantic: Dataclasses là gì?

Pydantic cung cấp `@pydantic.dataclasses.dataclass`, kết hợp cú pháp dataclass với xác thực Pydantic.

#### Ví dụ: Dùng Dataclasses

Mình đã dùng `@dataclass` trong `Principal`:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Principal:
    key: str
    value: str

    def __repr__(self) -> str:
        return f"{self.key}:{self.value}"
```

Nếu dùng Pydantic:

```python
from pydantic.dataclasses import dataclass

@dataclass
class Principal:
    key: str = Field(..., min_length=1)
    value: str = Field(..., min_length=1)
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **DTO** (Data Transfer Object) hoặc một class PHP đơn giản.

#### Ví dụ trong Laravel:

```php
class Principal
{
    public $key;
    public $value;

    public function __construct($data)
    {
        if (empty($data['key']) || empty($data['value'])) {
            throw new Exception("Key và Value không được để trống");
        }
        $this->key = $data['key'];
        $this->value = $data['value'];
    }
}
```

#### Điểm khác biệt:

- **Pydantic**: Kết hợp dataclass với xác thực tự động.
- **Laravel**: DTO cần viết logic xác thực thủ công.

---

## 12. Forward Annotations (Tham Chiếu Trước) 🔗

### Pydantic: Forward Annotations là gì?

Pydantic hỗ trợ **forward references** để dùng tên lớp trước khi định nghĩa, bằng cách dùng chuỗi trong type hints.

#### Ví dụ:

```python
class Person(BaseModel):
    friend: "Person"  # Tham chiếu trước
```

### So sánh với Laravel

Laravel không có khái niệm tương tự, nhưng giống cách khai báo quan hệ đệ quy trong Eloquent.

#### Ví dụ trong Laravel:

```php
class Person extends Model
{
    public function friend()
    {
        return $this->belongsTo(Person::class);
    }
}
```

#### Điểm khác biệt:

- **Pydantic**: Dùng forward references để xử lý kiểu đệ quy.
- **Laravel**: Xử lý đệ quy qua quan hệ Eloquent.

---

## 13. Strict Mode (Chế Độ Nghiêm Ngặt) 🚨

### Pydantic: Strict Mode là gì?

**Strict Mode** yêu cầu dữ liệu đầu vào phải khớp chính xác với kiểu khai báo, không tự động chuyển đổi.

#### Ví dụ:

```python
class Person(BaseModel):
    model_config = ConfigDict(strict=True)
    age: int

person = Person(age="30")  # Lỗi: Strict mode không chuyển "30" thành 30
```

### So sánh với Laravel

Trong Laravel, bạn có thể dùng `strict` trong quy tắc xác thực.

#### Ví dụ trong Laravel:

```php
$request->validate([
    'age' => 'required|integer|strict',
]);
```

#### Điểm khác biệt:

- **Pydantic**: Strict mode tích hợp trong mô hình.
- **Laravel**: Strict mode cần khai báo trong quy tắc xác thực.

---

## 14. Type Adapter (Bộ Điều Hợp Kiểu) 🔄

### Pydantic: Type Adapter là gì?

**TypeAdapter** dùng để xác thực/serialize dữ liệu cho một kiểu cụ thể mà không cần `BaseModel`.

#### Ví dụ:

Mình đã dùng `TypeAdapter` để xử lý danh sách `Person`:

```python
person_list_adapter = TypeAdapter(list[Person])
json_string = pathlib.Path('people.json').read_text()
people = person_list_adapter.validate_json(json_string)
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là xác thực mảng dữ liệu.

#### Ví dụ trong Laravel:

```php
$request->validate([
    'people' => 'required|array',
    'people.*.name' => 'required|string',
    'people.*.age' => 'required|integer|min:1',
    'people.*.email' => 'required|email',
]);
```

#### Điểm khác biệt:

- **Pydantic**: Dựa vào type hints, tự động hóa với `TypeAdapter`.
- **Laravel**: Cần khai báo quy tắc xác thực thủ công.

---

## 15. Validation Decorator (Decorator Xác Thực) ✅

### Pydantic: Validation Decorator là gì?

`@validate_call` là decorator dùng để xác thực tham số hàm dựa trên type hints.

#### Ví dụ:

Mình đã dùng `@validate_call` trong hàm `repeat`:

```python
from pydantic import validate_call

@validate_call
def repeat(s: str, count: int, *, separator: bytes = b'') -> bytes:
    b = s.encode()
    return separator.join(b for _ in range(count))

result = repeat('x', '4', separator=b' ')  # b'x x x x'
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là `$request->validate()` trong controller.

#### Ví dụ trong Laravel:

```php
public function repeat(Request $request)
{
    $data = $request->validate([
        's' => 'required|string',
        'count' => 'required|integer',
        'separator' => 'nullable|string',
    ]);
    // Logic xử lý
}
```

#### Điểm khác biệt:

- **Pydantic**: Xác thực trực tiếp tham số hàm, dựa trên type hints.
- **Laravel**: Xác thực trong controller, cần viết quy tắc thủ công.

---

## 16. Conversion Table (Bảng Chuyển Đổi) 🔧

### Pydantic: Conversion Table là gì?

Pydantic tự động chuyển đổi kiểu dữ liệu đầu vào thành kiểu mong muốn, như `"30"` → `30` (int).

#### Ví dụ:

Trong hàm `repeat`:

```python
result = repeat('x', '4')  # "4" tự động thành 4
```

### So sánh với Laravel

Trong Laravel, bạn cũng có thể chuyển đổi kiểu trong quy tắc xác thực.

#### Ví dụ trong Laravel:

```php
$request->validate([
    'count' => 'required|integer',
]); // "4" tự động thành 4
```

#### Điểm khác biệt:

- **Pydantic**: Chuyển đổi dựa trên type hints, tự động và minh bạch.
- **Laravel**: Chuyển đổi dựa trên quy tắc, nhưng không linh hoạt bằng.

---

## 17. Settings Management (Quản Lý Cấu Hình) ⚙️

### Pydantic: Settings Management là gì?

Pydantic cung cấp `pydantic-settings` để quản lý cấu hình từ biến môi trường hoặc file `.env`.

#### Ví dụ:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    api_key: str

settings = Settings()  # Tự động đọc API_KEY từ biến môi trường
```

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **env()** và **config()**.

#### Ví dụ trong Laravel:

```php
$apiKey = env('API_KEY');
```

#### Điểm khác biệt:

- **Pydantic**: Quản lý cấu hình qua mô hình, có xác thực kiểu.
- **Laravel**: Dựa vào file `.env`, không có xác thực kiểu.

---

## 18. Performance (Hiệu Suất) ⚡

### Pydantic: Performance là gì?

Pydantic được tối ưu hiệu suất, đặc biệt trong v2 (dùng Rust để tăng tốc xác thực). Một số mẹo: dùng `TypeAdapter` thay vì `BaseModel`, bật strict mode, v.v.

#### Ví dụ:

Mình đã dùng `TypeAdapter` để xử lý `list[Person]`, nhẹ hơn `BaseModel`.

### So sánh với Laravel

Trong Laravel, bạn tối ưu hiệu suất bằng cách dùng **caching** hoặc tối ưu query.

#### Ví dụ trong Laravel:

```php
$users = Cache::remember('users', 60, function () {
    return User::all();
});
```

#### Điểm khác biệt:

- **Pydantic**: Tối ưu ở tầng xác thực/serialize, không liên quan đến database.
- **Laravel**: Tối ưu tập trung vào database và ứng dụng.

---

## 19. Experimental (Thử Nghiệm) 🧪

### Pydantic: Experimental là gì?

Pydantic có các tính năng thử nghiệm, như một số tính năng mới trong v2 (ví dụ: `TypeAdapter` ban đầu là thử nghiệm).

### So sánh với Laravel

Trong Laravel, khái niệm tương đương là **beta features** hoặc các gói thử nghiệm.

#### Ví dụ trong Laravel:

Dùng gói thử nghiệm như `laravel/scout` phiên bản beta.

#### Điểm khác biệt:

- **Pydantic**: Tính năng thử nghiệm thường được ghi rõ trong tài liệu.
- **Laravel**: Cần kiểm tra changelog hoặc cộng đồng để biết tính năng beta.

---

## 📝 Kết Luận

Pydantic là một công cụ mạnh mẽ để xử lý dữ liệu trong Python, với rất nhiều khái niệm hữu ích:

 1. **Models**: Xây dựng cấu trúc dữ liệu với `BaseModel`.
 2. **Fields**: Thêm ràng buộc và mô tả cho trường.
 3. **JSON Schema**: Tạo tài liệu API tự động.
 4. **JSON**: Serialize/deserialize dễ dàng.
 5. **Types**: Kiểu đặc biệt để xác thực.
 6. **Unions**: Hỗ trợ nhiều kiểu dữ liệu.
 7. **Alias**: Đổi tên trường trong JSON.
 8. **Configuration**: Cấu hình mô hình linh hoạt.
 9. **Serialization**: Chuyển đổi dữ liệu.
10. **Validators**: Xác thực tùy chỉnh.
11. **Dataclasses**: Kết hợp dataclass với xác thực.
12. **Forward Annotations**: Tham chiếu trước.
13. **Strict Mode**: Xác thực nghiêm ngặt.
14. **Type Adapter**: Xác thực kiểu trực tiếp.
15. **Validation Decorator**: Xác thực tham số hàm.
16. **Conversion Table**: Tự động chuyển đổi kiểu.
17. **Settings Management**: Quản lý cấu hình.
18. **Performance**: Tối ưu hiệu suất.
19. **Experimental**: Tính năng thử nghiệm.

### So sánh tổng quan với Laravel:

- Pydantic giống sự kết hợp giữa **Eloquent Model** (cho dữ liệu), **xác thực request** (cho kiểm tra dữ liệu), và **OpenAPI** (cho tài liệu API).
- Pydantic tự động hóa nhiều hơn nhờ type hints, trong khi Laravel yêu cầu quy tắc thủ công.

Hy vọng bài vlog này giúp bạn hiểu rõ hơn về Pydantic và cách nó so sánh với Laravel! Nếu bạn muốn tìm hiểu sâu hơn về bất kỳ khái niệm nào, hãy comment bên dưới nhé. Đừng quên follow mình trên GitHub để cập nhật thêm nhiều vlog thú vị! 🎉