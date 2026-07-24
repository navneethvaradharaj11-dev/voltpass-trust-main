import { chromium } from "playwright";
import { readFile, mkdir, cp } from "node:fs/promises";
import path from "node:path";

const baseUrl = "https://voltpass-trust-main.vercel.app";
const outputDir = path.resolve("tutorial-output");
const videoDir = path.join(outputDir, "mentor-raw");
const rawWebm = path.join(outputDir, "voltpass-mentor-tutorial-raw.webm");
const timed = JSON.parse(
  await readFile(path.join(outputDir, "mentor-audio", "timed-segments.json"), "utf8"),
);

await mkdir(videoDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();

async function installOverlay() {
  await page.addStyleTag({
    content: `
      #mentor-caption {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        z-index: 2147483647;
        width: min(980px, calc(100vw - 48px));
        padding: 15px 20px;
        border-radius: 16px;
        background: rgba(4, 12, 20, 0.92);
        border: 1px solid rgba(71, 225, 255, 0.5);
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
        color: white;
        font-family: Inter, Arial, sans-serif;
        font-size: 23px;
        line-height: 1.35;
        text-align: center;
        backdrop-filter: blur(14px);
      }
      #mentor-cursor {
        position: fixed;
        z-index: 2147483646;
        width: 32px;
        height: 32px;
        border-radius: 999px;
        border: 3px solid rgba(71, 225, 255, 0.95);
        box-shadow: 0 0 28px rgba(71, 225, 255, 0.75);
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: left 800ms ease, top 800ms ease;
      }
    `,
  });
  await page.evaluate(() => {
    document.querySelector("#mentor-caption")?.remove();
    document.querySelector("#mentor-cursor")?.remove();
    const caption = document.createElement("div");
    caption.id = "mentor-caption";
    document.body.append(caption);
    const cursor = document.createElement("div");
    cursor.id = "mentor-cursor";
    cursor.style.left = "50%";
    cursor.style.top = "50%";
    document.body.append(cursor);
  });
}

async function goto(pathname) {
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle", timeout: 60000 });
  await installOverlay();
}

async function setOverlay(segment) {
  await page.evaluate(
    ({ caption, cursor }) => {
      const captionElement = document.querySelector("#mentor-caption");
      const cursorElement = document.querySelector("#mentor-cursor");
      if (captionElement) captionElement.textContent = caption;
      if (cursorElement) {
        cursorElement.style.left = `${cursor.x}px`;
        cursorElement.style.top = `${cursor.y}px`;
      }
    },
    segment,
  );
}

let currentPath = "";
for (const segment of timed.segments) {
  if (segment.path !== "current" && segment.path !== currentPath) {
    currentPath = segment.path;
    await goto(currentPath);
  }

  if (segment.action === "top") {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  } else if (segment.action.startsWith("scroll:")) {
    const y = Number(segment.action.split(":")[1]);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "smooth" }), y);
    await page.waitForTimeout(1000);
  } else if (segment.action === "type-code") {
    await page.locator("input").fill("");
    await page.locator("input").type("VP-TES-001", { delay: 80 });
  } else if (segment.action === "lookup") {
    await page.getByRole("button", { name: "Look up" }).click();
    await page.waitForLoadState("networkidle");
    await installOverlay();
  } else if (segment.action === "register-fields") {
    await page.locator("input").nth(0).fill("Demo User").catch(() => {});
    await page.locator("input").nth(1).fill("demo@example.com").catch(() => {});
    await page.locator("input").nth(3).fill("VoltPass Demo").catch(() => {});
  }

  await setOverlay(segment);
  await page.waitForTimeout(segment.duration * 1000);
}

const video = page.video();
await context.close();
await browser.close();

await cp(await video.path(), rawWebm);
console.log(rawWebm);
