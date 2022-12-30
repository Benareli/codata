import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSessionComponent } from './pos-session.component';

describe('PosSessionComponent', () => {
  let component: PosSessionComponent;
  let fixture: ComponentFixture<PosSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
