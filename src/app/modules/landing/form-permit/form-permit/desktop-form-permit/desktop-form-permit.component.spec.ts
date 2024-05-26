import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFormPermitComponent } from './desktop-form-permit.component';

describe('DesktopFormPermitComponent', () => {
  let component: DesktopFormPermitComponent;
  let fixture: ComponentFixture<DesktopFormPermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopFormPermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopFormPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
