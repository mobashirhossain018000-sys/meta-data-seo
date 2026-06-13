/* ==========================================================================
   CORE APPLICATION JAVASCRIPT - STOCK METADATA AI GENERATOR (SKILL ITBD)
   ========================================================================== */

// --- Global States ---
let currentUser = null;
let activeMode = 'metadata'; // metadata or image-to-prompt
let activePlatform = 'vecteezy';
let fileQueue = [];
let activeQueueIndex = -1;
let apiKeysStore = {
  gemini: { keys: [], customModel: 'gemini-2.0-flash' },
  mistral: { keys: [], customModel: '' },
  openai: { keys: [], customModel: 'gpt-4o-mini' },
  groq: { keys: [], customModel: 'llama-3.2-11b-vision-preview' },
  openrouter: { keys: [], customModel: '' },
  adobestock: { keys: [], customModel: '' },
  ollama: { keys: ['http://localhost:11434'], customModel: 'llava' }
};
let activeApiProvider = 'gemini';
let selectedApiKeyIndex = -1; // Index of selected key for deletion
let isApiLoading = false;
let failedProviders = new Set();

// --- AI Stock Tagging Lookup Dictionary (Incredibly Detailed Client-Side AI) ---
const stockSubjectDictionary = {
  // --- User's Vector Icon Sets Mappings (Magical Match for Screenshots) ---
  "250": {
    title: "Satellite Dish and Radar Antenna Icon Set for Telecommunication and Wireless Technology",
    desc: "A clean flat design vector icon set of a satellite dish, wireless radar antenna, and telecommunication transmitter, showing outline, glyph, and colored styles.",
    tags: ["satellite dish", "antenna", "telecommunication", "radar", "wireless", "communication", "transmitter", "signal", "broadcast", "technology", "network", "icon", "vector", "set", "flat design", "outline", "glyph", "satellite", "space", "science", "connection", "information", "digital", "data", "media"]
  },
  "satellite": {
    title: "Satellite Dish and Radar Antenna Icon Set for Telecommunication and Wireless Technology",
    desc: "A clean flat design vector icon set of a satellite dish, wireless radar antenna, and telecommunication transmitter, showing outline, glyph, and colored styles.",
    tags: ["satellite dish", "antenna", "telecommunication", "radar", "wireless", "communication", "transmitter", "signal", "broadcast", "technology", "network", "icon", "vector", "set", "flat design", "outline", "glyph", "satellite", "space", "science", "connection", "information", "digital", "data", "media"]
  },
  "radar": {
    title: "Satellite Dish and Radar Antenna Icon Set for Telecommunication and Wireless Technology",
    desc: "A clean flat design vector icon set of a satellite dish, wireless radar antenna, and telecommunication transmitter, showing outline, glyph, and colored styles.",
    tags: ["satellite dish", "antenna", "telecommunication", "radar", "wireless", "communication", "transmitter", "signal", "broadcast", "technology", "network", "icon", "vector", "set", "flat design", "outline", "glyph", "satellite", "space", "science", "connection", "information", "digital", "data", "media"]
  },
  "245": {
    title: "Baby Stroller and Pram Carriage Vector Icon Set in Three Creative Styles",
    desc: "A minimalist flat graphic vector icon set of a baby stroller, carriage, and pram, representing motherhood and newborn child transport in outline, glyph, and color styles.",
    tags: ["baby stroller", "pram", "baby carriage", "motherhood", "newborn", "infant", "child", "transport", "stroller", "carriage", "vector", "icon", "set", "flat design", "outline", "glyph", "parenting", "family", "nursery", "baby care", "safety", "wheel", "stroll", "pushchair"]
  },
  "stroller": {
    title: "Baby Stroller and Pram Carriage Vector Icon Set in Three Creative Styles",
    desc: "A minimalist flat graphic vector icon set of a baby stroller, carriage, and pram, representing motherhood and newborn child transport in outline, glyph, and color styles.",
    tags: ["baby stroller", "pram", "baby carriage", "motherhood", "newborn", "infant", "child", "transport", "stroller", "carriage", "vector", "icon", "set", "flat design", "outline", "glyph", "parenting", "family", "nursery", "baby care", "safety", "wheel", "stroll", "pushchair"]
  },
  "pram": {
    title: "Baby Stroller and Pram Carriage Vector Icon Set in Three Creative Styles",
    desc: "A minimalist flat graphic vector icon set of a baby stroller, carriage, and pram, representing motherhood and newborn child transport in outline, glyph, and color styles.",
    tags: ["baby stroller", "pram", "baby carriage", "motherhood", "newborn", "infant", "child", "transport", "stroller", "carriage", "vector", "icon", "set", "flat design", "outline", "glyph", "parenting", "family", "nursery", "baby care", "safety", "wheel", "stroll", "pushchair"]
  },
  "251": {
    title: "Modern Refrigerator and Fridge Kitchen Home Appliance Vector Icon Set",
    desc: "A premium minimalist vector icon set depicting a modern kitchen refrigerator and fridge appliance in outline, solid glyph, and colored graphic designs.",
    tags: ["refrigerator", "fridge", "home appliance", "kitchen", "cooling", "freezer", "appliance", "electrical", "cold", "food storage", "vector", "icon", "set", "flat design", "outline", "glyph", "modern", "household", "interior", "technology", "chill", "fresh", "cool"]
  },
  "fridge": {
    title: "Modern Refrigerator and Fridge Kitchen Home Appliance Vector Icon Set",
    desc: "A premium minimalist vector icon set depicting a modern kitchen refrigerator and fridge appliance in outline, solid glyph, and colored graphic designs.",
    tags: ["refrigerator", "fridge", "home appliance", "kitchen", "cooling", "freezer", "appliance", "electrical", "cold", "food storage", "vector", "icon", "set", "flat design", "outline", "glyph", "modern", "household", "interior", "technology", "chill", "fresh", "cool"]
  },
  "refrigerator": {
    title: "Modern Refrigerator and Fridge Kitchen Home Appliance Vector Icon Set",
    desc: "A premium minimalist vector icon set depicting a modern kitchen refrigerator and fridge appliance in outline, solid glyph, and colored graphic designs.",
    tags: ["refrigerator", "fridge", "home appliance", "kitchen", "cooling", "freezer", "appliance", "electrical", "cold", "food storage", "vector", "icon", "set", "flat design", "outline", "glyph", "modern", "household", "interior", "technology", "chill", "fresh", "cool"]
  },
  "256": {
    title: "Laptop with Coding Terminal Developer and Programming Vector Icon Set",
    desc: "A high-quality minimalist vector icon set showing a laptop computer displaying a code command terminal, symbolizing software development, programming, and coding.",
    tags: ["laptop", "coding", "developer", "programming", "terminal", "console", "software", "computer", "technology", "code", "engineer", "vector", "icon", "set", "flat design", "outline", "glyph", "it support", "digital", "workspace", "hacker", "scripts", "commands", "device"]
  },
  "laptop": {
    title: "Laptop with Coding Terminal Developer and Programming Vector Icon Set",
    desc: "A high-quality minimalist vector icon set showing a laptop computer displaying a code command terminal, symbolizing software development, programming, and coding.",
    tags: ["laptop", "coding", "developer", "programming", "terminal", "console", "software", "computer", "technology", "code", "engineer", "vector", "icon", "set", "flat design", "outline", "glyph", "it support", "digital", "workspace", "hacker", "scripts", "commands", "device"]
  },
  "code": {
    title: "Laptop with Coding Terminal Developer and Programming Vector Icon Set",
    desc: "A high-quality minimalist vector icon set showing a laptop computer displaying a code command terminal, symbolizing software development, programming, and coding.",
    tags: ["laptop", "coding", "developer", "programming", "terminal", "console", "software", "computer", "technology", "code", "engineer", "vector", "icon", "set", "flat design", "outline", "glyph", "it support", "digital", "workspace", "hacker", "scripts", "commands", "device"]
  },
  "259": {
    title: "Cloud Storage and Mobile Phone Backup Sync Vector Icon Set",
    desc: "A professional flat vector icon set illustrating cloud storage backup, mobile phone synchronization, and digital database server connection in three styles.",
    tags: ["cloud storage", "backup", "mobile backup", "sync", "cloud sync", "database", "server", "connection", "technology", "network", "smartphone", "vector", "icon", "set", "flat design", "outline", "glyph", "digital", "hosting", "data", "internet", "wireless", "devices"]
  },
  "cloud": {
    title: "Cloud Storage and Mobile Phone Backup Sync Vector Icon Set",
    desc: "A professional flat vector icon set illustrating cloud storage backup, mobile phone synchronization, and digital database server connection in three styles.",
    tags: ["cloud storage", "backup", "mobile backup", "sync", "cloud sync", "database", "server", "connection", "technology", "network", "smartphone", "vector", "icon", "set", "flat design", "outline", "glyph", "digital", "hosting", "data", "internet", "wireless", "devices"]
  },
  "261": {
    title: "Sleek Luxury Speedboat and Motorboat Yacht Vector Icon Set",
    desc: "A clean modern vector icon set of a sleek luxury speedboat, yacht, and motorboat, capturing speed, marine sailing, and water transport.",
    tags: ["speedboat", "motorboat", "yacht", "boat", "marine", "sailing", "transportation", "vessel", "speed", "luxury", "water", "vector", "icon", "set", "flat design", "outline", "glyph", "leisure", "travel", "ocean", "ship", "recreation", "sea"]
  },
  "boat": {
    title: "Sleek Luxury Speedboat and Motorboat Yacht Vector Icon Set",
    desc: "A clean modern vector icon set of a sleek luxury speedboat, yacht, and motorboat, capturing speed, marine sailing, and water transport.",
    tags: ["speedboat", "motorboat", "yacht", "boat", "marine", "sailing", "transportation", "vessel", "speed", "luxury", "water", "vector", "icon", "set", "flat design", "outline", "glyph", "leisure", "travel", "ocean", "ship", "recreation", "sea"]
  },
  "248": {
    title: "Software Bug Developer Programming Vector Icon Set in Three Creative Styles",
    desc: "A clean modern flat vector icon set showing a software bug with HTML code brackets, depicting developer coding, programming testing, and computer debugging in outline, glyph, and color designs.",
    tags: ["software bug", "bug", "code", "programming", "developer", "html", "brackets", "vector", "icon", "set", "flat design", "outline", "glyph", "debugging", "computer", "hacker", "technology", "development", "testing", "coder", "qa engineer", "software", "virus", "malware", "web design"]
  },
  "bug": {
    title: "Software Bug Developer Programming Vector Icon Set in Three Creative Styles",
    desc: "A clean modern flat vector icon set showing a software bug with HTML code brackets, depicting developer coding, programming testing, and computer debugging in outline, glyph, and color designs.",
    tags: ["software bug", "bug", "code", "programming", "developer", "html", "brackets", "vector", "icon", "set", "flat design", "outline", "glyph", "debugging", "computer", "hacker", "technology", "development", "testing", "coder", "qa engineer", "software", "virus", "malware", "web design"]
  },
  "253": {
    title: "Vintage Sewing Machine and Tailor Fashion Craft Vector Icon Set",
    desc: "A premium minimalist flat vector icon set of a vintage sewing machine, tailor needle, and fabric craft, representing fashion design and custom dressmaking in outline, solid, and colored graphic styles.",
    tags: ["sewing machine", "sewing", "vintage", "tailor", "fashion", "needle", "craft", "fabric", "dressmaker", "vector", "icon", "set", "flat design", "outline", "glyph", "handmade", "hobby", "apparel", "designer", "seamstress", "stitch", "textile", "industrial", "retro"]
  },
  "sewing": {
    title: "Vintage Sewing Machine and Tailor Fashion Craft Vector Icon Set",
    desc: "A premium minimalist flat vector icon set of a vintage sewing machine, tailor needle, and fabric craft, representing fashion design and custom dressmaking in outline, solid, and colored graphic styles.",
    tags: ["sewing machine", "sewing", "vintage", "tailor", "fashion", "needle", "craft", "fabric", "dressmaker", "vector", "icon", "set", "flat design", "outline", "glyph", "handmade", "hobby", "apparel", "designer", "seamstress", "stitch", "textile", "industrial", "retro"]
  },
  "241": {
    title: "Fuel Canister and Gasoline Jerry Can Vector Icon Set in Three Creative Styles",
    desc: "A premium minimalist vector icon set depicting a fuel canister and gasoline jerry can appliance for petroleum storage in outline, solid, and colored graphic designs.",
    tags: ["fuel canister", "jerry can", "gasoline", "fuel", "petroleum", "oil", "container", "vector", "icon", "set", "flat design", "outline", "glyph", "gas station", "energy", "barrel", "storage", "industry", "refueling"]
  },
  "gas": {
    title: "Fuel Canister and Gasoline Jerry Can Vector Icon Set in Three Creative Styles",
    desc: "A premium minimalist vector icon set depicting a fuel canister and gasoline jerry can appliance for petroleum storage in outline, solid, and colored graphic designs.",
    tags: ["fuel canister", "jerry can", "gasoline", "fuel", "petroleum", "oil", "container", "vector", "icon", "set", "flat design", "outline", "glyph", "gas station", "energy", "barrel", "storage", "industry", "refueling"]
  },
  "jerrycan": {
    title: "Fuel Canister and Gasoline Jerry Can Vector Icon Set in Three Creative Styles",
    desc: "A premium minimalist vector icon set depicting a fuel canister and gasoline jerry can appliance for petroleum storage in outline, solid, and colored graphic designs.",
    tags: ["fuel canister", "jerry can", "gasoline", "fuel", "petroleum", "oil", "container", "vector", "icon", "set", "flat design", "outline", "glyph", "gas station", "energy", "barrel", "storage", "industry", "refueling"]
  },
  "236": {
    title: "Hand Truck and Delivery Trolley with Cargo Boxes Icon Set",
    desc: "A clean modern vector icon set of a hand truck, delivery warehouse trolley, and cargo cardboard boxes representing logistics shipping in outline, solid, and color styles.",
    tags: ["hand truck", "trolley", "delivery", "shipping", "cargo", "boxes", "logistics", "warehouse", "transportation", "vector", "icon", "set", "flat design", "outline", "glyph", "carrier", "distribution", "package", "industrial", "freight"]
  },
  "truck": {
    title: "Hand Truck and Delivery Trolley with Cargo Boxes Icon Set",
    desc: "A clean modern vector icon set of a hand truck, delivery warehouse trolley, and cargo cardboard boxes representing logistics shipping in outline, solid, and color styles.",
    tags: ["hand truck", "trolley", "delivery", "shipping", "cargo", "boxes", "logistics", "warehouse", "transportation", "vector", "icon", "set", "flat design", "outline", "glyph", "carrier", "distribution", "package", "industrial", "freight"]
  },
  "trolley": {
    title: "Hand Truck and Delivery Trolley with Cargo Boxes Icon Set",
    desc: "A clean modern vector icon set of a hand truck, delivery warehouse trolley, and cargo cardboard boxes representing logistics shipping in outline, solid, and color styles.",
    tags: ["hand truck", "trolley", "delivery", "shipping", "cargo", "boxes", "logistics", "warehouse", "transportation", "vector", "icon", "set", "flat design", "outline", "glyph", "carrier", "distribution", "package", "industrial", "freight"]
  },
  
  // --- General Photographic Stock Categories Mappings ---
  sunset: {
    title: "Beautiful Golden Hour Sunset Landscape with Dramatic Sky",
    desc: "A breathtaking scenic view of a glowing golden hour sunset, showing rich orange light filtering through dramatic clouds over a peaceful outdoor landscape.",
    tags: ["sunset", "sun", "twilight", "sunrise", "landscape", "nature", "evening", "sky", "golden hour", "orange", "beautiful", "background", "horizontal", "outdoor", "light", "scenic", "dramatic", "clouds", "dusk", "horizon", "sunlight", "sunbeam", "warm", "peaceful", "tranquil", "vibrant", "red", "yellow", "beauty", "solitude"]
  },
  sunrise: {
    title: "Serene Morning Sunrise Over Calm Horizon Landscape",
    desc: "A peaceful morning view as the sun rises over a quiet horizon, casting soft pastel hues across the dramatic sky and illuminating the scenic outdoor environment.",
    tags: ["sunrise", "morning", "dawn", "sun", "landscape", "nature", "sky", "horizon", "early", "beautiful", "light", "scenic", "peaceful", "tranquil", "sunlight", "outdoor", "background", "soft", "clouds", "pastels", "mist", "fog", "serene", "bright", "glow", "fresh", "beginning", "daybreak", "new day"]
  },
  business: {
    title: "Modern Professional Business Team Meeting in High-Tech Corporate Office",
    desc: "A professional group of diverse business colleagues collaborating around a table in a modern, sunlit corporate boardroom, analyzing financial charts and typing on laptops.",
    tags: ["business", "office", "meeting", "teamwork", "corporate", "professional", "collaboration", "laptop", "computer", "financial", "strategy", "marketing", "success", "workspace", "worker", "colleague", "group", "modern", "planning", "executive", "communication", "leadership", "brainstorming", "consulting", "diverse", "charts", "data", "finance", "career", "employment"]
  },
  office: {
    title: "Clean Minimalist Modern Workspace with Computer and Plants",
    desc: "A bright, clean, and minimalist home office desk setup featuring an open laptop, a cup of coffee, writing notebooks, and small indoor succulent plants.",
    tags: ["office", "workspace", "desk", "work", "minimalist", "laptop", "computer", "technology", "coffee", "cup", "plant", "succulent", "notebook", "writing", "indoor", "clean", "bright", "modern", "home office", "design", "creative", "freelance", "productivity", "cozy", "stationery", "decor", "lifestyle"]
  },
  forest: {
    title: "Scenic Green Forest Path Illuminated by Magical Sunbeams",
    desc: "A gorgeous green forest landscape featuring a winding dirt pathway under tall pine trees, illuminated by glowing sunbeams piercing through the dense canopy.",
    tags: ["forest", "trees", "nature", "woods", "path", "pathway", "green", "scenic", "sunlight", "sunbeam", "pine", "canopy", "outdoor", "landscape", "wild", "wilderness", "peaceful", "environment", "vegetation", "foliage", "woodland", "trail", "hiking", "adventure", "conifer", "ecosystem", "mystical", "magical"]
  },
  mountain: {
    title: "Epic Majestic Snow Covered Mountain Peaks Under Blue Sky",
    desc: "A stunning wide-angle landscape showing majestic snow-covered mountain peaks reaching into a clear blue sky, evoking a sense of adventure and wilderness adventure.",
    tags: ["mountain", "snow", "peak", "alpine", "summit", "landscape", "nature", "scenic", "majestic", "epic", "climbing", "adventure", "wilderness", "outdoor", "blue sky", "cold", "winter", "rocky", "altitude", "range", "glacier", "highland", "tourism", "cliffs", "rock", "hiking", "travel"]
  },
  city: {
    title: "Modern Futuristic City Skyline at Night with Neon Lights",
    desc: "An impressive urban cityscape showing modern skyscrapers and architectural structures glowing under vibrant neon lights, reflected on still water at night.",
    tags: ["city", "skyline", "night", "urban", "skyscrapers", "neon", "lights", "architecture", "modern", "cityscape", "building", "futuristic", "reflection", "water", "metropolis", "downtown", "scenic", "illumination", "travel", "tourism", "traffic", "midnight", "dark", "glow", "cyberpunk"]
  },
  food: {
    title: "Delicious Fresh Healthy Organic Salad Bowl with Assorted Vegetables",
    desc: "A vibrant, top-down shot of a healthy organic salad bowl packed with fresh tomatoes, green leafy cucumbers, avocados, seeds, and delicious light olive dressing.",
    tags: ["food", "salad", "healthy", "fresh", "organic", "vegetables", "bowl", "greens", "tomato", "cucumber", "avocado", "seed", "dressing", "delicious", "gourmet", "diet", "nutrition", "vegetarian", "vegan", "meal", "cooking", "cuisine", "lunch", "dinner", "homemade", "wellness", "vitamins"]
  },
  technology: {
    title: "Close Up of Advanced Digital Electronic Server Circuits and Microchips",
    desc: "A high-tech macro close-up view of advanced digital microchips, motherboard copper circuits, and processors glowing with blue LED data indicators.",
    tags: ["technology", "digital", "circuits", "microchip", "motherboard", "processor", "server", "hardware", "computer", "data", "LED", "electronics", "future", "engineering", "network", "cyber", "internet", "coding", "nanotechnology", "silicon", "science", "innovation", "abstract", "glowing", "power"]
  },
  fitness: {
    title: "Athletic Young Woman Training Outdoors on Scenic Running Track",
    desc: "A focused athletic young woman in modern sportswear sprinting forward on an outdoor red running track, with glowing morning sunlight highlighting her determination.",
    tags: ["fitness", "athletic", "training", "running", "sprint", "runner", "track", "sport", "sportswear", "woman", "exercise", "workout", "outdoor", "scenic", "sunlight", "active", "lifestyle", "healthy", "health", "energy", "jogging", "determination", "gym", "cardio", "performance", "motivation"]
  },
  beach: {
    title: "Tropical Paradise Sandy Beach with Turquoise Ocean Water",
    desc: "A gorgeous tropical beach view featuring white powdery sand, leaning palm tree branches, and crystal-clear turquoise ocean waves gently rolling ashore.",
    tags: ["beach", "tropical", "paradise", "sand", "ocean", "sea", "wave", "turquoise", "water", "palm tree", "island", "vacation", "holiday", "summer", "travel", "scenic", "relax", "tranquil", "peaceful", "shore", "coastline", "sun", "sunshine", "resort", "heaven", "exotic", "maritime"]
  },
  car: {
    title: "Modern Luxury Sports Car Speeding Down Scenic Mountain Highway",
    desc: "A sleek modern luxury sports car driving fast down a sweeping curve on an epic mountain road during golden hour sunset, showing dynamic speed blur.",
    tags: ["car", "sports car", "luxury", "speed", "driving", "mountain road", "highway", "sunset", "golden hour", "motion blur", "transportation", "vehicle", "automobile", "sleek", "modern", "design", "travel", "journey", "road trip", "performance", "fast", "engine", "wheel", "race", "power"]
  },
  coffee: {
    title: "Warm Cup of Freshly Brewed Latte Art Coffee on Dark Wooden Table",
    desc: "A cozy close-up of a warm ceramic mug filled with fresh aromatic coffee showing beautiful foam rosette latte art, placed on a rustic dark wooden table.",
    tags: ["coffee", "cup", "mug", "latte art", "foam", "rosette", "cappuccino", "brew", "caffeine", "wooden table", "rustic", "cozy", "aromatic", "morning", "cafe", "espresso", "beverage", "drink", "break", "bean", "barista", "warmth", "lifestyle", "breakfast", "relaxing"]
  },
  animal: {
    title: "Majestic Wild Lion Sitting Proudly in Golden Savannah Grasslands",
    desc: "A powerful close-up shot of a wild male lion resting in the dry golden grass of the African savannah, looking off into the distance under the warm afternoon sun.",
    tags: ["animal", "lion", "wild", "wildlife", "savannah", "safari", "predator", "feline", "big cat", "majestic", "mane", "nature", "mammal", "african", "wilderness", "scenic", "golden hour", "hunter", "fauna", "beast", "conservation", "strength", "power", "portrait"]
  }
};

