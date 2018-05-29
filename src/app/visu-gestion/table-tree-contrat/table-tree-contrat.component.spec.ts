import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTreeContratComponent } from './table-tree-contrat.component';

describe('TableTreeContratComponent', () => {
  let component: TableTreeContratComponent;
  let fixture: ComponentFixture<TableTreeContratComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTreeContratComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTreeContratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
