// status-bar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  template: `
    <div class="status-bar" [ngClass]="isOnline ? 'online' : 'offline'">
      <div class="item">
        <mat-icon>{{ isOnline ? 'wifi' : 'wifi_off' }}</mat-icon>
        <span>{{ (isOnline ? 'STATUS.ONLINE' : 'STATUS.OFFLINE') | translate }}</span>
      </div>
      <div class="spacer"></div>
      <div class="item">
        <span>{{ 'STATUS.LAST_SYNC' | translate }}: {{ lastSync }}</span>
        <mat-icon class="mini">history</mat-icon>
      </div>
    </div>
  `,
  styles: [`
    .status-bar { display: flex; padding: 4px 16px; font-size: 11px; color: white; transition: background 0.3s; }
    .online { background: #2e7d32; }
    .offline { background: #c62828; }
    .item { display: flex; align-items: center; gap: 6px; }
    .spacer { flex: 1; }
    .mini { font-size: 14px; width: 14px; height: 14px; }
  `]
})
export class StatusBarComponent {
  @Input() isOnline: boolean = true;
  @Input() lastSync: string = '12:00';
}