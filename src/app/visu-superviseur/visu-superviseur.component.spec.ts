import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuSuperviseurComponent } from './visu-superviseur.component';

describe('VisuSuperviseurComponent', () => {
  let component: VisuSuperviseurComponent;
  let fixture: ComponentFixture<VisuSuperviseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuSuperviseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuSuperviseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
