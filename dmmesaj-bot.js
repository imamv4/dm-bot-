/**
 * Discord DM Bot
 * 
 * BOT TOKEN KURULUMU:
 * 1. Discord Developer Portal'a git: https://discord.com/developers/applications
 * 2. "New Application" oluştur ve bot adını yaz
 * 3. Sol menüden "Bot" seç ve "Add Bot" tıkla
 * 4. "TOKEN" bölümünde "Copy" tıklayarak token'ı kopyala
 * 5. Proje dosyasında .env dosyası oluştur
 * 6. BOT_TOKEN=<kopyalanan_token> şeklinde yapıştır
 * 7. .env dosyasını .gitignore'a ekle (güvenlik için)
 * 
 * Not: BOT_TOKEN değişkeni bu dosya tarafından process.env.BOT_TOKEN'den okunur
 */

const { Client, GatewayIntentBits, Partials, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();  // .env dosyasından ortam değişkenlerini yükle

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,     // privileged intent - enable in dev portal if server > ~1000 members
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent    // gerekli: mesaj içeriğini okumak için
  ],
  partials: [Partials.Channel], // DM kanallarına erişim için
});

const PREFIX = '.dmmesaj';

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return; // sadece sunucu içinde çalışsın
    if (!message.content.toLowerCase().startsWith(PREFIX)) return;

    // Yetki kontrolü (isteğe göre değiştir)
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('Bu komutu kullanmak için Yönetici yetkisine ihtiyacın var.');
    }

    const text = message.content.slice(PREFIX.length).trim();
    if (!text) return message.reply('Kullanım: .dmmesaj <göndereceğin mesaj>');

    const statusMsg = await message.reply('Başlatılıyor... Üyeler toplanıyor, lütfen bekleyin.');

    // Tüm üyeleri çek (özellikle büyük sunucularda intent açık olmalı)
    await message.guild.members.fetch();

    const members = message.guild.members.cache.filter(m => !m.user.bot);
    const total = members.size;
    if (total === 0) return statusMsg.edit('Gönderecek üye bulunamadı.');

    let sent = 0, failed = 0, dmClosed = 0, processed = 0;

    const arr = Array.from(members.values());
    const chunkSize = 5;              // eşzamanlı / batch büyüklüğü
    const delayBetweenChunks = 1500;  // ms, her chunk sonrası bekleme (rate-limit azaltma)

    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      await Promise.all(chunk.map(async member => {
        try {
          await member.send({ content: text });
          sent++;
        } catch (e) {
          // 50007 = Cannot send messages to this user (DM kapalı)
          if (e?.code === 50007) dmClosed++;
          else failed++;
        } finally {
          processed++;
        }
      }));

      // Durumu güncelle
      await statusMsg.edit(`Gönderiliyor... ${processed}/${total} tamamlandı.\nBaşarılı: ${sent}  Başarısız: ${failed}  DM kapalı: ${dmClosed}`);

      // Kısa bekleme ile rate limit riskini azalt
      await sleep(delayBetweenChunks);
    }

    // Son rapor
    await statusMsg.edit(
      `DM gönderimi tamamlandı.\nToplam: ${total}\nBaşarılı: ${sent}\nBaşarısız (hata): ${failed}\nDM kapalı: ${dmClosed}`
    );

  } catch (err) {
    console.error('Komut sırasında hata:', err);
    message.reply('Bir hata oluştu. Konsolu kontrol et.');
  }
});

client.login(process.env.BOT_TOKEN);
