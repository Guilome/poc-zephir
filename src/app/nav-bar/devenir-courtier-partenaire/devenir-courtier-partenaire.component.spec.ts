import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevenirCourtierPartenaireComponent } from './devenir-courtier-partenaire.component';

describe('DevenirCourtierPartenaireComponent', () => {
  let component: DevenirCourtierPartenaireComponent;
  let fixture: ComponentFixture<DevenirCourtierPartenaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevenirCourtierPartenaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevenirCourtierPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
