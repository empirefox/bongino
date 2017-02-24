import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as qrcanvas from 'qrcanvas';

import { UserService } from '../user';
import { QrConfig } from './qr.config';


@Injectable()
export class QrService {

  private qr: Observable<string>;

  constructor(private userService: UserService) { }

  getMyQrDataURL(): Observable<string> {
    if (!this.qr) {
      this.qr = this.userService.getUserinfo().take(1).map(info => {
        let config: any = this.getConfig();
        let { ColorOut: colorOut, ColorIn: colorIn} = config;
        let timestamp = Math.floor(Date.now() / 1000).toString(36)

        let options: any = {
          data: `${location.protocol}//${location.host}?u=${info.ID}&t=${timestamp}`, // TODO move to profile
          cellSize: config.CellSize,
          foreground: [
            // foreground color
            { style: config.ColorFore },
            // outer squares of the positioner
            { row: 0, rows: 7, col: 0, cols: 7, style: colorOut },
            { row: -7, rows: 7, col: 0, cols: 7, style: colorOut },
            { row: 0, rows: 7, col: -7, cols: 7, style: colorOut },
            // inner squares of the positioner
            { row: 2, rows: 3, col: 2, cols: 3, style: colorIn },
            { row: -5, rows: 3, col: 2, cols: 3, style: colorIn },
            { row: 2, rows: 3, col: -5, cols: 3, style: colorIn },
          ],
          background: config.ColorBack,
          typeNumber: config.TypeNumber,
        };
        if (config.QrLogoUrl) {
          let image = new Image();
          image.src = config.QrLogoUrl;
          options.logo = {
            image,
            size: config.LogoSize,
            clearEdges: config.LogoClearEdges,
            margin: config.LogoMargin,
          };
        }
        return qrcanvas(options).toDataURL();
      });
    }
    return this.qr;
  }

  getConfig(): QrConfig {
    return {
      TypeNumber: 1,
      CellSize: 6,
      ColorFore: '#222',
      ColorBack: '#fff',
      ColorOut: '#222',
      ColorIn: '#222',
      LogoSize: 15,
      LogoClearEdges: 2,
      LogoMargin: 0,
    };
  }

}
