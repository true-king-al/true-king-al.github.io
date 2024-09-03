import OpenAI from "openai";

// Instantiate the OpenAI client with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Or use your API key directly as a string
});

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "hello how are you" }
    ]
});

console.log(completion.choices[0].message.content);
