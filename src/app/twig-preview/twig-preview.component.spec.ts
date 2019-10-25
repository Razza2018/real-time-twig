import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwigPreviewComponent } from './twig-preview.component';

describe('TwigPreviewComponent', () => {
  let component: TwigPreviewComponent;
  let fixture: ComponentFixture<TwigPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwigPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwigPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
