import type { Request, Response } from 'express';
import * as trendsService from '../services/tendsService.js';
import type { TrendListItem } from '@newsmap/types'
import { parseLimitParam } from '@/utils/parseHttpParams.js';

export async function getList(req: Request, res: Response) {
  try {
    const trends: TrendListItem[] = await trendsService.getList();
    res.json(trends);
  } catch (error) {
    console.error('trendsController.getList:', error);
    res.status(500).json({ error: 'Не удалось получить список трендов' });
  }
}


export async function getListByCount(req: Request, res: Response) {
  const limit = parseLimitParam(req.params.limit, 5)
  try {
    const trendsCount: TrendListItem[] = await trendsService.getListByCount(limit)
    res.json(trendsCount)
  } catch (err) {
    console.log('trendsController.getListByCount', err)
    res.status(500).json({ err: `Не удалось получить список тредов count: ${req}`})
  }
}