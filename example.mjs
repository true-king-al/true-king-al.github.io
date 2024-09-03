import OpenAI from "openai";
const openai = new OpenAI({ apiKey: 'sk-lD2Iz_FiSpyaDFElw_OXXCHn_HAWj2io6ji5LGqe1sT3BlbkFJW-pu6t0szoXnXqsZiKRRAhl9PjgYBNZqAtOco_6WAA' });

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