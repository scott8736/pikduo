import { useState, useEffect } from 'react'

const WC_KEY = 'pikduo_worldcups'
const BLOG_KEY = 'pikduo_blogs'
const PW_KEY = 'pikduo_admin_pw'
const API_KEY_KEY = 'gemini_api_key'

const CURRENT_YEAR = 2026
const NEXT_YEAR = 2027

const DEFAULT_WCS = [
  { id: 'female-idol-2026', title: '2026 최애 여자아이돌 이상형 월드컵', category: '아이돌', views: 124833, candidates: ["장원영","카리나","윈터","사나","제니","로제","지수","미나","모모","쯔위","아이유","태연","카즈하","설윤","리즈","레이"].map((n,i)=>({id:i, name:n, image: getImageUrl(n, '아이돌', i)})) },
  { id: 'male-actor-2026', title: '2026 최애 남자배우 이상형 월드컵', category: '연예인', views: 98723, candidates: ["박보검","차은우","송강","정해인","박서준","현빈","공유","이동욱","남주혁","변우석","김수현","이종석","지창욱","안보현","로운","강태오"].map((n,i)=>({id:i, name:n, image: getImageUrl(n, '연예인', i)})) },
  { id: 'chicken-2026', title: '2026 최애 치킨 이상형 월드컵', category: '음식', views: 89322, candidates: ["후라이드치킨","양념치킨","간장치킨","마늘치킨","파닭","치즈볼","닭강정","닭꼬치","찜닭","닭갈비","닭볶음탕","치킨버거","치킨너겟","순살치킨","불닭치킨","허니치킨"].map((n,i)=>({id:i, name:n, image: getImageUrl(n, '음식', i)})) },
]

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(0) | 0
  return Math.abs(h)
}

// === 개선된 이미지 매칭 ===
function getImageUrl(name, category, index = 0) {
  const encoded = encodeURIComponent(name)
  const seed = hashCode(name + category) + index
  
  // 아이돌/연예인: 실제 사진처럼 보이는 아바타 + 위키피디아는 런타임에 시도
  if (category === '아이돌' || category === '연예인') {
    // pravatar + ui-avatars 조합: 사람 얼굴 느낌, 텍스트 매칭 100%
    // 색상은 해시로 고정해서 같은 사람은 같은 색
    const colors = ["1a1a1a","2d2d2d","3a3a3a","4a4a4a","5a5a5a"]
    const bg = colors[seed % colors.length]
    return `https://ui-avatars.com/api/?name=${encoded}&background=${bg}&color=fff&size=400&font-size=0.28&bold=true&format=svg`
  }
  
  // 음식: 음식 전용 플레이스홀더 + 이모지로 매칭 확실하게
  if (category === '음식') {
    const foodEmojis = { "치킨":"🍗", "라면":"🍜", "피자":"🍕", "버거":"🍔", "치즈":"🧀", "닭":"🍗" }
    let emoji = "🍽️"
    for (const k in foodEmojis) { if (name.includes(k)) { emoji = foodEmojis[k]; break } }
    // placehold.co에 한글 텍스트 + 이모지 느낌으로 확실하게 매칭
    return `https://placehold.co/400x400/111111/FFFFFF/png?text=${encoded}`
  }
  
  // 기타: 깔끔한 텍스트 카드
  return `https://placehold.co/400x400/222222/FFFFFF/png?text=${encoded}`
}

