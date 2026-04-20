import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickActionCardComponent } from '../quick-action-card/quick-action-card';
import { MatDialog } from '@angular/material/dialog';
import { QrGeneratorModalComponent } from '../qr-generator-modal/qr-generator-modal';

@Component({
  selector: 'app-quick-actions-grid',
  standalone: true,
  imports: [CommonModule, QuickActionCardComponent],
  templateUrl: './quick-actions-grid.html',
  styles: [`
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 0 16px 16px 16px;
    }
  `]
  
})
export class QuickActionsGridComponent {
  protected dialog = inject(MatDialog) ;
  openQRModal() {
    this.dialog.open(QrGeneratorModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      
    });
  }

}