import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  sendEmail(event: Event) {
    event.preventDefault(); // Prevent form default submission
    
    // Get Form Values
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const city = (document.getElementById('city') as HTMLInputElement).value;
    const course = (document.getElementById('course') as HTMLSelectElement).value;
    const message = (document.getElementById('message') as HTMLTextAreaElement).value;
    
    // Simple Email Validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Prepare Email Data
    const subject = encodeURIComponent(`New Contact Form Submission from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\nCourse: ${course}\nMessage: ${message}`
    );
    
    // Open Email Client
    window.location.href = `mailto:cloudsynccin@gmail.com?subject=${subject}&body=${body}`;
  }
}