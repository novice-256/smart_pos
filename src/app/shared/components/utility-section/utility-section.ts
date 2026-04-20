import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityShortcutComponent } from '../utility-shortcut/utility-shortcut';


@Component({
  selector: 'app-utility-section',
  standalone: true,
  imports: [CommonModule, UtilityShortcutComponent],
  templateUrl: './utility-section.html',
  styles: [`.section-container { padding: 0 16px 80px 16px; }`]
})
export class UtilitySectionComponent {} 