import OpenAI from "openai";
import type { ResumeData, ATSScore, OptimizationSettings } from "@shared/schema";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

function getConfiguredOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR;
  if (!apiKey || apiKey.startsWith("sk-default") || apiKey.includes("your-api-key")) {
    return null;
  }
  return new OpenAI({ apiKey });
}

const FIELD_KEYWORDS: Record<string, string[]> = {
  "information technology": ["IT operations", "systems administration", "network security", "incident response", "cloud infrastructure"],
  "data analytics": ["SQL", "data visualization", "reporting", "data quality", "business intelligence"],
  "quality assurance": ["quality assurance", "process validation", "root cause analysis", "continuous improvement", "compliance"],
  "network administration": ["LAN/WAN", "TCP/IP", "network monitoring", "firewall administration", "troubleshooting"],
  "systems engineering": ["systems architecture", "automation", "infrastructure", "systems integration", "technical documentation"],
};

function fieldKeywords(targetField: string): string[] {
  const normalized = targetField.toLowerCase();
  return Object.entries(FIELD_KEYWORDS).find(([field]) => normalized.includes(field))?.[1]
    || FIELD_KEYWORDS["information technology"];
}

function resumeText(resumeData: ResumeData): string {
  return JSON.stringify(resumeData).toLowerCase();
}

function localATSScore(resumeData: ResumeData, targetField: string): ATSScore {
  const text = resumeText(resumeData);
  const keywords = fieldKeywords(targetField);
  const keywordHits = keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
  const keywordOptimization = Math.min(98, 50 + keywordHits * 9 + (resumeData.skills.length >= 3 ? 8 : 0));
  const quantifiedBullets = resumeData.experience
    .flatMap((experience) => experience.achievements)
    .filter((achievement) => /\d+%|\d+[\s-]*(?:years?|months?|hours?|users?|issues?|projects?)/i.test(achievement))
    .length;
  const totalBullets = Math.max(1, resumeData.experience.flatMap((experience) => experience.achievements).length);
  const formatCompatibility = Math.min(98, 78 + (resumeData.linkedin ? 5 : 0) + (quantifiedBullets > 0 ? 8 : 0));
  const sectionStructure = Math.min(100, 70 + (resumeData.summary ? 8 : 0) + (resumeData.skills.length ? 8 : 0) + (resumeData.experience.length ? 8 : 0) + (resumeData.education.length ? 6 : 0));
  const suggestions: ATSScore["suggestions"] = [];

  if (keywordHits < Math.ceil(keywords.length / 2)) {
    suggestions.push({
      type: "keyword",
      title: `Add more ${targetField} keywords`,
      description: `Include relevant terms such as ${keywords.slice(0, 3).join(", ")} where they accurately describe your experience.`,
      priority: "high",
    });
  }
  if (quantifiedBullets / totalBullets < 0.35) {
    suggestions.push({
      type: "achievement",
      title: "Quantify more accomplishments",
      description: "Add measurable outcomes such as percentages, time saved, uptime, volume, or defect reduction to more experience bullets.",
      priority: "medium",
    });
  }
  if (!resumeData.linkedin) {
    suggestions.push({
      type: "format",
      title: "Add a LinkedIn profile",
      description: "A complete professional profile link gives recruiters another way to verify your experience.",
      priority: "low",
    });
  }
  if (!resumeData.summary || resumeData.summary.length < 80) {
    suggestions.push({
      type: "structure",
      title: "Strengthen the professional summary",
      description: "Use two or three sentences that connect your experience, strengths, and target role.",
      priority: "medium",
    });
  }

  return {
    overall: Math.round((keywordOptimization + formatCompatibility + sectionStructure) / 3),
    keywordOptimization,
    formatCompatibility,
    sectionStructure,
    suggestions: suggestions.slice(0, 5),
  };
}

function localSuggestions(resumeData: ResumeData, targetField: string) {
  return localATSScore(resumeData, targetField).suggestions.map((suggestion) => ({
    type: suggestion.type,
    title: suggestion.title,
    description: suggestion.description,
    priority: suggestion.priority,
  }));
}

