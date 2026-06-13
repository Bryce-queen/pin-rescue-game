const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');

function getWindowMetrics() {
  try {
    if (wx.getWindowInfo) return wx.getWindowInfo();
  } catch (error) {}
  try {
    return wx.getSystemInfoSync();
  } catch (error) {
    return { pixelRatio: 1, windowWidth: 375, windowHeight: 667 };
  }
}

const metrics = getWindowMetrics();
const DPR = metrics.pixelRatio || 1;
let stageWidth = metrics.windowWidth;
let stageHeight = metrics.windowHeight;
canvas.width = stageWidth * DPR;
canvas.height = stageHeight * DPR;
ctx.scale(DPR, DPR);

const TITLE = '拉针救援';
const SUBTITLE = '广告同款，真的能玩';
const COLS = 5;
const ROWS = 7;

const COLORS = {
  bgTop: '#eaf7ff',
  bgBottom: '#fff3df',
  wall: '#5b6f86',
  wallDark: '#33475c',
  pin: '#ffd35a',
  pinDark: '#c8891a',
  text: '#26384c',
  muted: '#6d7c8d',
  primary: '#ff8a3d',
  water: '#45b8ff',
  fire: '#ff5a38',
  hero: '#ffcf7a',
  monster: '#7b4dff',
  treasure: '#ffc93d',
  exit: '#62d28f'
};

