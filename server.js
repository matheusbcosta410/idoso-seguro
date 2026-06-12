require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ABRE O SITE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ANALISAR TEXTO
app.post("/analisar", async (req, res) => {
    try {

        const { texto } = req.body;

        const resposta = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
Você é um especialista em combate à desinformação.

Analise mensagens, notícias e links.

Responda exatamente neste formato:

Classificação:
Motivo:
Recomendação:
`
                },
                {
                    role: "user",
                    content: texto
                }
            ]
        });

        res.json({
            resposta: resposta.choices[0].message.content
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            resposta: "Erro ao analisar a informação."
        });

    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});