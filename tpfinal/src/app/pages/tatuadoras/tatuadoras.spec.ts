import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tatuadoras } from './tatuadoras';

describe('Tatuadoras', () => {
  let component: Tatuadoras;
  let fixture: ComponentFixture<Tatuadoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tatuadoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tatuadoras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
