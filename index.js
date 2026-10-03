const { chromium } = require('playwright');

async function run() {
  console.log('ROBO INICIADO - 24/7');

  while(true) {
    let browser;
    try {
      browser = await chromium.launch({ 
        headless: true, 
        args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] 
      });
      
      const page = await browser.newPage();
      
      console.log('Rodando...', new Date().toLocaleString('pt-BR'));
      
      // AQUI VOCÊ COLOCA SEU SITE
      await page.goto('https://example.com', { timeout: 60000 });
      
      console.log('Título do site:', await page.title());
      
      await browser.close();
      
      // espera 5 minutos e roda de novo
      await new Promise(r => setTimeout(r, 5 * 60 * 1000));

    } catch(e) {
      console.log('Erro:', e.message, ' - Tentando de novo em 30s');
      if(browser) await browser.close().catch(()=>{});
      await new Promise(r => setTimeout(r, 30000));
    }
  }
}

run();
