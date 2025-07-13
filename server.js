const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Bienvenue sur le backend ÉconoWatt !");
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Code manquant");

  try {
    const response = await axios.post("https://gw.hml.api.enedis.fr/v1/oauth2/token", {
      grant_type: "authorization_code",
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
    });

    const { access_token, refresh_token } = response.data;
    console.log("ACCESS TOKEN:", access_token);

    res.redirect(`https://tonapp.fr/success?token=${access_token}`);
  } catch (err) {
    console.error("Erreur:", err.response?.data || err.message);
    res.status(500).send("Erreur lors de l'échange de token");
  }
});

app.listen(PORT, () => {
  console.log(`Serveur ÉconoWatt actif sur le port ${PORT}`);
});
