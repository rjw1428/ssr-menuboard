import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialsControlPageComponent } from './specials-control-page.component';

describe('SpecialsControlPageComponent', () => {
  let component: SpecialsControlPageComponent;
  let fixture: ComponentFixture<SpecialsControlPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialsControlPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialsControlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
