import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWorkPermitComponent } from './table-work-permit.component';

describe('TableWorkPermitComponent', () => {
  let component: TableWorkPermitComponent;
  let fixture: ComponentFixture<TableWorkPermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWorkPermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableWorkPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
