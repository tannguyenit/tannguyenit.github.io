---
layout: post
title:  "Tổng hợp tính năng chính của Starlette với ví dụ code và so sánh với Laravel"
author: tannguyen
categories: [ Starlette ]
image: assets/images/post/2025/startlette.png
description: "Starlette"
featured: false
hidden: false
---

# Tổng hợp tính năng chính của Starlette với ví dụ code và so sánh với Laravel

Starlette là một framework web bất đồng bộ (async) nhẹ của Python, được sử dụng làm nền tảng cho FastAPI. Trong bài viết này, mình sẽ tổng hợp các **tính năng chính** của Starlette, cung cấp các đoạn code cơ bản để minh họa, và so sánh với **Laravel** (một framework PHP đồng bộ) để bạn dễ hình dung, đặc biệt nếu bạn đã quen với PHP và Laravel. Mình sẽ ưu tiên giải thích chi tiết về Starlette để bạn thấy rõ cách framework này hoạt động.

## Các tính năng chính của Starlette và ví dụ code

Starlette là một framework web **ASGI** (Asynchronous Server Gateway Interface), được thiết kế để xây dựng ứng dụng web và API bất đồng bộ với hiệu suất cao. Dưới đây là các tính năng nổi bật, kèm theo các đoạn code cơ bản để bạn dễ hình dung.

### 1. Giới thiệu (Introduction)

Starlette là một framework nhẹ, tập trung vào hiệu suất và bất đồng bộ, phù hợp để xây dựng API và ứng dụng web. Nó không cung cấp các tính năng full-stack như Laravel (ORM, template engine, v.v.), mà tập trung vào core web functionality, cho phép bạn linh hoạt tích hợp các thư viện khác.

- **So sánh với Laravel**: Laravel là một framework full-stack, cung cấp sẵn các công cụ như Eloquent ORM, Blade template, hệ thống queue, và authentication, giúp phát triển nhanh nhưng nặng hơn Starlette.

### 2. Tính năng tổng quan (Features)

Starlette hỗ trợ bất đồng bộ (async/await), mang lại hiệu suất cao, đặc biệt cho các ứng dụng I/O nặng (như API, WebSocket). Framework này nhẹ, dễ mở rộng, và thường được dùng làm nền tảng cho FastAPI.

- **Ví dụ code**: Một ứng dụng Starlette đơn giản trả về JSON.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  
  async def homepage(request):
      return JSONResponse({"message": "Hello from Starlette"})
  
  app = Starlette(routes=[
      Route("/", homepage),
  ])
  ```

  - **Giải thích**: Thay vì dùng `@app.route`, ta định nghĩa `homepage` là một hàm bất đồng bộ, sau đó thêm nó vào danh sách `routes` khi khởi tạo `Starlette`. `async` cho phép xử lý bất đồng bộ, phù hợp cho các tác vụ I/O.

- **So sánh với Laravel**: Laravel không hỗ trợ bất đồng bộ native, cần queue hoặc package bên ngoài để xử lý async. Một route tương tự trong Laravel sẽ là:

  ```php
  Route::get('/', function () {
      return response()->json(['message' => 'Hello from Laravel']);
  });
  ```

### 3. Ứng dụng (Applications)

Starlette cho phép tạo ứng dụng ASGI đơn giản, với các tính năng như routing, middleware, và lifespan. Bạn có thể khởi tạo một ứng dụng chỉ với vài dòng code.

- **Ví dụ code**: Khởi tạo một ứng dụng Starlette với route cơ bản.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import PlainTextResponse
  
  async def hello(request):
      return PlainTextResponse("Hello, Starlette!")
  
  app = Starlette(debug=True, routes=[
      Route("/hello", hello),
  ])
  ```

  - **Giải thích**: `Starlette(debug=True)` khởi tạo ứng dụng với chế độ debug. Route `/hello` được định nghĩa bằng `Route` và gắn với hàm `hello`. Bạn có thể chạy ứng dụng này bằng `uvicorn`.

- **So sánh với Laravel**: Tương tự cách Laravel tạo ứng dụng qua `app()`, nhưng Starlette tập trung vào ASGI và không có ORM hay view engine tích hợp. Trong Laravel, bạn không cần lo về ASGI:

  ```php
  Route::get('/hello', function () {
      return "Hello, Laravel!";
  });
  ```

