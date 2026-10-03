const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'whatsapp-session.json');

// Número que vai receber a notificação - TROCA AQUI
const MEU_NUMERO = '55DDDNUMERO'; // ex: 5551999999999 sem + e sem espaço

async function notificarWhatsApp(page, mensagem) {
  try {
    console.log(`[WHATSAPP] Enviando: ${mensagem}`);
    // Abre conversa direta via link api
    await page.goto(`https://web.whatsapp.com/send?phone=${MEU_NUMERO}&text=${encodeURIComponent(mensagem)}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    // Espera botão enviar aparecer e clica
    const btnEnviar = page.locator('button[aria-label="Enviar"]');
    await btnEnviar.waitFor({ timeout: 15000 });
    await btnEnviar.click();
    console.log("[WHATSAPP] Mensagem enviada!");
    await page.waitForTimeout(2000);
    return true;
  } catch (e) {
    console.log("[WHATSAPP] Erro ao enviar:", e.message);
    return false;
  }
}

async function iniciar() {
  console.log("ROBO WHATSAPP INICIADO - 24/7 - VERSAO DOCKER");
  
  const storageExists = fs.existsSync(SESSION_FILE);
  console.log(storageExists ? "Sessão encontrada, usando login salvo" : "Sem sessão, vai pedir QR Code");

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    storageState: storageExists ? SESSION_FILE : undefined
  });
  
  const page = await context.newPage();

  // LOGIN NO WHATSAPP
  console.log("Acessando WhatsApp Web...");
  await page.goto('https://web.whatsapp.com', { waitUntil: 'domcontentloaded', timeout: 90000 });
  
  // Se não estiver logado, espera você escanear o QR Code
  // NO RAILWAY VOCÊ PRECISA VER O PRINT DO NAVEGADOR - vou te mostrar como
  try {
    console.log("Aguardando login... Escaneie o QR Code se aparecer");
    await page.waitForSelector('div[title="Caixa de texto de pesquisa"]', { timeout: 120000 });
    console.log("Login no WhatsApp OK!");
    
    // Salva a sessão
    await context.storageState({ path: SESSION_FILE });
    console.log("Sessão salva!");

    await notificarWhatsApp(page, `🤖 Robô WhatsApp conectado
