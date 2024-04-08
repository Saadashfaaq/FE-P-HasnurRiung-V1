import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLeaveComponent } from './form-leave.component';

describe('FormLeaveComponent', () => {
  let component: FormLeaveComponent;
  let fixture: ComponentFixture<FormLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLeaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
