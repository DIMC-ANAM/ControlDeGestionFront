import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAsuntoComponent } from './registro-asunto.component';

describe('RegistroAsuntoComponent', () => {
  let component: RegistroAsuntoComponent;
  let fixture: ComponentFixture<RegistroAsuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroAsuntoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAsuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