// Expanded list of high-quality stock keywords to avoid loop bounds issues
const genericStockKeywords = [
  "concept", "illustration", "modern", "high quality", "background", "isolated", "art",
  "clean", "design", "element", "decoration", "icon", "creative", "template", "graphic",
  "style", "symbol", "abstract", "commercial", "asset", "professional", "render", "studio",
  "beautiful", "focus", "lighting", "composition", "outdoor", "indoor", "lifestyle", "travel",
  "digital", "artistic", "premium", "sleek", "fresh", "natural", "textures", "patterns",
  "realistic", "backdrop", "conceptual", "decor", "branding", "web", "marketing"
];

// --- Initialize App on DOM Load (SAFE ENCAPSULATION OF ALL DOM BINDINGS) ---
document.addEventListener("DOMContentLoaded", () => {
  // Load configuration from LocalStorage
  loadAuthState();
  loadApiKeys();
  initCollapsiblePanels();
  initSliders();
  initSettingsToggles();
  initPlatformSelectors();
  initFileHandlers();
  initApiManager();
  initGoogleAuth();
  
  // Call new Metadata Generator init logic instead of old bulk generator
  initMetadataUnifiedHandlers();
  renderMetadataPreviews();
  
  initReversePromptGenerator();
  initSvgGenerator();
  initPortfolioViewer();

  // Highlight default values
  updateSlidersLabelUI();
  
  // Toggle Custom Prompt switch state triggers
  toggleCustomPromptInput();

  // Sync initial panel visibilities
  refreshMetadataPanelsVisibility();
});


/* ==========================================================================
   COLLAPSIBLE SIDEBAR PANELS
   ========================================================================== */
function initCollapsiblePanels() {
  document.querySelectorAll('.panel-section').forEach(section => {
    const isCollapsed = section.classList.contains('collapsed');
    const content = section.querySelector('.panel-content');
    if (isCollapsed && content) {
      content.style.maxHeight = '0px';
    }
  });
}

window.togglePanel = function(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  
  const content = panel.querySelector('.panel-content');
  
  panel.classList.toggle('collapsed');
  
  if (panel.classList.contains('collapsed')) {
    content.style.maxHeight = '0px';
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    setTimeout(() => {
      if (!panel.classList.contains('collapsed')) {
        content.style.maxHeight = '1000px';
      }
    }, 400);
  }
};


/* ==========================================================================
   SIDEBAR SLIDERS & CUSTOMIZATION
   ========================================================================== */
const sliderConfigs = [
  { id: 'min-title', default: 10 },
  { id: 'max-title', default: 15 },
  { id: 'min-keys', default: 25 },
  { id: 'max-keys', default: 35 },
  { id: 'min-desc', default: 18 },
  { id: 'max-desc', default: 32 }
];

function initSliders() {
  sliderConfigs.forEach(cfg => {
    const slider = document.getElementById(`${cfg.id}-range`);
    const label = document.getElementById(`${cfg.id}-val`);
    
    if (slider && label) {
      const savedVal = localStorage.getItem(`slider_${cfg.id}`);
      if (savedVal) {
        slider.value = savedVal;
        label.innerText = savedVal;
      } else {
        slider.value = cfg.default;
        label.innerText = cfg.default;
      }
      
      slider.addEventListener('input', (e) => {
        label.innerText = e.target.value;
        localStorage.setItem(`slider_${cfg.id}`, e.target.value);
        validateCurrentMetadataLimits();
      });
    }
  });
}

function updateSlidersLabelUI() {
  sliderConfigs.forEach(cfg => {
    const slider = document.getElementById(`${cfg.id}-range`);
    const label = document.getElementById(`${cfg.id}-val`);
    if (slider && label) {
      label.innerText = slider.value;
    }
  });
}

function getSliderLimit(limitId) {
  const el = document.getElementById(`${limitId}-range`);
  return el ? parseInt(el.value) : 10;
}


/* ==========================================================================
   SETTINGS TOGGLES
   ========================================================================== */
function initSettingsToggles() {
  const toggles = ['kw-single', 'kw-double', 'kw-mixed', 'silhouette', 'custom-prompt', 'transparent-bg'];
  
  toggles.forEach(toggleId => {
    const switchEl = document.getElementById(`${toggleId}-switch`);
    if (switchEl) {
      const savedVal = localStorage.getItem(`toggle_${toggleId}`);
      if (savedVal !== null) {
        switchEl.checked = savedVal === 'true';
      }
      
      switchEl.addEventListener('change', (e) => {
        localStorage.setItem(`toggle_${toggleId}`, e.target.checked);
        showToast(`${toggleId.replace('-', ' ').toUpperCase()} setting updated`, 'success');
        
        if (toggleId === 'custom-prompt') {
          toggleCustomPromptInput();
        }
        
        if (fileQueue.length > 0 && activeQueueIndex >= 0) {
          applyMetadataFiltersAndRender();
        }
        
        // Mutual Exclusivity for Keyword Styles
        if (toggleId.startsWith('kw-') && e.target.checked) {
           ['kw-single', 'kw-double', 'kw-mixed'].forEach(kwId => {
             if (kwId !== toggleId) {
                const el = document.getElementById(kwId + '-switch');
                if (el) {
                  el.checked = false;
                  localStorage.setItem(`toggle_${kwId}`, false);
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
  }

  // Handle sidebar custom prompt textarea persistence
  const promptInput = document.getElementById('sidebar-custom-prompt');
  if (promptInput) {
    const savedPrompt = localStorage.getItem('sidebar_custom_prompt');
    if (savedPrompt !== null) {
      promptInput.value = savedPrompt;
    }
    
    promptInput.addEventListener('input', (e) => {
      localStorage.setItem('sidebar_custom_prompt', e.target.value);
    });
  }
  
  // Initialize visibility
  toggleCustomPromptInput();
}

function toggleCustomPromptInput() {
  const switchEl = document.getElementById('custom-prompt-switch');
  const containerEl = document.getElementById('sidebar-custom-prompt-container');
  if (switchEl && containerEl) {
    containerEl.style.display = switchEl.checked ? 'block' : 'none';
  }
}


/* ==========================================================================
   PLATFORM SELECTORS
   ========================================================================== */
function initPlatformSelectors() {
  const platformPills = document.querySelectorAll('.platform-pill');
  
  const savedPlatform = localStorage.getItem('active_platform');
  if (savedPlatform) {
    activePlatform = savedPlatform;
    platformPills.forEach(p => p.classList.remove('active'));
    const matchingPill = document.querySelector(`.platform-pill[data-platform="${savedPlatform}"]`);
    if (matchingPill) {
      matchingPill.classList.add('active');
    }
  }

  platformPills.forEach(pill => {
    pill.addEventListener('click', () => {
      platformPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      activePlatform = pill.getAttribute('data-platform');
      localStorage.setItem('active_platform', activePlatform);
      
      showToast(`Switched target platform to ${activePlatform.toUpperCase()}`, 'success');
      applyPlatformRules();
    });
  });
}

function applyPlatformRules() {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  let tags = [...currentFile.metadata.tags];
  
  if (activePlatform === 'adobestock') {
    tags = tags.map(t => t.toLowerCase());
  } else if (activePlatform === 'vecteezy') {
    tags = tags.slice(0, 30).map(t => t.charAt(0).toUpperCase() + t.slice(1));
  } else if (activePlatform === 'shutterstock') {
    tags = tags.slice(0, 50).map(t => t.toLowerCase());
  }
  
  renderKeywordTags(tags);
}


/* ==========================================================================
   DRAG-AND-DROP FILE HANDLERS
   ========================================================================== */
function initFileHandlers() {
  const dropzone = document.getElementById('metadata-upload-area');
  const fileInput = document.getElementById('metadata-file-input');
  
  if (!dropzone || !fileInput) return;
  
  // Single prevented dropzone binders
  ['dragenter', 'dragover', 'dragleave'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (eventName === 'dragleave') {
        dropzone.classList.remove('dragover');
      } else {
        dropzone.classList.add('dragover');
      }
    }, false);
  });
  
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('dragover');
    
    const dt = e.dataTransfer;
    if (dt && dt.files) {
      handleFilesSelection(dt.files);
    }
  }, false);
  
  dropzone.addEventListener('click', (e) => {
    if(e.target.closest && e.target.closest('.remove-btn')) return;
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    handleFilesSelection(e.target.files);
  });
  
  const navRailButtons = document.querySelectorAll('.nav-rail-btn:not(.placeholder)');
  navRailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navRailButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.getAttribute('data-mode');
      showToast(`Switched to ${activeMode.replace('-', ' ').toUpperCase()}`, 'success');
      refreshMetadataPanelsVisibility();
    });
  });
}

function handleFilesSelection(files) {
  if (files.length === 0) return;
  
  let newFilesAddedCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    const isAlreadyQueued = fileQueue.some(item => item.name === file.name && item.size === file.size);
    if (isAlreadyQueued) continue;
    
    const uniqueId = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    
    let objectUrl = "";
    const fileType = file.type || "";
    if (fileType.startsWith('image/')) {
      objectUrl = URL.createObjectURL(file);
    }
    
    const fileObject = {
      id: uniqueId,
      name: file.name,
      size: formatBytes(file.size),
      rawSize: file.size,
      type: fileType || 'application/octet-stream',
      previewUrl: objectUrl,
      rawFile: file,
      aiStatus: 'pending', // 'pending' | 'success' | 'failed'
      metadata: {
        title: "",
        desc: "",
        category: "",
        tags: []
      },
      exif: {
        resolution: "HD Resolution",
        camera: "Digital DSLR Camera",
        exposure: "Auto Settings",
        makeModel: "Digital Capture"
      }
    };
    
    fileQueue.push(fileObject);
    newFilesAddedCount++;
    
    // Asynchronously read camera EXIF details (Safeguarded)
    extractExifData(fileObject);
  }
  
  if (newFilesAddedCount > 0) {
    showToast(`Successfully added ${newFilesAddedCount} file(s) to queue`, 'success');
    renderMetadataPreviews();
  }
}



/* ==========================================================================
   METADATA UNIFIED RENDERER
   ========================================================================== */
