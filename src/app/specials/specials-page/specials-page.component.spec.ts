import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialsPageComponent } from '@specials/specials-page/specials-page.component';

describe('SpecialsPageComponent', () => {
  let component: SpecialsPageComponent;
  let fixture: ComponentFixture<SpecialsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
