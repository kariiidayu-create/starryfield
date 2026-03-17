const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function checkAdmin(request, env) {
  const auth = request.headers.get('Authorization') || '';
  return auth === `Bearer ${env.ADMIN_PASSWORD}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // GET /questions — 已回答的问题（公开）
    if (request.method === 'GET' && path === '/questions') {
      const { results } = await env.DB.prepare(
        'SELECT id, name, question, answer, created_at, answered_at FROM questions WHERE answer IS NOT NULL ORDER BY answered_at DESC'
      ).all();
      return json(results);
    }

    // POST /question — 提交新问题
    if (request.method === 'POST' && path === '/question') {
      const body = await request.json().catch(() => null);
      if (!body?.question?.trim()) return json({ error: '问题不能为空' }, 400);
      const name = (body.name || '匿名').trim().slice(0, 30);
      const question = body.question.trim().slice(0, 300);
      await env.DB.prepare(
        'INSERT INTO questions (name, question, created_at) VALUES (?, ?, ?)'
      ).bind(name, question, new Date().toISOString()).run();
      return json({ ok: true });
    }

    // GET /admin/pending — 待回答的问题（需密码）
    if (request.method === 'GET' && path === '/admin/pending') {
      if (!checkAdmin(request, env)) return json({ error: '无权限' }, 401);
      const { results } = await env.DB.prepare(
        'SELECT id, name, question, created_at FROM questions WHERE answer IS NULL ORDER BY created_at ASC'
      ).all();
      return json(results);
    }

    // POST /admin/reply — 回复问题（需密码）
    if (request.method === 'POST' && path === '/admin/reply') {
      if (!checkAdmin(request, env)) return json({ error: '无权限' }, 401);
      const body = await request.json().catch(() => null);
      if (!body?.id || !body?.answer?.trim()) return json({ error: '参数错误' }, 400);
      await env.DB.prepare(
        'UPDATE questions SET answer = ?, answered_at = ? WHERE id = ?'
      ).bind(body.answer.trim(), new Date().toISOString(), body.id).run();
      return json({ ok: true });
    }

    // DELETE /admin/question/:id — 删除问题（需密码）
    if (request.method === 'DELETE' && path.startsWith('/admin/question/')) {
      if (!checkAdmin(request, env)) return json({ error: '无权限' }, 401);
      const id = parseInt(path.split('/').pop());
      await env.DB.prepare('DELETE FROM questions WHERE id = ?').bind(id).run();
      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  },
};
