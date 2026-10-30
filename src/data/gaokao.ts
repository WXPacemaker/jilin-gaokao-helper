// EXPORTS: ISubject, IBatchLine, ICollegeScore, IMajorScore, IFillStep, ITimelineItem, IBatchRule, IFaq,
//          SUBJECTS, BATCH_LINES, COLLEGE_SCORES, MAJOR_SCORES, FILL_STEPS, TIMELINE, BATCH_RULES, FAQS,
//          HERO_STATS, RECOMMEND_TIERS, recommendColleges, tierColor
import { COLLEGE_SCORES } from './collegeScores';
import { MAJOR_SCORES } from './majorScores';
import { SPECIAL_SCORES } from './specialScores';

export type ISubject = '物理' | '历史';

export interface IBatchLine {
  year: number;
  subject: ISubject;
  /** 本科批最低控制线 */
  undergrad: number;
  /** 特殊类型招生控制线 */
  special: number;
  /** 专科批最低控制线 */
  college: number;
  /** 各批次线对应全省位次（来源：吉林省教育考试院一分一段表/掌上高考省控线库） */
  undergradRank: number;
  specialRank: number;
  collegeRank: number;
}

export interface ICollegeScore {
  id: number;
  year: number;
  name: string;
  tag: '985' | '211' | '双一流' | '省重点' | '普通本科' | '民办本科' | '公办专科' | '民办专科';
  city: string;
  province?: string;
  subject: ISubject;
  minScore: number | null;
  minRank?: number | null;
  /** 中外合作等其他招生类型的最低分（可选） */
  coopScore?: number | null;
  /** 招生批次：本科批 / 专科批 */
  batch?: '本科批' | '专科批';
  /** 是否属于吉林省内68所高校 */
  inProvince68?: boolean;
  /** 数据来源页（掌上高考/阳光高考） */
  source?: string;
  /** 数据说明（如：在吉无该科类普通类招生等） */
  note?: string;
}

/** 院校专业级录取分数线（点开院校查看各专业录取分数与省排名） */
export interface IMajorScore {
  id: number;
  year: number;
  name: string;
  tag: '985' | '211' | '双一流' | '省重点' | '普通本科' | '民办本科' | '公办专科' | '民办专科';
  city: string;
  province?: string;
  subject: ISubject;
  /** 专业名称 */
  major: string;
  /** 专业组名称（可选） */
  majorGroup?: string;
  /** 专业组编号（可选） */
  majorGroupCode?: string;
  /** 该专业最低分 */
  minScore: number | null;
  /** 该专业最低省排名 */
  minRank?: number | null;
  /** 中外合作等其他招生类型的最低分（可选） */
  coopScore?: number | null;
  batch?: '本科批' | '专科批';
  inProvince68?: boolean;
  source?: string;
  note?: string;
}

export interface IFillStep {
  step: number;
  title: string;
  desc: string;
}

export interface ITimelineItem {
  phase: string;
  date: string;
  task: string;
}

export interface IBatchRule {
  name: string;
  num: string;
  mode: string;
  scope: string;
}

export interface IFaq {
  q: string;
  a: string;
}

/** 特殊类型招生（含专项、定向、公费类） */
export interface ISpecialAdmission {
  name: string;
  alias: string;
  level: string;
  batch: string;
  region: string;
  conditions: string[];
  benefit: string;
  source: string;
}

/** 特殊类型/专项/定向批次院校专业录取分（供冲稳保推荐） */
export interface ISpecialScore {
  id: number;
  year: number;
  name: string;
  tag: '985' | '211' | '双一流' | '省重点' | '普通本科' | '民办本科' | '公办专科' | '民办专科';
  city: string;
  province?: string;
  subject: ISubject;
  /** 专项类型：地方专项计划 / 免费医学定向生 / 公费师范生 / 定向培养军士 */
  specialType: string;
  major: string;
  majorGroup?: string;
  majorGroupCode?: number;
  minScore: number | null;
  minRank?: number | null;
  coopScore?: number | null;
  batch?: string;
  source?: string;
  note?: string;
}

