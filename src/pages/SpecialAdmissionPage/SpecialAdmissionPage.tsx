import { useMemo, useState } from 'react';
import { Search, GraduationCap, Stethoscope, BookOpen, Shield, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  SPECIAL_ADMISSIONS,
  SPECIAL_SCORES,
  type ISpecialAdmission,
  type ISubject,
} from '@/data/gaokao';

const TYPE_ICON: Record<string, typeof GraduationCap> = {
  地方专项计划: GraduationCap,
  免费医学定向生: Stethoscope,
  公费师范生: BookOpen,
  定向培养军士: Shield,
};

const TYPE_VARIANT: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  地方专项计划: 'default',
  免费医学定向生: 'destructive',
  公费师范生: 'secondary',
  定向培养军士: 'outline',
};

/** 从名称推断类型标签，用于图标与配色 */
function inferType(name: string): string {
  if (name.includes('地方专项')) return '地方专项计划';
  if (name.includes('医学定向')) return '免费医学定向生';
  if (name.includes('公费师范')) return '公费师范生';
  if (name.includes('定向培养军士')) return '定向培养军士';
  return '其他';
}

const SPECIAL_TYPES = ['地方专项计划', '免费医学定向生', '公费师范生', '定向培养军士'] as const;

type ITier = '冲' | '稳' | '保';

/** 冲稳保分档（与智能推荐页同口径）：院校线高于分数0-10=冲，低0-15=稳，低15以上=保 */
function tierFor(diff: number): ITier | null {
  if (diff >= 0 && diff <= 10) return '冲';
  if (diff < 0 && diff >= -15) return '稳';
  if (diff < -15) return '保';
  return null;
}

const TIER_CLASS: Record<ITier, string> = {
  冲: 'border-warning bg-warning/10 text-warning',
  稳: 'border-info bg-info/10 text-info',
  保: 'border-success bg-success/10 text-success',
};

