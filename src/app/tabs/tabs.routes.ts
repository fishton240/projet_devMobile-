import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [

      // Onglet Séries
      {
        path: 'series-liste',
        loadComponent: () =>
          import('../ecrans/series/series-liste/series-liste.page')
            .then(m => m.SeriesListePage)
      },

      // Onglet Films
      {
        path: 'films-liste',
        loadComponent: () =>
          import('../ecrans/films/films-liste/films-liste.page')
            .then(m => m.FilmsListePage)
      },

      // Onglet Explorer (recherche)
      {
        path: 'recherche',
        loadComponent: () =>
          import('../ecrans/recherche/recherche.page')
            .then(m => m.RecherchePage)
      },

      // Onglet Profil (accueil)
      {
        path: 'accueil',
        loadComponent: () =>
          import('../ecrans/accueil/accueil.page')
            .then(m => m.AccueilPage)
      },

      // Par défaut : rediriger vers Séries
      {
        path: '',
        redirectTo: 'series-liste',
        pathMatch: 'full'
      }

    ]
  },
  // Redirection depuis la racine
  {
    path: '',
    redirectTo: '/tabs/series-liste',
    pathMatch: 'full'
  }
];
