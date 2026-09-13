'use client';

import React, { useState } from 'react';
import { 
  Linkedin, 
  Heart, 
  MessageSquare, 
  ExternalLink, 
  Share2, 
  ThumbsUp, 
  MoreHorizontal, 
  Globe, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface LinkedInPost {
  id: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    profileUrl: string;
    verified?: boolean;
  };
  timeAgo: string;
  content: string;
  tags: string[];
  metrics: {
    likes: number;
    comments: number;
  };
  postUrl: string;
}

export const linkedInPosts: LinkedInPost[] = [
  // 1: Vatsal Gurjar
  {
    id: 'post-vatsal-gurjar',
    author: {
      name: 'Vatsal Gurjar',
      title: 'Full Stack Web Development Explorer | 2.2K+ Network',
      avatar: 'https://media.licdn.com/dms/image/v2/D5603AQH5FNwcSnq_RQ/profile-displayphoto-scale_200_200/B56Z3__xYYH4Ag-/0/1778116401675?e=2147483647&v=beta&t=nlCQU9QI6FdCXBhAQBsDkImd4c5NcGsHTxTQ5b7hjio',
      profileUrl: 'https://in.linkedin.com/in/vatsal-gurjar',
      verified: true,
    },
    timeAgo: '1w • Edited',
    content: `🚀 Starting my Full Stack Web Development journey!\n\nJust joined a structured Full Stack Web Development program with video lectures, timed assignments, and hands-on learning. Excited to build skills in frontend, backend, and everything in between 💻✨\n\nLooking forward to learning, growing, and connecting with fellow developers! Shoutout to Aayush Sharma, Palak Chaurasia, and Kritagya Jain.`,
    tags: ['#WebDevelopment', '#FullStack', '#LearnToCode', '#TechJourney', '#LinkedInFirstPost'],
    metrics: {
      likes: 16,
      comments: 6,
    },
    postUrl: 'https://www.linkedin.com/posts/vatsal-gurjar_webdevelopment-fullstack-learntocode-activity-7416350333003542529-fbXC?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // 2: Lakshya Chouhan
  {
    id: 'post-lakshya-chouhan',
    author: {
      name: 'Lakshya Chouhan',
      title: 'Full Stack Engineering Learner | 1.6K+ Network',
      avatar: 'https://ui-avatars.com/api/?name=Lakshya+Chouhan&background=0284c7&color=fff&bold=true',
      profileUrl: 'https://in.linkedin.com/in/lakshya-chouhan-955197411',
      verified: true,
    },
    timeAgo: '2w',
    content: `Just joined a game-changing Full Stack Web Development program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend, and everything in between from Indore!\n\nWho's on their own coding journey? Drop your tips below - let's connect and level up together! Thank you Aayush Sharma and Aditya Sahu for conducting this amazing course.`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 16,
      comments: 4,
    },
    postUrl: 'https://www.linkedin.com/posts/lakshya-chouhan-955197411_webdevelopment-fullstack-codingbootcamp-activity-7471398821810335744-E-dl?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // 3: Aryan Soni
  {
    id: 'post-aryan-soni',
    author: {
      name: 'Aryan Soni',
      title: 'Full Stack Developer & Student Coordinator (AIML) | 1.1K+ Network',
      avatar: 'https://ui-avatars.com/api/?name=Aryan+Soni&background=7c3aed&color=fff&bold=true',
      profileUrl: 'https://in.linkedin.com/in/aryan-soni-b42a69386',
      verified: true,
    },
    timeAgo: '2w',
    content: `I’m excited to share that I’ve started learning Full Stack Development with the help of a supportive community.\n\nThis journey is all about consistency, practice, and continuous improvement. Looking forward to learning new technologies, building projects, and connecting with like-minded people. Let’s grow together 🚀\n\nProud to be a part of this community as student coordinator. Special thanks to Aayush Sharma for this amazing idea!`,
    tags: ['#FullStackDeveloper', '#LearningInPublic', '#Consistency', '#TechJourney'],
    metrics: {
      likes: 17,
      comments: 5,
    },
    postUrl: 'https://www.linkedin.com/posts/aryan-soni-b42a69386_fullstackdeveloper-learninginpublic-consistency-activity-7416452472874962944-FtYS?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Chandni Yadav
  {
    id: 'post-chandni-yadav',
    author: {
      name: 'Chandni Yadav',
      title: 'Full Stack Web Development Learner | LevelOne Cohort',
      avatar: 'https://ui-avatars.com/api/?name=Chandni+Yadav&background=ec4899&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/chandni-yadav-74257a396_webdevelopment-fullstack-codingbootcamp-activity-7442232570546716675-v6-c?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '3d',
    content: `🚀 Stepping up my web development skills with Levelone!\n\nJust joined an intensive Full Stack Web Development program packed with practical assignments, structured roadmaps, and timed assessments. Ready to build robust frontend & backend applications and learn in public! 💻✨\n\nGratitude to Aayush Sharma and Aditya Sahu for creating this opportunity.`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 14,
      comments: 3,
    },
    postUrl: 'https://www.linkedin.com/posts/chandni-yadav-74257a396_webdevelopment-fullstack-codingbootcamp-activity-7442232570546716675-v6-c?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Ayush Mishra
  {
    id: 'post-ayush-mishra',
    author: {
      name: 'Ayush Mishra',
      title: 'Aspiring Software Developer | Levelone Community',
      avatar: 'https://ui-avatars.com/api/?name=Ayush+Mishra&background=2563eb&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/ayushmishra-dev_upskilling-webdevelopmemt-learningjourney-share-7416506158187823104-PPk1/?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `Upskilling and challenging myself every single day! 🚀\n\nStarted my web development journey with Levelone. The consistency of timed assignments, code reviews, and structured curriculum is exactly what was needed to push beyond basics.\n\nExcited for what lies ahead! Shoutout to Aayush Sharma and the team.`,
    tags: ['#Upskilling', '#WebDevelopment', '#LearningJourney', '#FullStack'],
    metrics: {
      likes: 11,
      comments: 2,
    },
    postUrl: 'https://lnkd.in/p/dzwaNaFH',
  },

  // Aanya Agrawal
  {
    id: 'post-aanya-agrawal',
    author: {
      name: 'Aanya Agrawal',
      title: 'Full Stack Web Development Explorer | Tech Journey',
      avatar: 'https://ui-avatars.com/api/?name=Aanya+Agrawal&background=8b5cf6&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/aanya-agrawal-494174375_webdevelopment-fullstack-codingbootcamp-share-7416458572198281216-r4fa/?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Thrilled to begin my Full Stack Web Development program with Levelone!\n\nVideo lessons, live assignments, and timed challenges make learning both fun and disciplined. Ready to build full-stack projects and connect with fellow developers!\n\nThank you Aayush Sharma, Kritagya Jain, and Palak Chaurasia!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#TechJourney'],
    metrics: {
      likes: 9,
      comments: 2,
    },
    postUrl: 'https://lnkd.in/p/dt4fh8S4',
  },

  // Kratika Agrawal
  {
    id: 'post-kratika-agrawal',
    author: {
      name: 'Kratika Agrawal',
      title: 'Full Stack Learner | Tech Enthusiast',
      avatar: 'https://ui-avatars.com/api/?name=Kratika+Agrawal&background=06b6d4&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/kratika-agrawal-a100bb396_webdevelopment-fullstack-codingbootcamp-ugcPost-7416416432080732160-cAM4/?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `Joined a game-changing Full Stack Web Development program with Levelone! 💻✨\n\nExcited to learn frontend and backend technologies with structured milestones and consistent peer learning. Looking forward to sharing continuous updates!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode'],
    metrics: {
      likes: 8,
      comments: 1,
    },
    postUrl: 'https://lnkd.in/p/dGSfyQ3Z',
  },

  // Vedika Singh
  {
    id: 'post-vedika-singh',
    author: {
      name: 'Vedika Singh',
      title: 'Aspiring Full Stack Developer | Student Developer',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQFmVrE2352Ujw/profile-displayphoto-scale_200_200/B4DZ_Mf7bOIIAg-/0/1785842351538?e=2147483647&v=beta&t=morSSEohHbIVURQ0YW1qbVMFj7IGLc7U4ZvjpsXCPEY',
      profileUrl: 'https://in.linkedin.com/in/vedika-singh-847239380',
      verified: true,
    },
    timeAgo: '4d',
    content: `My first step into the world of Web Development! 🌐\n\nI’m thrilled to share that I’ve just completed my first major milestone: my HTML (with basic CSS) Portfolio Assignment with Levelone! 🚀\n\nA few weeks ago, I didn't know how a website was structured. Today, I’ve built a foundation using semantic HTML, structured my own personal bio, and showcased my projects. Seeing my code turn into a live page feels amazing!`,
    tags: ['#WebDevelopment', '#CodingJourney', '#Levelone', '#HTML', '#FirstProject', '#BuildingInPublic'],
    metrics: {
      likes: 16,
      comments: 4,
    },
    postUrl: 'https://lnkd.in/p/dBDkTaUR',
  },

  // Chanchal Dodiya
  {
    id: 'post-chanchal-dodiya',
    author: {
      name: 'Chanchal Dodiya',
      title: 'Web Developer & Student | Building In Public',
      avatar: 'https://ui-avatars.com/api/?name=Chanchal+Dodiya&background=0284c7&color=fff&bold=true',
      profileUrl: 'https://in.linkedin.com/in/chanchaldodiya',
      verified: true,
    },
    timeAgo: '5d',
    content: `My first step into the world of Web Development! 🌐\n\nI’m thrilled to share that I’ve just completed my first major milestone: my HTML (with basic CSS) Portfolio Assignment with Levelone! 🚀\n\nToday, I’ve built a foundation using semantic HTML, structured my own personal bio, and showcased my projects. It’s a small step for the internet, but a huge leap for my coding journey! 💻 Shoutout to the Levelone team.`,
    tags: ['#WebDevelopment', '#CodingJourney', '#Levelone', '#HTML', '#StudentDeveloper', '#BuildingInPublic'],
    metrics: {
      likes: 17,
      comments: 2,
    },
    postUrl: 'https://lnkd.in/p/dNFYe6w9',
  },

  // Yahvi Rawat
  {
    id: 'post-yahvi-rawat',
    author: {
      name: 'Yahvi Rawat',
      title: 'Software Engineering Enthusiast | Levelone Cohort',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQHenmhtn-4dVg/profile-displayphoto-crop_800_800/B4DZ9z6fvYI0AI-/0/1784356143144?e=2147483647&v=beta&t=Owii7Dj04KGIQRcUGjzQsnb8IYqUimDeD2ctapdvC8w',
      profileUrl: 'https://in.linkedin.com/in/yahvi-rawat-0ba694367',
      verified: true,
    },
    timeAgo: '1w',
    content: `Exciting news! 🚀 I'm officially stepping up my web development skills.\n\nI have recently joined Levelone webdev, a dedicated student learning hub focused on mastering advanced Web Development. 💻✨\n\nOver the coming weeks, I’ll be diving deep into frontend and backend engineering, optimizing code, and building scalable applications alongside a community of over 100+ passionate student developers.`,
    tags: ['#WebDevelopment', '#FullStack', '#SoftwareEngineering', '#Levelone', '#CodingCommunity'],
    metrics: {
      likes: 12,
      comments: 2,
    },
    postUrl: 'https://lnkd.in/p/dEK2tzcf',
  },

  // Aarav Jain
  {
    id: 'post-aarav-jain',
    author: {
      name: 'Aarav Jain',
      title: 'Full Stack & Software Engineering Explorer | Levelone',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQGWPID0jUwPQw/profile-displayphoto-scale_200_200/B4DZ51KDnTJoAc-/0/1780082034089?e=2147483647&v=beta&t=1CuD3nW7CKPt2qsY1yma8WmxdfzR0TfR6avSrPU5rjs',
      profileUrl: 'https://in.linkedin.com/in/aarav-jain-427208384',
      verified: true,
    },
    timeAgo: '1w',
    content: `Exciting news! 🚀 I'm officially stepping up my web development skills with Levelone webdev!\n\nTo stay competitive in the tech landscape, building real-world projects and understanding modern frameworks is essential. A huge shoutout to the team at Levelone for setting up this incredible ecosystem. 🙌 If you want to practice consistently, I highly recommend joining!`,
    tags: ['#FullStack', '#SoftwareEngineering', '#Levelone', '#StudentDevelopers', '#ContinuousLearning'],
    metrics: {
      likes: 14,
      comments: 3,
    },
    postUrl: 'https://lnkd.in/p/d8kMfWvF',
  },

  // Nikhil Kushwah
  {
    id: 'post-nikhil-kushwah',
    author: {
      name: 'Nikhil Kushwah',
      title: 'Full Stack Developer | Levelone Community Builder',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQE1LzZLnuscaQ/profile-displayphoto-scale_200_200/B4DZ53h3jMIMAc-/0/1780121829069?e=2147483647&v=beta&t=F0nveYBKW3gdZNpeM6oltVlBvrKML3Zx5Iftvj8ZSn0',
      profileUrl: 'https://in.linkedin.com/in/nikhil-kushwah-3660563a6',
      verified: true,
    },
    timeAgo: '1w',
    content: `Exciting news! 🚀 Officially stepping up my coding game.\n\nJoined Levelone webdev to build real-world, scalable applications alongside 100+ passionate student developers. Huge shoutout to Aayush Sharma and Aditya Sahu for putting together such a high-intensity, practical learning platform. Highly recommend joining the cohort! ✨`,
    tags: ['#WebDevelopment', '#FullStack', '#Levelone', '#CodingCommunity', '#StudentDevelopers'],
    metrics: {
      likes: 18,
      comments: 5,
    },
    postUrl: 'https://lnkd.in/p/d-5WzBs2',
  },

  // Anurag Sisodiya
  {
    id: 'post-anurag-sisodiya',
    author: {
      name: 'Anurag Sisodiya',
      title: 'Full Stack Web Development Explorer | Tech Journey',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQGV495ACVsJWg/profile-displayphoto-scale_200_200/B4DZuxXUQiJsAc-/0/1768207240662?e=2147483647&v=beta&t=bELFs2_O8JsMcUvVl_2a85i96c-nYq4-njy4YS8wXjQ',
      profileUrl: 'https://in.linkedin.com/in/anurag-sisodiya-3b6114383',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Just joined a game-changing Full Stack Web Development program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend, and everything in between from Indore 💻✨\n\nWho's on their own coding journey? Drop your tips below - let's connect and level up together! Tagging Palak Chaurasia, Aayush Sharma, Kritagya Jain.`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 8,
      comments: 2,
    },
    postUrl: 'https://www.linkedin.com/posts/anurag-sisodiya-3b6114383_webdevelopnment-fullstack-coadingbootcamp-activity-7416400177667854336-BP_8?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Manya Rai
  {
    id: 'post-manya-rai',
    author: {
      name: 'Manya Rai',
      title: 'Full Stack Web Developer | B.Tech CSE',
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQGNb8IVRvorSQ/profile-displayphoto-scale_200_200/B4DZ.trRG.GkAg-/0/1785325229139?e=2147483647&v=beta&t=0TnnyVxtN8MXWKoIFrVZl3FgXOwltL0LtLC5pHNlXpk',
      profileUrl: 'https://in.linkedin.com/in/manya-rai-028a713a4',
      verified: true,
    },
    timeAgo: '1w',
    content: `Just joined a game-changing Full Stack Web Development program! 💻✨\n\nVideo lectures, timed assignments, and a dedicated platform - it's structural for real results. Excited to master frontend, backend, and everything in between from Indore!\n\nWho's on their own coding journey? Drop your tips below - let's connect and level up together! Special shoutout to Aayush Sharma & Palak Chaurasia.`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 10,
      comments: 3,
    },
    postUrl: 'https://www.linkedin.com/posts/manya-rai-028a713a4_webdevelopnment-fullstack-coadingbootcamp-activity-7416410383290343424-nVLW?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Saloni Rajput
  {
    id: 'post-saloni-rajput',
    author: {
      name: 'Saloni Rajput',
      title: 'B.Tech CSE Student | Full Stack Development Explorer',
      avatar: 'https://ui-avatars.com/api/?name=Saloni+Rajput&background=ec4899&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/saloni-rajput-3ab42b384_webdevelopment-fullstack-codingjourney-activity-7416473527421206529-KJHo?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Just joined a Full Stack Web Development program!\n\nThe program includes video lectures, practice assignments, and a dedicated learning platform designed for structured learning and consistency.\n\nExcited to explore frontend and backend development step by step and strengthen my web development skills as a B.Tech CSE student. Let's connect and grow together!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingJourney', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 12,
      comments: 3,
    },
    postUrl: 'https://www.linkedin.com/posts/saloni-rajput-3ab42b384_webdevelopment-fullstack-codingjourney-activity-7416473527421206529-KJHo?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Sanskriti Atre
  {
    id: 'post-sanskriti-atre',
    author: {
      name: 'Sanskriti Atre',
      title: 'Full Stack Engineering Student | Levelone Community',
      avatar: 'https://ui-avatars.com/api/?name=Sanskriti+Atre&background=10b981&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/sanskriti-atre-6b55833a6_webdevelopment-fullstack-codingbootcamp-activity-7417836068693078016-zd4n?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Just joined a game-changing Full Stack Web Development program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend, and everything in between from Indore! 💻✨\n\nTagging Aayush Sharma, Kritagya Jain, Palak Chaurasia. Drop your tips below!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 9,
      comments: 2,
    },
    postUrl: 'https://www.linkedin.com/posts/sanskriti-atre-6b55833a6_webdevelopment-fullstack-codingbootcamp-activity-7417836068693078016-zd4n?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Raghav Vishwakarma
  {
    id: 'post-raghav-vishwakarma',
    author: {
      name: 'Raghav Vishwakarma',
      title: 'Web Developer & Tech Explorer | Levelone Shinobi',
      avatar: 'https://media.licdn.com/dms/image/v2/D5603AQEjshAGrT48BA/profile-displayphoto-scale_200_200/B56Zoyt4DFHkAc-/0/1761787481752?e=2147483647&v=beta&t=51xjH016XBE8Qv5G8eQZbAvK3OBBRASgRpEmDTPJUAg',
      profileUrl: 'https://in.linkedin.com/in/raghav-vishwakarma-001a3536a',
      verified: true,
    },
    timeAgo: '1w',
    content: `STARTING THE JOURNEY WITH LEVEL ONE OF FULL STACK WEB DEVELOPMENT PROGRAM!!! 🔥\n\nTimed assessments, hands-on tasks, and real engineering discipline. Excited to unlock every phase and level up my coding abilities. Big shoutout to Aayush Sharma and Aditya Sahu!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 8,
      comments: 3,
    },
    postUrl: 'https://www.linkedin.com/posts/raghav-vishwakarma-001a3536a_webdevelopment-fullstack-codingbootcamp-activity-7472329195537354752-CDoS?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Vardan Saxena
  {
    id: 'post-vardan-saxena',
    author: {
      name: 'Vardan Saxena',
      title: 'Full Stack Web Developer | InSync Developer Community',
      avatar: 'https://ui-avatars.com/api/?name=Vardan+Saxena&background=6366f1&color=fff&bold=true',
      profileUrl: 'https://in.linkedin.com/in/vardansaxenainsync',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Just joined a game-changing Full Stack Web Development program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend, and everything in between from Indore! ✨💻\n\nThanks to Kritagya Jain, Palak Chaurasia, and Aayush Sharma for this initiative!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 6,
      comments: 2,
    },
    postUrl: 'https://www.linkedin.com/posts/vardansaxenainsync_webdevelopment-fullstack-codingbootcamp-activity-7416388289676492801-bZCF?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Yuvika Odak
  {
    id: 'post-yuvika-odak',
    author: {
      name: 'Yuvika Odak',
      title: 'Aspiring Software Developer | Levelone Cohort',
      avatar: 'https://ui-avatars.com/api/?name=Yuvika+Odak&background=f59e0b&color=fff&bold=true',
      profileUrl: 'https://in.linkedin.com/in/yuvika-odak-a15828385',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Excited to begin my Full Stack Web Development journey!\n\nI've recently joined a structured Full Stack Web Development program focused on building real-world skills through video lectures, hands-on assignments, and practical projects.\n\nA special thanks to Aayush Sharma and Aditya Sahu for creating this learning opportunity and guiding aspiring developers like me!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#StudentDeveloper'],
    metrics: {
      likes: 7,
      comments: 2,
    },
    postUrl: 'https://www.linkedin.com/posts/yuvika-odak-a15828385_webdevelopment-fullstack-codingbootcamp-activity-7471242725250609152-Fkdc?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Abir Khatri
  {
    id: 'post-abir-khatri',
    author: {
      name: 'Abir Khatri',
      title: 'Full Stack Development Explorer | Tech Journey',
      avatar: 'https://ui-avatars.com/api/?name=Abir+Khatri&background=3b82f6&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/abir-khatri-7674a6383_webdevelopment-fullstack-codingbootcamp-activity-7416415211416530944-SR3B?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Just joined a game-changing full stack Web Development Program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend and everything in between from Indore! 💻✨\n\nLet's connect and level up together! Tagging Kritagya Jain & Palak Chaurasia.`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 6,
      comments: 1,
    },
    postUrl: 'https://www.linkedin.com/posts/abir-khatri-7674a6383_webdevelopment-fullstack-codingbootcamp-activity-7416415211416530944-SR3B?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Kratikaa Verma
  {
    id: 'post-kratikaa-verma',
    author: {
      name: 'Kratikaa Verma',
      title: 'Student Developer | Levelone Journey',
      avatar: 'https://media.licdn.com/dms/image/v2/D5603AQEeiWyG23_YTA/profile-displayphoto-scale_200_200/B56ZvBXNfQKUAY-/0/1768475650654?e=2147483647&v=beta&t=_s1wcXl69K7MqutBjH6Oz_BYd2kE1mTMWxWOOb7xeBA',
      profileUrl: 'https://in.linkedin.com/in/kratikaaverma0714',
      verified: true,
    },
    timeAgo: '1w',
    content: `This is my Levelone profile! 🚀 My first step to learn something new and conquer real web development challenges.\n\nExcited to build, practice consistently, and post updates as I advance through each phase!`,
    tags: ['#Levelone', '#WebDevelopment', '#LearningJourney', '#StudentDeveloper'],
    metrics: {
      likes: 5,
      comments: 1,
    },
    postUrl: 'https://www.linkedin.com/posts/kratikaaverma0714_this-is-my-levelone-profile-my-first-step-activity-7417532534911205376-6cLB?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Neev Chawda
  {
    id: 'post-neev-chawda',
    author: {
      name: 'Neev Chawda',
      title: 'Full Stack Web Developer | Tech Learner',
      avatar: 'https://ui-avatars.com/api/?name=Neev+Chawda&background=059669&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/neev-chawda-6b99133a4_just-joined-a-game-changing-full-stack-web-activity-7416479847390265346-8HYt?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `Just joined a game-changing full stack web development program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend, and everything in between from Indore!\n\nWho's on their own coding journey? Drop your tips below - let's connect and level up together!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 6,
      comments: 2,
    },
    postUrl: 'https://www.linkedin.com/posts/neev-chawda-6b99133a4_just-joined-a-game-changing-full-stack-web-activity-7416479847390265346-8HYt?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Prashant Singh Chahar
  {
    id: 'post-prashant-singh',
    author: {
      name: 'Prashant Singh Chahar',
      title: 'Full Stack Engineering Enthusiast',
      avatar: 'https://ui-avatars.com/api/?name=Prashant+Singh&background=d97706&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/prashant-singh-chahar-17a808358_webdevelopment-fullstack-codingbootcamp-activity-7416476076282937345-2UMU?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `🚀 Just joined a game-changing Full Stack Web Development program!\n\nVideo lectures, timed assignments, and a dedicated platform – it's structured for real results. Excited to master frontend, backend, and everything in between from Indore! 💻✨\n\nWho's on their own coding journey? Drop your tips below – let's connect and level up together!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 5,
      comments: 1,
    },
    postUrl: 'https://www.linkedin.com/posts/prashant-singh-chahar-17a808358_webdevelopment-fullstack-codingbootcamp-activity-7416476076282937345-2UMU?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },

  // Akshita S.
  {
    id: 'post-akshita-s',
    author: {
      name: 'Akshita S.',
      title: 'Full Stack Web Development Explorer',
      avatar: 'https://ui-avatars.com/api/?name=Akshita+S&background=9333ea&color=fff&bold=true',
      profileUrl: 'https://www.linkedin.com/posts/akshita-s-17544b391_webdevelopment-fullstack-codingbootcamp-activity-7416434197906472960-eq2N?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
      verified: true,
    },
    timeAgo: '1w',
    content: `Just joined a game-changing Full Stack Web Development program!\n\nVideo lectures, timed assignments, and a dedicated platform - it's structured for real results. Excited to master frontend, backend, and everything in between from Indore!\n\nWho's on their own coding journey? Drop your tips below - let's connect and level up together!`,
    tags: ['#WebDevelopment', '#FullStack', '#CodingBootcamp', '#LearnToCode', '#TechJourney'],
    metrics: {
      likes: 4,
      comments: 1,
    },
    postUrl: 'https://www.linkedin.com/posts/akshita-s-17544b391_webdevelopment-fullstack-codingbootcamp-activity-7416434197906472960-eq2N?utm_source=share&utm_medium=member_android&rcm=ACoAAF-_lYYBy879S0lzpK6TGFh2bwRhRwySGXk',
  },
];

export default function LinkedInShowcase() {
  const [showAll, setShowAll] = useState(false);
  const displayedPosts = showAll ? linkedInPosts : linkedInPosts.slice(0, 6);

  return (
    <section id="reviews" className="w-full max-w-7xl mx-auto mt-20 px-4 md:px-6 relative z-10">
      {/* Background Ambient Radial Glow for LinkedIn Section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0a66c2]/40 bg-[#0a66c2]/15 px-4 py-1.5 text-xs font-bold text-blue-400">
          <Linkedin className="w-4 h-4 fill-current text-[#0a66c2]" />
          Real Student Reviews
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          What Students Say on LinkedIn
        </h2>
        <p className="max-w-2xl text-zinc-300 text-sm md:text-base leading-relaxed">
          Real posts and experiences shared by students learning web development with LevelOne.
          Click any card to read their full post on LinkedIn.
        </p>
      </div>

      {/* Realistic LinkedIn Feed Cards Grid - Crisp, High Brightness Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPosts.map((post, idx) => (
          <motion.a
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
            className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white hover:bg-slate-50 hover:border-[#0a66c2] hover:shadow-[0_16px_40px_rgba(10,102,194,0.3)] transition-all duration-200 shadow-2xl cursor-pointer overflow-hidden p-6 text-left"
          >
            <div>
              {/* LinkedIn Post Header (User Avatar, Name, Title, Time, Brand Icon) */}
              <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-zinc-200">
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200 group-hover:border-[#0a66c2] transition-colors shrink-0 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        post.author.name
                      )}&background=0a66c2&color=fff&bold=true`;
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-zinc-900 group-hover:text-[#0a66c2] transition-colors truncate">
                        {post.author.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-semibold shrink-0">• 1st</span>
                    </div>
                    <p className="text-[12px] text-zinc-600 leading-tight line-clamp-1 font-medium mt-0.5">
                      {post.author.title}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5 font-medium">
                      <span>{post.timeAgo}</span>
                      <span>•</span>
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-[#0a66c2] group-hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 fill-[#0a66c2] text-transparent" />
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                </div>
              </div>

              {/* LinkedIn Post Body Text - Full text visible with readable line height */}
              <div className="py-4 text-[13.5px] leading-relaxed text-zinc-900 font-normal whitespace-pre-line">
                {post.content}
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] font-bold text-[#0a66c2] hover:underline"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* LinkedIn Post Footer (Reactions count & Action Bar) */}
            <div>
              {/* Engagement Reaction Stats */}
              <div className="pt-2 pb-2.5 flex items-center justify-between text-[12px] text-zinc-500 border-b border-zinc-200">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#0a66c2] shadow-xs">
                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-current" />
                  </span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#df704d] shadow-xs">
                    <Heart className="w-2.5 h-2.5 text-white fill-current" />
                  </span>
                  <span className="text-zinc-800 font-bold ml-1">{post.metrics.likes}</span>
                </div>
                <div className="text-zinc-600 font-medium">
                  {post.metrics.comments} comments
                </div>
              </div>

              {/* LinkedIn Action Buttons (Like, Comment, Repost, Open Post) */}
              <div className="pt-2.5 flex items-center justify-between text-zinc-600 text-xs font-semibold">
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors">
                  <ThumbsUp className="w-4 h-4 text-zinc-600" />
                  <span className="text-[11px] font-bold">Like</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors">
                  <MessageSquare className="w-4 h-4 text-zinc-600" />
                  <span className="text-[11px] font-bold">Comment</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors">
                  <Share2 className="w-4 h-4 text-zinc-600" />
                  <span className="text-[11px] font-bold">Repost</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-[#0a66c2] font-bold text-[11px] group-hover:bg-[#0a66c2] group-hover:text-white transition-all shadow-xs">
                  <span>View Post</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {linkedInPosts.length > 6 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full border border-zinc-700 bg-[#1b1f23] text-white font-semibold text-sm hover:bg-[#252b31] hover:border-[#0a66c2] transition-all cursor-pointer shadow-md"
          >
            {showAll ? 'Show Fewer Posts' : `View All ${linkedInPosts.length} Student Posts`}
            <ChevronDown
              className={`w-4 h-4 text-[#70b5f9] transition-transform duration-200 ${
                showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'
              }`}
            />
          </button>
        </div>
      )}

      {/* Community Banner / CTA */}
      <div className="mt-14 p-6 md:p-8 rounded-2xl border border-zinc-800 bg-[#0e1217] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#70b5f9] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Join LevelOne Developers
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">
            Share your progress on LinkedIn and build your developer network.
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm">
            Tag LevelOne or our team to get your post featured here.
          </p>
        </div>

        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          <Linkedin className="w-4 h-4 fill-current" />
          Join On LinkedIn
        </a>
      </div>
    </section>
  );
}
