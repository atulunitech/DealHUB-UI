import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OBFSummaryComponent } from '../OBFSummary/OBFSummary.component';

describe('OBFSummaryComponent', () => {
  let component: OBFSummaryComponent;
  let fixture: ComponentFixture<OBFSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OBFSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OBFSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
