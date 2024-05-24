import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLeaveTableComponent } from './form-leave-table.component';

describe('FormLeaveTableComponent', () => {
  let component: FormLeaveTableComponent;
  let fixture: ComponentFixture<FormLeaveTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLeaveTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormLeaveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
