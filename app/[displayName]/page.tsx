import { Metadata } from 'next';
import { getUserIdByDisplayNameLite, getUserProfileLite } from '@/lib/firestore-lite';
import ProfileClient from './ProfileClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ displayName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unwrappedParams = await params;
  const displayName = decodeURIComponent(unwrappedParams.displayName);
  
  const userId = await getUserIdByDisplayNameLite(displayName);
  if (!userId) return {};

  const profile = await getUserProfileLite(userId) as any;
  if (!profile) return {
    title: `${displayName} - MyLink`,
  };

  return {
    title: `${profile.name} (@${displayName}) - MyLink`,
    description: profile.bio || `${profile.name}님의 링크를 확인해보세요.`,
    openGraph: {
      title: `${profile.name} (@${displayName}) - MyLink`,
      description: profile.bio || `${profile.name}님의 링크를 확인해보세요.`,
      type: 'profile',
      username: displayName,
    },
  };
}

export default async function UserPublicPage({ params }: Props) {
  const unwrappedParams = await params;
  const displayName = decodeURIComponent(unwrappedParams.displayName);

  const userId = await getUserIdByDisplayNameLite(displayName);
  
  if (!userId) {
    notFound();
  }

  const profile = await getUserProfileLite(userId) as any;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": profile?.name || displayName,
    "description": profile?.bio || "",
    "image": `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
    "mainEntity": {
      "@type": "Person",
      "name": profile?.name || displayName,
      "alternateName": displayName,
      "description": profile?.bio || "",
      "image": `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileClient displayName={displayName} />
    </>
  );
}
