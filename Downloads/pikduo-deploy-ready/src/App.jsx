import React, { useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

// ===== 초기 핫 트렌드 10개 (사진 포함) =====
const initialWorldCups = [
  {
    id: 'female-idol-2025',
    title: '2025 최애 여자아이돌 이상형 월드컵',
    description: '아이브, 뉴진스, 에스파, 르세라핌 중 당신의 최애는?',
    category: '아이돌',
    tags: ['아이돌','여자아이돌','K-POP'],
    round: 16,
    plays: 124832,
    thumbnail: 'https://picsum.photos/seed/idol1/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['장원영','카리나','윈터','사쿠라','하니','민지','설윤','리즈','지젤','카즈하','해린','다니엘','유나','레이','닝닝','채원'][i], image:`https://picsum.photos/seed/idol${i}/400/400`, wins: Math.floor(Math.random()*5000)}))
  },
  {
    id: 'ramen-king',
    title: '국민 라면 이상형 월드컵',
    description: '신라면 vs 진라면? 당신의 소울라면을 골라보세요',
    category: '음식',
    tags: ['라면','음식'],
    round: 16,
    plays: 89321,
    thumbnail: 'https://picsum.photos/seed/ramen/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['신라면','진라면매운맛','불닭볶음면','짜파게티','안성탕면','너구리','팔도비빔면','삼양라면','육개장','참깨라면','진짬뽕','틈새라면','오동통면','무파마','열라면','사리곰탕'][i], image:`https://picsum.photos/seed/ramen${i}/400/400`, wins: Math.floor(Math.random()*4000)}))
  },
  {
    id: 'male-actor',
    title: '최애 남자배우 이상형 월드컵',
    description: '박보검, 차은우, 송강, 변우석... 심장이 뛰는 배우는?',
    category: '연예인',
    tags: ['배우','남배우'],
    round: 16,
    plays: 76543,
    thumbnail: 'https://picsum.photos/seed/actor/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['박보검','차은우','송강','변우석','이도현','박서준','정해인','송중기','이민호','김수현','남주혁','로운','안효섭','차서원','이재욱','황인엽'][i], image:`https://picsum.photos/seed/actor${i}/400/400`, wins: Math.floor(Math.random()*3000)}))
  },
  {
    id: 'k-dessert',
    title: 'K-디저트 이상형 월드컵',
    description: '약과부터 두바이초콜릿, 요아정까지 2025-2026 핫 디저트 총집합',
    category: '음식',
    tags: ['디저트','요아정','두바이초콜릿'],
    round: 16,
    plays: 65432,
    thumbnail: 'https://picsum.photos/seed/dessert/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['약과','두바이초콜릿','요아정','붕어빵','탕후루','호떡','약과쿠키','크루아상','마카롱','약과아이스크림','꿀호떡','빙수','호두과자','계란빵','붕어빵아이스크림','약과타르트'][i], image:`https://picsum.photos/seed/dessert${i}/400/400`, wins: Math.floor(Math.random()*3000)}))
  },
  {
    id: 'summer-travel',
    title: '여름 여행지 이상형 월드컵',
    description: '제주도 vs 부산 vs 강릉? 올여름 가고 싶은 곳은?',
    category: '여행',
    tags: ['여행','여름'],
    round: 16,
    plays: 54321,
    thumbnail: 'https://picsum.photos/seed/travel/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['제주도','부산','강릉','여수','속초','경주','전주','통영','거제','포항','울릉도','남해','보성','순천','가평','인천'][i], image:`https://picsum.photos/seed/travel${i}/400/400`, wins: Math.floor(Math.random()*2500)}))
  },
  {
    id: 'chicken-brand',
    title: '치킨 브랜드 이상형 월드컵',
    description: '교촌 vs BHC vs BBQ, 당신의 원픽 치킨은?',
    category: '음식',
    tags: ['치킨','야식'],
    round: 16,
    plays: 98765,
    thumbnail: 'https://picsum.photos/seed/chicken/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['교촌','BHC','BBQ','굽네','처갓집','네네','호식이','또래오래','자담','페리카나','60계','푸라닭','지코바','멕시카나','노랑통닭','후라이드참잘하는집'][i], image:`https://picsum.photos/seed/chicken${i}/400/400`, wins: Math.floor(Math.random()*4000)}))
  },
  {
    id: 'cat-meme',
    title: '고양이 짤 이상형 월드컵',
    description: '귀여움 대잔치! 최애 고양이 짤을 골라보세요',
    category: '동물',
    tags: ['고양이','밈'],
    round: 16,
    plays: 112340,
    thumbnail: 'https://picsum.photos/seed/cat/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:`냥이 ${i+1}`, image:`https://picsum.photos/seed/cat${i}/400/400`, wins: Math.floor(Math.random()*6000)}))
  },
  {
    id: 'snack-2026',
    title: '요즘 핫한 간식 월드컵',
    description: '2026년 편의점 털이템 대결! 두바이 초콜릿부터 요아정까지',
    category: '음식',
    tags: ['간식','트렌드'],
    round: 16,
    plays: 87654,
    thumbnail: 'https://picsum.photos/seed/snack/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['두바이초콜릿','요아정','두바이쫀득쿠키','탕후루','약과','마라로제떡볶이','크림빵','베이글','소금빵','약과쿠키','두바이초코아이스크림','요거트아이스크림','쫀득쿠키','휘낭시에','마들렌','에그타르트'][i], image:`https://picsum.photos/seed/snack${i}/400/400`, wins: Math.floor(Math.random()*3500)}))
  },
  {
    id: 'mbti-crush',
    title: 'MBTI별 이상형 월드컵',
    description: 'ENFP가 좋아할 이상형? MBTI로 알아보는 궁합 월드컵',
    category: 'MBTI',
    tags: ['MBTI','심리테스트'],
    round: 16,
    plays: 145231,
    thumbnail: 'https://picsum.photos/seed/mbti/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:['ENFP 다정한 강아지상','INTJ 시크한 고양이상','ENFJ 다정한 리더','ISTP 무심한 듯 다정한','INFP 감성적인 예술가','ENTP 재치있는 장난꾸러기','ISFJ 따뜻한 배려왕','ESTP 핵인싸','INFJ 신비로운','INTP 천재 공대감성','ESFP 분위기 메이커','ISTJ 믿음직한','ESTJ 든든한','ISFP 순수한','ENTJ 카리스마','ESFJ 사랑둥이'][i], image:`https://picsum.photos/seed/mbti${i}/400/400`, wins: Math.floor(Math.random()*5000)}))
  },
  {
    id: 'drama-2026',
    title: '2026 기대 드라마 월드컵',
    description: '내년 대박 예감 드라마들 중 당신의 원픽은?',
    category: '드라마',
    tags: ['드라마','2026'],
    round: 16,
    plays: 43210,
    thumbnail: 'https://picsum.photos/seed/drama/600/600',
    candidates: Array.from({length:16}).map((_,i)=>({id:i, name:[`드라마 ${i+1}`], image:`https://picsum.photos/seed/drama${i}/400/400`, wins: Math.floor(Math.random()*2000)}))
  },
]

const blogPosts = [
  {slug:'ideal-worldcup-ranking-2025', title:'2025 이상형 월드컵 인기 순위 TOP 20 총정리', desc:'2025년 가장 많이 플레이된 이상형 월드컵 순위를 카테고리별로 분석했습니다.', content:`이상형 월드컵은 단순한 재미를 넘어 내 취향을 발견하는 최고의 방법입니다. 2025년 기준 피쿠와 플레이듀오에서 가장 인기 있었던 이상형 월드컵 주제는 아이돌, 음식, MBTI였습니다. 특히 여자아이돌 월드컵은 평균 플레이수가 12만회를 넘으며 압도적 1위를 차지했습니다. 왜 이렇게 인기가 많을까요? 첫째, 선택의 재미가 있습니다. 토너먼트 형식으로 두 후보 중 하나를 고르는 과정이 도파민을 자극합니다. 둘째, 공유하기 쉽습니다. 결과를 카톡으로 보내 친구와 취향 배틀을 할 수 있습니다. 이 글에서 소개하는 TOP 20 월드컵을 직접 해보세요.`, related:['female-idol-2025','mbti-crush','ramen-king']},
  {slug:'mbti-ideal-type', title:'MBTI별 이상형 월드컵으로 알아보는 나의 이상형', desc:'ENFP, INTJ 등 MBTI별 이상형 특징과 추천 월드컵 모음', content:`MBTI별 이상형 월드컵이 요즘 대세입니다. 단순히 외모가 아닌 성격, 분위기, 가치관까지 고려한 이상형 월드컵이 인기를 끌고 있습니다. ENFP는 다정하고 리액션이 좋은 강아지상을, INTJ는 시크하지만 속 깊은 고양이상을 선호하는 경향이 있습니다. 이 글에서는 MBTI 16유형별 이상형 특징과 함께 꼭 해봐야 할 월드컵 3개를 추천합니다.`, related:['mbti-crush','male-actor','cat-meme']},
  {slug:'ramen-worldcup-psychology', title:'라면 이상형 월드컵으로 알아보는 심리테스트', desc:'당신이 고른 라면이 당신의 성격을 말해줍니다.', content:`라면 이상형 월드컵은 단순한 음식 월드컵이 아닙니다. 신라면을 고른 사람은 도전을 좋아하는 모험가형, 진라면을 고른 사람은 안정적인 것을 좋아하는 신중형이라는 분석이 있습니다. 불닭볶음면을 고른 사람은 스트레스를 매운맛으로 푸는 타입이죠. 라면 월드컵을 통해 내 성격을 알아보세요.`, related:['ramen-king','chicken-brand','k-dessert']},
  {slug:'how-to-make-worldcup', title:'이상형 월드컵 만드는 법 5분 완성 가이드', desc:'초보자도 5분 만에 이상형 월드컵 만드는 방법', content:`이상형 월드컵 만들기는 어렵지 않습니다. 1. 주제 정하기 - 구체적일수록 좋습니다. 2. 후보 16개 모으기 - 이미지 용량은 2MB 이하로 압축하세요. 3. 제목과 설명에 키워드 이상형 월드컵을 3회 이상 포함하세요. 4. 썸네일은 가장 끌리는 이미지로. 5. 공유하기. PIKDUO에서는 드래그앤드롭으로 5분 만에 만들 수 있습니다.`, related:['female-idol-2025','snack-2026','summer-travel']},
  {slug:'yoajung-dubai-chocolate-trend', title:'요아정, 두바이초콜릿 이상형 월드컵이 뜬 이유', desc:'2025-2026년 가장 핫한 디저트 트렌드 분석', content:`2025년 하반기부터 요아정과 두바이초콜릿이 편의점을 점령했습니다. SNS에서 #요아정 #두바이초콜릿 해시태그가 100만개를 넘었죠. 그래서 K-디저트 이상형 월드컵과 요즘 핫한 간식 월드컵이 폭발적인 인기를 끌고 있습니다. 트렌드는 빠르게 변합니다. PIKDUO는 매일 Gemini AI로 최신 트렌드를 반영한 월드컵을 자동 생성합니다.`, related:['k-dessert','snack-2026','chicken-brand']},
  {slug:'adsense-worldcup-site', title:'이상형 월드컵 사이트로 애드센스 수익 내는 법', desc:'Cloudflare Pages + AdSense로 월 100만원 버는 현실적인 방법', content:`이상형 월드컵 사이트는 애드센스 수익화에 최적화되어 있습니다. 체류시간이 길고, 페이지뷰가 많이 나오고, 공유가 활발하기 때문입니다. 핵심은 3가지: 1. SEO 최적화로 이상형 월드컵 키워드 상위노출, 2. 블로그 탭으로 검색 유입 확보, 3. 플레이 중간 광고 배치로 CTR 높이기. Cloudflare Pages는 무료로 빠르고, R2로 이미지 비용도 절약할 수 있습니다.`, related:['female-idol-2025','drama-2026','summer-travel']},
]

// ===== 유틸 =====
const compressImage = (file) => new Promise((resolve, reject)=>{
  const reader = new FileReader()
  reader.onload = e=>{
    const img = new Image()
    img.onload = ()=>{
      const canvas = document.createElement('canvas')
      const max = 800
      let {width, height} = img
      if(width>max || height>max){
        const r = Math.min(max/width, max/height)
        width*=r; height*=r
      }
      canvas.width=width; canvas.height=height
      canvas.getContext('2d').drawImage(img,0,0,width,height)
      canvas.toBlob(b=>resolve(b), 'image/webp', 0.7)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

function useWorldCups(){
  const [list, setList] = useState(()=>{
    const saved = localStorage.getItem('pikduo_worldcups')
    if(saved) try{ return JSON.parse(saved)}catch{}
    return initialWorldCups
  })
  useEffect(()=>{ localStorage.setItem('pikduo_worldcups', JSON.stringify(list)) }, [list])
  return [list, setList]
}

// ===== 레이아웃 =====
function Layout({children}){
  const [q,setQ]=useState('')
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-black text-xl tracking-tight"><span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">PIKDUO</span></Link>
          <div className="flex gap-2 items-center">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="이상형 월드컵 검색" className="hidden md:block w-64 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm outline-none" />
            <Link to="/create" className="px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold">만들기</Link>
            <Link to="/blog" className="px-3 py-1.5 text-sm">블로그</Link>
            <Link to="/admin" className="px-3 py-1.5 text-sm">관리자</Link>
          </div>
        </div>
      </header>
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 text-[12px] text-center py-1">AdSense 상단 슬롯 - ca-pub-XXXXXXXX - Cloudflare Pages에서 빠른 로딩으로 SEO 점수 상승</div>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-xs text-zinc-500">
        <div>© 2026 PIKDUO - 이상형 월드컵 | <Link to="/blog" className="underline">블로그</Link> | <Link to="/deploy" className="underline">배포가이드</Link> | sitemap.xml | robots.txt | ads.txt</div>
        <div className="mt-2">문의: hello@pikduo.kr | 이상형 월드컵은 PIKDUO에서 무료로 즐기세요</div>
      </footer>
    </div>
  )
}

// ===== 홈 =====
function Home({worldcups}){
  const [cat,setCat]=useState('전체')
  const cats = ['전체','아이돌','음식','연예인','여행','동물','MBTI','드라마']
  const filtered = worldcups.filter(w=>cat==='전체' || w.category===cat)
  useEffect(()=>{ document.title='이상형 월드컵 - PIKDUO | 2026 최신 트렌드 이상형 월드컵 모음' },[])
  return (
    <div>
      <section className="rounded-[24px] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 p-[1px] mb-6">
        <div className="rounded-[23px] bg-white dark:bg-zinc-900 p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-black leading-tight">이상형 월드컵<br/>당신의 최애를 골라보세요</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl">아이돌, 라면, 치킨, MBTI까지! 매일 업데이트되는 핫 트렌드 이상형 월드컵을 PIKDUO에서 무료로 즐기고, 직접 만들어 친구에게 공유해보세요. 토너먼트 방식으로 최종 우승을 가려보세요.</p>
          <div className="mt-4 flex gap-2 flex-wrap">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 py-1.5 rounded-full text-sm border ${cat===c?'bg-zinc-900 text-white border-zinc-900':'bg-zinc-100 dark:bg-zinc-800'}`}>{c}</button>)}</div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">🔥 오늘의 핫 트렌드 10</h2>
        <span className="text-xs text-zinc-500">{filtered.length}개</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {filtered.slice(0,10).map(w=>(
          <Link key={w.id} to={`/w/${w.id}`} className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="aspect-square overflow-hidden bg-zinc-100"><img src={w.thumbnail} alt={w.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" /></div>
            <div className="p-3">
              <div className="text-[11px] text-violet-600 font-semibold">{w.category} · {w.round}강</div>
              <div className="font-semibold text-sm leading-tight mt-1 line-clamp-2">{w.title}</div>
              <div className="text-[11px] text-zinc-500 mt-1">▶ {w.plays.toLocaleString()}회</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="my-6 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-3 text-center text-xs">AdSense 인피드 슬롯 - 이상형 월드컵 중간 광고 (CTR 높음)</div>

      <h2 className="font-bold text-lg mt-8 mb-3">✨ 최신 월드컵</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.slice().reverse().slice(0,8).map(w=>(
          <Link key={w.id+'latest'} to={`/w/${w.id}`} className="rounded-xl border p-2 flex gap-2 bg-white dark:bg-zinc-900">
            <img src={w.thumbnail} className="w-12 h-12 rounded-lg object-cover" />
            <div className="text-xs"><div className="font-semibold line-clamp-1">{w.title}</div><div className="text-zinc-500">{w.category}</div></div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ===== 플레이 =====
function Play({worldcups, setWorldcups}){
  const {id}=useParams()
  const nav=useNavigate()
  const wc = worldcups.find(w=>w.id===id)
  const [stage, setStage] = useState(()=>{ const c = wc?.candidates || []; const sh = [...c].sort(()=>Math.random()-0.5).slice(0, wc?.round||16); return {pool: sh, round: sh, next:[], roundName: `${sh.length}강`, winners:[] }})
  const [winner, setWinner] = useState(null)
  const [idx, setIdx] = useState(0)

  useEffect(()=>{
    if(!wc) return
    document.title = `${wc.title} - 이상형 월드컵 | PIKDUO`
    // 조회수 증가
    setWorldcups(prev=>prev.map(p=>p.id===id?{...p, plays:p.plays+1}:p))
  },[id])

  if(!wc) return <div>없음 <Link to="/" className="underline">홈으로</Link></div>

  const choose = (chosen) => {
    const a = stage.round[idx]
    const b = stage.round[idx+1]
    const next = [...stage.next, chosen]
    const nextIdx = idx+2
    if(nextIdx >= stage.round.length){
      if(next.length===1){ setWinner(next[0]); return }
      setStage({pool:stage.pool, round: next, next:[], roundName: next.length===2?'결승' : `${next.length}강`, winners:[]})
      setIdx(0)
    }else{
      setStage({...stage, next})
      setIdx(nextIdx)
    }
  }

  if(winner){
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="text-sm text-zinc-500">{wc.round}강 이상형 월드컵 결과</div>
        <h1 className="text-2xl font-black mt-2">🏆 최종 우승: {winner.name}</h1>
        <div className="mt-4 rounded-3xl overflow-hidden border bg-white dark:bg-zinc-900 p-4">
          <img src={winner.image} className="w-64 h-64 object-cover rounded-2xl mx-auto" />
          <div className="mt-4 font-bold text-lg">{winner.name}</div>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={()=>{setWinner(null); setStage({pool: stage.pool, round: [...stage.pool].sort(()=>Math.random()-0.5).slice(0,wc.round), next:[], roundName:`${wc.round}강`}); setIdx(0)}} className="px-4 py-2 rounded-full bg-zinc-900 text-white">다시하기</button>
            <button onClick={()=>navigator.clipboard.writeText(location.href)} className="px-4 py-2 rounded-full border">링크복사</button>
          </div>
        </div>
        <div className="mt-6 text-left bg-white dark:bg-zinc-900 border rounded-xl p-4 text-sm leading-relaxed">
          <h3 className="font-bold mb-2">{wc.title}이란?</h3>
          {wc.description} {wc.title}은 {wc.category} 카테고리에서 가장 핫한 {wc.round}개의 후보 중 당신의 최애를 토너먼트 방식으로 가려내는 이상형 월드컵 게임입니다. 매일 업데이트되며 친구와 공유할 수 있습니다. 이상형 월드컵을 통해 당신의 취향을 발견해보세요.
          <div className="mt-4 grid grid-cols-4 gap-2">{wc.candidates.slice(0,8).map(c=><div key={c.id} className="text-[10px] text-center"><img src={c.image} className="w-full aspect-square object-cover rounded-lg" /><div className="mt-1 truncate">{c.name}</div></div>)}</div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-sm">💡 <Link to="/blog" className="underline font-semibold">블로그에서 {wc.category} 이상형 월드컵 인기 순위 보기</Link></div>
      </div>
    )
  }

  const a = stage.round[idx]
  const b = stage.round[idx+1]
  if(!a || !b) return null
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-3"><span className="text-sm font-bold">{stage.roundName} - {idx/2+1} / {stage.round.length/2}</span><div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden"><div className="h-full bg-violet-600" style={{width:`${(idx/stage.round.length)*100}%`}} /></div></div>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {[a,b].map((c,i)=>(
          <button key={c.id+'-'+idx+'-'+i} onClick={()=>choose(c)} className="group rounded-[20px] overflow-hidden border-2 border-transparent hover:border-violet-600 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square bg-zinc-100"><img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition" /></div>
            <div className="p-3 font-bold">{c.name}</div>
          </button>
        ))}
      </div>
      <div className="mt-6 text-center text-xs text-zinc-500">VS - 더 끌리는 이상형을 선택하세요. 이미지 용량 2MB 이하 자동 압축 적용됨</div>
    </div>
  )
}

// ===== 만들기 =====
function Create({worldcups, setWorldcups}){
  const [title,setTitle]=useState('')
  const [desc,setDesc]=useState('')
  const [cat,setCat]=useState('아이돌')
  const [round,setRound]=useState(16)
  const [cands,setCands]=useState([])
  const nav=useNavigate()

  const addFiles = async (files)=>{
    const newC=[]
    for(const f of files){
      if(f.size>10*1024*1024){ alert(`${f.name} 10MB 초과`); continue }
      const blob = await compressImage(f)
      const url = URL.createObjectURL(blob)
      newC.push({id:Date.now()+Math.random(), name: f.name.replace(/\.[^/.]+$/, '').slice(0,20), image: url, file: blob})
    }
    setCands(prev=>[...prev, ...newC].slice(0,64))
  }

  const save = ()=>{
    if(!title || cands.length<2) return alert('제목과 후보 2개 이상 필요')
    const id = title.replace(/\s+/g,'-')+'-'+Date.now()
    const wc = {id, title, description:desc||`${title} 이상형 월드컵을 즐겨보세요!`, category:cat, tags:[cat], round, plays:0, thumbnail:cands[0].image, candidates:cands.map((c,i)=>({id:i, name:c.name, image:c.image, wins:0}))}
    setWorldcups([wc, ...worldcups])
    nav(`/w/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black">이상형 월드컵 만들기 - 5분 완성</h1>
      <p className="text-sm text-zinc-500 mt-1">사진은 자동 800px WebP 0.7 압축 (2MB 제한) - Cloudflare R2에 업로드 권장</p>
      <div className="mt-4 space-y-3 bg-white dark:bg-zinc-900 border rounded-2xl p-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목 (예: 최애 라면 이상형 월드컵)" className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 outline-none" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="설명 - SEO용 100자 이상 쓰면 상위노출 잘됨" className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 outline-none h-20" />
        <div className="flex gap-2">
          <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"><option>아이돌</option><option>음식</option><option>연예인</option><option>여행</option><option>동물</option><option>MBTI</option><option>드라마</option></select>
          <select value={round} onChange={e=>setRound(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"><option value={16}>16강</option><option value={32}>32강</option><option value={64}>64강</option></select>
        </div>
        <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); addFiles(e.dataTransfer.files)}} className="border-2 border-dashed rounded-xl p-6 text-center text-sm">드래그앤드롭으로 이미지 추가 또는 <label className="underline cursor-pointer"><input type="file" multiple accept="image/*" hidden onChange={e=>addFiles(e.target.files)} />클릭하여 업로드</label><div className="text-xs text-zinc-500 mt-1">최대 64개, 10MB 이하 (자동 압축)</div></div>
        <div className="grid grid-cols-3 gap-2">{cands.map((c,i)=><div key={c.id} className="relative rounded-xl overflow-hidden border"><img src={c.image} className="aspect-square object-cover w-full" /><input value={c.name} onChange={e=>setCands(prev=>prev.map((p,idx)=>idx===i?{...p,name:e.target.value}:p))} className="w-full text-xs px-1 py-1" /><button onClick={()=>setCands(prev=>prev.filter((_,idx)=>idx!==i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs">×</button></div>)}</div>
        <button onClick={save} className="w-full py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold">이상형 월드컵 생성하기</button>
      </div>
    </div>
  )
}

// ===== 관리자 =====
function Admin({worldcups, setWorldcups}){
  const [pw,setPw]=useState('')
  const [ok,setOk]=useState(false)
  const [geminiKey,setGeminiKey]=useState(localStorage.getItem('gemini_key')||'')
  const [genLoading,setGenLoading]=useState(false)
  const [cron,setCron]=useState('0 0 * * *')

  if(!ok) return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-2xl bg-white dark:bg-zinc-900">
      <h1 className="font-bold">관리자 로그인</h1><p className="text-xs text-zinc-500">비번: 1234</p>
      <input value={pw} onChange={e=>setPw(e.target.value)} type="password" className="mt-3 w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      <button onClick={()=>{if(pw==='1234') setOk(true); else alert('비번 틀림')}} className="mt-3 w-full py-2 rounded-full bg-zinc-900 text-white">입장</button>
    </div>
  )

  const generateWithGemini = async ()=>{
    if(!geminiKey) return alert('Gemini API 키 입력 필요 - https://aistudio.google.com/app/apikey')
    localStorage.setItem('gemini_key', geminiKey)
    setGenLoading(true)
    const prompt = `2026년 7월 한국에서 20대가 열광하는 이상형 월드컵 주제 3개를 JSON 배열로만 답해줘. 형식: [{"title":"...이상형 월드컵","description":"...","category":"아이돌|음식|연예인|여행|동물|MBTI|드라마 중 하나","candidates":["후보1","후보2",...16개]}] 다른 말 없이 JSON만.`
    try{
      // Cloudflare Functions 경유 또는 직접 호출
      let data
      try{
        const r = await fetch('/api/gemini',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({prompt})})
        data = await r.json()
      }catch{
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})})
        data = await r.json()
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data)
      const jsonMatch = text.match(/\[.*\]/s)
      const parsed = JSON.parse(jsonMatch?jsonMatch[0]:text)
      const newWcs = parsed.map((p,i)=>({
        id: `gemini-${Date.now()}-${i}`,
        title: p.title,
        description: p.description,
        category: p.category||'아이돌',
        tags: [p.category],
        round:16,
        plays:0,
        thumbnail:`https://picsum.photos/seed/gemini${Date.now()+i}/600/600`,
        candidates: p.candidates.slice(0,16).map((name, idx)=>({id:idx, name, image:`https://picsum.photos/seed/${encodeURIComponent(name)}${idx}/400/400`, wins:0}))
      }))
      setWorldcups([...newWcs, ...worldcups])
      alert(`${newWcs.length}개 생성 완료!`)
    }catch(e){ alert('생성 실패: '+e.message); console.error(e)}
    setGenLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-black">관리자 대시보드</h1>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="text-xs text-zinc-500">전체 월드컵</div><div className="text-2xl font-bold">{worldcups.length}</div></div>
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="text-xs text-zinc-500">오늘 플레이</div><div className="text-2xl font-bold">{worldcups.reduce((a,b)=>a+b.plays,0).toLocaleString()}</div></div>
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="text-xs text-zinc-500">예상 수익</div><div className="text-2xl font-bold">₩{(worldcups.reduce((a,b)=>a+b.plays,0)*0.8).toLocaleString()}</div></div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white dark:bg-zinc-900 p-4">
        <h2 className="font-bold">🔮 Gemini API 연동 - 매일 트렌드 자동 생성</h2>
        <p className="text-xs text-zinc-500 mt-1">Cloudflare Cron Trigger (wrangler.toml crons = ["0 0 * * *"])로 매일 09:00 KST 자동 실행. functions/scheduled.js에서 Gemini 호출.</p>
        <input value={geminiKey} onChange={e=>setGeminiKey(e.target.value)} placeholder="Gemini API Key (AIza...)" className="mt-3 w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm" />
        <div className="flex gap-2 mt-2">
          <input value={cron} onChange={e=>setCron(e.target.value)} className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm w-40" />
          <span className="text-xs py-2">매일 스케줄 (UTC 00:00 = KST 09:00)</span>
        </div>
        <button disabled={genLoading} onClick={generateWithGemini} className="mt-3 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold disabled:opacity-50">{genLoading?'생성중...':'오늘의 트렌드로 3개 자동생성'}</button>
        <div className="mt-3 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3">프롬프트 예시: "2026년 7월 한국 핫 트렌드 이상형 월드컵 10개 만들어줘" → 후보 16개 포함 JSON으로 받아서 자동 월드컵 생성. 이미지 용량제한은 R2 업로드시 WebP 변환으로 해결.</div>
      </div>

      <div className="mt-6">
        <h2 className="font-bold">월드컵 관리</h2>
        <div className="mt-2 space-y-2">{worldcups.map(w=><div key={w.id} className="flex items-center justify-between border rounded-xl p-2 bg-white dark:bg-zinc-900"><div className="flex gap-2 items-center"><img src={w.thumbnail} className="w-10 h-10 rounded-lg object-cover" /><div className="text-sm"><div className="font-semibold line-clamp-1">{w.title}</div><div className="text-xs text-zinc-500">{w.category} · {w.plays}회</div></div></div><button onClick={()=>{if(confirm('삭제?')) setWorldcups(prev=>prev.filter(p=>p.id!==w.id))}} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs">삭제</button></div>)}</div>
      </div>
    </div>
  )
}

// ===== 블로그 =====
function Blog({worldcups}){
  useEffect(()=>{document.title='이상형 월드컵 블로그 - SEO 맛집 | PIKDUO'},[])
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black">이상형 월드컵 블로그 - SEO 전용</h1>
      <p className="text-sm text-zinc-500 mt-2">이상형 월드컵 관련 검색 유입을 위한 SEO 글 모음. 각 글마다 월드컵으로 가는 CTA 포함.</p>
      <div className="mt-6 grid gap-4">
        {blogPosts.map(b=>(
          <Link key={b.slug} to={`/blog/${b.slug}`} className="rounded-2xl border bg-white dark:bg-zinc-900 p-4 hover:shadow-lg transition">
            <div className="text-xs text-violet-600 font-semibold">SEO · 이상형 월드컵</div>
            <div className="font-bold mt-1">{b.title}</div>
            <div className="text-sm text-zinc-500 mt-1 line-clamp-2">{b.desc}</div>
            <div className="mt-2 flex gap-2 flex-wrap">{b.related.map(rid=>{const rw=worldcups.find(w=>w.id===rid); return rw? <span key={rid} className="text-[11px] px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">{rw.title.slice(0,12)}...</span>:null})}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
function BlogDetail({worldcups}){
  const {slug}=useParams()
  const post = blogPosts.find(b=>b.slug===slug)
  const nav=useNavigate()
  useEffect(()=>{ if(post) document.title=`${post.title} - 이상형 월드컵 블로그 | PIKDUO` },[slug])
  if(!post) return <div>글 없음</div>
  return (
    <article className="max-w-3xl mx-auto">
      <Link to="/blog" className="text-xs underline">← 블로그 목록</Link>
      <h1 className="text-3xl font-black mt-3 leading-tight">{post.title}</h1>
      <p className="text-sm text-zinc-500 mt-2">{post.desc}</p>
      <div className="mt-6 prose dark:prose-invert prose-zinc max-w-none text-[15px] leading-7 whitespace-pre-wrap bg-white dark:bg-zinc-900 border rounded-2xl p-6">{post.content}

{`\n\n이상형 월드컵을 더 재미있게 즐기는 팁: 1. 친구와 함께 플레이하면 취향 차이를 발견할 수 있습니다. 2. 결과를 SNS에 공유하면 댓글이 많이 달립니다. 3. 직접 이상형 월드컵을 만들어보세요. 5분이면 완성됩니다.`}
      </div>
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 p-[1px]">
        <div className="rounded-[15px] bg-white dark:bg-zinc-900 p-4">
          <div className="font-bold">👇 이 글과 관련된 이상형 월드컵 해보기</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
            {post.related.map(rid=>{
              const w=worldcups.find(x=>x.id===rid)
              if(!w) return null
              return <Link key={rid} to={`/w/${w.id}`} className="rounded-xl border p-2 flex gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"><img src={w.thumbnail} className="w-12 h-12 rounded-lg object-cover" /><div className="text-xs"><div className="font-semibold">{w.title}</div><div className="text-violet-600 font-bold mt-1">하러가기 →</div></div></Link>
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border p-4 bg-zinc-50 dark:bg-zinc-800 text-sm">
        <div className="font-bold">FAQ - 이상형 월드컵</div>
        <div className="mt-2 space-y-2 text-xs">
          <div><b>Q: 이상형 월드컵은 무료인가요?</b><br/>A: 네, PIKDUO의 모든 이상형 월드컵은 무료입니다.</div>
          <div><b>Q: 직접 만들 수 있나요?</b><br/>A: 네, 만들기 페이지에서 5분 만에 만들 수 있으며 이미지 자동 압축 기능이 있습니다.</div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"이상형 월드컵은 무료인가요?","acceptedAnswer":{"@type":"Answer","text":"네, PIKDUO의 모든 이상형 월드컵은 무료입니다."}}]})}} />
      </div>
    </article>
  )
}

function Deploy(){
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black">Cloudflare 배포 가이드</h1>
      <div className="mt-4 space-y-4 text-sm">
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="font-bold">1. GitHub 푸시</div><pre className="mt-2 bg-zinc-900 text-white p-3 rounded-xl text-xs overflow-auto">{`git init
git add .
git commit -m "feat: pikduo v1"
git remote add origin https://github.com/너의아이디/pikduo.git
git push -u origin main`}</pre></div>
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="font-bold">2. Cloudflare Pages 연결</div><div className="mt-2 text-xs leading-6">Dashboard {'>'} Pages {'>'} Create a project {'>'} Connect to Git {'>'} Build command: npm run build, Output: dist, Env: GEMINI_API_KEY</div></div>
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="font-bold">3. sitemap.xml 미리보기</div><pre className="mt-2 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl text-[11px] overflow-auto">{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://pikduo.pages.dev/</loc><priority>1.0</priority></url>
  <url><loc>https://pikduo.pages.dev/blog</loc></url>
  ${initialWorldCups.map(w=>`<url><loc>https://pikduo.pages.dev/w/${w.id}</loc></url>`).join('\n  ')}
</urlset>`}</pre></div>
        <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900"><div className="font-bold">4. robots.txt</div><pre className="mt-2 bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl text-xs">User-agent: *{'\n'}Allow: /{'\n'}Sitemap: https://pikduo.pages.dev/sitemap.xml</pre></div>
      </div>
    </div>
  )
}

export default function App(){
  const [worldcups, setWorldcups] = useWorldCups()
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home worldcups={worldcups} />} />
          <Route path="/w/:id" element={<Play worldcups={worldcups} setWorldcups={setWorldcups} />} />
          <Route path="/create" element={<Create worldcups={worldcups} setWorldcups={setWorldcups} />} />
          <Route path="/admin" element={<Admin worldcups={worldcups} setWorldcups={setWorldcups} />} />
          <Route path="/blog" element={<Blog worldcups={worldcups} />} />
          <Route path="/blog/:slug" element={<BlogDetail worldcups={worldcups} />} />
          <Route path="/deploy" element={<Deploy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
