/**
 * Steam API 代理 Worker
 * 缓存 Steam 数据，避免暴露 API Key
 */

const CACHE_TTL = 3600; // 1小时缓存
const STEAM_API = 'https://api.steampowered.com';

// 内存缓存
let cache = {};

function corsHeaders(origin, allowed) {
  const allowedOrigins = [allowed, 'http://localhost:4321', 'http://localhost:3000'];
  const o = allowedOrigins.includes(origin) ? origin : allowed;
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function json(data, origin, allowed, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin, allowed),
  });
}

async function fetchSteam(path, params, apiKey) {
  const url = new URL(`${STEAM_API}${path}`);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('format', 'json');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  return res.json();
}

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL * 1000) {
    return entry.data;
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

async function getOwnedGames(env) {
  const cacheKey = 'owned_games';
  let data = getCached(cacheKey);
  if (data) return data;

  const raw = await fetchSteam(
    '/IPlayerService/GetOwnedGames/v0001/',
    { steamid: env.STEAM_ID, include_appinfo: '1', include_played_free_games: '1' },
    env.STEAM_API_KEY
  );

  const games = raw.response.games || [];

  // 按游玩时间排序
  const byPlaytime = [...games].sort((a, b) => b.playtime_forever - a.playtime_forever);

  // 最近玩的（有最后游玩时间的，按时间倒序）
  const recent = games
    .filter(g => g.rtime_last_played > 0)
    .sort((a, b) => b.rtime_last_played - a.rtime_last_played)
    .slice(0, 10);

  // 总时长
  const totalHours = Math.round(games.reduce((s, g) => s + g.playtime_forever, 0) / 60);

  data = {
    total_games: games.length,
    total_hours: totalHours,
    top_games: byPlaytime.slice(0, 20).map(g => ({
      name: g.name,
      appid: g.appid,
      hours: Math.round(g.playtime_forever / 60 * 10) / 10,
      icon: `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`,
      header: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    })),
    recent_games: recent.map(g => ({
      name: g.name,
      appid: g.appid,
      hours: Math.round(g.playtime_forever / 60 * 10) / 10,
      last_played: g.rtime_last_played,
      icon: `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`,
      header: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    })),
    updated_at: Math.floor(Date.now() / 1000),
  };

  setCache(cacheKey, data);
  return data;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin, env.ALLOWED_ORIGIN) });
    }

    try {
      if (url.pathname === '/stats') {
        const data = await getOwnedGames(env);
        return json(data, origin, env.ALLOWED_ORIGIN);
      }

      return json({ error: 'Not found' }, origin, env.ALLOWED_ORIGIN, 404);
    } catch (e) {
      return json({ error: e.message }, origin, env.ALLOWED_ORIGIN, 500);
    }
  },
};
