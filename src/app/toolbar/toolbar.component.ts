import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  _selectedPanel: string = 'html-twig';
  _selectedIndenting: string = 'spaces';
  @Output() selectedPanel: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedIndenting: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleDarkMode: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  setSelectedPanel(selection: string): void {
    this._selectedPanel = selection;
    this.selectedPanel.emit(selection);
  }

  setSelectedIndenting(selection: string): void {
    this._selectedIndenting = selection;
    this.selectedIndenting.emit(selection);
  }

}