const LEVELS = [
  { name: '第1关 救援开始', goal: 'rescue', hero: [2, 0], exit: [2, 6], pins: [{ id: 'a', cells: [[2, 3]] }] },
  { name: '第2关 先拿宝箱', goal: 'treasure', hero: [1, 0], treasure: [3, 0], exit: [2, 6], pins: [{ id: 'a', cells: [[1, 3], [2, 3], [3, 3]] }] },
  { name: '第3关 水灭火', goal: 'rescue', hero: [2, 0], water: [[1, 1]], fire: [[2, 4]], exit: [2, 6], pins: [{ id: 'a', cells: [[1, 2]] }, { id: 'b', cells: [[2, 3]] }] },
  { name: '第4关 别放怪物', goal: 'rescue', hero: [1, 0], monster: [[3, 0]], exit: [1, 6], pins: [{ id: 'a', cells: [[1, 3]] }, { id: 'b', cells: [[3, 3]] }] },
  { name: '第5关 火烧怪物', goal: 'killMonster', hero: [0, 0], monster: [[2, 4]], fire: [[2, 1]], exit: [0, 6], pins: [{ id: 'a', cells: [[2, 2]] }, { id: 'b', cells: [[0, 3]] }] },
  { name: '第6关 先灭火再救人', goal: 'rescue', hero: [2, 0], water: [[0, 0]], fire: [[2, 4]], exit: [2, 6], pins: [{ id: 'a', cells: [[0, 2]] }, { id: 'b', cells: [[2, 3]] }] },
  { name: '第7关 宝箱别烧了', goal: 'treasure', treasure: [2, 0], fire: [[4, 0]], water: [[0, 0]], exit: [2, 6], pins: [{ id: 'a', cells: [[0, 2]] }, { id: 'b', cells: [[2, 3]] }, { id: 'c', cells: [[4, 2]] }] },
  { name: '第8关 双针救援', goal: 'rescue', hero: [0, 0], exit: [4, 6], pins: [{ id: 'a', cells: [[0, 2], [1, 2]] }, { id: 'b', cells: [[3, 4], [4, 4]] }] },
  { name: '第9关 引水灭双火', goal: 'extinguish', water: [[2, 0]], fire: [[1, 4], [3, 4]], exit: [2, 6], pins: [{ id: 'a', cells: [[2, 2]] }, { id: 'b', cells: [[1, 3], [2, 3], [3, 3]] }] },
  { name: '第10关 怪物守门', goal: 'rescue', hero: [2, 0], monster: [[2, 4]], fire: [[4, 0]], exit: [2, 6], pins: [{ id: 'a', cells: [[4, 2]] }, { id: 'b', cells: [[2, 3]] }] },
  { name: '第11关 左右选择', goal: 'treasure', hero: [2, 0], treasure: [0, 0], monster: [[4, 0]], exit: [2, 6], pins: [{ id: 'a', cells: [[0, 3], [1, 3]] }, { id: 'b', cells: [[3, 3], [4, 3]] }, { id: 'c', cells: [[2, 4]] }] },
  { name: '第12关 先清怪', goal: 'killMonster', monster: [[1, 5], [3, 5]], fire: [[2, 0]], pins: [{ id: 'a', cells: [[2, 2]] }, { id: 'b', cells: [[1, 4], [2, 4], [3, 4]] }] },
  { name: '第13关 水火分离', goal: 'rescue', hero: [2, 0], water: [[0, 0]], fire: [[4, 0], [2, 4]], exit: [2, 6], pins: [{ id: 'a', cells: [[0, 2]] }, { id: 'b', cells: [[4, 2]] }, { id: 'c', cells: [[2, 3]] }] },
  { name: '第14关 宝箱通道', goal: 'treasure', treasure: [4, 0], monster: [[2, 3]], fire: [[0, 0]], exit: [4, 6], pins: [{ id: 'a', cells: [[0, 2]] }, { id: 'b', cells: [[2, 4]] }, { id: 'c', cells: [[4, 3]] }] },
  { name: '第15关 救人拿宝', goal: 'rescueTreasure', hero: [1, 0], treasure: [3, 0], exit: [2, 6], pins: [{ id: 'a', cells: [[1, 3]] }, { id: 'b', cells: [[3, 3]] }, { id: 'c', cells: [[2, 4]] }] },
  { name: '第16关 三重机关', goal: 'rescue', hero: [0, 0], water: [[2, 0]], fire: [[4, 2]], monster: [[2, 5]], exit: [0, 6], pins: [{ id: 'a', cells: [[2, 2]] }, { id: 'b', cells: [[4, 3]] }, { id: 'c', cells: [[0, 4]] }] },
  { name: '第17关 怪物陷阱', goal: 'killMonster', monster: [[0, 5], [4, 5]], fire: [[2, 0]], water: [[2, 2]], pins: [{ id: 'a', cells: [[2, 1]] }, { id: 'b', cells: [[2, 3]] }, { id: 'c', cells: [[0, 4], [4, 4]] }] },
  { name: '第18关 极限救援', goal: 'rescue', hero: [2, 0], monster: [[1, 4], [3, 4]], fire: [[0, 0]], water: [[4, 0]], exit: [2, 6], pins: [{ id: 'a', cells: [[4, 2]] }, { id: 'b', cells: [[0, 2]] }, { id: 'c', cells: [[2, 3]] }] },
  { name: '第19关 宝箱别掉错', goal: 'treasure', treasure: [2, 0], water: [[0, 0]], fire: [[4, 0]], monster: [[2, 5]], exit: [2, 6], pins: [{ id: 'a', cells: [[0, 2]] }, { id: 'b', cells: [[4, 2]] }, { id: 'c', cells: [[2, 3]] }] },
  { name: '第20关 真拉针大师', goal: 'rescueTreasure', hero: [1, 0], treasure: [3, 0], water: [[0, 0]], fire: [[4, 0]], monster: [[2, 5]], exit: [2, 6], pins: [{ id: 'a', cells: [[0, 2]] }, { id: 'b', cells: [[4, 2]] }, { id: 'c', cells: [[1, 3]] }, { id: 'd', cells: [[3, 3]] }] }
];

const state = {
  screen: 'start',
  levelIndex: 0,
  level: null,
  entities: [],
  pins: [],
  status: 'ready',
  message: '拔出正确的针，完成救援',
  steps: 0,
  bestLevel: 0,
  shareImageUrl: ''
};

const layout = {};

function cloneLevel(level) {
  return JSON.parse(JSON.stringify(level));
}

function loadProgress() {
  try {
    state.bestLevel = wx.getStorageSync('pin_rescue_best_level') || 0;
  } catch (error) {
    state.bestLevel = 0;
  }
}

function saveProgress() {
  if (state.levelIndex > state.bestLevel) {
    state.bestLevel = state.levelIndex;
    try {
      wx.setStorageSync('pin_rescue_best_level', state.bestLevel);
    } catch (error) {}
  }
}

