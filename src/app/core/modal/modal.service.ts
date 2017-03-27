import { Injectable } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Injectable()
export class ModalService {
  constructor(private modal: Modal) { }

  alert(content: string, title: string) {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title(title)
      .body(content).open();
  }

  confirm(content: string, title: string) {
    return this.modal.confirm()
      .size('lg')
      .showClose(true)
      .title(title)
      .body(content).open();
  }

  prompt(content: string, title: string, placeholder = '') {
    return this.modal.prompt()
      .size('lg')
      .showClose(true)
      .placeholder(placeholder)
      .title(title)
      .body(content).open();
  }
}