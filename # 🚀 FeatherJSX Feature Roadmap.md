# 🚀 FeatherJSX Feature Roadmap

This document tracks the planned features and improvements for the FeatherJSX renderer.

## 🏗️ Core Renderer Improvements
- [*] **SVG Support**
    - *Goal:* Render `<svg>`, `<path>`, `<circle>`, etc.
    - *Task:* Update `render` function to use `document.createElementNS` when the tag is an SVG element.
- [ ] **Fragments (`<>...</>`)**
    - *Goal:* Return multiple elements from a component without a parent `div`.
    - *Task:* Handle a special `Fragment` symbol in `hs` and flatten the children arrays in `render`/`patch`.
- [ ] **Style Normalization**
    - *Goal:* Write `style={{ width: 100 }}` instead of `style={{ width: '100px' }}`.
    - *Task:* Automatically append `px` to numeric values for specific CSS properties in the `render` function.

## 🎣 Hooks System Expansion
- [ ] **`useRef`**
    - *Goal:* Access real DOM elements directly (e.g., for `input.focus()`).
    - *Task:* Create a hook that returns a mutable object `{ current: null }` and assign `vnode.$el` to it during render.
- [ ] **`useMemo` & `useCallback`**
    - *Goal:* Optimize performance by skipping calculations/allocations if dependencies haven't changed.
    - *Task:* Implement memoization logic similar to `useEffect` but for returning values/functions.
- [ ] **`useContext`**
    - *Goal:* Avoid "prop drilling" (passing data down 5 layers).
    - *Task:* Create `createContext` (Provider) and `useContext` (Consumer) to share global state.
- [ ] **`useReducer`**
    - *Goal:* Manage complex state logic (Redux-style).
    - *Task:* Implement the `(state, action) => newState` pattern using `useState` internally.

## 🌐 Routing & Navigation
- [ ] **Client-Side Router**
    - *Goal:* Navigate between "pages" without refreshing the browser.
    - *Task:* Create `Router`, `Route`, and `Link` components that listen to `window.history` or hash changes.

## 🛠️ Developer Experience & Utils
- [Done] **Error Boundaries**
    - *Goal:* Prevent the entire app from crashing if one component fails.
    - *Task:* Wrap `render` calls in `try/catch` blocks and display a fallback UI on error.
- [ ] **Controlled Inputs**
    - *Goal:* robust handling of form inputs.
    - *Task:* Ensure `value` and `onInput` work seamlessly for `<input>`, `<textarea>`, and `<select>`.