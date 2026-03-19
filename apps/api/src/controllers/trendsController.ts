import type { Request, Response } from 'express';
import * as trendsService from '../services/tendsService.js';
import type { TrendListItem } from '@newsmap/types'

export async function getList(req: Request, res: Response) {
  try {
    const trends: TrendListItem[] = await trendsService.getList();
    res.json(trends);
  } catch (error) {
    console.error('trendsController.getList:', error);
    res.status(500).json({ error: 'Не удалось получить список трендов' });
  }
}