import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pikduo_worldcups'
const API_KEY_STORAGE = 'gemini_api_key'

const DEFAULT_WORLDCUPS = [
  { id: 'female-idol-2025', title: '2025 최애 여자아이돌 이상형 월드컵', category: '아이돌', views: 124833, candidates: ["장원영","카리나","윈터","사나","제니","로제","지수","미나","모모","쯔위","아이유","태연","카즈하","설윤","리즈","레이"].map((n,i)=>({id:i, name:n, image:`https://picsum.photos/seed/${encodeURIComponent(n)}-idol/400/400`})) },
  { id: 'ramen', title: '국민 라면 이상형 월드컵', category: '음식', views: 89322, candidates: ["신라면","진라면","불닭볶음면","짜파게티","너구리","안성탕면","삼양라면","육개장","참깨라면","열라면","오뚜기라면","팔도비빔면","진짬뽕","틈새라면","무파마","간짬뽕"].map((n,i)=>({id:i, name:n, image:`https://picsum.photos/seed/${encodeURIComponent(n)}-ramen/400/400`})) },
  { id: 'male-actor', title: '최애 남자배우 이상형 월드컵', category: '연예인', views: 76543, candidates: ["박보검","차은우","송강","정해인","박서준","현빈","공유","이동욱","남주혁","로운","김수현","이종석","지창욱","안보현","변우석","강태오"].map((n,i)=>({id:i, name:n, image:`https://picsum.photos/seed/${encodeURIComponent(n)}-actor/400/400`})) },
]

function safeParseGeminiText(rawText) {
  let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim()
  let parsed = JSON.parse(cleaned)
  if (Array.isArray(parsed)) return parsed
  if (Array.isArray(parsed.worldcups)) return parsed.worldcups
  if (Array.isArray(parsed.data)) return parsed.data
  if (Array.isArray(parsed.result)) return parsed.result
  if (Array.isArray(parsed.items)) return parsed.items
  if (parsed.worldcup) return [parsed.worldcup]
  if (parsed.title) return [parsed]
  const vals = Object.values(parsed).filter(v => v && typeof v === 'object' && v.title)
  if (vals.length > 0) return vals
  throw new Error("배열을 찾을 수 없음: " + JSON.stringify(parsed).slice(0,200))
}

