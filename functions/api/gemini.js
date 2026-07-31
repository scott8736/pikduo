
export async function onRequestPost(context){
  const { request, env } = context
  const { prompt } = await request.json()
  const key = env.GEMINI_API_KEY
  if(!key) return new Response(JSON.stringify({error:'GEMINI_API_KEY 없음'}), {status:500})
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({contents:[{parts:[{text: prompt}]}]})
  })
  const data = await res.json()
  return new Response(JSON.stringify(data), {headers:{'Content-Type':'application/json'}})
}
