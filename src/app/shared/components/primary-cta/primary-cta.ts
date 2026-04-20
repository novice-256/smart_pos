import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal';

@Component({
  selector: 'app-primary-cta',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './primary-cta.html',
  styles: [`
    .cta-box { padding: 16px; }
    .hero-btn { 
      width: 100%; height: 72px; border-radius: 16px; 
      background: #FFD600 !important; color: #000;
      font-size: 1.2rem; font-weight: 700;
    }
    .icon-large { font-size: 32px; width: 32px; height: 32px; margin-inline-end: 12px; }
  `]
})
export class PrimaryCTAComponent {
   private dialog = inject(MatDialog);
 openDialog(){
  this.dialog.open(InvoiceModalComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '100%',
    height: '100%',
    panelClass: 'fullscreen-dialog'
  });
 }
}