import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  template: '<div class="modal-header">\
  <h4 class="modal-title">{{title}}</h4>\
  <button type="button" class="close" aria-label="Close" (click)="no()">\
    <span aria-hidden="true">&times;</span>\
  </button>\
</div>\
<div class="modal-body">\
  {{body}}\
</div>\
<div class="modal-footer">\
  <button type="button" class="btn btn-success" (click)="yes()">Oui</button>\
  <button type="button" class="btn btn-danger"  (click)="no()">Non</button>\
</div>'
})
export class ModalComponent implements OnInit {

  @Output() cancelModal:EventEmitter<string> = new EventEmitter();
  @Output() confirmModal:EventEmitter<string> = new EventEmitter();
  @Input() title: string;
  @Input() body: string;

  constructor() { }

  ngOnInit() {
  }

  yes() {
    this.confirmModal.emit('bye')
  }

  no(){
     this.cancelModal.emit('bye')
  }

}