export const SPECIAL_ADMISSIONS: ISpecialAdmission[] = [
  {
    name: '地方专项计划',
    alias: '地方重点高校招收农村学生专项计划',
    level: '本科',
    batch: '本科批（50个院校专业组平行志愿内填报）',
    region: '实施区域为全省农村',
    conditions: [
      '具有吉林省农村户籍',
      '具有当年普通高考报名资格',
      '报名时须通过专项计划资格审核',
    ],
    benefit: '面向农村考生定向投放招生计划，竞争群体更小，同等条件下录取更有利。',
    source: '吉林省教育考试院《吉林省2026年普通高考报名相关规定》',
  },
  {
    name: '免费医学定向生',
    alias: '农村订单定向免费医学生',
    level: '本科',
    batch: '提前批A段（省属院校免费医学定向）',
    region: '实施区域为全省农村',
    conditions: [
      '符合当年高考报名条件',
      '本人及父亲或母亲或法定监护人户籍地须在农村',
      '本人户籍2023年9月30日前迁入当地（连续3年以上户籍）',
    ],
    benefit: '在校期间免学费、免住宿费，并补助生活费；毕业后按协议定向到乡镇卫生院等基层医疗机构服务，服务期通常6年（不含规培）。',
    source: '吉林省教育考试院、吉林省卫生健康委员会、各培养院校招生网',
  },
  {
    name: '公费师范生',
    alias: '省属公费师范生 / 优师专项计划',
    level: '本科',
    batch: '提前批A段（顺序志愿）',
    region: '面向全省（部分有县区定向）',
    conditions: [
      '符合当年高考报名条件',
      '毕业后须到定向中小学任教（履约规定年限）',
      '须签订公费师范教育协议',
    ],
    benefit: '在校期间免学费、免住宿费并补助生活费；毕业后有编有岗、定向就业。如吉林师范大学2026年招收省属公费师范生和优师计划192人，覆盖汉语言文学、数学与应用数学、英语、思政、地理、物理、化学、体育教育、音乐学等9个专业。',
    source: '吉林省教育考试院、吉林师范大学等省属师范院校招生网',
  },
  {
    name: '定向培养军士（士官计划）',
    alias: '直招军士 / 定向培养军士生',
    level: '专科',
    batch: '提前批（定向培养军士专科院校专业组）',
    region: '面向全省，以男性为主',
    conditions: [
      '须为普通高中毕业生（应往届均可）',
      '须参加省征兵办组织的体格检查、政治考核和面试',
      '年龄、视力等身体条件须符合部队征集标准',
    ],
    benefit: '入学后为定向培养军士，毕业取得大专学历并按协议直接入伍服役，授予军士军衔；在校期间按标准享受学费补偿/代偿及生活补助，就业有保障。',
    source: '吉林省教育考试院、长春职业技术大学等定向培养院校招生网、央广军事',
  },
];


export const SUBJECTS: ISubject[] = ['物理', '历史'];

/** 吉林省高考批次最低控制线（来源：吉林省教育考试院历年公布；吉林自2024年起实行"3+1+2"新高考）
 *  各批次线对应位次来源：吉林省教育考试院一分一段表 / 掌上高考省控线库 */
export const BATCH_LINES: IBatchLine[] = [
  { year: 2026, subject: '物理', undergrad: 321, special: 473, college: 160, undergradRank: 67422, specialRank: 31914, collegeRank: 74181 },
  { year: 2026, subject: '历史', undergrad: 343, special: 478, college: 160, undergradRank: 20415, specialRank: 8571, collegeRank: 24212 },
  { year: 2025, subject: '物理', undergrad: 340, special: 479, college: 160, undergradRank: 69405, specialRank: 31557, collegeRank: 83201 },
  { year: 2025, subject: '历史', undergrad: 384, special: 493, college: 160, undergradRank: 21618, specialRank: 9402, collegeRank: 30853 },
  { year: 2024, subject: '物理', undergrad: 345, special: 483, college: 160, undergradRank: 68931, specialRank: 31071, collegeRank: 83201 },
  { year: 2024, subject: '历史', undergrad: 369, special: 479, college: 160, undergradRank: 22619, specialRank: 9402, collegeRank: 30853 },
];