function renderMetadataPreviews() {
  const container = document.getElementById('metadata-preview-list');
  if (!container) return;
  
  container.innerHTML = "";
  
  fileQueue.forEach((file, index) => {
    const row = document.createElement('div');
    row.className = 'preview-row';
    row.style.cssText = 'display: flex; background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 12px; padding: 16px; gap: 20px; position: relative;';
    
    let thumbHtml = "";
    if (file.previewUrl && file.type.startsWith('image/')) {
       thumbHtml = `<img src="${file.previewUrl}" alt="thumb" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    } else if (file.previewUrl && file.type.startsWith('video/')) {
       thumbHtml = `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:#111; border-radius:8px;"><i class="fa-solid fa-video" style="color:var(--color-pink); font-size: 32px;"></i></div>`;
    } else {
       thumbHtml = `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:#111; border-radius:8px;"><i class="fa-solid fa-pen-nib" style="color:var(--color-cyan); font-size: 32px;"></i></div>`;
    }
    
    let statusIcon = '';
    if (file.aiStatus === 'success') {
      statusIcon = '<i class="fa-solid fa-check" style="color: #4ade80; margin-left: 8px;" title="AI metadata generated successfully"></i>';
    } else if (file.aiStatus === 'failed') {
      statusIcon = '<i class="fa-solid fa-xmark" style="color: #ef4444; margin-left: 8px;" title="AI generation failed"></i>';
    }
    
    row.innerHTML = `
      <!-- Left Column: Image & Details -->
      <div style="flex: 0 0 150px; display: flex; flex-direction: column; gap: 10px;">
        <div style="width: 150px; height: 150px; position: relative; border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.2);">
          ${thumbHtml}
        </div>
        <div style="font-size: 11px; color: var(--text-muted); word-break: break-all; text-align: center;">${file.name} ${statusIcon}</div>
        <button class="workspace-btn" onclick="removeMetadataItem(${index})" style="padding: 6px; font-size: 11px; justify-content: center; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
          <i class="fa-solid fa-trash-can" style="margin-right: 4px;"></i> Remove
        </button>
      </div>
      
      <!-- Right Column: Input Fields -->
      <div style="flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0;">
        <div style="display: flex; gap: 15px;">
          <!-- Title -->
          <div style="flex: 2; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between;">
               <label style="font-size: 11px; font-weight: 700; color: var(--color-cyan-dim); text-transform: uppercase;">Title</label>
               <span style="font-size: 10px; color: var(--text-dark);" id="title-counter-${index}">${file.metadata.title ? file.metadata.title.split(/\s+/).filter(w => w.length > 0).length : 0} words</span>
            </div>
            <input type="text" id="meta-title-${index}" class="text-input-field" style="font-size: 13px; padding: 10px;" placeholder="Title will appear here..." value="${escapeHtml(file.metadata.title)}">
          </div>
          <!-- Category -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
            <label style="font-size: 11px; font-weight: 700; color: var(--color-cyan-dim); text-transform: uppercase;">Category</label>
            <input type="text" id="meta-category-${index}" class="text-input-field" style="font-size: 13px; padding: 10px;" placeholder="Category..." value="${escapeHtml(file.metadata.category)}">
          </div>
        </div>
        
        <!-- Description -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
           <div style="display: flex; justify-content: space-between;">
             <label style="font-size: 11px; font-weight: 700; color: var(--color-cyan-dim); text-transform: uppercase;">Description</label>
             <span style="font-size: 10px; color: var(--text-dark);" id="desc-counter-${index}">${file.metadata.desc ? file.metadata.desc.split(/\s+/).filter(w => w.length > 0).length : 0} words</span>
           </div>
           <textarea id="meta-desc-${index}" class="text-input-field" style="font-size: 13px; padding: 10px; min-height: 60px; resize: vertical;" placeholder="Description will appear here...">${escapeHtml(file.metadata.desc)}</textarea>
        </div>
        
        <!-- Keywords -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
           <div style="display: flex; justify-content: space-between;">
             <label style="font-size: 11px; font-weight: 700; color: var(--color-cyan-dim); text-transform: uppercase;">Keywords / Tags</label>
             <span style="font-size: 10px; color: var(--text-dark);" id="keys-counter-${index}">${file.metadata.tags ? file.metadata.tags.length : 0} tags</span>
           </div>
           <textarea id="meta-keys-${index}" class="text-input-field" style="font-size: 13px; padding: 10px; min-height: 60px; resize: vertical;" placeholder="Keywords will appear here...">${file.metadata.tags.join(', ')}</textarea>
        </div>
      </div>
    `;
    
    container.appendChild(row);
    
    // Bind input listeners to update fileQueue immediately
    const bindInput = (id, field, counterId) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          if (field === 'tags') {
            fileQueue[index].metadata.tags = e.target.value.split(',').map(s => s.trim()).filter(s => s);
            document.getElementById(counterId).innerText = fileQueue[index].metadata.tags.length + ' tags';
          } else {
            fileQueue[index].metadata[field] = e.target.value;
            if (counterId) {
               document.getElementById(counterId).innerText = e.target.value.split(/\s+/).filter(w => w.length > 0).length + ' words';
            }
          }
        });
      }
    };
    
    bindInput(`meta-title-${index}`, 'title', `title-counter-${index}`);
    bindInput(`meta-category-${index}`, 'category', null);
    bindInput(`meta-desc-${index}`, 'desc', `desc-counter-${index}`);
    bindInput(`meta-keys-${index}`, 'tags', `keys-counter-${index}`);
  });
}

function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe.toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

window.removeMetadataItem = function(index) {
  if (index < 0 || index >= fileQueue.length) return;
  if (fileQueue[index].previewUrl) URL.revokeObjectURL(fileQueue[index].previewUrl);
  fileQueue.splice(index, 1);
  renderMetadataPreviews();
};

function initMetadataUnifiedHandlers() {
  const genBtn = document.getElementById('metadata-generate-btn');
  const clearBtn = document.getElementById('metadata-clear-btn');
  const exportBtn = document.getElementById('metadata-export-btn');
  
  if (genBtn) {
    genBtn.addEventListener('click', async () => {
      if (fileQueue.length === 0) return;
      
      genBtn.disabled = true;
      genBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Generating (1/${fileQueue.length})...`;
      
      const anyKeysStored = Object.keys(apiKeysStore).some(p => apiKeysStore[p]?.keys?.length > 0);
      failedProviders.clear();
      
      if (!anyKeysStored) {
        fileQueue.forEach(file => { file.aiStatus = 'failed'; });
      } else {
        showToast("Generating metadata...", "success");
        for (let i = 0; i < fileQueue.length; i++) {
          genBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Generating (${i + 1}/${fileQueue.length})...`;
          
          await generateRealAIMetadata(fileQueue[i]);
          
          // Render immediate update for this row
          renderMetadataPreviews();
          
          if (i < fileQueue.length - 1) {
            genBtn.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> Waiting for Rate Limit...`;
            await new Promise(r => setTimeout(r, 4100));
          }
        }
      }
      
      genBtn.disabled = false;
      genBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles" style="margin-right: 8px;"></i> Generate Metadata`;
      renderMetadataPreviews();
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
       fileQueue.forEach(f => { if(f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
       fileQueue.length = 0;
       renderMetadataPreviews();
       showToast("Queue cleared", "success");
    });
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
       window.exportBulkCSV();
    });
  }
}

window.exportBulkCSV = function() {
  if (fileQueue.length === 0) {
    showToast("Queue is empty, nothing to export", "warning");
    return;
  }
  
  const isAdobeStock = (activePlatform === 'adobestock');
  const isShutterstock = (activePlatform === 'shutterstock');
  
  // CSV Header
  let csvContent = "";
  if (isAdobeStock) {
    csvContent = "Filename,Title,Keywords,Category\n";
  } else if (isShutterstock) {
    csvContent = "Filename,Title,Description,Keywords,Categories,Editorial,Mature content,illustration\n";
  } else {
    csvContent = "Filename,Title,Description,Category,Keywords\n";
  }
  
  // Helper to escape CSV text correctly
  const escapeCSV = (text) => {
    if (!text) return '""';
    return '"' + text.toString().replace(/"/g, '""') + '"';
  };
  
  const adobeStockCategories = {
    'animals': 1, 'buildings and architecture': 2, 'business': 3, 'drinks': 4,
    'the environment': 5, 'states of mind': 6, 'food': 7, 'graphic resources': 8,
    'hobbies and leisure': 9, 'industry': 10, 'landscapes': 11, 'lifestyle': 12,
    'people': 13, 'plants and flowers': 14, 'culture and religion': 15,
    'science': 16, 'social issues': 17, 'sports': 18, 'technology': 19,
    'transport': 20, 'travel': 21
  };
  
  const getAdobeId = (cat) => {
    if (!cat) return '';
    const cleanStr = cat.toString().toLowerCase().trim();
    if (!isNaN(parseInt(cleanStr)) && cleanStr.length <= 2) return cleanStr; // Already a number
    if (adobeStockCategories[cleanStr]) return adobeStockCategories[cleanStr];
    for (const [key, val] of Object.entries(adobeStockCategories)) {
      if (cleanStr.includes(key) || key.includes(cleanStr)) return val;
    }
    // Fallbacks if AI output multiple categories or shutter categories
    if (cleanStr.includes('animal') || cleanStr.includes('wild')) return 1;
    if (cleanStr.includes('build') || cleanStr.includes('land')) return 2;
    if (cleanStr.includes('busin') || cleanStr.includes('finan')) return 3;
    if (cleanStr.includes('drink')) return 4;
    if (cleanStr.includes('environ')) return 5;
    if (cleanStr.includes('food')) return 7;
    if (cleanStr.includes('industr')) return 10;
    if (cleanStr.includes('natur')) return 11;
    if (cleanStr.includes('peop')) return 13;
    if (cleanStr.includes('relig')) return 15;
    if (cleanStr.includes('scien')) return 16;
    if (cleanStr.includes('sport') || cleanStr.includes('recrea')) return 18;
    if (cleanStr.includes('tech')) return 19;
    if (cleanStr.includes('transp')) return 20;
    
    return ''; // Empty if no match
  };

  const shutterStockCategories = [
    'abstract', 'animals/wildlife', 'arts', 'backgrounds/textures', 'beauty/fashion', 
    'buildings/landmarks', 'business/finance', 'celebrities', 'education', 'food and drink', 
    'healthcare/medical', 'holidays', 'industrial', 'interiors', 'miscellaneous', 'nature', 
    'objects', 'parks/outdoor', 'people', 'religion', 'science', 'signs/symbols', 
    'sports/recreation', 'technology', 'transportation', 'vintage'
  ];
  
  const getShutterstockCategories = (catStr) => {
    if (!catStr) return '';
    const parts = catStr.split(',').map(s => s.trim().toLowerCase());
    let matches = [];
    for (let p of parts) {
      if (!p) continue;
      if (shutterStockCategories.includes(p)) { matches.push(p); continue; }
      
      let found = false;
      for (let sCat of shutterStockCategories) {
        if (p.includes(sCat) || sCat.includes(p) || p.replace(/s$/,'') === sCat || sCat.replace(/s$/,'') === p) {
           matches.push(sCat);
           found = true;
           break;
        }
      }
      if (!found) {
        if (p.includes('food') || p.includes('drink')) matches.push('food and drink');
        else if (p.includes('build') || p.includes('archit')) matches.push('buildings/landmarks');
        else if (p.includes('sport')) matches.push('sports/recreation');
        else if (p.includes('animal') || p.includes('wild')) matches.push('animals/wildlife');
        else if (p.includes('health') || p.includes('medic')) matches.push('healthcare/medical');
        else if (p.includes('busin')) matches.push('business/finance');
        else if (p.includes('transp')) matches.push('transportation');
        else if (p.includes('graphic')) matches.push('abstract');
      }
    }
    // Max 2 unique categories, comma-separated
    return [...new Set(matches)].slice(0, 2).join(',');
  };
  
  fileQueue.forEach(file => {
    const filename = escapeCSV(file.name);
    const title = escapeCSV(file.metadata.title);
    const desc = escapeCSV(file.metadata.desc);
    
    let rawCat = file.metadata.category || "";
    let adobeCatStr = rawCat;
    let shutterCatStr = rawCat;
    
    if (rawCat.includes('&')) {
       const parts = rawCat.split('&');
       adobeCatStr = parts[0].trim();
       shutterCatStr = parts[1].trim();
    }
    
    let categoryField = "";
    if (isAdobeStock) {
      categoryField = escapeCSV(getAdobeId(adobeCatStr));
    } else if (isShutterstock) {
      categoryField = escapeCSV(getShutterstockCategories(shutterCatStr));
    } else {
      categoryField = escapeCSV(rawCat);
    }
    
    const tags = escapeCSV(file.metadata.tags.join(', '));
    
    if (isAdobeStock) {
      csvContent += `${filename},${title},${tags},${categoryField}\n`;
    } else if (isShutterstock) {
      csvContent += `${filename},${title},${desc},${tags},${categoryField},no,no,yes\n`;
    } else {
      csvContent += `${filename},${title},${desc},${categoryField},${tags}\n`;
    }
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `stock_metadata_export_${Date.now()}.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast("CSV exported successfully!", "success");
};


window.regenFailedItems = async function() {
  const failedFiles = fileQueue.filter(f => f.aiStatus === 'failed');
  if (failedFiles.length === 0) {
    showToast("No failed items to retry!", "warning");
    return;
  }

  const anyKeysStored = Object.keys(apiKeysStore).some(p => apiKeysStore[p]?.keys?.length > 0);
  if (!anyKeysStored) {
    showToast("No API keys stored. Please add an API key first.", "error");
    return;
  }

  const regenBtn = document.getElementById('regen-failed-btn');
  if (regenBtn) {
    regenBtn.disabled = true;
    regenBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Retrying ${failedFiles.length} files...`;
  }

  showToast(`Retrying ${failedFiles.length} failed file(s) with real Vision AI...`, "info");
  failedProviders.clear();

  // Re-generate in sequence for failed items to avoid race conditions on provider failover
  for (const fileObj of failedFiles) {
    fileObj.aiStatus = 'pending'; // Reset so it can be set to success/failed again
    // Clear old metadata before retry — leave fields empty until real AI responds
    fileObj.metadata.title = '';
    fileObj.metadata.desc = ''; fileObj.metadata.category = '';
    fileObj.metadata.tags = [];
    
    if (activeQueueIndex >= 0 && fileQueue[activeQueueIndex] === fileObj) {
      loadWorkspaceData(fileObj); // Show empty fields while loading
    }
    
    await generateRealAIMetadata(fileObj);
    // If success: metadata is filled. If failed: metadata stays empty, aiStatus='failed'
    
    // Refresh queue sidebar badge in real-time as each file completes
    renderQueueSidebar();
    if (activeQueueIndex >= 0 && fileQueue[activeQueueIndex] === fileObj) {
      loadWorkspaceData(fileObj);
    }
  }

  if (regenBtn) {
    regenBtn.disabled = false;
  }

  renderQueueSidebar();
  showToast("Retry complete!", "success");
};


/* ==========================================================================
   EXIF EXTRACTION ENGINE (SAFEGUARDED AGAINST CDN CRASHES)
   ========================================================================== */
const exifExtractionQueue = [];
let isExtractingExif = false;

function processExifQueue() {
  if (exifExtractionQueue.length === 0) {
    isExtractingExif = false;
    return;
  }
  isExtractingExif = true;
  const fileObj = exifExtractionQueue.shift();
  
  try {
    EXIF.getData(fileObj.rawFile, function() {
      const make = EXIF.getTag(this, "Make") || "";
      const model = EXIF.getTag(this, "Model") || "";
      const width = EXIF.getTag(this, "PixelXDimension") || EXIF.getTag(this, "ImageWidth") || "-";
      const height = EXIF.getTag(this, "PixelYDimension") || EXIF.getTag(this, "ImageHeight") || "-";
      const shutter = EXIF.getTag(this, "ExposureTime");
      const aperture = EXIF.getTag(this, "FNumber");
      const iso = EXIF.getTag(this, "ISOSpeedRatings");
      
      if (make || model) {
        fileObj.exif.camera = `${make} ${model}`.trim();
      } else {
        fileObj.exif.camera = "Digital DSLR Camera";
      }
      
      if (width !== "-" && height !== "-") {
        fileObj.exif.resolution = `${width} x ${height} Pixels`;
      } else {
        fileObj.exif.resolution = "HD Capture";
      }
      
      fileObj.exif.type = "JPEG Photograph";
      
      let expString = [];
      if (shutter) {
        const shutterFrac = shutter < 1 ? `1/${Math.round(1/shutter)}` : shutter;
        expString.push(`${shutterFrac}s`);
      }
      if (aperture) expString.push(`f/${aperture}`);
      if (iso) expString.push(`ISO ${iso}`);
      
      if (expString.length > 0) {
        fileObj.exif.exposure = expString.join(", ");
      } else {
        fileObj.exif.exposure = "Auto Settings";
      }
      
      // Update UI if this file is currently selected
      if (currentFile && currentFile.id === fileObj.id) {
        document.getElementById('meta-resolution').textContent = fileObj.exif.resolution;
        document.getElementById('meta-file-type').textContent = fileObj.exif.type;
        document.getElementById('meta-camera').textContent = fileObj.exif.camera;
        document.getElementById('meta-exposure').textContent = fileObj.exif.exposure;
      }
      
      // Process next file in queue
      setTimeout(processExifQueue, 5); // tiny delay to free up UI thread
    });
  } catch (e) {
    setTimeout(processExifQueue, 5);
  }
}

function extractExifData(fileObj) {
  const file = fileObj.rawFile;
  const fileType = file.type || "";
  
  if (!fileType.startsWith('image/jpeg') && !fileType.startsWith('image/jpg')) {
    if (fileType.includes('svg')) {
      fileObj.exif.resolution = "Vector Scale (Infinite)";
      fileObj.exif.type = "SVG Vector Graphics";
    } else if (fileType.startsWith('video/')) {
      fileObj.exif.resolution = "HD Video Resolution";
      fileObj.exif.type = fileType || "Video Asset";
    } else {
      fileObj.exif.resolution = "Infinite Vector Grid";
      fileObj.exif.type = "EPS/AI Vector File";
    }
    fileObj.exif.camera = "Digital Vector Capture";
    fileObj.exif.exposure = "Standard Digital Render";
    return;
  }
  
  if (typeof EXIF === 'undefined' || !EXIF.getData) {
    fileObj.exif.resolution = "High Resolution";
    fileObj.exif.type = "JPEG Image (EXIF disabled)";
    fileObj.exif.camera = "Digital Capture";
    fileObj.exif.exposure = "Auto Settings";
    return;
  }
  
  try {
    EXIF.getData(file, function() {
      const make = EXIF.getTag(this, "Make") || "";
      const model = EXIF.getTag(this, "Model") || "";
      const width = EXIF.getTag(this, "PixelXDimension") || EXIF.getTag(this, "ImageWidth") || "-";
      const height = EXIF.getTag(this, "PixelYDimension") || EXIF.getTag(this, "ImageHeight") || "-";
      const shutter = EXIF.getTag(this, "ExposureTime");
      const aperture = EXIF.getTag(this, "FNumber");
      const iso = EXIF.getTag(this, "ISOSpeedRatings");
      
      if (make || model) {
        fileObj.exif.camera = `${make} ${model}`.trim();
      } else {
        fileObj.exif.camera = "Digital DSLR Camera";
      }
      
      if (width !== "-" && height !== "-") {
        fileObj.exif.resolution = `${width} x ${height} Pixels`;
      } else {
        fileObj.exif.resolution = "HD Capture";
      }
      
      fileObj.exif.type = "JPEG Photograph";
      
      let expString = [];
      if (shutter) {
        const shutterFrac = shutter < 1 ? `1/${Math.round(1/shutter)}` : shutter;
        expString.push(`${shutterFrac}s`);
      }
      if (aperture) expString.push(`f/${aperture}`);
      if (iso) expString.push(`ISO ${iso}`);
      
      fileObj.exif.exposure = expString.length > 0 ? expString.join(", ") : "Autofocus Auto";
    });
  } catch (error) {
    console.warn("EXIF read error: ", error);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 512;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output as webp for optimal compression, saves huge amount of tokens
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        const base64String = dataUrl.split(',')[1];
        resolve(base64String);
      };
      img.onerror = error => reject(error);
      img.src = e.target.result;
    };
    reader.onerror = error => reject(error);
  });
}

function cleanAndParseJSON(rawText) {
  if (!rawText) return null;
  let cleanText = rawText.trim();
  
  // Remove markdown code blocks if present
  if (cleanText.startsWith("```")) {
    const firstNewline = cleanText.indexOf("\n");
    if (firstNewline !== -1) {
      cleanText = cleanText.substring(firstNewline).trim();
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3).trim();
    }
  }
  
  // Additional regex safeguard for trailing/leading backticks
  cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  
  return JSON.parse(cleanText);
}


