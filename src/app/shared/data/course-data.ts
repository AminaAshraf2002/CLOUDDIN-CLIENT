import { Course } from '../models';

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'Ecommerce Mastery',
    lessons: 4,
    thumbnail: 'assets/images/newimg.jpg',
    description: 'A comprehensive course covering all essential aspects of ecommerce, from dropshipping to brand building and web development.',
    instructor: 'Ecommerce Expert',
    duration: '4 weeks',
    level: 'intermediate',
    progress: 0,
    subcategories: [
      {
        id: 101,
        title: 'Dropshipping',
        description: 'Learn how to start and scale a dropshipping business with minimal investment',
        thumbnail: 'data:image/png;base64,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', // Add this line
        lessons: [
          {
            id: 10101,
            day: 1,
            title: 'Introduction to Dropshipping',
            videoUrl: 'https://www.youtube.com/embed/123456',
            description: "Day 1 covers the fundamentals of dropshipping business models, how they work, and why they're popular. You'll learn about the advantages and challenges of this business model.",
            topics: [
              'What is dropshipping and how it works',
              'Benefits and limitations of dropshipping',
              'Key players in the dropshipping ecosystem',
              'Requirements to get started'
            ], 
             duration: '45 minutes'
          },
          {
            id: 10102,
            day: 2,
            title: 'Finding Profitable Products',
            videoUrl: 'https://www.youtube.com/embed/234567',
            description: "On Day 2, you'll learn how to research and identify profitable products for your dropshipping store. We'll cover various research tools and strategies.",
            topics: [
              'Product research methodologies',
              'Using research tools effectively',
              'Evaluating product profitability',
              'Avoiding common product selection mistakes'
            ],
            duration: '45 minutes'
          },
          {
            id: 10103,
            day: 3,
            title: 'Setting Up Your Store',
            videoUrl: 'https://www.youtube.com/embed/345678',
            description: "Day 3 focuses on creating your online store using platforms like Shopify. You'll learn how to set up your store, add products, and configure payment methods.",
            topics: [
              'Choosing the right platform',
              'Store setup step-by-step',
              'Product listing optimization',
              'Payment gateway integration'
            ],
            duration: '45 minutes'
          },
          {
            id: 10104,
            day: 4,
            title: 'Marketing Your Dropshipping Store',
            videoUrl: 'https://www.youtube.com/embed/456789',
            description: "The final day covers essential marketing strategies to drive traffic and sales to your dropshipping store. We'll focus on ads, social media, and customer service.",
            topics: [
              'Facebook and Instagram advertising',
              'Influencer marketing strategies',
              'Customer service best practices',
              'Scaling your dropshipping business'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 102,
        title: 'Brand Building',
        description: 'Create a powerful brand identity for your ecommerce business',
        thumbnail: 'https://media.licdn.com/dms/image/v2/D4D12AQGcaqkd6HzBbw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1661492293289?e=2147483647&v=beta&t=OVEhBFCjBq4RON0ORBc_b4WGFNGoXUmKOqVg6ykkod8', // Add this line

        lessons: [
          {
            id: 10201,
            day: 1,
            title: 'Brand Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/branding1',
            description: "Day 1 introduces the key concepts of branding and why it matters for ecommerce businesses. You'll learn about brand elements and positioning.",
            topics: [
              'What is a brand and why it matters',
              'Brand elements and identity',
              'Brand positioning and differentiation',
              'Brand strategy fundamentals'
            ],
            duration: '45 minutes'
          },
          {
            id: 10202,
            day: 2,
            title: 'Brand Story & Messaging',
            videoUrl: 'https://www.youtube.com/embed/branding2',
            description:" On Day 2, you'll learn how to craft a compelling brand story and develop messaging that resonates with your target audience",
            topics: [
              'Crafting your brand story',
              'Developing brand voice and tone',
              'Creating compelling brand messaging',
              'Brand consistency across touchpoints'
            ],
            duration: '45 minutes'
          },
          {
            id: 10203,
            day: 3,
            title: 'Visual Brand Identity',
            videoUrl: 'https://www.youtube.com/embed/branding3',
            description: 'Day 3 focuses on creating visual elements of your brand including logo, colors, typography and other design elements.',
            topics: [
              'Logo design considerations',
              'Color psychology for brands',
              'Typography selection',
              'Visual consistency across platforms'
            ],
            duration: '45 minutes'
          },
          {
            id: 10204,
            day: 4,
            title: 'Building Brand Loyalty',
            videoUrl: 'https://www.youtube.com/embed/branding4',
            description: 'The final day covers strategies for building brand loyalty and turning customers into brand advocates for your ecommerce business.',
            topics: [
              'Customer experience and brand perception',
              'Building community around your brand',
              'Loyalty programs and strategies',
              'Measuring brand equity and value'
            ],
            duration: '45 minutes'

          }
        ]
      },
      {
        id: 103,
        title: 'Affiliate Marketing',
        description: 'Master affiliate marketing strategies to generate passive income',
        thumbnail: 'https://www.newbreedrevenue.com/hubfs/1200X628%20blog-2.png', // Add this line
        lessons: [
          {
            id: 10301,
            day: 1,
            title: 'Affiliate Marketing Basics',
            videoUrl: 'https://www.youtube.com/embed/affiliate1',
            description: 'Day 1 introduces the fundamentals of affiliate marketing, how it works, and the potential benefits for ecommerce businesses.',
            topics: [
              'What is affiliate marketing',
              'How affiliate programs work',
              'Commission structures and payments',
              'Key players in the affiliate ecosystem'
            ],
            duration: '45 minutes'
          },
          {
            id: 10302,
            day: 2,
            title: 'Finding and Joining Programs',
            videoUrl: 'https://www.youtube.com/embed/affiliate2',
            description: "On Day 2, you'll learn how to research and join the right affiliate programs for your niche and audience.",
            topics: [
              'Researching affiliate programs',
              'Evaluating program quality and fit',
              'Application process and requirements',
              'Managing multiple affiliate relationships'
            ],
            duration: '45 minutes'
          },
          {
            id: 10303,
            day: 3,
            title: 'Promotion Strategies',
            videoUrl: 'https://www.youtube.com/embed/affiliate3',
            description: 'Day 3 focuses on effective strategies to promote affiliate products through various channels.',
            topics: [
              'Content marketing for affiliates',
              'Email marketing strategies',
              'Social media promotion tactics',
              'SEO for affiliate marketing'
            ],
            duration: '45 minutes'
          },
          {
            id: 10304,
            day: 4,
            title: 'Scaling Your Affiliate Business',
            videoUrl: 'https://www.youtube.com/embed/affiliate4',
            description: 'The final day covers advanced techniques to scale your affiliate marketing efforts and maximize your income.',
            topics: [
              'Data analysis and optimization',
              'A/B testing affiliate promotions',
              'Automation tools and strategies',
              'Building a sustainable affiliate business'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 104,
        title: 'Web Development',
        description: 'Learn to build and customize ecommerce websites',
        thumbnail: 'https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp', // Add this line
        lessons: [
          {
            id: 10401,
            day: 1,
            title: 'Ecommerce Website Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/webdev1',
            description: 'Day 1 introduces the key elements of successful ecommerce websites and different platform options.',
            topics: [
              'Ecommerce platform comparison',
              'Key elements of ecommerce sites',
              'Domain and hosting considerations',
              'Planning your site architecture'
            ],
            duration: '45 minutes'
          },
          {
            id: 10402,
            day: 2,
            title: 'Building Your Store',
            videoUrl: 'https://www.youtube.com/embed/webdev2',
            description:" On Day 2, you'll learn the step-by-step process of setting up your ecommerce store using popular platforms.",
            topics: [
              'Setting up your store',
              'Theme selection and customization',
              'Product page optimization',
              'Payment and shipping setup'
            ],
            duration: '45 minutes'
          },
          {
            id: 10403,
            day: 3,
            title: 'Customization and Extensions',
            videoUrl: 'https://www.youtube.com/embed/webdev3',
            description: 'Day 3 focuses on customizing your store with apps, plugins, and basic code modifications.',
            topics: [
              'Essential ecommerce apps and plugins',
              'Basic CSS customization',
              'Improving site performance',
              'Mobile optimization techniques'
            ],
            duration: '45 minutes'
          },
          {
            id: 10404,
            day: 4,
            title: 'Optimizing for Conversions',
            videoUrl: 'https://www.youtube.com/embed/webdev4',
            description: 'The final day covers conversion rate optimization techniques to maximize your ecommerce sales.',
            topics: [
              'Checkout optimization',
              'Product page best practices',
              'A/B testing for conversions',
              'Analytics setup and monitoring'
            ],
            duration: '45 minutes'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Digital Marketing',
    lessons: 4,
    thumbnail: 'https://courses.iid.org.in/public//uploads/media_manager/628.jpg',
    description: 'A comprehensive course covering all essential aspects of ecommerce, from dropshipping to brand building and web development.',
    instructor: 'Digital Marketing Expert',
    duration: '4 weeks',
    level: 'intermediate',
    progress: 0,
    subcategories: [
      {
        id: 201,
        title: 'Search Engine Optimization (SEO)',
        description: 'Master SEO techniques to improve website visibility in search engines',
        thumbnail: 'https://addskillacademy.in/wp-content/uploads/2022/10/seo-courses.jpg',
        lessons: [
          {
            id: 20101,
            day: 1,
            title: 'SEO Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/abcdef',
            description: "Day 1 introduces the core concepts of SEO, how search engines work, and what factors influence rankings. You'll build a solid foundation for the rest of the course.",
            topics: [
              'How search engines work',
              'On-page vs off-page SEO',
              'Key ranking factors',
              'SEO performance metrics'
            ],
            duration: '45 minutes'
          },
          {
            id: 20102,
            day: 2,
            title: 'Keyword Research & On-Page SEO',
            videoUrl: 'https://www.youtube.com/embed/bcdefg',
            description: "On Day 2, you'll learn how to find valuable keywords and implement them effectively on your website. We'll cover tools and techniques for keyword optimization.",
            topics: [
              'Keyword research tools and methodology',
              'Search intent analysis',
              'On-page optimization techniques',
              'Content optimization for SEO'
            ],
            duration: '45 minutes'
          },
          {
            id: 20103,
            day: 3,
            title: 'Technical SEO',
            videoUrl: 'https://www.youtube.com/embed/cdefgh',
            description: 'Day 3 focuses on the technical aspects of SEO, including site structure, speed optimization, mobile-friendliness, and structured data.',
            topics: [
              'Site architecture optimization',
              'Website speed improvement',
              'Mobile optimization',
              'Schema markup and structured data'
            ],
            duration: '45 minutes'
          },
          {
            id: 20104,
            day: 4,
            title: 'Link Building & SEO Strategy',
            videoUrl: 'https://www.youtube.com/embed/defghi',
            description:" The final day covers link building strategies and how to develop a comprehensive SEO plan. We'll also discuss tracking results and ongoing optimization.",
            topics: [
              'Link building techniques',
              'Guest posting and outreach',
              'SEO strategy development',
              'Performance tracking and reporting'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 202,
        title: 'Pay-Per-Click Advertising (PPC)',
        description: 'Learn to create and optimize effective PPC campaigns',
        thumbnail: 'https://media.licdn.com/dms/image/v2/D4D12AQFQZwZqj5sLkQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1677091068325?e=2147483647&v=beta&t=RvwpJJ6q5aVUIwplAEliD0MsydtPBNpLHdA_z4v0O8g',
        lessons: [
          {
            id: 20201,
            day: 1,
            title: 'PPC Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/ppc1',
            description: 'Day 1 introduces the basics of pay-per-click advertising, how it works, and the major platforms available.',
            topics: [
              'How PPC advertising works',
              'Major PPC platforms overview',
              'Campaign structure fundamentals',
              'Budgeting and bidding basics'
            ],
            duration: '45 minutes'
          },
          {
            id: 20202,
            day: 2,
            title: 'Google Ads Campaign Creation',
            videoUrl: 'https://www.youtube.com/embed/ppc2',
            description:" On Day 2, you'll learn how to set up effective Google Ads campaigns, including search, display, and shopping ads.",
            topics: [
              'Google Ads account structure',
              'Search campaign setup',
              'Display network strategies',
              'Shopping ads configuration'
            ],
            duration: '45 minutes'
          },
          {
            id: 20203,
            day: 3,
            title: 'Ad Creation and Optimization',
            videoUrl: 'https://www.youtube.com/embed/ppc3',
            description: 'Day 3 focuses on creating compelling ad copy, designing effective landing pages, and optimizing campaigns.',
            topics: [
              'Writing high-converting ad copy',
              'A/B testing ad variations',
              'Landing page optimization',
              'Quality score improvement'
            ],
            duration: '45 minutes'
          },
          {
            id: 20204,
            day: 4,
            title: 'Advanced PPC Strategies',
            videoUrl: 'https://www.youtube.com/embed/ppc4',
            description: 'The final day covers advanced techniques, automation, and strategies to scale your PPC campaigns.',
            topics: [
              'Audience targeting and remarketing',
              'Conversion tracking and attribution',
              'Automated bidding strategies',
              'PPC analytics and reporting'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 203,
        title: 'Social Media Marketing',
        description: 'Develop strategies for effective marketing across social platforms',
        thumbnail: 'https://www.netleafinfosoft.com/our-blog/wp-content/uploads/2020/11/Social-Media-Marketing.jpg',
        lessons: [
          {
            id: 20301,
            day: 1,
            title: 'Social Media Strategy Development',
            videoUrl: 'https://www.youtube.com/embed/smm1',
            description: 'Day 1 introduces the fundamentals of social media marketing and how to develop an effective strategy.',
            topics: [
              'Platform selection and audience analysis',
              'Setting SMART social media goals',
              'Content strategy development',
              'Resource allocation and planning'
            ],
            duration: '45 minutes'
          },
          {
            id: 20302,
            day: 2,
            title: 'Content Creation for Social Media',
            videoUrl: 'https://www.youtube.com/embed/smm2',
            description:" On Day 2, you'll learn how to create engaging content tailored to different social media platforms.",
            topics: [
              'Platform-specific content best practices',
              'Visual content creation tools and techniques',
              'Copywriting for social media',
              'Content calendar management'
            ],
            duration: '45 minutes'
          },
          {
            id: 20303,
            day: 3,
            title: 'Community Building and Engagement',
            videoUrl: 'https://www.youtube.com/embed/smm3',
            description: 'Day 3 focuses on building an engaged community and managing social media presence effectively.',
            topics: [
              'Community management tactics',
              'Engagement strategies and best practices',
              'Managing comments and messages',
              'Crisis management on social media'
            ],
            duration: '45 minutes'
          },
          {
            id: 20304,
            day: 4,
            title: 'Social Media Advertising',
            videoUrl: 'https://www.youtube.com/embed/smm4',
            description: 'The final day covers paid social media advertising strategies across different platforms.',
            topics: [
              'Ad formats across platforms',
              'Targeting and audience options',
              'Budget management and optimization',
              'Measuring social media ROI'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 204,
        title: 'Email Marketing',
        description: 'Build email campaigns that convert and drive customer loyalty',
        thumbnail: 'https://optinmonster.com/wp-content/uploads/2016/06/emailmarketingguide.png',
        lessons: [
          {
            id: 20401,
            day: 1,
            title: 'Email Marketing Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/email1',
            description: 'Day 1 introduces the basics of email marketing, its benefits, and how to build a quality email list.',
            topics: [
              'Email marketing benefits and metrics',
              'Building your email list ethically',
              'Email service provider selection',
              'Compliance and best practices (GDPR, CAN-SPAM)'
            ],
            duration: '45 minutes'
          },
          {
            id: 20402,
            day: 2,
            title: 'Email Content and Design',
            videoUrl: 'https://www.youtube.com/embed/email2',
            description: "On Day 2, you'll learn how to create compelling email content and effective design that drives engagement.",
            topics: [
              'Email copywriting techniques',
              'Design best practices for email',
              'Subject line optimization',
              'Call-to-action strategies'
            ],
            duration: '45 minutes'
          },
          {
            id: 20403,
            day: 3,
            title: 'Email Automation and Flows',
            videoUrl: 'https://www.youtube.com/embed/email3',
            description: 'Day 3 focuses on setting up automated email sequences to nurture leads and drive conversions.',
            topics: [
              'Welcome sequence creation',
              'Abandoned cart recovery emails',
              'Post-purchase follow-ups',
              'Re-engagement campaigns'
            ],
            duration: '45 minutes'
          },
          {
            id: 20404,
            day: 4,
            title: 'Email Analytics and Optimization',
            videoUrl: 'https://www.youtube.com/embed/email4',
            description: 'The final day covers analyzing email performance and optimizing for better results.',
            topics: [
              'Key email marketing metrics',
              'A/B testing for emails',
              'List segmentation strategies',
              'Deliverability optimization'
            ],
            duration: '45 minutes'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Graphic Design',
    lessons: 4,
    thumbnail: 'https://i1.wp.com/www.zekagraphic.com/wp-content/uploads/2023/06/The-Logo-Design-Process-Tips-for-Efficiency-Success.jpg?fit=1920%2C1080&ssl=1',
    description: 'A comprehensive course covering all essential aspects of ecommerce, from dropshipping to brand building and web development.',
    instructor: 'Graphic Design Expert',
    duration: '4 weeks',
    level: 'intermediate',
    progress: 0,
    subcategories: [
      {
        id: 301,
        title: 'Logo Design',
        description: 'Create professional and memorable logo designs for brands',
        thumbnail: 'https://i1.wp.com/www.zekagraphic.com/wp-content/uploads/2023/06/The-Logo-Design-Process-Tips-for-Efficiency-Success.jpg?fit=1920%2C1080&ssl=1', // Add this line
        lessons: [
          {
            id: 30101,
            day: 1,
            title: 'Logo Design Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/ghijkl',
            description: "Day 1 introduces the principles of effective logo design and the various types of logos. You'll learn about the characteristics that make logos memorable.",
            topics: [
              'Logo design principles',
              'Types of logos (wordmarks, symbols, etc.)',
              'Color psychology in logo design',
              'Typography basics for logos'
            ],
            duration: '45 minutes'
          },
          {
            id: 30102,
            day: 2,
            title: 'Logo Design Process',
            videoUrl: 'https://www.youtube.com/embed/hijklm',
            description: "On Day 2, you'll learn a step-by-step process for creating professional logos, from research and sketching to digital implementation.",
            topics: [
              'Client research and brief development',
              'Sketching and ideation techniques',
              'From sketch to digital',
              'Software tools for logo design'
            ],
            duration: '45 minutes'
          },
          {
            id: 30103,
            day: 3,
            title: 'Logo Variations & Applications',
            videoUrl: 'https://www.youtube.com/embed/ijklmn',
            description: 'Day 3 covers creating logo variations for different applications and how to prepare logo files for clients.',
            topics: [
              'Creating logo variations (horizontal, vertical, etc.)',
              'Logo sizing for different applications',
              'Color versions (full color, black, white)',
              'File formats and deliverables'
            ],
            duration: '45 minutes'
          },
          {
            id: 30104,
            day: 4,
            title: 'Building a Brand Identity',
            videoUrl: 'https://www.youtube.com/embed/jklmno',
            description: 'The final day expands from logo to complete brand identity, including supporting elements and brand guidelines.',
            topics: [
              'Expanding from logo to brand identity',
              'Creating brand guidelines',
              'Supporting brand elements',
              'Case studies of successful brand identities'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 302,
        title: 'Brochure Design',
        description: 'Design effective marketing brochures that convert',
        thumbnail: 'https://www.aabhishek.com/wp-content/uploads/2015/04/Brochure-Design-Services.jpg',
        lessons: [
          {
            id: 30201,
            day: 1,
            title: 'Brochure Design Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/brochure1',
            description: 'Day 1 introduces the basics of effective brochure design, including layout principles and types of brochures.',
            topics: [
              'Types of brochures and their purposes',
              'Layout and composition principles',
              'Understanding your audience',
              'Setting design objectives'
            ],
            duration: '45 minutes'
          },
          {
            id: 30202,
            day: 2,
            title: 'Content Organization and Typography',
            videoUrl: 'https://www.youtube.com/embed/brochure2',
            description: 'Day 2 focuses on organizing content effectively and choosing the right typography for your brochure.',
            topics: [
              'Information hierarchy and flow',
              'Typography selection for readability',
              'Copywriting tips for brochures',
              'Creating compelling headlines'
            ],
            duration: '45 minutes'
          },
          {
            id: 30203,
            day: 3,
            title: 'Visual Elements and Graphics',
            videoUrl: 'https://www.youtube.com/embed/brochure3',
            description: 'Day 3 covers incorporating images, graphics, and other visual elements into your brochure design.',
            topics: [
              'Image selection and manipulation',
              'Creating custom graphics',
              'Color schemes and psychology',
              'Using white space effectively'
            ],
            duration: '45 minutes'
          },
          {
            id: 30204,
            day: 4,
            title: 'Printing and Digital Brochures',
            videoUrl: 'https://www.youtube.com/embed/brochure4',
            description: 'The final day covers preparing your brochure for both print and digital distribution.',
            topics: [
              'Print specifications and requirements',
              'Paper selection and finishing options',
              'Interactive PDF brochures',
              'Digital distribution strategies'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 303,
        title: 'Business Card Design',
        description: 'Create professional business cards that leave a lasting impression',
        thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20240227164613/GRAPHIC-DESIGN-BANNER-copy.webp',
        lessons: [
          {
            id: 30301,
            day: 1,
            title: 'Business Card Essentials',
            videoUrl: 'https://www.youtube.com/embed/bizcard1',
            description: 'Day 1 introduces the fundamentals of business card design and their role in branding.',
            topics: [
              'Business card purpose and standards',
              'Size and format considerations',
              'Essential information to include',
              'Design principles for small formats'
            ],
            duration: '45 minutes'
          },
          {
            id: 30302,
            day: 2,
            title: 'Creative Business Card Concepts',
            videoUrl: 'https://www.youtube.com/embed/bizcard2',
            description: 'Day 2 explores creative concepts and innovative approaches to business card design.',
            topics: [
              'Unique shapes and die cuts',
              'Special materials and finishes',
              'Interactive and functional cards',
              'Memorable design approaches'
            ],
            duration: '45 minutes'
          },
          {
            id: 30303,
            day: 3,
            title: 'Design Tools and Techniques',
            videoUrl: 'https://www.youtube.com/embed/bizcard3',
            description: 'Day 3 focuses on using design software to create professional business cards.',
            topics: [
              'Setting up files in design software',
              'Creating front and back designs',
              'Using grids and guides effectively',
              'Typography best practices'
            ],
            duration: '45 minutes'
          },
          {
            id: 30304,
            day: 4,
            title: 'Printing and Production',
            videoUrl: 'https://www.youtube.com/embed/bizcard4',
            description: 'The final day covers the printing and production process for business cards.',
            topics: [
              'File preparation for printing',
              'Paper stocks and specialty materials',
              'Print techniques and finishes',
              'Working with print vendors'
            ],
            duration: '45 minutes'
          }
        ]
      },
      {
        id: 304,
        title: 'Website Graphics',
        description: 'Design engaging graphics for websites and digital platforms',
        thumbnail: 'https://5.imimg.com/data5/XZ/OM/CK/SELLER-52248764/graphic-design-services.png',
        lessons: [
          {
            id: 30401,
            day: 1,
            title: 'Web Graphics Fundamentals',
            videoUrl: 'https://www.youtube.com/embed/webgraphics1',
            description: 'Day 1 introduces the basics of graphics for websites and digital platforms.',
            topics: [
              'Types of web graphics and their purposes',
              'Web-specific design considerations',
              'File formats for the web',
              'Screen resolution and sizing'
            ],
            duration: '45 minutes'
          },
          {
            id: 30402,
            day: 2,
            title: 'UI Elements and Icons',
            videoUrl: 'https://www.youtube.com/embed/webgraphics2',
            description: 'Day 2 focuses on creating user interface elements and icon sets for websites.',
            topics: [
              'Buttons and call-to-action design',
              'Icon design principles',
              'Creating consistent UI elements',
              'Responsive design considerations'
            ],
            duration: '45 minutes'
          },
          {
            id: 30403,
            day: 3,
            title: 'Banners and Hero Images',
            videoUrl: 'https://www.youtube.com/embed/webgraphics3',
            description: 'Day 3 covers creating impactful banners and hero images for websites.',
            topics: [
              'Hero image design best practices',
              'Banner ads and promotions',
              'Typography for headers and banners',
              'Animation and interactive elements'
            ],
            duration: '45 minutes'
          },
          {
            id: 30404,
            day: 4,
            title: 'Graphics for Social Media and Blogs',
            videoUrl: 'https://www.youtube.com/embed/webgraphics4',
            description: 'The final day covers graphics for social media posts and blog content.',
            topics: [
              'Social media platform specifications',
              'Blog featured images and thumbnails',
              'Creating templates for consistent branding',
              'Tools for batch creation of graphics'
            ],
            duration: '45 minutes'
          }
        ]
      }
    ]
  }
];