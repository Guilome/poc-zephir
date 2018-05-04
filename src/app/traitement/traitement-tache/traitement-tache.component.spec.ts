import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementTacheComponent } from './traitement-tache.component';

describe('TraitementTacheComponent', () => {
  let component: TraitementTacheComponent;
  let fixture: ComponentFixture<TraitementTacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraitementTacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraitementTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
