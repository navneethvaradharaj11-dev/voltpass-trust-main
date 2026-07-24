const url = "https://kapduhtjnllsiucooewr.supabase.co/rest/v1/batteries?select=id,battery_code,manufacturer,model,trust_score&limit=5";
const key = "sb_publishable_b8Jz5oIk844IGFV_GoiSSg_t4ZGDzd8";

const response = await fetch(url, {
  headers: {
    apikey: key,
  },
});

console.log(response.status, response.statusText);
console.log(await response.text());
