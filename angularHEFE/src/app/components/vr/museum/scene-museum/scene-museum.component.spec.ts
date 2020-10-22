import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneMuseumComponent } from './scene-museum.component';

describe('SceneMuseumComponent', () => {
  let component: SceneMuseumComponent;
  let fixture: ComponentFixture<SceneMuseumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneMuseumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
