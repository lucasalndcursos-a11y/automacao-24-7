const { chromium } = require('playwright');

async function iniciar() {
  console.log("ROBO INICIADO - 24/7 - VERSAO DOCKER");
  
  while (true) {
    let browser = null;
    try {
      console.log("Abrindo navegador...");
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      console.log("Acessando site...");
      await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
      console.log("Site acessado! Titulo:", await page.title());
      await browser.close();
      console.log("OK - esperando 30s...");
      await new Promise(r => setTimeout(r, 30000));
    } catch (erro) {
      console.log("Erro:", erro.message, "- tentando em 30s");
      if (browser) try { await browser.close(); } catch {}
      await new Promise(r => setTimeout(r, 30000));
    }
  }
}
iniciar();
