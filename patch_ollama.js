const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add ollama to initial store
code = code.replace(
  "openrouter: { keys: [], customModel: '' }",
  "openrouter: { keys: [], customModel: '' },\n  ollama: { keys: ['http://localhost:11434'], customModel: 'llava' }"
);

// 2. Add ollama UI text mapping
// Let's find renderApiKeysPanel
const uiMarker = `  const keyInput = document.getElementById('api-key-input');
  keyInput.value = "";`;

const uiReplacement = `  const keyInput = document.getElementById('api-key-input');
  keyInput.value = "";
  
  if (activeApiProvider === 'ollama') {
    keyInput.placeholder = "Enter Local URL (e.g., http://localhost:11434)...";
    document.querySelector('.api-panel-content h4').innerText = "Local API URL:";
  } else {
    keyInput.placeholder = "Enter your " + activeApiProvider.toUpperCase() + " API key here...";
    document.querySelector('.api-panel-content h4').innerText = "API Key:";
  }`;

code = code.replace(uiMarker, uiReplacement);

// 3. Add Ollama logic to executeSingleProviderApiCall
const ollamaLogic = `
  /* ─── OLLAMA (LOCAL LLM) ─── */
  else if (provider === 'ollama') {
    const model = customModel || 'llava';
    // Remove trailing slash if present, add /api/generate
    let baseUrl = apiKey.trim();
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    const endpoint = baseUrl + '/api/generate';
    
    // Ollama requires base64 images to be raw base64 (without data:image/jpeg;base64,)
    const rawBase64 = base64Image.split(',')[1] || base64Image;
    
    const payload = {
      model: model,
      prompt: systemInstructions,
      stream: false,
      format: "json",
      images: rawBase64 ? [rawBase64] : undefined
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || \`Ollama HTTP \${response.status}. Is it running?\`);
    }
    
    const resJson = await response.json();
    const outputText = resJson.response || '';
    const parsedData = cleanAndParseJSON(outputText);
    
    titleResult = parsedData?.title || '';
    descResult  = parsedData?.description || '';
    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }
`;

// Insert it right after Groq logic ends
const groqEnd = `    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }`;

// Find the position of Mistral or OpenRouter to insert before OpenRouter
code = code.replace(
  "  /* ─── OPENROUTER ─── */",
  ollamaLogic + "\n  /* ─── OPENROUTER ─── */"
);

fs.writeFileSync('app.js', code);
console.log("Patched app.js successfully!");
