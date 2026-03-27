import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, checkmarkCircle } from 'ionicons/icons';
import { CatalogueService } from '../../commun/catalogue';
import { UnFilm } from '../../commun/un-film';
import { UneSerie } from '../../commun/une-serie';

@Component({
  selector: 'app-recherche-detail',
  templateUrl: './recherche-detail.page.html',
  styleUrls: ['./recherche-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonSpinner, IonIcon]
})
export class RechercheDetailPage implements OnInit {

  imdbId = '';
  type: 'movie' | 'series' = 'movie';
  data: any = null;
  chargement = true;
  statutChoisi = 'a_voir';
  dejaAjoute = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient,
    public catalogue: CatalogueService
  ) {
    addIcons({ star, checkmarkCircle });
  }

  ngOnInit() {
    this.imdbId = this.route.snapshot.paramMap.get('imdbId') ?? '';
    this.type = (this.route.snapshot.paramMap.get('type') ?? 'movie') as 'movie' | 'series';
    this.verifierDejaAjoute();
    this.chargerDetails();
  }

  chargerDetails() {
    this.http.get<any>(`https://www.omdbapi.com/?apikey=e9838a82&i=${this.imdbId}&plot=full`)
      .subscribe({
        next: (res) => { this.data = res; this.chargement = false; },
        error: () => { this.chargement = false; }
      });
  }

  verifierDejaAjoute() {
    if (this.type === 'movie') {
      this.dejaAjoute = this.catalogue.listeFilms.some(f => f.affiche?.includes(this.imdbId));
    } else {
      this.dejaAjoute = this.catalogue.listeSeries.some(s => s.affiche?.includes(this.imdbId));
    }
  }

  choisirStatut(statut: string) {
    this.statutChoisi = statut;
  }

  ajouter() {
    if (!this.data || this.dejaAjoute) return;

    if (this.type === 'movie') {
      const id = this.catalogue.listeFilms.length + 1;
      this.catalogue.listeFilms.unshift(new UnFilm({
        _id: id,
        _titre: this.data.Title,
        _description: this.data.Plot,
        _annee: this.data.Year,
        _affiche: this.data.Poster !== 'N/A' ? this.data.Poster : '',
        _statut: this.statutChoisi
      }));
    } else {
      const id = this.catalogue.listeSeries.length + 1;
      this.catalogue.listeSeries.unshift(new UneSerie({
        _id: id,
        _titre: this.data.Title,
        _description: this.data.Plot,
        _annee: this.data.Year,
        _affiche: this.data.Poster !== 'N/A' ? this.data.Poster : '',
        _statut: this.statutChoisi,
        _saisons: parseInt(this.data.totalSeasons) || 0
      }));
    }

    this.dejaAjoute = true;
    this.location.back();
  }

  couleurStatut(statut: string): string {
    if (statut === 'vu') return '#4CAF50';
    if (statut === 'en_cours') return 'orange';
    return '#2196F3';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/poster-placeholder.svg';
  }
}
