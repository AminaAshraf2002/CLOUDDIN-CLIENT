import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-digital-marketing',
  standalone: true,
  imports: [CommonModule, MatTabsModule, HeaderComponent, FooterComponent],
  templateUrl: './digital-marketing.component.html',
  styleUrls: ['./digital-marketing.component.css']
})
export class DigitalMarketingComponent {
  // Course data
  course = {
    title: 'Seo',
    author: 'Sarah Johnson',
    duration: '4 days',
    description: 'Our comprehensive Digital Marketing Course is designed to empower students with the skills and knowledge needed to succeed in the ever-evolving digital landscape. Through hands-on training and real-world projects, students will learn the fundamentals of digital marketing, including search engine optimization (SEO), pay-per-click advertising (PPC), social media marketing, email marketing, and content marketing. Our expert instructors will guide students through the latest digital marketing tools and platforms, including Google Analytics, Facebook Ads, and HubSpot. By the end of the course, students will have a deep understanding of how to create and execute a successful digital marketing strategy, and will be equipped with the skills to drive real results for businesses and organizations.',
    features: [
      'Search Engine Optimization (SEO)',
      'Pay-Per-Click Advertising (PPC)',
      'Social Media Marketing',
      'Email Marketing Campaigns',
      'Content Marketing Strategies',
      'Analytics and Performance Tracking',
      'Digital Marketing Tools and Platforms'
    ],
    // Day-specific content
    days: [
      {
        title: 'Digital Marketing Fundamentals',
        description: 'Day 1 covers the essentials of digital marketing, introducing key concepts, platforms, and strategies. We\'ll explore the digital marketing ecosystem and learn how to develop a comprehensive marketing strategy aligned with business goals.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Introduction to digital marketing concepts',
          'Digital marketing channels overview',
          'Developing audience personas',
          'Creating a digital marketing strategy'
        ]
      },
      {
        title: 'Search Engine Marketing',
        description: 'Day 2 focuses on search engine optimization (SEO) and pay-per-click (PPC) advertising. We\'ll learn how to improve website visibility in search engines, conduct keyword research, and create effective search ad campaigns.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Search engine optimization fundamentals',
          'On-page and off-page SEO techniques',
          'Google Ads campaign structure',
          'Keyword research and competitive analysis'
        ]
      },
      {
        title: 'Social Media & Content Marketing',
        description: 'Day 3 covers social media marketing and content strategies. We\'ll explore platform-specific tactics, content creation principles, and learn how to build engaging campaigns that drive audience engagement and conversions.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Social media platform strategies',
          'Content marketing frameworks',
          'Creating engaging visual and written content',
          'Influencer marketing and partnerships'
        ]
      },
      {
        title: 'Analytics & Campaign Optimization',
        description: 'Day 4 focuses on measuring performance and optimizing campaigns. We\'ll learn how to use analytics tools, interpret key metrics, and make data-driven decisions to continuously improve marketing results.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Google Analytics implementation and reporting',
          'Key performance indicators (KPIs)',
          'A/B testing and optimization techniques',
          'Marketing automation and campaign scaling'
        ]
      }
    ]
  };

  // Selected day index
  selectedDay = 0;

  constructor(private router: Router) {}

  // Handle tab changes
  onTabChange(event: MatTabChangeEvent): void {
    this.selectedDay = event.index;
    console.log('Tab changed to Day:', event.index + 1);
  }

  // Navigate to register page when video is clicked
  navigateToRegister(): void {
    this.router.navigate(['register']);
    console.log('Navigating to registration page');
  }
}