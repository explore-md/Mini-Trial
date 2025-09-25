require('./config');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys");
const express = require('express');
const path = require('path');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk');
const readline = require("readline");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Render-specific: Serve static files correctly
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Root route - serve your mini bot
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Health check endpoint (important for Render)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'Explore MD V4',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Your existing bot code...
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const usePairingCode = true;
const manualPassword = 'EXPLOREV4';

let exploreBot = null;

// ✅ API endpoint for pairing (with Render considerations)
app.post('/api/pairing', async (req, res) => {
    try {
        // Render-specific: Handle cold starts
        if (!exploreBot) {
            return res.status(503).json({
                success: false,
                error: 'Bot initializing, please try again in 10 seconds'
            });
        }

        const { phoneNumber, password } = req.body;
        
        if (password !== manualPassword) {
            return res.json({ success: false, error: 'Invalid password' });
        }

        // Check if already registered
        if (exploreBot.authState?.creds?.registered) {
            return res.json({
                success: false,
                error: 'Bot already authenticated',
                status: 'connected'
            });
        }

        const code = await exploreBot.requestPairingCode(phoneNumber.replace(/\D/g, ''));
        
        res.json({
            success: true,
            code: code,
            message: 'Pairing code generated',
            expiresIn: '5 minutes'
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

async function StartZenn() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    exploreBot = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ["Explore MD V4", "Chrome", "4.0.0"],
        // ✅ Render: Better WebSocket settings
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000
    });

    exploreBot.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(chalk.yellow(`Connection closed: ${reason}`));
            
            // ✅ Render: Auto-reconnect with delay
            setTimeout(() => {
                console.log(chalk.blue('🔄 Attempting reconnect...'));
                StartZenn().catch(console.error);
            }, 5000);
        }
        
        if (connection === "open") {
            console.log(chalk.green('✅ Explore MD V4 is now online on Render!'));
        }
    });

    exploreBot.ev.on('creds.update', saveCreds);
}

// ✅ Render: Handle process termination gracefully
process.on('SIGTERM', () => {
    console.log(chalk.yellow('🛑 SIGTERM received, shutting down gracefully'));
    if (exploreBot) {
        exploreBot.ws.close();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log(chalk.yellow('🛑 SIGINT received, shutting down'));
    if (exploreBot) {
        exploreBot.ws.close();
    }
    process.exit(0);
});

// Start server
app.listen(PORT, async () => {
    console.log(chalk.cyan(`🚀 Explore MD V4 starting on Render...`));
    console.log(chalk.cyan(`🌐 Port: ${PORT}`));
    console.log(chalk.cyan(`📱 Mini Bot: https://your-app.onrender.com`));
    
    await StartZenn();
});