/** 全量院校录取数据（990条 / 173校 / 吉林省内68所全覆盖，来自掌上高考，详见 collegeScores.ts） */
export { COLLEGE_SCORES } from './collegeScores';

/** 网上志愿填报流程步骤 */
export const FILL_STEPS: IFillStep[] = [
  { step: 1, title: '录入志愿', desc: '登录吉林省普通高考考生服务平台（gk.jleea.com.cn），进入"志愿填报"模块，逐条录入院校专业组代码（4位院校代号+3位专业组代码）与专业代码（3位），并确认是否服从专业调剂。' },
  { step: 2, title: '保存并提交', desc: '每批次志愿填完并核对无误后，点击"保存并提交"，系统提示成功即完成该批次填报；有错误按提示更正后重新提交。' },
  { step: 3, title: '修改志愿', desc: '规定时间内可不限次数修改志愿，点击"继续修改"→"保存并提交"即可更新，以最后一次成功提交为准。' },
  { step: 4, title: '核对退出', desc: '完成全部批次后，进入"已填报志愿查看"核对全部志愿，确认无误后点击"退出"并关闭页面，志愿填报完成。' },
];

/** 2026年吉林省志愿填报与录取时间安排（来源：吉林省教育考试院） */
export const TIMELINE: ITimelineItem[] = [
  { phase: '提前批填报', date: '6月26日—27日', task: '填报提前批普通类、艺术类本科院校专业组，以及司法、定向军士等专科院校专业组' },
  { phase: '本科批填报', date: '6月28日—7月2日', task: '填报本科层次各科类（普通类、艺术类、体育类）院校专业组（每天8:00—20:00）' },
  { phase: '提前批A段投档', date: '7月8日—10日', task: '提前批A段（普通类、艺术类）投档录取' },
  { phase: '本科批投档', date: '7月15日—19日', task: '本科批（普通类、艺术类、体育类）投档录取' },
  { phase: '本科批征集', date: '7月20日—24日', task: '本科批征集志愿补充录取' },
  { phase: '专科批填报', date: '7月25日—26日', task: '填报专科层次各科类院校专业组（每天8:00—20:00）' },
  { phase: '专科批投档', date: '7月29日—30日', task: '专科批（普通类、艺术类、体育类）投档录取' },
  { phase: '专科批征集', date: '7月31日—8月2日', task: '专科批征集志愿补充录取' },
];

/** 吉林省各科类批次及志愿设置（来源：吉林省教育考试院2026年安排） */
export const BATCH_RULES: IBatchRule[] = [
  { name: '普通类·提前批', num: 'A段1个 / B段1个', mode: '顺序志愿', scope: '军事、公安、司法、消防、公费师范生、小语种、定向培养军士等' },
  { name: '普通类·本科批', num: '50个院校专业组', mode: '平行志愿', scope: '普通高校本科层次普通类各专业及各类专项、定向、中外合作等' },
  { name: '普通类·专科批', num: '40个院校专业组', mode: '平行志愿', scope: '普通高校专科层次普通类专业' },
  { name: '艺术类', num: '提前批1个 / 本科20个 / 专科20个', mode: '提前批顺序、本专科平行', scope: '艺术类校考专业及省统考专业' },
  { name: '体育类', num: '本科20个 / 专科20个', mode: '平行志愿', scope: '体育类本科、专科专业' },
];

