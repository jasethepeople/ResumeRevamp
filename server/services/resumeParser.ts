import { ResumeData } from '@shared/schema';

export function parseJasonClarkResume(): ResumeData {
  return {
    name: "JASON CLARK",
    phone: "(801) 300-1201",
    email: "realjasontclark@gmail.com",
    location: "Willard, UT 84340",
    linkedin: "LinkedIn.com/in/JasonClark",
    summary: "Highly accomplished and results-oriented professional with 25+ years of experience across Information Systems, Quality Control, and Advanced Manufacturing. Holds a Master of Science in Information Systems. Proven expertise in network architecture, data management, process improvement, and quality assurance, with a demonstrated track record of optimizing operational efficiency, reducing defects, and enhancing system reliability. Adept at troubleshooting complex technical issues, designing custom data systems, and leading cross-functional teams to achieve measurable business outcomes. Seeking to leverage diverse technical and leadership skills in a challenging IT Operations Manager, Senior Network Administrator, or Data Quality Specialist position.",
    skills: [
      {
        category: "Information Systems & Networking",
        items: "Network Architecture, Hardware Installation & Configuration, Performance Monitoring, Advanced Troubleshooting, Network Security (Firewall Configuration, Encryption), User Support, Backup Management, Cloud Computing, LAN/WAN Management, TCP/IP, OSPF, BGP, Cisco Routers/Switches."
      },
      {
        category: "Data Management & Analytics",
        items: "Custom Data System Design, Data Storage & Retrieval, Data Analysis, Data Quality Assurance, SQL, Microsoft Excel, Data Visualization."
      },
      {
        category: "Quality & Process Improvement",
        items: "Quality Control, Process Improvement, Operational Efficiency, Process Validation, Material Analysis, Defect Reduction, Quality Assurance, Lean Principles, 5S Methodology, Kaizen."
      },
      {
        category: "Manufacturing & Machine Operations",
        items: "NC Turret Presses, Brake Presses, Upright Mills, Lathes, Die Setting, Fabrication, Machine Operation, Punch Press Operation, Saw Operation, Slitter Operation, Quality Inspection, Safety Protocols."
      },
      {
        category: "Soft Skills",
        items: "Strategic Communication, Collaborative Leadership, Teamwork, Complex Problem-Solving, Adaptability, Strong Work Ethic, Time Management, Meticulous Attention to Detail."
      }
    ],
    experience: [
      {
        title: "COMPUTER CONSULTANT",
        company: "Victoria Supply Company",
        location: "Ramona, CA",
        dates: "May 2019 – Present",
        achievements: [
          "Designed and implemented robust computer network architecture for a growing organization, significantly enhancing system reliability and operational efficiency.",
          "Administered and optimized comprehensive computer networks, maintaining 99.9% uptime and resolving over 300 technical issues annually, ensuring seamless business operations and user productivity.",
          "Developed and deployed custom data storage and retrieval systems (e.g., SQL-based) that improved data accessibility by 35% and reduced manual data processing time by 10 hours per week.",
          "Implemented and managed comprehensive network security measures, reducing potential security incidents by 20% and ensuring critical data integrity.",
          "Continuously updated computer network infrastructure with new technology, integrating solutions that improved system performance and scalability."
        ]
      },
      {
        title: "QUALITY CONTROL & LABORATORY TECHNICIAN",
        company: "Biofire Diagnostics",
        location: "Salt Lake City, UT",
        dates: "January 2018 – May 2019",
        achievements: [
          "Oversaw product testing, material analysis, and process validation for diverse diagnostic products, ensuring 100% compliance with industry standards.",
          "Conducted rigorous laboratory experiments and analyzed results, meticulously maintaining specialized equipment to support quality assurance and enhance operational efficiency by 15%.",
          "Performed precise laboratory testing on raw materials and finished products using spectrometers, calipers, and micrometers, verifying conformance to specifications and reducing material waste by 10%.",
          "Developed and implemented new quality control protocols that reduced production defects by 12% and improved overall product quality.",
          "Designed and maintained custom data systems to store, retrieve, and analyze laboratory and quality control data, accelerating reporting time by 25% and providing critical insights for process improvements.",
          "Troubleshot complex technical issues in testing equipment and laboratory workflows, ensuring consistent accuracy and reliability of results.",
          "Collaborated effectively with production teams to integrate quality control findings into process improvements, fostering a culture of continuous enhancement."
        ]
      },
      {
        title: "NC TURRET PRESS/BRAKE PRESS/UPRIGHT MILL/LATHE OPERATOR",
        company: "Metalcraft Technologies Inc.",
        location: "Cedar City, UT",
        dates: "March 1993 – September 2004",
        achievements: [
          "Operated and maintained complex machinery, including NC turret presses, brake presses, mills, and lathes, ensuring high-quality fabrication output and adherence to production schedules.",
          "Installed, aligned, and locked specified punches and dies, precisely setting up machines for efficient and accurate production runs.",
          "Positioned guides and holding blocks to secure and direct workpieces, minimizing errors and optimizing material utilization.",
          "Measured completed workpieces to verify conformance to specifications using micrometers, gauges, and calipers, contributing to a 99% quality acceptance rate.",
          "Adhered to strict safety protocols, maintaining a safe working environment and reducing workplace incidents."
        ]
      }
    ],
    education: [
      {
        degree: "MASTER OF SCIENCE",
        field: "Information Systems",
        school: "San Diego State University",
        dates: "2005-2009"
      }
    ]
  };
}
