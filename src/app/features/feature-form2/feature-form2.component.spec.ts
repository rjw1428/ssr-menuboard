import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureForm2Component } from './feature-form2.component';

describe('FeatureForm2Component', () => {
  let component: FeatureForm2Component;
  let fixture: ComponentFixture<FeatureForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureForm2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
