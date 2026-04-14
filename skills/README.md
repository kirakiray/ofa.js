# ofa.js Skills

Collection of skills for working with ofa.js framework.

---

## ofajs-docs

**Description:** ofa.js framework documentation skill. Use when user asks about ofa.js concepts, tutorials, component development, state management, or wants to learn how to build web apps with ofa.js.

**When to invoke:** User asks about ofa.js framework, wants to build web applications without build tools, asks about components, templates, event binding, state management, micro-frontend architecture, or wants to learn ofa.js basics.

**Location:** `./ofajs-docs/SKILL.md`

**Topics covered:**
- What is ofa.js
- Basic page structure (index.html + page modules)
- Template syntax (text rendering, HTML rendering, event binding, property binding)
- Creating components (tag, l-m, load method)
- Lifecycle hooks (ready, attached, loaded, detached)
- State management ($.stanz reactive state)
- Slots
- Router/SPA

---

## ofajs-api

**Description:** ofa.js API reference skill. Use when user asks about ofa.js instance methods ($ , all, clone), DOM operations (before, after, remove), property manipulation (text, html, css, style, classList), event handling (on, emit, off), or component APIs (o-app).

**When to invoke:** User asks about specific ofa.js API methods, needs to manipulate DOM elements, asks about event handling, needs to work with component instances, asks about o-app navigation methods, or asks about stanz reactive features.

**Location:** `./ofajs-api/SKILL.md`

**Topics covered:**
- Instance methods: $, all, shadow, prev, next, siblings, parent, parents, clone, root, host, app, children
- DOM operations: before, after, remove, push, wrap
- Property operations: text, html, css, style, classList, attr, data
- Event operations: on, emit, off, one
- Stanz features: watch, watchTick, unwatch
- o-app component: goto, replace, back, current, routers
