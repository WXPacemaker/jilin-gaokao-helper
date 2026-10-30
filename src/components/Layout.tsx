import { NavLink, Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: '首页', end: true },
  { path: '/score', label: '分数线查询' },
  { path: '/recommend', label: '智能推荐' },
  { path: '/subject-major', label: '选科对照' },
  { path: '/special', label: '特殊招生' },
  { path: '/guide', label: '填报指南' },
];

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight">吉林高考志愿助手</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <Outlet />
      </main>
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          <p>吉林省高考志愿填报助手 · 数据来源：吉林省教育考试院官方公布（批次线、时间安排、志愿设置），院校录取分来自掌上高考（中国教育在线），已收录全国279所高校（含吉林省内全部68所）2024—2026年录取数据，仅供参考，请以当年官方信息为准。</p>
        </div>
      </footer>
    </div>
  );
};
