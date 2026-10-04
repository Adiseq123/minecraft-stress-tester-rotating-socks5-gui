const { app, BrowserWindow, ipcMain } = require('electron')
const mineflayer = require('mineflayer')
const { SocksClient } = require('socks')
const dns = require('dns')
const path = require('path')

let mainWindow
let activeBots = []
let isRunning = false
let stats = { active: 0, totalJoined: 0, errors: 0 }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 780,
    title: 'Minecraft Stress Tester GUI (Rotating SOCKS5 Proxy)',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function sendLog(msg, type = 'info') {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('log', {
      time: new Date().toLocaleTimeString(),
      msg,
      type
    })
  }
}

function updateStats() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('stats', stats)
  }
}

function getHumanDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomUsername(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function createBot(config, index) {
  if (!isRunning) return

  const username = generateRandomUsername(10)

  const botOptions = {
    host: config.serverHost,
    port: parseInt(config.serverPort),
    username: username,
    version: config.mcVersion || undefined,
    auth: 'offline',
    connect: (client) => {
      dns.resolveSrv(`_minecraft._tcp.${config.serverHost}`, (srvErr, addresses) => {
        const targetHost = (!srvErr && addresses && addresses.length > 0) ? addresses[0].name : config.serverHost
        const targetPort = (!srvErr && addresses && addresses.length > 0) ? addresses[0].port : parseInt(config.serverPort)

        const proxyConfig = {
          host: config.proxyHost,
          port: parseInt(config.proxyPort),
          type: 5
        }

        if (config.proxyUser && config.proxyPass) {
          proxyConfig.userId = config.proxyUser
          proxyConfig.password = config.proxyPass
        }

        SocksClient.createConnection({
          proxy: proxyConfig,
          command: 'connect',
          destination: {
            host: targetHost,
            port: targetPort
          },
          timeout: 20000
        }, (err, info) => {
          if (err) {
            sendLog(`[X] [${username}] Błąd rotacyjnego proxy: ${err.message}`, 'error')
            stats.errors++
            updateStats()
            client.emit('error', err)
            return
          }
          client.setSocket(info.socket)
          client.emit('connect')
        })
      })
    }
  }

  try {
    const bot = mineflayer.createBot(botOptions)
    activeBots.push(bot)

    const activeIntervals = []
    let hasAttemptedAuth = false

    function safeSetInterval(fn, ms) {
      const timer = setInterval(fn, ms)
      activeIntervals.push(timer)
      return timer
    }

    function cleanup() {
      activeIntervals.forEach(clearInterval)
      activeIntervals.length = 0
      const idx = activeBots.indexOf(bot)
      if (idx !== -1) activeBots.splice(idx, 1)
      if (stats.active > 0) stats.active--
      updateStats()
    }

    bot.on('message', (jsonMsg) => {
      const text = jsonMsg.toString().toLowerCase()

      if ((text.includes('/register') || text.includes('zarejestruj')) && !hasAttemptedAuth) {
        hasAttemptedAuth = true
        const delay = getHumanDelay(2000, 5000)
        sendLog(`[i] [${username}] Wykryto prosbe o rejestracje. Rejestrowanie za ${(delay / 1000).toFixed(1)}s...`, 'warn')
        setTimeout(() => {
          if (bot && bot.entity) {
            bot.chat(`/register ${config.botPassword} ${config.botPassword}`)
          }
        }, delay)
      } else if ((text.includes('/login') || text.includes('zaloguj')) && !hasAttemptedAuth) {
        hasAttemptedAuth = true
        const delay = getHumanDelay(2000, 5000)
        sendLog(`[i] [${username}] Wykryto prosbe o logowanie. Logowanie za ${(delay / 1000).toFixed(1)}s...`, 'warn')
        setTimeout(() => {
          if (bot && bot.entity) {
            bot.chat(`/login ${config.botPassword}`)
          }
        }, delay)
      }
    })

    bot.once('spawn', () => {
      stats.active++
      stats.totalJoined++
      updateStats()
      sendLog(`[+] [${username}] Zalogowano pomyslnie na serwer!`, 'success')

      setTimeout(() => {
        if (!hasAttemptedAuth) {
          hasAttemptedAuth = true
          bot.chat(`/register ${config.botPassword} ${config.botPassword}`)
        }
      }, getHumanDelay(3000, 6000))

      // Ruch i interakcje
      safeSetInterval(() => {
        if (!bot.entity) return
        const directions = ['forward', 'back', 'left', 'right']
        const randomDir = directions[Math.floor(Math.random() * directions.length)]

        bot.setControlState('sprint', Math.random() > 0.4)
        bot.setControlState('jump', Math.random() > 0.5)
        bot.setControlState(randomDir, true)

        setTimeout(() => {
          if (bot && bot.entity) bot.setControlState(randomDir, false)
        }, 500 + Math.random() * 1000)

        if (Math.random() > 0.3) bot.swingArm('mainhand')
      }, parseInt(config.actionInterval) || 3000)

      // Czat
      safeSetInterval(() => {
        if (!bot.entity) return
        const messages = ['Siema!', 'Co tam?', 'Fajny serwer', 'Siema wszystkim', 'Testowanie wydajnosci...']
        const msg = messages[Math.floor(Math.random() * messages.length)]
        bot.chat(`${msg} [${Math.floor(Math.random() * 8999 + 1000)}]`)
      }, parseInt(config.chatInterval) || 15000)
    })

    bot.on('error', (err) => {
      sendLog(`[X] [${username}] Bład: ${err.message}`, 'error')
    })

    bot.once('end', () => {
      cleanup()
      if (isRunning) {
        const reconnectDelay = parseInt(config.reconnectDelay) || 10000
        sendLog(`[-] [${username}] Rozłaczono. Ponowne łaczenie za ${Math.round(reconnectDelay / 1000)}s...`, 'warn')
        setTimeout(() => {
          if (isRunning) createBot(config, index)
        }, reconnectDelay)
      }
    })

  } catch (err) {
    sendLog(`[X] Bład przy tworzeniu bota: ${err.message}`, 'error')
  }
}

ipcMain.on('start-test', (event, config) => {
  if (isRunning) return
  isRunning = true
  stats = { active: 0, totalJoined: 0, errors: 0 }
  updateStats()

  sendLog(`=== START TESTU (${config.botCount} botów przez ${config.proxyHost}:${config.proxyPort}) ===`, 'success')

  const botCount = parseInt(config.botCount) || 5
  const spawnDelay = parseInt(config.spawnDelay) || 3000

  for (let i = 0; i < botCount; i++) {
    setTimeout(() => {
      if (isRunning) createBot(config, i)
    }, i * spawnDelay)
  }
})

ipcMain.on('stop-test', () => {
  isRunning = false
  sendLog('🛑 Zatrzymywanie testu i rozłączanie botów...', 'warn')

  activeBots.forEach(bot => {
    try { bot.quit() } catch (e) {}
  })

  activeBots = []
  stats.active = 0
  updateStats()
  sendLog('✔️ Wszystkie boty zostały rozłączone.', 'info')
})