function TierBadge({ tier }: { tier: ITier }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${TIER_CLASS[tier]}`}>
      {tier}
    </span>
  );
}

export default function SpecialAdmissionPage() {
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<'全部' | '本科' | '专科'>('全部');

  // 推荐模块
  const [recScore, setRecScore] = useState('');
  const [recSubject, setRecSubject] = useState<ISubject>('物理');
  const [recSearched, setRecSearched] = useState(false);

  const numScore = Number(recScore);
  const recValid = recScore.trim() !== '' && !Number.isNaN(numScore) && numScore >= 100 && numScore <= 750;

  const recResult = useMemo(() => {
    if (!recValid || !recSearched) return [];
    return SPECIAL_SCORES.filter((m) => {
      if (m.subject !== recSubject || m.minScore === null) return false;
      return tierFor(m.minScore - numScore) !== null;
    })
      .map((m) => ({ m, tier: tierFor(m.minScore! - numScore) as ITier }))
      .sort((a, b) => {
        const order: Record<ITier, number> = { 冲: 0, 稳: 1, 保: 2 };
        return order[a.tier] - order[b.tier] || b.m.minScore! - a.m.minScore!;
      });
  }, [recValid, recSearched, recSubject, numScore]);

  const recGroups = useMemo(() => {
    const byType: Record<string, Record<ITier, typeof recResult>> = {};
    for (const t of SPECIAL_TYPES) {
      byType[t] = { 冲: [], 稳: [], 保: [] };
    }
    for (const r of recResult) {
      const t = SPECIAL_TYPES.includes(r.m.specialType as typeof SPECIAL_TYPES[number])
        ? r.m.specialType
        : '其他';
      if (!byType[t]) byType[t] = { 冲: [], 稳: [], 保: [] };
      byType[t][r.tier].push(r);
    }
    return byType;
  }, [recResult]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return SPECIAL_ADMISSIONS.filter((s) => {
      if (level !== '全部' && s.level !== level) return false;
      if (!kw) return true;
      const haystack = [
        s.name,
        s.alias,
        s.level,
        s.batch,
        s.region,
        s.benefit,
        s.source,
        ...s.conditions,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(kw);
    });
  }, [keyword, level]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">特殊类型招生</h1>
        <p className="mt-1 text-muted-foreground">
          地方专项计划、免费医学定向生、公费师范生、定向培养军士——输入分数可智能推荐合适的院校专业，也可搜索各招生类型的政策详情。
        </p>
      </div>

      {/* 分数推荐 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            分数智能推荐
          </CardTitle>
          <CardDescription>输入分数和科类，按"冲-稳-保"三档匹配专项/定向/公费类院校专业（基于2024、2025年录取数据）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">高考分数</label>
              <Input
                type="number"
                min={100}
                max={750}
                placeholder="例如：520"
                value={recScore}
                onChange={(e) => setRecScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">首选科目</label>
              <Tabs value={recSubject} onValueChange={(v) => setRecSubject(v as ISubject)}>
                <TabsList>
                  <TabsTrigger value="物理">物理类</TabsTrigger>
                  <TabsTrigger value="历史">历史类</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={() => setRecSearched(true)} disabled={!recValid}>
              <Target className="mr-2 h-4 w-4" />
              生成推荐
            </Button>
          </div>
          {!recValid && recSearched && (
            <p className="text-sm text-destructive">请输入有效的分数（100—750）。</p>
          )}

          {recValid && recSearched && (
            <>
              {recResult.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  当前分数在专项/定向招生数据中暂无匹配，可能该分数段无此类招生或数据采集中，可调整分数或切换科类重试。
                </p>
              ) : (
                <div className="space-y-6">
                  {SPECIAL_TYPES.map((type) => {
                    const g = recGroups[type];
                    const total = (g.冲.length + g.稳.length + g.保.length);
                    if (total === 0) return null;
                    const Icon = TYPE_ICON[type] ?? GraduationCap;
                    return (
                      <div key={type}>
                        <div className="mb-2 flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-semibold">{type}</span>
                          <Badge variant={TYPE_VARIANT[type] ?? 'secondary'}>
                            {total} 个专业 · 冲{g.冲.length}/稳{g.稳.length}/保{g.保.length}
                          </Badge>
                        </div>
                        <div className="overflow-x-auto rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="whitespace-nowrap">档位</TableHead>
                                <TableHead className="whitespace-nowrap">院校</TableHead>
                                <TableHead className="whitespace-nowrap">专业</TableHead>
                                <TableHead className="whitespace-nowrap">专业组</TableHead>
                                <TableHead className="whitespace-nowrap">最低分</TableHead>
                                <TableHead className="whitespace-nowrap">最低省排名</TableHead>
                                <TableHead className="whitespace-nowrap">批次</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...g.冲, ...g.稳, ...g.保].map(({ m, tier }) => (
                                <TableRow key={m.id}>
                                  <TableCell className="whitespace-nowrap">
                                    <TierBadge tier={tier} />
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap font-medium">{m.name}</TableCell>
                                  <TableCell className="whitespace-nowrap">{m.major}</TableCell>
                                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                    {m.majorGroup || '—'}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap font-semibold text-primary">
                                    {m.minScore} 分
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap text-muted-foreground">
                                    {m.minRank ? `${m.minRank} 位` : '—'}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap text-muted-foreground">{m.batch || '—'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground">
                    注：推荐基于2024/2025年专项/定向/公费类录取数据，冲=院校线高于你的分数0—10分，稳=低0—15分，保=低15分以上。数据来自掌上高考，请以当年官方招生计划为准。
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 政策搜索 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            招生类型政策详情
          </CardTitle>
          <CardDescription>输入关键词可搜索符合条件的计划，并可筛选本科 / 专科</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="搜索招生类型，如：农村、师范、医学、军士、提前批……"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Tabs value={level} onValueChange={(v) => setLevel(v as typeof level)}>
              <TabsList>
                <TabsTrigger value="全部">全部</TabsTrigger>
                <TabsTrigger value="本科">本科</TabsTrigger>
                <TabsTrigger value="专科">专科</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <p className="text-xs text-muted-foreground">
            共 {filtered.length} 项符合当前筛选（共 {SPECIAL_ADMISSIONS.length} 类招生计划）
          </p>

          <div className="space-y-4">
            {filtered.map((s: ISpecialAdmission) => {
              const type = inferType(s.name);
              const Icon = TYPE_ICON[type] ?? GraduationCap;
              return (
                <Card key={s.name} className="border-none shadow-none">
                  <CardHeader className="px-0 pb-2">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                      <Icon className="h-5 w-5 text-primary" />
                      {s.name}
                      <Badge variant={TYPE_VARIANT[type] ?? 'secondary'}>{s.level}</Badge>
                      <span className="text-xs text-primary">{s.batch}</span>
                    </CardTitle>
                    <CardDescription>{s.alias}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-0 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">实施范围：</span>
                      {s.region}
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">报考条件：</span>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
                        {s.conditions.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-muted/50 p-2.5">{s.benefit}</div>
                    <div className="text-xs text-muted-foreground">来源：{s.source}</div>
                  </CardContent>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                未找到符合条件的招生计划，试试更换关键词或切换筛选。
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
