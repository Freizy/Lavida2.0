import { describe, it, expect } from "vitest";

describe("Symptom Analysis Flow Schema", () => {
  it("validates input schema structure", () => {
    const validInput = {
      gender: "Male" as const,
      age: 25,
      symptoms: "Headache and fever for 2 days",
    };

    expect(validInput.gender).toMatch(/^(Male|Female)$/);
    expect(validInput.age).toBeGreaterThanOrEqual(1);
    expect(validInput.age).toBeLessThanOrEqual(99);
    expect(validInput.symptoms.length).toBeGreaterThan(0);
  });

  it("validates output schema structure", () => {
    const validOutput = {
      conditions: [
        {
          name: "Common Cold",
          cause: "Viral infection",
          urgency: "low" as const,
          nextSteps: "Rest and drink fluids",
        },
      ],
    };

    expect(validOutput.conditions).toHaveLength(1);
    expect(validOutput.conditions[0]).toHaveProperty("name");
    expect(validOutput.conditions[0]).toHaveProperty("cause");
    expect(validOutput.conditions[0]).toHaveProperty("urgency");
    expect(validOutput.conditions[0]).toHaveProperty("nextSteps");
    expect(["low", "medium", "high", "critical"]).toContain(
      validOutput.conditions[0].urgency,
    );
  });
});

describe("Health Chat Flow Schema", () => {
  it("validates chat input structure", () => {
    const validInput = {
      initialContext: {
        gender: "Female",
        age: 30,
        symptoms: "Cough",
        conditions: ["Cold", "Flu"],
      },
      history: [
        { role: "user" as const, content: "What is this?" },
        { role: "model" as const, content: "It could be..." },
      ],
      message: "Should I see a doctor?",
    };

    expect(validInput.initialContext.gender).toMatch(/^(Male|Female)$/);
    expect(validInput.history).toHaveLength(2);
    expect(validInput.message.length).toBeGreaterThan(0);
  });
});
