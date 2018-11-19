import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialsFormComponent } from './specials-form.component';

describe('SpecialsFormComponent', () => {
  let component: SpecialsFormComponent;
  let fixture: ComponentFixture<SpecialsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
