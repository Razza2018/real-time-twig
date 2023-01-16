import { Component, OnInit, HostListener, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TwigService } from '../twig.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnChanges {

  twigTemplate: string = '';
  cssTemplate: string = '';
  jsonTemplate: string = '';
  previousWidth: number = 0;

  osType: string = 'windows';

  @Input() selectedPanel: string = 'html-twig';

  @ViewChild('twigTemplateElement') twigTemplateElement: ElementRef;
  @ViewChild('cssTemplateElement') cssTemplateElement: ElementRef;
  @ViewChild('jsonTemplateElement') jsonTemplateElement: ElementRef;

  constructor(private twig: TwigService) { }

  ngOnInit(): void {
    this.setOsType();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPanel.currentValue === 'html-twig') {
      setTimeout(() => this.twigTemplateElement.nativeElement.focus(), 0);
    }

    if (changes.selectedPanel.currentValue === 'css') {
      setTimeout(() => this.cssTemplateElement.nativeElement.focus(), 0);
    }

    if (changes.selectedPanel.currentValue === 'json') {
      setTimeout(() => this.jsonTemplateElement.nativeElement.focus(), 0);
    }
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

  isUpperCase(char: string): boolean {
    if (char === char.toUpperCase() && char !== char.toLowerCase()) return true;
    return false;
  }

  handleKeys(event: any) {
    var genericKeys = [
      'tab',
      'alt-arrowleft',
      'alt-arrowright',
      'enter'
    ];

    var windowsKeys = [
      'ctrl-[',
      'ctrl-]',
      'ctrl-shift-d',
      'ctrl-enter',
      'ctrl-shift-enter',
      'ctrl-/'
    ];

    var macOsKeys = [
      'cmd-[',
      'cmd-]',
      'cmd-shift-d',
      'cmd-enter',
      'cmd-shift-enter',
      'cmd-/'
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

    console.log(key);

    if (genericKeys.includes(key)) {
      event.preventDefault();
    } else if (this.osType === 'windows' || this.osType === 'linux') {
      if (windowsKeys.includes(key)) event.preventDefault();
    } else if (this.osType === 'macintosh') {
      if (macOsKeys.includes(key)) event.preventDefault();
    }

    // Generic shortcuts
    if (key === 'tab') this.handleInsertTab(event, start, end, startOfLine, endOfLine, direction);
    if (key === 'alt-arrowleft') this.handlePreviousSubWord(event, start, end, startOfLine, endOfLine, direction);
    if (key === 'alt-arrowright') this.handleNextSubWord(event, start, end, startOfLine, endOfLine, direction);
    if (key === 'enter') this.handleNewLine(event, start, end, startOfLine, endOfLine, direction);

    // Windows and Linux shortcuts
    if (this.osType === 'windows' || this.osType === 'linux') {
      if (key === 'ctrl-[') this.handleLeftIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-]') this.handleRightIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-shift-d') this.handleDuplicateLine(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-enter') this.handleNewLineBelow(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-shift-enter') this.handleNewLineAbove(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'ctrl-/') this.handleToggleComment(event, start, end, startOfLine, endOfLine, direction);
    }

    // MacOS shortcuts
    if (this.osType === 'macintosh') {
      if (key === 'cmd-[') this.handleLeftIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-]') this.handleRightIndent(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-shift-d') this.handleDuplicateLine(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-enter') this.handleNewLineBelow(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-shift-enter') this.handleNewLineAbove(event, start, end, startOfLine, endOfLine, direction);
      if (key === 'cmd-/') this.handleToggleComment(event, start, end, startOfLine, endOfLine, direction);
    }

    if (event.target.classList.contains('twig-template')) {
      this.twigTemplate = event.target.value;
    }

    if (event.target.classList.contains('css-template')) {
      this.cssTemplate = event.target.value;
    }

    if (event.target.classList.contains('json-template')) {
      this.jsonTemplate = event.target.value;
    }

    this.renderTwig();
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

  handlePreviousSubWord(event, start, end, startOfLine, endOfLine, direction) {
    let index = start;
    let skipDashOrUnderscore = true;

    while (index !== 0 && (skipDashOrUnderscore || (
        event.target.value.slice(index - 1, index) !== '_' &&
        event.target.value.slice(index - 1, index) !== '-' &&
        event.target.value.slice(index - 1, index) !== ' ' &&
        event.target.value.slice(index - 1, index) !== '\n' &&
        event.target.value.slice(index - 1, index) !== '\t'
      )) && !this.isUpperCase(event.target.value.slice(index - 1, index))) {
      index--;
      skipDashOrUnderscore = false;
    }

    if (index === 0) {
      event.target.selectionStart = index;
      event.target.selectionEnd = index;
    } else if (
      event.target.value.slice(index - 1, index) === '_' ||
      event.target.value.slice(index - 1, index) === '-' ||
      event.target.value.slice(index - 1, index) === ' ' ||
      event.target.value.slice(index - 1, index) === '\n' ||
      event.target.value.slice(index - 1, index) === '\t'
    ) {
      event.target.selectionStart = index;
      event.target.selectionEnd = index;
    } else {
      event.target.selectionStart = index - 1;
      event.target.selectionEnd = index - 1;
    }
  }

  handleNextSubWord(event, start, end, startOfLine, endOfLine, direction) {
    let index = start;
    let skipNextChar = true;

    while (index !== event.target.value.length && (skipNextChar || (
        event.target.value.slice(index, index + 1) !== '_' &&
        event.target.value.slice(index, index + 1) !== '-' &&
        event.target.value.slice(index, index + 1) !== ' ' &&
        event.target.value.slice(index, index + 1) !== '\n' &&
        event.target.value.slice(index, index + 1) !== '\t'
      )) && (skipNextChar || !this.isUpperCase(event.target.value.slice(index, index + 1)))) {
      index++;
      skipNextChar = false;
    }

    if (index === event.target.value.length) {
      event.target.selectionStart = index;
      event.target.selectionEnd = index;
    } else if (
      event.target.value.slice(index, index + 1) === '_' ||
      event.target.value.slice(index, index + 1) === '-' ||
      event.target.value.slice(index, index + 1) === ' ' ||
      event.target.value.slice(index, index + 1) === '\n' ||
      event.target.value.slice(index, index + 1) === '\t'
    ) {
      event.target.selectionStart = index;
      event.target.selectionEnd = index;
    } else {
      event.target.selectionStart = index;
      event.target.selectionEnd = index;
    }
  }

  handleNewLine(event, start, end, startOfLine, endOfLine, direction) {
    let tabs: number = 0;
    let output: string = '';

    while (event.target.value.slice(startOfLine + tabs, startOfLine + tabs + 1) === '\t') {
      tabs++;
    }

    output = event.target.value.slice(0, start) + '\n';

    for (let i = 0; i < tabs; i++) output += '\t';

    output += event.target.value.slice(end, event.target.value.length);

    event.target.value = output;

    event.target.selectionStart = start + tabs + 1;
    event.target.selectionEnd = start + tabs + 1;
  }

  handleNewLineBelow(event, start, end, startOfLine, endOfLine, direction) {
    let tabs: number = 0;
    let output: string = '';

    while (event.target.value.slice(startOfLine + tabs, startOfLine + tabs + 1) === '\t') {
      tabs++;
    }

    output = event.target.value.slice(0, endOfLine) + '\n';

    for (let i = 0; i < tabs; i++) output += '\t';

    output += event.target.value.slice(endOfLine, event.target.value.length);

    event.target.value = output;

    event.target.selectionStart = endOfLine + tabs + 1;
    event.target.selectionEnd = endOfLine + tabs + 1;
  }

  handleNewLineAbove(event, start, end, startOfLine, endOfLine, direction) {
    let tabs: number = 0;
    let output: string = '';

    while (event.target.value.slice(startOfLine + tabs, startOfLine + tabs + 1) === '\t') {
      tabs++;
    }

    output = event.target.value.slice(0, startOfLine);

    for (let i = 0; i < tabs; i++) output += '\t';

    output += '\n';

    output += event.target.value.slice(startOfLine, event.target.value.length);

    event.target.value = output;

    event.target.selectionStart = startOfLine + tabs;
    event.target.selectionEnd = startOfLine + tabs;
  }

  handleToggleComment(event, start, end, startOfLine, endOfLine, direction) {
    let lines = event.target.value.slice(startOfLine, endOfLine).split('\n');
    let charsAdded = 0;

    for (let key in lines) {

      if (lines[key].includes('//')) {
        lines[key] = lines[key].replace(/\/\/ ?/, '')
        charsAdded += -3;
      } else {
        let index = 0;

        while (lines[key][index] === ' ' || lines[key][index] === '\t') index++;

        lines[key] = lines[key].slice(0, index) + '// ' + lines[key].slice(index, lines[key].length);
        charsAdded += 3;
      }
    }

    event.target.value = event.target.value.slice(0, startOfLine) + lines.join('\n') + event.target.value.slice(endOfLine);

    event.target.selectionStart = start + (charsAdded > 0 ? 3 : -3);
    event.target.selectionEnd = end + charsAdded;
    event.target.selectionDirection = direction;
  }

}
