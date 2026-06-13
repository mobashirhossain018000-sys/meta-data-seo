const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldToggle = `          <!-- Toggle 1 -->
          <div class="toggle-group pink-toggle">
            <span class="toggle-label">Single Word Keywords</span>
            <input type="checkbox" id="single-word-switch" class="switch-input" checked>
            <label for="single-word-switch" class="switch-label"></label>
          </div>`;

const newToggles = `          <!-- Keyword Generation Styles -->
          <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
            
            <div class="toggle-group pink-toggle" style="flex-direction: column; align-items: stretch; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="toggle-label" style="font-size: 14px;">Single-Word Keywords</span>
                <input type="checkbox" id="kw-single-switch" class="switch-input keyword-style-switch" checked>
                <label for="kw-single-switch" class="switch-label"></label>
              </div>
              <span style="font-size: 11px; color: var(--text-dark); line-height: 1.3;">Generate individual words as keywords (e.g., "sunset", "mountain", "ocean")</span>
            </div>

            <div class="toggle-group pink-toggle" style="flex-direction: column; align-items: stretch; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="toggle-label" style="font-size: 14px;">Double-Word Keywords</span>
                <input type="checkbox" id="kw-double-switch" class="switch-input keyword-style-switch">
                <label for="kw-double-switch" class="switch-label"></label>
              </div>
              <span style="font-size: 11px; color: var(--text-dark); line-height: 1.3;">Generate two-word phrases as keywords (e.g., "golden sunset", "snow mountain")</span>
            </div>

            <div class="toggle-group pink-toggle" style="flex-direction: column; align-items: stretch; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="toggle-label" style="font-size: 14px;">Mixed Keywords</span>
                <input type="checkbox" id="kw-mixed-switch" class="switch-input keyword-style-switch">
                <label for="kw-mixed-switch" class="switch-label"></label>
              </div>
              <span style="font-size: 11px; color: var(--text-dark); line-height: 1.3;">Generate a combination of single words and phrases for better coverage</span>
            </div>

          </div>`;

code = code.replace(oldToggle, newToggles);
fs.writeFileSync('index.html', code);
console.log("Patched UI successfully!");
