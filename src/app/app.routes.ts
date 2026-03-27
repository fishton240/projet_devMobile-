import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'accueil',
    loadComponent: () => import('./ecrans/accueil/accueil.page').then( m => m.AccueilPage)
  },
  {
    path: 'series-liste',
    loadComponent: () => import('./ecrans/series/series-liste/series-liste.page').then( m => m.SeriesListePage)
  },
  {
    path: 'series-detail',
    loadComponent: () => import('./ecrans/series/series-detail/series-detail.page').then( m => m.SeriesDetailPage)
  },
  {
    path: 'films-liste',
    loadComponent: () => import('./ecrans/films/films-liste/films-liste.page').then( m => m.FilmsListePage)
  },
  {
    path: 'films-detail/:id',
    loadComponent: () => import('./ecrans/films/films-detail/films-detail.page').then( m => m.FilmsDetailPage)
  },
  {
    path: 'recherche',
    loadComponent: () => import('./ecrans/recherche/recherche.page').then( m => m.RecherchePage)
  },  {
    path: 'recherche-detail/:imdbId/:type',
    loadComponent: () => import('./ecrans/recherche-detail/recherche-detail.page').then( m => m.RechercheDetailPage)
  },

];
