const bundle = await fetch("https://voltpass-trust-main.vercel.app/assets/index-BOE8EXSR.js").then(
  (response) => response.text(),
);

const urls = [...bundle.matchAll(/https:\/\/[a-z0-9.-]+supabase\.co/g)].map((match) => match[0]);
const keys = [...bundle.matchAll(/sb_publishable_[A-Za-z0-9_-]+/g)].map((match) => match[0]);
const sampleCodes = [...bundle.matchAll(/VP-[A-Z0-9-]+/g)].map((match) => match[0]);

console.log(JSON.stringify({ urls: [...new Set(urls)], keys: [...new Set(keys)], sampleCodes }, null, 2));
