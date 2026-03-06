export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  context?: {
    region?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface ChatResponse {
  message: string;
  sources: Array<{
    articleId: string;
    title: string;
    relevance: number;
  }>;
}

export interface NewsFilters {
  search?: string;
  category?: string;
  sentiment?: string;
  sourceId?: string;
  language?: 'ru' | 'en';
  dateFrom?: string;
  dateTo?: string;
  locationId?: string;
  page?: number;
  pageSize?: number;
}
