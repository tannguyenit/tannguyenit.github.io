---
layout: post
title:  "So sánh FastAPI và Laravel: Các tính năng chính"
author: tannguyen
categories: [ FastAPI ]
image: assets/images/post/2025/fastAPI-vs-Laravel.png
description: "FastAPI"
featured: false
hidden: false
---

# So sánh FastAPI và Laravel: Các tính năng chính

---

## 1. Start

FastAPI cho phép bạn tạo API cơ bản một cách nhanh chóng, tận dụng type hints và khả năng bất đồng bộ của Python. Nó tự động tạo tài liệu API qua Swagger UI và ReDoc.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI(title="API Đầu Tiên", description="Một API đơn giản để thử nghiệm FastAPI")

@app.get("/")
async def root():
    return {"message": "Xin chào từ FastAPI!"}
```
- Chạy: `uvicorn main:app --reload`. Truy cập `http://127.0.0.1:8000/docs` để xem tài liệu API.

### Ví dụ Laravel
```php
// routes/web.php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Xin chào từ Laravel!']);
});
```
- Chạy: `php artisan serve`. Truy cập `http://127.0.0.1:8000`.

### Sự khác biệt
- FastAPI tự động tạo tài liệu API (Swagger UI, ReDoc), trong khi Laravel cần cài thêm gói như `scribe`.
- FastAPI sử dụng async/await để xử lý đồng thời tốt hơn, còn Laravel mặc định là đồng bộ.

---

## 2. Path Parameters

FastAPI cho phép lấy dữ liệu từ URL với chuyển đổi kiểu tự động và kiểm tra kiểu nhờ type hints.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def read_user(user_id: int):
    return {"user_id": user_id}
```
- Truy cập `/users/42` trả về `{"user_id": 42}`. Giá trị không phải số sẽ trả lỗi 422.

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/users/{user_id}', function ($user_id) {
    return response()->json(['user_id' => (int)$user_id]);
});
```

### Sự khác biệt
- FastAPI tự động kiểm tra và chuyển đổi kiểu (`int`), trong khi Laravel cần ép kiểu thủ công.
- FastAPI trả lỗi chi tiết nếu kiểu sai, còn Laravel có thể trả giá trị thô nếu không xử lý.

---

## 3. Query Parameters

FastAPI xử lý tham số truy vấn trực tiếp trong hàm, với giá trị mặc định và kiểm tra kiểu.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
```
- Truy cập `/items/?skip=5&limit=20` trả về `{"skip": 5, "limit": 20}`.

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/items', function (Request $request) {
    $skip = $request->query('skip', 0);
    $limit = $request->query('limit', 10);
    return response()->json(['skip' => (int)$skip, 'limit' => (int)$limit]);
});
```

### Sự khác biệt
- FastAPI khai báo tham số truy vấn trong hàm, tự động kiểm tra kiểu.
- Laravel lấy tham số qua `request()->query()`, cần tự ép kiểu.

---

## 4. Tham số truy vấn và kiểm tra chuỗi

FastAPI hỗ trợ kiểm tra chuỗi nâng cao cho tham số truy vấn (độ dài, regex) nhờ `Query`.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/search/")
async def search(q: str = Query(default=None, min_length=3, max_length=50, regex="^search_")):
    return {"query": q}
