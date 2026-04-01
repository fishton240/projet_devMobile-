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
  private cleApiOmdb = 'e9838a82';

  // TVMaze (pas de clé)
  private tvmazeBaseUrl = 'https://api.tvmaze.com';

  // Listes personnelles
  listeFilms: UnFilm[] = [];
  listeSeries: UneSerie[] = [];

  chargementFilms = false;
  chargementSeries = false;

  constructor(private http: HttpClient) {
    // L'application démarre vide – utiliser chargerDonneesDemo() pour pré-remplir
  }

  // Vide toutes les listes
  toutVider() {
    this.listeFilms = [];
    this.listeSeries = [];
  }

  // Charge les données de démonstration (appelle les initialisations par défaut)
  chargerDonneesDemo() {
    this.chargementFilms = true;
    this.chargementSeries = true;
    this.initialiserFilmsDefaut();
    this.initialiserSeriesDefaut();
  }

  // Ajoute un film sans API (saisie manuelle)
  ajouterFilmManuel(titre: string, annee: string, affiche: string, statut: string) {
    const id = 'manuel_' + Date.now();
    this.listeFilms.push(new UnFilm({
      _id: id,
      _titre: titre,
      _description: '',
      _annee: annee || '–',
      _affiche: affiche,
      _statut: statut
    }));
  }

  // Ajoute une série sans API (saisie manuelle)
  ajouterSerieManuelle(titre: string, annee: string, affiche: string, statut: string, nbSaisons = 0, nbEpParSaison = 0) {
    const id = Date.now();
    const episodesParSaison = nbSaisons > 0 && nbEpParSaison > 0
      ? Array(nbSaisons).fill(nbEpParSaison)
      : [];
    this.listeSeries.push(new UneSerie({
      _id: id,
      _titre: titre,
      _description: '',
      _annee: annee || '–',
      _affiche: affiche,
      _statut: statut,
      _saisons: nbSaisons,
      _episodesParSaison: episodesParSaison,
      _saisonActuelle: 0,
      _episodeActuel: 0,
      _episodesTotal: nbSaisons * nbEpParSaison
    }));
  }

  // ========== PARTIE FILMS (OMDb) ==========

  private initialiserFilmsDefaut() {
    const filmsDefaut = [
      { imdbId: 'tt2582802', statut: 'en_cours' },
      { imdbId: 'tt10731256', statut: 'en_cours' },
      { imdbId: 'tt0076759', statut: 'a_voir' },
      { imdbId: 'tt0137523', statut: 'a_voir' },
      { imdbId: 'tt0816692', statut: 'a_voir' },
      { imdbId: 'tt0468569', statut: 'vu' },
      { imdbId: 'tt0110912', statut: 'vu' },
    ];

    const requetes = filmsDefaut.map(f =>
      this.http
        .get<any>(`https://www.omdbapi.com/?apikey=${this.cleApiOmdb}&i=${f.imdbId}&plot=short`)
        .pipe(map(data => ({ data, statut: f.statut, imdbId: f.imdbId })))
    );

    forkJoin(requetes).subscribe(resultats => {
      resultats.forEach((r) => {
        if (r.data.Response === 'True') {
          this.listeFilms.push(new UnFilm({
            _id: r.imdbId,
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

  getDetails(imdbId: string) {
    const url = `https://www.omdbapi.com/?apikey=${this.cleApiOmdb}&i=${imdbId}&plot=full`;
    return this.http.get<any>(url);
  }

  // Supprimer un film par son ID (IMDb ID)
  supprimerFilm(id: string) {
    const index = this.listeFilms.findIndex(f => f.id === id);
    if (index !== -1) {
      this.listeFilms.splice(index, 1);
    }
  }

  // ========== PARTIE SÉRIES (TVMaze) ==========

  rechercherSeries(titre: string) {
    const url = `${this.tvmazeBaseUrl}/search/shows?q=${encodeURIComponent(titre)}`;
    return this.http.get<any[]>(url);
  }

  getSerieDetails(tvmazeId: number) {
    const url = `${this.tvmazeBaseUrl}/shows/${tvmazeId}?embed=episodes`;
    return this.http.get<any>(url);
  }

  // Vérifier si une série existe déjà dans la liste
  private serieExiste(tvmazeId: number): boolean {
    return this.listeSeries.some(s => s.id === tvmazeId);
  }

  // Initialiser les séries par défaut avec les IDs TVMaze
  private initialiserSeriesDefaut() {
    const seriesDefaut = [
      { tvmazeId: 169, statut: 'en_cours', saisonActuelle: 2, episodeActuel: 5 },     // Breaking Bad
      { tvmazeId: 82, statut: 'en_cours', saisonActuelle: 3, episodeActuel: 4 },      // Game of Thrones
      { tvmazeId: 2993, statut: 'a_voir', saisonActuelle: 0, episodeActuel: 0 },      // Stranger Things
      { tvmazeId: 216, statut: 'a_voir', saisonActuelle: 0, episodeActuel: 0 },       // Rick and Morty
      { tvmazeId: 526, statut: 'vu', saisonActuelle: 9, episodeActuel: 24 },          // The Office
    ];

    let requetesTerminees = 0;
    const totalRequetes = seriesDefaut.length;

    seriesDefaut.forEach((serieDefaut) => {
      this.getSerieDetails(serieDefaut.tvmazeId).subscribe((data: any) => {
        if (data && !this.serieExiste(serieDefaut.tvmazeId)) {
          const episodesParSaison: number[] = [];
          let episodesTotal = 0;

          if (data._embedded?.episodes) {
            const episodes = data._embedded.episodes;
            episodes.forEach((ep: any) => {
              const saison = ep.season;
              if (!episodesParSaison[saison - 1]) {
                episodesParSaison[saison - 1] = 0;
              }
              episodesParSaison[saison - 1]++;
              episodesTotal++;
            });
          }

          const nouvelleSerie = new UneSerie({
            _id: serieDefaut.tvmazeId,  // Utiliser l'ID TVMaze comme ID unique
            _titre: data.name,
            _description: data.summary?.replace(/<[^>]*>/g, '') || 'Synopsis non disponible',
            _annee: data.premiered?.substring(0, 4) || 'N/A',
            _affiche: data.image?.medium || 'assets/poster-placeholder.svg',
            _statut: serieDefaut.statut,
            _saisons: episodesParSaison.length,
            _episodesParSaison: episodesParSaison,
            _saisonActuelle: serieDefaut.saisonActuelle,
            _episodeActuel: serieDefaut.episodeActuel,
            _episodesTotal: episodesTotal
          });
          this.listeSeries.push(nouvelleSerie);
        }

        requetesTerminees++;
        if (requetesTerminees === totalRequetes) {
          this.chargementSeries = false;
        }
      });
    });
  }

  // Ajouter une série (appelé depuis recherche-detail)
  ajouterSerie(tvmazeId: number, statutInitial: string) {
    // Vérifier si la série existe déjà
    if (this.serieExiste(tvmazeId)) {
      console.log('Série déjà présente dans la liste');
      return;
    }

    this.getSerieDetails(tvmazeId).subscribe((data: any) => {
      if (data) {
        const episodesParSaison: number[] = [];
        let episodesTotal = 0;

        if (data._embedded?.episodes) {
          const episodes = data._embedded.episodes;
          episodes.forEach((ep: any) => {
            const saison = ep.season;
            if (!episodesParSaison[saison - 1]) {
              episodesParSaison[saison - 1] = 0;
            }
            episodesParSaison[saison - 1]++;
            episodesTotal++;
          });
        }

        const nouvelleSerie = new UneSerie({
          _id: tvmazeId,  // Utiliser l'ID TVMaze comme ID unique
          _titre: data.name,
          _description: data.summary?.replace(/<[^>]*>/g, '') || 'Synopsis non disponible',
          _annee: data.premiered?.substring(0, 4) || 'N/A',
          _affiche: data.image?.medium || 'assets/poster-placeholder.svg',
          _statut: statutInitial,
          _saisons: episodesParSaison.length,
          _episodesParSaison: episodesParSaison,
          _saisonActuelle: statutInitial === 'en_cours' ? 1 : 0,
          _episodeActuel: statutInitial === 'en_cours' ? 1 : 0,
          _episodesTotal: episodesTotal
        });
        this.listeSeries.push(nouvelleSerie);
      }
    });
  }

  // ========== MÉTHODES COMMUNES ==========

  rechercher(titre: string, type: string) {
    if (type === 'movie') {
      const url = `https://www.omdbapi.com/?apikey=${this.cleApiOmdb}&s=${titre}&type=movie`;
      return this.http.get<any>(url);
    } else {
      return this.rechercherSeries(titre);
    }
  }

  ajouter(item: any, type: string) {
    if (type === 'movie') {
      // Vérifier si le film existe déjà
      const existeDeja = this.listeFilms.some(f => f.id === item._id);
      if (!existeDeja) {
        this.listeFilms.push(new UnFilm(item));
      }
    } else if (type === 'series') {
      this.ajouterSerie(item.tvmazeId, item.statut);
    }
  }

  changerStatut(id: string | number, statut: string, type: string) {
    if (type === 'movie') {
      const item = this.listeFilms.find(f => f.id === id);
      if (item) item.statut = statut;
    } else {
      const item = this.listeSeries.find(s => s.id === id);
      if (item) item.statut = statut;
    }
  }

  supprimerSerie(id: number) {
    const index = this.listeSeries.findIndex(s => s.id === id);
    if (index !== -1) {
      this.listeSeries.splice(index, 1);
    }
  }

  changerProgressionSerie(id: number, increment: boolean) {
    const serie = this.listeSeries.find(s => s.id === id);
    if (serie && serie.statut === 'en_cours') {
      let termine = false;

      if (increment) {
        termine = serie.incrementEpisode();
      } else {
        serie.decrementEpisode();
      }

      if (termine || (serie.saisonActuelle === serie.saisons &&
        serie.episodeActuel === serie.episodesDansSaisonActuelle)) {
        serie.statut = 'vu';
      }
    }
  }
}
