import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleNoteComponent } from './nouvelle-note.component';

describe('NouvelleNoteComponent', () => {
  let component: NouvelleNoteComponent;
  let fixture: ComponentFixture<NouvelleNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
