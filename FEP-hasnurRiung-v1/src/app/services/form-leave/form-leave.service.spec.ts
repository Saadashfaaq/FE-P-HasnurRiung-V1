import { TestBed } from '@angular/core/testing';

import { FormLeaveService } from './form-leave.service';

describe('FormLeaveService', () => {
  let service: FormLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
