"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getLinks } from "@/lib/firestore";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, BarChart3, TrendingUp, MousePointerClick } from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && !isAuthLoading) {
        router.push("/");
      }
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router, isAuthLoading]);

  // 링크 데이터 조회
  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["links", user?.uid],
    queryFn: () => getLinks(user!.uid),
    enabled: !!user,
  });

  if (isAuthLoading || isLinksLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (!user) return null;

  // 총 클릭 수 계산
  const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);
  
  // 차트 데이터 가공 (클릭 수 기준 상위 10개)
  const chartData = links
    .map(link => ({
      title: link.title,
      clicks: link.clicks || 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* 배경 장식 */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="w-full max-w-2xl flex flex-col gap-8 py-12 px-6">
        {/* 헤더 */}
        <header className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-primary transition-colors">
            <Link href="/">
              <ChevronLeft className="w-4 h-4 mr-1" />
              대시보드로 돌아가기
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="w-5 h-5" />
            <span className="font-bold tracking-tight">상세 통계</span>
          </div>
        </header>

        {/* 요약 섹션 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden border-primary/20 bg-primary/5 shadow-2xl shadow-primary/5">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <TrendingUp className="w-20 h-20 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-primary/70 font-semibold uppercase tracking-wider text-[10px]">Total Engagement</CardDescription>
              <CardTitle className="text-4xl font-black tracking-tighter">{totalClicks.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-medium">전체 링크 총 클릭 수</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/50 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="font-semibold uppercase tracking-wider text-[10px]">Active Links</CardDescription>
              <CardTitle className="text-4xl font-black tracking-tighter">{links.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-medium">현재 등록된 총 링크 수</p>
            </CardContent>
          </Card>
        </section>

        {/* 차트 섹션 */}
        <section className="flex flex-col gap-4">
          <Card className="border-border/60 bg-background/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">링크별 클릭 현황</CardTitle>
                  <CardDescription>가장 많이 클릭된 상위 10개 링크입니다.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-2 sm:px-6">
              {links.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl">
                  <p className="text-sm text-muted-foreground">데이터가 충분하지 않습니다.</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="title"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="clicks"
                      fill="var(--color-clicks)"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </section>

        {/* 하단 상세 리스트 */}
        {links.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">Top Performing Links</h2>
            <div className="flex flex-col gap-2">
              {chartData.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/40 shadow-sm hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-sm">{link.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{link.clicks.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-medium lowercase tracking-tighter">clicks</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
