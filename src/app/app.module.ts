import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TwigPreviewComponent } from './twig-preview/twig-preview.component';
import { PageComponent } from './page/page.component';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeHtmlPipe,
    ToolbarComponent,
    TwigPreviewComponent,
    PageComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
