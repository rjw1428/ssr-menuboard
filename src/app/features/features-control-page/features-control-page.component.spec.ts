import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesControlPageComponent } from '@features/features-control-page/features-control-page.component';

describe('FeaturesControlPageComponent', () => {
  let component: FeaturesControlPageComponent;
  let fixture: ComponentFixture<FeaturesControlPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesControlPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesControlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
