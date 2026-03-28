import Image from "next/image";
import { dummyLinks } from "@/data/links";
import { Card } from "@/components/ui/card";

export default function Page() {
  // 하드코딩된 더미 프로필 데이터
  const profile = {
    displayName: "minwoo",
    name: "강민우",
    bio: "프론트엔드 개발자입니다.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* 프로필 섹션 */}
        <section className="flex flex-col items-center text-center gap-2 mb-4">
          <h1 className="text-xl font-bold tracking-tight">{profile.displayName}</h1>
          <p className="text-sm font-medium text-muted-foreground">{profile.name}</p>
          <p className="text-sm mt-1">{profile.bio}</p>
        </section>

        {/* 링크 리스트 섹션 */}
        <section className="flex flex-col gap-3 w-full">
          {dummyLinks.map((link) => {
            // 구글 파비콘 API URL 생성 (특정 도메인의 대표 아이콘)
            // https://www.google.com/s2/favicons?domain=...
            const parsedUrl = new URL(link.url);
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
            
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              >
                <Card className="flex items-center p-4 transition-all duration-200 hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground cursor-pointer border-border">
                  <div className="flex-shrink-0 w-8 h-8 relative mr-4">
                    <Image
                      src={faviconUrl}
                      alt={`${link.title} icon`}
                      fill
                      className="object-contain rounded-sm"
                      unoptimized // 외부 이미지이므로 Next.js 최적화 우회
                    />
                  </div>
                  <span className="font-medium text-center flex-1 pr-12">{link.title}</span>
                </Card>
              </a>
            );
          })}
        </section>
        
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Powered by MyLink
        </footer>
      </div>
    </div>
  );
}