export default function App() {
  const path = window.location.pathname
  const [worldcups, setWorldcups] = useState(() => {
    try { 
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) { const p = JSON.parse(saved); if (p.length > 0) return p }
      const old = localStorage.getItem('pikduo_worldcups_v2')
      if (old) { const p2 = JSON.parse(old); if (p2.length > 0) return p2 }
      return DEFAULT_WORLDCUPS
    } catch { return DEFAULT_WORLDCUPS }
  })
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || "")
  const [generating, setGenerating] = useState(false)
  const [genCount, setGenCount] = useState(3)
  const [prompt, setPrompt] = useState("2026년 7월 한국 핫 트렌드 이상형 월드컵")

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(worldcups)) }, [worldcups])
  useEffect(() => { localStorage.setItem(API_KEY_STORAGE, apiKey) }, [apiKey])

  if (path.startsWith('/admin')) {
    const handleGenerate = async () => {
      if (!apiKey) { alert("Gemini API 키를 입력하세요"); return }
      setGenerating(true)
      try {
        const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash-latest", "gemini-1.5-flash"]
        const systemPrompt = `
너는 이상형 월드컵 데이터 생성기야.
반드시 아래 JSON 배열 형식으로만 답해. 설명, 마크다운, 인사 절대 금지. JSON 배열만.

[
  {
    "title": "2025 최애 여자아이돌 이상형 월드컵",
    "category": "아이돌",
    "candidates": ["장원영", "카리나", "윈터", "사나", "제니", "로제", "지수", "미나", "모모", "쯔위", "아이유", "태연", "카즈하", "설윤", "리즈", "레이"]
  }
]

요청: ${prompt} ${genCount}개 만들어줘. 후보 16명씩
규칙:
- ${genCount}개 생성
- 각 월드컵 title에 '이상형 월드컵' 포함
- candidates는 16개 문자열 배열
- category는 아이돌/연예인/음식/여행/스포츠/기타 중 하나
- 반드시 JSON 배열만 출력
`
        let lastError = null
        let successList = null

        for (const MODEL of MODELS_TO_TRY) {
          try {
            console.log(`Trying model: ${MODEL}`)
            const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error?.message || `Model ${MODEL} failed`)
            const raw = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (!raw) throw new Error("Empty response")
            console.log(`Model ${MODEL} raw:`, raw)
            const list = safeParseGeminiText(raw)
            successList = list
            break
          } catch (e) {
            console.warn(`Model ${MODEL} failed:`, e.message)
            lastError = e
            continue
          }
        }

        if (!successList) throw lastError || new Error("모든 모델 실패")

        const newWorldcups = successList.map((w, idx) => ({
          id: (w.title || `worldcup-${idx}`).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-") + "-" + Date.now().toString(36) + idx,
          title: w.title, category: w.category || "기타", views: Math.floor(Math.random()*50000)+1000,
          candidates: (w.candidates || []).map((c, i) => {
            const name = typeof c === 'string' ? c : (c.name || "")
            return { id: i, name, image: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400` }
          }).filter(c=>c.name)
        }))

        setWorldcups(prev => [...newWorldcups, ...prev])
        alert(`${newWorldcups.length}개 생성 성공!`)
      } catch (e) {
        console.error(e)
        alert("생성 실패: " + e.message)
      } finally {
        setGenerating(false)
      }
    }

    return (
      <div className="min-h-screen bg-[#f7f5f2] p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black mb-2">PikDuo 관리자</h1>
          <p className="text-gray-500 mb-6"><a href="/" className="underline">← 홈으로</a> | 전체 {worldcups.length}개</p>
          <div className="bg-white rounded-2xl p-6 shadow mb-8">
            <h2 className="font-bold mb-3">🧠 Gemini API 연동 - 자동 생성 (2026 최신 모델)</h2>
            <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full border rounded-lg px-4 py-2 mb-3" />
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500">생성 개수</label>
                <input type="number" min="1" max="20" value={genCount} onChange={e=>setGenCount(parseInt(e.target.value)||1)} className="w-full border rounded-lg px-4 py-2" />
              </div>
              <div className="flex-[3]">
                <label className="text-xs text-gray-500">프롬프트</label>
                <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={2} className="w-full border rounded-lg px-4 py-2" />
              </div>
            </div>
            <button onClick={handleGenerate} disabled={generating} className="bg-black text-white px-6 py-2 rounded-full font-bold disabled:opacity-50">
              {generating ? `생성중... ${genCount}개 20초 걸림` : `${genCount}개 자동 생성`}
            </button>
            <p className="text-xs text-gray-400 mt-2">모델 자동 fallback: 2.5-flash → 1.5-flash-latest 순으로 시도</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-bold mb-4">월드컵 관리</h3>
            {worldcups.map(w => (
              <div key={w.id} className="flex justify-between items-center py-3 border-b last:border-0">
                <div><div className="font-bold">{w.title}</div><div className="text-xs text-gray-400">{w.category} · {w.candidates.length}명 · {w.views}회</div></div>
                <button onClick={()=>setWorldcups(prev=>prev.filter(x=>x.id!==w.id))} className="text-red-400 text-xs">삭제</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (path.startsWith('/w/')) {
    const id = path.split('/w/')[1]
    const wc = worldcups.find(w=>w.id===id) || worldcups[0]
    if (!wc) return <div>없음</div>
    const [round, setRound] = useState([...wc.candidates])
    const [nextRound, setNextRound] = useState([])
    const [pair, setPair] = useState([0,1])
    const [winner, setWinner] = useState(null)
    const choose = (idx) => {
      const chosen = round[pair[idx]]
      const newNext = [...nextRound, chosen]
      const newPair = [pair[0]+2, pair[1]+2]
      if (newPair[0] >= round.length) {
        if (newNext.length === 1) { setWinner(newNext[0]); return }
        setRound(newNext); setNextRound([]); setPair([0,1])
      } else { setNextRound(newNext); setPair(newPair) }
    }
    if (winner) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f2] p-6">
        <h1 className="text-2xl font-black mb-4">🏆 최종 우승</h1>
        <img src={winner.image} className="w-64 h-64 rounded-2xl object-cover mb-4" />
        <div className="text-2xl font-bold mb-6">{winner.name}</div>
        <a href="/" className="bg-black text-white px-8 py-3 rounded-full">다른 월드컵 하기</a>
      </div>
    )
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex flex-col">
        <div className="text-center py-6"><a href="/" className="font-black text-xl">PikDuo</a><div className="text-sm text-gray-500">{wc.title} · {round.length}강</div></div>
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 max-w-4xl mx-auto w-full">
          {[0,1].map(i => {
            const c = round[pair[i]]
            if (!c) return null
            return <button key={c.id} onClick={()=>choose(i)} className="bg-white rounded-3xl overflow-hidden shadow hover:scale-[1.02] transition"><img src={c.image} className="w-full aspect-square object-cover" /><div className="p-4 font-bold text-center">{c.name}</div></button>
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <header className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <div className="font-black text-2xl">PikDuo</div>
        <div className="flex gap-2"><a href="/blog" className="bg-white px-4 py-2 rounded-full text-sm">블로그</a><a href="/admin" className="bg-black text-white px-4 py-2 rounded-full text-sm">관리자</a></div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-black mb-2">이상형 월드컵</h1>
        <p className="text-gray-500 mb-8">매일 업데이트되는 한국 트렌드 월드컵 · {worldcups.length}개</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {worldcups.map(w => (
            <a key={w.id} href={`/w/${w.id}`} className="bg-white rounded-3xl p-3 shadow hover:shadow-lg transition">
              <div className="grid grid-cols-2 gap-1 mb-3">{w.candidates.slice(0,4).map(c=><img key={c.id} src={c.image} className="aspect-square object-cover rounded-xl" />)}</div>
              <div className="font-bold text-sm leading-tight">{w.title}</div>
              <div className="text-xs text-gray-400 mt-1">{w.category} · {w.views.toLocaleString()}회</div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
