const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Find the executeSingleProviderApiCall function body
const startMarker = `async function executeSingleProviderApiCall(fileObj, provider) {
  const activeKeys = apiKeysStore[provider]?.keys || [];
  if (activeKeys.length === 0) return null;
  
  const apiKey = activeKeys[0];`;

const replacementStart = `async function executeSingleProviderApiCall(fileObj, provider) {
  const activeKeys = apiKeysStore[provider]?.keys || [];
  if (activeKeys.length === 0) return null;
  `;

code = code.replace(startMarker, replacementStart);

// We need to wrap the logic from `let titleResult = "";` all the way down to `return null;` inside the loop.
// Let's use a regex to find the start of the variables
const varsMarker = `  let titleResult = "";
  let descResult  = "";
  let categoryResult = "";
  let tagsResult  = [];`;

const varsReplacement = `  let lastError = null;

  for (let keyIndex = 0; keyIndex < activeKeys.length; keyIndex++) {
    const apiKey = activeKeys[keyIndex];
    let titleResult = "";
    let descResult  = "";
    let categoryResult = "";
    let tagsResult  = [];
    
    try {`;

code = code.replace(varsMarker, varsReplacement);

// Now find the end part
const endMarker = `  // Return only if we have valid content
  if (titleResult && descResult && Array.isArray(tagsResult) && tagsResult.length > 0) {
    return {
      title: titleResult,
      desc:  descResult,
      category: categoryResult,
      tags:  tagsResult
    };
  }
  
  return null;
}`;

const endReplacement = `      // Return only if we have valid content
      if (titleResult && descResult && Array.isArray(tagsResult) && tagsResult.length > 0) {
        return {
          title: titleResult,
          desc:  descResult,
          category: categoryResult,
          tags:  tagsResult
        };
      }
    } catch (err) {
      console.warn(\`[\${provider}] Key \${keyIndex + 1}/\${activeKeys.length} failed:\`, err.message);
      lastError = err;
      if (keyIndex < activeKeys.length - 1) {
        showToast(\`API Key \${keyIndex + 1} failed. Falling back to next key...\`, 'warning');
      }
    }
  } // End of activeKeys loop
  
  if (lastError) throw lastError;
  return null;
}`;

code = code.replace(endMarker, endReplacement);

fs.writeFileSync('app.js', code);
console.log("Patched successfully!");
