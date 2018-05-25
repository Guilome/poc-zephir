import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheNonAffecteComponent } from './tache-non-affecte.component';

describe('TacheNonAffecteComponent', () => {
  let component: TacheNonAffecteComponent;
  let fixture: ComponentFixture<TacheNonAffecteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TacheNonAffecteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TacheNonAffecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
