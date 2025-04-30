import { Component, OnInit, AfterViewInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Fix 1: Using declare module approach (add this line)
declare module 'aos';

// Fix 2: Change import style
import AOS from 'aos';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {
  private counted = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Initialize AOS
      AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 100,
        easing: 'ease-in-out'
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.startCounterOnScroll();
      this.initTypewriterEffect();
      this.initParallaxEffect();
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isBrowser) {
      this.startCounterOnScroll();
      AOS.refresh();
    }
  }

  startCounterOnScroll(): void {
    const counters = document.querySelectorAll('.counter');
    const section = document.querySelector('.stats-section');

    if (section) {
      const sectionTop = section.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;

      if (sectionTop < screenHeight * 0.8 && !this.counted) {
        counters.forEach(counter => {
          const target = Number(counter.getAttribute('data-target'));
          let count = 0;
          const duration = 2000; // ms
          const steps = 50;
          const increment = target / steps;
          const stepTime = duration / steps;

          const updateCounter = () => {
            if (count < target) {
              count += increment;
              counter.textContent = Math.ceil(count).toString();
              setTimeout(updateCounter, stepTime);
            } else {
              counter.textContent = target.toString();
              const counterElement = counter as HTMLElement;
              counterElement.classList.add('counted');
            }
          };

          updateCounter();
        });

        this.counted = true;
      }
    }
  }

  initTypewriterEffect(): void {
    const heroTitle = document.querySelector('.hero-overlay h1') as HTMLElement;
    if (heroTitle) {
      const text = heroTitle.innerText;
      heroTitle.innerHTML = '';
      heroTitle.style.visibility = 'visible';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroTitle.innerHTML += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          heroTitle.classList.add('typed');
        }
      };
      
      setTimeout(() => {
        typeWriter();
      }, 500);
    }
  }

  initParallaxEffect(): void {
    const parallaxBg = document.querySelector('.parallax-section') as HTMLElement;
    if (parallaxBg) {
      window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        parallaxBg.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      });
    }
  }
}