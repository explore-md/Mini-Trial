const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

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

            stream.on('progress', (chunkLength, downloaded, total) => {
                const percent = (downloaded / total) * 100;
                console.log(`Download progress: ${percent.toFixed(2)}%`);
            });

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

module.exports = MusicPlayer;
