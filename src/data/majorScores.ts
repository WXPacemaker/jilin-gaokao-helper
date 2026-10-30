// 全量院校专业级录取分数线数据（2024-2026，全国在吉林招生院校）
// 来源：掌上高考 api.zjzw.cn score/special 专业级结构化接口（中国教育在线），每条记录含 source 链接
// 数据存储于同目录 majorScores.json（约2万条），此处仅做类型化导出
import type { IMajorScore } from './gaokao';
import majorScoresData from './majorScores.json';

export const MAJOR_SCORES: IMajorScore[] = majorScoresData as IMajorScore[];
