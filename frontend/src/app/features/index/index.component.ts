import { Component, AfterViewInit } from '@angular/core';
import {RouterLink} from '@angular/router';
import {FooterComponent} from '../../core/components/footer/footer.component';

declare const VANTA: any;

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './index.component.html',
  imports: [
    RouterLink,
    FooterComponent,
  ],
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      color: "#ffffff",
      backgroundColor: "#0770E3",
      texturePath: "./gallery/noise.png"
    })

    // INIT TYPING EFFECT
    const typewriterElement = document.getElementById('typewriter');
    const words = [
      "on your own",
      "with your team",
      "with your family",
      "with your friends",
      "with your colleagues"
    ];
    const typeSpeed = 25;    // SPEED TYPING IN ms
    const eraseSpeed = 25;   // SPEED ERASING IN ms
    const delayBetween = 1000; // TIME BETWEEN TYPING AND ERASING IN ms

    if (typewriterElement) {
      this.typeWriter(typewriterElement, words, typeSpeed, eraseSpeed, delayBetween);
    }
  }

  private typeWriter(element: HTMLElement, words: string[], typeSpeed: number, eraseSpeed: number, delayBetween: number): void {
    let wordIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (charIndex < words[wordIndex].length) {
        element.textContent += words[wordIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typeSpeed);
      } else {
        setTimeout(erase, delayBetween);
      }
    };

    const erase = () => {
      if (charIndex > 0) {
        element.textContent = words[wordIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, eraseSpeed);
      } else {
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, typeSpeed);
      }
    };

    type();
  }
}
