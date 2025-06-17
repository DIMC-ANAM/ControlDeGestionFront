import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarTurnadosComponent } from './consultar-turnados.component';

describe('ConsultarTurnadosComponent', () => {
  let component: ConsultarTurnadosComponent;
  let fixture: ComponentFixture<ConsultarTurnadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarTurnadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarTurnadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
