export const site = {
  name: 'Tân Nguyễn',
  tagline: 'Ghi chép của một backend developer: PHP, Laravel, Redis, deploy, và giờ là AI engineering.',
  twitter: 'https://twitter.com/tannguyenit1995',
  github: 'https://github.com/tannguyenit'
};

export const series: Record<string, { title: string; description: string; parts?: string[] }> = {
  embeddings: {
    title: 'LLM - 01 - Embedding',
    description: 'Từ "embedding là gì" đến một hệ thống tìm kiếm chạy thật, mỗi bài có lab tương tác và một ví dụ xuyên suốt.',
    parts: ['Workflow tổng hợp', 'Embedding là gì', 'Cosine, dot và L2', 'Bi-encoder và cross-encoder', 'Retrieve rồi rerank', 'ANN và HNSW', 'Chunking', 'Số chiều và quantization', 'Hybrid search và RRF']
  },
  'multi-turn': {
    title: 'LLM - 02 - Multi turn conversation',
    description: 'Hội thoại nhiều lượt trên API stateless và prompt caching: vì sao mỗi lượt gửi lại cả lịch sử, cache khớp theo prefix ra sao, và dựng hội thoại không làm vỡ cache.',
    parts: ['Workflow tổng hợp', 'API stateless', 'KV cache và prefix', 'Các vấn đề của multi-turn', 'Kinh tế học prompt caching', 'Caching theo provider', 'Giữ prefix ổn định', 'Context dài: trim, summarize, compact', 'Observability cho cache']
  },
  'structured-output': {
    title: 'LLM - 03 - Structured Output',
    description: 'Để LLM trả về dữ liệu backend tin được: các mức đảm bảo, constrained decoding, JSON Schema theo provider, thiết kế schema, validate nhiều lớp và eval.',
    parts: ['Workflow tổng hợp', 'Vì sao LLM không tự ra JSON đúng', 'Constrained decoding', 'JSON Schema và các phương ngữ', 'Chất lượng và tính đúng', 'Structured output theo provider', 'Thiết kế schema và chọn format', 'Validate, retry và streaming', 'Structured output trong production']
  },
  'tool-use': {
    title: 'LLM - 04 - Tool Use',
    description: 'Để LLM gọi code của bạn: vòng lặp tool call trên API stateless, tool definition là prompt, tool choice, gọi song song, provider, thiết kế tool, lỗi, side effect và eval.',
    parts: ['Workflow tổng hợp', 'Model sinh yêu cầu gọi tool', 'Tool choice và gọi song song', 'Client, server, MCP và reasoning', 'Tool use theo provider', 'Thiết kế tool', 'Lỗi, vòng lặp và chi phí', 'Side effect và bảo mật', 'Eval và observability']
  },
  'decision-models': {
    title: 'LLM - 05 - Decision Models',
    description: 'Khi AI chỉ cần chọn, không cần viết: model trả về lựa chọn kèm xác suất, calibration, đặt ngưỡng, provider và các ứng dụng như routing ticket, guardrail, chọn model.',
    parts: ['Workflow tổng hợp', 'System One và hợp đồng vào ra', 'Prefill rồi chấm điểm lựa chọn', 'Xác suất và calibration', 'Giới hạn và lựa chọn thay thế', 'Decision model theo provider', 'Ứng dụng: routing và guardrail', 'Ứng dụng: agent, router và taxonomy', 'Thiết kế, ngưỡng và vận hành']
  },
  'prompt-engineering': {
    title: 'LLM - 06 - Prompt Engineering',
    description: 'Prompt là một phần của chương trình: viết cụ thể, few-shot, cấu trúc, tài liệu dài, chaining, tối ưu tự động, versioning, regression test, đổi model và đa ngôn ngữ.',
    parts: ['Workflow tổng hợp', 'Vai trò và viết cụ thể', 'Few-shot', 'Model, context và tool contract', 'Cấu trúc và tài liệu dài', 'Độ dài, giọng văn và chaining', 'Tối ưu tự động và quản lý prompt', 'Versioning, regression và đổi model', 'Đa ngôn ngữ và failure modes']
  },
  'under-attack': {
    title: 'LLM - 07 - Under Attack',
    description: 'Runbook xử lý DDoS cho server vật lý đứng sau Cloudflare: hai phút đầu phân loại, tấn công qua Cloudflare, tấn công thẳng vào origin, rule và rate limit, chuẩn bị và hạ nhiệt.',
    parts: ['Workflow tổng hợp', 'Phút 0–2: phân loại', 'Nhánh A: tấn công L7 qua Cloudflare', 'Nhánh B: tấn công thẳng origin', 'Security rules và rate limiting', 'Chuẩn bị, hạ nhiệt và lỗi hay gặp']
  },
  'streaming': {
    title: 'LLM - 08 - Streaming',
    description: 'Trả từng phần response qua SSE: TTFT, cách SSE hoạt động, event của từng provider, relay qua proxy và CDN, tool call và JSON khi stream, lỗi giữa chừng, huỷ, UI và đo đạc.',
    parts: ['Workflow tổng hợp', 'Vì sao stream và SSE', 'Giao thức, event và usage', 'Streaming theo provider', 'Relay qua proxy và CDN', 'Tool call, JSON và reasoning khi stream', 'Lỗi giữa chừng và huỷ', 'UI và moderation', 'Observability và failure modes']
  },
  'multimodal': {
    title: 'LLM - 10 - Multimodal',
    description: 'Model đọc ảnh, PDF và âm thanh thế nào: patch và token, chi phí theo provider, PDF và audio, giới hạn của vision, tiền xử lý, trích xuất có cấu trúc, cache và eval.',
    parts: ['Workflow tổng hợp', 'Patch, tile và token của ảnh', 'PDF và âm thanh', 'Những gì vision model còn kém', 'Multimodal theo provider', 'Tiền xử lý, pipeline và trích xuất', 'RAG, chi phí, eval và failure modes']
  },
  'evaluation': {
    title: 'LLM - 11 - Evaluation',
    description: 'Biết hệ thống LLM tốt lên hay tệ đi: golden dataset, grader bằng code và LLM-as-judge, phương sai và cỡ mẫu, eval cho RAG và agent, regression trong CI và A/B online.',
    parts: ['Workflow tổng hợp', 'Vì sao thử vài câu không phải eval', 'Phương sai và cỡ mẫu', 'Benchmark và grader bằng code', 'LLM-as-judge', 'Eval cho RAG, agent và extraction', 'Dataset, gán nhãn, regression và CI', 'Eval online, chi phí và failure modes']
  },
  'llm-observability': {
    title: 'LLM - 12 - LLM Observability',
    description: 'Trace và span cho lượt gọi model, metric riêng của LLM, OpenTelemetry GenAI, công cụ, che PII, chi phí theo tenant, drift khi provider đổi model và alert đáng đánh thức người trực.',
    parts: ['Workflow tổng hợp', 'Vì sao log thôi chưa đủ', 'Metric riêng của LLM', 'Chất lượng và OpenTelemetry GenAI', 'Công cụ observability', 'Log, PII và trace cho agent', 'Chi phí, feedback và drift', 'Eval từ log, alert và failure modes']
  },
  agents: {
    title: 'LLM - 13 - Agents',
    description: 'Khi LLM tự quyết bước tiếp theo: workflow hay agent, các pattern, context và memory, multi-agent, sandbox, điều kiện dừng và ngân sách, human-in-the-loop, chạy dài, eval, chi phí và bảo mật.',
    parts: ['Workflow tổng hợp', 'Workflow hay agent', 'Các pattern workflow', 'Context và memory', 'Một agent nhiều tool và multi-agent', 'Chạy code, computer use, MCP và framework', 'Điều kiện dừng, ngân sách và duyệt', 'Chạy dài, observability và eval', 'Chi phí, bảo mật và failure modes']
  },
  redis: { title: 'Redis', description: 'Tìm hiểu Redis từ tổng quan đến persistence.' },
  typescript: { title: 'TypeScript tutorial', description: 'Làm quen TypeScript và dựng cấu trúc source code.' }
};
