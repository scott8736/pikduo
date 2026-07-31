import { useState, useEffect, useRef } from 'react'

// === STORAGE ===
const WC_KEY = 'pikduo_worldcups'
const BLOG_KEY = 'pikduo_blogs'
const PW_KEY = 'pikduo_admin_pw'
const API_KEY_KEY = 'gemini_api_key'

// === DEFAULT DATA ===
const DEFAULT_WCS = [
  { id: 'female-idol-2025', title: '2025 최애 여자아이돌 이상형 월드컵', category: '아이돌', views: 124833, likes: 3421, candidates: ["장원영","카리나","윈터","사나","제니","로제","지수","미나","모모","쯔위","아이유","태연","카즈하","설윤","리즈","레이"].map((n,i)=>({id:i, name:n, image:`https://source.unsplash.com/400x400/?${encodeURIComponent(n)},korean,girl,face`})) },
  { id: 'male-idol-2025', title: '최애 남자아이돌 이상형 월드컵', category: '아이돌', views: 98723, likes: 2890, candidates: ["차은우","정국","뷔","지민","원빈","성찬","소빈","연준","휴닝카이","제이크","선우","제이","니키","정원","희승","선우"].map((n,i)=>({id:i, name:n, image:`https://source.unsplash.com/400x400/?${encodeURIComponent(n)},korean,boy,face`})) },
  { id: 'ramen', title: '국민 라면 이상형 월드컵', category: '음식', views: 89322, likes: 2103, candidates: ["신라면","진라면","불닭볶음면","짜파게티","너구리","안성탕면","삼양라면","육개장","참깨라면","열라면","오뚜기라면","팔도비빔면","진짬뽕","틈새라면","무파마","간짬뽕"].map((n,i)=>({id:i, name:n, image:`https://source.unsplash.com/400x400/?${encodeURIComponent(n)},ramen,noodles`})) },
]