### 4. Xử lý request (Requests)

Starlette cung cấp lớp `Request` để truy cập thông tin từ HTTP requests, như method, headers, body, query params, v.v. Vì hỗ trợ bất đồng bộ, bạn có thể dùng `await` để lấy dữ liệu từ body.

- **Ví dụ code**: Lấy query params và JSON body từ request.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  
  async def get_user(request):
      name = request.query_params.get("name", "Guest")
      data = await request.json()  # Lấy JSON body
      return JSONResponse({"name": name, "data": data})
  
  app = Starlette(routes=[
      Route("/user", get_user, methods=["POST"]),
  ])
  ```

  - **Giải thích**: Route `/user` nhận query param `name` và body JSON (dùng `await request.json()`). Starlette xử lý bất đồng bộ, giúp tăng hiệu suất khi đọc body lớn.

- **So sánh với Laravel**: Tương tự `Illuminate\Http\Request`, nhưng Laravel đồng bộ. Ví dụ tương tự trong Laravel:

  ```php
  Route::post('/user', function (Request $request) {
      $name = $request->query('name', 'Guest');
      $data = $request->json()->all();
      return response()->json(['name' => $name, 'data' => $data]);
  });
  ```

### 5. Xử lý response (Responses)

Starlette cung cấp nhiều loại response như `JSONResponse`, `HTMLResponse`, `PlainTextResponse`, v.v. Bạn có thể tùy chỉnh status code, headers, và nội dung.

- **Ví dụ code**: Trả về JSON và HTML response.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse, HTMLResponse
  
  async def json_response(request):
      return JSONResponse({"status": "success"}, status_code=200)
  
  async def html_response(request):
      return HTMLResponse("<h1>Hello from Starlette</h1>")
  
  app = Starlette(routes=[
      Route("/json", json_response),
      Route("/html", html_response),
  ])
  ```

  - **Giải thích**: `/json` trả về JSON với status code 200, `/html` trả về HTML đơn giản. Starlette cho phép bạn linh hoạt chọn loại response phù hợp.

- **So sánh với Laravel**: Tương tự `response()->json()` hoặc `response()->view()`, nhưng Starlette không có view engine như Blade, cần tích hợp thêm (như Jinja2). Trong Laravel:

  ```php
  Route::get('/json', function () {
      return response()->json(['status' => 'success']);
  });
  
  Route::get('/html', function () {
      return view('welcome'); // Blade template
  });
  ```

### 6. WebSockets

Starlette hỗ trợ WebSocket natively, giúp xây dựng ứng dụng real-time (chat, notifications, v.v.) một cách dễ dàng.

- **Ví dụ code**: Một WebSocket endpoint đơn giản.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import WebSocketRoute
  from starlette.websockets import WebSocket
  
  async def websocket_endpoint(websocket: WebSocket):
      await websocket.accept()
      await websocket.send_text("Hello, WebSocket!")
      await websocket.close()
  
  app = Starlette(routes=[
      WebSocketRoute("/ws", websocket_endpoint),
  ])
  ```

  - **Giải thích**: Route `/ws` thiết lập một WebSocket bằng `WebSocketRoute`. Khi client kết nối, server gửi tin nhắn `Hello, WebSocket!` và đóng kết nối. Starlette hỗ trợ bất đồng bộ, rất hiệu quả cho real-time apps.

- **So sánh với Laravel**: Laravel cần package như `Laravel Echo` và `Pusher` để hỗ trợ WebSocket. Ví dụ trong Laravel:

  ```php
  event(new MessageSent('Hello, WebSocket!')); // Gửi qua Pusher
  ```

### 7. Định tuyến (Routing)

Starlette hỗ trợ định tuyến dựa trên path và method (GET, POST, v.v.), với path parameters để lấy dữ liệu từ URL. Cách định tuyến mới sử dụng `Route` hoặc `Router`.

- **Ví dụ code**: Định tuyến với path parameter.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import PlainTextResponse
  
  async def get_user(request):
      user_id = request.path_params["user_id"]
      return PlainTextResponse(f"User ID: {user_id}")
  
  app = Starlette(routes=[
      Route("/user/{user_id}", get_user),
  ])
  ```

  - **Giải thích**: Route `/user/{user_id}` lấy `user_id` từ URL (ví dụ: `/user/123` trả về "User ID: 123"). Starlette hỗ trợ path params đơn giản nhưng không có route groups hay named routes phức tạp.

