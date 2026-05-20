# Birsenay Kantar - Kişisel Portföy

Bu proje, Bilgisayar Programcılığı öğrencisi Birsenay Kantar için hazırlanmış modern, minimal ve tamamen Türkçe bir kişisel portföy sitesidir.

## İçerik

- Tam ekran kahraman (Hero) alanı
- Hakkımda, Yetenekler, Projeler, Eğitim & Deneyim, İletişim bölümleri
- Proje filtreleme (Tümü / Web / Otomasyon / Veri)
- WhatsApp sabit iletişim butonu
- Mobil uyumlu (responsive) tasarım
- Yumuşak animasyonlar ve akıcı kaydırma
- SEO ve sosyal medya meta etiketleri

## Dosya Yapısı

- `index.html` -> Sayfanın ana yapısı
- `styles.css` -> Tüm stil ve responsive kurallar
- `script.js` -> Etkileşimler (menü, filtreleme, form, animasyonlar)
- `favicon.svg` -> Tarayıcı sekmesi simgesi
- `cv-birsenay-kantar.pdf` -> (Opsiyonel) CV indirme dosyası

## Yerelde Calistirma

Basit bir statik sunucu ile calistirabilirsin:

```bash
python -m http.server 5500
```

Ardindan tarayicida:

- [http://localhost:5500](http://localhost:5500)

## Kisisellestirme

`index.html` dosyasinda asagidaki alanlari guncelle:

- E-posta: `mailto:...`
- LinkedIn, GitHub, Instagram linkleri
- WhatsApp: `https://wa.me/...`
- Proje kartlarindaki `Canli Demo` ve `GitHub` baglantilari

## Yayinlama (Netlify / Vercel)

1. Proje dosyalarini bir Git deposuna yukle.
2. Netlify veya Vercel'e baglan.
3. Build komutu gerekmez (statik site).
4. Publish dizini: proje koku (`/`).

## Not

`CV Indir` butonunun aktif calismasi icin proje kokune `cv-birsenay-kantar.pdf` dosyasini eklemen yeterlidir.
