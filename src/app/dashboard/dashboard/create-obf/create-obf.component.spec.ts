import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOBFComponent } from './create-obf.component';

describe('CreateOBFComponent', () => {
  let component: CreateOBFComponent;
  let fixture: ComponentFixture<CreateOBFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOBFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOBFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
