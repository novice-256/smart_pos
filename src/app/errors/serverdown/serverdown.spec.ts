import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Serverdown } from './serverdown';

describe('Serverdown', () => {
  let component: Serverdown;
  let fixture: ComponentFixture<Serverdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Serverdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Serverdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
