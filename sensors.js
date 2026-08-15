// netlify/functions/sensors.js
//
// Server-side proxy for the PurpleAir API. The API key lives here, on the
// server, so it never reaches the browser — the page just calls
// /api/sensors and gets JSON back.

const FIELDS = [
  "sensor_index", "name", "latitude", "longitude", "last_seen",
  "pm2.5", "pm2.5_10minute", "humidity", "temperature",
];

const NEPAL_BBOX = { nwlng: 80.0, nwlat: 30.5, selng: 88.3, selat: 26.3 };

exports.handler = async function handler() {
  const apiKey = process.env.PURPLEAIR_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "PURPLEAIR_API_KEY is not set. Add it under Site settings → Environment variables in Netlify.",
      }),
    };
  }

  const params = new URLSearchParams({
    fields: FIELDS.join(","),
    nwlng: NEPAL_BBOX.nwlng,
    nwlat: NEPAL_BBOX.nwlat,
    selng: NEPAL_BBOX.selng,
    selat: NEPAL_BBOX.selat,
    location_type: 0,
  });

  try {
    const res = await fetch(`https://api.purpleair.com/v1/sensors?${params.toString()}`, {
      headers: { "X-API-Key": apiKey },
    });

    const text = await res.text();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: `PurpleAir API error ${res.status}`, detail: text.slice(0, 500) }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60", // small buffer against hammering the API
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to reach PurpleAir", detail: String(err) }),
    };
  }
};