```
- Truy cập `/search/?q=search_abc` hợp lệ, nhưng `/search/?q=ab` trả lỗi 422.

### Ví dụ Laravel
```php
// app/Http/Controllers/SearchController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => 'nullable|string|min:3|max:50|regex:/^search_/'
        ]);
        return response()->json(['query' => $request->q]);
    }
}
```

### Sự khác biệt
- FastAPI tích hợp kiểm tra trực tiếp vào tham số, còn Laravel cần khai báo rule riêng.
- FastAPI trả lỗi chi tiết hơn, trong khi Laravel cần cấu hình thông báo lỗi.

---

## 5. Tham số đường dẫn và kiểm tra số

FastAPI cho phép kiểm tra số trong tham số đường dẫn (như giới hạn giá trị) nhờ `Path`.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int = Path(..., gt=0, le=1000)):
    return {"item_id": item_id}
```
- Truy cập `/items/500` hợp lệ, nhưng `/items/-1` trả lỗi 422.

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/items/{item_id}', function ($item_id) {
    $validated = validator(['item_id' => $item_id], [
        'item_id' => 'required|integer|gt:0|lte:1000'
    ])->validate();
    return response()->json(['item_id' => (int)$item_id]);
});
```

### Sự khác biệt
- FastAPI kiểm tra trực tiếp trong khai báo tham số, còn Laravel cần viết logic kiểm tra riêng.
- FastAPI tự động trả lỗi chi tiết, còn Laravel cần xử lý lỗi thủ công.

---

## 6. Tham số truy vấn - Nhiều tham số

FastAPI hỗ trợ nhiều tham số truy vấn, bao gồm tùy chọn và bắt buộc, với type hints đảm bảo kiểu dữ liệu.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/")
async def read_users(name: str = None, age: int = None):
    return {"name": name, "age": age}
```
- Truy cập `/users/?name=John&age=25` trả về `{"name": "John", "age": 25}`.

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users', function (Request $request) {
    return response()->json([
        'name' => $request->query('name'),
        'age' => (int)$request->query('age')
    ]);
});
```

### Sự khác biệt
- FastAPI khai báo tham số trực tiếp, tự động kiểm tra kiểu.
- Laravel lấy tham số qua `request()->query()`, cần tự xử lý giá trị null và ép kiểu.

---

## 7. Body - Nhiều tham số

FastAPI cho phép nhận nhiều tham số trong body (thường là JSON), kết hợp với query hoặc path parameters, nhờ Pydantic để kiểm tra.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items/{item_id}")
async def create_item(item_id: int, item: Item, quantity: int):
    return {"item_id": item_id, "item": item, "quantity": quantity}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function createItem($item_id, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer'
        ]);
        return response()->json([
            'item_id' => (int)$item_id,
            'item' => ['name' => $request->name, 'price' => (float)$request->price],
            'quantity' => $request->quantity
        ]);
    }
}
```

### Sự khác biệt
- FastAPI dùng Pydantic để kiểm tra body, khai báo trực tiếp trong tham số.
- Laravel cần kiểm tra thủ công trong controller hoặc dùng request class.

---

## 8. Body - Các trường (Fields)

FastAPI cho phép kiểm tra từng trường trong body (độ dài, giá trị min/max) nhờ `Field` của Pydantic.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class Item(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0)

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Ví dụ Laravel
```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function createItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:50',
            'price' => 'required|numeric|gt:0'
        ]);
        return response()->json($validated);
    }
}
```

### Sự khác biệt
- FastAPI kiểm tra trường trực tiếp trong Pydantic model.
- Laravel cần khai báo rule trong controller, không hiển thị trong tài liệu API.

---

## 9. Body - (Nested Models)

FastAPI hỗ trợ mô hình lồng nhau, cho phép xử lý dữ liệu JSON phức tạp với kiểm tra tự động.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Category(BaseModel):
    name: str

class Item(BaseModel):
    name: str
    category: Category

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Ví dụ Laravel
```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function createItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category.name' => 'required|string'
        ]);
        return response()->json($validated);
    }
}
```

### Sự khác biệt
- FastAPI tự động phân tích và kiểm tra mô hình lồng nhau.
- Laravel cần khai báo rule cho từng trường lồng nhau.

---

## 10. Request Example Data

FastAPI cho phép định nghĩa dữ liệu ví dụ cho yêu cầu, hiển thị trong tài liệu API.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

    class Config:
        schema_extra = {
            "example": {"name": "Laptop", "price": 999.99}
        }

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### Ví dụ Laravel
Laravel không có tính năng này trực tiếp, nhưng có thể dùng package như `scribe`.

```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * @bodyParam name string required Tên sản phẩm. Ví dụ: Laptop
     * @bodyParam price float required Giá sản phẩm. Ví dụ: 999.99
     */
    public function createItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric'
        ]);
        return response()->json($validated);
    }
}
```

### Sự khác biệt
- FastAPI tích hợp ví dụ trong code, hiển thị trong Swagger UI.
- Laravel cần package bên ngoài để tạo tài liệu và ví dụ.

---

## 11. Extra Data Types

FastAPI hỗ trợ các kiểu dữ liệu đặc biệt (UUID, datetime, v.v.) nhờ Pydantic, với kiểm tra tự động.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from uuid import UUID
from datetime import datetime

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: UUID, created_at: datetime):
    return {"item_id": item_id, "created_at": created_at}