- **So sánh với Laravel**: Tương tự `Route::get()`, nhưng Laravel mạnh mẽ hơn với route groups và named routes:

  ```php
  Route::get('/user/{user_id}', function ($user_id) {
      return "User ID: {$user_id}";
  })->name('user.show');
  ```

### 8. Endpoints

Starlette cho phép định nghĩa các endpoint (hàm xử lý request) một cách trực quan, tương tự controller actions trong Laravel, nhưng giờ sử dụng `Route`.

- **Ví dụ code**: Một endpoint POST đơn giản.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  
  async def create_item(request):
      data = await request.json()
      return JSONResponse({"message": "Item created", "data": data})
  
  app = Starlette(routes=[
      Route("/create", create_item, methods=["POST"]),
  ])
  ```

  - **Giải thích**: Endpoint `/create` nhận POST request, đọc JSON body, và trả về response. Đây là cách cơ bản để xử lý API trong Starlette.

- **So sánh với Laravel**: Tương tự controller actions:

  ```php
  Route::post('/create', function (Request $request) {
      $data = $request->json()->all();
      return response()->json(['message' => 'Item created', 'data' => $data]);
  });
  ```

### 9. Middleware

Starlette hỗ trợ middleware để xử lý request/response, như CORS, logging, hoặc authentication.

- **Ví dụ code**: Thêm CORS middleware.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.middleware.cors import CORSMiddleware
  from starlette.responses import JSONResponse
  
  async def homepage(request):
      return JSONResponse({"message": "CORS enabled"})
  
  app = Starlette(routes=[
      Route("/", homepage),
  ])
  app.add_middleware(CORSMiddleware, allow_origins=["*"])
  ```

  - **Giải thích**: `CORSMiddleware` cho phép các domain khác truy cập API (CORS). Starlette không có middleware tích hợp sẵn, bạn cần tự thêm.

- **So sánh với Laravel**: Laravel có middleware tích hợp:

  ```php
  Route::get('/', function () {
      return response()->json(['message' => 'CORS enabled']);
  })->middleware('cors');
  ```

### 10. File tĩnh (Static Files)

Starlette hỗ trợ phục vụ file tĩnh như CSS, JS, images trực tiếp từ ứng dụng.

- **Ví dụ code**: Phục vụ file tĩnh.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Mount
  from starlette.staticfiles import StaticFiles
  
  app = Starlette(routes=[
      Mount("/static", StaticFiles(directory="static"), name="static"),
  ])
  ```

  - **Giải thích**: Mount thư mục `/static` để phục vụ file tĩnh (ví dụ: `/static/style.css`). Dùng `StaticFiles` để quản lý.

- **So sánh với Laravel**: Laravel dùng thư mục `public`, thường kết hợp với Nginx/Apache:

  ```php
  // Truy cập file tĩnh qua public/style.css
  ```

### 11. Templates

Starlette hỗ trợ template rendering, nhưng cần tích hợp template engine như Jinja2.

- **Ví dụ code**: Render template với Jinja2.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.templating import Jinja2Templates
  from starlette.responses import HTMLResponse
  
  templates = Jinja2Templates(directory="templates")
  
  async def homepage(request):
      return templates.TemplateResponse("index.html", {"request": request, "name": "Starlette"})
  
  app = Starlette(routes=[
      Route("/", homepage),
  ])
  ```

  - **File** `templates/index.html`:

    ```html
    <h1>Hello, {{ name }}!</h1>
    ```

  - **Giải thích**: Dùng `Jinja2Templates` để render file `index.html`, truyền biến `name`. Starlette không có template engine tích hợp, bạn phải cài thêm `jinja2`.

