import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-course',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './user-course.component.html',
  styleUrls: ['./user-course.component.css']
})
export class UserCourseComponent implements OnInit {
  userName: string = 'Neha';

  // Course data
  course = {
    title: 'SEO',
    author: 'Sarah Johnson',
    duration: '4 weeks',
    description: 'Our comprehensive Digital Marketing Course is designed to empower students with the skills and knowledge needed to succeed in the ever-evolving digital landscape. Through hands-on training and real-world projects, students will learn the fundamentals of digital marketing, including search engine optimization (SEO), pay-per-click advertising (PPC), social media marketing, email marketing, and content marketing.',
    features: [
      'Search Engine Optimization (SEO)',
      'Pay-Per-Click Advertising (PPC)',
      'Social Media Marketing',
      'Email Marketing Campaigns',
      'Content Marketing Strategies'
    ],
    // Day-specific content
    days: [
      {
        title: 'Digital Marketing Fundamentals',
        description: 'Day 1 covers the essentials of digital marketing, introducing key concepts, platforms, and strategies. We\'ll explore the digital marketing ecosystem and learn how to develop a comprehensive marketing strategy aligned with business goals.',
        videoLink: 'https://www.youtube.com/embed/xds0Gcof22w?si=YArEqfJjrvdYiwIU', // Replace with actual embed link
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
        videoLink: 'https://www.youtube.com/embed/0J8JaN76Mrs?si=wBef732WDyRMVMrc', // Replace with actual embed link
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
        videoLink: 'https://www.youtube.com/embed/kunkYTKFNtI?si=Yv1qRAtuGpzqUKED', // Replace with actual embed link
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
        videoLink: 'https://www.youtube.com/embed/sbOuzNm31Y8?si=FjrGvlXsWrfFWEue', // Replace with actual embed link
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

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Any initialization logic
  }

  // Handle tab changes
  onTabChange(event: MatTabChangeEvent): void {
    this.selectedDay = event.index;
    console.log('Tab changed to Day:', event.index + 1);
  }

  // Get safe video URL
  getSafeVideoUrl(videoLink: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }
}