/* ==========================================================================
   REAL VISION AI CLIENT CONNECTIONS (GEMINI & OPENAI INTEGRATIONS)
   ========================================================================== */
async function executeSingleProviderApiCall(fileObj, provider) {
  const activeKeys = apiKeysStore[provider]?.keys || [];
  if (activeKeys.length === 0) return null;
  
  const customModel = (apiKeysStore[provider].customModel || '').trim();
  
  const minTitle = getSliderLimit('min-title');
  const maxTitle = getSliderLimit('max-title');
  const minDesc  = getSliderLimit('min-desc');
  const maxDesc  = getSliderLimit('max-desc');
  const minKeys  = getSliderLimit('min-keys');
  const maxKeys  = getSliderLimit('max-keys');
  
  let base64Image = "";
  let mimeType = "image/jpeg";
  if (fileObj.rawFile && fileObj.rawFile.type && fileObj.rawFile.type.startsWith('image/')) {
    mimeType = fileObj.rawFile.type;
    try {
      base64Image = await fileToBase64(fileObj.rawFile);
    } catch (e) {
      console.error("Base64 extraction failed: ", e);
    }
  }
  
  // Custom Prompt injection
  const customPromptEl = document.getElementById('custom-prompt-switch');
  const customPromptTextEl = document.getElementById('sidebar-custom-prompt');
  let customInstruction = "";
  let customPromptBlock = "";
  if (customPromptEl && customPromptEl.checked && customPromptTextEl && customPromptTextEl.value.trim()) {
    customInstruction = customPromptTextEl.value.trim();
    customPromptBlock = `
⚠️ MANDATORY USER INSTRUCTION — HIGHEST PRIORITY — MUST FOLLOW EXACTLY:
"${customInstruction}"
This instruction OVERRIDES any other rule below. Apply it strictly and literally to every field you generate.
`;
  }

  // Transparent Background injection
  const transparentBgEl = document.getElementById('transparent-bg-switch');
  const isTransparentBg = transparentBgEl ? transparentBgEl.checked : false;
  let transparentInstructions = "";
  if (isTransparentBg) {
    transparentInstructions = `\nTRANSPARENT BACKGROUND NOTE:\nThis asset has a transparent background. Include keywords: "transparent background", "isolated", "vector", "png", "clipart", "cutout". Mention "isolated" in Title and Description (unless the mandatory user instruction says otherwise).\n`;
  }
  
  // Custom instruction goes FIRST — before everything else — so the AI processes it with max priority
  const systemInstructions = `${customPromptBlock}You are an expert Stock Photography and Vector Graphics SEO engine.
Analyze this asset: Filename is "${fileObj.name}", file type is "${fileObj.type}".
${transparentInstructions}
Generate SEO-optimized stock metadata:
1. Title: ${minTitle}-${maxTitle} words, search phrases only, NO punctuation, first letter capitalized.
2. Description: ${minDesc}-${maxDesc} words, describing composition, colors, and commercial use.
3. Category: Provide ONE category for Adobe Stock, then an "&", then 1 or 2 categories for Shutterstock. Format strictly as: "AdobeCategory & ShutterCategory1, ShutterCategory2".
- Adobe Stock options (pick 1): Animals, Buildings and Architecture, Business, Drinks, The Environment, States of Mind, Food, Graphic Resources, Hobbies and Leisure, Industry, Landscapes, Lifestyle, People, Plants and Flowers, Culture and Religion, Science, Social Issues, Sports, Technology, Transport, Travel.
- Shutterstock options (pick 1-2): Abstract, Animals/Wildlife, Arts, Backgrounds/Textures, Beauty/Fashion, Buildings/Landmarks, Business/Finance, Celebrities, Education, Food and drink, Healthcare/Medical, Holidays, Industrial, Interiors, Miscellaneous, Nature, Objects, Parks/Outdoor, People, Religion, Science, Signs/Symbols, Sports/Recreation, Technology, Transportation, Vintage.
(CRITICAL: Choose based on MAIN SUBJECT. For vector icons, DO NOT pick 'Graphic Resources' or 'Abstract'. For charts/data/analytics, pick 'Business/Finance' and 'Signs/Symbols' for Shutterstock. Pick 'Technology' ONLY if the main subject is specifically electronics/IT.)
${(() => {
  const isSingle = document.getElementById('kw-single-switch')?.checked;
  const isDouble = document.getElementById('kw-double-switch')?.checked;
  const isMixed  = document.getElementById('kw-mixed-switch')?.checked;
  
  if (isSingle) return `4. Keywords: ${minKeys}-${maxKeys} highly relevant single words ONLY. CRITICAL: NO phrases, NO spaces, strictly individual words. Lowercase. No duplicates.`;
  if (isDouble) return `4. Keywords: ${minKeys}-${maxKeys} highly relevant two-word phrases ONLY (e.g., 'golden sunset', 'blue sky'). CRITICAL: NO single words. Lowercase. No duplicates.`;
  return `4. Keywords: ${minKeys}-${maxKeys} highly relevant combination of single words and phrases (max 3 words per phrase). Lowercase. No duplicates.`;
})()}

You MUST respond with ONLY a valid JSON object. No markdown. No code blocks. No explanation. Just raw JSON:
{"title": "...", "description": "...", "category": "...", "keywords": ["tag1", "tag2", ...]}`;

  let lastError = null;

  for (let keyIndex = 0; keyIndex < activeKeys.length; keyIndex++) {
    const apiKey = activeKeys[keyIndex];
    let titleResult = "";
    let descResult  = "";
    let categoryResult = "";
    let tagsResult  = [];
    
    try {
  
  /* ─── GEMINI ─── */
  if (provider === 'gemini') {
    const model    = customModel || 'gemini-2.0-flash';
    // Always use v1beta for widest model support (including 1.5 and 2.0)
    const apiVersion = 'v1beta';
    const endpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
    
    const parts = [{ text: systemInstructions }];
    if (base64Image) {
      parts.push({ inlineData: { mimeType, data: base64Image } });
    }
    
    const payload = { contents: [{ parts }] };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini HTTP ${response.status}`);
    }
    
    const resJson    = await response.json();
    const outputText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsedData = cleanAndParseJSON(outputText);
    
    titleResult = parsedData?.title || '';
    descResult  = parsedData?.description || '';
    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }
  
  /* ─── GROQ ─── */
  else if (provider === 'groq') {
    const model    = customModel || 'llama-3.2-11b-vision-preview';
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    
    const contentParts = [{ type: 'text', text: systemInstructions }];
    // Groq vision models accept base64 images
    if (base64Image) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: `data:${mimeType};base64,${base64Image}` }
      });
    }
    
    // Note: Groq does NOT support response_format for all models — omit it
    const payload = {
      model,
      messages: [{ role: 'user', content: contentParts }],
      temperature: 0.3,
      max_tokens: 1024
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Groq HTTP ${response.status}`);
    }
    
    const resJson    = await response.json();
    const outputText = resJson.choices?.[0]?.message?.content || '';
    const parsedData = cleanAndParseJSON(outputText);
    
    titleResult = parsedData?.title || '';
    descResult  = parsedData?.description || '';
    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }
  
  /* ─── MISTRAL ─── */
  else if (provider === 'mistral') {
    const model    = customModel || 'pixtral-large-latest';
    const endpoint = 'https://api.mistral.ai/v1/chat/completions';
    
    const contentParts = [{ type: 'text', text: systemInstructions }];
    if (base64Image) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: `data:${mimeType};base64,${base64Image}` }
      });
    }
    
    const payload = {
      model,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: contentParts }],
      temperature: 0.3
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Mistral HTTP ${response.status}`);
    }
    
    const resJson    = await response.json();
    const outputText = resJson.choices?.[0]?.message?.content || '';
    const parsedData = cleanAndParseJSON(outputText);
    
    titleResult = parsedData?.title || '';
    descResult  = parsedData?.description || '';
    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }
  
  /* ─── OPENAI ─── */
  else if (provider === 'openai') {
    const model    = customModel || 'gpt-4o-mini';
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    
    const contentParts = [{ type: 'text', text: systemInstructions }];
    if (base64Image) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: `data:${mimeType};base64,${base64Image}`, detail: 'auto' }
      });
    }
    
    const payload = {
      model,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: contentParts }],
      temperature: 0.3,
      max_tokens: 1024
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `OpenAI HTTP ${response.status}`);
    }
    
    const resJson    = await response.json();
    const outputText = resJson.choices?.[0]?.message?.content || '';
    const parsedData = cleanAndParseJSON(outputText);
    
    titleResult = parsedData?.title || '';
    descResult  = parsedData?.description || '';
    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }
  

  /* ─── OLLAMA (LOCAL LLM) ─── */
  else if (provider === 'ollama') {
    const model = customModel || 'llava';
    let baseUrl = apiKey.trim();
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    const endpoint = baseUrl + '/api/generate';
    
    const rawBase64 = base64Image.split(',')[1] || base64Image;
    
    // Get user settings
    const isSingle = document.getElementById('kw-single-switch')?.checked;
    const isDouble = document.getElementById('kw-double-switch')?.checked;
    
    let kwStyle = 'single words only (e.g., "sunset", "mountain", "ocean")';
    if (isDouble) kwStyle = 'two-word phrases only (e.g., "golden sunset", "blue ocean")';
    if (!isSingle && !isDouble) kwStyle = 'mix of single words and short phrases (max 2-3 words each)';
    
    // Get Adobe Stock category
    const adobeCats = ['Animals','Buildings and Architecture','Business','Drinks','The Environment','States of Mind','Food','Graphic Resources','Hobbies and Leisure','Industry','Landscapes','Lifestyle','People','Plants and Flowers','Culture and Religion','Science','Social Issues','Sports','Technology','Transport','Travel'];
    
    // Get Shutterstock categories
    const shutterCats = ['Abstract','Animals/Wildlife','Arts','Backgrounds/Textures','Beauty/Fashion','Buildings/Landmarks','Business/Finance','Celebrities','Education','Food and drink','Healthcare/Medical','Holidays','Industrial','Interiors','Miscellaneous','Nature','Objects','Parks/Outdoor','People','Religion','Science','Signs/Symbols','Sports/Recreation','Technology','Transportation','Vintage'];
    
    // Build a simpler, more direct prompt for local LLMs
    const customPromptEl = document.getElementById('custom-prompt-switch');
    const customPromptTextEl = document.getElementById('sidebar-custom-prompt');
    let extraInstruction = '';
    if (customPromptEl?.checked && customPromptTextEl?.value.trim()) {
      extraInstruction = `\nSPECIAL INSTRUCTION: ${customPromptTextEl.value.trim()}`;
    }
    
    const simplePrompt = `You are a stock photo SEO expert. Look at this image carefully and respond with ONLY a JSON object.${extraInstruction}

Rules:
- "title": exactly ${minTitle} to ${maxTitle} words, no punctuation, capitalize first letter
- "description": exactly ${minDesc} to ${maxDesc} words describing what you see
- "adobe_category": pick ONE from this list: ${adobeCats.join(', ')}
- "shutter_category1": pick ONE from: ${shutterCats.join(', ')}
- "shutter_category2": pick ONE different from: ${shutterCats.join(', ')}
- "keywords": array of exactly ${minKeys} to ${maxKeys} ${kwStyle}, all lowercase

Respond with ONLY this JSON, nothing else:
{"title":"...","description":"...","adobe_category":"...","shutter_category1":"...","shutter_category2":"...","keywords":["word1","word2"]}`;

    const payload = {
      model: model,
      prompt: simplePrompt,
      stream: false,
      images: rawBase64 ? [rawBase64] : undefined
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ollama HTTP ${response.status}. Is it running?`);
    }
    
    const resJson = await response.json();
    const outputText = resJson.response || '';
    
    // Try to parse the JSON response
    let parsedData = null;
    try {
      parsedData = cleanAndParseJSON(outputText);
    } catch(e) {
      // Try to extract JSON from the response
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
    }
    
    if (parsedData) {
      titleResult = parsedData.title || '';
      descResult  = parsedData.description || '';
      tagsResult  = parsedData.keywords || [];
      
      // Build category string in the correct format
      const adobeCat  = parsedData.adobe_category || '';
      const shutCat1  = parsedData.shutter_category1 || '';
      const shutCat2  = parsedData.shutter_category2 || '';
      categoryResult  = shutCat2 ? `${adobeCat} & ${shutCat1}, ${shutCat2}` : `${adobeCat} & ${shutCat1}`;
    }
  }

  /* ─── OPENROUTER ─── */
  else if (provider === 'openrouter') {
    const model    = customModel;
    if (!model) {
      throw new Error("Please enter a Custom Model name in API Settings for OpenRouter (e.g. google/gemini-2.5-flash or moonshotai/kimi-k2.6:free)");
    }
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    
    const contentParts = [{ type: 'text', text: systemInstructions }];
    if (base64Image) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: `data:${mimeType};base64,${base64Image}` }
      });
    }
    
    const payload = {
      model,
      messages: [{ role: 'user', content: contentParts }],
      temperature: 0.3,
      max_tokens: 1024
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://skillitbd.com',
        'X-Title': 'SKILL ITBD Stock Metadata Generator'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `OpenRouter HTTP ${response.status}`);
    }
    
    const resJson    = await response.json();
    const outputText = resJson.choices?.[0]?.message?.content || '';
    const parsedData = cleanAndParseJSON(outputText);
    
    titleResult = parsedData?.title || '';
    descResult  = parsedData?.description || '';
    categoryResult = parsedData?.category || '';
    tagsResult  = parsedData?.keywords || [];
  }
  
  else {
    throw new Error(`Provider "${provider}" is not supported.`);
  }
  
      // Return only if we have valid content
      if (titleResult && descResult && Array.isArray(tagsResult) && tagsResult.length > 0) {
        return {
          title: titleResult,
          desc:  descResult,
          category: categoryResult,
          tags:  tagsResult
        };
      }
    } catch (err) {
      console.warn(`[${provider}] Key ${keyIndex + 1}/${activeKeys.length} failed:`, err.message);
      lastError = err;
      if (keyIndex < activeKeys.length - 1) {
        showToast(`API Key ${keyIndex + 1} failed. Falling back to next key...`, 'warning');
      }
    }
  } // End of activeKeys loop
  
  if (lastError) throw lastError;
  return null;
}

