export const STATS = [
  {
    key: 'upd',
    value: 'Jan 2026',
    description: 'Last Updated',
    icon: 'calendar',
  },
  {
    key: 'sld',
    value: 'Never',
    description: 'Data Sold',
    icon: 'ban',
  },
  {
    key: 'ckl',
    value: 'Minimal',
    description: 'Cookie Use',
    icon: 'clock',
  },
  {
    key: 'rsp',
    value: '30 Days',
    description: 'Request Response',
    icon: 'mail',
  },
] as const;

export const PHILOSOPHY =
  'I believe in collecting only the minimum data necessary for functionality. I do not sell, trade, or rent your personal information to third parties under any circumstances. Your data is used solely to provide and improve the website experience.';

export const PRIVACY_SECTIONS = [
  {
    title: 'Introduction',
    subtitle:
      'Your privacy is important. This policy explains how I collect, use, and protect your information.',
    clauses: [
      {
        heading: 'Our Commitment',
        body: 'I, Siam Parvez ("I", "me", "my"), am committed to protecting your privacy and ensuring full transparency in how your data is handled. This Privacy Policy applies to all visitors and users of siamparvez.dev and its subdomains.',
      },
      {
        heading: 'Scope of Policy',
        body: 'This Privacy Policy covers all data collected through the website, including contact form data, and anonymous analytics data. This policy does not apply to third-party websites linked from this site.',
      },
      {
        heading: 'Policy Updates',
        body: 'This policy may be updated periodically to reflect changes in practices or legal requirements. The "Last Updated" date at the top indicates the most recent revision. Continued use of the site constitutes acceptance of any changes.',
      },
    ],
  },
  {
    title: 'Data We Collect',
    subtitle:
      'Transparency about exactly what information is collected and how.',
    clauses: [
      {
        heading: 'Contact Form Data',
        body: 'When you use the contact form, I receive your full name, email address, subject, and message. This data is used solely to respond to your inquiry and is never shared with third parties.',
      },
      {
        heading: 'No Sensitive Data',
        body: 'I do NOT collect passwords, payment information, precise location data, contacts, phone numbers, government IDs, health information, or any other sensitive personal data.',
        pills: [
          'No passwords',
          'No payment data',
          'No location',
          'No phone numbers',
          'No government IDs',
        ],
      },
      {
        heading: 'Automatic Data',
        body: 'Standard technical data may be logged by hosting infrastructure including: IP addresses (anonymized), browser type, device information, pages visited, and timestamps. This data is used only for security, debugging, and aggregate analytics.',
      },
    ],
  },
  {
    title: 'How Data Is Used',
    subtitle: 'Specific purposes for which collected data is processed.',
    clauses: [
      {
        heading: 'Communication',
        body: 'Your contact information is used only to respond to messages you initiate. I will not contact you unless you explicitly reach out first, or if required for critical security notifications.',
      },
      {
        heading: 'Analytics & Improvement',
        body: 'Anonymous, aggregated data helps me understand how visitors use the site, which pages are popular, and where improvements can be made. Individual users are not personally identifiable through analytics.',
      },
      {
        heading: 'No Data Sales',
        body: 'I do not sell, rent, lease, or otherwise transfer your personal data to any third party under any circumstances. Your data is yours.',
      },
    ],
  },
  {
    title: 'Analytics & Tracking',
    subtitle:
      'Tools used to understand website performance and usage patterns.',
    clauses: [
      {
        heading: 'Vercel Analytics',
        body: 'Vercel Analytics measures page performance metrics including load times, server response times, and Core Web Vitals. This data is fully aggregated and contains no personal identifiers. It helps optimize website speed and reliability.',
      },
      {
        heading: 'No Invasive Tracking',
        body: 'I do NOT use session recordings, heatmaps, keystroke logging, or any invasive tracking technologies. Your interactions on this site are not individually monitored or analyzed.',
      },
      {
        heading: 'Cookie Use',
        body: 'Cookies are used only for remembering theme preferences (dark/light mode) and basic analytics. No advertising or cross-site tracking cookies are used. You can block analytics cookies using browser extensions like uBlock Origin without affecting any core functionality.',
      },
    ],
  },
  {
    title: 'Third-Party Services',
    subtitle:
      'External services integrated into the website and their data practices.',
    clauses: [
      {
        heading: 'Vercel (Hosting)',
        body: "This website is hosted on Vercel. Vercel may log standard HTTP request data (IP, User-Agent) for security and operational purposes. See Vercel's Privacy Policy.",
        link: {
          label: 'vercel.com/legal/privacy-policy',
          href: 'https://vercel.com/legal/privacy-policy',
        },
      },
      {
        heading: 'External Links',
        body: 'This website links to third-party services (GitHub, LinkedIn, X/Twitter). Each service has its own privacy policy. I am not responsible for how third-party services handle your data once you leave this website.',
      },
    ],
  },
  {
    title: 'Your Rights & Control',
    subtitle:
      'Full control over your data. Here are your rights and how to exercise them.',
    clauses: [
      {
        heading: 'Data Access',
        body: 'You may request a copy of any personal data I hold about you. Contact me at anik.barua.dev@gmail.com and I will provide your data in a portable format within 30 days.',
      },
      {
        heading: 'Data Deletion',
        body: 'To request deletion of any data associated with you, contact me at anik.barua.dev@gmail.com. I will process your request within 30 days of receiving it.',
      },
      {
        heading: 'GDPR Compliance',
        body: 'For users in the European Economic Area: you have rights under GDPR including access, rectification, erasure, and portability. These rights can be exercised by contacting me directly at anik.barua.dev@gmail.com.',
      },
    ],
  },
  {
    title: 'Data Security',
    subtitle:
      'Measures taken to protect your information from unauthorized access.',
    clauses: [
      {
        heading: 'Encryption',
        body: 'All data transmitted between your browser and this website is encrypted using HTTPS/TLS. Any data at rest is stored with appropriate access controls.',
      },
      {
        heading: 'Security Limitations',
        body: 'While I implement reasonable security measures, no internet transmission is 100% secure. I cannot guarantee absolute security but will promptly notify affected users in the event of any data breach.',
      },
    ],
  },
  {
    title: 'Children & Age Requirements',
    subtitle:
      'Compliance with child protection and international privacy regulations.',
    clauses: [
      {
        heading: 'Age Requirement',
        body: 'This website is not directed at children under 13 years of age. By using this website, you confirm that you are at least 13 years old or have appropriate parental consent.',
      },
      {
        heading: 'Data Retention',
        body: 'Analytics data is aggregated and retained for up to 12 months. Contact form data is retained only as long as necessary to respond to your inquiry, unless you request earlier deletion.',
      },
      {
        heading: 'Contact for Privacy',
        body: 'For any privacy-related inquiries, requests, or complaints, contact: anik.barua.dev@gmail.com. I aim to respond to all privacy requests within 30 days.',
      },
    ],
  },
] as const;
