import type { ArticleListItem } from './article.js';

export interface Trend {
  id: string;
  title: string;
  summary: string | null;
  detectedAt: string;
  articleCount: number;
  articles: ArticleListItem[];
}

export interface TrendListItem {
  id: string;
  title: string;
  summary: string | null;
  detectedAt: string;
  articleCount: number;
}
