# Development Journey: Building a Custom JSX Renderer

This document chronicles the 13-week journey (update(Jun/10/2026)) of building a lightweight React-like JSX renderer from scratch. It highlights the key technical challenges faced and how they were overcome.

## Phase 1: Foundation & Setup (Weeks 1-4)

### The "What is JSX?" Challenge
*   **Problem:** Understanding how `<div />` becomes JavaScript.
*   **Solution:** Learned about Babel's role in transpilation and implemented the `hs` (hyperscript) function to catch Babel's output (`hs('div', props, children)`).

### The "Undefined" Children Bug
*   **Problem:** Early implementations of `hs` crashed when components had no children or single text children.
*   **Solution:** Implemented robust argument handling using `...args` and array flattening to ensure `children` is always a consistent array.

### Import/Export Confusion
*   **Problem:** Browser errors like `Uncaught SyntaxError` and `404 Not Found`.
*   **Solution:** Switched to ES Modules (`type="module"` in script tags) and learned that browser imports require file extensions (e.g., `import ... from './index.js'`).

## Phase 2: Rendering & DOM Manipulation (Weeks 5-8)

### The `appendChild` Crash
*   **Problem:** `Uncaught TypeError: parent.appendChild is not a function`.
*   **Solution:** Discovered that the `patch` function was trying to append to a Virtual Node object instead of a real DOM element. We had to track the real DOM node (`$el`) on every VNode.

### Text Node Handling
*   **Problem:** Text didn't render or caused crashes because they aren't "elements".
*   **Solution:** Updated `render` to explicitly check for `nodeName === '#text'` and use `document.createTextNode`.

### Attribute vs. Property
*   **Problem:** `className` vs `class`, and event listeners not attaching.
*   **Solution:** Wrote specific logic to handle events (starts with `on`) separately from standard attributes.

## Phase 3: Diffing & Reactivity (Weeks 9-11)

### The "Stuck" UI
*   **Problem:** The UI rendered once but never updated.
*   **Solution:** Implemented the `patch` function to compare `oldVNode` vs `newVNode`.
*   **Critical Bug:** The initial `patch` logic had an early return `if (typeof old === typeof new)` which prevented valid updates. We removed this to allow proper diffing.

### Double Rendering
*   **Problem:** Calling `element()` multiple times caused the second call to overwrite the first.
*   **Solution:** Refactored the app structure to have a single root `app()` entry point that manages the entire tree.

## Phase 4: Modern Features (Weeks 12-13)

### Style Object Implementation
*   **Problem:** Passing style strings (`"color: red"`) was clumsy.
*   **Solution:** Refactored `render` to accept a style object and use `Object.assign` to apply styles dynamically.

### Implementing `useState`
*   **Problem:** How to make variables "persist" between function calls?
*   **Solution:** Built a global `hooks` array and `hookIndex`.
    *   **Challenge:** State was resetting or not updating.
    *   **Fix:** Created a `renderApp` helper to reset `hookIndex` to 0 on every render, ensuring hooks are read in the same order.
    *   **Fix:** Fixed an infinite loop/recursion issue by correctly separating the `setState` trigger from the component execution.

### Functional Component Support
*   **Problem:** `hs` didn't know what to do with `app(Counter)`.
*   **Solution:** Updated `hs` to check if `nodeName` is a function and execute it to resolve the VNode.

### Keyed Reconciliation (List Optimization)
*   **Problem:** Lists were updating inefficiently or incorrectly when items were reordered, as the diff algorithm only checked indexes.
*   **Solution:** Implemented a key-based diffing strategy in `patchChildren`.
    *   **Logic:** Created a map of old children by their `key`.
    *   **Result:** When iterating new children, we now look up the key in the map and reuse/move the existing DOM node instead of destroying and recreating it.

### Event Delegation
*   **Problem:** Attaching an event listener (like `onclick`) to every single element is memory-intensive and slow for large lists.
*   **Solution:** Implemented **Event Delegation** by attaching a single global listener to the `document`.
    *   **Logic:** Events "bubble up" from the target element. We store handlers on the DOM node (`_events` property) and use the global listener to find and execute the correct handler by walking up the DOM tree.

### Effect System (`useEffect`-style)
*   **Problem:** Needed a way to run side effects (logging, subscriptions, timers, etc.) after rendering, and to clean them up on re-renders.
*   **Solution:** Added an effect system inspired by `useEffect` using internal arrays (`hookStates`, `pendingEffects`, and `cleanupEffects`).
    *   **Logic:** During render, effect descriptors are queued with their dependencies; after commit, pending effects run, and any previous cleanup functions are executed before re-running changed effects.

---

*This project has evolved from a simple DOM creator to a stateful, reactive renderer capable of handling functional components and hooks.*