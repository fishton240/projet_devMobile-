import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmsListePage } from './films-liste.page';

describe('FilmsListePage', () => {
  let component: FilmsListePage;
  let fixture: ComponentFixture<FilmsListePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmsListePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
