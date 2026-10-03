const { chromium } = require('playwright');
const { execSync } = require('child_process');

async function iniciar() {
  console.log("ROBO INICIADO - 24/7");
  try {
    console.log("Verificando navegador...");
    execSync("npx playwright install --with-deps chromium chromium-headless-shell", { stdio: "inherit" });
    console.log("Navegador instalado com sucesso!");
  } catch (e) {
    console.log("Aviso na instalacao:", e.message);
  }

  while (true) {
    let browser = null;
    try {
      console.log("Abrindo navegador...");
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
      });
      const page = await browser.newPage();
      console.log("Acessando site...");
      await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
      console.log("Site acessado! Título:", await page.title());
      await new Promise(r => setTimeout(r, 10000));
      await browser.close();
      console.log("Rodada ok, esperando 30s...");
      await new Promise(r => setTimeout(r, 30000));
    } catch (erro) {
      console.log("Erro:", erro.message, "- Tentando de novo em 30s");
      if (browser) try { await browser.close(); } catch {}
      await new Promise(r => setTimeout(r, 30000));
    }
  }
}
iniciar();
