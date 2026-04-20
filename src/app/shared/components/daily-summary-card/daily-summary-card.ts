import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-daily-summary-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './daily-summary-card.html',
  styles: [`
    .summary-card {
      background: white;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      border: 1px solid #eee;
    }
    .label { font-size: 12px; color: #666; margin-bottom: 4px; display: block; }
    .value { font-size: 18px; font-weight: bold; color: #1b5e20; }
  `]
})
export class DailySummaryCardComponent {
  @Input() labelKey: string = '';
  @Input() value: string | number = 0;
}