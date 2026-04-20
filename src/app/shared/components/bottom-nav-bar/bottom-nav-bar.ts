import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bottom-nav-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './bottom-nav-bar.html',
  styles: [`
    .nav-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      height: 64px; background: white; display: flex;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 1000;
    }
    .nav-item {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: #757575; cursor: pointer;
    }
    .active { color: #1b5e20; }
    .label { font-size: 10px; margin-top: 4px; }
  `]
})
export class BottomNavBarComponent {
  activeTab = 'home';
}