import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserModificationComponent } from './visualiser-modification.component';

describe('VisualiserModificationComponent', () => {
  let component: VisualiserModificationComponent;
  let fixture: ComponentFixture<VisualiserModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualiserModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
