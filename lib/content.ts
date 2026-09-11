/**
 * Every word on the site lives here. Sections read from this file and nothing
 * else, so the client edits one file.
 *
 * The two "not announced yet" facts are modelled as null, not as prose:
 *   site.date === null      -> the hero pill renders the pending dots ("yakında")
 *   speakers.length === 0   -> speaker cards render pending-dot placeholders
 * Filling either one in flips the UI to its confirmed state with no layout
 * change. That is the whole design system in two fields.
 */

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
  /* Authored uppercase on purpose. Turkish casing is locale
     dependent, so nothing is transformed at render time. */
  taglineCaps: "İNSAN ODAKLI GELECEK",
  url: "https://kariyerexpo.com",
  email: "iletisim@kariyerexpo.com",
  description:
    "Kariyer Expo, öğrencileri, yeni mezunları ve Türkiye'nin önde gelen " +
    "işverenlerini üç gün boyunca aynı çatı altında buluşturan kariyer fuarı.",
  /** null while undecided. Set to an ISO date to make the hero pill solid. */
  date: null as string | null,
  dateFallback: "Tarih yakında açıklanacak",
  venue: {
    name: "İstanbul Kongre Merkezi",
    district: "Harbiye",
    city: "İstanbul",
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
  prev: "Önceki",
  next: "Sonraki",
  menu: "Menü",
  close: "Kapat",
} as const

export const header = {
  cta: "Haberdar ol",
  menuOpen: "Menüyü aç",
} as const

export const hero = {
  headline: "Yeteneğin ve fırsatın",
  /** The arc sits under this phrase. Never under a single word. */
  headlineAccent: "buluştuğu yer.",
  lede:
    "İstanbul'un en büyük kariyer fuarı, 2027'de üçüncü kez kapılarını " +
    "açıyor. Öğrenciler, yeni mezunlar ve Türkiye'nin önde gelen işverenleri " +
    "üç gün boyunca aynı çatı altında.",
  formHelp:
    "Tarih ve program açıklandığında ilk sen öğren. " +
    "Ayda birden fazla e-posta göndermiyoruz.",
} as const

export const about = {
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "FUAR",
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
    { term: "İstanbul Kongre Merkezi", detail: "Harbiye, İstanbul" },
    { term: "Ücretsiz katılım", detail: "Ziyaretçiler için" },
  ],
} as const

export const stats = {
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "RAKAMLAR",
  headline: "2026'da böyleydi.",
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
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "KİMLER KATILMALI",
  headline: "Üç farklı yol,",
  headlineAccent: "tek bir salon.",
  detailsOpen: "Ayrıntıları göster",
  detailsClose: "Ayrıntıları gizle",
  items: [
    {
      id: "ogrenci",
      title: "Öğrenciler",
      summary: "Staj, yaz programı ve kariyer keşfi",
      points: ["Staj görüşmeleri", "CV kliniği", "Sektör panelleri"],
      note: "Tarih açıklandığında ilk sen öğren.",
      cta: "Beni haberdar et",
      highlighted: false,
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
      highlighted: false,
    },
    {
      id: "isveren",
      title: "İşverenler",
      summary: "Yetenek havuzunu tek günde tara",
      points: ["Stand alanları", "Panel konuşmacılığı", "Aday veri tabanı"],
      note: "Stand ve sponsorluk bilgilerini e-posta ile gönderelim.",
      cta: "Bilgi almak istiyorum",
      /** The only orange glyph in the section, so employers are not an aside. */
      highlighted: true,
    },
  ],
} as const

export const program = {
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "PROGRAM",
  headline: "Konuşacaklarımız",
  headlineAccent: "şimdiden belli.",
  /** The quiet variant of "yakında": plain muted text, no dashed pill. */
  note: "Saatler ve salonlar program takvimiyle birlikte açıklanacak.",
  /** The carousel's accessible region name (WAI-ARIA scrollable-region). */
  carouselLabel: "Oturumlar",
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
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "KONUŞMACILAR",
  headline: "Konuşmacılar",
  /** The pending dots render after this -- the pending state, said in form.
      No period: the three dots (navy, orange, silver) replace it. */
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
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "FİRMALAR",
  headline: "Geçen yıl bizimleydiler.",
  note: "2027 katılımcı firma listesi yakında yayımlanacak.",
  /** Name-only slots; real logos replace them without changing the layout. */
  names: [
    "Anadolu Yazılım",
    "Boğaziçi Enerji",
    "Cumhuriyet Sigorta",
    "Deniz Lojistik",
    "Ege Kimya",
    "Fırat Telekom",
    "Gediz Perakende",
    "Halic Bank",
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
  /* Authored uppercase on purpose. Turkish casing is locale dependent
     (i -> İ), so nothing is transformed at render time -- note the
     dotted İ below is U+0130, not an ASCII I. */
  eyebrow: "SSS",
  headline: "Sık sorulanlar.",
  items: [
    {
      q: "Fuar ne zaman yapılacak?",
      a:
        "Tarih henüz kesinleşmedi. 2027'nin ilk yarısında, üç gün sürecek. " +
        "Kesinleştiği anda e-posta listemizdekilere ilk biz haber vereceğiz.",
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
        "Şu an için hayır — kayıt henüz açılmadı. Şimdilik tek yapman " +
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
        "İstanbul Kongre Merkezi, Harbiye. Metro ve metrobüs bağlantıları " +
        "yürüme mesafesinde.",
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
  /** The swoosh sits under this phrase. Never under a single word. */
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
  contactTitle: "İletişim",
  legal: [
    { href: "#", label: "Gizlilik" },
    { href: "#", label: "KVKK Aydınlatma Metni" },
  ],
  social: [
    { href: "#", label: "LinkedIn", icon: "linkedin" },
    { href: "#", label: "Instagram", icon: "instagram" },
    { href: "#", label: "X", icon: "x" },
  ],
  /** Built from site fields so the org names never drift from the header. */
  copyright: `© 2027 ${site.name}. ${site.organizers.join(" & ")} iş birliğiyle.`,
} as const

export const form = {
  label: "E-posta adresin",
  placeholder: "e-posta adresin",
  roleLegend: "Ben bir",
  roleSelectPlaceholder: "Seçiniz",
  submit: "Haberdar et",
  submitting: "Gönderiliyor…",
  success: "Listeye eklendin. Tarih kesinleştiğinde ilk sen öğreneceksin.",
  invalid: "Geçerli bir e-posta adresi gir.",
  failed: "Şu an gönderemedik. Birazdan tekrar dener misin?",
} as const
