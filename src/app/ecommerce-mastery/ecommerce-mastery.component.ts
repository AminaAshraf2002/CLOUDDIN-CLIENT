import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecommerce-mastery',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './ecommerce-mastery.component.html',
  styleUrls: ['./ecommerce-mastery.component.css'],
})
export class EcommerceMasteryComponent {
  // Course data
  course = {
    title: 'ECOMMERCE MASTERY',
    author: 'David Martinez & Emma Wilson',
    duration: '4 days',
    description: 'Ecommerce Mastery is an exceptional choice for entrepreneurs seeking to establish a thriving ecommerce store or online business. Our comprehensive program covers a wide range of topics, including dropshipping, brand building, affiliate marketing, web development, reselling, and social media marketing. By joining Ecommerce Mastery, you\'ll learn how to start a successful dropshipping business, develop a strong brand identity, promote products through affiliate marketing, build a professional ecommerce website, resell products online, and leverage social media platforms to drive sales, gaining the knowledge and skills necessary to succeed in the competitive ecommerce landscape.',
    features: [
      'Dropshipping business model and implementation',
      'Brand building strategies for online businesses',
      'Affiliate marketing and passive income streams',
      'Ecommerce website development and optimization',
      'Product sourcing and inventory management',
      'Social media marketing for ecommerce success',
      'Analytics and data-driven decision making'
    ],
    // Day-specific content
    days: [
      {
        title: 'Ecommerce Foundations & Business Models',
        description: 'Day 1 introduces the fundamentals of ecommerce and explores various business models including dropshipping, private labeling, and marketplace selling. We\'ll analyze successful online stores and identify key components for ecommerce success.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Introduction to ecommerce ecosystems',
          'Business model selection and evaluation',
          'Market research and opportunity identification',
          'Legal requirements and business setup'
        ]
      },
      {
        title: 'Product Sourcing & Store Setup',
        description: 'Day 2 focuses on finding profitable products and setting up your online store. We\'ll explore supplier relationships, inventory management, and platform selection while configuring essential store elements and payment systems.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Product sourcing strategies and supplier relationships',
          'Platform selection (Shopify, WooCommerce, etc.)',
          'Store setup and configuration',
          'Payment gateways and shipping solutions'
        ]
      },
      {
        title: 'Brand Development & Marketing',
        description: 'Day 3 covers creating a compelling brand identity and implementing effective marketing strategies. We\'ll develop content plans, social media strategies, and learn how to create consistent brand messaging across all customer touchpoints.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Brand identity development',
          'Content marketing for ecommerce',
          'Social media strategy and implementation',
          'Email marketing and customer retention'
        ]
      },
      {
        title: 'Scaling & Optimization',
        description: 'Day 4 focuses on scaling your ecommerce business and optimizing operations. We\'ll analyze data to make informed decisions, implement automation tools, and develop strategies for sustainable growth and increased profitability.',
        videoThumbnail: 'https://img.youtube.com/vi/e_dv7GBHka8/maxresdefault.jpg',
        topics: [
          'Analytics and performance tracking',
          'Conversion rate optimization',
          'Automation and operational efficiency',
          'Growth strategies and scaling tactics'
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