import { useState, useRef, useCallback, useEffect } from "react";

const C = { coral:"#FF4D6D",rose:"#FF8FA3",blush:"#FFF0F3",deep:"#C7365A",bk:"#111",mid:"#555",lt:"#aaa",rl:"#eee",bg:"#FAFAFA",wh:"#fff" };

const PINGS = [
  { id:1,co:"Kōso Ferments",loc:"Melbourne, VIC",type:"New registration",time:"2h",score:9.1,
    scores:{freshness:2,budget:1.5,match:2,urgency:2,reach:1.6},
    why:"New ABN registered — no website. Founder was Head of Product at Envato for 6 years. Strong tech/design background signals high design standards.",
    whyMatch:"Your UI/UX and Brand skills directly match this early-stage founder's needs. Envato alumni typically value craft and invest in quality design from day one.",
    contacts:[
      {name:"Sarah Chen",role:"Founder & CEO",ini:"SC",best:true,channel:"LinkedIn",tone:"Casual but professional",posts:"Shares startup journey content, design inspiration, Envato alumni network updates",insight:"Recently posted about 'building in public' — open to conversations. Responds within 24h on LinkedIn. Ex-Envato so appreciates design craft. Lead with portfolio examples.",activity:"Very active — 3-5 posts/week"},
      {name:"David Nguyen",role:"Co-founder & CTO",ini:"DN",best:false,channel:"Email",tone:"Technical, concise",posts:"Technical architecture posts, startup tooling recommendations",insight:"Technical co-founder. Less likely to be the design decision-maker but influences budget. Only approach if Sarah doesn't respond.",activity:"Moderate — 1-2 posts/week"},
      {name:"Rachel Kim",role:"Head of Operations",ini:"RK",best:false,channel:"LinkedIn",tone:"Formal",posts:"Operations, hiring, company culture",insight:"Joined recently from Canva. May be managing vendor relationships. Good backup if founders are unresponsive.",activity:"Low — occasional reshares"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi Sarah — congrats on launching Kōso Ferments! I noticed you don't have a website yet. I specialise in brand and web design for early-stage founders and could help you launch in under 4 weeks. Would love to show you some recent work."},
      {label:"Warm & personal",tone:"warm",text:"Hi Sarah — love the name Kōso Ferments! As a fellow Melbourne creative, I was excited to see your registration come through. I help founders like you go from zero to a polished digital presence. If you're thinking about branding and web, I'd love to chat over coffee."},
      {label:"Value-led opener",tone:"value",text:"Hi Sarah — I saw Kōso Ferments just registered. Having worked with 12+ early-stage food and wellness brands, I know the first 90 days are critical for brand positioning. I've put together a quick checklist of what founders in your space typically need — happy to share if useful."},
      {label:"Portfolio-forward",tone:"proof",text:"Hi Sarah — congrats on Kōso Ferments! I recently designed the brand identity and e-commerce site for [Similar Brand] which went from launch to $50K MRR in 3 months. Would love to share what we learned and see if there's a fit for your launch."},
      {label:"Short & sweet",tone:"brief",text:"Hi Sarah — saw you just registered Kōso Ferments but don't have a site yet. I design brands and websites for founders. Happy to chat if you need help launching. No pressure — just putting my hand up early."}
    ],
    img:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop&q=80",g1:"#FF6B6B",g2:"#FF4D6D",g3:"#C7365A",g4:"#FF8FA3" },
  { id:2,co:"Aether Robotics",loc:"Sydney, NSW",type:"$2.4M seed round",time:"6h",score:8.5,
    scores:{freshness:2,budget:2,match:1.5,urgency:1.5,reach:1.5},
    why:"$2.4M seed closed. Hiring Head of Marketing — serious creative budget. Need investor materials refreshed and brand positioning for Series A.",
    whyMatch:"Post-seed startups investing in marketing are high-value clients. Your Brand skills serve their Series A positioning — this is typically a $15-30K engagement.",
    contacts:[
      {name:"James Wright",role:"CEO & Co-founder",ini:"JW",best:true,channel:"Email",tone:"Direct, data-driven",posts:"Fundraising updates, robotics industry commentary, team hiring announcements",insight:"Just closed funding — in build mode. Email is best as he's mentioned being 'off social media during sprint months'. Likely receptive to outbound if you lead with ROI and speed.",activity:"Sporadic — monthly updates"},
      {name:"Lisa Park",role:"Head of Marketing (incoming)",ini:"LP",best:false,channel:"LinkedIn",tone:"Creative, enthusiastic",posts:"Marketing strategy, brand case studies, DTC growth tactics",insight:"Starting in 2 weeks. She'll be the actual decision-maker for design work. Reaching her before she starts could position you as the go-to. Currently at Canva.",activity:"Very active — daily posts"},
      {name:"Sam Torres",role:"COO",ini:"ST",best:false,channel:"LinkedIn",tone:"Operational, structured",posts:"Startup operations, team building, process optimization",insight:"Manages vendor procurement. If budget approval is needed beyond the CEO, Sam is the gatekeeper. More formal approach recommended.",activity:"Moderate — weekly"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi James — congratulations on closing the $2.4M round at Aether Robotics. As you build out marketing, strong brand design becomes critical for Series A positioning. I've helped 6 post-seed startups through this exact transition. Would love 15 minutes to discuss."},
      {label:"Warm & personal",tone:"warm",text:"Hi James — exciting to see Aether Robotics close the seed! The robotics space is fascinating. I specialise in helping funded startups translate complex tech into compelling visual stories. If you're thinking about brand as you scale, I'd love to chat."},
      {label:"Value-led opener",tone:"value",text:"Hi James — I noticed Aether just closed $2.4M and is hiring marketing. In my experience, the 3 months between seed and Series A prep is when brand investment has the highest ROI. I've compiled data on this from 8 startups I've worked with — happy to share the insights."},
      {label:"Timing play",tone:"proof",text:"Hi James — saw you're hiring a Head of Marketing at Aether. Smart move post-seed. In the gap before they start, freelance design support can keep momentum going. I'm available immediately and have deep experience with funded tech startups."},
      {label:"Short & sweet",tone:"brief",text:"Hi James — congrats on the raise. If Aether needs brand and design support as you scale, I'd love to help. I work exclusively with funded startups. Happy to share relevant work."}
    ],
    img:"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=600&fit=crop&q=80",g1:"#A78BFA",g2:"#7C3AED",g3:"#5B21B6",g4:"#C4B5FD" },
  { id:3,co:"Verra Skincare",loc:"Brisbane, QLD",type:"CMO departure",time:"1d",score:7.2,
    scores:{freshness:1.5,budget:1.5,match:1.5,urgency:1.5,reach:1.2},
    why:"CMO departed. Running campaigns with no creative director — high urgency for freelance support across packaging, digital, and social.",
    whyMatch:"CMO departures create immediate freelance demand. DTC beauty brands need ongoing Brand and Web Design support — matches your core skills.",
    contacts:[
      {name:"Mia Thompson",role:"Head of Operations",ini:"MT",best:true,channel:"Email",tone:"Professional, structured",posts:"Team updates, operational efficiency, company milestones",insight:"Currently managing marketing in the interim. Under pressure to maintain campaign output. Will be receptive to offers of immediate help. Lead with availability and relevant DTC experience.",activity:"Low social presence — email is best"},
      {name:"Jake Morrison",role:"Brand Manager",ini:"JM",best:false,channel:"LinkedIn",tone:"Creative, visual",posts:"Brand campaigns, design trends, skincare industry news",insight:"Most likely to be your direct collaborator if hired. Connect with him to understand current needs. He's been posting about feeling overwhelmed — timing is right.",activity:"Active — 2-3 posts/week"},
      {name:"Anna Wright",role:"CEO",ini:"AW",best:false,channel:"LinkedIn",tone:"Visionary, formal",posts:"Industry keynotes, brand values, sustainability in beauty",insight:"Ultimate decision-maker but rarely handles vendor selection directly. Only reach out if Mia and Jake don't respond within a week.",activity:"Occasional — monthly thought pieces"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi Mia — I saw that Verra's CMO recently moved on. If you need interim creative support while you find the right person, I've helped 4 DTC beauty brands bridge leadership gaps. I can start this week."},
      {label:"Warm & personal",tone:"warm",text:"Hi Mia — I've been following Verra Skincare and love what you've built. I understand transitions like this can be stressful for the team. If I can help lighten the creative load while you hire, I'd genuinely love to. Happy to chat."},
      {label:"Value-led opener",tone:"value",text:"Hi Mia — CMO transitions in DTC beauty typically create a 3-6 month gap in creative output. Based on my work with similar brands, I've seen this period actually become an opportunity to refresh creative direction. I'd love to share some ideas specific to Verra."},
      {label:"Urgency-focused",tone:"proof",text:"Hi Mia — I noticed your recent job posting for a Creative Director. While you search, I can provide immediate freelance design support for packaging, digital, and social. I've done exactly this for 3 skincare brands during leadership transitions."},
      {label:"Short & sweet",tone:"brief",text:"Hi Mia — saw the CMO departure at Verra. I do freelance brand and web design for DTC beauty brands. Available immediately if you need interim creative support. Happy to chat."}
    ],
    img:"https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=600&fit=crop&q=80",g1:"#34D399",g2:"#059669",g3:"#047857",g4:"#6EE7B7" },
  { id:4,co:"Flux Studio",loc:"Remote",type:"Domain purchased",time:"3h",score:8.3,
    scores:{freshness:2,budget:1,match:2,urgency:2,reach:1.3},
    why:"fluxstudio.com.au purchased 48h ago — no live site. Creative industry name suggests agency or studio launching.",
    whyMatch:"New creative studios always need branding on day one. Your Brand and Web Design skills are exactly what a studio launch requires — you understand the space.",
    contacts:[
      {name:"Liam Park",role:"Founder",ini:"LP",best:true,channel:"LinkedIn",tone:"Creative, informal",posts:"Design community events, creative tools, studio culture",insight:"Appears to be a solo founder launching a creative studio. Previously freelanced at several agencies. Will appreciate a peer-to-peer approach rather than a sales pitch. Show you understand the studio launch journey.",activity:"Active — shares design community content"},
      {name:"Unknown",role:"Potential co-founder",ini:"??",best:false,channel:"N/A",tone:"Unknown",posts:"N/A",insight:"Domain registration shows a second name on the WHOIS record but no public profile found. May be a silent partner or technical co-founder.",activity:"N/A"}
    ],
    messages:[
      {label:"Peer-to-peer",tone:"bold",text:"Hey Liam — saw you just grabbed fluxstudio.com.au. Fellow creative here. I've designed identities for 5+ studios launching in AU and would love to help you nail the brand from day one. No pitch, just keen to chat if you're exploring options."},
      {label:"Warm & personal",tone:"warm",text:"Hi Liam — exciting to see another creative studio launching in Australia! I noticed fluxstudio.com.au doesn't have a site yet. I specialise in brand identity for creative businesses and would love to help you launch with something that does your work justice."},
      {label:"Value-led opener",tone:"value",text:"Hi Liam — I've helped 6 creative studios go from domain purchase to full launch. The biggest mistake I see? Rushing the brand identity. I've put together a studio launch checklist that covers brand, web, and positioning — happy to share it, no strings."},
      {label:"Portfolio-forward",tone:"proof",text:"Hi Liam — just saw fluxstudio.com.au was registered. Here's a studio identity I designed recently: [link]. If that style resonates, I'd love to discuss your vision for Flux Studio. I have capacity to start immediately."},
      {label:"Short & sweet",tone:"brief",text:"Hey Liam — noticed fluxstudio.com.au with no site yet. I design brand identities for creative studios. Happy to chat if you want help launching. No pressure."}
    ],
    img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=600&fit=crop&q=80",
    g1:"#60A5FA",g2:"#2563EB",g3:"#1E40AF",g4:"#93C5FD" },
  { id:5,co:"Nouri Foods",loc:"Melbourne, VIC",type:"Hiring creative",time:"5h",score:6.4,
    scores:{freshness:1.5,budget:1.5,match:1,urgency:1,reach:1.4},
    why:"Posted 'Senior Graphic Designer' on Seek. Job mentions rebrand project and new packaging range.",
    whyMatch:"Hiring posts for designers often mean they're open to freelancers too. The rebrand scope suits your Brand skills.",
    contacts:[
      {name:"Priya Sharma",role:"Marketing Director",ini:"PS",best:true,channel:"Email",tone:"Professional, detail-oriented",posts:"Food industry marketing, consumer insights, campaign results",insight:"Posted the job listing herself. Decision-maker for the rebrand budget. Email found on the Seek listing. Lead with specific food/FMCG rebrand experience and fast turnaround.",activity:"Moderate LinkedIn — monthly posts"},
      {name:"Tom Chen",role:"Creative Lead",ini:"TC",best:false,channel:"LinkedIn",tone:"Visual, design-focused",posts:"Packaging design, typography, food photography",insight:"Will be your direct collaborator on the rebrand. Connect with him to build rapport. He's posted about needing 'more hands on deck' — clear opening.",activity:"Active — weekly design shares"},
      {name:"Maria Santos",role:"CEO",ini:"MS",best:false,channel:"LinkedIn",tone:"Visionary, brand-focused",posts:"Brand storytelling, food industry trends, sustainability",insight:"Founded Nouri 5 years ago. Deeply attached to the brand. Any rebrand pitch needs to respect the existing brand equity while showing evolution. Do not approach directly unless others unresponsive.",activity:"Sporadic"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi Priya — I saw Nouri is hiring a Senior Graphic Designer for the rebrand. If you'd consider a freelance option alongside or instead, I've led rebrands for 4 food brands including packaging, and could start this week."},
      {label:"Warm & personal",tone:"warm",text:"Hi Priya — I'm a big Nouri fan and was excited to see the rebrand is happening. As someone who's specialised in food brand identity, I'd love the chance to contribute. Even if you go with a full-time hire, I could help accelerate the early phases."},
      {label:"Value-led opener",tone:"value",text:"Hi Priya — food rebrands typically take 4-6 months with an internal designer. With a freelancer handling the heavy lifting alongside your team, I've seen that compressed to 8-10 weeks. Happy to share how we structured this for a similar FMCG brand."},
      {label:"Portfolio-forward",tone:"proof",text:"Hi Priya — here's a food brand rebrand I completed last quarter: [link]. If that direction resonates with Nouri's vision, I'd love to discuss. I can provide rebrand strategy, packaging, and digital — the full scope."},
      {label:"Short & sweet",tone:"brief",text:"Hi Priya — saw the designer role at Nouri for the rebrand. If you're open to freelance, I do food brand identity and packaging. Available immediately. Happy to share relevant work."}
    ],
    img:"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=600&fit=crop&q=80",g1:"#FCA5A5",g2:"#DC2626",g3:"#991B1B",g4:"#FECDD3" },
  { id:6,co:"Terraform Labs",loc:"Remote",type:"Series A",time:"8h",score:9.4,
    scores:{freshness:1.5,budget:2,match:2,urgency:2,reach:2},
    why:"$8M Series A. Expanding into enterprise — needs pitch decks, sales collateral, brand refresh for upmarket positioning.",
    whyMatch:"Series A companies moving upmarket are the highest-value freelance clients. Your UI/UX and Brand skills directly serve enterprise positioning needs. Expect $20-50K engagement potential.",
    contacts:[
      {name:"Alex Kumar",role:"Head of Growth",ini:"AK",best:true,channel:"LinkedIn",tone:"Strategic, data-driven but approachable",posts:"Growth strategy, SaaS metrics, enterprise sales playbooks, team scaling",insight:"Posts weekly about growth — 4K+ followers. High engagement on his content. Very responsive to DMs, especially from people who engage with his posts first. Recommend commenting on a recent post before DMing.",activity:"Very active — 3-5 posts/week"},
      {name:"Nina Chen",role:"VP of Marketing",ini:"NC",best:false,channel:"Email",tone:"Brand-focused, storytelling",posts:"B2B brand strategy, content marketing, enterprise positioning",insight:"Hired 3 months ago specifically for the enterprise push. She's the ultimate decision-maker for brand and design spend. Email on company website. More formal approach recommended.",activity:"Moderate — fortnightly posts"},
      {name:"Raj Patel",role:"CEO",ini:"RP",best:false,channel:"LinkedIn",tone:"Visionary, technical",posts:"Product vision, fundraising journey, technical deep-dives",insight:"Founder-CEO who raised the Series A. Won't be involved in design vendor selection but a warm introduction through Alex or Nina would carry weight. Don't cold-approach.",activity:"Active — weekly"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi Alex — congratulations on the $8M Series A at Terraform Labs. As you move into enterprise, the gap between 'startup brand' and 'enterprise-ready brand' is where I specialise. I've done this exact transition for 5 B2B SaaS companies. Would love 15 minutes to discuss."},
      {label:"Warm & personal",tone:"warm",text:"Hi Alex — I've been following your growth posts and the Series A is well deserved. The enterprise move is exciting. I help B2B SaaS companies redesign their brand and sales collateral for the upmarket push. If that's on your roadmap, I'd love to connect."},
      {label:"Value-led opener",tone:"value",text:"Hi Alex — in my experience, the biggest mistake Series A companies make when going enterprise is underinvesting in visual credibility. Enterprise buyers judge on first impression. I've compiled a checklist of what enterprise-ready brand looks like for SaaS — happy to share if useful."},
      {label:"Engage-first approach",tone:"proof",text:"Great post about the enterprise playbook, Alex. One thing I'd add: visual credibility closes deals faster than any deck content. I've redesigned pitch decks for 6 Series A SaaS companies and seen close rates improve 20-30%. Would love to share specifics."},
      {label:"Short & sweet",tone:"brief",text:"Hi Alex — congrats on the Series A. If Terraform needs brand and pitch deck support for the enterprise push, I'd love to help. I specialise in exactly this transition. Happy to share relevant work."}
    ],
    img:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop&q=80",g1:"#67E8F9",g2:"#0891B2",g3:"#0E7490",g4:"#A5F3FC" },
  { id:7,co:"Maeve Wellness",loc:"Gold Coast",type:"New registration",time:"12h",score:7.8,
    scores:{freshness:1,budget:1.5,match:2,urgency:2,reach:1.3},
    why:"New wellness brand. Instagram active with 2K followers pre-launch. No website yet. Founder background in physiotherapy.",
    whyMatch:"Pre-launch brands with social traction move fast. Your Web Design skills match perfectly — they need an e-commerce site before they can monetise their audience.",
    contacts:[
      {name:"Emma Collins",role:"Founder",ini:"EC",best:true,channel:"Instagram",tone:"Warm, wellness-focused, authentic",posts:"Wellness tips, behind-the-scenes of product development, personal health journey",insight:"Very engaged community. Responds to DMs within hours. Her content style is authentic and approachable — mirror this tone. She's asked followers about website recommendations recently. Perfect timing.",activity:"Very active — daily stories, 3-4 posts/week"},
      {name:"Sophie Taylor",role:"Brand Advisor",ini:"ST",best:false,channel:"LinkedIn",tone:"Strategic, brand-savvy",posts:"Wellness industry trends, DTC brand building, influencer marketing",insight:"Informal advisor helping with launch strategy. Has connections to other wellness founders. A recommendation from Sophie would carry weight with Emma.",activity:"Moderate — weekly posts"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi Emma — I came across Maeve Wellness and love what you're building. I noticed you don't have a website yet — I help wellness brands build beautiful e-commerce sites that convert. I could have you live in 3-4 weeks. Would love to chat."},
      {label:"Warm & personal",tone:"warm",text:"Hey Emma! 👋 Love the Maeve Wellness content — the behind-the-scenes product development posts are so good. I saw you're not live with a website yet. I design e-commerce sites specifically for wellness brands and would genuinely love to help bring Maeve online. DM me if you want to chat!"},
      {label:"Value-led opener",tone:"value",text:"Hi Emma — with 2K engaged followers and no website, you're leaving revenue on the table every day. I help wellness brands launch e-commerce sites that convert social audiences into customers. For brands at your stage, I typically see 3-5% conversion within the first month. Happy to share more."},
      {label:"Community approach",tone:"proof",text:"Hi Emma — I saw your story asking about website options. As someone who's built e-commerce sites for 8 wellness brands, I'd love to share what's worked best. No pitch — genuinely happy to help you evaluate your options. DM me if you'd like some honest advice."},
      {label:"Short & sweet",tone:"brief",text:"Hey Emma — love Maeve Wellness! I design e-commerce sites for wellness brands. If you need a website, I'd love to help. Check out my work at [link]. 💛"}
    ],
    img:"https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=600&fit=crop&q=80",
    g1:"#F9A8D4",g2:"#DB2777",g3:"#9D174D",g4:"#FBCFE8" },
  { id:8,co:"Canopy Solar",loc:"Adelaide, SA",type:"$5.2M Series A",time:"4h",score:8.8,
    scores:{freshness:2,budget:2,match:1.5,urgency:1.5,reach:1.8},
    why:"$5.2M from Blackbird Ventures. Clean energy startup scaling rapidly. Job postings indicate marketing team build-out.",
    whyMatch:"Well-funded climate startups are excellent long-term clients. Your UI/UX skills serve their product and marketing needs. High potential for retainer relationship.",
    contacts:[
      {name:"Tom Richards",role:"CMO",ini:"TR",best:true,channel:"Email",tone:"Professional, metrics-focused",posts:"Clean energy market updates, marketing attribution, B2B demand gen",insight:"Email on the Canopy Solar website. As CMO, he's the direct decision-maker for design spend. Has a background in performance marketing so lead with measurable outcomes of good design.",activity:"Moderate — fortnightly LinkedIn posts"},
      {name:"Sarah Lee",role:"Product Designer",ini:"SL",best:false,channel:"LinkedIn",tone:"Design-focused, collaborative",posts:"Product design process, clean energy UX, design systems",insight:"In-house designer who may need freelance support for overflow. Good for understanding current design needs and potentially becoming an internal champion for your hire.",activity:"Active — weekly design posts"},
      {name:"Mark Johnson",role:"CEO & Co-founder",ini:"MJ",best:false,channel:"LinkedIn",tone:"Visionary, mission-driven",posts:"Climate tech, renewable energy policy, company mission",insight:"Passionate about the mission. Any outreach that connects your work to environmental impact will resonate. Don't cold-approach — get an intro through Tom or Sarah.",activity:"Active — 2-3 posts/week"}
    ],
    messages:[
      {label:"Direct & confident",tone:"bold",text:"Hi Tom — congratulations on the $5.2M raise at Canopy Solar. As you scale the marketing team, I'd love to discuss how freelance brand and digital design support could accelerate your output while you hire. I've worked with 3 climate tech startups on similar growth phases."},
      {label:"Warm & personal",tone:"warm",text:"Hi Tom — exciting to see Canopy Solar's growth. Climate tech is a space I'm passionate about, and I'd love to contribute my design skills to a company making real impact. If you need brand or digital support as you scale, I'm here."},
      {label:"Value-led opener",tone:"value",text:"Hi Tom — in my experience with funded climate tech startups, the 6 months post-Series A is when brand investment has the highest ROI — you're selling to enterprise customers who judge credibility visually. I've helped 3 startups through this phase and happy to share the playbook."},
      {label:"Mission-aligned",tone:"proof",text:"Hi Tom — as a designer who's worked with climate tech companies including [X] and [Y], I'm always looking to support startups making genuine environmental impact. If Canopy needs design support for the growth phase, I'd be honoured to be involved."},
      {label:"Short & sweet",tone:"brief",text:"Hi Tom — congrats on the Series A at Canopy Solar. I do brand and digital design for climate tech startups. Would love to help as you scale. Happy to share relevant work."}
    ],
    img:"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=600&fit=crop&q=80",g1:"#FDE68A",g2:"#F59E0B",g3:"#D97706",g4:"#FEF3C7" },
];

const SKILLS1=["Design","Development","Marketing","Copywriting","Video","Photography","Strategy","Consulting","Virtual Assistant","Social Media","Content Writing","Accounting","Project Mgmt","Sales","Animation","Paid Ads","Ecommerce"];
const SKILLS2_MAP = {
  "Design":["UI/UX","Brand Identity","Web Design","Motion Graphics","Print","3D","Packaging","Illustration","Figma","Adobe Suite"],
  "Development":["React/Next.js","Node.js","Python","WordPress","Shopify","App Dev","API Integration","Database","DevOps","TypeScript"],
  "Marketing":["SEO","Email Marketing","Paid Ads","Social Media Strategy","Content Strategy","Analytics","CRM","Marketing Automation","PR","Influencer"],
  "Copywriting":["Website Copy","Blog Writing","Ad Copy","Email Sequences","Sales Pages","Technical Writing","Brand Voice","UX Writing","Editing","Ghostwriting"],
  "Video":["Video Editing","Motion Graphics","Animation","Colour Grading","Sound Design","YouTube","Reels/TikTok","Documentary","Corporate Video","Live Streaming"],
  "Photography":["Product Photography","Portrait","Event","Real Estate","Food","Lifestyle","Retouching","Drone","Studio","Editorial"],
  "Strategy":["Brand Strategy","Go-to-Market","Business Planning","Competitive Analysis","Positioning","Pricing Strategy","Growth Strategy","Workshop Facilitation","Research","OKRs"],
  "Consulting":["Management Consulting","Digital Transformation","Process Improvement","Change Management","Training","Fractional CMO","Fractional CTO","Advisory","Coaching","Audit"],
  "Virtual Assistant":["Calendar Management","Email Management","Data Entry","Research","Travel Booking","Social Media","Customer Service","Bookkeeping","CRM Management","Transcription"],
  "Social Media":["Instagram","TikTok","LinkedIn","Twitter/X","Pinterest","Community Management","Content Calendar","Analytics","Influencer Outreach","Paid Social"],
  "Content Writing":["Blog Posts","Articles","Whitepapers","Case Studies","Newsletters","Press Releases","SEO Content","Product Descriptions","Scripts","Thought Leadership"],
  "Accounting":["Bookkeeping","Tax Preparation","Payroll","Financial Reporting","Budgeting","Invoicing","Xero","MYOB","QuickBooks","BAS/GST"],
  "Project Mgmt":["Agile/Scrum","Waterfall","Jira","Asana","Monday.com","Stakeholder Management","Risk Management","Resource Planning","Roadmapping","Retrospectives"],
  "Sales":["Lead Generation","Cold Outreach","CRM","Pipeline Management","Closing","Account Management","Sales Strategy","Presentations","Negotiation","Partnership"],
  "Animation":["2D Animation","3D Animation","Character Animation","Explainer Videos","Lottie/Web","After Effects","Cinema 4D","Blender","Storyboarding","Rigging"],
  "Paid Ads":["Google Ads","Meta Ads","LinkedIn Ads","TikTok Ads","Display","Retargeting","Landing Pages","A/B Testing","Attribution","Budget Management"],
  "Ecommerce":["Shopify","WooCommerce","Product Listings","Conversion Optimisation","Email Flows","Inventory","Marketplace","Amazon","Stripe","Subscription"]
};
const STATUSES=["To-do","Reached out","Replied","Follow up"];

const Logo=({size=20,color=C.bk})=> <svg viewBox="0 0 215.54 197.68" width={size} height={size*.917} fill={color}><path d="M152.75,37.23c-11.87,2.72-17.46,20.48-20.58,32.08l-37.1.11C101.58,36.59,112.81,3.22,151.65.19c33-2.58,61.56,21.55,63.76,54.26,2.2,32.6-23.12,61.97-57.05,62.04l-109.67.24-.33,21.26L0,98.45l48.37-39.6.34,21.33,109.7-.1c13.32-.01,22-12.58,20.54-24.25-1.58-12.69-13.34-21.54-26.21-18.6Z"/><path d="M53.67,159.31c17.48-4.98,22.58-15.91,28.45-31.83l37.63.03c-8.55,31.77-21.39,55.74-53.75,65.99-11.26,3.05-22.71,4.37-34.54,4.14l-31.32-.6-.09-36.24,33.42.47c6.81.1,13.58-.84,20.2-1.97Z"/></svg>;

const scoreColor = s => s >= 8 ? "#22c55e" : s >= 5 ? "#f59e0b" : "#ef4444";

const Phone = ({ children }) => <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#e4e4e7", padding:16, fontFamily:"'Helvetica Neue',Helvetica,-apple-system,sans-serif", WebkitFontSmoothing:"antialiased" }}>
  <style>{`
    @keyframes gradShift{0%{background-position:0% 0%}25%{background-position:100% 0%}50%{background-position:100% 100%}75%{background-position:0% 100%}100%{background-position:0% 0%}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes sp{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    @keyframes cfall{0%{transform:translateY(-30px) rotate(0);opacity:1}100%{transform:translateY(900px) rotate(400deg);opacity:0}}
    @keyframes scoreGlow{0%,100%{box-shadow:0 0 12px rgba(255,77,109,.3)}50%{box-shadow:0 0 24px rgba(255,77,109,.6)}}
  `}</style>
  <div style={{ width:375, height:812, borderRadius:50, background:"#000", padding:10, boxShadow:"0 40px 80px rgba(0,0,0,.25)", position:"relative", flexShrink:0 }}>
    <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:126, height:32, background:"#000", borderRadius:"0 0 20px 20px", zIndex:999 }} />
    <div style={{ width:"100%", height:"100%", borderRadius:42, overflow:"hidden", position:"relative", background:C.bg }}>{children}</div>
  </div>
</div>;

const Confetti = ({ active }) => {
  if (!active) return null;
  return <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:100, overflow:"hidden" }}>
    {Array.from({ length:8 }, (_, i) => <div key={i} style={{ position:"absolute", left:`${10+Math.random()*80}%`, top:-20, width:22+Math.random()*18, height:13+Math.random()*9, background:["#FF4D6D","#FF6B81","#FF8FA3","#FFB3C1","#E8445F","#FF4D6D","#C7365A","#FF8FA3"][i], borderRadius:3, animation:`cfall ${.8+Math.random()*.4}s ease-in ${Math.random()*.15}s forwards` }} />)}
  </div>;
};

const BNav = ({ active, onNav }) => <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.wh, borderTop:`1px solid ${C.rl}`, display:"flex", padding:"8px 0 20px", zIndex:50 }}>
  {[{ id:"feed", label:"Feed", d:"M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" },{ id:"saved", label:"Pings", d:"M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" },{ id:"refer", label:"Refer", d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" },{ id:"profile", label:"Profile", d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }].map(item =>
    <div key={item.id} onClick={() => onNav(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", color:active === item.id ? C.coral : C.lt, transition:"color .15s" }}>
      <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" style={{ transform:active === item.id ? "scale(1.1)" : "scale(1)", transition:"transform .2s cubic-bezier(.34,1.56,.64,1)" }}><path d={item.d} /></svg>
      <span style={{ fontSize:9, fontWeight:600 }}>{item.label}</span>
    </div>
  )}
</div>;

// ═══ TINDER-STYLE CARD — gradient fills 80%, info overlaid at bottom ═══
const SwipeCard = ({ ping, idx, isTop, onSwipe, onTap, blurred }) => {
  const ref = useRef(null);
  const sx = useRef(0);
  const [ox, setOx] = useState(0);
  const [drag, setDrag] = useState(false);
  const moved = useRef(false);

  const start = cx => { if (!isTop || blurred) return; sx.current = cx; setDrag(true); moved.current = false; };
  const mv = useCallback(cx => { if (!drag) return; const d = cx - sx.current; if (Math.abs(d) > 3) moved.current = true; setOx(d); }, [drag]);
  const end = useCallback(() => {
    if (!drag) return; setDrag(false);
    const w = ref.current ? ref.current.offsetWidth : 300;
    if (Math.abs(ox) > w * 0.28) {
      const dir = ox > 0 ? "right" : "left";
      setOx(dir === "right" ? 600 : -600);
      setTimeout(() => { onSwipe(dir); setOx(0); }, 280);
    } else { setOx(0); }
  }, [drag, ox, onSwipe]);

  useEffect(() => {
    const m = e => mv(e.clientX);
    const u = () => end();
    if (drag) { window.addEventListener("mousemove", m); window.addEventListener("mouseup", u); }
    return () => { window.removeEventListener("mousemove", m); window.removeEventListener("mouseup", u); };
  }, [drag, mv, end]);

  const sc = 1 - idx * 0.05;
  const ty = idx * 12;
  const rot = Math.max(-14, Math.min(14, ox * 0.05));
  const sop = Math.min(1, Math.abs(ox) / 90);
  const sCol = scoreColor(ping.score);
  const barW = (ping.score / 10) * 100;

  // Animated gradient background for each card — unique colours per ping
  const animGrad = `linear-gradient(135deg, ${ping.g1}, ${ping.g2}, ${ping.g3}, ${ping.g4}, ${ping.g1})`;

  return (
    <div ref={ref}
      onMouseDown={e => start(e.clientX)}
      onTouchStart={e => start(e.touches[0].clientX)}
      onTouchMove={e => { mv(e.touches[0].clientX); if (Math.abs(ox) > 8) e.preventDefault(); }}
      onTouchEnd={end}
      onClick={() => { if (!moved.current && isTop && !blurred) onTap(ping); }}
      style={{
        position:"absolute", inset:0, borderRadius:28, overflow:"hidden",
        boxShadow: isTop ? "0 12px 48px rgba(0,0,0,.15)" : "0 4px 16px rgba(0,0,0,.05)",
        transform: isTop ? `translateX(${ox}px) rotate(${rot}deg)` : `scale(${sc}) translateY(${ty}px)`,
        transition: drag ? "none" : "transform .45s cubic-bezier(.34,1.56,.64,1)",
        zIndex: 10 - idx,
        cursor: isTop && !blurred ? "grab" : "default",
        pointerEvents: isTop ? "auto" : "none",
        filter: blurred ? "blur(8px)" : "none",
        touchAction:"none", userSelect:"none",
      }}
    >
      {/* FULL CARD BACKGROUND — image with gradient overlay */}
      <div style={{ position:"absolute", inset:0 }}>
        {/* Animated gradient base */}
        <div style={{ position:"absolute", inset:0, background:animGrad, backgroundSize:"300% 300%", animation:"gradShift 8s ease infinite" }} />
        {/* Image layer */}
        {ping.img && <div style={{ position:"absolute", inset:0, backgroundImage:`url(${ping.img})`, backgroundSize:"cover", backgroundPosition:"center", opacity:.75, mixBlendMode:"luminosity" }} />}
        {/* Dark overlay for text readability */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.05) 40%, rgba(0,0,0,.5) 70%, rgba(0,0,0,.75) 100%)" }} />
      </div>

      {/* Score pill — top left, floating */}
      <div style={{ position:"absolute", top:16, left:16, display:"flex", alignItems:"center", gap:6, zIndex:5 }}>
        <div style={{
          background:"rgba(0,0,0,.3)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
          borderRadius:999, padding:"6px 12px", display:"flex", alignItems:"center", gap:6,
        }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:sCol, boxShadow:`0 0 8px ${sCol}` }} />
          <span style={{ fontSize:13, fontWeight:800, color:"#fff" }}>{ping.score.toFixed(1)}</span>
        </div>
      </div>

      {/* Time — top right */}
      <span style={{ position:"absolute", top:18, right:16, fontSize:12, fontWeight:500, color:"rgba(255,255,255,.5)", zIndex:5 }}>{ping.time} ago</span>

      {/* Giant company initial — centre of the gradient */}
      <div style={{ position:"absolute", top:"20%", left:0, right:0, textAlign:"center", zIndex:2 }}>
        <span style={{ display:"none", fontWeight:900, color:"rgba(255,255,255,.15)", letterSpacing:-6, lineHeight:1 }}>{ping.co.charAt(0)}</span>
      </div>

      {/* PING / SKIP stamps */}
      {ox > 0 && <div style={{ position:"absolute", top:"35%", left:"50%", transform:`translate(-50%,-50%) scale(${.5+sop*.5}) rotate(-15deg)`, fontSize:28, fontWeight:900, letterSpacing:5, color:"#fff", background:"rgba(34,197,94,.9)", border:"none", borderRadius:14, padding:"10px 24px", opacity:sop, zIndex:10, boxShadow:"0 0 40px rgba(34,197,94,.5), 0 4px 16px rgba(0,0,0,.3)" }}>PING ✓</div>}
      {ox < 0 && <div style={{ position:"absolute", top:"35%", left:"50%", transform:`translate(-50%,-50%) scale(${.5+sop*.5}) rotate(15deg)`, fontSize:28, fontWeight:900, letterSpacing:5, color:"#fff", background:"rgba(239,68,68,.8)", border:"none", borderRadius:14, padding:"10px 24px", opacity:sop, zIndex:10, boxShadow:"0 0 40px rgba(239,68,68,.4), 0 4px 16px rgba(0,0,0,.3)" }}>SKIP ✗</div>}

      {/* Bottom info overlay — frosted glass */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, zIndex:5,
        background:"linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.4) 60%, transparent 100%)",
        padding:"60px 20px 20px",
      }}>
        {/* Score bar */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <div style={{ flex:1, height:4, background:"rgba(255,255,255,.15)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${barW}%`, background:sCol, borderRadius:2 }} />
          </div>
          <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,.5)", letterSpacing:.5, textTransform:"uppercase" }}>{ping.type}</span>
        </div>

        {/* Company name + location */}
        <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:-.8, lineHeight:1.1, marginBottom:2 }}>{ping.co}</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginBottom:10 }}>{ping.loc}</div>

        {/* Why — one line teaser */}
        <div style={{ fontSize:13, fontWeight:300, color:"rgba(255,255,255,.65)", lineHeight:1.4, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", marginBottom:12 }}>{ping.why}</div>

        {/* Contact preview + arrows */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff" }}>{ping.ini}</div>
            <div style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,.7)" }}>{ping.who}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"rgba(255,255,255,.35)" }}>
              <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>skip
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"#fff", fontWeight:700 }}>
              ping<svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor"><path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══ MAIN APP ═══
export default function App() {
  const [scr, setScr] = useState("splash");
  const [ci, setCi] = useState(0);
  const [saved, setSaved] = useState([]);
  const [savedStatus, setSavedStatus] = useState({});
  const [obs, setObs] = useState(1);
  const [sel, setSel] = useState([]);
  const [step1Sel, setStep1Sel] = useState([]);
  const [skills, setSkills] = useState(["Design", "UI/UX", "Brand"]);
  const [pw, setPw] = useState(false);
  const [det, setDet] = useState(null);
  const [detTab, setDetTab] = useState("overview");
  const [sm, setSm] = useState(false);
  const [cp, setCp] = useState(false);
  const [sentMsgs, setSentMsgs] = useState({});
  const [conf, setConf] = useState(false);
  const [loc, setLoc] = useState("");
  const [remote, setRemote] = useState(true);
  const [bio, setBio] = useState("Freelance designer with 13 years experience.");
  const [svFilter, setSvFilter] = useState("All");
  const LIM = 5, name = "Gray";

  useEffect(() => { if (scr === "splash") { const t = setTimeout(() => setScr("login"), 1400); return () => clearTimeout(t); } }, [scr]);

  const doSwipe = dir => {
    if (dir === "right") {
      setSaved(s => [...s, PINGS[ci]]);
      setSavedStatus(s => ({ ...s, [PINGS[ci].co]: "To-do" }));
      setConf(true);
      setTimeout(() => setConf(false), 1200);
    }
    setCi(ci + 1);
    if (ci + 1 >= LIM) setPw(true);
  };

  const copyMsg = t => { navigator.clipboard?.writeText(t); setCp(true); setTimeout(() => setCp(false), 1500); };

  // ═══ SPLASH ═══
  if (scr === "splash") return (
    <Phone>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#FF6B81,#FF4D6D,#C7365A,#FF8FA3)", backgroundSize:"300% 300%", animation:"gradShift 6s ease infinite", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ animation:"sp 1s ease-in-out infinite" }}><Logo size={56} color="#fff" /></div>
      </div>
    </Phone>
  );

  // ═══ LOGIN ═══
  if (scr === "login") return (
    <Phone>
      <div style={{ position:"absolute", inset:0, background:C.wh, display:"flex", flexDirection:"column", padding:"0 24px" }}>
        {/* Hero gradient card */}
        <div style={{
          marginTop:56, borderRadius:28, overflow:"hidden", minHeight:240,
          background:"linear-gradient(135deg,#FF6B81,#FF4D6D,#C7365A,#FF8FA3)",
          backgroundSize:"300% 300%", animation:"gradShift 8s ease infinite",
          display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:28,
        }}>
          <Logo size={32} color="rgba(255,255,255,.6)" />
          <div style={{ height:12 }} />
          <div style={{ fontSize:28, fontWeight:800, letterSpacing:-1, lineHeight:1.1, color:"#fff" }}>
            Land clients before they{" "}<span style={{ animation:"pulse 2s ease-in-out infinite", display:"inline" }}>need</span>{" "}you
          </div>
          <div style={{ fontSize:13, fontWeight:300, color:"rgba(255,255,255,.6)", marginTop:10 }}>AI-powered pings matched to your skills.</div>
        </div>
        <div style={{ flex:1 }} />
        <div style={{ paddingBottom:44, display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { label:"Continue with Google", bg:C.bk, c:"#fff", icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09a6.96 6.96 0 010-4.17V7.08H2.18a11.5 11.5 0 000 9.84l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
            { label:"Continue with Apple", bg:C.bk, c:"#fff", icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.96 4.33-3.74 4.25z"/></svg> },
            { label:"Continue with email", bg:C.wh, c:C.bk, bdr:true, icon: <svg viewBox="0 0 24 24" width={18} height={18} fill={C.bk}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> },
          ].map((b, i) => <button key={i} onClick={() => { setObs(1); setSel([]); setScr("ob"); }} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:16, borderRadius:16, border:b.bdr ? `1.5px solid ${C.rl}` : "none", background:b.bg, color:b.c, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", minHeight:52 }}>{b.icon}{b.label}</button>)}
        </div>
      </div>
    </Phone>
  );

  // ═══ ONBOARDING ═══
  if (scr === "ob") {
    const getStep2Skills = () => {
      const mapped = step1Sel.length > 0 ? step1Sel : [];
      const allSubs = [];
      mapped.forEach(s => { if (SKILLS2_MAP[s]) allSubs.push(...SKILLS2_MAP[s]); });
      return [...new Set(allSubs)].slice(0, 16);
    };
    const chips = obs === 1 ? SKILLS1 : getStep2Skills();
    const t = { 1:"What do you do?", 2:"Get more specific", 3:"Where are you?" };
    return (
      <Phone>
        <div style={{ position:"absolute", inset:0, background:C.wh, display:"flex", flexDirection:"column", padding:"56px 24px 36px", alignItems:"center" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:C.lt, marginBottom:10 }}>Step {obs} of 3</div>
          <div style={{ display:"flex", gap:6, marginBottom:28 }}>{[1,2,3].map(i => <div key={i} style={{ width:36, height:4, borderRadius:2, background:i <= obs ? C.coral : C.rl }} />)}</div>
          <div style={{ fontSize:26, fontWeight:800, letterSpacing:-.8, textAlign:"center", marginBottom:6 }}>{t[obs]}</div>
          <div style={{ fontSize:14, fontWeight:300, color:C.mid, textAlign:"center", marginBottom:24 }}>
            {obs === 1 ? "Pick your main skills." : obs === 2 ? "The more specific, the better." : "Include local and remote."}
          </div>
          {obs < 3 ? <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", flex:1, overflowY:"auto", alignContent:"flex-start", paddingBottom:16 }}>
            {chips.map(c => <button key={c} onClick={() => setSel(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])} style={{ fontSize:13, fontWeight:500, padding:"10px 18px", borderRadius:999, border:`1.5px solid ${sel.includes(c) ? C.coral : C.rl}`, background:sel.includes(c) ? C.coral : C.wh, color:sel.includes(c) ? "#fff" : C.bk, cursor:"pointer", fontFamily:"inherit", minHeight:42 }}>{c}</button>)}
          </div> : <div style={{ flex:1, width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
            <input value={loc} onChange={e => setLoc(e.target.value)} placeholder="e.g. Melbourne, Australia" style={{ width:"100%", fontSize:16, fontWeight:300, padding:16, borderRadius:16, border:`1.5px solid ${C.rl}`, outline:"none", textAlign:"center", fontFamily:"inherit", color:C.bk, minHeight:52 }} onFocus={e => { e.target.style.borderColor = C.coral; }} onBlur={e => { e.target.style.borderColor = C.rl; }} />
            <button onClick={() => setRemote(!remote)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:14, borderRadius:16, border:`1.5px solid ${remote ? C.coral : C.rl}`, background:remote ? C.blush : C.wh, color:remote ? C.coral : C.mid, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>🌍 Include remote</button>
          </div>}
          <button onClick={() => { if (obs < 3) { if (obs === 1) setStep1Sel([...sel]); setObs(obs + 1); setSel([]); } else { setScr("feed"); setCi(0); setPw(false); } }} style={{ width:"100%", padding:16, borderRadius:999, border:"none", background:C.coral, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"inherit", opacity:obs < 3 && sel.length === 0 ? .35 : 1, minHeight:52, marginTop:16 }}>{obs < 3 ? "Continue" : "Start pinging"}</button>
        </div>
      </Phone>
    );
  }

  // ═══ DETAIL ═══
  if (scr === "detail" && det) {
    const status = savedStatus[det.co] || "To-do";
    const activeContact = det.contacts ? det.contacts[0] : null;
    return (
      <Phone>
        <div style={{ position:"absolute", inset:0, background:C.bg, display:"flex", flexDirection:"column" }}>
          <div style={{ margin:"48px 14px 0", borderRadius:24, overflow:"hidden", height:160, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
            <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${det.g1},${det.g2},${det.g3},${det.g4})`, backgroundSize:"300% 300%", animation:"gradShift 8s ease infinite" }} />
            {det.img && <div style={{ position:"absolute", inset:0, backgroundImage:`url(${det.img})`, backgroundSize:"cover", backgroundPosition:"center", opacity:.65, mixBlendMode:"luminosity" }} />}
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.4))" }} />
            <button onClick={() => setScr(saved.some(s => s.id === det.id) ? "saved" : "feed")} style={{ position:"absolute", top:12, left:12, width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,.2)", backdropFilter:"blur(10px)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,.25)", backdropFilter:"blur(10px)", padding:"4px 10px", borderRadius:999 }}>
              <span style={{ fontSize:12, fontWeight:800, color:"#fff" }}>{det.score.toFixed(1)}</span>
            </div>
            <span style={{ fontSize:0, display:"none" }}>{det.co.charAt(0)}</span>
          </div>
          <div style={{ padding:"10px 14px 2px" }}>
            <div style={{ fontSize:20, fontWeight:800, letterSpacing:-.5 }}>{det.co}</div>
            <div style={{ fontSize:12, color:C.lt }}>{det.loc} · {det.type} · {det.time} ago</div>
          </div>
          {/* 4 Tabs */}
          <div style={{ display:"flex", margin:"8px 14px 0", background:C.wh, borderRadius:12, padding:3, flexShrink:0 }}>
            {["Overview","Contacts","Messages","Score"].map(t => <button key={t} onClick={() => setDetTab(t.toLowerCase())} style={{ flex:1, padding:"9px 0", fontSize:11, fontWeight:600, color:detTab === t.toLowerCase() ? C.wh : C.lt, background:detTab === t.toLowerCase() ? C.coral : "transparent", borderRadius:9, border:"none", cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>{t}</button>)}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px 28px" }}>

            {detTab === "overview" && <>
              <div style={{ background:C.blush, borderRadius:14, padding:14, marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.coral, marginBottom:4 }}>Why this matches you, {name}</div>
                <div style={{ fontSize:13, fontWeight:400, lineHeight:1.6, color:C.mid }}>{det.whyMatch}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:300, lineHeight:1.6, color:C.mid, marginBottom:14 }}>{det.why}</div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.lt, marginBottom:8 }}>Status</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {STATUSES.map(st => <button key={st} onClick={() => setSavedStatus(s => ({ ...s, [det.co]:st }))} style={{ fontSize:11, fontWeight:600, padding:"7px 14px", borderRadius:999, border:`1.5px solid ${status === st ? C.coral : C.rl}`, background:status === st ? C.coral : C.wh, color:status === st ? "#fff" : C.mid, cursor:"pointer", fontFamily:"inherit" }}>{st}</button>)}
              </div>
            </>}

            {detTab === "contacts" && det.contacts && <>
              {det.contacts.map((c, ci) => (
                <div key={ci} style={{ background:C.wh, borderRadius:16, border:c.best ? `1.5px solid ${C.coral}` : `1px solid ${C.rl}`, padding:16, marginBottom:10, position:"relative" }}>
                  {c.best && <div style={{ position:"absolute", top:-1, right:16, background:C.coral, color:"#fff", fontSize:9, fontWeight:700, letterSpacing:.5, padding:"3px 10px", borderRadius:"0 0 8px 8px", textTransform:"uppercase" }}>Best contact</div>}
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${det.g1},${det.g2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>{c.ini}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:700 }}>{c.name}</div>
                      <div style={{ fontSize:11, color:C.lt }}>{c.role}</div>
                    </div>
                    <div style={{ fontSize:10, fontWeight:600, color:C.coral, background:C.blush, padding:"4px 10px", borderRadius:999 }}>{c.channel}</div>
                  </div>
                  {c.name !== "Unknown" && <>
                    <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                      <div style={{ flex:1, background:C.bg, borderRadius:10, padding:"8px 10px" }}>
                        <div style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:C.lt, marginBottom:3 }}>Tone</div>
                        <div style={{ fontSize:11, fontWeight:500, color:C.bk }}>{c.tone}</div>
                      </div>
                      <div style={{ flex:1, background:C.bg, borderRadius:10, padding:"8px 10px" }}>
                        <div style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:C.lt, marginBottom:3 }}>Activity</div>
                        <div style={{ fontSize:11, fontWeight:500, color:C.bk }}>{c.activity}</div>
                      </div>
                    </div>
                    <div style={{ background:C.bg, borderRadius:10, padding:"8px 10px", marginBottom:8 }}>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:C.lt, marginBottom:3 }}>Posts about</div>
                      <div style={{ fontSize:11, fontWeight:300, color:C.mid, lineHeight:1.4 }}>{c.posts}</div>
                    </div>
                    <div style={{ background:C.blush, borderRadius:10, padding:"8px 10px" }}>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:C.coral, marginBottom:3 }}>Key insight</div>
                      <div style={{ fontSize:11, fontWeight:400, color:C.mid, lineHeight:1.4 }}>{c.insight}</div>
                    </div>
                  </>}
                </div>
              ))}
            </>}

            {detTab === "messages" && det.messages && <>
              <div style={{ fontSize:11, fontWeight:300, color:C.lt, marginBottom:10 }}>5 pre-written messages tailored to {det.co}. Tap to copy.</div>
              {det.messages.map((m, mi) => (
                <div key={mi} style={{ background:C.wh, borderRadius:14, border:sentMsgs[det.id+"_"+mi] ? "1.5px solid #22c55e" : `1px solid ${C.rl}`, padding:14, marginBottom:8, position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.bk }}>{m.label}</div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={() => { copyMsg(m.text); }} style={{ fontSize:9, fontWeight:600, color:"#fff", background:C.coral, padding:"4px 10px", borderRadius:999, border:"none", cursor:"pointer", fontFamily:"inherit" }}>{cp ? "Copied!" : "Copy to send"}</button>
                    </div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:300, lineHeight:1.55, color:C.mid, marginBottom:8 }}>{m.text}</div>
                  <div onClick={() => setSentMsgs(s => ({...s, [det.id+"_"+mi]: !s[det.id+"_"+mi]}))} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"6px 0 2px", borderTop:`1px solid ${C.rl}` }}>
                    <div style={{ width:20, height:20, borderRadius:6, border:sentMsgs[det.id+"_"+mi] ? "none" : `1.5px solid ${C.rl}`, background:sentMsgs[det.id+"_"+mi] ? "#22c55e" : C.wh, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", flexShrink:0 }}>
                      {sentMsgs[det.id+"_"+mi] && <svg viewBox="0 0 24 24" width={12} height={12} fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                    </div>
                    <span style={{ fontSize:11, fontWeight:500, color:sentMsgs[det.id+"_"+mi] ? "#22c55e" : C.lt }}>{sentMsgs[det.id+"_"+mi] ? "Sent ✓" : "Mark as sent"}</span>
                  </div>
                </div>
              ))}
            </>}

            {detTab === "score" && det.scores && <>
              <div style={{ textAlign:"center", marginBottom:16 }}>
                <div style={{ fontSize:48, fontWeight:900, color:scoreColor(det.score), letterSpacing:-2, lineHeight:1 }}>{det.score.toFixed(1)}</div>
                <div style={{ fontSize:12, color:C.lt, marginTop:4 }}>out of 10</div>
              </div>
              {[
                {key:"freshness",label:"Signal freshness",desc:"How recent is the buying trigger?",max:2},
                {key:"budget",label:"Budget likelihood",desc:"How likely is there budget for freelance?",max:2},
                {key:"match",label:"Skill match",desc:"How closely does this match your profile?",max:2},
                {key:"urgency",label:"Urgency",desc:"How time-sensitive is the opportunity?",max:2},
                {key:"reach",label:"Reachability",desc:"How accessible is the decision-maker?",max:2},
              ].map((r,ri) => {
                const val = det.scores[r.key] || 0;
                const pct = (val / r.max) * 100;
                const col = val >= 1.5 ? "#22c55e" : val >= 1 ? "#f59e0b" : "#ef4444";
                return <div key={ri} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <div style={{ fontSize:12, fontWeight:600 }}>{r.label}</div>
                    <div style={{ fontSize:12, fontWeight:800, color:col }}>{val.toFixed(1)}/{r.max}</div>
                  </div>
                  <div style={{ height:6, background:C.rl, borderRadius:3, overflow:"hidden", marginBottom:2 }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:col, borderRadius:3, transition:"width .5s ease" }} />
                  </div>
                  <div style={{ fontSize:10, color:C.lt }}>{r.desc}</div>
                </div>;
              })}
              <div style={{ background:C.bg, borderRadius:12, padding:12, marginTop:8 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.lt, marginBottom:6 }}>How we score</div>
                <div style={{ fontSize:11, fontWeight:300, lineHeight:1.5, color:C.mid }}>Each ping is scored across 5 dimensions on a 0-2 scale. Scores above 8 indicate high-confidence opportunities. The total is normalised to a 10-point scale for easy comparison.</div>
              </div>
            </>}

          </div>
        </div>
      </Phone>
    );
  }

  // ═══ MAIN TABS ═══
  const tab = ["feed","saved","refer","profile"].includes(scr) ? scr : "feed";
  const gradCard = { background:"linear-gradient(135deg,#FF6B81,#FF4D6D,#C7365A,#FF8FA3)", backgroundSize:"300% 300%", animation:"gradShift 8s ease infinite", borderRadius:24, padding:24, color:"#fff" };

  return (
    <Phone>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", background:C.bg }}>
        <Confetti active={conf} />

        {/* FEED */}
        {tab === "feed" && <>
          <div style={{ padding:"50px 20px 8px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <Logo size={24} color={C.bk} />
            <div style={{ fontSize:12, fontWeight:700, color:C.coral, background:C.blush, padding:"6px 14px", borderRadius:999 }}>{Math.max(0, LIM - ci)} left</div>
          </div>
          <div style={{ flex:1, position:"relative", padding:"0 12px", paddingBottom:72, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"relative", width:"100%", maxWidth:350, height:510 }}>
              {PINGS.slice(ci, ci + 3).map((p, i) => <SwipeCard key={ci + i} ping={p} idx={i} isTop={i === 0} onSwipe={doSwipe} onTap={p => { setDet(p); setDetTab("overview"); setScr("detail"); }} blurred={pw && i > 0} />)}
            </div>
            {pw && <div style={{ position:"absolute", inset:16, zIndex:20, borderRadius:28, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28, textAlign:"center", background:"linear-gradient(135deg,#FF6B81,#FF4D6D,#C7365A,#FF8FA3)", backgroundSize:"300% 300%", animation:"gradShift 6s ease infinite" }}>
              <Logo size={40} color="rgba(255,255,255,.2)" />
              <div style={{ height:16 }} />
              <div style={{ fontSize:26, fontWeight:800, letterSpacing:-.8, color:"#fff", lineHeight:1.1, marginBottom:10 }}>Daily limit reached</div>
              <div style={{ fontSize:14, fontWeight:300, color:"rgba(255,255,255,.6)", lineHeight:1.5, marginBottom:28, maxWidth:260 }}>Upgrade for unlimited pings and priority matches.</div>
              <button style={{ padding:"16px 32px", borderRadius:999, border:"none", background:"#fff", color:C.coral, fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"inherit", minHeight:52, width:"100%", marginBottom:8 }}>Upgrade — $9/mo</button>
              <button onClick={() => setPw(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,.5)", fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:10 }}>Maybe later</button>
            </div>}
          </div>
        </>}

        {/* SAVED */}
        {tab === "saved" && <>
          <div style={{ padding:"50px 20px 10px" }}><div style={{ fontSize:22, fontWeight:800 }}>Your pings</div></div>
          <div style={{ display:"flex", gap:6, padding:"4px 20px 10px", overflowX:"auto", flexShrink:0 }}>
            {["All",...STATUSES].map(f => <button key={f} onClick={() => setSvFilter(f)} style={{ fontSize:11, fontWeight:600, padding:"6px 14px", borderRadius:999, background:svFilter === f ? C.coral : C.wh, color:svFilter === f ? "#fff" : C.mid, border:svFilter === f ? "none" : `1px solid ${C.rl}`, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>{f}</button>)}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"4px 16px 84px" }}>
            {saved.length === 0 ? <div style={{ textAlign:"center", padding:"80px 32px" }}><div style={{ fontSize:40, marginBottom:12 }}>📭</div><div style={{ fontSize:20, fontWeight:800 }}>No pings yet</div><div style={{ fontSize:14, fontWeight:300, color:C.mid, marginTop:6 }}>Swipe right to save pings here.</div></div>
            : saved.filter(p => svFilter === "All" || (savedStatus[p.co] || "To-do") === svFilter).map((p, i) => {
              const st = savedStatus[p.co] || "To-do";
              const stC = st === "Replied" ||  st === "Reached out" ? "#f59e0b" : C.coral;
              return <div key={i} onClick={() => { setDet(p); setDetTab("overview"); setScr("detail"); }} style={{ display:"flex", alignItems:"center", gap:14, padding:16, background:C.wh, borderRadius:16, marginBottom:8, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${p.g1},${p.g2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#fff", flexShrink:0 }}>{p.co.charAt(0)}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:700 }}>{p.co}</div><div style={{ fontSize:12, color:C.lt, marginTop:1 }}>{p.type}</div></div>
                <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", padding:"4px 10px", borderRadius:999, background:`${stC}15`, color:stC }}>{st}</div>
              </div>;
            })}
          </div>
        </>}

        {/* REFER */}
        {tab === "refer" && <>
          <div style={{ padding:"50px 20px 10px" }}><div style={{ fontSize:22, fontWeight:800 }}>Refer & earn</div></div>
          <div style={{ flex:1, overflowY:"auto", padding:"8px 20px 84px" }}>
            <div style={{ ...gradCard, marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.6)" }}>Bonus pings earned</div>
              <div style={{ fontSize:44, fontWeight:800, lineHeight:1 }}>0</div>
              <div style={{ fontSize:12, fontWeight:300, color:"rgba(255,255,255,.5)", marginTop:6 }}>Invite friends to earn 5 each</div>
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              {[{n:"0",l:"Invited"},{n:"0",l:"Signed up"}].map((s,i) => <div key={i} style={{ flex:1, background:C.wh, borderRadius:16, padding:16, textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.coral }}>{s.n}</div>
                <div style={{ fontSize:10, color:C.lt, marginTop:2 }}>{s.l}</div>
              </div>)}
            </div>
            <div style={{ background:C.wh, borderRadius:16, padding:16, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.lt, marginBottom:8 }}>Your referral link</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ flex:1, fontSize:13, fontWeight:500, background:C.bg, padding:"10px 14px", borderRadius:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>ping.app/ref/{name.toLowerCase()}</div>
                <button style={{ fontSize:12, fontWeight:700, color:"#fff", background:C.coral, padding:"10px 16px", borderRadius:10, border:"none", cursor:"pointer", fontFamily:"inherit" }}>Copy</button>
              </div>
            </div>
            <button style={{ width:"100%", padding:16, borderRadius:999, border:"none", background:C.bk, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", minHeight:52 }}>Share with friends</button>
          </div>
        </>}

        {/* PROFILE */}
        {tab === "profile" && <>
          <div style={{ padding:"50px 20px 10px", display:"flex", justifyContent:"space-between" }}>
            <div style={{ fontSize:22, fontWeight:800 }}>Profile</div>
            <div style={{ fontSize:12, fontWeight:600, color:C.coral, background:C.blush, padding:"6px 14px", borderRadius:999, cursor:"pointer" }}>Free plan</div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"8px 20px 90px" }}>
            <div style={{ ...gradCard, display:"flex", alignItems:"center", gap:16, padding:20, marginBottom:20 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,255,255,.3)", flexShrink:0 }}>
                <svg viewBox="0 0 24 24" width={26} height={26} fill="rgba(255,255,255,.8)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div><div style={{ fontSize:20, fontWeight:800 }}>{name}</div><div style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginTop:2 }}>{loc || "Melbourne, AU"}</div></div>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.lt, marginBottom:10 }}>Skills</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {skills.map(s => <span key={s} onClick={() => setSkills(sk => sk.filter(x => x !== s))} style={{ fontSize:13, fontWeight:600, padding:"8px 16px", borderRadius:999, background:C.coral, color:"#fff", cursor:"pointer" }}>{s} ×</span>)}
                <span onClick={() => setSm(true)} style={{ fontSize:13, fontWeight:500, padding:"8px 16px", borderRadius:999, border:`1.5px dashed ${C.rl}`, color:C.lt, cursor:"pointer" }}>+ Add</span>
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.lt, marginBottom:10 }}>Bio</div>
              <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} style={{ width:"100%", fontFamily:"inherit", fontSize:14, fontWeight:300, lineHeight:1.6, padding:"14px 16px", borderRadius:16, border:`1px solid ${C.rl}`, resize:"none", outline:"none", color:C.bk, background:C.wh }} onFocus={e => { e.target.style.borderColor = C.coral; }} onBlur={e => { e.target.style.borderColor = C.rl; }} />
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.lt, marginBottom:10 }}>Links</div>
              {["Website","LinkedIn","X"].map(l => <div key={l} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.wh, borderRadius:14, marginBottom:8, boxShadow:"0 2px 8px rgba(0,0,0,.03)" }}>
                <span style={{ fontSize:12, fontWeight:600, color:C.lt, width:60 }}>{l}</span>
                <input placeholder={`your ${l.toLowerCase()} url`} style={{ flex:1, fontFamily:"inherit", fontSize:13, fontWeight:300, border:"none", outline:"none", color:C.bk, background:"transparent" }} />
              </div>)}
            </div>
          </div>
          {sm && <>
            <div onClick={() => setSm(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.4)", zIndex:60 }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:61, background:C.wh, borderRadius:"22px 22px 0 0", padding:"12px 24px 30px" }}>
              <div style={{ width:40, height:4, borderRadius:2, background:C.rl, margin:"0 auto 18px" }} />
              <div style={{ fontSize:20, fontWeight:800, textAlign:"center", marginBottom:16 }}>Add a skill</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:18 }}>
                {["Copywriting","SEO","Motion Design","Photography","Video Editing","Strategy","Social Media","Content Writing","Analytics","PR"].filter(s => !skills.includes(s)).map(s => <button key={s} onClick={() => { if (skills.length < 10) setSkills(sk => [...sk, s]); }} style={{ fontSize:13, fontWeight:500, padding:"9px 16px", borderRadius:999, border:`1px solid ${C.rl}`, color:C.mid, cursor:"pointer", fontFamily:"inherit", background:C.wh }}>{s}</button>)}
              </div>
              <button onClick={() => setSm(false)} style={{ width:"100%", padding:16, borderRadius:999, border:"none", background:C.coral, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", minHeight:52 }}>Done</button>
            </div>
          </>}
        </>}

        <BNav active={tab} onNav={id => setScr(id)} />
      </div>
    </Phone>
  );
}
