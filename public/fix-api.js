const fs = require('fs');
let html = fs.readFileSync('zenith-ai-assistant.html', 'utf8');

// Fix request body format for OpenRouter
html = html.replace(
  /body: JSON\.stringify\(\{[\s\S]*?model:.*?,[\s\S]*?max_tokens:.*?,[\s\S]*?system:.*?,[\s\S]*?messages: chatHistory[\s\S]*?\}\)/g,
  `body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: ZENITH_CONTEXT },
          ...chatHistory
        ]
      })`
);

fs.writeFileSync('zenith-ai-assistant.html', html);
console.log('Fixed!');
