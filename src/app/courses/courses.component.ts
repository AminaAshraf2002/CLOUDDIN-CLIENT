import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Course {
  title: string;
  modules: number;
  duration: string;
  image: string;
  badge?: 'Recommended' | 'New' | 'Trending' | 'Popular';
  description?: string; // Add this field
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courseFilters: string[] = ['All Courses', 'Web Development', 'Most Placed'];

  courses: Course[] = [
    {
      title: 'Python Django',
      modules: 9,
      duration: '6 Months',
      image: 'https://studyapp-prod-s3.s3.amazonaws.com/course_image/django-course-thumbnail.jpg',
      badge: 'Recommended',
      description: "Core Python, Basics of Programming, Unix Commands, Advanced Python, Django Framework, REST API, Git, ReactJs, Web Concepts & Tools."
    },
    {
      title: 'ME(A)RN Stack Web Development Expert',
      modules: 6,
      duration: '6 Months',
      image: 'https://jaro-website.s3.ap-south-1.amazonaws.com/2024/03/Features-of-Mern-stack-development-services-You-Should-Know-768x397-1.png',
      badge: 'Recommended',
      description:'HTML, CSS, Bootstrap, Javascript, Typescript, Git, Angular, React.js, Node.js, Express.js & MongoDB.'
    },
    {
      title: 'Asp.Net',
      modules: 6,
      duration: '5 Months',
      image: 'https://studyapp-prod-s3.s3.amazonaws.com/course_image/asp.net.jpg',
      badge: 'Recommended',
      description:"Introduction, Git installation, Repository creation in GitHub, Commands in git, Real time code integration."
    },
    {
      title: 'WordPress',
      modules: 9,
      duration: '4 Months',
      image: 'https://wpengine.com/wp-content/uploads/2021/11/wordpress-guide-header-1024x465.png',
      badge: 'New',
      description:"In these courses, youll learn how to install WordPress and configure it for SEO, design a WordPress theme, create an ecommerce website, and publish your images and posts with the open-source WordPress content management system."
    },
    {
      title: 'Dropshipping',
      modules: 5,
      duration: '2 Months',
      image: "data:image/png;base64,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",
      badge: 'Trending',
      description:"Dropshipping is a retail method where an online store forwards customer orders to a supplier, who then ships the product to the customer. The online store doesn't keep the products in stock"
    },
    {
      title: 'Brand Building',
      modules: 5,
      duration: '3 Months',
      image: 'https://webkeyz.com/wp-content/uploads/2023/11/Brand-Identity-More-than-Logo_webkeyz-scaled.jpeg',
      badge: 'Trending',
      description:"Brand building is the process of marketing a brand to increase awareness, promote products, and establish connections with an audience. The goal is to build brand recognition and loyalty."
    },
    {
      title: 'Affiliate Marketing',
      modules: 7,
      duration: '3 Months',
      image: 'https://d1u4v6449fgzem.cloudfront.net/wp-content/uploads/2020/11/17010121/11-Best-Affiliate-Programs-for-Beginners-to-Make-Money-Empire-Flippers-scaled.jpg',
      badge: 'Trending',
      description:'Affiliate marketing is a way to earn money by promoting a company s products or services online. The company pays the affiliate a commission for each sale or conversion'
    },
    {
      title: 'Reselling',
      modules: 4,
      duration: '1 Month',
      image: 'https://www.bluehost.in/blog/wp-content/smush-webp/2023/10/how-to-become-a-reseller-1024x576.png.webp',
      badge: 'New',
      description:'Reselling is the act of buying goods or services with the intention of selling them again for profit. Resellers can be individuals or businesses.'
    },
    {
      title: 'Social Media Marketing',
      modules: 6,
      duration: '3 Months',
      image: 'https://clictadigital.com/wp-content/uploads/2023/11/best-social-media-platforms.png',
      badge: 'Popular',
      description:'Social media marketing is the use of social media platforms and websites to promote a product or service. Although the terms e-marketing and digital marketing are still dominant in academia, social media marketing is becoming more popular for both practitioners and researchers.'
    }
  ];

  getBadgeColor(badge: string): string {
    switch (badge) {
      case 'Recommended':
        return '#28a745'; // Green
      case 'New':
        return '#ff4d4d'; // Red
      case 'Trending':
        return '#007bff'; // Blue
      case 'Popular':
        return '#ffa500'; // Orange
      default:
        return '#808080'; // Grey for unknown
    }
  }
}