```

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/items/{item_id}', function ($item_id, Request $request) {
    $validated = validator([
        'item_id' => $item_id,
        'created_at' => $request->query('created_at')
    ], [
        'item_id' => 'required|uuid',
        'created_at' => 'required|date'
    ])->validate();
    return response()->json([
        'item_id' => $item_id,
        'created_at' => $request->query('created_at')
    ]);
});
```

### Sự khác biệt
- FastAPI tự động phân tích và kiểm tra kiểu dữ liệu đặc biệt.
- Laravel cần tự phân tích và kiểm tra trong controller.

---

## 12. Cookie Parameters

FastAPI cho phép lấy giá trị từ cookie với kiểm tra tương tự tham số truy vấn.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Cookie

app = FastAPI()

@app.get("/items/")
async def read_items(session_id: str = Cookie(None)):
    return {"session_id": session_id}
```

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/items', function (Request $request) {
    $session_id = $request->cookie('session_id');
    return response()->json(['session_id' => $session_id]);
});
```

### Sự khác biệt
- FastAPI khai báo cookie trực tiếp trong hàm, tự động kiểm tra.
- Laravel lấy cookie qua `request()->cookie()`, không có kiểm tra tự động.

---

## 13. Header Parameters

FastAPI hỗ trợ lấy giá trị từ header, với khả năng kiểm tra và chuyển đổi tên header.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Header

app = FastAPI()

@app.get("/items/")
async def read_items(user_agent: str = Header(...)):
    return {"user_agent": user_agent}
```

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/items', function (Request $request) {
    $user_agent = $request->header('User-Agent');
    return response()->json(['user_agent' => $user_agent]);
});
```

### Sự khác biệt
- FastAPI tự động chuyển đổi tên header và kiểm tra.
- Laravel lấy header qua `request()->header()`, không có kiểm tra tự động.

---

## 14. Response Model - Return Type

FastAPI cho phép chỉ định kiểu trả về để tự động serialize và kiểm tra dữ liệu.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/items/", response_model=Item)
async def read_item():
    return {"name": "Laptop", "price": 999.99}
```

### Ví dụ Laravel
```php
// app/Http/Resources/ItemResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'price' => (float)$this->price
        ];
    }
}
```

```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;

class ItemController extends Controller
{
    public function readItem()
    {
        return new ItemResource(['name' => 'Laptop', 'price' => 999.99]);
    }
}
```

### Sự khác biệt
- FastAPI dùng `response_model` để định nghĩa kiểu trả về, tự động serialize.
- Laravel dùng `API Resources` để định dạng phản hồi, cần cấu hình thủ công.

---

## 15. Response Status Code

FastAPI cho phép tùy chỉnh mã trạng thái HTTP dễ dàng, áp dụng cho từng endpoint.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/items/", status_code=201)
async def create_item():
    return {"message": "Đã tạo sản phẩm"}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function createItem(Request $request)
    {
        return response()->json(['message' => 'Đã tạo sản phẩm'], 201);
    }
}
```

### Sự khác biệt
- FastAPI khai báo mã trạng thái trong decorator.
- Laravel cần set trong phản hồi, linh hoạt hơn nhưng ít trực quan.

---

## 16. Form Data

FastAPI hỗ trợ nhận dữ liệu biểu mẫu với `Form`, với kiểm tra tự động.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Form

app = FastAPI()

@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);
        return response()->json(['username' => $request->username]);
    }
}
```

### Sự khác biệt
- FastAPI khai báo biểu mẫu trực tiếp trong hàm, tự động kiểm tra.
- Laravel lấy dữ liệu qua `request()->all()`, cần kiểm tra thủ công.

---

## 17. Mô hình biểu mẫu (Form Models)

FastAPI cho phép dùng Pydantic model để xử lý dữ liệu biểu mẫu, kết hợp với `Form`.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Form, Depends
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    username: str
    password: str

@app.post("/login/")
async def login(user: User = Depends(lambda: User.parse_obj({"username": Form(...), "password": Form(...)}))):
    return user
```

### Ví dụ Laravel
Laravel không có "mô hình biểu mẫu" trực tiếp, nhưng có thể dùng request class.

```php
// app/Http/Requests/LoginRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function rules()
    {
        return [
            'username' => 'required|string',
            'password' => 'required|string'
        ];
    }
}
```

```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        return response()->json($request->validated());
    }
}
```

### Sự khác biệt
- FastAPI dùng Pydantic để xử lý biểu mẫu.
- Laravel dùng request class, tách biệt kiểm tra và logic.

---

## 18. Yêu cầu tệp (Request Files)

