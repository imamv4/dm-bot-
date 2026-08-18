# dm-bot-

Discord sunucusu üyelerine toplu DM (Doğrudan Mesaj) gönderen bot.

## Kurulum

### 1. Discord Bot Token Alma

Bot'un çalışması için Discord'da bir bot uygulaması ve token oluşturmanız gerekir.

**Adımlar:**
1. [Discord Developer Portal](https://discord.com/developers/applications)'a git
2. **New Application** butonuna tıkla ve bot adını yaz
3. Sol menüden **Bot** seçeneğini tıkla
4. **Add Bot** butonuna tıkla
5. **TOKEN** bölümünde **Copy** butonuna tıkla (token'ı kopyala)
6. Bot'a gerekli izinleri ver:
   - **Intents** sekmesinde şunları aktifleştir:
     - Server Members Intent
     - Message Content Intent
   - **OAuth2 > URL Generator**'da şu izinleri seç:
     - `bot`
     - `send_messages`
     - `read_messages/view_channels`

### 2. Proje Ayarları

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyası oluştur (veya .env.example'dan kopyala)
cp .env.example .env

# 3. .env dosyasını düzenle ve token'ı yapıştır
# BOT_TOKEN=<discord_developer_portal'dan_kopyalanan_token>
```

### 3. Bot'u Çalıştır

```bash
node dmmesaj-bot.js
```

## Kullanım

Sunucuda bot yöneticisiyken şu komutu kullan:

```
.dmmesaj <göndereceğin mesaj>
```

**Örnek:**
```
.dmmesaj Merhaba! Bu toplu bir mesajdır.
```

Bot tüm sunucu üyelerine DM gönderecek ve sonuç raporunu verecektir.

## Önemli Notlar

- Bot'un sizin ve hedef sunucuda **yönetici** yetkisine ihtiyacı vardır
- `.gitignore` dosyasında `.env` zaten ayarlanmıştır (token'ınız herkese açık olmayacak)
- Büyük sunucularda (1000+ üye) işlem biraz zaman alabilir
- Bazı kullanıcılar DM'lerini açmadıysanız sistem bunu raporlayacaktır