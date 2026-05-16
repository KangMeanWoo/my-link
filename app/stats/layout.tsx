import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 링크 통계',
  description: '내 마이링크의 클릭 수와 트래픽 현황을 실시간으로 확인하세요.',
  openGraph: {
    title: '내 링크 통계 | MyLink',
    description: '내 마이링크의 클릭 수와 트래픽 현황을 실시간으로 확인하세요.',
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
