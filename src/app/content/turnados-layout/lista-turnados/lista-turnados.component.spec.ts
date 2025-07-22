import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTurnadosComponent } from './lista-turnados.component';

describe('ListaTurnadosComponent', () => {
  let component: ListaTurnadosComponent;
  let fixture: ComponentFixture<ListaTurnadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaTurnadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTurnadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
