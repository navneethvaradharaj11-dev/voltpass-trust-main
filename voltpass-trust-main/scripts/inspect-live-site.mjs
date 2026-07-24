import { chromium } from "playwright";

const baseUrl = "https://voltpass-trust-main.vercel.app";
const paths = ["/", "/scan", "/auth/login", "/auth/register"];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const path of paths) {
  const url = `${baseUrl}${path}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  const title = await page.title();
  const heading = await page.locator("h1").first().textContent().catch(() => "");
  const buttons = await page.locator("button, a").evaluateAll((elements) =>
    elements
      .map((element) => element.textContent?.trim())
      .filter(Boolean)
      .slice(0, 12),
  );
  console.log(JSON.stringify({ url, title, heading, buttons }, null, 2));
}

await browser.close();
