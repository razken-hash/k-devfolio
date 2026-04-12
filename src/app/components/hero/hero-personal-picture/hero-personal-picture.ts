import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-personal-picture',
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero-personal-picture.html',
  styles: `
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }
  
          .animate-badge {
            animation: float 3s ease-in-out infinite;
          }
    `,
  host: {
    class: 'block h-full'
  }
})
export class HeroPersonalPicture {

}
