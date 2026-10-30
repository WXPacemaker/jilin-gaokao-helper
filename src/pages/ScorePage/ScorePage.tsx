import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  BATCH_LINES,
  COLLEGE_SCORES,
  MAJOR_SCORES,
  type ICollegeScore,
  type ISubject,
} from '@/data/gaokao';

const TAG_VARIANT: Record<string, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  '985': 'destructive',
  '211': 'default',
  双一流: 'outline',
  省重点: 'secondary',
  普通本科: 'outline',
  民办本科: 'secondary',
  公办专科: 'default',
  民办专科: 'outline',
};

export default function ScorePage() {
  const [keyword, setKeyword] = useState('');
  const [subject, setSubject] = useState<ISubject>('物理');
  const [year, setYear] = useState<string>('2025');
  const [batch, setBatch] = useState<string>('本科批');
  const [selected, setSelected] = useState<ICollegeScore | null>(null);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return COLLEGE_SCORES.filter(
      (c) =>
        c.subject === subject &&
        c.year === Number(year) &&
        (batch === '全部' || c.batch === batch || (!c.batch && batch === '本科批')) &&
        (!kw || c.name.toLowerCase().includes(kw) || c.city.toLowerCase().includes(kw))
    );
  }, [keyword, subject, year, batch]);

  const totalColleges = useMemo(() => {
    const names = new Set(COLLEGE_SCORES.filter((c) => c.batch === batch || (!c.batch && batch === '本科批')).map((c) => c.name));
    return names.size;
  }, [batch]);

  // 选中院校的专业分数线（按当前年份+科类过滤）
  const selectedMajors = useMemo(() => {
    if (!selected) return [];
    return MAJOR_SCORES.filter(
      (m) => m.name === selected.name && m.subject === selected.subject && m.year === selected.year
    );
  }, [selected]);

  const majorYears = useMemo(() => {
    if (!selected) return [];
    return [...new Set(MAJOR_SCORES.filter((m) => m.name === selected.name).map((m) => m.year))].sort().reverse();
  }, [selected]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">分数线查询</h1>
        <p className="mt-1 text-muted-foreground">
          查询批次控制线与全量院校录取最低分（覆盖吉林省内全部68所高校及全国重点高校），辅助判断分数位置。点击院校名可查看该校各专业录取分数与省排名。
        </p>
      </div>

      {/* 批次线 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>批次最低控制线</CardTitle>
            <CardDescription>吉林省普通高考各年份本科批、特殊类型及专科批最低控制线及其对应全省位次（来源：吉林省教育考试院一分一段表）</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="2026">
              <TabsList>
                <TabsTrigger value="2026">2026年</TabsTrigger>
                <TabsTrigger value="2025">2025年</TabsTrigger>
                <TabsTrigger value="2024">2024年</TabsTrigger>
              </TabsList>
              {[2026, 2025, 2024].map((year) => (
                <TabsContent key={year} value={String(year)}>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">科类</TableHead>
                          <TableHead className="whitespace-nowrap">本科批</TableHead>
                          <TableHead className="whitespace-nowrap">特殊类型线</TableHead>
                          <TableHead className="whitespace-nowrap">专科批</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {BATCH_LINES.filter((l) => l.year === year).map((l) => (
                          <TableRow key={l.subject}>
                            <TableCell className="whitespace-nowrap font-medium">{l.subject}类</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span className="text-lg font-bold text-primary">{l.undergrad} 分</span>
                              <div className="text-xs text-muted-foreground">约 {l.undergradRank.toLocaleString()} 位</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {l.special} 分
                              <div className="text-xs text-muted-foreground">约 {l.specialRank.toLocaleString()} 位</div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {l.college} 分
                              <div className="text-xs text-muted-foreground">约 {l.collegeRank.toLocaleString()} 位</div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* 院校录取分 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>院校录取最低分查询</CardTitle>
            <CardDescription>
              覆盖{batch === '全部' ? '本科批+专科批' : batch === '专科批' ? '专科批' : '本科批'}全部院校（当前{batch === '全部' ? COLLEGE_SCORES.length : totalColleges}所可查），数据来自掌上高考，仅供参考
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="搜索院校名称或城市，如：吉林大学、长春"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Tabs value={batch} onValueChange={setBatch}>
                  <TabsList>
                    <TabsTrigger value="本科批">本科批</TabsTrigger>
                    <TabsTrigger value="专科批">专科批</TabsTrigger>
                    <TabsTrigger value="全部">全部</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Tabs value={subject} onValueChange={(v) => setSubject(v as ISubject)}>
                  <TabsList>
                    <TabsTrigger value="物理">物理类</TabsTrigger>
                    <TabsTrigger value="历史">历史类</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Tabs value={year} onValueChange={setYear}>
                  <TabsList>
                    <TabsTrigger value="2026">2026年</TabsTrigger>
                    <TabsTrigger value="2025">2025年</TabsTrigger>
                    <TabsTrigger value="2024">2024年</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">年份</TableHead>
                    <TableHead className="whitespace-nowrap">院校</TableHead>
                    <TableHead className="whitespace-nowrap">层次</TableHead>
                    <TableHead className="whitespace-nowrap">城市</TableHead>
                    <TableHead className="whitespace-nowrap">科类</TableHead>
                    <TableHead className="whitespace-nowrap">最低分</TableHead>
                    <TableHead className="whitespace-nowrap">最低位次</TableHead>
                    <TableHead className="whitespace-nowrap">中外合作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{c.year}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Button
                          variant="ghost"
                          className="h-auto p-0 font-medium text-foreground hover:text-primary"
                          onClick={() => setSelected(c)}
                        >
                          {c.name}
                          {c.inProvince68 && (
                            <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">省内</span>
                          )}
                          <ChevronRight className="ml-0.5 h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={TAG_VARIANT[c.tag]}>{c.tag}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{c.city}</TableCell>
                      <TableCell className="whitespace-nowrap">{c.subject}类</TableCell>
                      <TableCell className="whitespace-nowrap text-lg font-bold text-primary">
                        {c.minScore !== null ? `${c.minScore} 分` : <span className="text-sm font-normal text-muted-foreground">无记录</span>}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {c.minRank ? `${c.minRank} 位` : '—'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {c.coopScore ? `${c.coopScore} 分` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                        未找到匹配院校，试试更换关键词。
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">
              注：数据为各校在吉林省该批次普通类各专业组的最低分/最低位次（不含国家专项、高校专项、定向、提前批、预科等），中外合作另列；"无记录"表示该校当年在该科类该批次无普通类招生或接口无记录。数据来自掌上高考（中国教育在线），每年有波动，请以当年官方发布为准。2024年为吉林新高考改革元年。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 院校专业分数线弹窗 */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.name}
                  {selected.inProvince68 && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">省内</span>
                  )}
                  <Badge variant={TAG_VARIANT[selected.tag]}>{selected.tag}</Badge>
                </DialogTitle>
                <DialogDescription>
                  {selected.city} · {selected.subject}类 · {selected.year}年 {selected.batch || ''}专业录取分数线
                </DialogDescription>
              </DialogHeader>

              {selectedMajors.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {majorYears.length > 0
                    ? '该校该年暂无专业级数据，可切换其他年份查看。'
                    : '该校专业级数据正在采集中，暂时只开放院校级最低分查询。'}
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">专业组</TableHead>
                          <TableHead className="whitespace-nowrap">专业</TableHead>
                          <TableHead className="whitespace-nowrap">最低分</TableHead>
                          <TableHead className="whitespace-nowrap">最低省排名</TableHead>
                          <TableHead className="whitespace-nowrap">中外合作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMajors.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                              {m.majorGroup || '—'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-medium">{m.major}</TableCell>
                            <TableCell className="whitespace-nowrap font-semibold text-primary">
                              {m.minScore !== null ? `${m.minScore} 分` : <span className="text-sm font-normal text-muted-foreground">无记录</span>}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {m.minRank ? `${m.minRank} 位` : '—'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {m.coopScore ? `${m.coopScore} 分` : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    注：专业分数为该校在吉林省该专业（组）普通类录取最低分/最低位次，数据来自掌上高考，请以当年官方为准。
                  </p>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