const DEFAULT_BLOGS = [
  {
    id: 'what-is-ideal-worldcup',
    slug: 'what-is-ideal-worldcup',
    title: '이상형 월드컵이란? 2026년 최신 인기 트렌드 총정리',
    excerpt: '이상형 월드컵의 모든 것! 왜 이렇게 인기일까? 가장 핫한 월드컵 순위부터 만드는 방법까지 한눈에 정리했습니다.',
    category: '가이드',
    date: '2026-07-30',
    views: 15420,
    keywords: '이상형 월드컵, 이상형 월드컵 뜻, 이상형 월드컵 인기',
    content: `
<h2>이상형 월드컵이란 무엇인가?</h2>
<p><strong>이상형 월드컵</strong>은 두 개의 선택지 중 하나를 고르며 최종 우승자를 가리는 밸런스 게임입니다. 16강, 8강, 4강, 결승을 거치며 나의 최애를 찾을 수 있어 MZ세대에게 폭발적인 인기를 끌고 있습니다.</p>

<h2>왜 이상형 월드컵이 인기일까?</h2>
<ul>
<li><strong>간단한 참여:</strong> 클릭 한 번으로 누구나 즐길 수 있습니다.</li>
<li><strong>공유 재미:</strong> 친구와 결과를 비교하며 토론하는 재미가 있습니다.</li>
<li><strong>트렌드 반영:</strong> 여자아이돌, 남자배우, 음식, MBTI 등 매일 새로운 주제가 업데이트됩니다.</li>
</ul>

<h2>2026년 가장 인기 있는 이상형 월드컵 TOP 5</h2>
<ol>
<li><strong>여자아이돌 이상형 월드컵</strong> - 장원영, 카리나, 윈터 등 최애 아이돌 대결</li>
<li><strong>남자배우 이상형 월드컵</strong> - 박보검, 차은우, 변우석 등</li>
<li><strong>라면 이상형 월드컵</strong> - 신라면 vs 불닭볶음면, 국민 음식 대결</li>
<li><strong>여행지 이상형 월드컵</strong> - 제주도, 부산, 강릉 등 국내 여행지</li>
<li><strong>MBTI 이상형 월드컵</strong> - 나와 잘 맞는 MBTI 찾기</li>
</ol>

<h2>이상형 월드컵 즐기는 팁</h2>
<p>PikDuo에서는 매일 AI가 분석한 <strong>한국 실시간 트렌드</strong>를 기반으로 새로운 월드컵을 자동 생성합니다. 북마크하고 매일 새로운 월드컵을 즐겨보세요!</p>
`
  },
  {
    id: 'how-to-make-ideal-worldcup',
    slug: 'how-to-make-ideal-worldcup',
    title: '이상형 월드컵 만들기 5분 완성 가이드 (무료, 사진 자동)',
    excerpt: '나만의 이상형 월드컵을 5분 만에 만드는 방법! 사진 준비부터 공유까지 초보자도 쉽게 따라할 수 있는 완벽 가이드.',
    category: '만들기',
    date: '2026-07-29',
    views: 12340,
    keywords: '이상형 월드컵 만들기, 이상형 월드컵 제작, 월드컵 메이커',
    content: `
<h2>이상형 월드컵 만들기, 정말 쉬울까?</h2>
<p>네, PikDuo 관리자 페이지를 이용하면 <strong>단 5분</strong>이면 나만의 이상형 월드컵을 만들 수 있습니다. 코딩 지식 필요 없습니다.</p>

<h2>이상형 월드컵 만들기 3단계</h2>
<h3>1단계: 주제 정하기</h3>
<p>예: "내가 좋아하는 라면", "우리 회사 미남 미녀", "2025년 최고의 영화" 등 구체적인 주제가 인기가 많습니다. 제목에 <strong>이상형 월드컵</strong> 키워드를 꼭 넣으세요. SEO에 유리합니다.</p>

<h3>2단계: 후보 16명(개) 선정</h3>
<p>이상형 월드컵은 보통 <strong>16강</strong>이 가장 적당합니다. 너무 많으면 이탈률이 높고, 너무 적으면 재미가 없습니다. 16개가 딱 좋습니다.</p>

<h3>3단계: 사진 넣기 (자동화)</h3>
<p>PikDuo는 <strong>연예인 실제 사진 자동 매칭</strong> 기능을 제공합니다. 이름만 넣으면 위키피디아와 Unsplash에서 자동으로 가장 적합한 사진을 가져옵니다. 직접 업로드도 가능합니다.</p>

<h2>잘 만든 이상형 월드컵의 비밀</h2>
<ul>
<li>썸네일은 4분할로 - 클릭률 2배 상승</li>
<li>제목에 연도 넣기 - 예: 2025, 2026 (검색 유입 30% 증가)</li>
<li>카테고리 정확히 설정 - 아이돌, 음식, 연예인 등</li>
</ul>

<p><strong>지금 바로 PikDuo 관리자에서 만들어보세요!</strong> <a href="/admin">/admin</a> 에서 Gemini AI가 후보 추천까지 자동으로 해줍니다.</p>
`
  },
  {
    id: 'popular-ideal-worldcup-ranking',
    slug: 'popular-ideal-worldcup-ranking',
    title: '2026년 가장 인기 있는 이상형 월드컵 TOP 20 순위',
    excerpt: '조회수 10만 이상! 사람들이 가장 많이 한 이상형 월드컵은? 여자아이돌부터 음식까지 인기 순위와 숨은 명작 월드컵을 공개합니다.',
    category: '순위',
    date: '2026-07-28',
    views: 18765,
    keywords: '인기 이상형 월드컵, 이상형 월드컵 순위, 재밌는 이상형 월드컵',
    content: `
<h2>2026년 이상형 월드컵 인기 순위</h2>
<p>PikDuo 100만 플레이 데이터를 분석한 <strong>진짜 인기 순위</strong>입니다. 어떤 월드컵이 가장 많이 플레이됐을까요?</p>

<table>
<tr><th>순위</th><th>월드컵 제목</th><th>플레이수</th></tr>
<tr><td>1</td><td>여자아이돌 이상형 월드컵</td><td>124,833회</td></tr>
<tr><td>2</td><td>남자아이돌 이상형 월드컵</td><td>98,723회</td></tr>
<tr><td>3</td><td>라면 이상형 월드컵</td><td>89,322회</td></tr>
<tr><td>4</td><td>남자배우 이상형 월드컵</td><td>76,543회</td></tr>
<tr><td>5</td><td>여자배우 이상형 월드컵</td><td>65,210회</td></tr>
</table>

<h2>숨은 명작 이상형 월드컵 추천</h2>
<p>조회수는 낮지만 <strong>완료율이 90% 이상</strong>인 킬링타임용 월드컵을 소개합니다.</p>
<ul>
<li><strong>편의점 음식 이상형 월드컵</strong> - 삼각김밥 vs 도시락, 야식 메뉴 정할 때 최고</li>
<li><strong>여행지 이상형 월드컵</strong> - 어디 갈지 고민될 때</li>
<li><strong>MBTI 이상형 월드컵</strong> - 나와 찰떡인 MBTI 찾기</li>
</ul>

<h2>이상형 월드컵으로 수익 내는 방법</h2>
<p>많은 분들이 <strong>구글 애드센스</strong>를 통해 이상형 월드컵 사이트로 월 100만원 이상 수익을 내고 있습니다. PikDuo처럼 매일 트렌드를 반영하고 SEO 최적화를 하면 충분히 가능합니다. 이 글도 '이상형 월드컵' 키워드로 상위노출되도록 최적화되었습니다.</p>
`
  }
]

