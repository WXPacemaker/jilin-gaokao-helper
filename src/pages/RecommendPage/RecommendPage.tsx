import { useMemo, useState } from 'react';
import { Target, Lightbulb, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  recommendColleges,
  recommendByRank,
  RECOMMEND_TIERS,
  RANK_TIERS,
  type ISubject,
  type ITier,
} from '@/data/gaokao';

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

type Mode = 'score' | 'rank';

export default function RecommendPage() {
  const [mode, setMode] = useState<Mode>('score');
  const [score, setScore] = useState<string>('');
  const [rank, setRank] = useState<string>('');
  const [subject, setSubject] = useState<ISubject>('物理');
  const [searched, setSearched] = useState(false);

  const numScore = Number(score);
  const validScore = score.trim() !== '' && !Number.isNaN(numScore) && numScore >= 100 && numScore <= 750;

  const numRank = Number(rank);
  const validRank = rank.trim() !== '' && !Number.isNaN(numRank) && numRank >= 1 && numRank <= 300000;

  const scoreResult = useMemo(() => {
    if (!validScore) return [];
    return recommendColleges(numScore, subject);
  }, [numScore, subject, validScore]);

  const rankResult = useMemo(() => {
    if (!validRank) return [];
    return recommendByRank(numRank, subject);
  }, [numRank, subject, validRank]);

  const result = mode === 'score' ? scoreResult : rankResult;
  const valid = mode === 'score' ? validScore : validRank;
  const inputLabel = mode === 'score' ? `${subject}类 · ${numScore} 分` : `${subject}类 · 位次 ${numRank} 名`;

  const groups = useMemo(() => {
    return { 冲: result.filter((r) => r.tier === '冲'), 稳: result.filter((r) => r.tier === '稳'), 保: result.filter((r) => r.tier === '保') };
  }, [result]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">志愿智能推荐</h1>
        <p className="mt-1 text-muted-foreground">
          支持按分数或按省排名位次输入，自动按"冲、稳、保"三档匹配代表性院校，辅助梯度志愿填报。
        </p>
      </div>

      {/* 输入 */}
      <Card>
        <CardHeader>
          <CardTitle>输入你的信息</CardTitle>
          <CardDescription>分数范围 100—750；位次为全省排名（数字越小越靠前）。推荐基于2025年参考录取数据，请结合当年实际谨慎使用</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 模式切换 */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList>
              <TabsTrigger value="score">按分数推荐</TabsTrigger>
              <TabsTrigger value="rank">按位次推荐</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            {mode === 'score' ? (
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">高考分数</label>
                <Input
                  type="number"
                  min={100}
                  max={750}
                  placeholder="例如：520"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">全省排名位次（第几名）</label>
                <Input
                  type="number"
                  min={1}
                  max={300000}
                  placeholder="例如：20000"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium">首选科目</label>
              <Tabs value={subject} onValueChange={(v) => setSubject(v as ISubject)}>
                <TabsList>
                  <TabsTrigger value="物理">物理类</TabsTrigger>
                  <TabsTrigger value="历史">历史类</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button onClick={() => setSearched(true)} disabled={!valid}>
              <Target className="mr-2 h-4 w-4" />
              生成推荐
            </Button>
          </div>
          {!valid && searched && (
            <p className="mt-2 text-sm text-destructive">
              {mode === 'score' ? '请输入有效的分数（100—750）。' : '请输入有效的位次（1—300000）。'}
            </p>
          )}

          {/* 分档说明 */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {(mode === 'score' ? RECOMMEND_TIERS : RANK_TIERS).map((t) => (
              <div key={t.tier} className="flex items-start gap-3 rounded-lg border p-3">
                <TierBadge tier={t.tier as ITier} />
                <div>
                  <div className="text-sm font-semibold">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.range}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 结果 */}
      {searched && valid && (
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                推荐结果（{inputLabel}）
              </CardTitle>
              <CardDescription>
                共匹配 {result.length} 所院校，建议按"冲-稳-保"梯度安排志愿顺序。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['冲', '稳', '保'] as ITier[]).map((t) => (
                  <div key={t} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <TierBadge tier={t} />
                      <span className="text-sm font-semibold">{groups[t].length} 所</span>
                    </div>
                    {groups[t].length === 0 ? (
                      <p className="text-xs text-muted-foreground">当前{mode === 'score' ? '分数' : '位次'}区间暂无匹配，可调整后重试。</p>
                    ) : (
                      <div className="space-y-1.5">
                        {groups[t].map((r) => (
                          <div key={r.college.id} className="flex items-center justify-between text-sm">
                            <span className="truncate">{r.college.name}</span>
                            <span className={t === '冲' ? 'font-semibold text-warning' : t === '稳' ? 'font-semibold text-info' : 'font-semibold text-success'}>
                              {mode === 'score' ? `${r.college.minScore} 分` : `${r.college.minRank} 名`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-success" />
                详细匹配列表
              </CardTitle>
              <CardDescription>
                {mode === 'score' ? '按档位排序，展示各院校录取最低分与位次' : '按档位排序，展示各院校实录位次与考生位次的差距'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">档位</TableHead>
                      <TableHead className="whitespace-nowrap">院校</TableHead>
                      <TableHead className="whitespace-nowrap">层次</TableHead>
                      <TableHead className="whitespace-nowrap">城市</TableHead>
                      <TableHead className="whitespace-nowrap">{mode === 'score' ? '录取最低分' : '实录位次'}</TableHead>
                      {mode === 'score' ? (
                        <TableHead className="whitespace-nowrap">与你的分差</TableHead>
                      ) : (
                        <TableHead className="whitespace-nowrap">与你的位次差</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.map((r) => {
                      const diffScore = r.college.minScore !== null ? r.college.minScore - numScore : null;
                      const diffRank = r.college.minRank !== null && r.college.minRank !== undefined ? r.college.minRank - numRank : null;
                      return (
                        <TableRow key={r.college.id}>
                          <TableCell className="whitespace-nowrap">
                            <TierBadge tier={r.tier} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium">{r.college.name}</TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">{r.college.tag}</TableCell>
                          <TableCell className="whitespace-nowrap">{r.college.city}</TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">
                            {mode === 'score'
                              ? `${r.college.minScore} 分`
                              : r.college.minRank !== null && r.college.minRank !== undefined ? `${r.college.minRank} 名` : '—'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {mode === 'score'
                              ? (diffScore !== null ? (diffScore > 0 ? `+${diffScore} 分（需冲刺）` : `${diffScore} 分`) : '—')
                              : (diffRank !== null ? (diffRank > 0 ? `+${diffRank} 名（需冲刺）` : `${diffRank} 名`) : '—')}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {result.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          暂无匹配结果，试试调整{mode === 'score' ? '分数' : '位次'}或切换科类。
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                推荐基于代表性院校2025年录取最低分/实录位次，未覆盖全部院校与专业组；正式填报请以当年招生计划及省教育考试院数据为准。
              </p>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
