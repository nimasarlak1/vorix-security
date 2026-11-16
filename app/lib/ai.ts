// اجرای مدل Workers AI با چند مدل جایگزین. مدل‌های قدیمی از رده خارج می‌شوند (llama-3.1-8b-instruct از ۱۴۰۵/۳/۹ بسته شد)،
// پس اگر مدل اول خطا داد، مدل بعدی امتحان می‌شود. با متغیر AI_MODEL در Cloudflare می‌شود مدل اول را عوض کرد.
export const AI_MODELS = ['@cf/zai-org/glm-4.7-flash', '@cf/meta/llama-3.1-8b-instruct-fast'];

// مدل‌های مختلف پاسخ را به دو شکل برمی‌گردانند: {response} یا فرمت OpenAI (choices[0].message.content)
export function extractReply(out: any): string {
  if (typeof out?.response === 'string') return out.response.trim();
  const c = out?.choices?.[0]?.message?.content;
  if (typeof c === 'string') return c.trim();
  return '';
}

export async function runAI(
  ai: any,
  preferred: string | undefined,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<{ reply: string; model: string; errors: { model: string; error: string }[] }> {
  const models = [...(preferred ? [preferred] : []), ...AI_MODELS.filter((m) => m !== preferred)];
  const errors: { model: string; error: string }[] = [];
  for (const model of models) {
    try {
      const out: any = await Promise.race([
        ai.run(model, { messages, max_tokens: maxTokens, temperature: 0.3 }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000)),
      ]);
      const reply = extractReply(out);
      if (reply) return { reply, model, errors };
      errors.push({ model, error: 'پاسخ خالی یا با فرمت ناشناخته: ' + JSON.stringify(out ?? null).slice(0, 200) });
    } catch (e) {
      errors.push({ model, error: String((e as any)?.message || e).slice(0, 250) });
    }
  }
  return { reply: '', model: '', errors };
}