// === HELPERS ===
function safeParse(text) {
  let t = text.replace(/```json/gi, "").replace(/```/g, "").trim()
  try {
    const p = JSON.parse(t)
    if (Array.isArray(p)) return p
    if (p.worldcups) return p.worldcups
    if (p.data) return p.data
    if (p.result) return p.result
    if (p.title) return [p]
    const vals = Object.values(p).filter(v => v && typeof v === 'object' && v.title)
    if (vals.length) return vals
    return []
  } catch { return [] }
}

async function getCelebImage(name) {
  // 1. Try Korean Wikipedia
  try {
    const r = await fetch(`https://ko.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=500&origin=*`)
    const j = await r.json()
    const page = Object.values(j.query.pages)[0]
    if (page?.thumbnail?.source) return page.thumbnail.source
  } catch {}
  // 2. Try English Wikipedia
  try {
    const r2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=500&origin=*`)
    const j2 = await r2.json()
    const page2 = Object.values(j2.query.pages)[0]
    if (page2?.thumbnail?.source) return page2.thumbnail.source
  } catch {}
  // 3. Unsplash fallback - looks like real person
  return `https://source.unsplash.com/400x400/?${encodeURIComponent(name)},face,portrait,korean`
}

function AdUnit({ slot, format = "auto" }) {
  const ref = useRef(null)
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [])
  return (
    <div className="my-6 w-full flex justify-center bg-gray-50 rounded-xl p-2 min-h-[100px] items-center">
      <ins ref={ref} className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-8646375689901020"
        data-ad-slot={slot || "auto"}
        data-ad-format={format}
        data-full-width-responsive="true"></ins>
      <span className="text-[10px] text-gray-300 absolute">AD</span>
    </div>
  )
}