/** 常见问题解答 */
export const FAQS: IFaq[] = [
  { q: '每位考生能填报多少个院校专业组志愿？', a: '普通类本科批设50个院校专业组平行志愿，专科批40个；每个院校专业组内设6个专业志愿，并可设置是否服从专业调剂。' },
  { q: '什么是"冲稳保"策略？', a: '根据历年录取数据，把志愿分为三档：冲刺（历年分数略高于你的分数）、稳妥（与你的分数接近）、保底（明显低于你的分数）。平行志愿下建议按"冲-稳-保"梯度排列，既争取更好院校，也保证不滑档。' },
  { q: '吉林省从哪一年开始新高考改革？', a: '吉林自2024年起实行"3+1+2"新高考模式：语文、数学、外语三门统考，物理/历史二选一作为首选科目，思想政治、地理、化学、生物四选二作为再选科目；不再分文理科，志愿以"院校专业组"为单位填报。' },
  { q: '填报志愿有几次修改机会？', a: '规定填报时间内可无限次修改志愿，以最后一次成功"保存并提交"的内容为准，请务必在系统关闭前完成并核对。' },
  { q: '收到录取通知书后如何核实真伪？', a: '可通过吉林省教育考试院微信公众号、吉林省普通高考考生服务平台或"吉事办"高考服务专区查询录取院校及专业，核对信息是否一致，谨防上当。' },
  { q: '未被录取怎么办？', a: '各批次未完成招生计划会公开征集志愿补充生源。录取期间请持续关注省教育考试院官方渠道发布的征集志愿公告，及时填报。' },
];

/** 首页核心数据（来源：吉林省教育考试院2026年公布） */
export const HERO_STATS = [
  { label: '本科批（物理）', value: '321', sub: '2026年最低控制线' },
  { label: '本科批（历史）', value: '343', sub: '2026年最低控制线' },
  { label: '收录院校', value: '279', sub: '所（含省内全部68所）' },
  { label: '录取数据', value: '1574', sub: '条（2024—2026三年）' },
];

/** 冲稳保三档判定说明 */
export const RECOMMEND_TIERS = [
  { tier: '冲', label: '冲刺', range: '院校线高于考生分数 0—10 分', color: 'warning' },
  { tier: '稳', label: '稳妥', range: '院校线低于考生分数 0—15 分', color: 'info' },
  { tier: '保', label: '保底', range: '院校线低于考生分数 15 分以上', color: 'success' },
] as const;

export type ITier = '冲' | '稳' | '保';

/** 根据考生分数与科类，从院校库中按冲稳保分档推荐（默认采用最近一年2025年、本科批、有实录分的数据） */
export function recommendColleges(score: number, subject: ISubject): { college: ICollegeScore; tier: ITier }[] {
  const pool = COLLEGE_SCORES.filter(
    (c) => c.subject === subject && c.year === 2025 && c.minScore !== null && c.batch !== '专科批'
  );
  const result: { college: ICollegeScore; tier: ITier }[] = [];
  for (const college of pool) {
    const diff = (college.minScore as number) - score; // 正值=院校线更高(需冲刺)，负值=院校线更低
    let tier: ITier | null = null;
    if (diff >= 0 && diff <= 10) tier = '冲';
    else if (diff < 0 && diff >= -15) tier = '稳';
    else if (diff < -15) tier = '保';
    if (tier) result.push({ college, tier });
  }
  const order: Record<ITier, number> = { 冲: 0, 稳: 1, 保: 2 };
  return result.sort((a, b) => order[a.tier] - order[b.tier] || b.college.minScore! - a.college.minScore!);
}

/** 冲稳保三档的语义颜色 token */
export const tierColor: Record<ITier, string> = {
  冲: 'warning',
  稳: 'info',
  保: 'success',
};

/** 院校专业级录取分数线（从 majorScores.ts 导入） */
export { MAJOR_SCORES };

/** 特殊类型/专项/定向批次院校专业录取分（从 specialScores.ts 导入） */
export { SPECIAL_SCORES };
