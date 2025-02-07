# Chrome vs Firefox Extension Manifest Differences

## 1. Manifest Version

- **Chrome (v3)**: Uses `manifest_version: 3`
- **Firefox**: Uses `manifest_version: 2`

## 2. Browser Action/Action

- **Chrome (v3)**:
  ```json
  "action": {
    "default_popup": "index.html"
  }
  ```
- **Firefox**:
  ```json
  "browser_action": {
    "default_popup": "index.html"
  }
  ```

## 3. Background Scripts

- **Chrome (v3)**: Single service worker
  ```json
  "background": {
    "service_worker": "background.js"
  }
  ```
- **Firefox**: Supports multiple background scripts
  ```json
  "background": {
    "scripts": ["background.js"]
  }
  ```

## 4. Content Security Policy

- **Chrome (v3)**: More restrictive CSP, requires explicit declaration
- **Firefox**: More lenient CSP requirements

## 5. Host Permissions

- **Chrome (v3)**: Separate host and regular permissions
  ```json
  "host_permissions": ["*://*.example.com/*"],
  "permissions": ["storage"]
  ```
- **Firefox**: Combined permissions
  ```json
  "permissions": [
    "*://*.example.com/*",
    "storage"
  ]
  ```

## 6. Web Accessible Resources

- **Chrome (v3)**: Specific configuration with resources and matches
  ```json
  "web_accessible_resources": [{
    "resources": ["images/*.png"],
    "matches": ["*://*.example.com/*"]
  }]
  ```
- **Firefox**: Simple array format
  ```json
  "web_accessible_resources": [
    "images/*.png"
  ]
  ```

## 7. Build commands

Specifically in this project, we're handling these differences by maintaining separate manifest files (manifest.chrome.json and manifest.firefox.json) and using an environment variable (BROWSER) during build time to select the appropriate manifest format.
