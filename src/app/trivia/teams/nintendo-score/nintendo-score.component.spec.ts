import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NintendoScoreComponent } from './nintendo-score.component';

describe('NintendoScoreComponent', () => {
  let component: NintendoScoreComponent;
  let fixture: ComponentFixture<NintendoScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NintendoScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NintendoScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
