/**
 * Every word on the site lives here. Sections read from this file and nothing
 * else, so the client edits one file.
 *
 * The two "not announced yet" facts are modelled as null, not as prose:
 *   site.date === null      -> the hero's Tarih label shows the month and
 *                              a "Gün yakında" badge
 *   speakers.length === 0   -> speaker cards render muted "yakında" frames
 * Filling either one in flips the UI to its confirmed state with no layout
 * change. That is the whole design system in two fields.
 */

/**
 * PLACEHOLDERS until the fair's own photographs arrive: replace the files or
 * the paths here and nothing else changes. `source` is the Unsplash image id
 * each file was downloaded from (https://images.unsplash.com/<id>).
 */
export const images = {
  hero: {
    src: "/photos/stock/fuar-alani.jpg",
    alt: "Stantların arasında dolaşan kalabalık bir fuar alanı",
    source: "unsplash photo-1560439514-4e9645039924",
  },
  about: {
    src: "/photos/stock/panel.jpg",
    alt: "Bir panelde söz alan katılımcı ve onu dinleyen grup",
    source: "unsplash photo-1515187029135-18ee286d815b",
  },
  audiences: {
    ogrenci: {
      src: "/photos/stock/ogrenciler.jpg",
      alt: "Dizüstü bilgisayarları başında sohbet eden üç genç",
      source: "unsplash photo-1522202176988-66273c2fd55f",
    },
    "yeni-mezun": {
      src: "/photos/stock/gorusme.jpg",
      alt: "Masa üzerinde bir belgeyi birlikte inceleyen iki kişi",
      source: "unsplash photo-1565688534245-05d6b5be184a",
    },
    isveren: {
      src: "/photos/stock/isveren.jpg",
      alt: "Ekibine panodaki notları anlatan bir yönetici",
      source: "unsplash photo-1552664730-d307ca884978",
    },
  },
  faq: {
    src: "/photos/stock/sohbet.jpg",
    alt: "Kütüphanede bilgisayar başında gülüşen öğrenciler",
    source: "unsplash photo-1523240795612-9a054b0db644",
  },
  cta: {
    src: "/photos/stock/salon.jpg",
    alt: "",
    source: "unsplash photo-1540575467063-178a50c2df87",
  },
} as const

export type Speaker = {
  name: string
  title: string
  org: string
  photo?: string
}

export type Stat = {
  value: number
  /** Rendered before the number, e.g. "%" for Turkish percentages. */
  prefix?: string
  suffix?: string
  label: string
}

export const site = {
  name: "Kariyer Expo",
  edition: "27",
  tagline: "İnsan Odaklı Gelecek",
  url: "https://kariyerexpo.com",
  email: "iletisim@kariyerexpo.com",
  description:
    "Kariyer Expo, öğrencileri, yeni mezunları ve Türkiye'nin önde gelen " +
    "işverenlerini üç gün boyunca aynı çatı altında buluşturan kariyer fuarı.",
  /** null while undecided. Set to an ISO date to replace the month label. */
  date: null as string | null,
  /** What is known while the day is not: the month. */
  month: "Aralık",
  dateFallback: "Gün yakında",
  venue: {
    /** null while undecided; the city is confirmed. */
    name: null as string | null,
    city: "Ankara",
    fallback: "Mekân yakında",
  },
  organizers: [
    "Genç İstihdam Derneği",
    "Üniversite Kariyer Merkezleri Birliği",
  ],
} as const

export const nav = [
  { href: "#fuar", label: "Fuar" },
  { href: "#kimler", label: "Kimler katılmalı" },
  { href: "#program", label: "Program" },
  { href: "#konusmacilar", label: "Konuşmacılar" },
  { href: "#sss", label: "SSS" },
] as const

/** Small, reusable UI chrome -- controls and labels no single section owns. */
export const ui = {
  skipToContent: "İçeriğe geç",
  menu: "Menü",
  close: "Kapat",
} as const

export const header = {
  cta: "Haberdar et",
  homeLabel: "Kariyer Expo 27, ana sayfa",
} as const

export const hero = {
  headline: "Geleceğini Keşfet,",
  /** The heading's second, muted tone. */
  headlineAccent: "Kariyerine Yön Ver.",
  lede:
    "Kariyer Expo, Aralık'ta Ankara'da üçüncü kez kapılarını açıyor. " +
    "Öğrenciler, yeni mezunlar ve Türkiye'nin önde gelen işverenleri " +
    "üç gün boyunca aynı çatı altında.",
  dateLabel: "Tarih",
  venueLabel: "Yer",
  formHelp:
    "Tarih ve program açıklandığında ilk sen öğren. " +
    "Ayda birden fazla e-posta göndermiyoruz.",
} as const

