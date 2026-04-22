import crypto from "crypto";

export default function handler(req, res) {
  try {
    const botToken = process.env.BOT_TOKEN;

    const authData = req.body;

    if (!authData || !authData.hash) {
      return res.status(400).send("Missing auth data");
    }

    const checkHash = authData.hash;
    delete authData.hash;

    // Build data_check_string
    const dataCheckArr = [];

    for (const key in authData) {
      dataCheckArr.push(`${key}=${authData[key]}`);
    }

    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join("\n");

    // secret key
    const secretKey = crypto
      .createHash("sha256")
      .update(botToken)
      .digest();

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (hash !== checkHash) {
      return res.status(403).json({ error: "Data is NOT from Telegram" });
    }

    // check expiry (24h)
    const authDate = parseInt(authData.auth_date);
    if (Date.now() / 1000 - authDate > 86400) {
      return res.status(403).json({ error: "Data is outdated" });
    }

    // success → return user
    return res.status(200).json({
      ok: true,
      user: authData
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}