async function generateRealAIMetadata(fileObj) {
  let providerToTry = activeApiProvider;
  
  // If the active provider has already failed in this batch/session, bypass it immediately
  if (failedProviders.has(providerToTry)) {
    const backupProviders = Object.keys(apiKeysStore).filter(
      p => !failedProviders.has(p) && apiKeysStore[p]?.keys?.length > 0
    );
    if (backupProviders.length > 0) {
      providerToTry = backupProviders[0];
      
      // Update active provider globally
      activeApiProvider = providerToTry;
      localStorage.setItem('active_api_provider', activeApiProvider);
      
      // Sync UI radio checked
      const radio = document.querySelector(`input[name="ai-provider-select"][value="${providerToTry}"]`);
      if (radio) radio.checked = true;
    } else {
      // No working backup keys at all
      fileObj.aiStatus = 'failed';
      showToast("All stored Vision AI keys failed. Falling back to local simulator.", "error");
      return false;
    }
  }

  // Try providerToTry first
  try {
    const activeKeys = apiKeysStore[providerToTry]?.keys || [];
    if (activeKeys.length > 0) {
      const result = await executeSingleProviderApiCall(fileObj, providerToTry);
      if (result) {
        fileObj.metadata.title = result.title;
        fileObj.metadata.desc = result.desc;
        fileObj.metadata.category = result.category || '';
        fileObj.metadata.tags = result.tags;
        fileObj.aiStatus = 'success';
        return true;
      }
    }
  } catch (err) {
    console.warn(`Primary Provider ${providerToTry.toUpperCase()} failed: `, err);
    showToast(`${providerToTry.toUpperCase()} key error: ${err.message}`, "warning");
    failedProviders.add(providerToTry);
  }
  
  // FAILOVER TRIGGER! Scan other providers with stored keys, excluding known failed ones
  const fallbackProviders = Object.keys(apiKeysStore).filter(
    p => !failedProviders.has(p) && apiKeysStore[p]?.keys?.length > 0
  );
  
  if (fallbackProviders.length > 0) {
    showToast(`${providerToTry.toUpperCase()} key failed. Instantly auto-switching to stored failover key...`, "warning");
    
    for (const backupProvider of fallbackProviders) {
      try {
        showToast(`Attempting to generate with backup provider ${backupProvider.toUpperCase()}...`, "info");
        
        const result = await executeSingleProviderApiCall(fileObj, backupProvider);
        if (result) {
          fileObj.metadata.title = result.title;
          fileObj.metadata.desc = result.desc;
        fileObj.metadata.category = result.category || '';
          fileObj.metadata.tags = result.tags;
          fileObj.aiStatus = 'success';
          
          // Switch active provider to this working backup provider!
          activeApiProvider = backupProvider;
          localStorage.setItem('active_api_provider', activeApiProvider);
          
          // Sync UI radio checked
          const radio = document.querySelector(`input[name="ai-provider-select"][value="${backupProvider}"]`);
          if (radio) radio.checked = true;
          
          showToast(`Successfully recovered SEO metadata using backup ${backupProvider.toUpperCase()}!`, "success");
          return true;
        }
      } catch (err) {
        console.warn(`Fallback Provider ${backupProvider.toUpperCase()} failed: `, err);
        showToast(`Fallback ${backupProvider.toUpperCase()} key error: ${err.message}`, "error");
        failedProviders.add(backupProvider);
      }
    }
  }
  
  // If everything failed — leave metadata empty
  fileObj.aiStatus = 'failed';
  showToast("All Vision AI API calls failed. Please check your API keys.", "error");
  return false;
}

window.regenerateCurrentMetadata = async function() {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  const anyKeysStored = Object.keys(apiKeysStore).some(p => apiKeysStore[p]?.keys?.length > 0);
  
  if (!anyKeysStored) {
    showToast("No API keys stored. Please add a key in the API Keys panel.", "error");
    return;
  }
  
  // Reset failed providers set for a fresh run
  failedProviders.clear();
  
  showToast(`Contacting real ${activeApiProvider.toUpperCase()} Vision AI...`, 'success');
  setWorkspaceLoading(true);
  
  const success = await generateRealAIMetadata(currentFile);
  
  setWorkspaceLoading(false);
  
  if (success) {
    showToast("SEO Metadata successfully created using real Vision AI!", "success");
  } else {
    // Real AI failed — clear metadata and leave fields empty
    currentFile.metadata.title = '';
    currentFile.metadata.desc = ''; currentFile.metadata.category = '';
    currentFile.metadata.tags = [];
    showToast("Vision AI API call failed. Fields left empty — please check your API key.", "error");
  }
  
  renderQueueSidebar();
  loadWorkspaceData(currentFile);
};

function setWorkspaceLoading(loading) {
  isApiLoading = loading;
  const preview = document.getElementById('preview-container');
  
  if (loading) {
    if (preview) {
      preview.setAttribute('data-old-content', preview.innerHTML);
      preview.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size:40px;color:var(--color-cyan);"></i>
          <span style="font-size:12px;font-weight:600;color:var(--color-cyan);">AI is analyzing image details...</span>
        </div>
      `;
    }
  }
}


/* ==========================================================================
   METADATA MOCK VISION SIMULATOR (FALLBACK)
   ========================================================================== */
function extractDescriptiveKeywords(promptText) {
  if (!promptText) return [];
  const stopWords = new Set([
    "the", "and", "a", "of", "to", "in", "is", "for", "on", "with", "this", "my", "your", 
    "i", "want", "please", "generate", "seo", "metadata", "keywords", "tags", "title", 
    "description", "make", "it", "feel", "look", "should", "be", "have", "has", "some", 
    "any", "all", "more", "like", "how", "ami", "je", "bolcilm", "kotha", "ay", "jage", 
    "amr", "nijer", "promts", "promt", "prompt", "prompts", "dite", "cay", "jate", "local",
    "vision", "bujte", "pare", "ar", "na", "prle", "real", "api", "key", "kemon", "cacci",
    "dewa", "sathe", "kono", "mil", "ace", "nai", "taina", "ata", "thik", "koro", "please",
    "add", "give", "me", "show", "so", "that", "you", "are", "make", "illustrator",
    "vector", "illustration", "seo", "art", "design", "korci", "er", "jnno", "agula",
    "moddhe", "beshir", "bhag", "hoice", "gula", "bag", "hoce", "hobe", "shob", "thik"
  ]);
  
  const words = promptText.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .split(/\s+/);
    
  const cleanWords = [];
  words.forEach(w => {
    const word = w.trim();
    if (word.length > 2 && !stopWords.has(word) && isNaN(word)) {
      if (!cleanWords.includes(word)) {
        cleanWords.push(word);
      }
    }
  });
  return cleanWords;
}

function generateMockAIMetadata(fileObj) {
  const fileName = fileObj.name.toLowerCase();
  
  let matchKey = "";
  Object.keys(stockSubjectDictionary).forEach(key => {
    if (fileName.includes(key)) {
      matchKey = key;
    }
  });
  
  let resultTitle = "";
  let resultDesc = "";
  let resultTags = [];
  
  if (matchKey && stockSubjectDictionary[matchKey]) {
    const entry = stockSubjectDictionary[matchKey];
    resultTitle = entry.title;
    resultDesc = entry.desc;
    resultTags = [...entry.tags];
  } else {
    let cleanName = fileObj.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    resultTitle = `Premium Creative Stock Photo of ${cleanName} Concept Shot`;
    resultDesc = `High quality commercial stock asset depicting a scenic elegant view of ${cleanName} for marketing, editorial publications, or digital media design.`;
    
    let nameWords = cleanName.toLowerCase().split(" ").filter(w => w.length > 2);
    resultTags = [...nameWords];
    
    // Safely pad with loop guards (Infinite Loop Fixed completely)
    let safetyCounter = 0;
    while (resultTags.length < 32 && safetyCounter < 150) {
      safetyCounter++;
      const randTag = genericStockKeywords[Math.floor(Math.random() * genericStockKeywords.length)];
      if (!resultTags.includes(randTag)) {
        resultTags.push(randTag);
      }
    }
  }
  
  // Apply Custom Prompt instructions if enabled
  const customPromptEl = document.getElementById('custom-prompt-switch');
  const customPromptTextEl = document.getElementById('sidebar-custom-prompt');
  let customKeywords = [];
  if (customPromptEl && customPromptEl.checked && customPromptTextEl && customPromptTextEl.value.trim()) {
    const rawInstruction = customPromptTextEl.value.trim().toLowerCase();
    
    // Parse negative instructions: "do not write X in title", "remove X from title", "no X in title"
    const noInTitleMatch = rawInstruction.match(/(?:do not write|remove|no|don't write|dont write)\s+(.+?)\s+(?:in|from|on)\s+(?:the\s+)?title/i);
    if (noInTitleMatch) {
      const phraseToRemove = noInTitleMatch[1].trim();
      // Remove matching words from the title (case-insensitive)
      const wordsToRemove = phraseToRemove.split(/\s+/);
      let titleParts = resultTitle.split(' ');
      wordsToRemove.forEach(word => {
        titleParts = titleParts.filter(w => w.toLowerCase() !== word.toLowerCase());
      });
      resultTitle = titleParts.join(' ').replace(/\s{2,}/g, ' ').trim();
    }
    
    // Parse negative instructions for description
    const noInDescMatch = rawInstruction.match(/(?:do not write|remove|no|don't write|dont write)\s+(.+?)\s+(?:in|from|on)\s+(?:the\s+)?desc(?:ription)?/i);
    if (noInDescMatch) {
      const phraseToRemove = noInDescMatch[1].trim();
      const wordsToRemove = phraseToRemove.split(/\s+/);
      let descParts = resultDesc.split(' ');
      wordsToRemove.forEach(word => {
        descParts = descParts.filter(w => w.toLowerCase() !== word.toLowerCase());
      });
      resultDesc = descParts.join(' ').replace(/\s{2,}/g, ' ').trim();
    }
    
    // Extract positive descriptive keywords and inject them
    customKeywords = extractDescriptiveKeywords(rawInstruction);
    if (customKeywords.length > 0) {
      // Prepend user custom prompt keywords so they have higher priority
      resultTags = [...customKeywords, ...resultTags];
      
      // Only inject themes into title/desc if NO negative instruction detected
      if (!noInTitleMatch) {
        const themes = customKeywords.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        if (themes) resultTitle = `${resultTitle} ${themes}`;
      }
      
      const themesDesc = customKeywords.slice(0, 3).join(", ");
      if (themesDesc && !noInDescMatch) {
        resultDesc = `${resultDesc} Designed with focus on ${themesDesc}.`;
      }
    }
  }
  
  // Apply Transparent Background switch details if enabled
  const transparentBgEl = document.getElementById('transparent-bg-switch');
  const isTransparentBg = transparentBgEl ? transparentBgEl.checked : false;
  if (isTransparentBg) {
    resultTags.unshift("transparent background", "isolated", "png", "vector", "cutout", "no background");
    resultTitle = `${resultTitle} Isolated on Transparent Background`;
    resultDesc = `${resultDesc} Premium asset isolated on a transparent background for easy design integration.`;
  }
  
  // Deduplicate tags
  resultTags = [...new Set(resultTags)];
  
  const silhouetteEl = document.getElementById('silhouette-switch');
  const isSilhouetteActive = silhouetteEl ? silhouetteEl.checked : false;
  if (isSilhouetteActive && !resultTags.includes("silhouette")) {
    resultTags.push("silhouette", "shadow", "outline", "contrast");
    resultTitle = resultTitle + " with Silhouette outline";
  }
  
  const minTitleWords = getSliderLimit('min-title');
  const maxTitleWords = getSliderLimit('max-title');
  const minDescWords = getSliderLimit('min-desc');
  const maxDescWords = getSliderLimit('max-desc');
  
  let titleWords = resultTitle.split(" ");
  if (titleWords.length > maxTitleWords) {
    resultTitle = titleWords.slice(0, maxTitleWords).join(" ");
  } else if (titleWords.length < minTitleWords) {
    let titleSafety = 0;
    while (titleWords.length < minTitleWords && titleSafety < 50) {
      titleSafety++;
      titleWords.push("Background");
    }
    resultTitle = titleWords.join(" ");
  }
  
  let descWords = resultDesc.split(" ");
  if (descWords.length > maxDescWords) {
    resultDesc = descWords.slice(0, maxDescWords).join(" ");
  } else if (descWords.length < minDescWords) {
    let descSafety = 0;
    while (descWords.length < minDescWords && descSafety < 100) {
      descSafety++;
      descWords.push("for commercial advertisement.");
    }
    resultDesc = descWords.join(" ");
  }
  
  fileObj.metadata.title = resultTitle;
  fileObj.metadata.desc = resultDesc;
  fileObj.metadata.category = result.category || '';
  fileObj.metadata.tags = resultTags;
}


/* ==========================================================================
   WORKSPACE UI RENDERING & VALIDATIONS
   ========================================================================== */
async function generateRealAIMetadata(fileObj) {
  let providerToTry = activeApiProvider;
  
  // If the active provider has already failed in this batch/session, bypass it immediately
  if (failedProviders.has(providerToTry)) {
    const backupProviders = Object.keys(apiKeysStore).filter(
      p => !failedProviders.has(p) && apiKeysStore[p]?.keys?.length > 0
    );
    if (backupProviders.length > 0) {
      providerToTry = backupProviders[0];
      
      // Update active provider globally
      activeApiProvider = providerToTry;
      localStorage.setItem('active_api_provider', activeApiProvider);
      
      // Sync UI radio checked
      const radio = document.querySelector(`input[name="ai-provider-select"][value="${providerToTry}"]`);
      if (radio) radio.checked = true;
    } else {
      // No working backup keys at all
      fileObj.aiStatus = 'failed';
      showToast("All stored Vision AI keys failed. Falling back to local simulator.", "error");
      return false;
    }
  }

  // Try providerToTry first
  try {
    const activeKeys = apiKeysStore[providerToTry]?.keys || [];
    if (activeKeys.length > 0) {
      const result = await executeSingleProviderApiCall(fileObj, providerToTry);
      if (result) {
        fileObj.metadata.title = result.title;
        fileObj.metadata.desc = result.desc;
        fileObj.metadata.category = result.category || '';
        fileObj.metadata.tags = result.tags;
        fileObj.aiStatus = 'success';
        return true;
      }
    }
  } catch (err) {
    console.warn(`Primary Provider ${providerToTry.toUpperCase()} failed: `, err);
    showToast(`${providerToTry.toUpperCase()} key error: ${err.message}`, "warning");
    failedProviders.add(providerToTry);
  }
  
  // FAILOVER TRIGGER! Scan other providers with stored keys, excluding known failed ones
  const fallbackProviders = Object.keys(apiKeysStore).filter(
    p => !failedProviders.has(p) && apiKeysStore[p]?.keys?.length > 0
  );
  
  if (fallbackProviders.length > 0) {
    showToast(`${providerToTry.toUpperCase()} key failed. Instantly auto-switching to stored failover key...`, "warning");
    
    for (const backupProvider of fallbackProviders) {
      try {
        showToast(`Attempting to generate with backup provider ${backupProvider.toUpperCase()}...`, "info");
        
        const result = await executeSingleProviderApiCall(fileObj, backupProvider);
        if (result) {
          fileObj.metadata.title = result.title;
          fileObj.metadata.desc = result.desc;
        fileObj.metadata.category = result.category || '';
          fileObj.metadata.tags = result.tags;
          fileObj.aiStatus = 'success';
          
          // Switch active provider to this working backup provider!
          activeApiProvider = backupProvider;
          localStorage.setItem('active_api_provider', activeApiProvider);
          
          // Sync UI radio checked
          const radio = document.querySelector(`input[name="ai-provider-select"][value="${backupProvider}"]`);
          if (radio) radio.checked = true;
          
          showToast(`Successfully recovered SEO metadata using backup ${backupProvider.toUpperCase()}!`, "success");
          return true;
        }
      } catch (err) {
        console.warn(`Fallback Provider ${backupProvider.toUpperCase()} failed: `, err);
        showToast(`Fallback ${backupProvider.toUpperCase()} key error: ${err.message}`, "error");
        failedProviders.add(backupProvider);
      }
    }
  }
  
  // If everything failed — leave metadata empty
  fileObj.aiStatus = 'failed';
  showToast("All Vision AI API calls failed. Please check your API keys.", "error");
  return false;
}

window.regenerateCurrentMetadata = async function() {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  const anyKeysStored = Object.keys(apiKeysStore).some(p => apiKeysStore[p]?.keys?.length > 0);
  
  if (!anyKeysStored) {
    showToast("No API keys stored. Please add a key in the API Keys panel.", "error");
    return;
  }
  
  // Reset failed providers set for a fresh run
  failedProviders.clear();
  
  showToast(`Contacting real ${activeApiProvider.toUpperCase()} Vision AI...`, 'success');
  setWorkspaceLoading(true);
  
  const success = await generateRealAIMetadata(currentFile);
  
  setWorkspaceLoading(false);
  
  if (success) {
    showToast("SEO Metadata successfully created using real Vision AI!", "success");
  } else {
    // Real AI failed — clear metadata and leave fields empty
    currentFile.metadata.title = '';
    currentFile.metadata.desc = ''; currentFile.metadata.category = '';
    currentFile.metadata.tags = [];
    showToast("Vision AI API call failed. Fields left empty — please check your API key.", "error");
  }
  
  renderQueueSidebar();
  loadWorkspaceData(currentFile);
};

function setWorkspaceLoading(loading) {
  isApiLoading = loading;
  const preview = document.getElementById('preview-container');
  
  if (loading) {
    if (preview) {
      preview.setAttribute('data-old-content', preview.innerHTML);
      preview.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size:40px;color:var(--color-cyan);"></i>
          <span style="font-size:12px;font-weight:600;color:var(--color-cyan);">AI is analyzing image details...</span>
        </div>
      `;
    }
  }
}


