import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickActionsGridComponent } from './quick-actions-grid';

describe('QuickActionsGrid', () => {
  let component: QuickActionsGridComponent;
  let fixture: ComponentFixture<QuickActionsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickActionsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
