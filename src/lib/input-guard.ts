const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(a|an|the)\s+/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /system\s*:\s*/i,
  /\[system\]/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\/?s>/i,
  /act\s+as\s+(?:a\s+)?(?:different|new|another)/i,
  /pretend\s+(?:you\s+are|to\s+be)\s+/i,
  /new\s+instructions?\s*:/i,
  /override\s+(?:your|the|all)\s+(?:rules|instructions)/i,
  /forget\s+(?:your|the|all)\s+(?:rules|instructions)/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /do\s+anything\s+now/i,
];

const MAX_SYMPTOM_LENGTH = 2000;
const MAX_CHAT_MESSAGE_LENGTH = 1000;

export function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function sanitizeInput(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

export function validateSymptomInput(symptoms: string): string | null {
  const sanitized = sanitizeInput(symptoms);
  if (sanitized.length === 0) return "Symptoms cannot be empty.";
  if (sanitized.length > MAX_SYMPTOM_LENGTH) {
    return `Symptoms must be under ${MAX_SYMPTOM_LENGTH} characters.`;
  }
  if (detectPromptInjection(sanitized)) {
    return "Your input contains restricted content. Please describe your symptoms naturally.";
  }
  return null;
}

export function validateChatMessage(message: string): string | null {
  const sanitized = sanitizeInput(message);
  if (sanitized.length === 0) return "Message cannot be empty.";
  if (sanitized.length > MAX_CHAT_MESSAGE_LENGTH) {
    return `Message must be under ${MAX_CHAT_MESSAGE_LENGTH} characters.`;
  }
  if (detectPromptInjection(sanitized)) {
    return "Your message contains restricted content. Please ask health-related questions.";
  }
  return null;
}
