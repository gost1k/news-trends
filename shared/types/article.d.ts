export interface Article {
    id: string;
    title: string;
    content: string;
    summary: string | null;
    sourceUrl: string;
    publishedAt: string;
    parsedAt: string;
    source: Source;
    locations: Location[];
    tags: Tag[];
    aiMetadata: AiMetadata | null;
}
export interface ArticleListItem {
    id: string;
    title: string;
    summary: string | null;
    sourceUrl: string;
    publishedAt: string;
    source: Pick<Source, 'name' | 'language'>;
    locations: Pick<Location, 'name' | 'type'>[];
    tags: Pick<Tag, 'name' | 'category'>[];
    aiMetadata: Pick<AiMetadata, 'category' | 'sentiment'> | null;
}
export interface AiMetadata {
    category: ArticleCategory;
    sentiment: Sentiment;
    persons: string[];
    organizations: string[];
    events: string[];
}
export type ArticleCategory = 'politics' | 'economy' | 'technology' | 'science' | 'sports' | 'culture' | 'society' | 'incidents' | 'military' | 'weather';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export interface Source {
    id: string;
    name: string;
    url: string;
    language: 'ru' | 'en';
    parserType: 'rss' | 'scraper';
}
export interface Tag {
    id: string;
    name: string;
    category: string | null;
}
//# sourceMappingURL=article.d.ts.map