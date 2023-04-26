import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSettingsComponent } from './acc-settings.component';

describe('AccSettingsComponent', () => {
  let component: AccSettingsComponent;
  let fixture: ComponentFixture<AccSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
