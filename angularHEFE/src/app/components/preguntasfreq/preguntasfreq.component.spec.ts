import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasfreqComponent } from './preguntasfreq.component';

describe('PreguntasfreqComponent', () => {
  let component: PreguntasfreqComponent;
  let fixture: ComponentFixture<PreguntasfreqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntasfreqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasfreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