function updateLayout() {
  const info = getWindowMetrics();
  stageWidth = info.windowWidth;
  stageHeight = info.windowHeight;
  layout.padding = 22;
  layout.boardWidth = stageWidth - layout.padding * 2;
  layout.cell = Math.min(layout.boardWidth / COLS, (stageHeight - 230) / ROWS);
  layout.boardLeft = (stageWidth - layout.cell * COLS) / 2;
  layout.boardTop = 138;
  layout.button = { x: layout.padding, y: stageHeight - 76, w: stageWidth - layout.padding * 2, h: 50 };
}

function startLevel(index) {
  state.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, index));
  state.level = cloneLevel(LEVELS[state.levelIndex]);
  state.entities = [];
  state.pins = state.level.pins.map((pin) => ({ ...pin, removed: false }));
  addEntity('hero', state.level.hero);
  addEntity('treasure', state.level.treasure);
  addEntityList('water', state.level.water);
  addEntityList('fire', state.level.fire);
  addEntityList('monster', state.level.monster);
  if (state.level.exit) state.entities.push({ type: 'exit', col: state.level.exit[0], row: state.level.exit[1], static: true });
  state.status = 'playing';
  state.screen = 'playing';
  state.steps = 0;
  state.message = goalText();
}

function addEntity(type, pos) {
  if (!pos) return;
  state.entities.push({ type, col: pos[0], row: pos[1], alive: true, reached: false });
}

function addEntityList(type, list = []) {
  list.forEach((pos) => addEntity(type, pos));
}

function goalText() {
  const map = {
    rescue: '目标：救出人质',
    treasure: '目标：拿到宝箱',
    extinguish: '目标：扑灭所有火焰',
    killMonster: '目标：消灭所有怪物',
    rescueTreasure: '目标：救人并拿宝箱'
  };
  return map[state.level.goal] || '目标：完成机关';
}

function drawRoundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawText(text, x, y, size, color = COLORS.text, align = 'left', weight = 'normal') {
  ctx.font = `${weight} ${size}px sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, stageHeight);
  gradient.addColorStop(0, COLORS.bgTop);
  gradient.addColorStop(1, COLORS.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, stageWidth, stageHeight);
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  ctx.beginPath();
  ctx.arc(stageWidth - 40, 80, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(42, 180, 64, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  drawBackground();
  if (state.screen === 'start') drawStart();
  if (state.screen === 'playing' || state.screen === 'result') drawGame();
  requestAnimationFrame(render);
}

function drawStart() {
  drawText(TITLE, stageWidth / 2, 100, 38, COLORS.text, 'center', 'bold');
  drawText(SUBTITLE, stageWidth / 2, 142, 17, COLORS.primary, 'center', 'bold');
  drawRoundRect(layout.padding, 198, stageWidth - layout.padding * 2, 236, 28, 'rgba(255,255,255,.86)', '#d6e8ff');
  drawText('真实拉针解谜', stageWidth / 2, 238, 24, COLORS.text, 'center', 'bold');
  drawText('水灭火，火烧怪，救人拿宝箱', stageWidth / 2, 280, 16, COLORS.muted, 'center');
  drawMiniScene(stageWidth / 2, 356);
  drawRoundRect(layout.button.x, layout.button.y, layout.button.w, layout.button.h, 25, COLORS.primary, null);
  drawText('开始第 1 关', stageWidth / 2, layout.button.y + 25, 18, '#fff', 'center', 'bold');
}

function drawMiniScene(cx, cy) {
  drawEntityIcon('hero', cx - 78, cy, 30);
  drawEntityIcon('pin', cx - 25, cy, 30);
  drawEntityIcon('water', cx + 28, cy, 30);
  drawEntityIcon('fire', cx + 78, cy, 30);
}

function drawGame() {
  drawText(TITLE, layout.padding, 46, 28, COLORS.text, 'left', 'bold');
  drawText(`${state.levelIndex + 1}/${LEVELS.length}`, stageWidth - layout.padding, 46, 18, COLORS.primary, 'right', 'bold');
  drawText(state.level.name, layout.padding, 82, 18, COLORS.text, 'left', 'bold');
  drawText(state.message, layout.padding, 110, 14, state.status === 'failed' ? COLORS.fire : COLORS.muted, 'left');
  drawBoard();
  if (state.screen === 'result') drawResult();
  drawRoundRect(layout.button.x, layout.button.y, layout.button.w, layout.button.h, 25, state.screen === 'result' ? COLORS.primary : '#ffffff', state.screen === 'result' ? null : '#b8d5ef');
  drawText(state.screen === 'result' ? resultButtonText() : '重新开始', stageWidth / 2, layout.button.y + 25, 17, state.screen === 'result' ? '#fff' : COLORS.primary, 'center', 'bold');
}

function drawBoard() {
  drawRoundRect(layout.boardLeft - 8, layout.boardTop - 8, layout.cell * COLS + 16, layout.cell * ROWS + 16, 22, 'rgba(255,255,255,.88)', '#c7def2');
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const pos = cellToPoint(col, row);
      drawRoundRect(pos.x, pos.y, layout.cell - 4, layout.cell - 4, 10, '#f7fbff', '#d6e8ff');
    }
  }
  state.pins.filter((pin) => !pin.removed).forEach(drawPin);
  state.entities.filter((entity) => entity.alive !== false).forEach(drawEntity);
}

function drawPin(pin) {
  pin.cells.forEach(([col, row]) => {
    const pos = cellToPoint(col, row);
    drawRoundRect(pos.x + 5, pos.y + layout.cell / 2 - 5, layout.cell - 14, 10, 5, COLORS.pin, COLORS.pinDark);
    ctx.fillStyle = COLORS.pinDark;
    ctx.beginPath();
    ctx.arc(pos.x + 8, pos.y + layout.cell / 2, 8, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawEntity(entity) {
  const pos = cellToPoint(entity.col, entity.row);
  drawEntityIcon(entity.type, pos.x + layout.cell / 2, pos.y + layout.cell / 2, layout.cell * 0.36);
}

function drawEntityIcon(type, x, y, size) {
  ctx.save();
  if (type === 'hero') {
    ctx.fillStyle = COLORS.hero;
    ctx.beginPath();
    ctx.arc(x, y - size * 0.3, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
    drawRoundRect(x - size * 0.55, y, size * 1.1, size * 0.85, size * 0.28, '#ff9f68', null);
  } else if (type === 'treasure') {
    drawRoundRect(x - size * 0.65, y - size * 0.42, size * 1.3, size * 0.9, 8, COLORS.treasure, '#b77a00');
    drawText('★', x, y, size * 0.65, '#fff', 'center', 'bold');
  } else if (type === 'water') {
    ctx.fillStyle = COLORS.water;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.62, 0, Math.PI * 2);
    ctx.fill();
    drawText('水', x, y, size * 0.7, '#fff', 'center', 'bold');
  } else if (type === 'fire') {
    ctx.fillStyle = COLORS.fire;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.8);
    ctx.quadraticCurveTo(x + size * 0.75, y - size * 0.1, x, y + size * 0.72);
    ctx.quadraticCurveTo(x - size * 0.75, y - size * 0.1, x, y - size * 0.8);
    ctx.fill();
  } else if (type === 'monster') {
    ctx.fillStyle = COLORS.monster;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.68, 0, Math.PI * 2);
    ctx.fill();
    drawText('怪', x, y, size * 0.62, '#fff', 'center', 'bold');
  } else if (type === 'exit') {
    drawRoundRect(x - size * 0.75, y - size * 0.75, size * 1.5, size * 1.5, 10, COLORS.exit, '#2b9d5a');
    drawText('出', x, y, size * 0.68, '#fff', 'center', 'bold');
  } else if (type === 'pin') {
    drawRoundRect(x - size, y - 5, size * 2, 10, 5, COLORS.pin, COLORS.pinDark);
  }
  ctx.restore();
}

function drawResult() {
  ctx.save();
  ctx.fillStyle = 'rgba(38,56,76,.58)';
  ctx.fillRect(0, 0, stageWidth, stageHeight);
  drawRoundRect(layout.padding, stageHeight / 2 - 118, stageWidth - layout.padding * 2, 210, 26, '#fff', null);
  drawText(state.status === 'won' ? '救援成功！' : '救援失败', stageWidth / 2, stageHeight / 2 - 66, 30, state.status === 'won' ? COLORS.exit : COLORS.fire, 'center', 'bold');
  drawText(state.message, stageWidth / 2, stageHeight / 2 - 16, 16, COLORS.text, 'center');
  drawText(`拔针 ${state.steps} 次`, stageWidth / 2, stageHeight / 2 + 24, 18, COLORS.muted, 'center');
  ctx.restore();
}

function resultButtonText() {
  if (state.status === 'won') return state.levelIndex >= LEVELS.length - 1 ? '再玩一次' : '下一关';
  return '重试本关';
}

function cellToPoint(col, row) {
  return { x: layout.boardLeft + col * layout.cell, y: layout.boardTop + row * layout.cell };
}

function pointToCell(x, y) {
  const col = Math.floor((x - layout.boardLeft) / layout.cell);
  const row = Math.floor((y - layout.boardTop) / layout.cell);
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
  return [col, row];
}

function pinAt(x, y) {
  const cell = pointToCell(x, y);
  if (!cell) return null;
  const [col, row] = cell;
  return state.pins.find((pin) => !pin.removed && pin.cells.some(([pinCol, pinRow]) => pinCol === col && pinRow === row));
}

function removePin(pin) {
  if (state.status !== 'playing') return;
  pin.removed = true;
  state.steps += 1;
  state.message = '机关启动了！';
  simulateWorld();
  checkGoal();
}

function isBlocked(col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
  return state.pins.some((pin) => !pin.removed && pin.cells.some(([pinCol, pinRow]) => pinCol === col && pinRow === row));
}

function simulateWorld() {
  for (let tick = 0; tick < 8; tick += 1) {
    let moved = false;
    movableEntities().forEach((entity) => {
      if (entity.alive === false || entity.reached) return;
      if (!isBlocked(entity.col, entity.row + 1) && !entityAt(entity.col, entity.row + 1, entity.type)) {
        entity.row += 1;
        moved = true;
      } else {
        const direction = entity.col <= 2 ? 1 : -1;
        if (!isBlocked(entity.col + direction, entity.row) && !entityAt(entity.col + direction, entity.row, entity.type)) {
          entity.col += direction;
          moved = true;
        }
      }
    });
    resolveCollisions();
    if (!moved) break;
  }
}

function movableEntities() {
  const order = { water: 1, fire: 2, monster: 3, treasure: 4, hero: 5 };
  return state.entities
    .filter((entity) => !entity.static && entity.alive !== false)
    .sort((left, right) => (order[left.type] || 9) - (order[right.type] || 9));
}

function entityAt(col, row, sameType) {
  return state.entities.some((entity) => entity.alive !== false && entity.type === sameType && entity.col === col && entity.row === row);
}

function entitiesAt(col, row) {
  return state.entities.filter((entity) => entity.alive !== false && entity.col === col && entity.row === row);
}

function resolveCollisions() {
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const entities = entitiesAt(col, row);
      const hasWater = entities.some((entity) => entity.type === 'water');
      const hasFire = entities.some((entity) => entity.type === 'fire');
      const hasMonster = entities.some((entity) => entity.type === 'monster');
      const hasHero = entities.some((entity) => entity.type === 'hero');
      const hasTreasure = entities.some((entity) => entity.type === 'treasure');
      const hasExit = entities.some((entity) => entity.type === 'exit');

      if (hasWater && hasFire) killTypes(entities, ['water', 'fire']);
      if (hasFire && hasMonster) killTypes(entities, ['fire', 'monster']);
      if (hasFire && hasHero) fail('人质碰到火焰了');
      if (hasMonster && hasHero) fail('怪物抓住了人质');
      if (hasFire && hasTreasure) fail('宝箱被烧毁了');
      if (hasExit && hasHero) markReached(entities, 'hero');
      if (hasExit && hasTreasure) markReached(entities, 'treasure');
    }
  }
}

function killTypes(entities, types) {
  entities.forEach((entity) => {
    if (types.includes(entity.type)) entity.alive = false;
  });
}

function markReached(entities, type) {
  entities.forEach((entity) => {
    if (entity.type === type) entity.reached = true;
  });
}

function checkGoal() {
  if (state.status !== 'playing') return;
  const alive = (type) => state.entities.filter((entity) => entity.type === type && entity.alive !== false);
  const reached = (type) => alive(type).some((entity) => entity.reached);
  const noneAlive = (type) => alive(type).length === 0;
  const goal = state.level.goal;
  const success =
    (goal === 'rescue' && reached('hero')) ||
    (goal === 'treasure' && reached('treasure')) ||
    (goal === 'extinguish' && noneAlive('fire')) ||
    (goal === 'killMonster' && noneAlive('monster')) ||
    (goal === 'rescueTreasure' && reached('hero') && reached('treasure'));
  if (success) win();
}

function win() {
  state.status = 'won';
  state.screen = 'result';
  state.message = '这波拉针太丝滑了';
  saveProgress();
  updateShareImage();
}

function fail(message) {
  if (state.status !== 'playing') return;
  state.status = 'failed';
  state.screen = 'result';
  state.message = message;
}

function makeShareMessage() {
  return {
    title: state.status === 'won' ? `我通关了${state.level.name}，你会先拔哪根针？` : `${TITLE}，真的拉针解谜`,
    imageUrl: state.shareImageUrl || 'assets/share-card.png'
  };
}

function updateShareImage() {
  try {
    const shareCanvas = wx.createCanvas();
    shareCanvas.width = 500;
    shareCanvas.height = 400;
    const shareCtx = shareCanvas.getContext('2d');
    drawShareCard(shareCtx, 500, 400);
    if (shareCanvas.toTempFilePath) {
      shareCanvas.toTempFilePath({
        success: (result) => {
          state.shareImageUrl = result.tempFilePath;
        },
        fail: () => {
          state.shareImageUrl = 'assets/share-card.png';
        }
      });
    }
  } catch (error) {
    state.shareImageUrl = 'assets/share-card.png';
  }
}

function drawShareCard(shareCtx, width, height) {
  const oldCtx = ctx;
  const oldWidth = stageWidth;
  const oldHeight = stageHeight;
  ctx = shareCtx;
  stageWidth = width;
  stageHeight = height;
  drawBackground();
  drawRoundRect(38, 48, width - 76, height - 96, 28, '#fff', '#d6e8ff');
  drawText(TITLE, width / 2, 105, 36, COLORS.text, 'center', 'bold');
  drawText(state.level.name, width / 2, 155, 22, COLORS.primary, 'center', 'bold');
  drawText(state.status === 'won' ? '救援成功' : '你能救下来吗？', width / 2, 220, 34, state.status === 'won' ? COLORS.exit : COLORS.fire, 'center', 'bold');
  drawText(`拔针 ${state.steps} 次`, width / 2, 275, 22, COLORS.muted, 'center');
  drawText('广告同款，真的能玩', width / 2, 326, 20, COLORS.primary, 'center', 'bold');
  ctx = oldCtx;
  stageWidth = oldWidth;
  stageHeight = oldHeight;
}

function touchPoint(event) {
  const touch = event.changedTouches[0] || event.touches[0];
  if (!touch) return null;
  return { x: touch.clientX, y: touch.clientY };
}

function onTouchStart(event) {
  const point = touchPoint(event);
  if (!point) return;
  if (state.screen === 'start') {
    if (isRectHit(layout.button, point.x, point.y)) startLevel(0);
    return;
  }
  if (state.screen === 'result') {
    if (!isRectHit(layout.button, point.x, point.y)) return;
    if (state.status === 'won' && state.levelIndex < LEVELS.length - 1) startLevel(state.levelIndex + 1);
    else startLevel(state.levelIndex);
    return;
  }
  if (isRectHit(layout.button, point.x, point.y)) {
    startLevel(state.levelIndex);
    return;
  }
  const pin = pinAt(point.x, point.y);
  if (pin) removePin(pin);
}

function isRectHit(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

wx.onTouchStart(onTouchStart);
wx.onShow(() => updateLayout());
try {
  wx.showShareMenu({ withShareTicket: true });
  wx.onShareAppMessage(() => makeShareMessage());
} catch (error) {}

loadProgress();
updateLayout();
render();
