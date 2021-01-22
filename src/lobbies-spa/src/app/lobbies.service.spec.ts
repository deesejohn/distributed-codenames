import { TestBed } from '@angular/core/testing';

import { LobbiesService } from './lobbies.service';

describe('LobbiesService', () => {
  let service: LobbiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