FastAPI hỗ trợ tải tệp lên với `UploadFile`, cho phép đọc tệp và lấy metadata.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/files/")
async def create_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/FileController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    public function createFile(Request $request)
    {
        $request->validate(['file' => 'required|file']);
        $file = $request->file('file');
        return response()->json(['filename' => $file->getClientOriginalName()]);
    }
}
```

### Sự khác biệt
- FastAPI dùng `UploadFile` để xử lý tệp, tự động kiểm tra.
- Laravel dùng `request()->file()`, cần kiểm tra thủ công.

---

## 19. Yêu cầu biểu mẫu và tệp (Request Forms and Files)

FastAPI cho phép kết hợp biểu mẫu và tệp trong cùng yêu cầu, với kiểm tra tự động.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Form, File, UploadFile

app = FastAPI()

@app.post("/upload/")
async def create_upload(description: str = Form(...), file: UploadFile = File(...)):
    return {"description": description, "filename": file.filename}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/UploadController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function createUpload(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'file' => 'required|file'
        ]);
        $file = $request->file('file');
        return response()->json([
            'description' => $request->description,
            'filename' => $file->getClientOriginalName()
        ]);
    }
}
```

### Sự khác biệt
- FastAPI khai báo biểu mẫu và tệp trực tiếp trong hàm.
- Laravel cần kiểm tra thủ công và lấy dữ liệu qua `request()`.

---

## 20. Xử lý lỗi (Handling Errors)

FastAPI cung cấp `HTTPException` để xử lý lỗi, với thông tin chi tiết trong phản hồi.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return {"item_id": item_id}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function readItem($item_id)
    {
        if ($item_id == 0) {
            abort(404, 'Không tìm thấy sản phẩm');
        }
        return response()->json(['item_id' => (int)$item_id]);
    }
}
```

### Sự khác biệt
- FastAPI dùng `HTTPException` để trả lỗi chi tiết, tích hợp với tài liệu API.
- Laravel dùng `abort()` hoặc `response()`, cần cấu hình thêm để trả lỗi chi tiết.

---

## 21. Cấu hình hoạt động đường dẫn (Path Operation Configuration)

FastAPI cho phép tùy chỉnh hoạt động đường dẫn với tags, summary, và description, hiển thị trong tài liệu API.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/", tags=["items"], summary="Lấy tất cả sản phẩm", description="Trả về danh sách sản phẩm")
async def read_items():
    return ["item1", "item2"]
```

### Ví dụ Laravel
Laravel không có tính năng này trực tiếp, nhưng có thể dùng package như `scribe`.

```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * @group Sản phẩm
     * @description Trả về danh sách sản phẩm
     */
    public function readItems(Request $request)
    {
        return response()->json(['item1', 'item2']);
    }
}
```

### Sự khác biệt
- FastAPI tích hợp metadata trong code, hiển thị trong Swagger UI.
- Laravel cần package bên ngoài để thêm metadata.

---

## 22. Bộ mã hóa tương thích JSON (JSON Compatible Encoder)

FastAPI cung cấp `jsonable_encoder` để chuyển đổi dữ liệu (như datetime) thành định dạng tương thích JSON.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from datetime import datetime

app = FastAPI()

@app.get("/data/")
async def get_data():
    data = {"created_at": datetime.now()}
    return jsonable_encoder(data)
```

### Ví dụ Laravel
Laravel tự động serialize sang JSON.

```php
// app/Http/Controllers/DataController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DataController extends Controller
{
    public function getData(Request $request)
    {
        return response()->json(['created_at' => now()]);
    }
}
```

### Sự khác biệt
- FastAPI cần `jsonable_encoder` để xử lý kiểu dữ liệu không chuẩn.
- Laravel tự động serialize, nhưng ít kiểm soát hơn.

---

## 23. Body - Cập nhật (Updates)

FastAPI hỗ trợ cập nhật một phần dữ liệu (PATCH) với kiểm tra tự động.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str | None = None
    price: float | None = None

@app.patch("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "updated": item}
```

### Ví dụ Laravel
```php
// app/Http/Controllers/ItemController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function updateItem($item_id, Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'price' => 'nullable|numeric'
        ]);
        return response()->json(['item_id' => (int)$item_id, 'updated' => $validated]);
    }
}
```

### Sự khác biệt
- FastAPI dùng Pydantic để kiểm tra dữ liệu cập nhật, hỗ trợ trường tùy chọn.
- Laravel cần kiểm tra thủ công, không tự động hỗ trợ trường tùy chọn.

