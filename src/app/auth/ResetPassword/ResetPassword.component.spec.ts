import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassword } from './ResetPassword.component';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPassword ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
