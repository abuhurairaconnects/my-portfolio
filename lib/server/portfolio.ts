import fs from "fs";
import path from "path";
import { PortfolioData } from "@/lib/validations";
import staticPortfolio from "@/data/portfolio.json";

export function getPortfolioData(): PortfolioData {
  try {
    const filePath = path.join(process.cwd(), "data", "portfolio.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as PortfolioData;
    }
  } catch (error) {
    console.warn("Falling back to static portfolio data in getPortfolioData:", error);
  }
  return staticPortfolio as unknown as PortfolioData;
}
