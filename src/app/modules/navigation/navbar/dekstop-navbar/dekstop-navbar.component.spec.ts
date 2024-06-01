import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekstopNavbarComponent } from './dekstop-navbar.component';

describe('DekstopNavbarComponent', () => {
  let component: DekstopNavbarComponent;
  let fixture: ComponentFixture<DekstopNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DekstopNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DekstopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