- **So sánh với Laravel**: Laravel có Blade tích hợp sẵn:

  ```php
  // resources/views/index.blade.php
  <h1>Hello, {{ $name }}!</h1>
  
  // Route
  Route::get('/', function () {
      return view('index', ['name' => 'Laravel']);
  });
  ```

### 12. Database

Starlette không có ORM, nhưng hỗ trợ tích hợp với các thư viện như `databases` hoặc SQLAlchemy.

- **Ví dụ code**: Kết nối database với `databases`.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from databases import Database
  from starlette.responses import JSONResponse
  
  database = Database("sqlite:///example.db")
  
  async def list_users(request):
      query = "SELECT * FROM users"
      results = await database.fetch_all(query)
      return JSONResponse({"users": [dict(row) for row in results]})
  
  app = Starlette(routes=[
      Route("/users", list_users),
  ], on_startup=[database.connect], on_shutdown=[database.disconnect])
  ```

  - **Giải thích**: Dùng `databases` để kết nối SQLite, fetch danh sách users, và trả về JSON. Starlette cần bạn tự quản lý database connections, ở đây dùng `on_startup` và `on_shutdown` để quản lý vòng đời.

- **So sánh với Laravel**: Laravel có Eloquent ORM mạnh mẽ:

  ```php
  Route::get('/users', function () {
      $users = \App\Models\User::all();
      return response()->json(['users' => $users]);
  });
  ```

### 13. GraphQL

Starlette hỗ trợ GraphQL thông qua tích hợp với thư viện như `Ariadne`.

- **Ví dụ code**: GraphQL endpoint với Ariadne.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Mount
  from starlette.responses import JSONResponse
  from ariadne import QueryType, gql, make_executable_schema
  from ariadne.asgi import GraphQL
  
  type_defs = gql("""
      type Query {
          hello: String!
      }
  """)
  
  query = QueryType()
  @query.field("hello")
  def resolve_hello(_, info):
      return "Hello, GraphQL!"
  
  schema = make_executable_schema(type_defs, query)
  app = Starlette(routes=[
      Mount("/graphql", GraphQL(schema, debug=True)),
  ])
  ```

  - **Giải thích**: Tích hợp Ariadne để tạo GraphQL API tại `/graphql`. Query `hello` trả về "Hello, GraphQL!".

- **So sánh với Laravel**: Laravel cần package như `laravel-graphql`:

  ```php
  // Định nghĩa schema và resolver tương tự
  ```

### 14. Authentication

Starlette cung cấp các công cụ cơ bản để xử lý authentication, nhưng bạn phải tự triển khai logic.

- **Ví dụ code**: Kiểm tra header cơ bản.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  from starlette.requests import Request
  
  async def check_auth(request: Request):
      token = request.headers.get("Authorization")
      if not token or token != "Bearer mytoken":
          return JSONResponse({"error": "Unauthorized"}, status_code=401)
      return None
  
  async def protected_route(request):
      error = await check_auth(request)
      if error:
          return error
      return JSONResponse({"message": "Protected route"})
  
  app = Starlette(routes=[
      Route("/protected", protected_route),
  ])
  ```

  - **Giải thích**: Middleware kiểm tra header `Authorization`. Nếu không hợp lệ, trả lỗi 401.

- **So sánh với Laravel**: Laravel có hệ thống auth tích hợp:

  ```php
  Route::get('/protected', function () {
      return response()->json(['message' => 'Protected route']);
  })->middleware('auth');
  ```

### 15. API Schemas

Starlette hỗ trợ OpenAPI schemas, đặc biệt khi dùng với FastAPI, tự động tạo tài liệu API.

- **Ví dụ code**: FastAPI (dựa trên Starlette) tạo schema.

  ```python
  from fastapi import FastAPI
  
  app = FastAPI()
  
  @app.get("/items")
  async def read_items():
      return {"items": ["Item 1", "Item 2"]}
  ```

  - **Giải thích**: FastAPI (dùng Starlette) tự động tạo OpenAPI schema, xem tại `/docs`.

- **So sánh với Laravel**: Laravel cần package như `scribe` để tạo API docs.

### 16. Lifespan

Starlette quản lý vòng đời ứng dụng (startup/shutdown) để khởi tạo/dọn dẹp tài nguyên.

- **Ví dụ code**: Quản lý database connection.

  ```python
  from starlette.applications import Starlette
  from databases import Database
  
  database = Database("sqlite:///example.db")
  
  async def startup():
      await database.connect()
      print("Database connected")
  
  async def shutdown():
      await database.disconnect()
      print("Database disconnected")
  
  app = Starlette(on_startup=[startup], on_shutdown=[shutdown])
  ```

  - **Giải thích**: Sự kiện `startup` và `shutdown` để quản lý vòng đời database connection.

- **So sánh với Laravel**: Tương tự `boot` và `terminating` trong service providers:

  ```php
  class AppServiceProvider {
      public function boot() {
          // Khởi tạo
      }
  }
  ```

### 17. Background Tasks

Starlette hỗ trợ chạy tác vụ nền sau khi gửi response.

- **Ví dụ code**: Chạy background task.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  from starlette.background import BackgroundTask
  
  def send_email(email):
      print(f"Sending email to {email}")
  
  async def send_email_route(request):
      task = BackgroundTask(send_email, email="user@example.com")
      return JSONResponse({"message": "Email queued"}, background=task)
  
  app = Starlette(routes=[
      Route("/send-email", send_email_route),
  ])
  ```

  - **Giải thích**: Background task `send_email` chạy sau khi response được gửi.

