import { TestBed } from '@angular/core/testing';

import { TwigService } from './twig.service';

describe('TwigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TwigService = TestBed.get(TwigService);
    expect(service).toBeTruthy();
  });
});
