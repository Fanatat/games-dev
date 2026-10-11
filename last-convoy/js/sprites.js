// «Последний конвой»: бойцы, повозка, фон и предметы — картинками (NanoBanana → tools/art_cut.py →
// ART_DATA в js/art_data.js). На бойца 8 рисунков (покой, шаг, пауза шага, шаг, замах, удар,
// попадание, лежит), у Вождя ещё 4 (замах по земле, удар, рык, повержен). Оживление кодом:
// дыхание, сжатие на ударе, белая вспышка попадания, красный контур вожака, падение и растворение.
// Только рисунок: правила боя, хитбоксы и тайминги прежние (сид-сравнение — tests/convoy_sim.py).
'use strict';

const Sprites = (() => {
  const D = typeof ART_DATA !== 'undefined' ? ART_DATA : null;
  const images = {};
  const tints = {};
  // все рисунки смотрят вправо; враг отражается по facing
  const UNIT_ART = {
    player: { infantry: 'guard', archer: 'archer', heavy: 'heavy', spear: 'spear', shieldbearer: 'dwarf', bomber: 'gnome' },
    enemy: { infantry: 'goblin', spear: 'goblin_spear', archer: 'goblin_archer', heavy: 'orc', chief: 'warchief' },
  };
  // Уровни похода (CONVOY.levels): у каждого свой фон и свои враги в тех же ролях. Нет рисунка уровня —
  // враг первого уровня (гоблин), чтобы бой не остался без картинки.
  const REGION_ENEMY = {
    2: { infantry: 'wolf', spear: 'wolf_spear', archer: 'witch', heavy: 'bear', chief: 'alpha' },
  };
  let region = 1;
  // Рост «покоя» обычного бойца в атласе — 210 px, на поле ≈ 76 ед. арены (рост рига ≈ 74).
  // Тяжёлый (240), орк (260) и Вождь (300) крупнее уже в атласе — множитель heavy 1.12 не нужен.
  const PX = 76 / 210;
  const WALK = ['walk1', 'pass', 'walk2', 'pass'];
  // Снаряжение по эпохам (карта «Новая эпоха»): ступень 1 и 2 — атласы guard_t2, guard_t3 …
  // Нет атласа или он ещё грузится — боец в первом снаряжении.
  const TIER = ['', '_t2', '_t3'];

  function image(src) {
    let im = images[src];
    if (!im) { im = images[src] = new Image(); im.decoding = 'async'; im.src = src; }
    return im;
  }
  const ok = (im) => im.complete && im.naturalWidth > 0;
  function load() {
    if (!D) return;
    const later = (id) => /_t\d$/.test(id) || regionOf(id) > 1;
    for (const [id, u] of Object.entries(D.units)) if (!later(id)) image(u.src);
    if (D.bg.bg_r1) image(D.bg.bg_r1.src);
    image(D.props.src); image(D.wagon.src); image(D.wagon_painted.src);
    if (D.portraits) image(D.portraits.src);
    // снаряжение 2–3 нужно не раньше первой «Новой эпохи», уровень 2 — не раньше первой доставки: грузим после старта
    setTimeout(() => {
      for (const [id, u] of Object.entries(D.units)) if (later(id)) image(u.src);
      for (const b of Object.values(D.bg)) image(b.src);
    }, 4000);
  }

  // Силуэт атласа одним цветом (вспышка попадания, контур вожака) — строится один раз, по требованию.
  function silhouette(src, color) {
    const key = src + color;
    if (tints[key]) return tints[key];
    const im = image(src);
    if (!ok(im)) return null;
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d');
    g.drawImage(im, 0, 0);
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = color; g.fillRect(0, 0, c.width, c.height);
    return (tints[key] = c);
  }

  function regionOf(id) {
    for (const [r, map] of Object.entries(REGION_ENEMY)) if (Object.values(map).includes(id)) return Number(r);
    return 1;
  }
  // Уровень для фона и врагов: бой, меню и значки рисуют выбранный уровень; его рисунки грузятся сразу.
  function setRegion(n) {
    region = Number(n) || 1;
    if (!D) return;
    const map = REGION_ENEMY[region] || {};
    for (const id of Object.values(map)) if (D.units[id]) image(D.units[id].src);
    const b = D.bg['bg_r' + region];
    if (b) image(b.src);
  }
  // Фон уровня; пока картинка грузится (или её нет) — фон первого уровня.
  function bgId(r = region) { return D && D.bg['bg_r' + r] && ok(image(D.bg['bg_r' + r].src)) ? 'bg_r' + r : 'bg_r1'; }

  // tier — ступень эпохи стороны (0–2); враги без снаряжения по эпохам, зато свои на каждом уровне
  function artId(typeId, enemy, tier = 0, r = region) {
    if (enemy && REGION_ENEMY[r] && D) {
      const rid = REGION_ENEMY[r][typeId];
      if (rid && D.units[rid] && ok(image(D.units[rid].src))) return rid;
    }
    const id = D && UNIT_ART[enemy ? 'enemy' : 'player'][typeId];
    if (!id || !D.units[id]) return null;
    // нет листов этой ступени — лучшая из готовых ниже (t3 → t2 → первое снаряжение)
    for (let k = enemy ? 0 : Math.min(tier, TIER.length - 1); k > 0; k--) {
      const t = id + TIER[k];
      if (D.units[t] && ok(image(D.units[t].src))) return t;
    }
    return id;
  }
  function hasUnit(typeId, enemy) {
    const id = artId(typeId, enemy);
    return !!id && ok(image(D.units[id].src));
  }

  // Поза и подвижка кадра по состоянию юнита (o — commonPose из game.js render()).
  function pickPose(o, a) {
    const r = { f: 'idle', dx: 0, dy: 0, sx: 1, sy: 1, alpha: 1, lying: 0 };
    const f = o.facing || 1;
    if (o.deathSec !== null && o.deathSec !== undefined) {
      const t = o.deathSec;
      const fall = Math.min(1, t / 0.32);
      if (t < 0.12) r.f = 'hit';
      else {
        r.f = a.f.defeated ? 'defeated' : 'down';
        r.lying = 1;
        const k = Math.min(1, (t - 0.12) / 0.16);
        r.dy = -(1 - k) * 10;               // рухнул: кадр «лежит» падает к земле
        r.sy = 1 - 0.1 * Math.sin(Math.PI * k); // и чуть сплющивается на касании
      }
      if (o.deathKind === 'fly') { r.dx = -f * 24 * rigEaseOut(fall); r.dy -= Math.sin(Math.PI * fall) * 14; }
      if (t > DEATH_HOLD) r.alpha = Math.max(0, 1 - (t - DEATH_HOLD) / DEATH_FADE);
      return r;
    }
    if (o.special && a.f[o.special]) { r.f = o.special; return r; }
    if (o.cheer) { r.dy = -Math.abs(Math.sin(o.time * 7)) * 7; return r; }
    const p = o.attackPhase;
    if (p !== null && p !== undefined) {
      // урон — в конце фазы (профиль 'unit'): замах растёт к удару, удар держится в начале следующей
      if (p < 0.22) { r.f = 'strike'; const k = 1 - p / 0.22; r.sx = 1 + 0.07 * k; r.sy = 1 - 0.05 * k; } else if (p >= 0.55) { r.f = 'windup'; const k = (p - 0.55) / 0.45; r.sy = 1 + 0.025 * k; r.sx = 1 - 0.02 * k; }
      if (r.f !== 'idle') return r;
    }
    if (o.hitFlash > 0.7) { r.f = 'hit'; r.dx = -f * 2 * o.hitFlash; return r; }
    if (o.moving) {
      // четыре кадра на полшага рига (иначе ≈2 кадра в секунду); покачивание сглаживает смену
      const ph = (o.walkPhase || 0) * 4 / Math.PI;
      r.f = WALK[Math.floor(ph) & 3];
      r.dy = -Math.abs(Math.sin(ph * Math.PI / 2)) * 1.2;
      return r;
    }
    r.sy = 1 + Math.sin(o.time * 2.3) * 0.014; // дыхание в покое
    return r;
  }

  // o: x, y (линия земли ряда), k (множитель роста), facing, enemy, elite, buffed, hitFlash, ... — commonPose.
  function drawUnit(ctx, typeId, o) {
    const a = D.units[artId(typeId, o.enemy, o.tier)];
    const im = image(a.src);
    const P = pickPose(o, a);
    const fr = a.f[P.f] || a.f.idle;
    const [fx, fy, fw, fh, ax] = fr;
    const k = PX * o.k;
    const dead = P.lying || (o.deathSec !== null && o.deathSec !== undefined);
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.globalAlpha *= P.alpha;
    // тень под ногами; у лежащего — длиннее
    const sw = (P.lying ? fw * 0.42 : a.h * 0.17) * k;
    ctx.fillStyle = ART.shadow;
    ctx.beginPath(); ctx.ellipse(P.dx, 0.5, sw, 3.4 * o.k, 0, 0, Math.PI * 2); ctx.fill();
    if (o.elite && o.enemy && !dead) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 28 * o.k);
      g.addColorStop(0, ART.enemy.eliteGlow); g.addColorStop(1, 'rgba(200,48,30,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(0, 0.5, 28 * o.k, 8 * o.k, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (o.buffed && !dead) {
      const pulse = 0.5 + 0.5 * Math.sin(o.time * 9);
      ctx.save();
      ctx.strokeStyle = ART.cryAura; ctx.lineWidth = 2.5 + pulse;
      ctx.globalAlpha *= 0.55 + pulse * 0.35;
      ctx.beginPath(); ctx.ellipse(0, 0.5, (20 + pulse * 3) * o.k, (6 + pulse) * o.k, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.translate(P.dx, P.dy);
    ctx.scale((o.facing || 1) * k * P.sx, k * P.sy);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    const dx = -ax, dy = -fh;
    if (o.elite && !dead) {
      // вожак: красный контур — силуэт, сдвинутый по кругу (≈1,6 ед. арены)
      const red = silhouette(a.src, ART.enemy.eliteOutline);
      if (red) {
        const e = 1.6 / k;
        for (let i = 0; i < 8; i++) {
          const ang = i * Math.PI / 4;
          ctx.drawImage(red, fx, fy, fw, fh, dx + Math.cos(ang) * e, dy + Math.sin(ang) * e, fw, fh);
        }
      }
    }
    ctx.drawImage(im, fx, fy, fw, fh, dx, dy, fw, fh);
    if (o.hitFlash > 0 && !dead) {
      const white = silhouette(a.src, '#ffffff');
      if (white) { ctx.globalAlpha *= Math.min(1, o.hitFlash) * 0.7; ctx.drawImage(white, fx, fy, fw, fh, dx, dy, fw, fh); }
    }
    ctx.restore();
  }

  // Предмет из атласа props: центр в (x, y), длина по большей стороне — size ед. арены.
  function prop(name) { return D && ok(image(D.props.src)) ? D.props.f[name] : null; }
  function drawProp(ctx, name, x, y, size, rot = 0, flip = 1) {
    const fr = prop(name);
    if (!fr) return false;
    const [fx, fy, fw, fh] = fr;
    const k = size / Math.max(fw, fh);
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip * k, k);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image(D.props.src), fx, fy, fw, fh, -fw / 2, -fh / 2, fw, fh);
    ctx.restore();
    return true;
  }

  // Фон региона по ширине кадра: верх дороги на картинке (bg.road) ложится чуть выше линии земли.
  function bg(id) { const b = D && D.bg[id]; return b && ok(image(b.src)) ? b : null; }
  // scroll — пройденный путь (ед. арены): на марше фон едет влево, за краем картинки — её зеркальная
  // копия, так стык незаметен.
  function drawBg(ctx, id, view, groundY, scroll = 0) {
    const b = bg(id);
    if (!b) return false;
    const road = groundY - 12;
    // обложкой: картинка закрывает весь кадр, верх дороги — на road
    const k = Math.max(view.w / b.w, (road - view.y0) / (b.road * b.h), (view.y0 + view.h - road) / ((1 - b.road) * b.h));
    const w = b.w * k, h = b.h * k, y = road - b.road * h;
    const im = image(b.src);
    ctx.save();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    const off = ((scroll % (2 * w)) + 2 * w) % (2 * w);
    const base = view.x0 + (view.w - w) / 2 - off;
    for (let n = Math.floor((view.x0 - base) / w); base + n * w < view.x0 + view.w; n++) {
      const x = base + n * w;
      if (n & 1) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); ctx.restore(); } else ctx.drawImage(im, x, y, w, h);
    }
    ctx.restore();
    return true;
  }

  // Повозка: кузов (целый / битый / обломки) + колёса отдельным рисунком (крутятся при ходе).
  function wagonSet(painted) { const s = D && (painted ? D.wagon_painted : D.wagon); return s && ok(image(s.src)) ? s : null; }
  function drawWagonBody(ctx, painted, state, x, y, len, flash = 0) {
    const s = wagonSet(painted);
    if (!s) return false;
    const fr = s.f[state] || s.f.whole;
    const [fx, fy, fw, fh] = fr;
    const ref = s.f.whole[2];
    const k = len / ref;
    ctx.save();
    ctx.translate(x, y); ctx.scale(k, k);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image(s.src), fx, fy, fw, fh, -fw / 2, -fh, fw, fh);
    if (flash > 0) {
      const white = silhouette(s.src, '#ffffff');
      if (white) { ctx.globalAlpha *= Math.min(1, flash) * 0.55; ctx.drawImage(white, fx, fy, fw, fh, -fw / 2, -fh, fw, fh); }
    }
    ctx.restore();
    return true;
  }
  // Флаг на древке: низ древка в (x, y), высота h; полотно колышется (wave −1…1) — сдвиг от древка.
  const POLE = { flag: 0.252, banner: 0.151 };
  function drawFlag(ctx, name, x, y, h, wave) {
    const fr = prop(name);
    if (!fr) return false;
    const [fx, fy, fw, fh] = fr;
    const k = h / fh, px = fw * (POLE[name] || 0);
    ctx.save();
    ctx.translate(x, y);
    ctx.transform(k * (1 - 0.04 * wave), 0, 0.05 * wave * k, k, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image(D.props.src), fx, fy, fw, fh, -px, -fh, fw, fh);
    ctx.restore();
    return true;
  }
  function drawWheel(ctx, x, y, r, angle) {
    const s = wagonSet(false);
    if (!s) return false;
    const [fx, fy, fw, fh] = s.f.wheel;
    const k = (r * 2) / Math.max(fw, fh);
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle); ctx.scale(k, k);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image(s.src), fx, fy, fw, fh, -fw / 2, -fh / 2, fw, fh);
    ctx.restore();
    return true;
  }

  // Значок класса (ряд найма, карты): кадр «покой», вписан в рамку maxW×maxH, ноги — на bottom.
  // Картинка ещё грузится — false и onReady перерисует.
  function drawIcon(ctx, typeId, enemy, cx, bottom, maxW, maxH, tier = 0, r = region) {
    const id = artId(typeId, enemy, tier, r);
    if (!id || !ok(image(D.units[id].src))) return false;
    const a = D.units[id];
    const [fx, fy, fw, fh, ax] = a.f.idle;
    const k = Math.min(maxW / fw, maxH / fh);
    ctx.save();
    ctx.translate(cx, bottom); ctx.scale((enemy ? -1 : 1) * k, k);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image(a.src), fx, fy, fw, fh, -fw / 2, -fh, fw, fh);
    ctx.restore();
    return true;
  }
  function onReady(typeId, enemy, cb, r = region) {
    const rid = enemy && REGION_ENEMY[r] && REGION_ENEMY[r][typeId];
    const id = rid && D && D.units[rid] ? rid : artId(typeId, enemy);
    if (id) image(D.units[id].src).addEventListener('load', cb, { once: true });
  }
  // Значок уровня: фон уровня обложкой в рамке w×h (кусок у дороги, где видна местность).
  function drawBgThumb(ctx, r, x, y, w, h) {
    const b = D && D.bg['bg_r' + r];
    const im = b && image(b.src);
    if (!b || !ok(im)) return false;
    const sh = b.h * 0.62, sw = Math.min(b.w, sh * w / h);
    const sy = Math.max(0, b.road * b.h - sh * 0.78);
    ctx.save();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(im, (b.w - sw) / 2, sy, sw, sh, x, y, w, h);
    ctx.restore();
    return true;
  }
  function onBg(r, cb) { const b = D && D.bg['bg_r' + r]; if (b) image(b.src).addEventListener('load', cb, { once: true }); }
  // Портрет из линейки снаряжения ('guard_t2'): ноги на bottom, вписан в maxW×maxH.
  function drawPortrait(ctx, name, cx, bottom, maxW, maxH) {
    const fr = D && D.portraits && D.portraits.f[name];
    const im = fr && image(D.portraits.src);
    if (!fr || !ok(im)) return false;
    const [fx, fy, fw, fh] = fr;
    const k = Math.min(maxW / fw, maxH / fh);
    ctx.save();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(im, fx, fy, fw, fh, cx - fw * k / 2, bottom - fh * k, fw * k, fh * k);
    ctx.restore();
    return true;
  }
  function onPortrait(cb) { if (D && D.portraits) image(D.portraits.src).addEventListener('load', cb, { once: true }); }

  if (typeof window !== 'undefined' && window.CONVOY_PROTOTYPE) load();
  return { load, setRegion, bgId, drawBgThumb, onBg, get region() { return region; }, hasUnit, drawUnit, drawProp, prop, drawBg, bg, wagonSet, drawWagonBody, drawWheel, drawFlag, drawIcon, onReady, drawPortrait, onPortrait, image, artId };
})();
