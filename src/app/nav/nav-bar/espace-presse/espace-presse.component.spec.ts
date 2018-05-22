import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacePresseComponent } from './espace-presse.component';

describe('EspacePresseComponent', () => {
  let component: EspacePresseComponent;
  let fixture: ComponentFixture<EspacePresseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspacePresseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspacePresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
