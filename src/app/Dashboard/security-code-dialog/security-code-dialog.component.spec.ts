import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCodeDialogComponent } from './security-code-dialog.component';

describe('SecurityCodeDialogComponent', () => {
  let component: SecurityCodeDialogComponent;
  let fixture: ComponentFixture<SecurityCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityCodeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
