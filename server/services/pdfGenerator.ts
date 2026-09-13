import puppeteer from 'puppeteer';
import { ResumeData } from '@shared/schema';
import fs from 'node:fs';

export async function generateResumePDF(resumeData: ResumeData): Promise<Buffer> {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
    || (fs.existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    const htmlContent = generateResumeHTML(resumeData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.warn("Browser PDF generation unavailable; using the built-in PDF renderer.", error instanceof Error ? error.message : error);
    return generatePlainTextPDF(resumeData);
  } finally {
    await browser?.close();
  }
}

function escapePdfText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(value: string, maxLength = 92): string[] {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

function generatePlainTextPDF(data: ResumeData): Buffer {
  const lines: string[] = [
    data.name,
    `${data.phone} | ${data.email} | ${data.location}${data.linkedin ? ` | ${data.linkedin}` : ""}`,
    "",
    "PROFESSIONAL SUMMARY",
    ...wrapText(data.summary),
    "",
    "TECHNICAL SKILLS",
    ...data.skills.flatMap((skill) => [`${skill.category}:`, ...wrapText(skill.items)]),
    "",
    "PROFESSIONAL EXPERIENCE",
    ...data.experience.flatMap((experience) => [
      `${experience.title} | ${experience.company} | ${experience.location} | ${experience.dates}`,
      ...experience.achievements.flatMap((achievement) => wrapText(`• ${achievement}`, 88)),
      "",
    ]),
    "EDUCATION",
    ...data.education.flatMap((education) => [
      `${education.degree} | ${education.field}`,
      `${education.school} | ${education.dates}`,
    ]),
  ];

  const pageHeight = 720;
  const lineHeight = 14;
  const linesPerPage = 48;
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) pages.push(lines.slice(i, i + linesPerPage));

  const objects: string[] = [];
  const pageIds: number[] = [];
  const fontId = 3;
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [PLACEHOLDER] /Count 0 >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  for (const pageLines of pages) {
    const content = [
      "BT",
      "/F1 10 Tf",
      "50 760 Td",
      ...pageLines.flatMap((line, index) => [
        index === 0 ? `/F1 16 Tf (${escapePdfText(line)}) Tj` : `/F1 10 Tf (${escapePdfText(line)}) Tj`,
        "0 -14 Td",
      ]),
      "ET",
    ].join("\n");
    const contentId = objects.length + 1;
    objects.push(`<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`);
    const pageId = objects.length + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  }
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index++) pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

function generateResumeHTML(data: ResumeData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.4;
            color: #1e293b;
            font-size: 11pt;
        }
        
        .container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20pt;
            padding-bottom: 12pt;
            border-bottom: 1pt solid #e2e8f0;
        }
        
        .name {
            font-size: 22pt;
            font-weight: 700;
            margin-bottom: 8pt;
            text-transform: uppercase;
            letter-spacing: 1pt;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #64748b;
        }
        
        .section {
            margin-bottom: 16pt;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 8pt;
            color: #1e293b;
            letter-spacing: 0.5pt;
        }
        
        .summary {
            text-align: justify;
            line-height: 1.5;
        }
        
        .skills-category {
            margin-bottom: 6pt;
        }
        
        .skills-category-title {
            font-weight: 600;
            margin-bottom: 2pt;
        }
        
        .experience-item {
            margin-bottom: 12pt;
            page-break-inside: avoid;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4pt;
        }
        
        .job-title {
            font-weight: 700;
            font-size: 11pt;
        }
        
        .company {
            font-size: 10pt;
            color: #64748b;
            margin-bottom: 2pt;
        }
        
        .dates {
            font-size: 10pt;
            color: #64748b;
            white-space: nowrap;
        }
        
        .achievements {
            list-style: none;
            padding-left: 0;
        }
        
        .achievements li {
            margin-bottom: 3pt;
            padding-left: 12pt;
            position: relative;
        }
        
        .achievements li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: #64748b;
        }
        
        .education-item {
            margin-bottom: 6pt;
        }
        
        .degree {
            font-weight: 600;
        }
        
        .school {
            font-size: 10pt;
            color: #64748b;
        }
        
        @media print {
            body { print-color-adjust: exact; }
            .container { margin: 0; padding: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="name">${data.name}</h1>
            <div class="contact-info">
                ${data.phone} | ${data.email} | ${data.location}${data.linkedin ? ` | ${data.linkedin}` : ''}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary">${data.summary}</p>
        </div>

        <div class="section">
            <h2 class="section-title">Technical Skills</h2>
            ${data.skills.map(skill => `
                <div class="skills-category">
                    <div class="skills-category-title">${skill.category}:</div>
                    <div>${skill.items}</div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${data.experience.map(exp => `
                <div class="experience-item">
                    <div class="job-header">
                        <div>
                            <div class="job-title">${exp.title}</div>
                            <div class="company">${exp.company} | ${exp.location}</div>
                        </div>
                        <div class="dates">${exp.dates}</div>
                    </div>
                    <ul class="achievements">
                        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2 class="section-title">Education</h2>
            ${data.education.map(edu => `
                <div class="education-item">
                    <div class="degree">${edu.degree} | ${edu.field}</div>
                    <div class="school">${edu.school} | ${edu.dates}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
}
