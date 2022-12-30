import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockmoveComponent } from './stockmove.component';

describe('StockmoveComponent', () => {
  let component: StockmoveComponent;
  let fixture: ComponentFixture<StockmoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockmoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockmoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
