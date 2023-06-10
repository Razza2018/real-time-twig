import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedPanel: string = 'html-twig';

  title = 'real-time-twig';

  @ViewChild('siteWrapper') siteWrapper: any;

  ngAfterViewInit(): void {
    var darkModeOverride = null;

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    darkModeOverride = localStorage.getItem('dark-mode');

    if (darkModeOverride === 'true') {
      this.toggleDarkMode(false);
    }

    if (darkModeOverride === null && prefersDarkScheme.matches) {
      this.toggleDarkMode(false);
    }
  }

  toggleDarkMode(saveState: boolean = true): void {
    var darkMode = false;

    this.siteWrapper.nativeElement.classList.toggle('darkMode');

    if (this.siteWrapper.nativeElement.classList.contains('darkMode')) {
      darkMode = true;
    }

    if (saveState) {
      localStorage.setItem('dark-mode', `${darkMode}`);
    }
  }

}
