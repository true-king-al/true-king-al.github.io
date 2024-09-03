import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "hello how are you",
        },
    ],
    user="user_123456"
});

console.log(completion.choices[0].message.content);