function localOptimize(resumeData: ResumeData, settings: OptimizationSettings): ResumeData {
  const optimized: ResumeData = JSON.parse(JSON.stringify(resumeData));
  const keywords = fieldKeywords(settings.targetJobField);
  const allText = resumeText(optimized);

  if (settings.keywordEnhancement) {
    const missingKeywords = keywords.filter((keyword) => !allText.includes(keyword.toLowerCase()));
    if (missingKeywords.length) {
      const targetSkill = optimized.skills[0];
      if (targetSkill) {
        targetSkill.items = `${targetSkill.items}, ${missingKeywords.slice(0, 3).join(", ")}`;
      } else {
        optimized.skills.push({ category: "Target Role Skills", items: missingKeywords.slice(0, 3).join(", ") });
      }
    }
  }

  if (settings.skillsEnhancement) {
    optimized.skills = optimized.skills.map((skill) => ({
      ...skill,
      items: Array.from(new Set(skill.items.split(",").map((item) => item.trim()).filter(Boolean))).join(", "),
    }));
  }

  if (settings.impactStatements) {
    const actionVerbs = ["Led", "Improved", "Implemented", "Optimized", "Delivered", "Managed"];
    optimized.experience = optimized.experience.map((experience) => ({
      ...experience,
      achievements: experience.achievements.map((achievement, index) => {
        const trimmed = achievement.trim();
        if (!trimmed) return trimmed;
        const startsWithActionVerb = actionVerbs.some((verb) => trimmed.toLowerCase().startsWith(`${verb.toLowerCase()} `));
        if (startsWithActionVerb) return trimmed;
        const withoutPrefix = trimmed.replace(/^(responsible for|helped to|worked on|was responsible for)\s+/i, "");
        return `${actionVerbs[index % actionVerbs.length]} ${withoutPrefix.charAt(0).toLowerCase()}${withoutPrefix.slice(1)}`;
      }),
    }));
  }

  if (settings.summaryOptimization) {
    const level = settings.experienceLevel === "senior" ? "Senior" : settings.experienceLevel === "mid" ? "Experienced" : "Motivated";
    const focus = keywords.slice(0, 2).join(" and ");
    optimized.summary = `${level} ${settings.targetJobField} professional specializing in ${focus}. ${optimized.summary.trim()}`;
  }

  return optimized;
}

export async function optimizeResumeContent(
  resumeData: ResumeData,
  settings: OptimizationSettings
): Promise<ResumeData> {
  const prompt = `
You are an expert resume writer and ATS optimization specialist. Optimize the following resume based on these settings:

Target Job Field: ${settings.targetJobField}
Experience Level: ${settings.experienceLevel}
Keyword Enhancement: ${settings.keywordEnhancement}
Impact Statements: ${settings.impactStatements}
Summary Optimization: ${settings.summaryOptimization}
Skills Enhancement: ${settings.skillsEnhancement}

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Please optimize the resume and return the improved version in the exact same JSON structure. Focus on:
1. Adding relevant keywords for the target job field
2. Quantifying achievements with metrics where possible
3. Using strong action verbs and impact-focused language
4. Optimizing for ATS parsing and keyword matching
5. Maintaining professional tone and accuracy

Return only valid JSON with the optimized resume data.
`;

  const openai = getConfiguredOpenAI();
  if (!openai) return localOptimize(resumeData, settings);

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert resume optimization AI. Return only valid JSON with optimized resume content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const optimizedData = JSON.parse(response.choices[0].message.content || "{}");
    return optimizedData as ResumeData;
  } catch (error) {
    console.warn("OpenAI optimization unavailable; using local optimization.", error instanceof Error ? error.message : error);
    return localOptimize(resumeData, settings);
  }
}

export async function generateATSScore(resumeData: ResumeData, targetField: string): Promise<ATSScore> {
  const prompt = `
Analyze this resume for ATS (Applicant Tracking System) compatibility targeting ${targetField} roles.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Provide an ATS compatibility analysis with:
1. Overall score (0-100)
2. Keyword optimization score (0-100)
3. Format compatibility score (0-100)
4. Section structure score (0-100)
5. Specific suggestions for improvement

Return the analysis in this JSON format:
{
  "overall": number,
  "keywordOptimization": number,
  "formatCompatibility": number,
  "sectionStructure": number,
  "suggestions": [
    {
      "type": "keyword|format|structure",
      "title": "Brief suggestion title",
      "description": "Detailed explanation",
      "priority": "high|medium|low"
    }
  ]
}
`;

  const openai = getConfiguredOpenAI();
  if (!openai) return localATSScore(resumeData, targetField);

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an ATS analysis expert. Return only valid JSON with scoring and suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const atsScore = JSON.parse(response.choices[0].message.content || "{}");
    return atsScore as ATSScore;
  } catch (error) {
    console.warn("OpenAI ATS analysis unavailable; using local analysis.", error instanceof Error ? error.message : error);
    return localATSScore(resumeData, targetField);
  }
}

export async function generateSuggestions(resumeData: ResumeData, targetField: string): Promise<Array<{
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}>> {
  const prompt = `
Review this resume for ${targetField} roles and provide 3-5 specific, actionable improvement suggestions.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return suggestions in this JSON format:
{
  "suggestions": [
    {
      "type": "keyword|achievement|format|skills",
      "title": "Brief actionable title",
      "description": "Specific advice on what to change and why",
      "priority": "high|medium|low"
    }
  ]
}
`;

  const openai = getConfiguredOpenAI();
  if (!openai) return localSuggestions(resumeData, targetField);

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a resume improvement advisor. Provide specific, actionable suggestions in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.suggestions || [];
  } catch (error) {
    console.warn("OpenAI suggestions unavailable; using local analysis.", error instanceof Error ? error.message : error);
    return localSuggestions(resumeData, targetField);
  }
}
