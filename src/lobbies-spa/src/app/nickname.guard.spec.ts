import { TestBed } from '@angular/core/testing';

import { NicknameGuard } from './nickname.guard';

describe('NicknameGuard', () => {
  let guard: NicknameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NicknameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
