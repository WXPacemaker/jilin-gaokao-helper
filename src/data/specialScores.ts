// 特殊类型/专项/定向批次院校专业录取分（2024-2025，供冲稳保推荐）
// 来源：掌上高考 api.zjzw.cn 专项类批次接口（中国教育在线），每条记录含 source 链接
// 数据待采集完成后填充至同目录 specialScores.json
import type { ISpecialScore } from './gaokao';
import specialScoresData from './specialScores.json';

export const SPECIAL_SCORES: ISpecialScore[] = specialScoresData as ISpecialScore[];