export const about = {
  headline: "Bir fuardan fazlası,",
  headlineAccent: "bir başlangıç noktası.",
  body: [
    "Kariyer Expo, Genç İstihdam Derneği ve Üniversite Kariyer Merkezleri " +
      "Birliği iş birliğiyle düzenleniyor. Amacımız basit: iş arayanla " +
      "işvereni aynı masaya oturtmak, aradaki mesafeyi bir CV'lik değil bir " +
      "sohbetlik yapmak.",
    "Stant sıralarında geçen bir gün değil; mülakat yapılan, geri bildirim " +
      "alınan, tanışılan bir hafta sonu tasarlıyoruz. Katılımcıların çoğu " +
      "fuardan bir görüşme randevusuyla ayrılıyor.",
  ],
  facts: [
    { term: "Üç gün", detail: "Cuma, cumartesi, pazar" },
    { term: "Ankara", detail: "Mekân yakında açıklanacak" },
    { term: "Ücretsiz katılım", detail: "Ziyaretçiler için" },
  ],
} as const

export const stats = {
  headline: "Geçen yıl",
  headlineAccent: "böyleydi.",
  items: [
    { value: 11400, prefix: "", label: "katılımcı" },
    { value: 168, prefix: "", label: "katılımcı firma" },
    { value: 42, prefix: "", label: "panel ve atölye" },
    {
      value: 89,
      prefix: "%",
      label: "“yeniden katılırım” diyen ziyaretçi",
    },
  ] satisfies Stat[],
} as const

export const audiences = {
  headline: "Üç farklı yol,",
  headlineAccent: "tek bir salon.",
  items: [
    {
      id: "ogrenci",
      title: "Öğrenciler",
      summary: "Staj, yaz programı ve kariyer keşfi",
      points: ["Staj görüşmeleri", "CV kliniği", "Sektör panelleri"],
      note: "Tarih açıklandığında ilk sen öğren.",
      cta: "Beni haberdar et",
    },
    {
      id: "yeni-mezun",
      title: "Yeni mezunlar",
      summary: "İlk iş ve yönetici adayı programları",
      points: [
        "Aynı gün mülakat",
        "Mülakat provası",
        "Portfolyo geri bildirimi",
      ],
      note: "Katılımcı firma listesi yayınlandığında haber verelim.",
      cta: "Beni haberdar et",
    },
    {
      id: "isveren",
      title: "İşverenler",
      summary: "Yetenek havuzunu tek günde tara",
      points: ["Stand alanları", "Panel konuşmacılığı", "Aday veri tabanı"],
      note: "Stand ve sponsorluk bilgilerini e-posta ile gönderelim.",
      cta: "Bilgi almak istiyorum",
    },
  ],
} as const

export const program = {
  headline: "Konuşacaklarımız",
  headlineAccent: "şimdiden belli.",
  /** The quiet variant of "yakında": plain muted text, no dashed pill. */
  note: "Saatler ve salonlar program takvimiyle birlikte açıklanacak.",
  /** The Paneller / Atölyeler toggle's group name. */
  carouselLabel: "Oturumlar",
  /** The session list's own region name (distinct from the toggle's). */
  listLabel: "Oturum listesi",
  groups: [
    {
      title: "Paneller",
      items: [
        "Yapay zekâ çağında ilk işini bulmak",
        "Mühendislikten ürün yönetimine geçiş",
        "Uzaktan ve hibrit çalışmada kariyer kurmak",
        "Yeşil dönüşüm ve yeni meslekler",
        "CV'den mülakata: işe alım ekipleri neye bakıyor",
        "Yurt dışında çalışmak: vize, dil ve gerçekler",
      ],
    },
    {
      title: "Atölyeler",
      items: [
        "Mülakat provası",
        "LinkedIn profili kliniği",
        "Portfolyo geri bildirimi",
      ],
    },
  ],
} as const

export const speakersSection = {
  headline: "Konuşmacılar",
  /** Also the label inside each pending speaker frame. */
  headlineAccent: "yakında",
  note:
    "Sekiz konuşmacının ilk dördünü önümüzdeki aylarda duyuracağız. " +
    "Listeyi ilk görenlerden olmak için e-posta bırakabilirsin.",
  /** Placeholder cards rendered while the list is short. */
  slots: 4,
  srAnnouncement: "Konuşmacı listesi henüz açıklanmadı.",
} as const

/** Empty until people are booked. Adding entries flips cards to solid. */
export const speakers: Speaker[] = []

