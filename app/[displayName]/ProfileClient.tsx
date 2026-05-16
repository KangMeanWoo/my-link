"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserIdByDisplayName, getUserProfile, getLinks, incrementLinkClickCount } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { use } from "react";

export default function ProfileClient({ displayName }: { displayName: string }) {
  // 1. displayName으로 userId 찾기
  const { data: userId, isLoading: isUserIdLoading } = useQuery({
    queryKey: ["userId", displayName],
    queryFn: () => getUserIdByDisplayName(displayName),
    staleTime: 1000 * 60 * 5,
  });

  // 2. userId가 확인되면 프로필과 링크 가져오기
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["links", userId],
    queryFn: () => getLinks(userId!),
    enabled: !!userId,
  });
  
  const incrementClickMutation = useMutation({
    mutationFn: (linkId: string) => {
      if (!userId) return Promise.resolve();
      return incrementLinkClickCount(userId, linkId);
    },
  });

  const handleLinkClick = (linkId: string) => {
    incrementClickMutation.mutate(linkId);
  };

  if (isUserIdLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!isUserIdLoading && !userId) {
    return notFound();
  }

  const isLoading = isProfileLoading || isLinksLoading;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="w-full max-w-md flex flex-col gap-10 py-16 px-6">
        <section className="flex flex-col items-center text-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10 animate-pulse" />
            <Avatar className="h-28 w-28 border-4 border-background shadow-2xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              {profile?.name || displayName}
            </h1>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
              @{displayName}
            </div>
          </div>

          {profile?.bio && (
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[320px] font-medium">
              {profile.bio}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary/60" />
              <p className="text-xs text-muted-foreground">링크 목록을 가져오는 중...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
              <p className="text-sm text-muted-foreground">아직 등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links.map((link) => {
              let faviconUrl = "";
              try {
                const parsedUrl = new URL(link.url);
                faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
              } catch (e) {
                faviconUrl = `https://www.google.com/s2/favicons?domain=example.com&sz=128`;
              }

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link.id)}
                  className="block w-full group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-2xl transition-all duration-300 active:scale-[0.98]"
                >
                  <Card className="relative overflow-hidden flex items-center p-4 min-h-[72px] border-border/60 bg-background/50 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:border-primary/30 group-hover:bg-accent/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex-shrink-0 w-12 h-12 relative bg-background rounded-xl p-2 border border-border/40 shadow-sm group-hover:border-primary/20 transition-colors">
                      <Image
                        src={faviconUrl}
                        alt={`${link.title} icon`}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 px-4 text-center">
                      <span className="font-bold text-[16px] tracking-tight group-hover:text-primary transition-colors">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex-shrink-0 w-10 flex justify-end">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/50 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </a>
              );
            })
          )}
        </section>

        <footer className="mt-4 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-border/60" />
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">
            Created with MyLink
          </p>
        </footer>
      </div>
    </div>
  );
}
