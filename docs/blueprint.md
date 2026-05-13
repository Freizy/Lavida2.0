# **App Name**: LaVidaWeb

## Core Features:

- Dynamic Health Input Form: A centralized 320px layout allowing users to input age, gender, and specific symptoms.
- AI Symptom Analysis Tool: An AI-powered tool using the Google Gemini API to analyze user symptoms and provide 5 possible conditions with causes and next steps.
- Context-Aware Action Button: Interactive button that toggles between 'Checking...' and 'Check Symptoms' with disabled states during API processing.
- Intelligent Error Feedback Panel: Custom error display mechanism featuring high-contrast text on a light red background to communicate input validation issues.
- Live Analysis Loading Interface: Visual feedback system utilizing a specific loading GIF to inform users while the health assistant generates content.
- Semantic Result Formatter: A safe parsing component that renders the Gemini response text as readable, paragraph-structured content without using unsafe inner HTML.
- Server-Side AI Proxy: A secure API route ensuring protected interaction with the Generative Language API via environment-stored keys.

## Style Guidelines:

- Primary Color: Health Green (#27EB04) used for active states and critical interface elements.
- Error Color Palette: A combination of Soft Red (#FFECEA) for panels and Deep Crimson (#B02020) for semantic text warnings.
- Background: A clean, minimally desaturated greenish-white to maintain a clinical and trustworthy feel.
- Headline and body font: 'PT Sans' for its humanist warmth and professional readability; code and data font: 'Source Code Pro' if displaying server logs.
- Simple, crisp health-themed icons and emojis used sparingly to maintain focus on medical information.
- Strict centered layout focused on a 320px column width for mobile-first accessibility and clarity.
- Micro-interactions on buttons and a consistent 10rem wide centered loading GIF for continuous feedback during analysis.