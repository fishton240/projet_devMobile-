import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

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