- **So sánh với Laravel**: Tương tự queue jobs:

  ```php
  dispatch(new SendEmailJob('user@example.com'));
  ```

### 18. Server Push

Starlette hỗ trợ HTTP/2 Server Push.

- **Ví dụ code**: Server Push (giả lập).

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import HTMLResponse
  
  async def homepage(request):
      response = HTMLResponse("<h1>Hello</h1>")
      response.headers["Link"] = "</style.css>; rel=preload; as=style"
      return response
  
  app = Starlette(routes=[
      Route("/", homepage),
  ])
  ```

  - **Giải thích**: Dùng header `Link` để gợi ý server push file CSS.

- **So sánh với Laravel**: Laravel không hỗ trợ Server Push trực tiếp.

### 19. Exceptions

Starlette quản lý và tùy chỉnh xử lý lỗi.

- **Ví dụ code**: Xử lý lỗi.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  from starlette.exceptions import HTTPException
  
  async def error_route(request):
      raise HTTPException(status_code=404, detail="Not found")
  
  app = Starlette(routes=[
      Route("/error", error_route),
  ])
  ```

  - **Giải thích**: Ném lỗi 404 với thông báo tùy chỉnh.

- **So sánh với Laravel**: Tương tự `App\Exceptions\Handler`:

  ```php
  throw new \Exception('Not found', 404);
  ```

### 20. Configuration

Starlette hỗ trợ cấu hình qua biến môi trường.

- **Ví dụ code**: Đọc biến môi trường.

  ```python
  from starlette.applications import Starlette
  from starlette.config import Config
  
  config = Config(".env")
  DEBUG = config("DEBUG", cast=bool, default=False)
  
  app = Starlette(debug=DEBUG)
  ```

  - **Giải thích**: Dùng `starlette.config` để đọc file `.env`.

- **So sánh với Laravel**: Tương tự `config/` và `.env`:

  ```php
  $debug = env('APP_DEBUG', false);
  ```

### 21. Thread Pool

Starlette dùng thread pool để chạy tác vụ đồng bộ trong môi trường bất đồng bộ.

