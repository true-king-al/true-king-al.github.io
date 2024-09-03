import OpenAI from "openai";
const openai = new OpenAI({ apiKey: 'sk-vcSmsvvSOqxkxcY6q-77bfAydpnUIaRKElZh-F2UIbT3BlbkFJylGciin6Hmn3_MgYwm-OxFlRaa40CXZ0UcXNOqdRcA' });

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "hello how are you",
        },
    ],
});

console.log(completion.choices[0].message.content);
