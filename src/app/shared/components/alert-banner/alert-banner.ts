import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './alert-banner.html',
  styles: [`
    .alert-box {
      margin: 16px;
      padding: 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }
    .warning { background-color: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }
    .error { background-color: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
  `]
})
export class AlertBannerComponent {
  @Input() type: 'warning' | 'error' = 'warning';
  @Input() messageKey: string = ''; 
}