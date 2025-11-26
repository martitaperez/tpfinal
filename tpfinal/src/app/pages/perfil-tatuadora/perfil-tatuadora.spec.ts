import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilTatuadora } from './perfil-tatuadora';

describe('PerfilTatuadora', () => {
  let component: PerfilTatuadora;
  let fixture: ComponentFixture<PerfilTatuadora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilTatuadora]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilTatuadora);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
