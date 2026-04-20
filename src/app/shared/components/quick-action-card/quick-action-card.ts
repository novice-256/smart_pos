import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
  import { QrGeneratorModalComponent } from '../qr-generator-modal/qr-generator-modal';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core/primitives/di';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './quick-action-card.html',
  styles: [`
    .card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 16px; border-radius: 12px; color: white; border: none; width: 100%;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;
    }
    .card:active { transform: scale(0.95); }
    .label { margin-top: 8px; font-weight: 500; font-size: 0.9rem; }
  `]
})
export class QuickActionCardComponent {
  @Input() labelKey: string = ''; 
  @Input() icon: string = 'help';
  @Input() color: string = '#2196F3';
  constructor(){
  }

}