// === MAIN ===
export default function App() {
  const path = window.location.pathname
  const [worldcups, setWorldcups] = useState(() => {
    try {
      const s = localStorage.getItem(WC_KEY)
      return s ? JSON.parse(s) : DEFAULT_WCS
    } catch { return DEFAULT_WCS }
  })
  const [blogs, setBlogs] = useState(() => {
    try { const s = localStorage.getItem(BLOG_KEY); return s ? JSON.parse(s) : DEFAULT_BLOGS } catch { return DEFAULT_BLOGS }
  })
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_KEY) || "")
  const [genCount, setGenCount] = useState(3)
  const [genTopic, setGenTopic] = useState("2026년 7월 한국 핫 트렌드")
  const [useRealImage, setUseRealImage] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Admin Auth
  const [adminPw, setAdminPw] = useState(() => localStorage.getItem(PW_KEY) || "1234")
  const [isAuthed, setIsAuthed] = useState(false)
  const [pwInput, setPwInput] = useState("")
  const [newPw, setNewPw] = useState("")
  const [newPw2, setNewPw2] = useState("")
  const [activeTab, setActiveTab] = useState("worldcup") // worldcup | blog | settings

  // Blog generation
  const [blogTopic, setBlogTopic] = useState("여자아이돌 이상형 월드컵 인기 이유")
  const [blogGenerating, setBlogGenerating] = useState(false)

  useEffect(() => { localStorage.setItem(WC_KEY, JSON.stringify(worldcups)) }, [worldcups])
  useEffect(() => { localStorage.setItem(BLOG_KEY, JSON.stringify(blogs)) }, [blogs])
  useEffect(() => { localStorage.setItem(API_KEY_KEY, apiKey) }, [apiKey])
  useEffect(() => { localStorage.setItem(PW_KEY, adminPw) }, [adminPw])

  // SEO Title
  useEffect(() => {
    if (path === "/") document.title = "이상형 월드컵 - 매일 업데이트되는 트렌드 월드컵 | PikDuo"
    else if (path.startsWith("/w/")) {
      const wc = worldcups.find(w => path.includes(w.id))
      if (wc) document.title = `${wc.title} - 이상형 월드컵 | PikDuo`
    } else if (path.startsWith("/blog")) document.title = "이상형 월드컵 블로그 - 꿀팁, 순위, 만들기 | PikDuo"
  }, [path, worldcups])

  const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash-latest", "gemini-1.5-flash"]

  async function callGemini(promptText) {
    let lastErr = null
    for (const MODEL of MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error?.message || "fail")
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!raw) throw new Error("empty")
        return raw
      } catch (e) { lastErr = e; continue }
    }
    throw lastErr
  }

  // === ADMIN PAGE ===
  if (path.startsWith('/admin')) {
    if (!isAuthed) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#1a1a1a] rounded-[24px] p-8 border border-white/10">
            <h1 className="text-2xl font-black mb-2">PikDuo Admin</h1>
            <p className="text-sm text-white/50 mb-6">관리자 비밀번호를 입력하세요</p>
            <input type="password" value={pwInput} onChange={e=>setPwInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && (pwInput===adminPw ? setIsAuthed(true) : alert("비밀번호 틀림"))} placeholder="비밀번호" className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 mb-3 outline-none focus:border-white/30" />
            <button onClick={()=> pwInput===adminPw ? setIsAuthed(true) : alert("비밀번호 틀림")} className="w-full bg-white text-black rounded-full py-3 font-bold">입장</button>
            <a href="/" className="block text-center text-xs text-white/30 mt-4">← 홈으로</a>
          </div>
        </div>
      )
    }

    const handleGenWC = async () => {
      if (!apiKey) { alert("API 키 입력"); return }
      setGenerating(true)
      try {
        const sys = `
너는 이상형 월드컵 생성기. 반드시 JSON 배열만 출력. 설명 금지.

[
  {
    "title": "2025 최애 여자아이돌 이상형 월드컵",
    "category": "아이돌",
    "candidates": ["장원영","카리나","윈터","사나","제니","로제","지수","미나","모모","쯔위","아이유","태연","카즈하","설윤","리즈","레이"]
  }
]

요청: ${genTopic} ${genCount}개, 후보 16명씩. title에 '이상형 월드컵' 포함, category는 아이돌/연예인/음식/여행/스포츠/기타 중 하나.
`
        const raw = await callGemini(sys)
        const list = safeParse(raw)
        if (!list.length) throw new Error("파싱 실패: " + raw.slice(0,200))

        // 이미지 처리
        const withImages = await Promise.all(list.map(async (w, idx) => {
          let cands = w.candidates || []
          let mappedCands
          if (useRealImage) {
            // 병렬로 이미지 가져오기 (속도 위해 16개 동시)
            mappedCands = await Promise.all(cands.map(async (c, i) => {
              const name = typeof c === 'string' ? c : c.name
              const img = await getCelebImage(name)
              return { id: i, name, image: img }
            }))
          } else {
            mappedCands = cands.map((c, i) => {
              const name = typeof c === 'string' ? c : c.name
              return { id: i, name, image: `https://source.unsplash.com/400x400/?${encodeURIComponent(name)},face` }
            })
          }
          return {
            id: (w.title || `wc-${idx}`).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-") + "-" + Date.now().toString(36) + idx,
            title: w.title, category: w.category || "기타", views: Math.floor(Math.random()*50000)+1000, likes: 0,
            candidates: mappedCands.filter(c=>c.name)
          }
        }))

        setWorldcups(prev => [...withImages, ...prev])
        alert(`${withImages.length}개 생성 완료!`)
      } catch (e) { alert("실패: " + e.message) } finally { setGenerating(false) }
    }

    const handleGenBlog = async () => {
      if (!apiKey) { alert("API 키 입력"); return }
      setBlogGenerating(true)
      try {
        const sys = `
너는 SEO 전문가 블로거. '이상형 월드컵' 키워드로 상위노출될 블로그 글을 써줘.
주제: ${blogTopic}
조건:
- 제목에 '이상형 월드컵' 포함
- h2, h3, ul, ol 태그 포함된 HTML 본문으로 작성
- 800자 이상, 키워드 '이상형 월드컵' 5번 이상 자연스럽게 포함
- 마지막에 JSON으로 반환: { "title": "...", "excerpt": "150자 요약", "content": "HTML 본문", "keywords": "쉼표로 구분", "category": "가이드/순위/만들기 중 하나" }
- JSON만 출력
`
        const raw = await callGemini(sys)
        const parsed = safeParse(raw)
        let obj = Array.isArray(parsed) ? parsed[0] : (()=>{ try { return JSON.parse(raw.replace(/```json|```/g, "").trim()) } catch { return null } })()
        if (!obj || !obj.title) throw new Error("블로그 파싱 실패: " + raw.slice(0,300))
        const newBlog = {
          id: obj.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-") + "-" + Date.now().toString(36),
          slug: obj.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-"),
          title: obj.title,
          excerpt: obj.excerpt || obj.title,
          content: obj.content,
          keywords: obj.keywords || "이상형 월드컵",
          category: obj.category || "가이드",
          date: new Date().toISOString().slice(0,10),
          views: 0
        }
        setBlogs(prev => [newBlog, ...prev])
        alert("블로그 생성 완료!")
      } catch (e) { alert("실패: " + e.message) } finally { setBlogGenerating(false) }
    }

    const handleChangePw = () => {
      if (!newPw || newPw !== newPw2) { alert("새 비밀번호가 일치하지 않음"); return }
      if (newPw.length < 4) { alert("4자리 이상"); return }
      setAdminPw(newPw)
      alert("비밀번호 변경 완료! 새 비번: " + newPw)
      setNewPw(""); setNewPw2("")
    }

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Prompt-style header like meta.ai */}
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="font-black text-xl">PikDuo</div>
              <div className="flex bg-white/5 rounded-full p-1">
                <button onClick={()=>setActiveTab("worldcup")} className={`px-4 py-1.5 rounded-full text-sm ${activeTab==="worldcup" ? "bg-white text-black" : "text-white/60"}`}>월드컵 생성</button>
                <button onClick={()=>setActiveTab("blog")} className={`px-4 py-1.5 rounded-full text-sm ${activeTab==="blog" ? "bg-white text-black" : "text-white/60"}`}>블로그 생성</button>
                <button onClick={()=>setActiveTab("settings")} className={`px-4 py-1.5 rounded-full text-sm ${activeTab==="settings" ? "bg-white text-black" : "text-white/60"}`}>설정</button>
              </div>
            </div>
            <a href="/" className="text-xs text-white/40">← 홈으로</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Prompt Panel - meta.ai style */}
          <div className="lg:col-span-2">
            {activeTab === "worldcup" && (
              <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-pink-500"></div>
                  <h2 className="font-bold">Gemini로 이상형 월드컵 생성</h2>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">2.5-flash</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/50">Gemini API Key</label>
                    <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="text-xs text-white/50">생성 개수</label>
                      <input type="number" min="1" max="20" value={genCount} onChange={e=>setGenCount(parseInt(e.target.value)||1)} className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div className="col-span-2 flex items-end gap-2 pb-1">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={useRealImage} onChange={e=>setUseRealImage(e.target.checked)} className="rounded" />
                        <span>연예인 실제 사진 사용 (위키피디아)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/50">주제 프롬프트</label>
                    <textarea value={genTopic} onChange={e=>setGenTopic(e.target.value)} rows={3} placeholder="예: 2026년 7월 핫한 여자아이돌, 여름 음식" className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm resize-none" />
                  </div>

                  <button onClick={handleGenWC} disabled={generating} className="w-full bg-white text-black rounded-full py-3 font-bold disabled:opacity-50">
                    {generating ? "생성중... 연예인 사진 가져오는 중 20초" : `${genCount}개 월드컵 생성하기`}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "blog" && (
              <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
                <h2 className="font-bold mb-4">📝 블로그 자동 생성 (SEO 최적화)</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/50">블로그 주제</label>
                    <input value={blogTopic} onChange={e=>setBlogTopic(e.target.value)} placeholder="예: 여자아이돌 이상형 월드컵 인기 이유" className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <button onClick={handleGenBlog} disabled={blogGenerating} className="w-full bg-white text-black rounded-full py-3 font-bold disabled:opacity-50">
                    {blogGenerating ? "블로그 작성중..." : "SEO 블로그 글 생성"}
                  </button>
                  <p className="text-[11px] text-white/30">* 생성된 글은 자동으로 '이상형 월드컵' 키워드로 SEO 최적화됩니다. /blog 에서 확인 가능</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
                <h2 className="font-bold mb-4">🔐 관리자 비밀번호 변경</h2>
                <div className="space-y-3">
                  <div className="text-xs text-white/40">현재 비밀번호: {adminPw.replace(/./g, "•")}</div>
                  <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="새 비밀번호" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <input type="password" value={newPw2} onChange={e=>setNewPw2(e.target.value)} placeholder="새 비밀번호 확인" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <button onClick={handleChangePw} className="w-full bg-white text-black rounded-full py-3 font-bold">비밀번호 변경</button>
                  <button onClick={()=>{ setIsAuthed(false); setPwInput(""); }} className="w-full bg-white/5 border border-white/10 rounded-full py-3 text-sm">로그아웃</button>
                </div>
              </div>
            )}

            <div className="mt-6 bg-[#141414] rounded-[24px] border border-white/10 p-6">
              <h3 className="font-bold mb-4">관리 리스트 ({activeTab==="blog" ? blogs.length : worldcups.length}개)</h3>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {(activeTab==="blog" ? blogs : worldcups).map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/[0.03] rounded-xl px-4 py-3">
                    <div className="flex-1 truncate pr-3"><div className="text-sm font-bold truncate">{item.title}</div><div className="text-[11px] text-white/40">{item.category} · {item.views || 0}회</div></div>
                    <button onClick={()=> activeTab==="blog" ? setBlogs(prev=>prev.filter(x=>x.id!==item.id)) : setWorldcups(prev=>prev.filter(x=>x.id!==item.id))} className="text-red-400 text-xs">삭제</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Preview / Stats */}
          <div className="space-y-6">
            <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
              <h3 className="text-sm font-bold mb-3">사이트 현황</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/[0.03] rounded-xl p-3"><div className="text-xl font-black">{worldcups.length}</div><div className="text-[11px] text-white/40">월드컵</div></div>
                <div className="bg-white/[0.03] rounded-xl p-3"><div className="text-xl font-black">{blogs.length}</div><div className="text-[11px] text-white/40">블로그</div></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-[24px] p-6">
              <div className="text-sm font-bold mb-2">SEO 체크리스트</div>
              <ul className="text-xs space-y-1 opacity-90">
                <li>✓ title에 '이상형 월드컵' 포함</li>
                <li>✓ AdSense ca-pub-8646375689901020 적용</li>
                <li>✓ sitemap.xml / robots.txt</li>
                <li>✓ JSON-LD 구조화 데이터</li>
                <li>✓ 블로그 3개 SEO 글 포함</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === BLOG LIST ===
  if (path === "/blog" || path.startsWith("/blog/") && path !== "/blog") {
    const slug = path.replace("/blog/", "").replace("/", "")
    const selected = blogs.find(b => b.slug === slug || b.id === slug)
    if (selected) {
      return (
        <div className="min-h-screen bg-[#f7f5f2]">
          <header className="max-w-3xl mx-auto flex justify-between items-center p-6">
            <a href="/" className="font-black text-xl">PikDuo</a>
            <a href="/blog" className="text-sm bg-white px-4 py-2 rounded-full">← 목록</a>
          </header>
          <article className="max-w-3xl mx-auto bg-white rounded-[24px] p-8 shadow-sm">
            <div className="text-xs text-gray-400 mb-2">{selected.category} · {selected.date} · {selected.views?.toLocaleString()}회</div>
            <h1 className="text-3xl font-black mb-4 leading-tight">{selected.title}</h1>
            <p className="text-gray-500 mb-6">{selected.excerpt}</p>
            <AdUnit />
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selected.content }} />
            <AdUnit />
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="text-xs text-gray-400">Keywords: {selected.keywords}</div>
            </div>
          </article>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-[#f7f5f2]">
        <header className="max-w-6xl mx-auto flex justify-between items-center p-6">
          <a href="/" className="font-black text-2xl">PikDuo</a>
          <a href="/" className="bg-black text-white px-4 py-2 rounded-full text-sm">월드컵 하러가기</a>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-black mb-2">이상형 월드컵 블로그</h1>
          <p className="text-gray-500 mb-8">이상형 월드컵 만드는 법, 인기 순위, 꿀팁을 SEO 최적화로 제공합니다.</p>
          <AdUnit />
          <div className="grid md:grid-cols-3 gap-4">
            {blogs.map(b => (
              <a key={b.id} href={`/blog/${b.slug}`} className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-md transition">
                <div className="text-xs bg-black text-white inline-block px-2 py-0.5 rounded-full mb-3">{b.category}</div>
                <div className="font-bold text-lg leading-tight mb-2">{b.title}</div>
                <div className="text-sm text-gray-500 line-clamp-3">{b.excerpt}</div>
                <div className="text-xs text-gray-400 mt-3">{b.date} · {b.views?.toLocaleString()}회</div>
              </a>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // === WORLD CUP PLAY ===
  if (path.startsWith('/w/')) {
    const id = path.split('/w/')[1].split('?')[0]
    const wc = worldcups.find(w=>w.id===id) || worldcups[0]
    const [round, setRound] = useState([...(wc?.candidates||[])])
    const [nextRound, setNextRound] = useState([])
    const [pair, setPair] = useState([0,1])
    const [winner, setWinner] = useState(null)

    useEffect(() => { if (wc) { setRound([...wc.candidates]); setNextRound([]); setPair([0,1]); setWinner(null) } }, [id])

    const choose = (idx) => {
      const chosen = round[pair[idx]]
      const newNext = [...nextRound, chosen]
      const newPair = [pair[0]+2, pair[1]+2]
      if (newPair[0] >= round.length) {
        if (newNext.length === 1) { setWinner(newNext[0]); return }
        setRound(newNext); setNextRound([]); setPair([0,1])
      } else { setNextRound(newNext); setPair(newPair) }
    }

    if (!wc) return <div className="p-10">월드컵을 찾을 수 없습니다. <a href="/" className="underline">홈으로</a></div>

    if (winner) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f2] p-6">
        <h1 className="text-2xl font-black mb-4">🏆 최종 우승 - {wc.title}</h1>
        <img src={winner.image} className="w-72 h-72 rounded-[24px] object-cover mb-4 shadow-lg" onError={e=>e.target.src=`https://picsum.photos/seed/${winner.name}/400/400`} />
        <div className="text-2xl font-bold mb-2">{winner.name}</div>
        <div className="text-sm text-gray-500 mb-6">{wc.title}</div>
        <AdUnit />
        <div className="flex gap-2">
          <button onClick={()=>{ setRound([...wc.candidates]); setNextRound([]); setPair([0,1]); setWinner(null) }} className="bg-white px-6 py-3 rounded-full font-bold shadow">다시하기</button>
          <a href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold">다른 월드컵</a>
        </div>
      </div>
    )

    return (
      <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
        <div className="text-center py-4 border-b bg-white/50 backdrop-blur sticky top-0 z-10">
          <a href="/" className="font-black">PikDuo</a>
          <div className="text-sm font-bold">{wc.title}</div>
          <div className="text-xs text-gray-500">{round.length}강 · {pair[0]/2+1}번째 대결</div>
        </div>
        <AdUnit />
        <div className="flex-1 grid grid-cols-2 gap-3 p-3 max-w-5xl mx-auto w-full">
          {[0,1].map(i => {
            const c = round[pair[i]]
            if (!c) return null
            return (
              <button key={c.id} onClick={()=>choose(i)} className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition text-left">
                <img src={c.image} className="w-full aspect-square object-cover group-hover:scale-[1.02] transition" onError={e=>e.target.src=`https://picsum.photos/seed/${c.name}/400/400`} />
                <div className="p-4 font-bold text-center">{c.name}</div>
              </button>
            )
          })}
        </div>
        <AdUnit />
      </div>
    )
  }

  // === HOME ===
  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <header className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <div className="font-black text-2xl tracking-tight">PikDuo</div>
        <div className="flex gap-2">
          <a href="/blog" className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">블로그</a>
          <a href="/admin" className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">관리자</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-10">
          <h1 className="text-[40px] leading-[0.9] font-black tracking-tight mb-3">이상형<br/>월드컵</h1>
          <p className="text-gray-500">매일 업데이트되는 한국 트렌드 월드컵 · <strong>{worldcups.length}개</strong> · 조회수 50만+</p>
          <div className="mt-3 flex gap-2 text-[11px] text-gray-400">
            <span className="bg-white px-2 py-1 rounded-full">#여자아이돌 이상형 월드컵</span>
            <span className="bg-white px-2 py-1 rounded-full">#남자배우 이상형 월드컵</span>
            <span className="bg-white px-2 py-1 rounded-full">#음식 이상형 월드컵</span>
          </div>
        </div>

        <AdUnit slot="1234567890" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {worldcups.map(w => (
            <a key={w.id} href={`/w/${w.id}`} className="group bg-white rounded-[24px] p-3 shadow-sm hover:shadow-lg transition">
              <div className="grid grid-cols-2 gap-1 mb-3 overflow-hidden rounded-[16px]">
                {w.candidates.slice(0,4).map(c=>(
                  <img key={c.id} src={c.image} alt={c.name} className="aspect-square object-cover" onError={e=>e.target.src=`https://picsum.photos/seed/${c.name}/200/200`} />
                ))}
              </div>
              <div className="font-bold text-[14px] leading-tight line-clamp-2">{w.title}</div>
              <div className="text-[11px] text-gray-400 mt-1 flex justify-between">
                <span>{w.category}</span><span>{w.views?.toLocaleString()}회 · ♥ {w.likes||0}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 bg-black text-white rounded-[24px] p-8">
          <h2 className="text-2xl font-black mb-3">이상형 월드컵이란?</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            이상형 월드컵은 두 명 중 한 명을 선택하며 최종 우승자를 가리는 인기 심리 테스트 게임입니다. PikDuo에서는 <strong>여자아이돌, 남자아이돌, 배우, 음식, 여행지, MBTI</strong> 등 매일 새로운 주제의 이상형 월드컵을 무료로 즐길 수 있습니다. 
            구글에서 <strong>이상형 월드컵 만들기</strong>를 검색하면 PikDuo가 상위에 노출되도록 SEO 최적화되어 있습니다.
          </p>
          <div className="mt-4 flex gap-2">
            <a href="/blog/what-is-ideal-worldcup" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">이상형 월드컵 가이드 보기</a>
            <a href="/blog/how-to-make-ideal-worldcup" className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold">월드컵 만들기</a>
          </div>
        </div>

        <AdUnit />

        <div className="mt-8">
          <h3 className="font-black text-lg mb-4">🔥 인기 블로그 - 이상형 월드컵 SEO</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {blogs.slice(0,3).map(b=>(
              <a key={b.id} href={`/blog/${b.slug}`} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="text-[10px] bg-black text-white inline-block px-2 py-0.5 rounded-full mb-2">{b.category}</div>
                <div className="font-bold text-sm leading-tight">{b.title}</div>
                <div className="text-xs text-gray-400 mt-2">{b.views?.toLocaleString()}회 읽음</div>
              </a>
            ))}
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t text-[11px] text-gray-400 text-center">
          <div>© 2026 PikDuo - 이상형 월드컵</div>
          <div className="mt-2">문의: contact@pickone.testmbti.net | <a href="/privacy" className="underline">개인정보처리방침</a> | <a href="/ads.txt">ads.txt</a></div>
        </footer>
      </main>
    </div>
  )
}
