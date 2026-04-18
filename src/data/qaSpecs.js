export const QA_SPECS = {
  '/login': {
    title: 'Login Page',
    acceptanceCriteria: [
      {
        section: '1. Page Load & UI Rendering',
        items: [
          'Page loads without errors. All fields visible: Username, Password, Remember Me, Sign In button.',
          'Responsive layout on Desktop (≥1024px), Tablet (768–1023px), Mobile (≤767px).',
        ],
      },
      {
        section: '2. Field Validation',
        items: [
          'Username: Alphanumeric only, max 14 characters, mandatory.',
          'Password: Min 8, max 16 characters, must have 1 upper, 1 number, 1 symbol.',
          'Sign In button disabled until both fields have inputs.',
        ],
      },
      {
        section: '3. Security & Auth',
        items: [
          'Invalid credentials show a generic "Invalid username or password" error.',
          '5 consecutive failures trigger a 30-second lockout with countdown timer.',
          'reCAPTCHA widget must be verified before login.',
          'Remember Me: "Checked" persists token in localStorage; "Unchecked" uses sessionStorage.',
        ],
      },
    ],
    testScenarios: [
      {
        id: 'L-01',
        priority: 'P0',
        tag: 'smoke',
        title: 'Valid login leads to /dashboard',
        steps: [
          'Enter admin / Qwerty@1234',
          'Verify reCAPTCHA',
          'Click Sign In',
          'Assert URL ends in /dashboard',
        ],
        selector: 'login-submit',
      },
      {
        id: 'L-02',
        priority: 'P1',
        tag: 'validation',
        title: 'Empty username error',
        steps: ['Click Sign In with empty username', 'Assert text "Username is required" visible'],
        selector: 'username-error-msg',
      },
      {
        id: 'L-03',
        priority: 'P0',
        tag: 'security',
        title: 'Brute-force lockout (5 attempts)',
        steps: ['Submit 5 times with wrong creds', 'Assert lockout banner and timer appear'],
        selector: 'lockout-banner',
      },
      {
        id: 'L-04',
        priority: 'P1',
        tag: 'a11y',
        title: 'Keyboard Tab Navigation',
        steps: [
          'Tab through all fields',
          'Assert focus order: User -> Pass -> Toggle -> Checkbox -> Submit',
        ],
        selector: 'login-username',
      },
      {
        id: 'L-05',
        priority: 'P0',
        tag: 'storage',
        title: 'Remember Me Persistence (localStorage)',
        steps: [
          'Login with "Remember Me" Checked',
          'Assert token exists in localStorage',
          'Reload page',
          'Assert state remains "Authenticated"',
        ],
        selector: 'login-remember-me',
      },
      {
        id: 'L-06',
        priority: 'P1',
        tag: 'storage',
        title: 'Session Non-Persistence (sessionStorage)',
        steps: [
          'Login with "Remember Me" Unchecked',
          'Assert token exists in sessionStorage',
          'Verify localStorage is null',
        ],
        selector: 'login-remember-me',
      },
    ],
    masterPrompt: `Expert QA: Generate Playwright TS test for Login. URL: /login. Selectors: login-username, login-password, login-submit, login-remember-me, lockout-banner. Scenarios: Happy path, Empty validation, 5x Lockout sequence.`,
  },

  '/dashboard': {
    title: 'Productive Dashboard',
    acceptanceCriteria: [
      {
        section: '1. Global Navigation (Header)',
        items: [
          'Header shrinks and becomes edge-to-edge when scrolling > 60px.',
          'Sidebar toggle opens and closes the navigation drawer.',
          'Logo and Logout button must be visible at all times.',
        ],
      },
      {
        section: '2. Data Table Features',
        items: [
          'Loads data asynchronously (mocked).',
          'Supports column sorting for ID, Name, Role, and Status.',
          'Pagination shows 5 rows per page. "Next/Prev" must be reachable.',
          'Select All checkbox toggles all current page rows.',
        ],
      },
      {
        section: '3. File Upload Dropzone',
        items: [
          'Accepts Drag & Drop and File selection.',
          'Validates max size of 5MB. Shows error for larger files.',
          'Simulates upload progress with visual percentage/bar.',
        ],
      },
      {
        section: '4. Chaos Form Builder',
        items: [
          'Submit trigger network simulation (controlled by God Mode).',
          'Supports chaos modes: Label Swap, Field Shuffle, Ghost Field.',
          'Stable data-testid ensures automation survivability under chaos.',
        ],
      },
    ],
    testScenarios: [
      {
        id: 'D-01',
        priority: 'P0',
        tag: 'layout',
        title: 'Header Hysteresis / Shrink',
        steps: [
          'Scroll down 100px',
          'Assert header height/padding reduces',
          'Scroll up to top',
          'Assert header expands again',
        ],
        selector: 'dashboard-header',
      },
      {
        id: 'D-02',
        priority: 'P0',
        tag: 'smoke',
        title: 'Data Table: Sorting & Pagination',
        steps: [
          'Click "Status" header',
          'Assert rows re-ordered',
          'Click "Next"',
          'Assert page start/end markers updated',
        ],
        selector: 'data-table',
      },
      {
        id: 'D-03',
        priority: 'P1',
        tag: 'validation',
        title: 'File Upload: Size Limit (5MB)',
        steps: [
          'Upload 6MB file',
          'Assert [data-testid="upload-error-state"] visible',
          'Assert error message text mentions 5MB limit',
        ],
        selector: 'upload-dropzone',
      },
      {
        id: 'D-04',
        priority: 'P0',
        tag: 'chaos',
        title: 'Chaos Resilience: Ghost Field',
        steps: [
          'Enable "Ghost Field" toggle',
          'Detect dynamic 42 code input',
          'Fill "42" and submit',
          'Assert submission success',
        ],
        selector: 'chaos-form',
      },
      {
        id: 'D-05',
        priority: 'P1',
        tag: 'network',
        title: 'Force Offline Simulation',
        steps: [
          'Open God Mode sidebar',
          'Toggle "Offline"',
          'Submit Chaos Form',
          'Assert "Network error" banner visible',
        ],
        selector: 'chaos-form-error',
      },
    ],
    masterPrompt: `Expert QA: Playwright TS test for Dashboard features. Cover Table sorting (sort-status), Pagination (pagination-next), and File Upload (upload-input) using data-testid selectors.`,
  },

  '/sandbox': {
    title: 'Automation Sandbox',
    acceptanceCriteria: [
      {
        section: '1. Product Gallery',
        items: [
          'Category filter (Electronics, Furniture, etc.) correctly updates product list.',
          'Out-of-stock items (Headphones) have "Add to Cart" button disabled.',
          'Sorting works for Price (Low-High/High-Low) and Rating.',
        ],
      },
      {
        section: '2. Custom Date Picker',
        items: [
          'Calendar widget opens on click. Avoids native browser picker.',
          'Navigation allows changing months (Prev/Next).',
          'Selection updates the input field text.',
        ],
      },
      {
        section: '3. Advanced Controls',
        items: [
          'Range Slider: Values 0-1000 with $50 increments. Updates visual label.',
          'Tagging Input: Multi-item support. Enter to add. X icon to remove.',
        ],
      },
    ],
    testScenarios: [
      {
        id: 'G-01',
        priority: 'P0',
        tag: 'expert',
        title: 'Shadow DOM Piercing',
        steps: [
          'Locate #shadow-host-container',
          'Access shadowRoot',
          'Click #shadow-action-btn',
          'Assert "SUCCESS: Shadow DOM interaction detected!" log appears',
        ],
        selector: 'shadow-host-container',
      },
      {
        id: 'G-02',
        priority: 'P1',
        tag: 'robustness',
        title: 'Dynamic ID Resilience',
        steps: [
          'Locate button by data-testid="flaky-id-btn"',
          'Hover to change ID',
          'Confirm ID changed but locator still works',
          'Click button',
        ],
        selector: 'flaky-id-btn',
      },
      {
        id: 'S-01',
        priority: 'P0',
        tag: 'smoke',
        title: 'Gallery Category Filtering',
        steps: [
          'Select "Electronics"',
          'Assert all product cards contain "ELECTRONICS" text',
          'Count items',
        ],
        selector: 'product-category-filter',
      },
      {
        id: 'S-02',
        priority: 'P1',
        tag: 'logic',
        title: 'Out of Stock State Check',
        steps: [
          'Find "Noise Canceling Headphones"',
          'Assert button is disabled',
          'Assert text "Out of Stock"',
        ],
        selector: 'add-to-cart-btn',
      },
      {
        id: 'S-03',
        priority: 'P0',
        tag: 'complex',
        title: 'Date Selection (Cross-Month)',
        steps: [
          'Open picker',
          'Click "Next" month twice',
          'Select day "15"',
          'Assert input value contains June 15, 2025',
        ],
        selector: 'calendar-widget',
      },
      {
        id: 'S-04',
        priority: 'P2',
        tag: 'ux',
        title: 'Tagging Lifecycle',
        steps: [
          'Type "QA" + Enter',
          'Type "Prod" + Enter',
          'Click "remove-tag-qa"',
          'Assert only "Prod" remains',
        ],
        selector: 'tag-input',
      },
    ],
    masterPrompt: `Expert QA: Playwright TS test for Sandbox widgets. Focus on Product Filter logic, Custom Date Picker navigation steps, and Tagging input array manipulation via DOM.`,
  },

  '/maintenance': {
    title: 'Status & Error Pages',
    acceptanceCriteria: [
      {
        section: '1. Status Rendering',
        items: [
          'Correct status code (e.g. 503) displayed in large text.',
          'Contextual message matches the status (Maintenance vs Error vs 404).',
          'Icons match the severity of the status.',
        ],
      },
      {
        section: '2. Recovery Actions',
        items: [
          'Retry button refreshes the current view.',
          'Home button takes the user back to the application entry.',
        ],
      },
    ],
    testScenarios: [
      {
        id: 'ST-01',
        priority: 'P1',
        tag: 'logic',
        title: 'Verify 503 Maintenance Page',
        steps: [
          'Navigate to /status?code=503',
          'Assert text "Under Maintenance"',
          'Assert blue maintenance icon',
        ],
        selector: 'status-code',
      },
      {
        id: 'ST-02',
        priority: 'P1',
        tag: 'logic',
        title: 'Verify 404 Not Found',
        steps: [
          'Navigate to undefined route',
          'Assert status code 404',
          'Click "Go Back Home"',
          'Assert redirect',
        ],
        selector: 'status-code',
      },
    ],
    masterPrompt: `Expert QA: Playwright TS test for StatusPage. Validate content changes based on 'code' query parameter.`,
  },
  '/shop': {
    title: 'E-Commerce Shop',
    acceptanceCriteria: [
      {
        section: '1. Discovery & Filtering',
        items: [
          'Product search correctly filters by title (case-insensitive).',
          'Category sidebar filters list by product type.',
          'Price Range slider ($0-$2000) removes items exceeding the threshold.',
        ],
      },
      {
        section: '2. Cart Management',
        items: [
          'Add to Cart button (FAB style) increments cart badge count.',
          'Cart drawer displays all added items with correct prices and images.',
          'Quantity controls (+/-) update item count and subtotal in real-time.',
          'Remove button deletes item from cart completely.',
        ],
      },
      {
        section: '3. Checkout Flow',
        items: [
          'Proceed to Checkout button is disabled if cart is empty.',
          'Shipping form requires name and address validation.',
          'Mock payment simulation shows a "Processing" state before completion.',
          'Success alert displays a mock order ID after successful checkout.',
        ],
      },
    ],
    testScenarios: [
      {
        id: 'SHOP-01',
        priority: 'P0',
        tag: 'smoke',
        title: 'Complete Purchase Flow',
        steps: [
          'Add "Ultra Gaming Laptop" to cart',
          'Open Cart Drawer',
          'Click "Proceed to Checkout"',
          'Fill name and address',
          'Click "Place Order"',
          'Assert success alert appears',
        ],
        selector: 'place-order-btn',
      },
      {
        id: 'SHOP-02',
        priority: 'P1',
        tag: 'logic',
        title: 'Price Range Filter Verification',
        steps: [
          'Set price slider to $100',
          'Assert "Ultra Gaming Laptop" ($1499) is hidden',
          'Assert "Pro Wireless Mouse" ($79) is visible',
        ],
        selector: 'shop-price-range',
      },
      {
        id: 'SHOP-03',
        priority: 'P0',
        tag: 'functional',
        title: 'Cart Persistence & Quantity Calc',
        steps: [
          'Add "Pro Wireless Mouse" (79.99)',
          'Add it again',
          'Open Cart',
          'Assert quantity is 2',
          'Assert subtotal is $159.98',
        ],
        selector: 'cart-drawer',
      },
    ],
    masterPrompt: `Expert QA: Playwright TS test for Shop checkout flow. URL: /shop. Use selectors: add-to-cart-btn, header-cart-btn, checkout-btn, place-order-btn. Verify cart sum logic and validation.`,
  },
  '/random-test': {
    title: 'IFrame & Media Lab',
    acceptanceCriteria: [
      {
        section: '1. Iframe Switching',
        items: [
          'YouTube Iframe (Fahhh Meme) loads correctly and is switchable.',
          'Interactive Iframe (Ping Parent) loads with local srcDoc content.',
        ],
      },
      {
        section: '2. Media & State Verification',
        items: [
          'YouTube player supports standard Iframe API (autoplay/mute verification).',
          'Parent Counter increments correctly when "Ping Parent" is clicked inside the Iframe.',
        ],
      },
    ],
    testScenarios: [
      {
        id: 'IF-01',
        priority: 'P0',
        tag: 'cross-frame',
        title: 'Iframe Context Switch & Click',
        steps: [
          'Locate iframe[data-testid="interactive-iframe"]',
          'Switch to iframe context',
          'Click button with text "Ping Parent"',
          'Switch back to parent context',
          'Assert text content of data-testid="parent-counter" is "1"',
        ],
        selector: 'interactive-iframe',
      },
      {
        id: 'IF-02',
        priority: 'P1',
        tag: 'media',
        title: 'Video Iframe Presence',
        steps: [
          'Verify iframe[data-testid="fahhh-iframe"] is visible',
          'Check that src attribute contains youtube.com/embed/',
        ],
        selector: 'fahhh-iframe',
      },
    ],
    masterPrompt: `Expert QA: Playwright TS test for Iframe switching. Use 'frameLocator' to target data-testid="interactive-iframe" and click button. Verify parent-counter updates.`,
  },
}
