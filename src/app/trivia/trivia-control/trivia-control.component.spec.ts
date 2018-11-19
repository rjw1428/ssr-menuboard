import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaControlComponent } from './trivia-control.component';

describe('TriviaControlComponent', () => {
  let component: TriviaControlComponent;
  let fixture: ComponentFixture<TriviaControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriviaControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
