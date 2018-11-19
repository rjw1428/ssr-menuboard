import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaDisplayComponent } from './trivia-display.component';

describe('TriviaDisplayComponent', () => {
  let component: TriviaDisplayComponent;
  let fixture: ComponentFixture<TriviaDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriviaDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
