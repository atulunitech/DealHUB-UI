import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatobfComponent } from './creatobf.component';

describe('CreatobfComponent', () => {
  let component: CreatobfComponent;
  let fixture: ComponentFixture<CreatobfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatobfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatobfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
