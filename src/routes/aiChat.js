const express = require("express");
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai")
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

router.post("/generate", async (req, res) => {

    try {

        const { email } = req.body
// gemini-3-flash-preview
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        })
// Write a professional email reply to this message:
        const prompt = `
        Give reply to the prompt in as short as possible, maximum length should not exceed 500 characters. 
        ${email}
        `

        const result = await model.generateContent(prompt)

        const response = await result.response
        const text = response.text()

        res.json({ reply: text })

    } catch (error) {

        console.error(error)
        res.status(500).json({ error: "AI generation failed" })

    }

})

module.exports = router;