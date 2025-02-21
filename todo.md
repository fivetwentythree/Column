# Paper PWA Development Checklist

## 1. Project Setup
- [ ] **Create Project Structure**
  - [ ] Create `index.html` with basic HTML structure and PWA meta tags.
  - [ ] Create `style.css` with basic styling using the Apple system font.
  - [ ] Create `app.js` for main JavaScript logic.
  - [ ] Create `manifest.json` with essential metadata (name: "Paper", display: "standalone", placeholder icon).
  - [ ] Create `service-worker.js` with basic caching logic.
- [ ] **Set Up Version Control**
  - [ ] Initialize Git repository.
  - [ ] Create initial commit with project structure.

## 2. Minimal UI Implementation
- [ ] **Design the UI in `index.html`**
  - [ ] Add a centered text input for URL entry.
  - [ ] Add a submit button (or implement auto-submit on paste).
  - [ ] Add an area for displaying error messages.
- [ ] **Style the UI in `style.css`**
  - [ ] Use Apple system font.
  - [ ] Mimic the minimal, clean look of Safari Reader View.
- [ ] **Link CSS and JS in `index.html`**

## 3. Core Functionality: URL Validation & Archive URL Generation
- [ ] **Implement `validateURL(url)` in `app.js`**
  - [ ] Check if the input is a well-formed URL.
  - [ ] Ensure the URL seems to be a news article (e.g., contains `/news/`, `/article/`).
  - [ ] Return appropriate validation status and error message if invalid.
  - [ ] Write unit tests (or simple assertions) for valid and invalid URLs.
- [ ] **Implement `generateArchiveURL(url)` in `app.js`**
  - [ ] Construct the archive.is URL (`https://archive.is/{original-url}`) with proper encoding.
  - [ ] Write tests to verify correct URL generation.

## 4. Form Submission & Redirection Logic
- [ ] **Wire up the UI in `app.js`**
  - [ ] Add an event listener for the text input or form submission.
  - [ ] On submission, call `validateURL(url)`.
  - [ ] If valid, call `generateArchiveURL(url)` and proceed to redirection.
  - [ ] If invalid, display an error message in the designated area.
  - [ ] Write integration tests to simulate both valid and invalid URL inputs.

## 5. Handling Archive Availability
- [ ] **Implement Archive Existence Check**
  - [ ] Before redirecting, perform a network request (e.g., fetch or HEAD) to the generated archive URL.
  - [ ] If the archive exists (successful response), proceed with redirection.
  - [ ] If the archive does not exist (404 or error response), display an error message ("No archived version available").
  - [ ] Write tests to simulate both scenarios (archive found and not found).

## 6. PWA Enhancements: Service Worker & Manifest
- [ ] **Service Worker Integration**
  - [ ] Register the service worker from `app.js` or `index.html`.
  - [ ] Implement basic caching in `service-worker.js` for core assets (`index.html`, `style.css`, `app.js`, `manifest.json`).
  - [ ] Test service worker registration and caching functionality.
- [ ] **Manifest Setup**
  - [ ] Update `manifest.json` with proper metadata for iOS (name, display, icons, etc.).
  - [ ] Verify that the PWA is installable on iOS devices.

## 7. Final Integration & End-to-End Testing
- [ ] **Wire All Components Together**
  - [ ] Confirm that `index.html` loads the CSS and JS correctly.
  - [ ] Validate that the form submission triggers the correct flow: validation → archive URL generation → existence check → redirection or error display.
  - [ ] Ensure the service worker is active and caching is functional.
- [ ] **Comprehensive Testing**
  - [ ] Unit tests for URL validation and URL generation.
  - [ ] Integration tests for form submission and redirection/error handling.
  - [ ] End-to-end tests simulating user interaction:
    - [ ] Valid URL leads to redirection.
    - [ ] Invalid URL displays an error message.
    - [ ] Archive not found scenario displays an appropriate error.
  - [ ] Cross-device testing on iOS Safari (and optionally Android Chrome).

## 8. Documentation & Cleanup
- [ ] **Update README.md**
  - [ ] Include project overview, installation instructions, and testing guidelines.
- [ ] **Code Review and Refactoring**
  - [ ] Review code for adherence to best practices.
  - [ ] Remove any unused code or comments.
- [ ] **Final Commit & Deployment Preparation**
  - [ ] Finalize all changes.
  - [ ] Prepare for deployment on a static hosting service (e.g., GitHub Pages, Netlify, or Vercel).

---

This checklist is designed to ensure incremental progress with strong testing at every stage. Each task builds on the previous ones, ensuring there are no orphaned pieces of code. Enjoy building "Paper"!