/* ==========================================================================
   METADATA MOCK VISION SIMULATOR (FALLBACK)
   ========================================================================== */
function extractDescriptiveKeywords(promptText) {
  if (!promptText) return [];
  const stopWords = new Set([
    "the", "and", "a", "of", "to", "in", "is", "for", "on", "with", "this", "my", "your", 
    "i", "want", "please", "generate", "seo", "metadata", "keywords", "tags", "title", 
    "description", "make", "it", "feel", "look", "should", "be", "have", "has", "some", 
    "any", "all", "more", "like", "how", "ami", "je", "bolcilm", "kotha", "ay", "jage", 
    "amr", "nijer", "promts", "promt", "prompt", "prompts", "dite", "cay", "jate", "local",
    "vision", "bujte", "pare", "ar", "na", "prle", "real", "api", "key", "kemon", "cacci",
    "dewa", "sathe", "kono", "mil", "ace", "nai", "taina", "ata", "thik", "koro", "please",
    "add", "give", "me", "show", "so", "that", "you", "are", "make", "illustrator",
    "vector", "illustration", "seo", "art", "design", "korci", "er", "jnno", "agula",
    "moddhe", "beshir", "bhag", "hoice", "gula", "bag", "hoce", "hobe", "shob", "thik"
  ]);
  
  const words = promptText.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .split(/\s+/);
    
  const cleanWords = [];
  words.forEach(w => {
    const word = w.trim();
    if (word.length > 2 && !stopWords.has(word) && isNaN(word)) {
      if (!cleanWords.includes(word)) {
        cleanWords.push(word);
      }
    }
  });
  return cleanWords;
}

function generateMockAIMetadata(fileObj) {
  const fileName = fileObj.name.toLowerCase();
  
  let matchKey = "";
  Object.keys(stockSubjectDictionary).forEach(key => {
    if (fileName.includes(key)) {
      matchKey = key;
    }
  });
  
  let resultTitle = "";
  let resultDesc = "";
  let resultTags = [];
  
  if (matchKey && stockSubjectDictionary[matchKey]) {
    const entry = stockSubjectDictionary[matchKey];
    resultTitle = entry.title;
    resultDesc = entry.desc;
    resultTags = [...entry.tags];
  } else {
    let cleanName = fileObj.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    resultTitle = `Premium Creative Stock Photo of ${cleanName} Concept Shot`;
    resultDesc = `High quality commercial stock asset depicting a scenic elegant view of ${cleanName} for marketing, editorial publications, or digital media design.`;
    
    let nameWords = cleanName.toLowerCase().split(" ").filter(w => w.length > 2);
    resultTags = [...nameWords];
    
    // Safely pad with loop guards (Infinite Loop Fixed completely)
    let safetyCounter = 0;
    while (resultTags.length < 32 && safetyCounter < 150) {
      safetyCounter++;
      const randTag = genericStockKeywords[Math.floor(Math.random() * genericStockKeywords.length)];
      if (!resultTags.includes(randTag)) {
        resultTags.push(randTag);
      }
    }
  }
  
  // Apply Custom Prompt instructions if enabled
  const customPromptEl = document.getElementById('custom-prompt-switch');
  const customPromptTextEl = document.getElementById('sidebar-custom-prompt');
  let customKeywords = [];
  if (customPromptEl && customPromptEl.checked && customPromptTextEl && customPromptTextEl.value.trim()) {
    const rawInstruction = customPromptTextEl.value.trim().toLowerCase();
    
    // Parse negative instructions: "do not write X in title", "remove X from title", "no X in title"
    const noInTitleMatch = rawInstruction.match(/(?:do not write|remove|no|don't write|dont write)\s+(.+?)\s+(?:in|from|on)\s+(?:the\s+)?title/i);
    if (noInTitleMatch) {
      const phraseToRemove = noInTitleMatch[1].trim();
      // Remove matching words from the title (case-insensitive)
      const wordsToRemove = phraseToRemove.split(/\s+/);
      let titleParts = resultTitle.split(' ');
      wordsToRemove.forEach(word => {
        titleParts = titleParts.filter(w => w.toLowerCase() !== word.toLowerCase());
      });
      resultTitle = titleParts.join(' ').replace(/\s{2,}/g, ' ').trim();
    }
    
    // Parse negative instructions for description
    const noInDescMatch = rawInstruction.match(/(?:do not write|remove|no|don't write|dont write)\s+(.+?)\s+(?:in|from|on)\s+(?:the\s+)?desc(?:ription)?/i);
    if (noInDescMatch) {
      const phraseToRemove = noInDescMatch[1].trim();
      const wordsToRemove = phraseToRemove.split(/\s+/);
      let descParts = resultDesc.split(' ');
      wordsToRemove.forEach(word => {
        descParts = descParts.filter(w => w.toLowerCase() !== word.toLowerCase());
      });
      resultDesc = descParts.join(' ').replace(/\s{2,}/g, ' ').trim();
    }
    
    // Extract positive descriptive keywords and inject them
    customKeywords = extractDescriptiveKeywords(rawInstruction);
    if (customKeywords.length > 0) {
      // Prepend user custom prompt keywords so they have higher priority
      resultTags = [...customKeywords, ...resultTags];
      
      // Only inject themes into title/desc if NO negative instruction detected
      if (!noInTitleMatch) {
        const themes = customKeywords.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        if (themes) resultTitle = `${resultTitle} ${themes}`;
      }
      
      const themesDesc = customKeywords.slice(0, 3).join(", ");
      if (themesDesc && !noInDescMatch) {
        resultDesc = `${resultDesc} Designed with focus on ${themesDesc}.`;
      }
    }
  }
  
  // Apply Transparent Background switch details if enabled
  const transparentBgEl = document.getElementById('transparent-bg-switch');
  const isTransparentBg = transparentBgEl ? transparentBgEl.checked : false;
  if (isTransparentBg) {
    resultTags.unshift("transparent background", "isolated", "png", "vector", "cutout", "no background");
    resultTitle = `${resultTitle} Isolated on Transparent Background`;
    resultDesc = `${resultDesc} Premium asset isolated on a transparent background for easy design integration.`;
  }
  
  // Deduplicate tags
  resultTags = [...new Set(resultTags)];
  
  const silhouetteEl = document.getElementById('silhouette-switch');
  const isSilhouetteActive = silhouetteEl ? silhouetteEl.checked : false;
  if (isSilhouetteActive && !resultTags.includes("silhouette")) {
    resultTags.push("silhouette", "shadow", "outline", "contrast");
    resultTitle = resultTitle + " with Silhouette outline";
  }
  
  const minTitleWords = getSliderLimit('min-title');
  const maxTitleWords = getSliderLimit('max-title');
  const minDescWords = getSliderLimit('min-desc');
  const maxDescWords = getSliderLimit('max-desc');
  
  let titleWords = resultTitle.split(" ");
  if (titleWords.length > maxTitleWords) {
    resultTitle = titleWords.slice(0, maxTitleWords).join(" ");
  } else if (titleWords.length < minTitleWords) {
    let titleSafety = 0;
    while (titleWords.length < minTitleWords && titleSafety < 50) {
      titleSafety++;
      titleWords.push("Background");
    }
    resultTitle = titleWords.join(" ");
  }
  
  let descWords = resultDesc.split(" ");
  if (descWords.length > maxDescWords) {
    resultDesc = descWords.slice(0, maxDescWords).join(" ");
  } else if (descWords.length < minDescWords) {
    let descSafety = 0;
    while (descWords.length < minDescWords && descSafety < 100) {
      descSafety++;
      descWords.push("for commercial advertisement.");
    }
    resultDesc = descWords.join(" ");
  }
  
  fileObj.metadata.title = resultTitle;
  fileObj.metadata.desc = resultDesc;
  fileObj.metadata.category = result.category || '';
  fileObj.metadata.tags = resultTags;
}


/* ==========================================================================
   WORKSPACE UI RENDERING & VALIDATIONS
   ========================================================================== */
function loadWorkspaceData(fileObj) {
  if (isApiLoading) return;
  
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    if (fileObj.previewUrl && fileObj.type.startsWith('image/')) {
      previewContainer.innerHTML = `<img src="${fileObj.previewUrl}" class="preview-media" alt="preview">`;
    } else if (fileObj.previewUrl && fileObj.type.startsWith('video/')) {
      previewContainer.innerHTML = `<video src="${fileObj.previewUrl}" class="preview-media" controls autoplay muted loop></video>`;
    } else {
      previewContainer.innerHTML = `
        <div class="preview-placeholder">
          <i class="fa-solid fa-file-invoice" style="font-size:48px;color:var(--color-cyan);"></i>
          <span style="font-size:12px;font-weight:600;">Vector Artwork File (No Preview)</span>
        </div>
      `;
    }
  }
  
  updateExifUI(fileObj);
  
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceDesc = document.getElementById('workspace-desc');
  if (workspaceTitle) workspaceTitle.value = fileObj.metadata.title;
  if (workspaceDesc) workspaceDesc.value = fileObj.metadata.desc;
  const workspaceCategory = document.getElementById('workspace-category');
  if (workspaceCategory) workspaceCategory.value = fileObj.metadata.category;
  
  applyMetadataFiltersAndRender();
  updateWordCounters();
}

function updateExifUI(fileObj) {
  const nameEl = document.getElementById('exif-filename');
  const resEl = document.getElementById('exif-resolution');
  const typeEl = document.getElementById('exif-type');
  const sizeEl = document.getElementById('exif-size');
  const camEl = document.getElementById('exif-camera');
  const expEl = document.getElementById('exif-exposure');
  
  if (nameEl) { nameEl.innerText = fileObj.name; nameEl.title = fileObj.name; }
  if (resEl) resEl.innerText = fileObj.exif.resolution;
  if (typeEl) typeEl.innerText = fileObj.exif.type;
  if (sizeEl) sizeEl.innerText = fileObj.size;
  if (camEl) camEl.innerText = fileObj.exif.camera;
  if (expEl) expEl.innerText = fileObj.exif.exposure;
}

function saveCurrentWorkspaceState() {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceDesc = document.getElementById('workspace-desc');
  
  const titleVal = workspaceTitle ? workspaceTitle.value.trim() : "";
  const descVal = workspaceDesc ? workspaceDesc.value.trim() : "";
  
  currentFile.metadata.title = titleVal;
  currentFile.metadata.desc = descVal;
  const workspaceCategory = document.getElementById('workspace-category');
  currentFile.metadata.category = workspaceCategory ? workspaceCategory.value.trim() : '';
}

function updateWordCounters() {
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceDesc = document.getElementById('workspace-desc');
  
  const title = workspaceTitle ? workspaceTitle.value.trim() : "";
  const desc = workspaceDesc ? workspaceDesc.value.trim() : "";
  
  const titleWords = title ? title.split(/\s+/).length : 0;
  const descWords = desc ? desc.split(/\s+/).length : 0;
  
  const minTitle = getSliderLimit('min-title');
  const maxTitle = getSliderLimit('max-title');
  const minDesc = getSliderLimit('min-desc');
  const maxDesc = getSliderLimit('max-desc');
  
  const titleCounter = document.getElementById('title-counter');
  const descCounter = document.getElementById('desc-counter');
  
  if (titleCounter) {
    titleCounter.innerText = `${titleWords} words (Limit: ${minTitle}-${maxTitle})`;
    if (titleWords < minTitle || titleWords > maxTitle) titleCounter.classList.add('error');
    else titleCounter.classList.remove('error');
  }
  
  if (descCounter) {
    descCounter.innerText = `${descWords} words (Limit: ${minDesc}-${maxDesc})`;
    if (descWords < minDesc || descWords > maxDesc) descCounter.classList.add('error');
    else descCounter.classList.remove('error');
  }
}

function initWorkspaceInputListeners() {
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceDesc = document.getElementById('workspace-desc');
  if (workspaceTitle) workspaceTitle.addEventListener('input', updateWordCounters);
  if (workspaceDesc) workspaceDesc.addEventListener('input', updateWordCounters);
  
  const tagInput = document.getElementById('tag-input');
  const tagsWrapper = document.getElementById('tags-wrapper');

  if (tagInput && tagsWrapper) {
    tagsWrapper.addEventListener('click', () => tagInput.focus());
    
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = tagInput.value.trim().replace(/,/g, "");
        
        if (val) {
          addNewKeywordTag(val);
          tagInput.value = "";
        }
      }
    });
  }
}

function validateCurrentMetadataLimits() {
  updateWordCounters();
  if (activeQueueIndex >= 0 && fileQueue.length > 0) {
    const currentFile = fileQueue[activeQueueIndex];
    renderKeywordTags(currentFile.metadata.tags);
  }
}


/* ==========================================================================
   TAG CHIPS EDITOR MANAGER
   ========================================================================== */
function renderKeywordTags(tags) {
  const chips = document.querySelectorAll('.tag-chip');
  chips.forEach(c => c.remove());
  
  const minKeys = getSliderLimit('min-keys');
  const maxKeys = getSliderLimit('max-keys');
  
  const tagsWrapper = document.getElementById('tags-wrapper');
  const tagInput = document.getElementById('tag-input');
  
  if (!tagsWrapper || !tagInput) return;
  
  tags.forEach(tag => {
    const chip = document.createElement('div');
    chip.className = 'tag-chip';
    chip.innerHTML = `
      <span>${tag}</span>
      <span class="tag-chip-remove" onclick="removeKeywordTag('${tag}')"><i class="fa-solid fa-xmark"></i></span>
    `;
    tagsWrapper.insertBefore(chip, tagInput);
  });
  
  const counter = document.getElementById('keys-counter');
  if (counter) {
    counter.innerText = `${tags.length}/${maxKeys} tags (Min: ${minKeys})`;
    if (tags.length < minKeys || tags.length > maxKeys) counter.classList.add('error');
    else counter.classList.remove('error');
  }
}

function addNewKeywordTag(word) {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  let cleanWord = word.trim().toLowerCase();
  
  const singleWordEl = document.getElementById('kw-single-switch');
  const singleWordOnly = singleWordEl ? singleWordEl.checked : false;
  
  if (singleWordOnly && cleanWord.includes(" ")) {
    const terms = cleanWord.split(" ");
    terms.forEach(t => addNewKeywordTag(t));
    return;
  }
  
  if (cleanWord.length <= 1) return;
  
  const maxKeys = getSliderLimit('max-keys');
  if (currentFile.metadata.tags.length >= maxKeys) {
    showToast(`Maximum limit of ${maxKeys} keywords reached!`, 'warning');
    return;
  }
  
  if (currentFile.metadata.tags.includes(cleanWord)) {
    showToast("Keyword is already present", "warning");
    return;
  }
  
  currentFile.metadata.tags.push(cleanWord);
  applyPlatformRules();
}

window.removeKeywordTag = function(word) {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  const wordIdx = currentFile.metadata.tags.indexOf(word);
  if (wordIdx >= 0) {
    currentFile.metadata.tags.splice(wordIdx, 1);
  }
  
  applyPlatformRules();
};

