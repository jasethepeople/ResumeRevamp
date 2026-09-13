import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { parseJasonClarkResume } from "./services/resumeParser";
import { optimizeResumeContent, generateATSScore, generateSuggestions } from "./services/openai";
import { generateResumePDF } from "./services/pdfGenerator";
import { ResumeDataSchema, OptimizationSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get initial resume data (Jason Clark's resume)
  app.get("/api/resume/initial", async (req, res) => {
    try {
      const resumeData = parseJasonClarkResume();
      res.json({ data: resumeData });
    } catch (error) {
      console.error("Error getting initial resume:", error);
      res.status(500).json({ message: "Failed to load initial resume data" });
    }
  });

  // Generate ATS score for resume
  app.post("/api/resume/ats-score", async (req, res) => {
    try {
      const { resumeData, targetField } = req.body;
      
      const parsedData = ResumeDataSchema.parse(resumeData);
      const atsScore = await generateATSScore(parsedData, targetField || "Information Technology");
      
      res.json({ atsScore });
    } catch (error: any) {
      console.error("Error generating ATS score:", error);
      res.status(500).json({ message: error.message || "Failed to analyze ATS compatibility" });
    }
  });

  // Get AI suggestions for resume improvement
  app.post("/api/resume/suggestions", async (req, res) => {
    try {
      const { resumeData, targetField } = req.body;
      
      const parsedData = ResumeDataSchema.parse(resumeData);
      const suggestions = await generateSuggestions(parsedData, targetField || "Information Technology");
      
      res.json({ suggestions });
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ message: error.message || "Failed to generate suggestions" });
    }
  });

  // Optimize resume with AI
  app.post("/api/resume/optimize", async (req, res) => {
    try {
      const { resumeData, settings } = req.body;
      
      const parsedData = ResumeDataSchema.parse(resumeData);
      const parsedSettings = OptimizationSettingsSchema.parse(settings);
      
      const optimizedData = await optimizeResumeContent(parsedData, parsedSettings);
      
      res.json({ optimizedData });
    } catch (error: any) {
      console.error("Error optimizing resume:", error);
      res.status(500).json({ message: error.message || "Failed to optimize resume" });
    }
  });

  // Generate PDF download
  app.post("/api/resume/download-pdf", async (req, res) => {
    try {
      const { resumeData } = req.body;
      
      const parsedData = ResumeDataSchema.parse(resumeData);
      const pdfBuffer = await generateResumePDF(parsedData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${parsedData.name.replace(/\s+/g, '_')}_Resume.pdf"`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: error.message || "Failed to generate PDF" });
    }
  });

  // Save resume (for future persistence)
  app.post("/api/resume/save", async (req, res) => {
    try {
      const { originalContent, optimizedContent, parsedData, atsScore, optimizationSettings } = req.body;
      
      const resume = await storage.createResume({
        userId: null, // For now, not tied to specific user
        originalContent,
        optimizedContent,
        parsedData,
        atsScore,
        optimizationSettings
      });
      
      res.json({ resume });
    } catch (error: any) {
      console.error("Error saving resume:", error);
      res.status(500).json({ message: error.message || "Failed to save resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
