import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AppHeaderComponent } from './components/app-header/app-header';
import { StatusBarComponent } from './components/status-bar/status-bar';
import {  PrimaryCTAComponent } from './components/primary-cta/primary-cta';
import { QuickActionCardComponent } from './components/quick-action-card/quick-action-card';
import { QuickActionsGridComponent } from './components/quick-actions-grid/quick-actions-grid';
import {  DailySummaryCardComponent } from './components/daily-summary-card/daily-summary-card';
import {  SummarySectionComponent } from './components/summary-section/summary-section';
import {  AlertBannerComponent } from './components/alert-banner/alert-banner';
import {  UtilityShortcutComponent } from './components/utility-shortcut/utility-shortcut';
import {  UtilitySectionComponent } from './components/utility-section/utility-section';
import {  BottomNavBarComponent } from './components/bottom-nav-bar/bottom-nav-bar';
import { InvoiceModalComponent } from './components/invoice-modal/invoice-modal';

// Your Shared Components
// import { QuickActionCardComponent } from './components/quick-action-card/quick-action-card.component';
// import { StatusBarComponent } from './components/status-bar/status-bar.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
      StatusBarComponent,
        AppHeaderComponent,
        PrimaryCTAComponent,
        QuickActionCardComponent,
        QuickActionsGridComponent,
        DailySummaryCardComponent,
        SummarySectionComponent,
        AlertBannerComponent,
        UtilityShortcutComponent,
        UtilitySectionComponent,
        BottomNavBarComponent,
        
  
  ],
  exports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
      StatusBarComponent,
        AppHeaderComponent,
        PrimaryCTAComponent,
        QuickActionCardComponent,
        QuickActionsGridComponent,
        DailySummaryCardComponent,
        SummarySectionComponent,
        AlertBannerComponent,
        UtilityShortcutComponent,
        UtilitySectionComponent,
        BottomNavBarComponent,
        
  
  ]
})
export class SharedModule { }