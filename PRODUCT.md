<!-- impeccable:product-schema 1 -->
# Kariyer Expo 27: product

## What it is
Kariyer Expo is a three-day career fair in Ankara in December (Friday to Sunday; the day and the venue are not announced yet), organised by Genç İstihdam Derneği and Üniversite Kariyer Merkezleri Birliği. This is the edition 27 landing site, in Turkish. Tagline: "İnsan Odaklı Gelecek". Free for visitors.

## Users
- Students
- New graduates
- Employers (Türkiye's leading companies, as participants)

## Job to be done
- Get notified when the date and programme are announced (email sign-up, no more than one email a month).
- Learn what the fair offers: who it is for, the programme (panels and workshops), speakers, past results, participating companies, answers to common questions.

## Facts the site must carry
- The month (Aralık) and the city (Ankara) are confirmed. The day and the venue are not; the site shows a pending state until they are set (`site.date`, `site.venue.name` in `lib/content.ts`).
- Speakers are not announced yet and will be added later. The speaker section is data driven and shows placeholders until then.
- Last year's numbers: 11.400 participants, 168 participating companies, 42 panels and workshops, 89% would attend again.
- Contact: iletisim@kariyerexpo.com.

## Partner
Physiocoree (physiocoreedanismanlik.com) appears only as its logo, beside the event logo as the smaller co-brand (the event logo leads), in the header and footer only, never in the hero. No text, caption or "x" between or under them.

## Scope
- Platform: web, responsive.
- One page. No sub-routes; navigation is anchors.
- All copy lives in `lib/content.ts`.
