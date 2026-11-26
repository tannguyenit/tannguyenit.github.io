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
  redis: { title: 'Redis', description: 'Tìm hiểu Redis từ tổng quan đến persistence.' },
  typescript: { title: 'TypeScript tutorial', description: 'Làm quen TypeScript và dựng cấu trúc source code.' }
};
