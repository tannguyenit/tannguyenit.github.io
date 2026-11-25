export const site = {
  name: 'Tân Nguyễn',
  tagline: 'Ghi chép của một backend developer: PHP, Laravel, Redis, deploy, và giờ là AI engineering.',
  twitter: 'https://twitter.com/tannguyenit1995',
  github: 'https://github.com/tannguyenit'
};

export const series: Record<string, { title: string; description: string; parts?: string[] }> = {
  embeddings: {
    title: 'Embeddings cho backend developer',
    description: 'Từ "embedding là gì" đến một hệ thống tìm kiếm chạy thật, mỗi bài có lab tương tác và một ví dụ xuyên suốt.',
    parts: ['Workflow tổng hợp', 'Embedding là gì', 'Cosine, dot và L2', 'Bi-encoder và cross-encoder', 'Retrieve rồi rerank', 'ANN và HNSW', 'Chunking', 'Số chiều và quantization', 'Hybrid search và RRF']
  },
  redis: { title: 'Redis', description: 'Tìm hiểu Redis từ tổng quan đến persistence.' },
  typescript: { title: 'TypeScript tutorial', description: 'Làm quen TypeScript và dựng cấu trúc source code.' }
};