---

## 24. Phụ thuộc (Dependencies)

FastAPI có hệ thống dependency injection mạnh mẽ, cho phép tái sử dụng logic và quản lý tài nguyên.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Depends, Header

app = FastAPI()

def check_token(token: str = Header(...)):
    return token

@app.get("/items/", dependencies=[Depends(check_token)])
async def read_items():
    return ["item1", "item2"]
```

### Ví dụ Laravel
```php
// app/Http/Middleware/CheckToken.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('token');
        if (!$token) {
            abort(403, 'Yêu cầu token');
        }
        return $next($request);
    }
}
```

```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckToken;

Route::middleware([CheckToken::class])->get('/items', function () {
    return response()->json(['item1', 'item2']);
});
```

### Sự khác biệt
- FastAPI dùng dependency injection trực tiếp trong endpoint, hỗ trợ `yield`.
- Laravel dùng middleware để xử lý logic tương tự, không có cơ chế `yield`.

---

## 25. Bảo mật (Security)

FastAPI hỗ trợ nhiều cơ chế bảo mật như OAuth2, JWT, với các tiện ích tích hợp sẵn.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

### Ví dụ Laravel
```php
// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::middleware('auth:sanctum')->get('/users/me', function (Request $request) {
    return response()->json(['token' => $request->bearerToken()]);
});
```

### Sự khác biệt
- FastAPI tích hợp OAuth2 qua `fastapi.security`, dễ tùy chỉnh.
- Laravel dùng `Sanctum` hoặc `Passport`, cần cài đặt thêm.

---

## 26. Middleware

Middleware trong FastAPI áp dụng logic toàn cục cho yêu cầu, hỗ trợ bất đồng bộ.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI()

@app.middleware("http")
async def add_header(request, call_next):
    response = await call_next(request)
    response.headers["X-Custom"] = "Value"
    return response

@app.get("/")
async def root():
    return {"message": "Xin chào"}
```

### Ví dụ Laravel
```php
// app/Http/Middleware/AddHeader.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AddHeader
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $response->header('X-Custom', 'Value');
        return $response;
    }
}
```

### Sự khác biệt
- FastAPI hỗ trợ middleware bất đồng bộ.
- Laravel mặc định đồng bộ, cần tạo class riêng cho middleware.

---

## 27. CORS (Chia sẻ tài nguyên đa nguồn)

FastAPI cung cấp middleware CORS để cho phép truy cập từ domain khác.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Ví dụ Laravel
```php
// config/cors.php
<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_headers' => ['*'],
];
```

### Sự khác biệt
- FastAPI cấu hình CORS trong code, dễ tùy chỉnh.
- Laravel cấu hình qua file `config/cors.php`, phù hợp với dự án lớn.

---

## 28. Cơ sở dữ liệu SQL (SQL Databases)

FastAPI làm việc với cơ sở dữ liệu SQL qua SQLAlchemy, với dependency để quản lý kết nối.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

app = FastAPI()

engine = create_engine("sqlite:///example.db")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)

Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/{user_id}")
async def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return {"id": user.id, "name": user.name} if user else {"error": "Không tìm thấy người dùng"}
```

### Ví dụ Laravel
```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = ['name'];
}
```

```php
// app/Http/Controllers/UserController.php
<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function readUser($user_id)
    {
        $user = User::find($user_id);
        return $user ? response()->json(['id' => $user->id, 'name' => $user->name]) : response()->json(['error' => 'Không tìm thấy người dùng'], 404);
    }
}
```

### Sự khác biệt
- FastAPI dùng SQLAlchemy, cần tự quản lý session.
- Laravel dùng Eloquent ORM, tích hợp sẵn và dễ sử dụng hơn.

---

## 29. Ứng dụng lớn - Nhiều tệp (Bigger Applications - Multiple Files)

FastAPI hỗ trợ tổ chức dự án lớn bằng cách chia nhỏ routers, models, và dependencies.

### Ví dụ FastAPI
**main.py**:
```python
from fastapi import FastAPI
from routers import items

app = FastAPI()
app.include_router(items.router)
```

**routers/items.py**:
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/items/")
async def read_items():
    return ["item1", "item2"]
```

### Ví dụ Laravel
**routes/api.php**:
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;

Route::get('/items', [ItemController::class, 'readItems']);
```

**app/Http/Controllers/ItemController.php**:
```php
<?php

