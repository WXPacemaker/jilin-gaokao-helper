import { useMemo, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MAJOR_CATEGORIES, REQUIREMENT_TYPES } from '@/data/subjectMajor';

const SUBJECT_OPTIONS = ['物理', '历史'] as const;
const REELECT_OPTIONS = ['思想政治', '地理', '化学', '生物'] as const;

export default function SubjectMajorPage() {
  const [first, setFirst] = useState<'物理' | '历史'>('物理');
  const [reElec, setReElec] = useState<string[]>(['化学', '生物']);

  // 根据选科判定能否报考某专业门类
  const result = useMemo(() => {
    return MAJOR_CATEGORIES.map((cat) => {
      // 该门类必须包含的关键科目要求
      let eligible = true;
      const needs: string[] = [];
      if (cat.id === 'wulihua' || cat.id === 'wuli') {
        if (first !== '物理') {
          eligible = false;
          needs.push('首选物理');
        }
        if (cat.id === 'wulihua' && !reElec.includes('化学')) {
          eligible = false;
          needs.push('再选化学');
        }
      }
      if (cat.id === 'lishi') {
        // 历史类：首选历史最佳，但多数不提要求
        eligible = true;
        if (first !== '历史') needs.push('建议首选历史');
      }
      if (cat.id === 'zhengzhi') {
        if (!reElec.includes('思想政治')) {
          eligible = false;
          needs.push('再选思想政治');
        }
      }
      if (cat.id === 'shengwu') {
        if (!reElec.includes('化学') && !reElec.includes('生物')) {
          eligible = false;
          needs.push('再选化学或生物');
        }
      }
      return { ...cat, eligible, needs };
    });
  }, [first, reElec]);

  const toggleReElec = (s: string) => {
    setReElec((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">选科与专业对照</h1>
        <p className="mt-1 text-muted-foreground">
          吉林新高考"3+1+2"模式下，不同选科组合可报考的专业范围。选择你的选科，查看可报专业门类。
        </p>
      </div>

      {/* 选科选择器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            我的选科
          </CardTitle>
          <CardDescription>
            首选科目（物理/历史 二选一）+ 再选科目（思想政治、地理、化学、生物 四选二）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 text-sm font-medium">首选科目</div>
            <div className="flex gap-2">
              {SUBJECT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFirst(s)}
                  className={
                    'rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ' +
                    (first === s
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'hover:bg-accent')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">再选科目（选2门）</div>
            <div className="flex flex-wrap gap-2">
              {REELECT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleReElec(s)}
                  className={
                    'rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ' +
                    (reElec.includes(s)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'hover:bg-accent')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
            {reElec.length !== 2 && (
              <p className="mt-2 text-xs text-destructive">请选择2门再选科目</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 可报专业门类 */}
      <Card>
        <CardHeader>
          <CardTitle>可报考的专业门类</CardTitle>
          <CardDescription>
            根据你的选科组合（{first} + {reElec.length ? reElec.join('、') : '未选全'}），以下专业门类可选/受限情况如下
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.map((cat) => (
            <div
              key={cat.id}
              className={
                'rounded-lg border p-4 ' + (cat.eligible ? 'border-emerald-200 bg-emerald-50/40' : 'border-destructive/30 bg-muted/30')
              }
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold">{cat.name}</span>
                {cat.eligible ? (
                  <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    可报考
                  </span>
                ) : (
                  <span className="rounded-full bg-destructive/80 px-2.5 py-0.5 text-xs font-medium text-white">
                    受限
                  </span>
                )}
              </div>
              <div className="mb-1.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">选科要求：</span>
                {cat.requirement}
              </div>
              <div className="mb-1.5 text-sm">
                <span className="font-medium text-muted-foreground">代表性专业：</span>
                {cat.examples}
              </div>
              <div className="text-xs text-muted-foreground">{cat.note}</div>
              {!cat.eligible && cat.needs.length > 0 && (
                <div className="mt-2 text-xs text-destructive">
                  当前选科不满足：{cat.needs.join('、')}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 四类选科要求解读 */}
      <Alert>
        <AlertTitle>选考科目要求四类解读（来源：吉林省教育考试院）</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-1.5">
            {REQUIREMENT_TYPES.map((r) => (
              <li key={r.type}>
                <span className="font-semibold">{r.type}</span>：{r.desc}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground">
        注：以上为学科门类层面的通用选科指引（依据教育部通用版指引），各高校具体专业选科要求可能有所不同，且以当年高校招生计划及招生章程为准。医学、公安等专业还有体检等附加要求。
      </p>
    </div>
  );
}
