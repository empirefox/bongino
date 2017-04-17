import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as qrcanvas from 'qrcanvas';

import { ConfigService, qrConfig } from '../config';
import { UserService } from '../user';


@Injectable()
export class QrService {

  private qr: Observable<string>;

  constructor(
    private userService: UserService,
    private configService: ConfigService) { }

  getMyQrDataURL(): Observable<string> {
    if (!this.qr) {
      this.qr = this.userService.getUserinfo().take(1).map(info => {
        const { ColorOut: colorOut, ColorIn: colorIn } = qrConfig;
        const timestamp = Math.floor(Date.now() / 1000).toString(36);

        const options: any = {
          data: `${location.protocol}//${location.host}?u=${info.ID}&t=${timestamp}`, // TODO move to profile
          cellSize: qrConfig.CellSize,
          foreground: [
            // foreground color
            { style: qrConfig.ColorFore },
            // outer squares of the positioner
            { row: 0, rows: 7, col: 0, cols: 7, style: colorOut },
            { row: -7, rows: 7, col: 0, cols: 7, style: colorOut },
            { row: 0, rows: 7, col: -7, cols: 7, style: colorOut },
            // inner squares of the positioner
            { row: 2, rows: 3, col: 2, cols: 3, style: colorIn },
            { row: -5, rows: 3, col: 2, cols: 3, style: colorIn },
            { row: 2, rows: 3, col: -5, cols: 3, style: colorIn },
          ],
          background: qrConfig.ColorBack,
          typeNumber: qrConfig.TypeNumber,
        };
        if (this.configService.config.QrLogoUrl) {
          const image = new Image();
          image.src = this.configService.config.QrLogoUrl;
          options.logo = {
            image,
            size: qrConfig.LogoSize,
            clearEdges: qrConfig.LogoClearEdges,
            margin: qrConfig.LogoMargin,
          };
        }
        return qrcanvas(options).toDataURL();
      });
    }
    return this.qr;
  }

}
