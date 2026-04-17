import { RocketZoneId } from "./rocketZones";

export type RocketContentItem = {
  title: string;
  body: string;
  meta?: string;
};

export type RocketContentSection = {
  heading: string;
  items: RocketContentItem[];
};

export type RocketContentEntry = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: RocketContentSection[];
};

export const ROCKET_CONTENT: Record<RocketZoneId, RocketContentEntry> = {
  noseVision: {
    eyebrow: "Forward Observatory",
    title: "Vision And Future Direction",
    intro:
      "This chamber frames long-range goals, future builds, and the kind of systems I want to shape over the next phase of my work.",
    sections: [
      {
        heading: "Goals",
        items: [
          {
            title: "Build Work With Depth",
            body: "Create products that feel technically serious, visually intentional, and meaningful to the people using them.",
          },
          {
            title: "Keep Raising The Bar",
            body: "Grow into larger systems, sharper execution, and more ambitious problem spaces across software and interactive experiences.",
          },
        ],
      },
      {
        heading: "Future Builds",
        items: [
          {
            title: "AI-Powered Tools",
            body: "Explore products that combine strong interfaces with intelligent systems and practical day-to-day utility.",
          },
          {
            title: "Immersive Digital Experiences",
            body: "Build interfaces that feel less like pages and more like environments, instruments, or worlds.",
          },
        ],
      },
    ],
  },
  upperBodyCoding: {
    eyebrow: "Control Room",
    title: "Coding Systems",
    intro:
      "Software work is presented here as a live system: projects, tooling, and technical strengths arranged like mission controls inside the upper hull.",
    sections: [
      {
        heading: "Projects",
        items: [
          {
            title: "Trading Bot",
            body: "An automated trading project focused on strategy execution, market inputs, and reliable decision flows.",
            meta: "Tech: TypeScript, APIs, automation logic, data handling",
          },
          {
            title: "Web App",
            body: "A structured application built around responsive UI, clean interaction flow, and modern frontend architecture.",
          },
        ],
      },
      {
        heading: "Skills",
        items: [
          {
            title: "Frontend Stack",
            body: "React, TypeScript, JavaScript, component systems, API integration, and UI architecture.",
          },
          {
            title: "Working Style",
            body: "Systems thinking, iteration, visual polish, and building with both performance and maintainability in mind.",
          },
        ],
      },
    ],
  },
  coreAchievements: {
    eyebrow: "Milestone Core",
    title: "Achievements And Momentum",
    intro:
      "The center of the rocket holds the record of progress so far: work experience, academic wins, and competitive environments that shaped execution.",
    sections: [
      {
        heading: "Professional Experience",
        items: [
          {
            title: "Internship",
            body: "Hands-on experience in a real-world environment that strengthened practical engineering habits, ownership, and delivery.",
          },
        ],
      },
      {
        heading: "Academic Highlights",
        items: [
          {
            title: "Technical Growth",
            body: "Steady progress through challenging coursework, sharper problem solving, and stronger discipline around learning.",
          },
        ],
      },
      {
        heading: "Competitions",
        items: [
          {
            title: "Competitive Problem Solving",
            body: "Competitive settings that demanded speed, composure, and clarity under pressure.",
          },
        ],
      },
    ],
  },
  lowerBodyEngineering: {
    eyebrow: "Engineering Bay",
    title: "Mechanical And Build Thinking",
    intro:
      "This subsystem is about how things are put together: structural logic, mechanical curiosity, and the interest in systems that perform under load.",
    sections: [
      {
        heading: "Mechanical Interests",
        items: [
          {
            title: "Systems That Work Physically",
            body: "An interest in mechanical structures, function-driven design, and the relationship between form, stress, and performance.",
          },
        ],
      },
      {
        heading: "Projects Or Concepts",
        items: [
          {
            title: "Engineering Concepts",
            body: "Build-oriented ideas centered on reliability, optimization, assembly, and the logic behind moving parts.",
          },
          {
            title: "Hands-On Curiosity",
            body: "A practical drive to understand how components interact, fail, and improve in real systems.",
          },
        ],
      },
    ],
  },
  thrustersDrive: {
    eyebrow: "Propulsion Core",
    title: "Drive And Ambition",
    intro:
      "The engine section speaks to the internal force behind the work: discipline, ambition, and the push toward harder and more meaningful projects.",
    sections: [
      {
        heading: "Motivation",
        items: [
          {
            title: "Constant Forward Pressure",
            body: "A strong desire to keep building, keep refining, and keep stepping into more demanding technical work.",
          },
        ],
      },
      {
        heading: "Ambition",
        items: [
          {
            title: "Bigger Systems Ahead",
            body: "The long-term direction is toward more advanced software, sharper engineering judgment, and work with real impact.",
          },
        ],
      },
    ],
  },
};
