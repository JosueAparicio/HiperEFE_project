import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsMuseumComponent } from './assets-museum.component';

describe('AssetsMuseumComponent', () => {
  let component: AssetsMuseumComponent;
  let fixture: ComponentFixture<AssetsMuseumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsMuseumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
