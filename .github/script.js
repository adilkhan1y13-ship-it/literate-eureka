const $ = (id) => document.getElementById(id);

const symbolSets = {
  mixed: [
    (n) => `꧁༺${n}༻꧂`, (n) => `亗〆${n}〆亗`,
    (n) => `乂『${n}』乂`, (n) => `么★${n}★么`,
    (n) => `ツ${n}メ`, (n) => `彡${n}彡`,
    (n) => `◥${n}◤`, (n) => `×͜× ${n}`,
    (n) => `♛ ${n} ♛`, (n) => `『么』${n}『么』`,
    (n) => `乂 ${n} 亗`, (n) => `★彡${n}彡★`
  ],
  brackets: [
    (n) => `『${n}』`, (n) => `【${n}】`, (n) => `〖${n}〗`,
    (n) => `꧁${n}꧂`, (n) => `༺${n}༻`, (n) => `〈${n}〉`,
    (n) => `《${n}》`, (n) => `〘${n}〙`
  ],
  stars: [
    (n) => `★${n}★`, (n) => `☆彡${n}彡☆`, (n) => `✦${n}✦`,
    (n) => `✧${n}✧`, (n) => `✯${n}✯`, (n) => `✰${n}✰`,
    (n) => `★彡${n}彡★`, (n) => `✪${n}✪`
  ],
  royal: [
    (n) => `♛${n}♛`, (n) => `♕『${n}』♕`, (n) => `꧁༒${n}༒꧂`,
    (n) => `👑${n}👑`, (n) => `♚ ${n} ♚`, (n) => `亗♛${n}♛亗`
  ],
  arrows: [
    (n) => `➳${n}➳`, (n) => `➤${n}➤`, (n) => `乂${n}乂`,
    (n) => `➶${n}➴`, (n) => `➺${n}➺`, (n) => `↯${n}↯`
  ],
  minimal: [
    (n) => `〆${n}`, (n) => `${n}々`, (n) => `${n}メ`,
    (n) => `${n}ツ`, (n) => `亗${n}`, (n) => `${n}〆`
  ],
  unicode: [
    (n) => toUnicodeStyle(n, 'bold'), (n) => toUnicodeStyle(n, 'double'),
    (n) => toUnicodeStyle(n, 'sans'), (n) => toUnicodeStyle(n, 'mono'),
    (n) => toUnicodeStyle(n, 'italic')
  ],
  plain: [(n) => n]
};

const moodPrefixes = {
  all: ['', '亗', '〆', '么', '乂', 'ツ', '彡'],
  pro: ['亗', '么', '乂', 'ツ', '〆'],
  attitude: ['乂', '〆', '么', '☠', '⚡'],
  royal: ['♛', '♚', '👑', '亗', '꧁'],
  killer: ['☠', '乂', 'メ', '〆', '⚔'],
  cute: ['♡', 'ღ', '✿', 'ツ', '★'],
  desi: ['亗', '〆', '么', 'ツ', '彡'],
  minimal: ['', '〆', '々', 'メ']
};
const moodSuffixes = {
  all: ['', '亗', '〆', '么', '乂', 'ツ', 'YT', 'OP'],
  pro: ['亗', 'OP', 'YT', '么', '〆'],
  attitude: ['乂', '〆', '么', 'BOSS', 'OP'],
  royal: ['♛', '♚', '亗', 'KING', '〆'],
  killer: ['☠', '乂', '〆', 'OP', 'メ'],
  cute: ['♡', 'ღ', '✿', 'ツ', '♡'],
  desi: ['BHAI', 'OP', '亗', '〆', '么'],
  minimal: ['', '〆', '々', 'メ']
};

function toUnicodeStyle(value, style) {
  const maps = {
    bold: [0x1D400, 0x1D41A],
    double: [0x1D538, 0x1D552],
    sans: [0x1D5A0, 0x1D5BA],
    mono: [0x1D670, 0x1D68A],
    italic: [0x1D434, 0x1D44E]
  };
  const map = maps[style];
  return Array.from(value).map(ch => {
    const code = ch.codePointAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(map[0] + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(map[1] + code - 97);
    return ch;
  }).join('');
}

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

function makeNames() {
  const raw = $('baseName').value.trim();
  if (!raw) {
    $('status').textContent = 'Pehle apna naam ya word likho, phir Generate dabao.';
    $('baseName').focus();
    return;
  }
  const category = $('category').value;
  const style = $('style').value;
  const count = Number($('amount').value);
  const formatters = symbolSets[style] || symbolSets.mixed;
  const output = [];
  const seen = new Set();
  let attempts = 0;
  while (output.length < count && attempts < count * 30) {
    attempts++;
    const formatter = pick(formatters);
    const prefix = pick(moodPrefixes[category] || moodPrefixes.all);
    const suffix = pick(moodSuffixes[category] || moodSuffixes.all);
    let candidate;
    if (style === 'plain') {
      candidate = raw;
    } else {
      const core = category === 'minimal' ? raw : raw;
      candidate = formatter(core);
      // Prefix and suffix variations are applied in addition to the selected visual style.
      if (Math.random() > 0.48 && prefix) candidate = prefix + candidate;
      if (Math.random() > 0.48 && suffix) candidate = candidate + suffix;
    }
    if (!seen.has(candidate)) {
      seen.add(candidate);
      output.push(candidate);
    }
  }
  if (!output.length) {
    $('status').textContent = 'Is style mein unique names nahi ban sake. Dusra style chuno.';
    return;
  }
  renderResults(output);
  $('copyAllBtn').disabled = false;
  $('status').textContent = `${output.length} stylish nicknames ban gaye! Jo pasand aaye, Copy dabao.`;
}

function renderResults(items) {
  const results = $('results');
  results.className = 'results';
  results.replaceChildren();
  items.forEach(name => {
    const card = document.createElement('article');
    card.className = 'name-card';
    const title = document.createElement('div');
    title.className = 'nickname';
    title.textContent = name;
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const copy = document.createElement('button');
    copy.className = 'primary';
    copy.textContent = '📋 Copy Karo';
    copy.addEventListener('click', () => copyText(name));
    const use = document.createElement('button');
    use.className = 'secondary';
    use.textContent = 'Use Karo';
    use.addEventListener('click', () => {
      $('baseName').value = name;
      $('status').textContent = 'Naam input mein aa gaya. Is par aur styles generate kar sakte ho.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    actions.append(copy, use);
    card.append(title, actions);
    results.append(card);
  });
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    $('status').textContent = 'Copy ho gaya! Ab game mein paste karke check karo.';
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    document.body.append(field);
    field.select();
    const success = document.execCommand('copy');
    field.remove();
    $('status').textContent = success ? 'Copy ho gaya! Ab game mein paste karo.' : 'Copy nahi hua. Nickname ko select karke manually copy karo.';
  }
}

$('generateBtn').addEventListener('click', makeNames);
$('baseName').addEventListener('keydown', event => {
  if (event.key === 'Enter') makeNames();
});
$('clearBtn').addEventListener('click', () => {
  $('baseName').value = '';
  $('status').textContent = 'Clear ho gaya. Ab apna naam likho.';
  $('results').className = 'results empty';
  $('results').innerHTML = '<div class="empty-icon">✧</div><p>Abhi koi nickname nahi bana.</p><p>Apna naam likhkar Generate dabao!</p>';
  $('copyAllBtn').disabled = true;
  $('baseName').focus();
});
$('copyAllBtn').addEventListener('click', () => {
  const values = Array.from(document.querySelectorAll('.nickname')).map(el => el.textContent);
  if (values.length) copyText(values.join('\n'));
});
