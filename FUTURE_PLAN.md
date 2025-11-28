# Future Plan: Naruto Code Editor Phase 2

This document outlines the proposed features and enhancements for Phase 2 of the Naruto Code Editor. Building upon the solid foundation established in Phase 1, the next phase aims to improve usability, extensibility, and performance.

## 1. User Interface Enhancements

*   **Settings UI**: Implement a graphical user interface for modifying settings (currently in `src/data/settings.json`). This would allow users to change themes, font sizes, and backgrounds without editing a JSON file manually.
*   **Tab Management**: Improve the visual representation of open tabs. Add features like reordering tabs via drag-and-drop and a "Close All" option.
*   **Split View**: Support splitting the editor pane horizontally or vertically to view multiple files at once.
*   **Context Menus**: Add right-click context menus to the file explorer (New File, Rename, Delete, Reveal in Explorer) and the editor area (Copy, Cut, Paste).

## 2. Editor Features

*   **IntelliSense / Autocomplete**: Enhance autocompletion capabilities. Integrate with Language Servers (LSP) for better code suggestions for languages like JavaScript, Python, and HTML.
*   **Search and Replace**: Implement global search and replace functionality across the entire project or opened folder.
*   **Git Integration**: Add basic Git support, showing modified files in the explorer and allowing staging/committing directly from the editor.
*   **Terminal Integration**: Embed a terminal within the editor so users can run commands without leaving the application.

## 3. Architecture and Code Quality

*   **Modularization**: Refactor `fileEditor.js` into smaller, more focused modules. Currently, it handles too many responsibilities (UI creation, file I/O, event handling).
*   **State Management**: Introduce a more robust state management solution (like Redux or a simple custom store) to handle application state instead of relying on global variables and DOM attributes.
*   **Testing**: Implement unit tests for core logic functions and integration tests for the electron app using tools like Jest and Spectron (or Playwright).
*   **TypeScript Migration**: Consider migrating the codebase to TypeScript for better type safety and maintainability.

## 4. Plugin System

*   **Extensions**: Design a simple API to allow third-party extensions. This would enable the community to add new themes, language support, or tools.

## 5. Deployment and Updates

*   **Auto-Updater**: Integrate `electron-updater` to allow the application to update itself automatically when a new version is released.
*   **CI/CD**: Set up a Continuous Integration/Continuous Deployment pipeline (e.g., using GitHub Actions) to automate testing and building releases for Windows, macOS, and Linux.
