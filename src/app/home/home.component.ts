import { Component, OnInit } from '@angular/core';
import { TwigService } from '../twig.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  twigTemplate: string = "{{- 'Hello Everyone!' -}}{% if 'name' %}";
  renderedHtml: string = "";

  constructor(private twig: TwigService) { }

  ngOnInit() {
    this.renderTwig();
  }

  renderTwig(): void {
    this.renderedHtml = this.twig.render(this.twigTemplate);
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
