import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategoryFormComponent } from '@item/item-category-form/item-category-form.component';

describe('ItemCategoryFormComponent', () => {
  let component: ItemCategoryFormComponent;
  let fixture: ComponentFixture<ItemCategoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCategoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