- **Ví dụ code**: Chạy tác vụ đồng bộ.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  import time
  
  def heavy_task():
      time.sleep(2)
      return "Done"
  
  async def heavy_route(request):
      loop = request.app.loop
      result = await loop.run_in_executor(None, heavy_task)
      return JSONResponse({"result": result})
  
  app = Starlette(routes=[
      Route("/heavy", heavy_route),
  ])
  ```

  - **Giải thích**: `run_in_executor` chạy `heavy_task` trong thread pool.

- **So sánh với Laravel**: Laravel không có thread pool, nhưng có thể dùng `Spatie\Async`.

### 22. Test Client

Starlette cung cấp `TestClient` để test ứng dụng.

- **Ví dụ code**: Test một endpoint.

  ```python
  from starlette.applications import Starlette
  from starlette.routing import Route
  from starlette.responses import JSONResponse
  from starlette.testclient import TestClient
  
  async def homepage(request):
      return JSONResponse({"message": "Hello"})
  
  app = Starlette(routes=[
      Route("/", homepage),
  ])
  
  client = TestClient(app)
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"message": "Hello"}
  ```

  - **Giải thích**: Dùng `TestClient` để gửi request giả lập và kiểm tra response.

- **So sánh với Laravel**: Tương tự `TestCase`:

  ```php
  $this->get('/')->assertStatus(200)->assertJson(['message' => 'Hello']);
  ```

## So sánh tổng quan Starlette và Laravel

| **Tiêu chí** | **Starlette** | **Laravel** |
| --- | --- | --- |
| **Mô hình** | Framework web nhẹ, bất đồng bộ (ASGI), tập trung API và hiệu suất. | Framework full-stack, đồng bộ, tập trung phát triển nhanh và dễ dùng. |
| **Hiệu suất** | Cao, nhờ bất đồng bộ (async/await), phù hợp I/O nặng (API, WebSocket). | Đồng bộ, chậm hơn cho I/O nặng, cần queue/async package để tối ưu. |
| **Routing** | Đơn giản, hỗ trợ path params, không có route groups phức tạp. | Mạnh mẽ, hỗ trợ route groups, named routes, middleware tích hợp. |
| **Database/ORM** | Không có ORM, cần tích hợp (SQLAlchemy, Databases). | Có Eloquent ORM mạnh mẽ, tích hợp sẵn. |
| **Template** | Không có, cần tích hợp (Jinja2). | Có Blade, tích hợp sẵn, mạnh mẽ cho rendering. |
| **Background Tasks** | Hỗ trợ native, không cần queue driver (nhẹ). | Queue jobs mạnh mẽ, cần queue driver (Redis, database). |
| **WebSocket** | Hỗ trợ native, bất đồng bộ. | Cần package (Laravel Echo, Pusher). |
| **Authentication** | Cơ bản, cần tự triển khai. | Tích hợp sẵn (Auth, Passport). |
| **API Docs** | Tự động (qua OpenAPI, đặc biệt với FastAPI). | Cần package (scribe). |
| **Testing** | TestClient đơn giản, dễ dùng. | TestCase mạnh mẽ, hỗ trợ mocking, browser testing. |
| **Cộng đồng** | Nhỏ hơn, tập trung vào Python/async. | Rất lớn, nhiều tài liệu (Laracasts), hỗ trợ phong phú. |
| **Use case** | API, microservices, real-time apps (WebSocket). | Full-stack apps, monoliths, cần phát triển nhanh. |

## Kết luận

### Starlette

- **Ưu điểm**:
  - Bất đồng bộ, hiệu suất cao, phù hợp cho API, WebSocket, microservices.
  - Nhẹ, linh hoạt, tích hợp tốt với FastAPI.
  - Hỗ trợ WebSocket, background tasks, và OpenAPI schemas native.
- **Nhược điểm**:
  - Không full-stack, cần tích hợp nhiều (ORM, templates).
  - Cộng đồng nhỏ hơn, ít tài liệu so với Laravel.

### Laravel

- **Ưu điểm**:
  - Full-stack, có sẵn ORM (Eloquent), template (Blade), authentication.
  - Cộng đồng lớn, nhiều tài liệu, dễ phát triển nhanh.
- **Nhược điểm**:
  - Đồng bộ, không tối ưu cho I/O nặng.
  - Cần tích hợp thêm cho WebSocket, GraphQL, hoặc async tasks.

### Khi nào dùng Starlette?

- Nếu bạn cần API hiệu suất cao, WebSocket, hoặc ứng dụng bất đồng bộ.
- Nếu bạn dùng FastAPI (dựa trên Starlette) và muốn tận dụng Pydantic, OpenAPI.

### Khi nào dùng Laravel?

- Nếu bạn cần phát triển nhanh một ứng dụng full-stack (có giao diện, database, auth).
- Nếu bạn quen với PHP và không cần xử lý I/O nặng hoặc WebSocket.