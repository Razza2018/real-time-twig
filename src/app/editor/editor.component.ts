import { Component, OnInit, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { TwigService } from '../twig.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  twigTemplate: string = '';
  cssTemplate: string = '';
  jsonTemplate: string = '';
  previousWidth: number = 0;

  osType: string = 'windows';

  @Input() selectedPanel: string = 'html-twig';

  @ViewChild('twigTemplateElement') twigTemplateElement: ElementRef;
  @ViewChild('cssTemplateElement') cssTemplateElement: ElementRef;
  @ViewChild('jsonTemplateElement') jsonTemplateElement: ElementRef;

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   if (this.previousWidth >= 1100 && event.target.innerWidth < 1100) {
  //     console.log(this.twigTemplateElement.nativeElement.classList)
  //     this.adjustTextAreaHeight({target: this.twigTemplateElement.nativeElement}, true);
  //     this.adjustTextAreaHeight({target: this.cssTemplateElement.nativeElement}, true);
  //     this.adjustTextAreaHeight({target: this.jsonTemplateElement.nativeElement}, true);
  //   } else if (this.previousWidth < 1100 && event.target.innerWidth >= 1100) {
  //     this.twigTemplateElement.nativeElement.style.transition = 'none';
  //     this.cssTemplateElement.nativeElement.style.transition = 'none';
  //     this.jsonTemplateElement.nativeElement.style.transition = 'none';

  //     this.twigTemplateElement.nativeElement.style.height = '';
  //     this.cssTemplateElement.nativeElement.style.height = '';
  //     this.jsonTemplateElement.nativeElement.style.height = '';

  //     setTimeout(() => {
  //       this.twigTemplateElement.nativeElement.style.transition = '';
  //       this.cssTemplateElement.nativeElement.style.transition = '';
  //       this.jsonTemplateElement.nativeElement.style.transition = '';
  //     }, 10);
  //   }

  //   this.previousWidth = event.target.innerWidth;
  // }
  
  constructor(private twig: TwigService) { }

  ngOnInit(): void {
    this.setOsType();
  }

  setOsType(): void {
    var userAgent = window.navigator.userAgent;

    if (userAgent) {
      if (userAgent.includes('Macintosh')) this.osType = 'macintosh';
      if (userAgent.includes('Linux')) this.osType = 'linux';
    }
  }

  renderTwig(): void {
    this.twig.render(this.twigTemplate, this.cssTemplate, this.jsonTemplate);
  }

  adjustTextAreaHeight(event, ignoreCurrentHeight: boolean = false) {
    if (ignoreCurrentHeight || event.target.style.height) {
      event.target.style.height = '';
      event.target.style.height = event.target.scrollHeight + 2 + 'px';
    }
  }

  inputTemplateFocus(event) {
    this.removeFocusClasses();

    if (event) {
      this.twigTemplateElement.nativeElement.classList.add('input-template_blur');
      this.cssTemplateElement.nativeElement.classList.add('input-template_blur');
      this.jsonTemplateElement.nativeElement.classList.add('input-template_blur');

      event.target.classList.remove('input-template_blur');
      event.target.classList.add('input-template_focus');
    }
  }

  removeFocusClasses(): void {
    this.twigTemplateElement.nativeElement.classList.remove('input-template_focus');
    this.twigTemplateElement.nativeElement.classList.remove('input-template_blur');
    this.cssTemplateElement.nativeElement.classList.remove('input-template_focus');
    this.cssTemplateElement.nativeElement.classList.remove('input-template_blur');
    this.jsonTemplateElement.nativeElement.classList.remove('input-template_focus');
    this.jsonTemplateElement.nativeElement.classList.remove('input-template_blur');
  }

  handleKeys(event: any) {
    var genericKeys = [
      'tab'
    ];

    var windowsKeys = [
      'ctrl-[',
      'ctrl-]',
      'ctrl-shift-d'
    ];

    var macOsKeys = [
      'cmd-[',
      'cmd-]',
      'cmd-shift-d'
    ];
    
    var key = event.key.toLowerCase();
    var start = event.target.selectionStart;
    var end = event.target.selectionEnd;
    var direction = event.target.selectionDirection;
    var startOfLine = start;
    var endOfLine = end;

    while (startOfLine !== 0 && event.target.value.slice(startOfLine -1, startOfLine) !== '\n') {
      startOfLine--;
    }

    while (endOfLine !== event.target.value.length && event.target.value.slice(endOfLine, endOfLine + 1) !== '\n') {
      endOfLine++;
    }

    if (event.shiftKey) key = 'shift-' + key;
    if (event.altKey) key = 'alt-' + key;
    if (event.metaKey) key = 'cmd-' + key;
    if (event.ctrlKey) key = 'ctrl-' + key;

    if (genericKeys.includes(key)) {
      event.preventDefault();
    } else if (this.osType === 'windows' || this.osType === 'linux') {
      if (windowsKeys.includes(key)) event.preventDefault();
    } else if (this.osType === 'macintosh') {
      if (macOsKeys.includes(key)) event.preventDefault();
    }

    // Generic shortcuts
    if (key === 'tab') this.handleInsertTab(event, start, end, startOfLine, endOfLine, direction);

    // Windows and Linux shortcuts
    if (this.osType === 'windows' || this.osType === 'linux') {
      if (key === 'ctrl-[') this.handleLeftIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-]') this.handleRightIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-shift-d') this.handleDuplicateLine(event, start, end, startOfLine, endOfLine, direction);
    }

    // MacOS shortcuts
    if (this.osType === 'macintosh') {
      if (key === 'cmd-[') this.handleLeftIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-]') this.handleRightIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-shift-d') this.handleDuplicateLine(event, start, end, startOfLine, endOfLine, direction);
    }
  }
  
  handleInsertTab(event, start, end, startOfLine, endOfLine, direction) {
    event.target.value = event.target.value.substring(0, start) + '\t' + event.target.value.substring(end);
    
    event.target.selectionStart = event.target.selectionEnd = start + 1;
  }

  handleLeftIndent(event, start, end, startOfLine, endOfLine, direction) {
    let lines = event.target.value.slice(startOfLine, endOfLine).split('\n');
    let charsRemoved = 0;

    for (let key in lines) {
      if (lines[key].slice(0, 1) === '\t') {
        lines[key] = lines[key].slice(1);
        charsRemoved++;
      }
    }

    event.target.value = event.target.value.slice(0, startOfLine) + lines.join('\n') + event.target.value.slice(endOfLine);

    event.target.selectionStart = start - (charsRemoved ? 1 : 0);
    event.target.selectionEnd = end - charsRemoved;
    event.target.selectionDirection = direction;
  }

  handleRightIndent(event, start, end, startOfLine, endOfLine, direction) {
    let lines = event.target.value.slice(startOfLine, endOfLine).split('\n');
    let charsAdded = 0;

    for (let key in lines) {
      lines[key] = '\t' + lines[key];
      charsAdded++;
    }

    event.target.value = event.target.value.slice(0, startOfLine) + lines.join('\n') + event.target.value.slice(endOfLine);

    event.target.selectionStart = start + 1;
    event.target.selectionEnd = end + charsAdded;
    event.target.selectionDirection = direction;
  }

  handleDuplicateLine(event, start, end, startOfLine, endOfLine, direction) {
    event.target.value = event.target.value.slice(0, endOfLine) + '\n' + event.target.value.slice(startOfLine, endOfLine) + event.target.value.slice(endOfLine);

    event.target.selectionStart = start + (endOfLine - startOfLine) + 1;
    event.target.selectionEnd = end + (endOfLine - startOfLine) + 1;
    event.target.selectionDirection = direction;
  }

}
