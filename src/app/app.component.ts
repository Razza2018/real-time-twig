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
      this.toggleDarkMode();
    }

    if (darkModeOverride === null && prefersDarkScheme.matches) {
      this.toggleDarkMode();
    }
  }

  toggleDarkMode(): void {
    var darkMode = false;

    this.siteWrapper.nativeElement.classList.toggle('darkMode');

    if (this.siteWrapper.nativeElement.classList.contains('darkMode')) {
      darkMode = true;
    }

    localStorage.setItem('dark-mode', `${darkMode}`);
  }

}
