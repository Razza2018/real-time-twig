import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TwigService } from '../twig.service';

@Component({
  selector: 'app-twig-preview',
  templateUrl: './twig-preview.component.html',
  styleUrls: ['./twig-preview.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class TwigPreviewComponent implements OnInit {

  @Input() twigTemplate: string = '';
  @Input() cssTemplate: string = '';

  renderedHtml: string = '';

  constructor(private twig: TwigService) {
    twig.renderedHtml.subscribe((renderedHtml: string) => this.renderedHtml = renderedHtml);
  }

  ngOnInit() {
    this.twig.render(this.twigTemplate, this.cssTemplate)
  }

}
