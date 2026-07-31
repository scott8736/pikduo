
# PIKDUO - 이상형 월드컵 (SEO + Cloudflare + AdSense)

피쿠(piku.co.kr) + 플레이듀오(playduo.kr) 벤치마킹.

## 1. 로컬 실행
```bash
npm install
npm run dev
```

## 2. GitHub 푸시 (네가 할 일)
```bash
git init
git add .
git commit -m "feat: pikduo v1"
git branch -M main
git remote add origin https://github.com/너의아이디/pikduo.git
git push -u origin main
```

## 3. Cloudflare Pages 연결
- Cloudflare Dashboard > Pages > Create a project > Connect to Git
- Build: `npm run build`, Output: `dist`
- Env Vars: `GEMINI_API_KEY` = 네 Gemini 키
- Custom Domain 연결

## 4. 기능
- 홈: 핫 트렌드 10개 + 검색 + 카테고리
- /w/:id : 토너먼트 플레이 + SEO 설명 + 랭킹
- /create : 이미지 드래그앤드롭 + 2MB 압축 (canvas 800px webp 0.7)
- /admin (1234) : 월드컵 관리 + Gemini 자동생성 + 스케줄러 설정
- /blog : SEO 블로그 + CTA
- /deploy : 배포 가이드 + sitemap.xml 미리보기 + robots.txt

## 5. AdSense
`index.html`의 ca-pub-XXXXXXXX 를 네 퍼블리셔 ID로 교체
`public/ads.txt` 교체
3곳 슬롯: 상단, 인피드, 플레이 중간

## 6. SEO 체크리스트
- [x] sitemap.xml 동적 생성
- [x] JSON-LD WebSite/SearchBox, VideoGame, FAQ
- [x] Open Graph, Twitter Card
- [x] 시맨틱 HTML, lazy loading
- [x] 800자 이상 블로그 + CTA
