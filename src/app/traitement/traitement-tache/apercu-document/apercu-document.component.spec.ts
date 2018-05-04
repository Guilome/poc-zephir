import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApercuDocumentComponent } from './apercu-document.component';

describe('ApercuDocumentComponent', () => {
  let component: ApercuDocumentComponent;
  let fixture: ComponentFixture<ApercuDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApercuDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApercuDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
