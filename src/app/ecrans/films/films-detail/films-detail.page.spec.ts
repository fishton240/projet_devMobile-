import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmsDetailPage } from './films-detail.page';

describe('FilmsDetailPage', () => {
  let component: FilmsDetailPage;
  let fixture: ComponentFixture<FilmsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
