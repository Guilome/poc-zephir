import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MestachesComponent } from './mestaches.component';

describe('MestachesComponent', () => {
  let component: MestachesComponent;
  let fixture: ComponentFixture<MestachesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MestachesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MestachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
