import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuGestionComponent } from './visu-gestion.component';

describe('VisuGestionComponent', () => {
  let component: VisuGestionComponent;
  let fixture: ComponentFixture<VisuGestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuGestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
