import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-utility-shortcut',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './utility-shortcut.html',
  styles: [`
    .shortcut {
      display: flex; align-items: center; padding: 12px;
      background: #f5f5f5; border-radius: 8px; margin-bottom: 8px;
      cursor: pointer; border: none; width: 100%;
    }
    .label { margin-inline-start: 12px; font-size: 14px; color: #333; }
    .spacer { flex: 1; }
    .chevron { color: #bdbdbd; font-size: 20px; }
  `]
})
export class UtilityShortcutComponent {
  @Input() icon: string = 'settings';
  @Input() labelKey: string = '';
}