import fs from "fs";
import path from "path";
import { portfolioSchema, PortfolioData } from "../lib/validations";

const FORBIDDEN_WORDS = [
  "lorem ipsum",
  "your name",
  "insert bio here",
  "placeholder",
  "todo",
];

function validateContent(): void {
  console.log("[Validation] Starting portfolio content validation...");

  const dataPath = path.join(process.cwd(), "data", "portfolio.json");
  const rawContent = fs.readFileSync(dataPath, "utf-8");
  const portfolio: PortfolioData = JSON.parse(rawContent);

  // 1. Zod Schema Verification
  const parseResult = portfolioSchema.safeParse(portfolio);
  if (!parseResult.success) {
    console.error("[Validation Failed] Schema validation errors found:");
    parseResult.error.errors.forEach((err) => {
      console.error(`   - ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }
  console.log("[Validation] Zod schema passed successfully.");

  // 2. Scan string fields for forbidden words / placeholders
  const isProduction = process.env.NODE_ENV === "production";
  const jsonString = JSON.stringify(portfolio).toLowerCase();
  const violations: string[] = [];

  for (const word of FORBIDDEN_WORDS) {
    if (jsonString.includes(word)) {
      violations.push(`Found forbidden term or placeholder: "${word}"`);
    }
  }

  // 3. Check projects data completeness
  portfolio.projects.forEach((proj, idx) => {
    if (!proj.title || !proj.summary || !proj.problem || !proj.solution) {
      violations.push(
        `Project at index ${idx} (${proj.slug || "unnamed"}) is missing core problem/solution data.`
      );
    }
    if (proj.impact && proj.impact.length === 0) {
      violations.push(
        `Project "${proj.title}" has an empty impact array. Omit the impact field completely if unverified.`
      );
    }
  });

  if (violations.length > 0) {
    if (isProduction) {
      console.error("[Validation Failed] Production build rejected due to content policy violations:");
      violations.forEach((v) => console.error(`   - ${v}`));
      process.exit(1);
    } else {
      console.warn("[Validation Warning] Content recommendations for development:");
      violations.forEach((v) => console.warn(`   - ${v}`));
    }
  } else {
    console.log("[Validation] All anti-fabrication and strict positioning checks passed.");
  }
}

validateContent();
