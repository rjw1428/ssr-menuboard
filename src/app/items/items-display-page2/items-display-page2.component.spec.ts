import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsDisplayPage2Component } from './items-display-page2.component';

describe('ItemsDisplayPage2Component', () => {
  let component: ItemsDisplayPage2Component;
  let fixture: ComponentFixture<ItemsDisplayPage2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsDisplayPage2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsDisplayPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
