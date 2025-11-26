import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoDetails } from './turno-details';

describe('TurnoDetails', () => {
  let component: TurnoDetails;
  let fixture: ComponentFixture<TurnoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
