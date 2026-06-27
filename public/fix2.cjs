const fs = require('fs');
let html = fs.readFileSync('zenith-ai-assistant.html', 'utf8');

// Fix chat function
html = html.replace(
  `system: ZENITH_CONTEXT,
        messages: chatHistory`,
  `messages: [{role:'system',content:ZENITH_CONTEXT},...chatHistory]`
);

// Fix generate function  
html = html.replace(
  `system: getGenPrompt(),
        messages: [{ role: 'user', content: input }]`,
  `messages: [{role:'system',content:getGenPrompt()},{role:'user',content:input}]`
);

fs.writeFileSync('zenith-ai-assistant.html', html);
console.log('Done!');
