const html = await fetch("https://voltpass-trust-main.vercel.app/").then((response) =>
  response.text(),
);

const sources = [...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map((match) => match[1]);
console.log(sources.join("\n"));
