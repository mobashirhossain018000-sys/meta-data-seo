const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Update toggles array
const togglesMarker = `  const toggles = ['single-word', 'silhouette', 'custom-prompt', 'transparent-bg'];`;
const togglesReplacement = `  const toggles = ['kw-single', 'kw-double', 'kw-mixed', 'silhouette', 'custom-prompt', 'transparent-bg'];`;
code = code.replace(togglesMarker, togglesReplacement);

// 2. Add mutual exclusivity logic
const initSettingsEnd = `          applyMetadataFiltersAndRender();
        }
      });
    }
  });`;

const initSettingsEndReplacement = `          applyMetadataFiltersAndRender();
        }
        
        // Mutual Exclusivity for Keyword Styles
        if (toggleId.startsWith('kw-') && e.target.checked) {
           ['kw-single', 'kw-double', 'kw-mixed'].forEach(kwId => {
             if (kwId !== toggleId) {
                const el = document.getElementById(kwId + '-switch');
                if (el) {
                  el.checked = false;
                  localStorage.setItem(\`toggle_\${kwId}\`, false);
                }
             }
           });
           
           // Ensure at least one is always checked
           const anyChecked = ['kw-single', 'kw-double', 'kw-mixed'].some(id => {
             const el = document.getElementById(id + '-switch');
             return el && el.checked;
           });
           if (!anyChecked) {
             const singleEl = document.getElementById('kw-single-switch');
             if (singleEl) {
               singleEl.checked = true;
               localStorage.setItem('toggle_kw-single', true);
             }
           }
        }
      });
    }
  });
  
  // Enforce one is checked on load
  const anyChecked = ['kw-single', 'kw-double', 'kw-mixed'].some(id => {
    const el = document.getElementById(id + '-switch');
    return el && el.checked;
  });
  if (!anyChecked) {
    const singleEl = document.getElementById('kw-single-switch');
    if (singleEl) {
      singleEl.checked = true;
      localStorage.setItem('toggle_kw-single', true);
    }
  }`;
code = code.replace(initSettingsEnd, initSettingsEndReplacement);

// 3. Update the prompt injection
const promptMarker = `4. Keywords: \${minKeys}-\${maxKeys} highly relevant words/phrases. Lowercase. No duplicates.`;

const promptReplacement = `\${(() => {
  const isSingle = document.getElementById('kw-single-switch')?.checked;
  const isDouble = document.getElementById('kw-double-switch')?.checked;
  const isMixed  = document.getElementById('kw-mixed-switch')?.checked;
  
  if (isSingle) return \`4. Keywords: \${minKeys}-\${maxKeys} highly relevant single words ONLY. CRITICAL: NO phrases, NO spaces, strictly individual words. Lowercase. No duplicates.\`;
  if (isDouble) return \`4. Keywords: \${minKeys}-\${maxKeys} highly relevant two-word phrases ONLY (e.g., 'golden sunset', 'blue sky'). CRITICAL: NO single words. Lowercase. No duplicates.\`;
  return \`4. Keywords: \${minKeys}-\${maxKeys} highly relevant combination of single words and phrases (max 3 words per phrase). Lowercase. No duplicates.\`;
})()}`;

code = code.replace(promptMarker, promptReplacement);

// 4. Update applyMetadataFiltersAndRender and addNewKeywordTag which relied on single-word-switch
code = code.replace(
  /const singleWordEl = document.getElementById\('single-word-switch'\);/g,
  "const singleWordEl = document.getElementById('kw-single-switch');"
);

fs.writeFileSync('app.js', code);
console.log("Patched JS successfully!");
