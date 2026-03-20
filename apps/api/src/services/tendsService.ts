import { prisma } from '../lib/prisma.js';
import type { TrendListItem } from '@newsmap/types'

/**
 * findMany — несколько записей
 * findUnique — одна по уникальному полю (id, unique)
 * findFirst — первая подходящая запись
 */
export const getList = async (): Promise<TrendListItem[]> => {
  return await prisma.trend.findMany({
    // where — фильтрация по полям (id, title, summary, detectedAt, articleCount)
    //   where: { title: { contains: 'поиск' }, articleCount: { gte: 1 } },
    // orderBy — сортировка: { field: 'asc' | 'desc' } или массив для нескольких полей
    //   orderBy: [{ detectedAt: 'desc' }, { title: 'asc' }],
    // take — лимит записей (пагинация)
    //   take: 20,
    // skip — пропустить N записей (offset)
    //   skip: 0,
    // include — подтянуть связанные модели (articles через TrendArticle)
    //   include: { articles: { include: { article: true } } },
    // select — выбрать только указанные поля (вместо всех)
    //   select: { id: true, title: true, summary: true },
    // cursor — курсорная пагинация (вместо skip/take)
    //   cursor: { id: 'uuid' },
    // distinct — уникальность по полю
    //   distinct: ['title'],
  });
};

export const getListByCount = async (limit: number = 5): Promise<TrendListItem[]> => {
  return await prisma.trend.findMany({
    orderBy: {
      articleCount: 'desc'
    },
    take: limit
  })
}

