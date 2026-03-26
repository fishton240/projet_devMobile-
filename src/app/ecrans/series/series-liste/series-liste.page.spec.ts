import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesListePage } from './series-liste.page';

describe('SeriesListePage', () => {
  let component: SeriesListePage;
  let fixture: ComponentFixture<SeriesListePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesListePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
