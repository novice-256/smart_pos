import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySummaryCardComponent } from '../daily-summary-card/daily-summary-card';

@Component({
  selector: 'app-summary-section',
  standalone: true,
  imports: [CommonModule, DailySummaryCardComponent],
  templateUrl: './summary-section.html',
  styles: [`
    .summary-row {
      display: flex;
      gap: 12px;
      padding: 16px;
      /* Flex automatically respects dir="rtl" */
    }
    app-daily-summary-card { flex: 1; }
  `]
})
export class SummarySectionComponent {
  @Input() total: string = 'Rs. 0';
  @Input() todaySales: string = 'Rs. 0';
}