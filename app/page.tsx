"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithGoogle, logOut } from "@/lib/auth";
import { FirestoreLinkItem, getLinks, addLink, updateLink, deleteLink, UserProfile, getUserProfile, updateUserProfile, isDisplayNameUnique } from "@/lib/firestore";
import { useTheme } from "next-themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Loader2, Pencil, Trash2, Check, X, LogIn, LogOut, Moon, Sun, ExternalLink, Copy, MousePointerClick, BarChart3 } from "lucide-react";
import { toast } from "sonner";

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

// Zod 스키마 정의: 프로필 수정 폼 유효성 검사
const editProfileSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요.").max(30, "이름은 30자 이내로 입력해주세요."),
  bio: z.string().max(100, "소개글은 100자 이내로 입력해주세요.").optional(),
});


export default function Page() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Firestore에서 사용자 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. 프로필 정보 조회 쿼리
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      let userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        userProfile = {
          displayName: user.displayName || "User",
          name: user.displayName || "이름",
          bio: "안녕하세요! 나만의 링크 모음입니다.",
        };
        await updateUserProfile(user.uid, userProfile);
      }
      return userProfile;
    },
    enabled: !!user, // 로그인한 경우에만 실행
  });

  // 2. 링크 목록 조회 쿼리
  const { data: links = [], isLoading: isLinksLoading } = useQuery({
    queryKey: ["links", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      return await getLinks(user.uid);
    },
    enabled: !!user,
  });

  const isLoading = isProfileLoading || isLinksLoading;

  // 3. 링크 추가 Mutation
  const addLinkMutation = useMutation({
    mutationFn: (data: { title: string; url: string }) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return addLink(user.uid, data.title, data.url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
      toast.success("링크가 추가되었습니다.");
    },
    onError: (error) => {
      console.error("링크 추가 실패:", error);
      toast.error("링크 추가에 실패했습니다.");
    }
  });

  // 4. 링크 수정 Mutation
  const updateLinkMutation = useMutation({
    mutationFn: (data: { id: string; title: string; url: string }) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return updateLink(user.uid, data.id, data.title, data.url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
      toast.success("링크가 수정되었습니다.");
    },
  });

  // 5. 링크 삭제 Mutation
  const deleteLinkMutation = useMutation({
    mutationFn: (linkId: string) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return deleteLink(user.uid, linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user?.uid] });
      toast.success("링크가 삭제되었습니다.");
    },
  });

  // 6. 프로필 수정 Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (newProfile: Partial<UserProfile>) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      return updateUserProfile(user.uid, newProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.uid] });
      toast.success("프로필이 수정되었습니다.");
    },
  });

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

  // 프로필 편집 상태 (인라인)
  const [editingProfileField, setEditingProfileField] = useState<'name' | 'bio' | null>(null);
  const [tempProfileValue, setTempProfileValue] = useState("");
  const [profileEditError, setProfileEditError] = useState("");

  const startProfileEdit = (field: 'name' | 'bio') => {
    if (!profile) return;
    setEditingProfileField(field);
    setTempProfileValue(profile[field] || "");
    setProfileEditError("");
  };

  const cancelProfileEdit = () => {
    setEditingProfileField(null);
    setTempProfileValue("");
    setProfileEditError("");
  };

  const saveProfileField = async () => {
    if (!user || !editingProfileField) return;
    setProfileEditError("");

    try {
      // 1. 개별 필드 유효성 검사
      const testData = {
        name: profile?.name || "",
        bio: profile?.bio || "",
        [editingProfileField]: tempProfileValue
      };
      
      const validationResult = editProfileSchema.safeParse(testData);
      
      if (!validationResult.success) {
        const issue = validationResult.error.issues.find(i => i.path[0] === editingProfileField);
        if (issue) {
          setProfileEditError(issue.message);
          return;
        }
      }

      const validatedValue = validationResult.success 
        ? validationResult.data[editingProfileField as keyof typeof validationResult.data] 
        : tempProfileValue.trim();

      // 3. 업데이트 로직
      const newProfile = { ...profile, [editingProfileField]: validatedValue };
      updateProfileMutation.mutate(newProfile as Partial<UserProfile>, {
        onSuccess: () => {
          setEditingProfileField(null);
        }
      });
    } catch (error) {
      console.error("프로필 수정 실패:", error);
    }
  };

  // 키보드 및 포커스 이벤트 (Enter로 저장, Esc/Blur로 취소)
  const handleProfileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveProfileField();
    } else if (e.key === 'Escape') {
      cancelProfileEdit();
    }
  };

  const handleProfileBlur = () => {
    if (!updateProfileMutation.isPending) {
      cancelProfileEdit();
    }
  };

  // 링크 추가 핸들러
  const onSubmit = async (data: AddLinkFormData) => {
    if (!user) return;
    addLinkMutation.mutate(
      { title: data.title.trim(), url: data.url.trim() },
      {
        onSuccess: () => {
          reset();
          setDialogOpen(false);
        },
      }
    );
  };

  // 인라인 수정 상태
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editErrors, setEditErrors] = useState<{ title?: string; url?: string }>({});

  // 삭제 모달 상태
  const [deletingLink, setDeletingLink] = useState<FirestoreLinkItem | null>(null);

  const handleEditStart = (link: FirestoreLinkItem) => {
    setEditingLinkId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditErrors({});
  };

  const handleEditCancel = () => {
    setEditingLinkId(null);
    setEditTitle("");
    setEditUrl("");
    setEditErrors({});
  };

  const handleEditSubmit = async (linkId: string) => {
    if (!user) return;
    const result = addLinkSchema.safeParse({ title: editTitle, url: editUrl });
    if (!result.success) {
      const fieldErrors: { title?: string; url?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === 'title') fieldErrors.title = err.message;
        if (err.path[0] === 'url') fieldErrors.url = err.message;
      });
      setEditErrors(fieldErrors);
      return;
    }

    setEditErrors({});
    updateLinkMutation.mutate(
      { id: linkId, title: result.data.title.trim(), url: result.data.url.trim() },
      {
        onSuccess: () => {
          setEditingLinkId(null);
        },
        onError: () => {
          setEditErrors({ title: "수정 중 오류가 발생했습니다." });
        }
      }
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLink || !user) return;
    deleteLinkMutation.mutate(deletingLink.id, {
      onSuccess: () => {
        setDeletingLink(null);
      }
    });
  };

  const handleCopyLink = () => {
    if (!user) return;
    const link = `${window.location.origin}/${profile?.displayName || user.uid}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("링크가 클립보드에 복사되었습니다.", {
        description: "이제 친구들에게 내 마이링크를 공유해보세요!",
      });
    }).catch(() => {
      toast.error("링크 복사에 실패했습니다.");
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">인증 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* 헤더 영역 */}
      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-md mx-auto w-full px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">MyLink</div>
          <div className="flex items-center gap-2">
            {user && (
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary transition-colors">
                <Link href={`/${profile?.displayName || user.uid}`} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">미리보기</span>
                </Link>
              </Button>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User Avatar"} />
                      <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" />
                    <span>내 링크 복사</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(`/${profile?.displayName || user.uid}`, '_blank')} className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>내 퍼블릭 페이지 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/stats" className="flex items-center w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>내 통계 보기</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                    {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    <span>테마 변경 ({theme === "dark" ? "라이트" : "다크"})</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={signInWithGoogle} variant="default">
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="w-full max-w-md flex flex-col gap-6 py-12 px-4">
        {!user ? (
          /* 비로그인 화면 (방문자 또는 랜딩) */
          <div className="text-center flex flex-col items-center gap-6 py-12">
            <h1 className="text-3xl font-bold tracking-tight">나만의 링크 모음</h1>
            <p className="text-muted-foreground">
              로그인 후 나만의 링크 페이지를 만들고 관리해보세요.
              <br />간편하게 모든 링크를 한 곳에 모을 수 있습니다.
            </p>
            <Button onClick={signInWithGoogle} size="lg" className="mt-4">
              <LogIn className="w-5 h-5 mr-2" />
              구글 계정으로 시작하기
            </Button>
          </div>
        ) : (
          /* 로그인 사용자 대시보드 */
          <>
            {/* 프로필 섹션 (인라인 편집) */}
            <section className="flex flex-col items-center text-center gap-4 mb-8 w-full">
              
              {/* 닉네임 (displayName) - 수정 불가 */}
              <div className="px-6 py-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground">{profile?.displayName}</h1>
              </div>

              <div className="flex flex-col items-center gap-1">
                {/* 이름 (name) */}
                {editingProfileField === 'name' ? (
                  <div className="flex flex-col gap-1 w-full max-w-[240px]">
                    <div className="relative">
                      <Input
                        value={tempProfileValue}
                        onChange={(e) => setTempProfileValue(e.target.value)}
                        onKeyDown={handleProfileKeyDown}
                        onBlur={handleProfileBlur}
                        placeholder="이름"
                        disabled={updateProfileMutation.isPending}
                        className="text-center font-semibold text-sm h-9 w-full px-8 rounded-lg"
                        autoFocus
                      />
                    </div>
                    {profileEditError && <p className="text-xs text-destructive font-medium">{profileEditError}</p>}
                  </div>
                ) : (
                  <div 
                    className="group relative cursor-pointer px-4 py-1 rounded-lg hover:bg-primary/5 transition-all duration-200"
                    onClick={() => startProfileEdit('name')}
                  >
                    <p className="text-sm font-semibold text-muted-foreground/80 tracking-wide uppercase">{profile?.name}</p>
                    <Pencil className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-all duration-200" />
                  </div>
                )}

                {/* 소개글 (bio) */}
                {editingProfileField === 'bio' ? (
                  <div className="flex flex-col gap-1 w-full max-w-[320px] mt-1">
                    <div className="relative">
                      <Input
                        value={tempProfileValue}
                        onChange={(e) => setTempProfileValue(e.target.value)}
                        onKeyDown={handleProfileKeyDown}
                        onBlur={handleProfileBlur}
                        placeholder="간단한 소개를 입력해주세요."
                        disabled={updateProfileMutation.isPending}
                        className="text-center text-sm h-9 w-full px-8 rounded-lg"
                        autoFocus
                      />
                    </div>
                    {profileEditError && <p className="text-xs text-destructive font-medium">{profileEditError}</p>}
                  </div>
                ) : (
                  <div 
                    className="group relative cursor-pointer px-5 py-2 rounded-lg hover:bg-primary/5 transition-all duration-200 mt-1 max-w-[340px]"
                    onClick={() => startProfileEdit('bio')}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{profile?.bio}</p>
                    <Pencil className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-0 group-hover:opacity-100 text-muted-foreground transition-all duration-200" />
                  </div>
                )}
              </div>
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
                        disabled={addLinkMutation.isPending}
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
                        disabled={addLinkMutation.isPending}
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
                      disabled={addLinkMutation.isPending}
                      onClick={() => {
                        reset();
                        setDialogOpen(false);
                      }}
                    >
                      취소
                    </Button>
                    <Button type="submit" id="submit-link-button" disabled={addLinkMutation.isPending}>
                      {addLinkMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          추가 중...
                        </>
                      ) : (
                        "추가하기"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* 링크 삭제 확인 모달 */}
            <Dialog open={!!deletingLink} onOpenChange={(open) => !open && setDeletingLink(null)}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                  <DialogDescription className="pt-2">
                    <span className="font-semibold text-foreground">&quot;{deletingLink?.title}&quot;</span> 링크를 삭제합니다.
                    <br />
                    <span className="text-destructive font-medium mt-2 block">이 작업은 되돌릴 수 없습니다.</span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setDeletingLink(null)} disabled={deleteLinkMutation.isPending}>
                    취소
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLinkMutation.isPending}>
                    {deleteLinkMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        삭제 중...
                      </>
                    ) : (
                      "삭제하기"
                    )}
                  </Button>
                </DialogFooter>
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
                  const parsedUrl = new URL(link.url);
                  const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;

                  if (editingLinkId === link.id) {
                    return (
                      <Card key={link.id} className="p-4 border-primary shadow-sm">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="링크 제목"
                              disabled={updateLinkMutation.isPending}
                            />
                            {editErrors.title && <p className="text-sm text-destructive">{editErrors.title}</p>}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="URL"
                              disabled={updateLinkMutation.isPending}
                            />
                            {editErrors.url && <p className="text-sm text-destructive">{editErrors.url}</p>}
                          </div>
                          <div className="flex justify-end gap-2 mt-1">
                            <Button variant="outline" size="sm" onClick={handleEditCancel} disabled={updateLinkMutation.isPending}>
                              <X className="w-4 h-4 mr-1" /> 취소
                            </Button>
                            <Button size="sm" onClick={() => handleEditSubmit(link.id)} disabled={updateLinkMutation.isPending}>
                              {updateLinkMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                              저장
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  }

                  return (
                    <div key={link.id} className="relative group w-full">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                      >
                        <Card className="flex items-center justify-between p-4 min-h-[64px] transition-all duration-300 hover:scale-[1.01] hover:bg-accent hover:text-accent-foreground cursor-pointer border-border shadow-sm group-hover:shadow-md">
                          {/* 왼쪽 영역 (아이콘 고정 너비) */}
                          <div className="flex-shrink-0 w-10 flex items-center justify-start">
                            <div className="w-8 h-8 relative bg-background rounded-lg p-1.5 border shadow-sm">
                              <Image
                                src={faviconUrl}
                                alt={`${link.title} icon`}
                                fill
                                className="object-contain p-1"
                                unoptimized
                              />
                            </div>
                          </div>
                          
                          {/* 중앙 영역 (텍스트) */}
                          <div className="flex-1 px-2 text-center overflow-hidden">
                            <span className="font-bold text-[15px] truncate block">{link.title}</span>
                            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                              <MousePointerClick className="w-3 h-3 text-muted-foreground/60" />
                              <span className="text-[11px] font-medium text-muted-foreground/60 tracking-tight">
                                {link.clicks?.toLocaleString() || 0} clicks
                              </span>
                            </div>
                          </div>

                          {/* 오른쪽 영역 (공백 - 왼쪽과 대칭을 위해) */}
                          <div className="flex-shrink-0 w-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* 여기에 별도의 아이콘을 넣을 수도 있지만, 일단 비워둠 (수정/삭제 버튼이 absolute이므로) */}
                          </div>
                        </Card>
                      </a>
                      {/* 수정/삭제 버튼 (오른쪽 정렬) */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-lg shadow-sm border bg-background/90 hover:bg-background"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditStart(link);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-lg shadow-sm border bg-background/90 hover:text-destructive hover:bg-background"
                          onClick={(e) => {
                            e.preventDefault();
                            setDeletingLink(link);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Powered by MyLink
        </footer>
      </div>
    </div>
  );
}
