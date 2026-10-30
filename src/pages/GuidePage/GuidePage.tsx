import { Link } from 'react-router-dom';
import { CalendarClock, ListChecks, Layers, HelpCircle, ArrowRight, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FILL_STEPS, TIMELINE, BATCH_RULES, FAQS, SPECIAL_ADMISSIONS } from '@/data/gaokao';

export default function GuidePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">填报流程指导</h1>
        <p className="mt-1 text-muted-foreground">吉林省高考网上志愿填报流程、批次设置、时间安排与常见问题。</p>
      </div>

      {/* 填报流程 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              网上志愿填报四步流程
            </CardTitle>
            <CardDescription>登录吉林省普通高考考生服务平台（gk.jleea.com.cn），按以下步骤完成填报</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {FILL_STEPS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.step}
                  </span>
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* 批次与志愿设置 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              各科类批次及志愿设置
            </CardTitle>
            <CardDescription>每个院校专业组志愿均设6个专业志愿和是否服从专业调剂选项</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {BATCH_RULES.map((r) => (
                <div key={r.name} className="rounded-lg border p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-sm text-primary">{r.mode}</span>
                  </div>
                  <div className="mb-1 text-sm text-muted-foreground">志愿数：{r.num}</div>
                  <p className="text-xs text-muted-foreground">{r.scope}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 时间安排 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              2026年志愿填报与录取时间安排
            </CardTitle>
            <CardDescription>来源：吉林省教育考试院，如有调整以官方发布为准</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TIMELINE.map((t) => (
                <div key={t.phase} className="rounded-lg border p-4">
                  <div className="mb-1 text-sm font-semibold text-primary">{t.date}</div>
                  <div className="mb-1 font-medium">{t.phase}</div>
                  <p className="text-xs text-muted-foreground">{t.task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 特殊类型招生 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              特殊类型招生（专项 / 定向 / 公费）
            </CardTitle>
            <CardDescription>
              地方专项、免费医学定向、公费师范生、定向培养军士等符合条件的考生可优先关注（来源：吉林省教育考试院等官方）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SPECIAL_ADMISSIONS.map((s) => (
                <div key={s.name} className="rounded-lg border p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{s.name}</span>
                    <Badge variant="secondary">{s.level}</Badge>
                    <span className="text-xs text-primary">{s.batch}</span>
                  </div>
                  <div className="mb-2 text-xs text-muted-foreground">{s.alias}</div>
                  <div className="mb-1 text-sm">
                    <span className="font-medium text-muted-foreground">实施范围：</span>
                    {s.region}
                  </div>
                  <div className="mb-2 text-sm">
                    <span className="font-medium text-muted-foreground">报考条件：</span>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
                      {s.conditions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-2 rounded-md bg-muted/50 p-2.5 text-sm">{s.benefit}</div>
                  <div className="text-xs text-muted-foreground">来源：{s.source}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 注意事项 */}
      <Alert>
        <AlertTitle>填报注意事项</AlertTitle>
        <AlertDescription>
          务必依据本人成绩与排位选择志愿；提前查阅院校招生章程并对照体检要求；历史类考生只能填历史类专业组、物理类只能填物理类专业组；妥善保管登录密码，尽早完成填报避免网络拥堵，且应由考生本人确认填报。
        </AlertDescription>
      </Alert>

      {/* FAQ */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              常见问题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <div className="flex justify-center">
        <Link to="/recommend">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover-elevate">
            去试试智能推荐 <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
