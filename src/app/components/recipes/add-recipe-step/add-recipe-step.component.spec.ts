import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeStepComponent } from './add-recipe-step.component';

describe('AddRecipeStepComponent', () => {
  let component: AddRecipeStepComponent;
  let fixture: ComponentFixture<AddRecipeStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecipeStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecipeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
