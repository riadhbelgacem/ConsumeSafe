import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumeSafeComponent } from './consume-safe.component';

describe('ConsumeSafeComponent', () => {
  let component: ConsumeSafeComponent;
  let fixture: ComponentFixture<ConsumeSafeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumeSafeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumeSafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
