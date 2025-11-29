import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
    apiKey: "YOUR_OPENAI_API_KEY"
});

app.post("/generate-image", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const result = await client.images.generate({
            model: "gpt-image-1",
            prompt: prompt,
            size: "1024x1024"
        });

        const url = result.data[0].url;

        res.json({ url });
    } catch (error) {
        console.log(error);
        res.json({ error: true });
    }
});

app.listen(3000, () =>
    console.log("🔥 Server running on http://localhost:3000")
);