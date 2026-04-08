# Introduction

## What is ofa.js?

ofa.js is an easy-to-use web front-end framework, specifically designed for building web applications, aiming to improve development efficiency and lower the development barrier.

> If you are already **basically familiar** with HTML, CSS, and JavaScript, then ofa.js is an excellent choice.

## Why I Developed ofa.js

The original intention of ofa.js is simple: to solve the **engineering** problems of Web development without relying on compilation tools.

> Engineering refers to the systematic integration of specifications, processes, tools, and methods in the software development process to improve development efficiency, code quality, and maintainability.

Over the past decade, front-end Web development has evolved from early-stage wild growth to gradual engineering. Drawing on the experience of traditional application development, this process has solved the engineering challenges of large-scale projects by introducing Node.js and build workflows.

However, as the project grew larger, the drawbacks of this model gradually became apparent, leading to the **monolithic application** problem faced in traditional development, making the project difficult to maintain and hindering the iteration of interactive requirements.

> A monolithic application refers to a large, tightly coupled single application where all functional modules are concentrated in a single codebase. Changing one part affects the whole, making independent development and deployment difficult.

At this point, the project needs to be broken down and micro-frontend-ized, just like **microservices**. However, due to compilation processing, micro-frontends become difficult and cumbersome; independent deployment of frontend modules requires compiling each small module, which is extremely hard, causing the development of Web frontend technology to almost stall.

Microservices is a software architectural style that breaks down large, complex applications into multiple fine-grained, independently deployable, and runnable small services.

At this moment, I began to ponder: traditional programming languages need to adapt to different hardware and operating systems, so they must rely on compilation to achieve cross-platform uniformity. However, web development is different. It is based on browsers and inherently does not require compilation; it can run and deploy independently, naturally adopting a micro-frontend architecture. Then I realized that it is the compilation process that actually complicates things.

That is to say, as long as the engineering issues are resolved and the necessary compilation step is removed, front-end development becomes very suitable for building large-scale applications, which is inherently a micro-frontend pattern. Thus, ofa.js was born.

## Core Strengths

### Zero Threshold, Ready to Use Out of the Box

No need to set up a development environment, install dependencies, or configure scaffolding. Simply open the official build tool through your browser and select a local directory to start development. All computation, data, and storage operations are performed locally without relying on cloud services.

### AI-Friendly, Easy to Verify

No compilation black box, AI-generated code can be quickly deployed and self-verified; reducing intermediate layers, bypassing the compilation process, making code easier to locate issues and fix.

### Native Micro-Frontend Support

ofa.js allows Web front-end development to be split into multiple independent modules, just like microservices, each of which can be developed and deployed independently. Once the traditional boundaries of Web front-end are broken, front-end technology will gradually transcend the limitations of server-side technology.

## Getting Started

- If you have some development background, you can start with [Script Introduction](./script-reference.md).
- If you are a beginner, it is recommended to start with [Creating Your First Application](./create-first-app.md).