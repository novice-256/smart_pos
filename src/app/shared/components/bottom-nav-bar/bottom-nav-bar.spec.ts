import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomNavBarComponent } from './bottom-nav-bar';


describe('BottomNavBar', () => {
  let component: BottomNavBarComponent;
  let fixture: ComponentFixture<BottomNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