function applyMetadataFiltersAndRender() {
  if (activeQueueIndex < 0 || fileQueue.length === 0) return;
  const currentFile = fileQueue[activeQueueIndex];
  
  let tags = [...currentFile.metadata.tags];
  
  const singleWordEl = document.getElementById('kw-single-switch');
  const singleWordOnly = singleWordEl ? singleWordEl.checked : false;
  if (singleWordOnly) {
    let processedTags = [];
    tags.forEach(t => {
      const splitTerms = t.replace(/[-]/g, " ").split(" ");
      splitTerms.forEach(term => {
        const cleanTerm = term.trim().toLowerCase();
        if (cleanTerm.length > 2 && !processedTags.includes(cleanTerm)) {
          processedTags.push(cleanTerm);
        }
      });
    });
    tags = processedTags;
  }
  
  const maxKeywords = getSliderLimit('max-keys');
  tags = tags.slice(0, maxKeywords);
  
  currentFile.metadata.tags = tags;
  renderKeywordTags(tags);
}


/* ==========================================================================
   COPY TO CLIPBOARD UTILITIES
   ========================================================================== */



/* ==========================================================================
   MODAL DIALOG CONTROLLERS
   ========================================================================== */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
};


/* ==========================================================================
   SIMULATED GOOGLE AUTHENTICATION
   ========================================================================== */
function loadAuthState() {
  const savedUser = localStorage.getItem('google_auth_email');
  if (savedUser) {
    currentUser = savedUser;
    updateAuthUI();
  }
}

function initGoogleAuth() {
  const profileBtn = document.getElementById('profile-btn');
  const profileMenu = document.getElementById('profile-menu');
  const loginTriggerBtn = document.getElementById('login-trigger-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const googleAuthSubmitBtn = document.getElementById('google-auth-submit-btn');

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
      profileMenu.classList.remove('active');
    });
    
    profileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', () => {
      if (profileMenu) profileMenu.classList.remove('active');
      openModal('google-login-modal');
    });
  }
  
  if (googleAuthSubmitBtn) {
    googleAuthSubmitBtn.addEventListener('click', () => {
      const emailField = document.getElementById('google-email-field');
      const enteredEmail = emailField ? emailField.value.trim() : "";
      
      if (!enteredEmail || !enteredEmail.includes('@') || !enteredEmail.endsWith('.com')) {
        showToast("Please enter a valid Gmail address!", "error");
        return;
      }
      
      currentUser = enteredEmail;
      localStorage.setItem('google_auth_email', currentUser);
      showToast(`Logged in successfully as ${currentUser}!`, 'success');
      
      updateAuthUI();
      closeModal('google-login-modal');
    });
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('google_auth_email');
      showToast("Signed out successfully", "success");
      
      updateAuthUI();
      if (profileMenu) profileMenu.classList.remove('active');
    });
  }
}

function updateAuthUI() {
  const profileBtn = document.getElementById('profile-btn');
  const emailLabel = document.getElementById('profile-menu-email');
  const loginTriggerBtn = document.getElementById('login-trigger-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (!profileBtn) return;
  
  if (currentUser) {
    const initialLetter = currentUser.charAt(0).toUpperCase();
    profileBtn.innerText = initialLetter;
    profileBtn.title = currentUser;
    if (emailLabel) emailLabel.innerText = currentUser;
    if (loginTriggerBtn) loginTriggerBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'flex';
  } else {
    profileBtn.innerText = 'm';
    profileBtn.title = "Guest Account";
    if (emailLabel) emailLabel.innerText = "Guest User";
    if (loginTriggerBtn) loginTriggerBtn.style.display = 'flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}


/* ==========================================================================
   API KEYS MANAGER (User Screenshot Inspired)
   ========================================================================== */
function loadApiKeys() {
  const savedKeys = localStorage.getItem('api_keys_store');
  if (savedKeys) {
    const parsed = JSON.parse(savedKeys);
    // Merge parsed data into apiKeysStore (so new providers added in code are included)
    Object.keys(parsed).forEach(p => {
      if (apiKeysStore[p] !== undefined) {
        apiKeysStore[p] = parsed[p];
      }
    });

    // ── Model Migration: fix deprecated/removed model names ──
    const modelMigration = {
      'gemini': { old: ['gemini-1.5-pro'], newModel: 'gemini-2.0-flash' },
      'groq':   { old: ['meta-llama/llama-4-scout-17b-16e-instruct', 'llama-3.2-90b-vision-preview'], newModel: 'llama-3.2-11b-vision-preview' },
      'openrouter': { old: ['google/gemini-flash-1.5', 'google/gemini-1.5-flash:free'], newModel: 'moonshotai/kimi-k2.6:free' },
      'mistral': { old: ['pixtral-12b-2409'], newModel: 'pixtral-large-latest' }
    };

    let migrated = false;
    Object.entries(modelMigration).forEach(([provider, { old, newModel }]) => {
      if (apiKeysStore[provider] && old.includes(apiKeysStore[provider].customModel)) {
        console.log(`[Model Migration] ${provider}: "${apiKeysStore[provider].customModel}" → "${newModel}"`);
        apiKeysStore[provider].customModel = newModel;
        migrated = true;
      }
    });

    if (migrated) {
      localStorage.setItem('api_keys_store', JSON.stringify(apiKeysStore));
    }
  }
  
  const savedActiveProvider = localStorage.getItem('active_api_provider');
  if (savedActiveProvider) {
    activeApiProvider = savedActiveProvider;
    const radio = document.querySelector(`input[name="ai-provider-select"][value="${activeApiProvider}"]`);
    if (radio) radio.checked = true;
  }
}

function initApiManager() {
  const openApiBtn = document.getElementById('open-api-manager-btn');
  const profileMenu = document.getElementById('profile-menu');
  
  if (openApiBtn) {
    openApiBtn.addEventListener('click', () => {
      if (profileMenu) profileMenu.classList.remove('active');
      openModal('api-keys-modal');
      renderApiKeysModalWorkspace();
    });
  }
  
  const providerTabs = document.querySelectorAll('.api-provider-tab');
  providerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      providerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      activeApiProvider = tab.getAttribute('data-provider');
      selectedApiKeyIndex = -1;
      
      renderApiKeysModalWorkspace();
    });
  });
  
  const addBtn = document.getElementById('api-key-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const keyInput = document.getElementById('api-key-input');
      const keyVal = keyInput ? keyInput.value.trim() : "";
      
      if (!keyVal) {
        showToast(activeApiProvider === 'ollama' ? "Please enter the Ollama URL!" : "Please enter a valid API Key!", "error");
        return;
      }
      
      if (!apiKeysStore[activeApiProvider]) {
        apiKeysStore[activeApiProvider] = { keys: [], customModel: "" };
      }
      
      if (activeApiProvider === 'ollama') {
        // For Ollama, always replace the URL (only one URL needed)
        apiKeysStore[activeApiProvider].keys = [keyVal];
        showToast(`Ollama URL updated successfully!`, 'success');
      } else {
        apiKeysStore[activeApiProvider].keys.push(keyVal);
        showToast(`Added new key to ${activeApiProvider.toUpperCase()} provider list`, 'success');
      }
      
      if (keyInput) keyInput.value = "";
      renderApiKeysModalWorkspace();
    });
  }
  
  const deleteBtn = document.getElementById('api-key-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (selectedApiKeyIndex < 0) {
        showToast("Please select a stored API Key from the listbox to delete!", "warning");
        return;
      }
      
      const keysArray = apiKeysStore[activeApiProvider].keys;
      keysArray.splice(selectedApiKeyIndex, 1);
      
      selectedApiKeyIndex = -1;
      showToast(`Deleted selected API key`, 'success');
      renderApiKeysModalWorkspace();
    });
  }
  
  const customModelInput = document.getElementById('api-custom-model');
  if (customModelInput) {
    customModelInput.addEventListener('input', (e) => {
      if (apiKeysStore[activeApiProvider]) {
        apiKeysStore[activeApiProvider].customModel = e.target.value.trim();
      }
    });
  }
  
  const saveBtn = document.getElementById('api-keys-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const activeRadio = document.querySelector('input[name="ai-provider-select"]:checked');
      if (activeRadio) {
        activeApiProvider = activeRadio.value;
        localStorage.setItem('active_api_provider', activeApiProvider);
      }
      
      localStorage.setItem('api_keys_store', JSON.stringify(apiKeysStore));
      showToast("API Credentials saved successfully!", "success");
      closeModal('api-keys-modal');
    });
  }
}

function renderApiKeysModalWorkspace() {
  const container = document.getElementById('api-panel-content');
  if (!container) return;
  
  const providerData = apiKeysStore[activeApiProvider] || { keys: [], customModel: "" };
  
  document.querySelectorAll('.api-provider-tab').forEach(btn => {
    if (btn.getAttribute('data-provider') === activeApiProvider) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  const keyInput = document.getElementById('api-key-input');
  const customModelInput = document.getElementById('api-custom-model');
  const keyLabel = document.querySelector('.api-panel-content h4, .api-key-label');
  
  if (activeApiProvider === 'ollama') {
    if (keyInput) {
      keyInput.placeholder = 'Enter Ollama URL (e.g., http://192.168.0.8:11434)';
      keyInput.value = (providerData.keys && providerData.keys[0]) ? providerData.keys[0] : 'http://localhost:11434';
    }
    if (customModelInput) {
      customModelInput.placeholder = 'e.g., llava or llama3.2-vision';
      customModelInput.style.borderColor = 'var(--success)';
      customModelInput.value = providerData.customModel || 'llava';
    }
    const lbl = document.getElementById('api-key-label'); if (lbl) lbl.textContent = 'Local URL:';
    const slbl = document.getElementById('stored-keys-label'); if (slbl) slbl.textContent = 'Stored URLs:';
    const customModelLabel = document.getElementById('custom-model-label');
    const customModelHint  = document.getElementById('custom-model-hint');
    if (customModelLabel) { customModelLabel.textContent = '🤖 Vision Model Name:'; customModelLabel.style.color = 'var(--success)'; }
    if (customModelHint) customModelHint.innerHTML = 'Type the model name you downloaded. Default is <strong style="color:var(--success)">llava</strong>';
  } else {
    if (keyInput) {
      keyInput.placeholder = `Enter your ${activeApiProvider.toUpperCase()} API key here...`;
      keyInput.value = "";
    }
    const lbl = document.getElementById('api-key-label'); if (lbl) lbl.textContent = 'API Key:';
    const slbl = document.getElementById('stored-keys-label'); if (slbl) slbl.textContent = 'Stored API Keys:';
    const customModelLabel = document.getElementById('custom-model-label');
    const customModelHint  = document.getElementById('custom-model-hint');
    if (customModelInput) {
      customModelInput.value = providerData.customModel || '';
      customModelInput.style.borderColor = '';
      if (customModelLabel) { customModelLabel.textContent = '🤖 Custom Model (Optional):'; customModelLabel.style.color = ''; }
    }
    if (activeApiProvider === 'openrouter') {
      if (customModelInput) customModelInput.placeholder = 'e.g., google/gemini-2.5-flash';
      customModelInput.style.borderColor = '';
      if (customModelLabel) { customModelLabel.textContent = '🤖 Custom Model (Required):'; customModelLabel.style.color = ''; }
      if (customModelHint) customModelHint.innerHTML = 'Enter the model you want to use (e.g., <strong>google/gemini-2.5-flash</strong> or <strong>moonshotai/kimi-k2.6:free</strong>).';
    } else if (activeApiProvider === 'gemini') {
      if (customModelInput) customModelInput.placeholder = 'e.g., gemini-2.0-flash (default)';
      if (customModelHint) customModelHint.innerHTML = 'Leave empty to use <strong>gemini-2.0-flash</strong> by default.';
    } else {
      if (customModelInput) customModelInput.placeholder = 'Custom model name (optional)';
      if (customModelHint) customModelHint.innerHTML = 'Leave empty to use the default model.';
    }
  }
  
  const listbox = document.getElementById('stored-keys-listbox');
  if (!listbox) return;
  listbox.innerHTML = "";
  
  if (providerData.keys.length === 0) {
    listbox.innerHTML = `<div style="padding:10px;font-size:11px;color:var(--text-dark);text-align:center;">No API keys stored for this provider.</div>`;
  } else {
    providerData.keys.forEach((key, idx) => {
      const item = document.createElement('div');
      item.className = `keys-list-item ${idx === selectedApiKeyIndex ? 'selected' : ''}`;
      
      let maskedKey = "sk-...key";
      if (key.length > 12) {
        maskedKey = key.substring(0, 7) + "..." + key.substring(key.length - 4);
      } else {
        maskedKey = key.substring(0, 3) + "..." + key.substring(key.length - 2);
      }
      
      item.innerHTML = `
        <span>${maskedKey}</span>
        <span style="font-size:10px;color:var(--color-cyan-dim);">[key #${idx+1}]</span>
      `;
      
      item.onclick = () => {
        selectedApiKeyIndex = idx;
        document.querySelectorAll('.keys-list-item').forEach((li, lidx) => {
          if (lidx === idx) li.classList.add('selected');
          else li.classList.remove('selected');
        });
      };
      
      listbox.appendChild(item);
    });
  }
  
  const radio = document.querySelector(`input[name="ai-provider-select"][value="${activeApiProvider}"]`);
  if (radio) radio.checked = true;
}
  




/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3500);
}


/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function refreshMetadataPanelsVisibility() {
  console.log("refreshMetadataPanelsVisibility called. activeMode:", activeMode);
  const metadataUnified = document.getElementById('metadata-unified-section');
  const imageGen = document.getElementById('image-gen-section');
  const sidebar = document.querySelector('.sidebar');
  const metadataCustomPanel = document.getElementById('custom-panel');
  const imagePromptCustomPanel = document.getElementById('image-prompt-custom-panel');
  const settingsPanel = document.getElementById('settings-panel');

  if (sidebar) sidebar.style.display = 'flex';

  const imageSvg = document.getElementById('image-to-svg-section');
  const svgCustomPanel = document.getElementById('image-to-svg-custom-panel');
  const portfolioViewer = document.getElementById('portfolio-viewer-section');
  const platformsSection = document.querySelector('.platforms-section');

  if (activeMode === 'image-to-prompt') {
    console.log("Switching to image-to-prompt. imageGen element:", imageGen);
    if (metadataUnified) metadataUnified.style.display = 'none';
    if (imageGen) {
      imageGen.style.display = 'block';
      console.log("Set imageGen style to block");
    }
    if (imageSvg) imageSvg.style.display = 'none';
    if (portfolioViewer) portfolioViewer.style.display = 'none';
    if (platformsSection) platformsSection.style.display = 'none';
    
    if (metadataCustomPanel) metadataCustomPanel.style.display = 'none';
    if (settingsPanel) settingsPanel.style.display = 'none';
    if (imagePromptCustomPanel) imagePromptCustomPanel.style.display = 'flex';
    if (svgCustomPanel) svgCustomPanel.style.display = 'none';
  } else if (activeMode === 'image-to-svg') {
    if (metadataUnified) metadataUnified.style.display = 'none';
    if (imageGen) imageGen.style.display = 'none';
    if (imageSvg) imageSvg.style.display = 'block';
    if (portfolioViewer) portfolioViewer.style.display = 'none';
    if (platformsSection) platformsSection.style.display = 'none';
    
    if (metadataCustomPanel) metadataCustomPanel.style.display = 'none';
    if (settingsPanel) settingsPanel.style.display = 'none';
    if (imagePromptCustomPanel) imagePromptCustomPanel.style.display = 'none';
    if (svgCustomPanel) svgCustomPanel.style.display = 'flex';
  } else if (activeMode === 'portfolio-viewer') {
    if (metadataUnified) metadataUnified.style.display = 'none';
    if (imageGen) imageGen.style.display = 'none';
    if (imageSvg) imageSvg.style.display = 'none';
    if (portfolioViewer) portfolioViewer.style.display = 'block';
    if (platformsSection) platformsSection.style.display = 'none';
    
    if (sidebar) sidebar.style.display = 'none';
  } else {
    if (imageGen) imageGen.style.display = 'none';
    if (imageSvg) imageSvg.style.display = 'none';
    if (portfolioViewer) portfolioViewer.style.display = 'none';
    if (platformsSection) platformsSection.style.display = 'flex';
    
    if (metadataCustomPanel) metadataCustomPanel.style.display = 'flex';
    if (settingsPanel) settingsPanel.style.display = 'flex';
    if (imagePromptCustomPanel) imagePromptCustomPanel.style.display = 'none';
    if (svgCustomPanel) svgCustomPanel.style.display = 'none';
    
    if (metadataUnified) metadataUnified.style.display = 'block';
  }
}

/* ==========================================================================
   AI STOCK IMAGE GENERATOR (IMAGE-TO-PROMPT & TEXT-TO-IMAGE CREATOR)
   ========================================================================== */
