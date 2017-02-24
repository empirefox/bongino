import { Directive, Input, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'img[default]',
})
export class ImgDefaultDerective {
  @HostBinding()
  @Input() src: string;
  @Input() default: string;

  @HostListener('error')
  updateUrl() {
    this.src = this.default;
  }
}
