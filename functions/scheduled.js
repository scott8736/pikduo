
// Cloudflare Cron - 매일 09:00 KST 실행
export async function scheduled(event, env, ctx){
  // Gemini로 트렌드 3개 생성 후 D1 또는 KV에 저장하는 로직
  console.log('Daily cron: generate trending worldcups', event.cron)
}
