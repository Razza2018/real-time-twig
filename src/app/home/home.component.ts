import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { TwigService } from '../twig.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  twigTemplate: string = '';
  cssTemplate: string = '';

  previousWidth: number = 0;

  @ViewChild('twigTemplateElement',  {static: false}) twigTemplateElement: ElementRef;
  @ViewChild('cssTemplateElement',  {static: false}) cssTemplateElement: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if ((this.previousWidth >= 1469 && event.target.innerWidth < 1469) || (this.previousWidth < 1469 && event.target.innerWidth >= 1469)) {
      this.adjustTextAreaHeight({target: this.twigTemplateElement.nativeElement});
      this.adjustTextAreaHeight({target: this.cssTemplateElement.nativeElement});
    }

    this.previousWidth = event.target.innerWidth;
  }

  constructor(private twig: TwigService) { }

  ngOnInit() { }

  renderTwig(): void {
    this.twig.render(this.twigTemplate, this.cssTemplate);
  }

  adjustTextAreaHeight(event) {
    event.target.style.height = '';
    event.target.style.height = event.target.scrollHeight + 2 + 'px';
  }

  onKey(event) {
    event.preventDefault();
    this.twigTemplate += '\t';
  }

}
