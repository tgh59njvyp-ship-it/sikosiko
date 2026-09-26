// Clean SVG-rendered Pokémon card mockups for instant testing without camera
export interface SampleCard {
  id: string;
  name: string;
  cardNumber: string;
  rarity: string;
  expansionSet: string;
  basePrice: number;
  previewUrl: string;
  dataUrl: string;
}

// Generate high quality SVG data URLs that look like authentic Pokémon cards
function createCardSvgDataUrl(title: string, subtitle: string, hp: string, typeColor: string, typeName: string, artHue: number, numberStr: string, rarityStr: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 630" width="450" height="630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="artBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${artHue}, 75%, 45%)"/>
        <stop offset="50%" stop-color="hsl(${artHue + 40}, 85%, 55%)"/>
        <stop offset="100%" stop-color="hsl(${artHue - 30}, 80%, 25%)"/>
      </linearGradient>
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="50%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <radialGradient id="holo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
        <stop offset="50%" stop-color="rgba(255,255,255,0.1)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
      </radialGradient>
    </defs>
    <!-- Outer Card Border -->
    <rect x="0" y="0" width="450" height="630" rx="24" fill="#0f172a"/>
    <rect x="10" y="10" width="430" height="610" rx="18" fill="url(#borderGrad)"/>
    <rect x="18" y="18" width="414" height="594" rx="14" fill="#ffffff"/>

    <!-- Header -->
    <text x="36" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="24" fill="#0f172a">${title}</text>
    <text x="330" y="53" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#64748b">HP</text>
    <text x="355" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#ef4444">${hp}</text>
    <circle cx="400" cy="50" r="14" fill="${typeColor}"/>
    <text x="400" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">${typeName[0]}</text>

    <!-- Art Frame -->
    <rect x="32" y="74" width="386" height="260" rx="8" fill="url(#artBg)"/>
    <rect x="32" y="74" width="386" height="260" rx="8" fill="url(#holo)"/>
    
    <!-- Art Illustration Elements -->
    <circle cx="225" cy="204" r="75" fill="rgba(255,255,255,0.2)"/>
    <polygon points="225,120 280,240 170,240" fill="rgba(255,255,255,0.3)"/>
    <text x="225" y="215" font-family="'Noto Sans JP', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle" letter-spacing="2">${title}</text>
    <text x="225" y="245" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="14" fill="rgba(255,255,255,0.85)" text-anchor="middle">SPECIAL ART RARE</text>

    <!-- Subtitle / Meta Bar -->
    <rect x="32" y="342" width="386" height="24" rx="4" fill="#f1f5f9"/>
    <text x="225" y="358" font-family="'Noto Sans JP', sans-serif" font-size="11" fill="#475569" text-anchor="middle">${subtitle}</text>

    <!-- Attack 1 -->
    <circle cx="50" cy="405" r="11" fill="${typeColor}"/>
    <circle cx="75" cy="405" r="11" fill="${typeColor}"/>
    <text x="100" y="411" font-family="'Noto Sans JP', sans-serif" font-weight="700" font-size="18" fill="#1e293b">バーニングダーク</text>
    <text x="390" y="411" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="end">180+</text>
    <text x="50" y="438" font-family="'Noto Sans JP', sans-serif" font-size="12" fill="#64748b">相手がすでにとったサイドの枚数×30ダメージ追加。</text>

    <!-- Line divider -->
    <line x1="32" y1="465" x2="418" y2="465" stroke="#e2e8f0" stroke-width="1.5"/>

    <!-- Rule Box -->
    <rect x="32" y="480" width="386" height="70" rx="8" fill="#fef2f2" stroke="#fecaca" stroke-width="1.5"/>
    <text x="44" y="502" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="#b91c1c">ポケモンexルール</text>
    <text x="44" y="522" font-family="'Noto Sans JP', sans-serif" font-size="11" fill="#7f1d1d">ポケモンexがきぜつしたとき、相手はサイドを2枚とる。</text>

    <!-- Footer Meta -->
    <text x="36" y="590" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" fill="#64748b">${numberStr}</text>
    <rect x="110" y="578" width="46" height="16" rx="4" fill="#0f172a"/>
    <text x="133" y="590" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10" fill="#ffffff" text-anchor="middle">${rarityStr}</text>
    <text x="410" y="590" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">©2026 Pokémon/Nintendo/CR/GF</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_CARDS: SampleCard[] = [
  {
    id: 'sample_charizard_sar',
    name: 'リザードンex',
    cardNumber: '134/108',
    rarity: 'SAR',
    expansionSet: '黒炎の支配者',
    basePrice: 28500,
    previewUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=400&q=80',
    dataUrl: createCardSvgDataUrl('リザードンex', 'かえんポケモン / 高さ: 1.7m / 重さ: 90.5kg', '330', '#ef4444', '炎', 12, '134/108', 'SAR'),
  },
  {
    id: 'sample_pikachu_masterball',
    name: 'ピカチュウ (マスボミラー)',
    cardNumber: '025/165',
    rarity: 'C (マスターボールミラー)',
    expansionSet: 'ポケモンカード151',
    basePrice: 42000,
    previewUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    dataUrl: createCardSvgDataUrl('ピカチュウ', 'ねずみポケモン / マスターボールミラー仕様', '60', '#eab308', '雷', 45, '025/165', 'MASTER'),
  },
  {
    id: 'sample_nanjamo_sar',
    name: 'ナンジャモ',
    cardNumber: '096/071',
    rarity: 'SAR',
    expansionSet: 'クレイバースト',
    basePrice: 68000,
    previewUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    dataUrl: createCardSvgDataUrl('ナンジャモ', 'サポート / トレーナーズ', '―', '#ec4899', '超', 320, '096/071', 'SAR'),
  },
  {
    id: 'sample_mimosa_sar',
    name: 'ミモザ',
    cardNumber: '105/078',
    rarity: 'SAR',
    expansionSet: 'バイオレットex',
    basePrice: 34000,
    previewUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    dataUrl: createCardSvgDataUrl('ミモザ', 'サポート / 養護教諭', '―', '#8b5cf6', '超', 270, '105/078', 'SAR'),
  },
];