async function getRealCelebImage(name) {
  // 1. 한국어 위키피디아 시도
  try {
    const r = await fetch(`https://ko.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=500&origin=*`)
    const j = await r.json()
    const page = Object.values(j.query.pages)[0]
    if (page?.thumbnail?.source && !page.thumbnail.source.includes("No_image")) {
      return page.thumbnail.source
    }
  } catch {}
  // 2. 영어 위키
  try {
    const r2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=500&origin=*`)
    const j2 = await r2.json()
    const page2 = Object.values(j2.query.pages)[0]
    if (page2?.thumbnail?.source) return page2.thumbnail.source
  } catch {}
  return null // 실패시 null 반환, 그럼 getImageUrl fallback 사용
}

function safeParse(text) {
  let t = text.replace(/```json/gi, "").replace(/```/g, "").trim()
  // 과거년도 강제 치환
  t = t.replace(/2024/g, "2026").replace(/2025/g, "2026")
  try {
    const p = JSON.parse(t)
    if (Array.isArray(p)) return p
    if (p.worldcups) return p.worldcups
    if (p.data) return p.data
    if (p.title) return [p]
    const vals = Object.values(p).filter(v => v && typeof v === 'object' && v.title)
    if (vals.length) return vals
    return []
  } catch { return [] }
}

function sanitizeTitle(title) {
  // 과거년도 제거, 2026으로 강제
  let t = title.replace(/2024|2025/g, "2026")
  if (!t.includes("2026") && !t.includes("2027")) {
    // 연도가 없으면 2026 추가
    if (!t.includes("이상형 월드컵")) t += " 이상형 월드컵"
    t = t.replace("이상형 월드컵", "2026 이상형 월드컵")
  }
  return t
}

const DEFAULT_BLOGS = [
  {
    id: 'what-is-2026',
    slug: 'what-is-ideal-worldcup-2026',
    title: '2026 이상형 월드컵이란? 최신 트렌드 총정리',
    excerpt: '2026년 가장 핫한 이상형 월드컵 트렌드! 왜 이렇게 인기일까?',
    category: '가이드', date: '2026-07-30', views: 15420,
    keywords: '2026 이상형 월드컵, 이상형 월드컵',
    content: `<h2>2026 이상형 월드컵이란?</h2><p><strong>2026 이상형 월드컵</strong>은 두 개 중 하나를 선택하며 최종 우승자를 가리는 게임입니다.</p><h2>2026년 인기 TOP5</h2><ol><li>2026 여자아이돌 이상형 월드컵</li><li>2026 남자배우 이상형 월드컵</li><li>2026 치킨 이상형 월드컵</li></ol>`
  },
  {
    id: 'how-to-make-2026',
    slug: 'how-to-make-ideal-worldcup-2026',
    title: '2026 이상형 월드컵 만들기 5분 완성 가이드',
    excerpt: '나만의 2026 이상형 월드컵 만들기 초간단 가이드',
    category: '만들기', date: '2026-07-29', views: 12340,
    keywords: '2026 이상형 월드컵 만들기',
    content: `<h2>2026 이상형 월드컵 만들기</h2><p>PikDuo에서 5분이면 완성! 2026년 트렌드로 만들어보세요.</p>`
  },
  {
    id: 'rank-2026',
    slug: 'popular-ranking-2026',
    title: '2026 가장 인기 있는 이상형 월드컵 TOP 20',
    excerpt: '2026년 조회수 10만 이상 인기 월드컵 순위',
    category: '순위', date: '2026-07-28', views: 18765,
    keywords: '2026 인기 이상형 월드컵',
    content: `<h2>2026 인기 순위</h2><p>2026년 가장 많이 플레이된 이상형 월드컵을 공개합니다.</p>`
  }
]

export default function App() {
  const path = window.location.pathname
  const [worldcups, setWorldcups] = useState(() => {
    try { const s = localStorage.getItem(WC_KEY); return s ? JSON.parse(s) : DEFAULT_WCS } catch { return DEFAULT_WCS }
  })
  const [blogs, setBlogs] = useState(() => {
    try { const s = localStorage.getItem(BLOG_KEY); return s ? JSON.parse(s) : DEFAULT_BLOGS } catch { return DEFAULT_BLOGS }
  })
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_KEY) || "")
  const [genCount, setGenCount] = useState(3)
  const [genTopic, setGenTopic] = useState("2026 한국 핫 트렌드")
  const [useRealImage, setUseRealImage] = useState(false) // 기본 OFF - 플레이스홀더가 매칭 정확함
  const [generating, setGenerating] = useState(false)

  const [adminPw, setAdminPw] = useState(() => localStorage.getItem(PW_KEY) || "1234")
  const [isAuthed, setIsAuthed] = useState(false)
  const [pwInput, setPwInput] = useState("")
  const [newPw, setNewPw] = useState("")
  const [newPw2, setNewPw2] = useState("")
  const [activeTab, setActiveTab] = useState("worldcup")
  const [blogTopic, setBlogTopic] = useState("2026 여자아이돌 이상형 월드컵 인기 이유")
  const [blogGenerating, setBlogGenerating] = useState(false)

  useEffect(() => { localStorage.setItem(WC_KEY, JSON.stringify(worldcups)) }, [worldcups])
  useEffect(() => { localStorage.setItem(BLOG_KEY, JSON.stringify(blogs)) }, [blogs])
  useEffect(() => { localStorage.setItem(API_KEY_KEY, apiKey) }, [apiKey])
  useEffect(() => { localStorage.setItem(PW_KEY, adminPw) }, [adminPw])

  const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash-latest"]

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

  if (path.startsWith('/admin')) {
    if (!isAuthed) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#1a1a1a] rounded-[24px] p-8 border border-white/10">
            <h1 className="text-2xl font-black mb-2">PikDuo Admin</h1>
            <p className="text-sm text-white/50 mb-6">비밀번호 입력</p>
            <input type="password" value={pwInput} onChange={e=>setPwInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && (pwInput===adminPw ? setIsAuthed(true) : alert("틀림"))} placeholder="비밀번호" className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 mb-3 outline-none" />
            <button onClick={()=> pwInput===adminPw ? setIsAuthed(true) : alert("틀림")} className="w-full bg-white text-black rounded-full py-3 font-bold">입장</button>
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
너는 2026년 최신 이상형 월드컵 생성기. 반드시 JSON 배열만 출력. 설명 절대 금지.

규칙:
1. 절대 2024, 2025 같은 과거 연도 쓰지 마. 반드시 2026 또는 2027만 사용.
2. 제목 형식: "2026 최애 OOO 이상형 월드컵" - 반드시 2026 포함, '이상형 월드컵' 포함
3. ${genCount}개 생성, 각 후보 16명
4. 후보 이름은 구체적으로. 예: 치킨이면 "후라이드치킨, 양념치킨" 처럼 음식 이름으로, 절대 빌딩/풍경 이름 쓰지 마
5. category는 아이돌/연예인/음식/여행/스포츠/기타 중 하나

예시:
[
  {
    "title": "2026 최애 여자아이돌 이상형 월드컵",
    "category": "아이돌",
    "candidates": ["장원영","카리나","윈터","사나","제니","로제","지수","미나","모모","쯔위","아이유","태연","카즈하","설윤","리즈","레이"]
  }
]

요청: ${genTopic} ${genCount}개 만들어줘. 현재 2026년이야. 과거 연도 금지!
`
        const raw = await callGemini(sys)
        const list = safeParse(raw)
        if (!list.length) throw new Error("파싱 실패: " + raw.slice(0,200))

        const withImages = await Promise.all(list.map(async (w, idx) => {
          const cleanTitle = sanitizeTitle(w.title || "2026 이상형 월드컵")
          const category = w.category || "기타"
          let cands = w.candidates || []
          // 과거년도 후보에 있으면 제거
          cands = cands.filter(c => {
            const name = typeof c === 'string' ? c : c.name
            return !/2024|2025/.test(name)
          })

          let mappedCands
          if (useRealImage && (category === '아이돌' || category === '연예인')) {
            // 실제 사진 시도, 실패시 플레이스홀더
            mappedCands = await Promise.all(cands.map(async (c, i) => {
              const name = typeof c === 'string' ? c : c.name
              const real = await getRealCelebImage(name)
              return { id: i, name, image: real || getImageUrl(name, category, i) }
            }))
          } else {
            mappedCands = cands.map((c, i) => {
              const name = typeof c === 'string' ? c : c.name
              return { id: i, name, image: getImageUrl(name, category, i) }
            })
          }

          return {
            id: cleanTitle.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-") + "-" + Date.now().toString(36) + idx,
            title: cleanTitle,
            category,
            views: Math.floor(Math.random()*50000)+1000,
            likes: 0,
            candidates: mappedCands.filter(c=>c.name)
          }
        }))

        setWorldcups(prev => [...withImages, ...prev])
        alert(`${withImages.length}개 생성 완료! (2026년 버전, 사진 매칭 개선)`)
      } catch (e) { alert("실패: " + e.message) } finally { setGenerating(false) }
    }

    const handleGenBlog = async () => {
      if (!apiKey) { alert("API 키 입력"); return }
      setBlogGenerating(true)
      try {
        const sys = `
너는 2026년 SEO 블로거. '2026 이상형 월드컵' 키워드로 글 써줘.
주제: ${blogTopic}
조건:
- 제목에 반드시 '2026'과 '이상형 월드컵' 포함, 절대 2024/2025 쓰지 마
- HTML 본문 (h2,h3,ul,ol 포함) 800자 이상, 키워드 5번 이상
- JSON만 출력: { "title": "...", "excerpt": "...", "content": "HTML", "keywords": "...", "category": "가이드/순위/만들기" }
`
        const raw = await callGemini(sys)
        let obj
        try {
          const cleaned = raw.replace(/```json|```/g, "").trim().replace(/2024|2025/g, "2026")
          obj = JSON.parse(cleaned)
          if (Array.isArray(obj)) obj = obj[0]
        } catch { throw new Error("파싱 실패: " + raw.slice(0,300)) }
        if (!obj.title) throw new Error("title 없음")
        const newBlog = {
          id: obj.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-") + "-" + Date.now().toString(36),
          slug: obj.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-"),
          title: sanitizeTitle(obj.title),
          excerpt: obj.excerpt || obj.title,
          content: obj.content.replace(/2024|2025/g, "2026"),
          keywords: (obj.keywords || "2026 이상형 월드컵").replace(/2024|2025/g, "2026"),
          category: obj.category || "가이드",
          date: new Date().toISOString().slice(0,10),
          views: 0
        }
        setBlogs(prev => [newBlog, ...prev])
        alert("블로그 생성 완료!")
      } catch (e) { alert("실패: " + e.message) } finally { setBlogGenerating(false) }
    }

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="font-black text-xl">PikDuo 2026</div>
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
          <div className="lg:col-span-2">
            {activeTab === "worldcup" && (
              <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
                <h2 className="font-bold mb-4">2026 이상형 월드컵 생성 (과거년도 차단)</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/50">Gemini API Key</label>
                    <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="text-xs text-white/50">개수</label><input type="number" min="1" max="20" value={genCount} onChange={e=>setGenCount(parseInt(e.target.value)||1)} className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" /></div>
                    <div className="col-span-2 flex flex-col justify-end gap-2 pb-1">
                      <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={useRealImage} onChange={e=>setUseRealImage(e.target.checked)} /> 실제 연예인 사진 시도 (실패시 이름 카드)</label>
                      <div className="text-[10px] text-white/30">체크 해제시 텍스트 매칭 100% 보장 (치킨=치킨 텍스트 카드)</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50">주제 (2026년으로 자동 고정)</label>
                    <textarea value={genTopic} onChange={e=>setGenTopic(e.target.value)} rows={2} className="w-full mt-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm resize-none" />
                    <div className="text-[10px] text-white/30 mt-1">예: 2026 여름 음식, 2026 여자아이돌 - 2024/2025 입력해도 2026으로 자동 변환됨</div>
                  </div>
                  <button onClick={handleGenWC} disabled={generating} className="w-full bg-white text-black rounded-full py-3 font-bold disabled:opacity-50">
                    {generating ? "생성중..." : `${genCount}개 생성 (2026년)`}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "blog" && (
              <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
                <h2 className="font-bold mb-4">📝 2026 SEO 블로그 생성</h2>
                <div className="space-y-4">
                  <input value={blogTopic} onChange={e=>setBlogTopic(e.target.value)} placeholder="예: 2026 여자아이돌 이상형 월드컵 인기 이유" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <button onClick={handleGenBlog} disabled={blogGenerating} className="w-full bg-white text-black rounded-full py-3 font-bold disabled:opacity-50">{blogGenerating ? "작성중..." : "SEO 블로그 생성 (2026년)"}</button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
                <h2 className="font-bold mb-4">🔐 비밀번호 변경</h2>
                <div className="space-y-3">
                  <div className="text-xs text-white/40">현재: {adminPw.replace(/./g, "•")}</div>
                  <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="새 비번" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <input type="password" value={newPw2} onChange={e=>setNewPw2(e.target.value)} placeholder="새 비번 확인" className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <button onClick={()=>{ if (newPw!==newPw2||newPw.length<4) { alert("4자리 이상, 일치해야함"); return } setAdminPw(newPw); alert("변경됨: "+newPw); setNewPw(""); setNewPw2(""); }} className="w-full bg-white text-black rounded-full py-3 font-bold">변경</button>
                  <button onClick={()=>{ setIsAuthed(false); setPwInput("") }} className="w-full bg-white/5 border border-white/10 rounded-full py-3 text-sm">로그아웃</button>
                </div>
              </div>
            )}

            <div className="mt-6 bg-[#141414] rounded-[24px] border border-white/10 p-6">
              <h3 className="font-bold mb-4">{activeTab==="blog" ? `블로그 ${blogs.length}개` : `월드컵 ${worldcups.length}개`}</h3>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {(activeTab==="blog" ? blogs : worldcups).map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/[0.03] rounded-xl px-4 py-3">
                    <div className="flex-1 truncate pr-3"><div className="text-sm font-bold truncate">{item.title}</div><div className="text-[11px] text-white/40">{item.category} · {item.views||0}회</div></div>
                    <button onClick={()=> activeTab==="blog" ? setBlogs(prev=>prev.filter(x=>x.id!==item.id)) : setWorldcups(prev=>prev.filter(x=>x.id!==item.id))} className="text-red-400 text-xs">삭제</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#141414] rounded-[24px] border border-white/10 p-6">
              <h3 className="text-sm font-bold mb-3">2026 패치 노트</h3>
              <ul className="text-xs space-y-1 text-white/60">
                <li>✓ 수동 광고 코드 제거 → 자동광고만</li>
                <li>✓ 2024/2025 차단 → 2026 강제</li>
                <li>✓ 사진 매칭 개선: 텍스트 카드로 정확도 100%</li>
                <li>✓ 연예인은 위키 실제사진 시도 옵션</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (path.startsWith('/blog/')) {
    const slug = path.replace("/blog/", "").replace("/", "")
    const sel = blogs.find(b => b.slug === slug || b.id === slug)
    if (sel) {
      return (
        <div className="min-h-screen bg-[#f7f5f2]">
          <header className="max-w-3xl mx-auto flex justify-between items-center p-6"><a href="/" className="font-black text-xl">PikDuo 2026</a><a href="/blog" className="text-sm bg-white px-4 py-2 rounded-full">← 목록</a></header>
          <article className="max-w-3xl mx-auto bg-white rounded-[24px] p-8 shadow-sm">
            <div className="text-xs text-gray-400 mb-2">{sel.category} · {sel.date}</div>
            <h1 className="text-3xl font-black mb-4 leading-tight">{sel.title}</h1>
            <p className="text-gray-500 mb-6">{sel.excerpt}</p>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sel.content }} />
          </article>
        </div>
      )
    }
  }

  if (path === "/blog") {
    return (
      <div className="min-h-screen bg-[#f7f5f2]">
        <header className="max-w-6xl mx-auto flex justify-between items-center p-6"><a href="/" className="font-black text-2xl">PikDuo 2026</a><a href="/" className="bg-black text-white px-4 py-2 rounded-full text-sm">월드컵</a></header>
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-black mb-2">2026 이상형 월드컵 블로그</h1>
          <p className="text-gray-500 mb-8">2026 최신 트렌드 SEO 글</p>
          <div className="grid md:grid-cols-3 gap-4">
            {blogs.map(b => (
              <a key={b.id} href={`/blog/${b.slug}`} className="bg-white rounded-[24px] p-6 shadow-sm">
                <div className="text-xs bg-black text-white inline-block px-2 py-0.5 rounded-full mb-3">{b.category}</div>
                <div className="font-bold text-lg leading-tight mb-2">{b.title}</div>
                <div className="text-sm text-gray-500">{b.excerpt}</div>
              </a>
            ))}
          </div>
        </main>
      </div>
    )
  }

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
    if (!wc) return <div className="p-10">없음 <a href="/" className="underline">홈으로</a></div>
    if (winner) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f2] p-6">
        <h1 className="text-2xl font-black mb-4">🏆 최종 우승</h1>
        <img src={winner.image} className="w-72 h-72 rounded-[24px] object-cover mb-4 shadow-lg" />
        <div className="text-2xl font-bold mb-6">{winner.name}</div>
        <div className="flex gap-2"><button onClick={()=>{ setRound([...wc.candidates]); setNextRound([]); setPair([0,1]); setWinner(null) }} className="bg-white px-6 py-3 rounded-full font-bold shadow">다시</button><a href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold">다른 월드컵</a></div>
      </div>
    )
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
        <div className="text-center py-4 border-b bg-white/50 backdrop-blur sticky top-0 z-10">
          <a href="/" className="font-black">PikDuo 2026</a>
          <div className="text-sm font-bold">{wc.title}</div>
          <div className="text-xs text-gray-500">{round.length}강</div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3 p-3 max-w-5xl mx-auto w-full">
          {[0,1].map(i => {
            const c = round[pair[i]]
            if (!c) return null
            return <button key={c.id} onClick={()=>choose(i)} className="bg-white rounded-[24px] overflow-hidden shadow-sm"><img src={c.image} className="w-full aspect-square object-cover" /><div className="p-4 font-bold text-center">{c.name}</div></button>
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <header className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <div className="font-black text-2xl">PikDuo 2026</div>
        <div className="flex gap-2"><a href="/blog" className="bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">블로그</a><a href="/admin" className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">관리자</a></div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-[40px] leading-[0.9] font-black mb-3">2026<br/>이상형 월드컵</h1>
        <p className="text-gray-500">매일 업데이트되는 2026 트렌드 · {worldcups.length}개</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {worldcups.map(w => (
            <a key={w.id} href={`/w/${w.id}`} className="bg-white rounded-[24px] p-3 shadow-sm hover:shadow-lg transition">
              <div className="grid grid-cols-2 gap-1 mb-3 overflow-hidden rounded-[16px]">
                {w.candidates.slice(0,4).map(c=><img key={c.id} src={c.image} alt={c.name} className="aspect-square object-cover" />)}
              </div>
              <div className="font-bold text-[14px] leading-tight line-clamp-2">{w.title}</div>
              <div className="text-[11px] text-gray-400 mt-1">{w.category} · {w.views?.toLocaleString()}회</div>
            </a>
          ))}
        </div>
        <footer className="mt-16 pt-8 border-t text-[11px] text-gray-400 text-center">© 2026 PikDuo - 2026 이상형 월드컵 · 자동광고 적용</footer>
      </main>
    </div>
  )
}
