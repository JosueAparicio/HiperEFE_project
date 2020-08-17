import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralValidationsComponent } from './general-validations.component';

describe('GeneralValidationsComponent', () => {
  let component: GeneralValidationsComponent;
  let fixture: ComponentFixture<GeneralValidationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralValidationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