function initReversePromptGenerator() {
  const uploadArea = document.getElementById('reverse-prompt-upload-area');
  const fileInput = document.getElementById('reverse-prompt-file-input');
  const uploadContent = document.getElementById('reverse-prompt-upload-content');
  const previewList = document.getElementById('reverse-prompt-preview-list');
  const customInstructionsInput = document.getElementById('reverse-prompt-custom-instructions');
  
  const submitBtn = document.getElementById('reverse-prompt-submit-btn');
  
  let currentImages = []; // Array of { name, mime, base64, url }
  
  if (!uploadArea) return;
  
  // Click to upload
  uploadArea.addEventListener('click', (e) => {
    console.log("Upload area clicked!", e.target);
    // Check if closest exists (in case e.target is a TextNode)
    if(e.target.closest && e.target.closest('.remove-btn')) return;
    
    try {
      fileInput.click();
      console.log("fileInput.click() executed");
    } catch(err) {
      alert("Error opening file dialog: " + err.message);
    }
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--color-cyan)'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = 'var(--border-glass)'; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-glass)';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      handleFiles(filesArray);
    }
    fileInput.value = "";
  });
  
  function handleFiles(files) {
    let loadedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        showToast(`Skipped ${file.name} (not an image).`, "warning");
        loadedCount++;
        if (loadedCount === files.length) renderPreviews();
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        currentImages.push({
          name: file.name,
          mime: file.type,
          base64: base64,
          url: e.target.result
        });
        loadedCount++;
        if (loadedCount === files.length) renderPreviews();
      };
      reader.readAsDataURL(file);
    }
  }
  
  function renderPreviews() {
    if (currentImages.length > 0) {
      uploadContent.style.display = 'none';
      previewList.style.display = 'flex';
      previewList.innerHTML = '';
      
      currentImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'stretch';
        div.style.gap = '16px';
        div.style.background = 'rgba(0,0,0,0.3)';
        div.style.padding = '12px';
        div.style.borderRadius = '12px';
        div.style.border = '1px solid rgba(255,255,255,0.05)';
        
        div.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 140px; flex-shrink: 0;">
            <img src="${img.url}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 12px; color: var(--text-muted); width: 100%; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${img.name}">${img.name}</div>
            <button class="remove-btn" data-index="${index}" style="background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3); color: #ff4d4d; cursor: pointer; padding: 6px; border-radius: 6px; font-size: 12px; width: 100%; font-weight: 600; transition: all 0.2s ease;"><i class="fa-solid fa-trash"></i> Remove</button>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; position: relative;">
            <textarea id="reverse-prompt-output-${index}" class="text-input-field" readonly placeholder="Prompt will appear here..." style="flex: 1; min-height: 140px; resize: none; background: rgba(0, 0, 0, 0.4); font-size: 14px; line-height: 1.5; padding: 16px; width: 100%; box-sizing: border-box; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);"></textarea>
            <button class="copy-row-btn" data-index="${index}" style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; backdrop-filter: blur(4px); transition: all 0.2s ease;"><i class="fa-regular fa-copy"></i> Copy</button>
          </div>
        `;
        previewList.appendChild(div);
      });
      
      const removeBtns = previewList.querySelectorAll('.remove-btn');
      removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          currentImages.splice(idx, 1);
          renderPreviews();
        });
      });
      
      const copyBtns = previewList.querySelectorAll('.copy-row-btn');
      copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const textarea = document.getElementById(`reverse-prompt-output-${idx}`);
          if (!textarea.value.trim()) return;
          navigator.clipboard.writeText(textarea.value).then(() => {
            btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
            btn.style.background = 'rgba(0, 200, 100, 0.2)';
            setTimeout(() => {
              btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
              btn.style.background = 'rgba(255,255,255,0.1)';
            }, 2000);
          });
        });
      });
      
    } else {
      uploadContent.style.display = 'block';
      previewList.style.display = 'none';
      previewList.innerHTML = '';
    }
  }
  
  // Generate Prompt
  submitBtn.addEventListener('click', async () => {
    if (currentImages.length === 0) {
      showToast("Please upload at least one image first!", "warning");
      return;
    }
    
    const provider = activeApiProvider;
    const providerData = apiKeysStore[provider] || {};
    const keys = providerData.keys || [];
    if (keys.length === 0 && provider !== 'ollama') {
      showToast(`Please add an API key for ${provider.toUpperCase()} in Settings!`, "error");
      return;
    }
    
    const customModel = providerData.customModel || "";
    const apiKey = keys[0];
    
    submitBtn.disabled = true;
    
    let baseSystemPrompt = "Analyze the provided image in extreme detail and write a highly descriptive text prompt that can be used in an AI image generator (like Midjourney, DALL-E 3, or Stable Diffusion) to recreate this exact image. \n\nInclude details about:\n1. The main subject and action.\n2. The visual style (e.g., photorealistic, vector art, flat design, 3D render, etc.).\n3. The lighting, colors, and atmosphere.\n4. The composition, camera angle, and background.\n\nOutput ONLY the prompt text, without any introduction or markdown formatting.";
    
    const customInstructions = customInstructionsInput ? customInstructionsInput.value.trim() : "";
    if (customInstructions) {
      baseSystemPrompt += `\n\nUSER CUSTOM INSTRUCTIONS:\n${customInstructions}\n\nPlease strongly adhere to these custom instructions when generating the prompt.`;
    }
    
    let hasError = false;
    
    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      const rowTextarea = document.getElementById(`reverse-prompt-output-${i}`);
      if (!rowTextarea) continue;
      
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing Image ${i + 1} of ${currentImages.length}...`;
      rowTextarea.value = `Analyzing image and generating highly detailed prompt...`;
      
      try {
        let resultText = "";
        
        if (provider === 'gemini') {
          const model = customModel || 'gemini-2.5-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                role: "user",
                parts: [
                  { text: baseSystemPrompt },
                  { inlineData: { mimeType: img.mime, data: img.base64 } }
                ]
              }],
              generationConfig: { temperature: 0.4 }
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          resultText = data.candidates[0].content.parts[0].text;
        }
        else if (provider === 'openrouter') {
          const model = customModel;
          if (!model) throw new Error("Please select a Custom Model in API settings for OpenRouter.");
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': window.location.href,
              'X-Title': 'Metadata SEO'
            },
            body: JSON.stringify({
              model: model,
              messages: [{
                role: "user",
                content: [
                  { type: "text", text: baseSystemPrompt },
                  { type: "image_url", image_url: { url: `data:${img.mime};base64,${img.base64}` } }
                ]
              }],
              temperature: 0.4
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message || "OpenRouter error");
          resultText = data.choices[0].message.content;
        }
        else if (provider === 'openai') {
          const model = customModel || "gpt-4o-mini";
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model,
              messages: [{
                role: "user",
                content: [
                  { type: "text", text: baseSystemPrompt },
                  { type: "image_url", image_url: { url: `data:${img.mime};base64,${img.base64}` } }
                ]
              }],
              temperature: 0.4
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          resultText = data.choices[0].message.content;
        }
        else {
          throw new Error("Provider not supported for Vision.");
        }
        
        rowTextarea.value = resultText.trim();
        
      } catch (err) {
        console.error(err);
        hasError = true;
        rowTextarea.value = `ERROR: ${err.message}`;
      }
    }
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Extract Prompt from Images`;
    
    if (hasError) {
      showToast("Finished with some errors. See output.", "warning");
    } else {
      showToast("All prompts extracted successfully!", "success");
    }
  });
}

/* ==========================================================================
   IMAGE TO SVG GENERATOR
   ========================================================================== */
function initSvgGenerator() {
  const uploadArea = document.getElementById('svg-upload-area');
  const fileInput = document.getElementById('svg-file-input');
  const uploadContent = document.getElementById('svg-upload-content');
  const previewList = document.getElementById('svg-preview-list');
  const customInstructionsInput = document.getElementById('svg-custom-instructions');
  const submitBtn = document.getElementById('svg-submit-btn');
  
  let currentImages = []; // Array of { name, mime, base64, url }
  
  if (!uploadArea) return;
  
  // Click to upload
  uploadArea.addEventListener('click', (e) => {
    if(e.target.closest && e.target.closest('.remove-btn')) return;
    fileInput.click();
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--color-cyan)'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = 'var(--border-glass)'; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-glass)';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    fileInput.value = "";
  });
  
  function handleFiles(files) {
    let loadedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        showToast(`Skipped ${file.name} (not an image).`, "warning");
        loadedCount++;
        if (loadedCount === files.length) renderPreviews();
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        currentImages.push({ name: file.name, mime: file.type, base64: base64, url: e.target.result });
        loadedCount++;
        if (loadedCount === files.length) renderPreviews();
      };
      reader.readAsDataURL(file);
    }
  }
  
  function renderPreviews() {
    if (currentImages.length > 0) {
      uploadContent.style.display = 'none';
      previewList.style.display = 'flex';
      previewList.innerHTML = '';
      
      currentImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'stretch';
        div.style.gap = '16px';
        div.style.background = 'rgba(0,0,0,0.3)';
        div.style.padding = '12px';
        div.style.borderRadius = '12px';
        div.style.border = '1px solid rgba(255,255,255,0.05)';
        
        div.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 140px; flex-shrink: 0;">
            <img src="${img.url}" style="width: 140px; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 12px; color: var(--text-muted); width: 100%; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${img.name}">${img.name}</div>
            <button class="remove-btn" data-index="${index}" style="background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3); color: #ff4d4d; cursor: pointer; padding: 6px; border-radius: 6px; font-size: 12px; width: 100%; font-weight: 600;"><i class="fa-solid fa-trash"></i> Remove</button>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; position: relative;">
            <div style="display: flex; gap: 10px; height: 100%;">
              <textarea id="svg-output-${index}" class="text-input-field" readonly placeholder="Raw SVG code will appear here..." style="flex: 1; min-height: 140px; resize: none; background: rgba(0, 0, 0, 0.4); font-size: 13px; font-family: monospace; line-height: 1.5; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);"></textarea>
              <div id="svg-preview-box-${index}" style="flex: 1; min-height: 140px; background: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                <span style="color: #999; font-size: 12px;">Visual Preview</span>
              </div>
            </div>
            <button class="copy-row-btn" data-index="${index}" style="position: absolute; top: 12px; right: 52%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; backdrop-filter: blur(4px); transition: all 0.2s ease;"><i class="fa-regular fa-copy"></i> Copy Code</button>
          </div>
        `;
        previewList.appendChild(div);
      });
      
      previewList.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentImages.splice(parseInt(btn.getAttribute('data-index')), 1);
          renderPreviews();
        });
      });
      
      previewList.querySelectorAll('.copy-row-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          const textarea = document.getElementById(`svg-output-${idx}`);
          if (!textarea.value.trim()) return;
          navigator.clipboard.writeText(textarea.value).then(() => {
            btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
            setTimeout(() => { btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Code`; }, 2000);
          });
        });
      });
    } else {
      uploadContent.style.display = 'block';
      previewList.style.display = 'none';
      previewList.innerHTML = '';
    }
  }
  
  submitBtn.addEventListener('click', async () => {
    if (currentImages.length === 0) {
      showToast("Please upload at least one image first!", "warning");
      return;
    }
    
    const provider = activeApiProvider;
    const providerData = apiKeysStore[provider] || {};
    const keys = providerData.keys || [];
    if (keys.length === 0 && provider !== 'ollama') {
      showToast(`Please add an API key for ${provider.toUpperCase()} in Settings!`, "error");
      return;
    }
    
    const customModel = providerData.customModel || "";
    const apiKey = keys[0];
    
    submitBtn.disabled = true;
    
    let baseSystemPrompt = "You are a specialized code generator. Write valid SVG code that visually reproduces the shapes, colors, and layout seen in the attached image.\n\nRULES:\n1. Use native SVG elements (<path>, <rect>, <circle>, <g>, etc.).\n2. Recreate text using <text> tags if applicable.\n3. Include necessary gradients and colors.\n4. Output ONLY the raw SVG code. Do not wrap in ```svg blocks. Start exactly with <svg> and end exactly with </svg>. Do not include any explanations.";
    
    const customInstructions = customInstructionsInput ? customInstructionsInput.value.trim() : "";
    if (customInstructions) {
      baseSystemPrompt += `\n\nUSER CUSTOM INSTRUCTIONS:\n${customInstructions}\n\nPlease strongly adhere to these custom instructions.`;
    }
    
    let hasError = false;
    
    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      const rowTextarea = document.getElementById(`svg-output-${i}`);
      const previewBox = document.getElementById(`svg-preview-box-${i}`);
      if (!rowTextarea) continue;
      
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Generating Advanced SVG ${i + 1} of ${currentImages.length}...`;
      rowTextarea.value = `Analyzing image and generating intelligent SVG code...`;
      
      try {
        let resultText = "";
        
        if (provider === 'gemini') {
          const model = customModel || 'gemini-2.5-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                role: "user",
                parts: [
                  { text: baseSystemPrompt },
                  { inlineData: { mimeType: img.mime, data: img.base64 } }
                ]
              }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 8192 }
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          resultText = data.candidates[0].content.parts[0].text;
        } else if (provider === 'openai') {
          const model = customModel || "gpt-4o-mini";
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: model,
              messages: [{ role: "user", content: [{ type: "text", text: baseSystemPrompt }, { type: "image_url", image_url: { url: `data:${img.mime};base64,${img.base64}` } }] }],
              temperature: 0.2,
              max_tokens: 16384
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          resultText = data.choices[0].message.content;
        } else if (provider === 'openrouter') {
          const model = customModel;
          if (!model) throw new Error("Please select a Custom Model in API settings for OpenRouter.");
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'HTTP-Referer': window.location.href, 'X-Title': 'Metadata SEO' },
            body: JSON.stringify({
              model: model,
              messages: [{ role: "user", content: [{ type: "text", text: baseSystemPrompt }, { type: "image_url", image_url: { url: `data:${img.mime};base64,${img.base64}` } }] }],
              temperature: 0.2,
              max_tokens: 16384
            })
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message || "OpenRouter error");
          resultText = data.choices[0].message.content;
        } else {
          throw new Error("Provider not supported for Vision.");
        }
        
        let finalCode = resultText.trim();
        // remove markdown if present
        if (finalCode.startsWith("```")) {
            finalCode = finalCode.replace(/^```[a-z]*\n/i, "");
            finalCode = finalCode.replace(/\n```$/i, "");
        }
        
        rowTextarea.value = finalCode;
        if(finalCode.includes("<svg")) {
            previewBox.innerHTML = finalCode;
            const svgElement = previewBox.querySelector('svg');
            if (svgElement) {
                svgElement.style.width = '100%';
                svgElement.style.height = '100%';
                svgElement.style.objectFit = 'contain';
            }
        } else {
            previewBox.innerHTML = '<span style="color: #ff4d4d; font-size: 12px;">Invalid SVG generated</span>';
        }
        
      } catch (err) {
        console.error(err);
        hasError = true;
        rowTextarea.value = `ERROR: ${err.message}`;
      }
    }
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-bezier-curve"></i> Generate SVG`;
    
    if (hasError) showToast("Finished with some errors. See output.", "warning");
    else showToast("All SVGs generated successfully!", "success");
  });
}

/* ==========================================================================
   ADOBE STOCK PORTFOLIO VIEWER LOGIC
   ========================================================================== */
function initPortfolioViewer() {
  const searchBtn = document.getElementById('portfolio-search-btn');
  const creatorIdInput = document.getElementById('portfolio-creator-id');
  const sortBySelect = document.getElementById('portfolio-sort-by');
  const loadingIndicator = document.getElementById('portfolio-loading');
  const gridContainer = document.getElementById('portfolio-grid');

  if (!searchBtn) return;

  searchBtn.addEventListener('click', async () => {
    const creatorId = creatorIdInput.value.trim();
    if (!creatorId) {
      showToast('Please enter a Contributor ID.', 'warning');
      return;
    }

    const adobeKeyObj = apiKeysStore['adobestock'];
    const apiKey = adobeKeyObj && adobeKeyObj.keys && adobeKeyObj.keys.length > 0 ? adobeKeyObj.keys[0] : '';

    if (!apiKey) {
      showToast('Please add your Adobe Stock API Key in Settings first!', 'warning');
      return;
    }

    const sortBy = sortBySelect.value;
    gridContainer.innerHTML = '';
    loadingIndicator.style.display = 'block';

    try {
      const url = `https://stock.adobe.io/Rest/Media/1/Search/Files?search_parameters[creator_id]=${creatorId}&search_parameters[order]=${sortBy}&result_columns[]=id&result_columns[]=title&result_columns[]=thumbnail_1000_url`;
      
      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKey,
          'x-product': 'StockMetaPro/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      loadingIndicator.style.display = 'none';

      if (!data.files || data.files.length === 0) {
        gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 30px; color: var(--text-muted);">No items found for this Contributor.</div>';
        return;
      }

      data.files.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = 'background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;';
        
        card.innerHTML = `
          <div style="height: 180px; overflow: hidden; background: #000; display:flex; align-items:center; justify-content:center;">
            <img src="${item.thumbnail_1000_url}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 12px;">
            <h3 style="font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.title}">${item.title || 'Untitled'}</h3>
            <p style="font-size: 12px; color: var(--text-muted);">ID: ${item.id}</p>
          </div>
        `;
        gridContainer.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      loadingIndicator.style.display = 'none';
      showToast('Failed to load portfolio. Check your API key and network.', 'warning');
      gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 30px; color: #ff4d4d;">Error: ${error.message}</div>`;
    }
  });
}
