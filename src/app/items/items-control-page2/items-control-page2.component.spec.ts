import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsControlPage2Component } from './items-control-page2.component';

describe('ItemsControlPage2Component', () => {
  let component: ItemsControlPage2Component;
  let fixture: ComponentFixture<ItemsControlPage2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsControlPage2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsControlPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
