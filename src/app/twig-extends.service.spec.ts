import { TestBed } from '@angular/core/testing';

import { TwigExtendsService } from './twig-extends.service';

describe('TwigExtendsService', () => {
  let service: TwigExtendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwigExtendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
