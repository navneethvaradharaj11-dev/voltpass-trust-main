import { tutorial } from "./mentor-tutorial-script.mjs";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";

const outputDir = path.resolve("tutorial-output", "mentor-audio");

function durationFor(file) {
  const output = execFileSync(ffmpegStatic, ["-i", file], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return output;
}

function parseDuration(text) {
  const match = text.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!match) return 0;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

const segments = [];
for (let index = 0; index < tutorial.length; index += 1) {
  const file = path.join(outputDir, `${String(index).padStart(2, "0")}.wav`);
  let text = "";
  try {
    durationFor(file);
  } catch (error) {
    text = `${error.stdout ?? ""}\n${error.stderr ?? ""}`;
  }
  segments.push({
    ...tutorial[index],
    audio: file,
    duration: Math.max(3, parseDuration(text) + 0.12),
  });
}

const totalDuration = segments.reduce((total, segment) => total + segment.duration, 0);
await writeFile(
  path.join(outputDir, "timed-segments.json"),
  JSON.stringify({ totalDuration, segments }, null, 2),
);

await writeFile(
  path.join(outputDir, "concat.txt"),
  segments.map((segment) => `file '${segment.audio.replaceAll("\\", "/")}'`).join("\n"),
);

console.log(JSON.stringify({ totalDuration, minutes: totalDuration / 60 }, null, 2));
