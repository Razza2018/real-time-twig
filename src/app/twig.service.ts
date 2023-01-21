import { Injectable, EventEmitter } from '@angular/core';
import * as qrcode from 'qrcode';
import * as Twig from 'twig/twig.min.js';

import { TwigExtendsService } from './twig-extends.service';

@Injectable({
  providedIn: 'root'
})
export class TwigService {

  private Twig: Twig = Twig;

  renderedHtml: EventEmitter<string> = new EventEmitter();

  constructor(twigExtendsService: TwigExtendsService) {
    twigExtendsService.twigExtendFunctions(this.Twig);
  }

  async render(template: string, styles: string, json: string): Promise<void> {
    let data: object = {};

    template = "<style>" + styles + "</style>" + template;
    try {
      if (json) {
        if (json.includes('//')) {
          json = json.replace(/(?:(,\s*?)\n\s*?)?\/\/[^\n]*?(?=\n|$)/g, '$1');
        }

        data = JSON.parse(json);
      }

      var twigTemplate = this.Twig.twig({
        data: template,
        rethrow: true
      });

      var htmlOutput = twigTemplate.render(data);

      htmlOutput = await this.replaceQrCodes(htmlOutput);

      this.renderedHtml.emit(htmlOutput);
    } catch (e) {
      this.renderedHtml.emit(e);
    }
  }

    async replaceQrCodes(content) {
      var matchesRegex = /qrcode\(.+?\)/g;
      var regex = /qrcode\((.+?)\)/;
      var matches = content.match(matchesRegex);

      if (matches && matches.length) {
        for (let match of matches) {
          let data = match.replace(regex, '$1');
          let qr = await qrcode.toDataURL(data);

          content = content.replace(match, qr);
        }
      }

      return content;
    }

}
