import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { UnFilm } from './un-film';
import { UneSerie } from './une-serie';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  // Clé API OMDb
  private cleApi = 'e9838a82';

  // Listes personnelles de l'utilisateur
  listeFilms: UnFilm[] = [];
  listeSeries: UneSerie[] = [];

  // Indique si les données initiales sont en cours de chargement
  chargementFilms = true;

  constructor(private http: HttpClient) {
    this.initialiserFilmsDefaut();
  }

  // Charge les films par défaut depuis l'API OMDb au démarrage
  private initialiserFilmsDefaut() {
    const filmsDefaut = [
      { imdbId: 'tt2582802', statut: 'en_cours' },   // Whiplash
      { imdbId: 'tt10731256', statut: 'en_cours' },  // Don't Worry Darling
      { imdbId: 'tt0076759', statut: 'a_voir' },     // Star Wars
      { imdbId: 'tt0137523', statut: 'a_voir' },     // Fight Club
      { imdbId: 'tt0816692', statut: 'a_voir' },     // Interstellar
      { imdbId: 'tt0468569', statut: 'vu' },         // The Dark Knight
      { imdbId: 'tt0110912', statut: 'vu' },         // Pulp Fiction
    ];

    const requetes = filmsDefaut.map(f =>
      this.http
        .get<any>(`https://www.omdbapi.com/?apikey=${this.cleApi}&i=${f.imdbId}&plot=short`)
        .pipe(map(data => ({ data, statut: f.statut })))
    );

    forkJoin(requetes).subscribe(resultats => {
      resultats.forEach((r, index) => {
        if (r.data.Response === 'True') {
          this.listeFilms.push(new UnFilm({
            _id: index + 1,
            _titre: r.data.Title,
            _description: r.data.Plot,
            _annee: r.data.Year,
            _affiche: r.data.Poster,
            _statut: r.statut
          }));
        }
      });
      this.chargementFilms = false;
    });
  }

  // Rechercher via l'API OMDb
  // type = 'movie' pour films, 'series' pour séries
  rechercher(titre: string, type: string) {
    const url = `https://www.omdbapi.com/?apikey=${this.cleApi}&s=${titre}&type=${type}`;
    return this.http.get<any>(url);
  }

  // Ajouter un élément à la liste
  ajouter(item: any, type: string) {
    if (type === 'movie') {
      this.listeFilms.push(new UnFilm(item));
    } else {
      this.listeSeries.push(new UneSerie(item));
    }
  }

  // Changer le statut : 'vu', 'en_cours', 'a_voir'
  changerStatut(id: number, statut: string, type: string) {
    const liste = type === 'movie' ? this.listeFilms : this.listeSeries;
    const item = liste.find(i => i.id === id);
    if (item) item.statut = statut;
  }
}
