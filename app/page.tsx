"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FirestoreLinkItem, getLinks, addLink } from "@/lib/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

// Zod 스키마 정의: 링크 추가 폼 유효성 검사
const addLinkSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해주세요.")
    .max(50, "제목은 50자 이내로 입력해주세요."),
  url: z
    .string()
    .min(1, "URL을 입력해주세요.")
    .url("올바른 URL 형식이 아닙니다. (예: https://example.com)")
    .refine(
      (val) => val.startsWith("http://") || val.startsWith("https://"),
      "URL은 http:// 또는 https://로 시작해야 합니다."
    ),
});

// Zod 스키마에서 타입 추론
type AddLinkFormData = z.infer<typeof addLinkSchema>;

export default function Page() {
  // 하드코딩된 더미 프로필 데이터
  const profile = {
    displayName: "minwoo",
    name: "강민우",
    bio: "프론트엔드 개발자입니다.",
  };

  // 링크 목록 상태 (Firestore에서 로드)
  const [links, setLinks] = useState<FirestoreLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore에서 링크 목록 로드
  useEffect(() => {
    async function fetchLinks() {
      try {
        const firestoreLinks = await getLinks();
        setLinks(firestoreLinks);
      } catch (error) {
        console.error("링크 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLinks();
  }, []);

  // 다이얼로그 열림/닫힘 상태
  const [dialogOpen, setDialogOpen] = useState(false);

  // React Hook Form + Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddLinkFormData>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  // 링크 추가 핸들러 (RHF의 handleSubmit이 유효성 검사 통과 시에만 호출)
  const onSubmit = async (data: AddLinkFormData) => {
    try {
      const newLink = await addLink(data.title.trim(), data.url.trim());
      setLinks((prev) => [...prev, newLink]);
      reset();
      setDialogOpen(false);
    } catch (error) {
      console.error("링크 추가 실패:", error);
    }
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

        {/* 링크 추가 버튼 + 다이얼로그 */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) reset();
        }}>
          <DialogTrigger asChild>
            <button
              id="add-link-button"
              className="group relative w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm text-primary-foreground bg-primary overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              <span className="relative">새 링크 추가</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>새 링크 추가</DialogTitle>
              <DialogDescription>
                추가하고 싶은 링크의 제목과 URL을 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="link-title">링크 제목</Label>
                  <Input
                    id="link-title"
                    placeholder="예: 인스타그램"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    placeholder="예: https://instagram.com/username"
                    {...register("url")}
                  />
                  {errors.url && (
                    <p className="text-sm text-destructive">{errors.url.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setDialogOpen(false);
                  }}
                >
                  취소
                </Button>
                <Button type="submit" id="submit-link-button">
                  추가하기
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 링크 리스트 섹션 */}
        <section className="flex flex-col gap-3 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : links.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              아직 등록된 링크가 없습니다. 새 링크를 추가해보세요!
            </p>
          ) : (
            links.map((link) => {
              // 구글 파비콘 API URL 생성
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
            })
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Powered by MyLink
        </footer>
      </div>
    </div>
  );
}
