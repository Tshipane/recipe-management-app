import { TestBed } from '@angular/core/testing';

import { ToastrMessageService } from './toastr-message.service';

describe('ToastrMessageService', () => {
  let service: ToastrMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