namespace App\Http\Controllers;

class ItemController extends Controller
{
    public function readItems()
    {
        return response()->json(['item1', 'item2']);
    }
}
```

### Sự khác biệt
- FastAPI chia nhỏ routers linh hoạt, dễ mở rộng.
- Laravel tổ chức qua routes và controllers, phù hợp với cấu trúc MVC.

---

## 30. Tác vụ nền (Background Tasks)

FastAPI cho phép chạy tác vụ nền sau khi trả về phản hồi, không làm chậm yêu cầu.

### Ví dụ FastAPI
```python
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def log_message(message: str):
    print(f"Ghi log: {message}")

@app.post("/send/")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(log_message, f"Đã gửi đến {email}")
    return {"message": "Thông báo đã gửi"}
```

### Ví dụ Laravel
**app/Jobs/LogMessage.php**:
```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class LogMessage implements ShouldQueue
{
    use Queueable;

    protected $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function handle()
    {
        \Log::info($this->message);
    }
}
```

**app/Http/Controllers/NotificationController.php**:
```php
<?php

namespace App\Http\Controllers;

use App\Jobs\LogMessage;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function sendNotification(Request $request)
    {
        $email = $request->input('email');
        LogMessage::dispatch("Đã gửi đến $email");
        return response()->json(['message' => 'Thông báo đã gửi']);
    }
}
```

### Sự khác biệt
- FastAPI chạy tác vụ nền đơn giản, không cần hàng đợi.
- Laravel dùng Queue và Jobs, phù hợp với tác vụ phức tạp hơn.

---

## 31. Metadata và URL tài liệu (Metadata and Docs URLs)

FastAPI cho phép tùy chỉnh metadata và URL tài liệu, giúp cá nhân hóa API.

### Ví dụ FastAPI
```python
from fastapi import FastAPI

app = FastAPI(
    title="API của tôi",
    description="Một API tùy chỉnh",
    openapi_url="/my-openapi.json",
    docs_url="/my-docs"
)
```

### Ví dụ Laravel
Laravel cần package như `scribe`.

```php
// app/Http/Controllers/HomeController.php
<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    /**
     * @group Tổng quát
     * @description Một API tùy chỉnh
     */
    public function index()
    {
        return response()->json(['message' => 'Chào mừng']);
    }
}
```

### Sự khác biệt
- FastAPI tích hợp metadata trong code, dễ tùy chỉnh URL tài liệu.
- Laravel cần package bên ngoài để tạo tài liệu.

---

## 32. Tệp tĩnh (Static Files)

FastAPI hỗ trợ phục vụ tệp tĩnh (CSS, JS, hình ảnh) qua `StaticFiles`.

### Ví dụ FastAPI
```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
```

### Ví dụ Laravel
Laravel phục vụ tệp tĩnh qua thư mục `public`.

```php
// File tĩnh được đặt trong thư mục public, ví dụ: public/css/style.css
```

### Sự khác biệt
- FastAPI cần mount tệp tĩnh, linh hoạt hơn.
- Laravel phục vụ tệp tĩnh trực tiếp từ thư mục `public`, đơn giản hơn.

---

## 33. Kiểm thử (Testing)

FastAPI cung cấp `TestClient` để viết và chạy kiểm thử cho API, tích hợp với Pytest.

### Ví dụ FastAPI
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Xin chào từ FastAPI!"}
```

### Ví dụ Laravel
```php
// tests/Feature/RootTest.php
<?php

namespace Tests\Feature;

use Tests\TestCase;

class RootTest extends TestCase
{
    public function test_read_root()
    {
        $response = $this->get('/');
        $response->assertStatus(200)->assertJson(['message' => 'Xin chào từ Laravel!']);
    }
}
```

### Sự khác biệt
- FastAPI dùng `TestClient`, nhẹ và dễ tích hợp với Pytest.
- Laravel dùng PHPUnit, tích hợp sâu với hệ sinh thái Laravel.

---

## Kết luận

FastAPI nổi bật với khả năng bất đồng bộ, tài liệu tự động, và kiểm tra dữ liệu tích hợp nhờ Pydantic. Trong khi đó, Laravel mạnh mẽ trong việc xây dựng ứng dụng full-stack với hệ sinh thái phong phú như Eloquent ORM và Blade. Tùy thuộc vào nhu cầu dự án, bạn có thể chọn framework phù hợp.