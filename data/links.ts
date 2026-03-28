export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string; // (선택) PRD 기획상 구글 파비콘 API가 렌더링되므로, 이 필드는 직접 사용하지 않아도 무방합니다.
}

export const dummyLinks: LinkItem[] = [
  {
    id: 'link_1',
    title: '인스타그램',
    url: 'https://instagram.com/my_username',
  },
  {
    id: 'link_2',
    title: '유튜브',
    url: 'https://youtube.com/@my_channel',
  },
  {
    id: 'link_3',
    title: '기술 블로그',
    url: 'https://velog.io/@minwoo', // 와이어프레임 예시 반영
  },
  {
    id: 'link_4',
    title: 'GitHub 레포지토리',
    url: 'https://github.com/minwoo', // 와이어프레임 예시 반영
  },
  {
    id: 'link_5',
    title: '개인 포트폴리오',
    url: 'https://notion.so/my_portfolio', // 와이어프레임 예시 반영
  },
];
