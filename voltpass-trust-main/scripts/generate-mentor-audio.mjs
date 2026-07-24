import { tutorial } from "./mentor-tutorial-script.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("tutorial-output", "mentor-audio");
await mkdir(outputDir, { recursive: true });

const manifest = tutorial.map((item, index) => ({
  index,
  caption: item.caption,
  narration: item.narration,
  wav: path.join(outputDir, `${String(index).padStart(2, "0")}.wav`),
}));

await writeFile(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
await writeFile(
  path.join(outputDir, "generate.ps1"),
  `
$ErrorActionPreference = "Stop"
$manifest = Get-Content -Raw "${path.join(outputDir, "manifest.json").replaceAll("\\", "\\\\")}" | ConvertFrom-Json
$voice = New-Object -ComObject SAPI.SpVoice
$voice.Rate = -1
$voice.Volume = 100
foreach ($item in $manifest) {
  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open($item.wav, 3)
  $voice.AudioOutputStream = $stream
  $voice.Speak($item.narration) | Out-Null
  $stream.Close()
}
`,
);

console.log(path.join(outputDir, "generate.ps1"));
