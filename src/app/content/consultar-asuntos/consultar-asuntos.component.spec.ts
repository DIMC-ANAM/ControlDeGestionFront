import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarAsuntosComponent } from './consultar-asuntos.component';

describe('ConsultarAsuntosComponent', () => {
  let component: ConsultarAsuntosComponent;
  let fixture: ComponentFixture<ConsultarAsuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarAsuntosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarAsuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