export const partners = {
  headline: "Bu yıl bizimle olanlar.",
  note: "Katılımcı firma ve sponsor listesi güncellenmeye devam ediyor.",
  pause: "Kayan isimleri durdur",
  /** PLACEHOLDERS until the real 2027 exhibitor and sponsor list arrives.
      Name-only slots; real logos replace them without changing the layout. */
  names: [
    "Anadolu Yazılım",
    "Boğaziçi Enerji",
    "Cumhuriyet Sigorta",
    "Deniz Lojistik",
    "Ege Kimya",
    "Fırat Telekom",
    "Gediz Perakende",
    "Haliç Bank",
    "Işık Otomotiv",
    "Kartal Savunma",
    "Levent Danışmanlık",
    "Marmara Gıda",
    "Nilüfer Tekstil",
    "Orhan Makine",
    "Pamukkale Turizm",
    "Rumeli İnşaat",
    "Sakarya Metal",
    "Toros Tarım",
  ],
} as const

export const faq = {
  headline: "Sık sorulanlar.",
  items: [
    {
      q: "Fuar ne zaman yapılacak?",
      a:
        "Aralık ayında, üç gün sürecek. Gün henüz kesinleşmedi; " +
        "kesinleştiği anda e-posta listemizdekilere ilk biz haber vereceğiz.",
    },
    {
      q: "Katılım ücretli mi?",
      a:
        "Ziyaretçiler için tamamen ücretsiz. Kayıt açıldığında bu sayfadan " +
        "duyuracağız.",
    },
    {
      q: "Önceden kayıt olmam gerekiyor mu?",
      a:
        "Şu an için hayır, kayıt henüz açılmadı. Şimdilik tek yapman " +
        "gereken e-posta adresini bırakmak.",
    },
    {
      q: "Firma olarak nasıl yer alabilirim?",
      a:
        "Aşağıdaki formu doldur, “İşveren” seçeneğini işaretle; " +
        "stand ve sponsorluk dosyasını sana gönderelim.",
    },
    {
      q: "Fuar nerede yapılacak?",
      a:
        "Ankara'da. Mekânı ulaşım bilgileriyle birlikte yakında " +
        "duyuracağız.",
    },
    {
      q: "CV'mi yanımda getirmeli miyim?",
      a:
        "Getir. Basılı 10-15 kopya işini görür; alanda CV kliniğimiz de " +
        "olacak.",
    },
  ],
} as const

export const cta = {
  headline: "Tarihi",
  /** The heading's second, lighter tone. */
  headlineAccent: "ilk öğrenenlerden ol.",
  lede:
    "Tek yapman gereken bir e-posta adresi bırakmak. " +
    "Spam yok, ayda birden fazla e-posta yok.",
} as const

/** The segment control on the form. A field, never a second funnel. */
export const roles = [
  {
    id: "ogrenci",
    label: "Öğrenci",
    help: "Staj ve kariyer fırsatlarını sana ilk biz iletelim.",
  },
  {
    id: "yeni-mezun",
    label: "Yeni mezun",
    help: "Yeni mezun programları açıldığında haber verelim.",
  },
  {
    id: "isveren",
    label: "İşveren",
    help: "Stand, sponsorluk ve panel iş birliği için size dönüş yapacağız.",
  },
] as const

export type RoleId = (typeof roles)[number]["id"]

export const footer = {
  blurb:
    "Öğrencileri, yeni mezunları ve işverenleri buluşturan bağımsız bir " +
    "kariyer fuarı.",
  linksTitle: "Sayfalar",
  followTitle: "Bizi takip et",
  /** The two accounts on the posters: the event's, then the partner's. */
  instagram: [
    {
      handle: "@kariyerexpo_27",
      href: "https://www.instagram.com/kariyerexpo_27/",
    },
    {
      handle: "@physiocoreedanismanlik",
      href: "https://www.instagram.com/physiocoreedanismanlik/",
    },
  ],
  contactTitle: "İletişim",
  legal: [
    { href: "#", label: "Gizlilik" },
    { href: "#", label: "KVKK Aydınlatma Metni" },
  ],
  social: [
    { href: "#", label: "LinkedIn", icon: "linkedin" },
    {
      href: "https://www.instagram.com/kariyerexpo_27/",
      label: "Instagram",
      icon: "instagram",
    },
    { href: "#", label: "X", icon: "x" },
  ],
  /** Built from site fields so the org names never drift from the header. */
  copyright: `© 2027 ${site.name}. ${site.organizers.join(" & ")} iş birliğiyle.`,
} as const

export const form = {
  label: "E-posta adresin",
  placeholder: "ornek@eposta.com",
  roleLegend: "Ben bir",
  roleSelectPlaceholder: "Seçiniz",
  submit: "Haberdar et",
  submitting: "Gönderiliyor…",
  success: "Listeye eklendin. Tarih kesinleştiğinde ilk sen öğreneceksin.",
  invalid: "Geçerli bir e-posta adresi gir.",
  failed: "Şu an gönderemedik. Birazdan tekrar dener misin?",
} as const
