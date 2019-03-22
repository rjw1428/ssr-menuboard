import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsDisplayPageVertComponent } from './items-display-page-vert.component';

describe('ItemsDisplayPageVertComponent', () => {
  let component: ItemsDisplayPageVertComponent;
  let fixture: ComponentFixture<ItemsDisplayPageVertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsDisplayPageVertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsDisplayPageVertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
