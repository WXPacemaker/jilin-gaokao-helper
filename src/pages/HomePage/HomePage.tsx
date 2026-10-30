import { Link } from 'react-router-dom';
import { ArrowRight, Search, LineChart, BookOpen, ClipboardList, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BATCH_LINES, HERO_STATS } from '@/data/gaokao';

const FEATURES = [
  {
    to: '/score',
    icon: Search,
    title: '分数线查询',
    desc: '查批次控制线、历年分数、院校录取最低分，快速定位你的分数能上哪类院校。',
  },
  {
    to: '/recommend',
    icon: LineChart,
    title: '志愿智能推荐',
    desc: '输入分数与科类，按"冲、稳、保"三档自动匹配院校，辅助梯度志愿填报。',
  },
  {
    to: '/guide',
    icon: BookOpen,
    title: '填报流程指导',
    desc: '了解网上填报流程、批次与志愿设置、时间安排和常见问题。',
  },
];

/** 分数刻度轴：把批次线与考生分数定位在同一条轴上 */
function ScoreAxis() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-2 text-sm font-medium text-muted-foreground">本科批（物理类）参考刻度</div>
      <div className="relative h-24">
        <div className="absolute left-2 right-2 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-success via-info to-warning" />
        {[
          { left: '6%', color: 'bg-success', label: '320' },
          { left: '45%', color: 'bg-info', label: '470' },
          { left: '72%', color: 'bg-warning', label: '540' },
          { left: '95%', color: 'bg-destructive', label: '600+' },
        ].map((m) => (
          <div key={m.left} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: m.left }}>
            <div className={`h-4 w-1 rounded ${m.color}`} />
            <div className="mt-1 text-center text-xs text-muted-foreground">{m.label}</div>
          </div>
        ))}
        <div className="absolute -translate-x-1/2" style={{ left: '72%', top: '50%' }}>
          <div className="flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-4 border-warning bg-card shadow">
            <span className="text-xs font-bold text-warning">520</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>保守 · 保底</span>
        <span className="text-info">适中 · 稳妥</span>
        <span className="text-warning">激进 · 冲刺</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const phys = BATCH_LINES.find((l) => l.year === 2026 && l.subject === '物理');
  const hist = BATCH_LINES.find((l) => l.year === 2026 && l.subject === '历史');

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-primary">
            <ClipboardList className="h-3.5 w-3.5" />
            2026年吉林省普通高考
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            吉林省高考
            <br />
            志愿填报助手
          </h1>
          <p className="max-w-md text-muted-foreground">
            整合官方批次线、院校录取数据与填报流程，帮你快速判断分数位置，用"冲稳保"梯度科学填报志愿。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/recommend">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover-elevate">
                开始智能推荐 <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link to="/guide">
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent">
                查看填报流程
              </span>
            </Link>
          </div>
        </div>
        <ScoreAxis />
      </section>

      {/* 关键数据 */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">2026年吉林批次控制线</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {HERO_STATS.map((s) => (
            <Card key={s.label} className="hover-elevate">
              <CardContent className="p-5">
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <div className="mt-1 text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-xs text-muted-foreground">物理：本科线 {phys?.undergrad} / 特招线 {phys?.special}</div>
          <div className="text-xs text-muted-foreground">历史：本科线 {hist?.undergrad} / 特招线 {hist?.special}</div>
          <div className="text-xs text-muted-foreground">专科批最低控制线 160 分</div>
          <div className="text-xs text-muted-foreground">数据来源：吉林省教育考试院</div>
        </div>
      </section>

      {/* 功能入口 */}
      <section>
        <div className="mb-4 text-xl font-semibold">开始使用</div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to}>
              <Card className="h-full hover-elevate">
                <CardContent className="p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <div className="mb-1 flex items-center gap-1 font-semibold">
                    {f.title} <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
