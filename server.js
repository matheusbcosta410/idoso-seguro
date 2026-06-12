require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/analisar", async (req, res) => {

    try {

        const { texto } = req.body;

        const chatCompletion = await groq.chat.completions.create({
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

Se for possível fake news, explique por quê.
Se não houver sinais claros, informe isso.
`
                },
                {
                    role: "user",
                    content: texto
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        res.json({
            resposta: chatCompletion.choices[0].message.content
        });

    } catch (erro) {

        console.error("ERRO:");
        console.error(erro);

        res.status(500).json({
            resposta: "Erro ao analisar a informação."
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});