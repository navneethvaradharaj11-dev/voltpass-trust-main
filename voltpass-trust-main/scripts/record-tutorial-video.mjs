import { chromium } from "playwright";
import { mkdir, cp } from "node:fs/promises";
import path from "node:path";

const baseUrl = "https://voltpass-trust-main.vercel.app";
const outputDir = path.resolve("tutorial-output");
const videoDir = path.join(outputDir, "raw");
const finalWebm = path.join(outputDir, "voltpass-5min-tutorial.webm");

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
      #tutorial-caption {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        z-index: 2147483647;
        width: min(920px, calc(100vw - 48px));
        padding: 16px 20px;
        border-radius: 18px;
        background: rgba(7, 18, 27, 0.9);
        border: 1px solid rgba(71, 225, 255, 0.45);
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.42);
        color: white;
        font-family: Inter, Arial, sans-serif;
        font-size: 25px;
        line-height: 1.35;
        text-align: center;
        backdrop-filter: blur(14px);
      }
      #tutorial-cursor {
        position: fixed;
        z-index: 2147483646;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        border: 3px solid rgba(71, 225, 255, 0.95);
        box-shadow: 0 0 28px rgba(71, 225, 255, 0.7);
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: left 700ms ease, top 700ms ease;
      }
    `,
  });
  await page.evaluate(() => {
    const caption = document.createElement("div");
    caption.id = "tutorial-caption";
    document.body.append(caption);
    const cursor = document.createElement("div");
    cursor.id = "tutorial-cursor";
    cursor.style.left = "50%";
    cursor.style.top = "50%";
    document.body.append(cursor);
  });
}

async function caption(text, seconds, cursor = { x: 640, y: 360 }) {
  await page.evaluate(
    ({ text, cursor }) => {
      const captionElement = document.querySelector("#tutorial-caption");
      const cursorElement = document.querySelector("#tutorial-cursor");
      if (captionElement) captionElement.textContent = text;
      if (cursorElement) {
        cursorElement.style.left = `${cursor.x}px`;
        cursorElement.style.top = `${cursor.y}px`;
      }
    },
    { text, cursor },
  );
  await page.waitForTimeout(seconds * 1000);
}

async function goto(pathname) {
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle", timeout: 60000 });
  await installOverlay();
}

await goto("/");
await caption("Welcome to VoltPass, a digital trust platform for second-life EV batteries.", 15);
await caption("The homepage explains the core promise: a battery passport plus a transparent Trust Score.", 18, { x: 650, y: 200 });
await page.mouse.wheel(0, 520);
await caption("Here are the three big ideas: identity, health scoring, and quick QR verification.", 18, { x: 350, y: 470 });
await page.mouse.wheel(0, 620);
await caption("The feature section shows what teams can evaluate: SOH, cycles, temperature exposure, and fault history.", 21, { x: 730, y: 330 });
await page.mouse.wheel(0, 720);
await caption("VoltPass turns lifecycle data into a clear recommendation: reuse, repurpose, or recycle.", 19, { x: 620, y: 355 });

await goto("/scan");
await caption("Now let’s verify a battery from the public scan page.", 14, { x: 640, y: 235 });
await page.locator("input").fill("VP-TES-001");
await caption("Enter a battery code. In this demo, we’ll use VP-TES-001.", 18, { x: 610, y: 350 });
await page.getByRole("button", { name: "Look up" }).click();
await page.waitForLoadState("networkidle");
await installOverlay();
await caption("A successful lookup opens the public Battery Passport.", 16, { x: 600, y: 115 });
await caption("This verified passport shows manufacturer, model, chemistry, capacity, lifecycle status, and Trust Score.", 24, { x: 740, y: 365 });
await caption("The Trust Score summarizes health and safety signals into a simple 0 to 100 rating.", 22, { x: 980, y: 310 });
await caption("The recommendation panel explains what this battery is best suited for next.", 20, { x: 585, y: 535 });
await caption("Users can also download a PDF report for offline review or sharing.", 17, { x: 630, y: 630 });

await goto("/auth/register");
await caption("For owners, inspectors, buyers, or admins, the next step is creating an account.", 18, { x: 670, y: 125 });
await page.locator('input[name="email"], input[type="email"]').first().fill("demo@example.com").catch(() => {});
await caption("The register page collects the account basics and role so access can match each user’s job.", 22, { x: 610, y: 345 });
await caption("Once signed in, teams can add batteries, manage records, and build a reusable audit trail.", 21, { x: 630, y: 430 });

await goto("/auth/login");
await caption("Returning users start from the sign-in screen.", 14, { x: 650, y: 125 });
await caption("VoltPass supports email login and Google sign-in, depending on the account setup.", 18, { x: 620, y: 450 });

await goto("/");
await page.mouse.wheel(0, 1800);
await caption("To recap: visitors can scan a code, review a verified passport, and export a report.", 24, { x: 650, y: 360 });
await caption("Registered teams can go further by maintaining battery data and monitoring second-life readiness.", 24, { x: 650, y: 360 });
await caption("That’s the VoltPass workflow: verify the battery, understand the score, and choose the right next life.", 19, { x: 650, y: 360 });
await caption("End of tutorial.", 2);

const video = page.video();
await context.close();
await browser.close();

const rawPath = await video.path();
await cp(rawPath, finalWebm);
console.log(finalWebm);
