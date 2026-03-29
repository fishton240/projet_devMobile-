import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton,
  IonButton, IonIcon, IonContent, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkOutline,
  closeOutline,
  checkmarkCircleOutline,
  playCircleOutline,
  bookmarkOutline,
  star,
  starOutline,
  checkmarkCircle,
  filmOutline,
  tvOutline,
  trashOutline
} from 'ionicons/icons';
import { CatalogueService } from '../../commun/catalogue';
import { UnFilm } from '../../commun/un-film';
import { UneSerie } from '../../commun/une-serie';

@Component({
  selector: 'app-recherche-detail',
  templateUrl: './recherche-detail.page.html',
  styleUrls: ['./recherche-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton,
    IonButton, IonIcon, IonContent, IonSpinner
  ]
})
export class RechercheDetailPage implements OnInit {

  data: any = null;
  type: string = '';
  imdbId: string = '';
  chargement = true;
  dejaAjoute = false;
  statutChoisi = 'a_voir';
  messageConfirmation = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public catalogue: CatalogueService
  ) {
    addIcons({
      addOutline,
      checkmarkOutline,
      closeOutline,
      checkmarkCircleOutline,
      playCircleOutline,
      bookmarkOutline,
      star,
      starOutline,
      checkmarkCircle,
      filmOutline,
      tvOutline,
      trashOutline
    });
  }

  ngOnInit() {
    this.imdbId = this.route.snapshot.paramMap.get('imdbId')!;
    this.type = this.route.snapshot.paramMap.get('type')!;

    this.chargerDetails();
  }

  chargerDetails() {
    this.chargement = true;

    if (this.type === 'movie') {
      this.catalogue.getDetails(this.imdbId).subscribe({
        next: (data: any) => {
          this.data = data;
          this.chargement = false;
          this.verifierSiDansListe();
          this.recupererStatutActuel();
        },
        error: () => {
          this.chargement = false;
        }
      });
    } else {
      this.catalogue.getSerieDetails(+this.imdbId).subscribe({
        next: (data: any) => {
          this.data = {
            Title: data.name,
            Year: data.premiered?.substring(0, 4) || 'N/A',
            Runtime: 'N/A',
            Genre: data.genres?.join(', ') || 'N/A',
            Plot: data.summary?.replace(/<[^>]*>/g, '') || 'Synopsis non disponible',
            Poster: data.image?.original || data.image?.medium || 'assets/poster-placeholder.svg',
            imdbRating: data.rating?.average?.toString() || 'N/A',
            totalSeasons: data._embedded?.episodes ?
              Math.max(...data._embedded.episodes.map((e: any) => e.season)) : 1
          };
          this.chargement = false;
          this.verifierSiDansListe();
          // 👈 Récupérer le statut actuel si déjà dans la liste
          this.recupererStatutActuel();
        },
        error: () => {
          this.chargement = false;
        }
      });
    }
  }

  recupererStatutActuel() {
    if (this.type === 'movie') {
      const film = this.catalogue.listeFilms.find(f => f.titre === this.data?.Title);
      if (film) {
        this.statutChoisi = film.statut;
        this.dejaAjoute = true;
      }
    } else {
      const serie = this.catalogue.listeSeries.find(s => s.titre === this.data?.Title);
      if (serie) {
        this.statutChoisi = serie.statut;
        this.dejaAjoute = true;
      }
    }
  }

  verifierSiDansListe() {
    if (this.type === 'movie') {
      this.dejaAjoute = this.catalogue.listeFilms.some(f => f.titre === this.data?.Title);
    } else {
      this.dejaAjoute = this.catalogue.listeSeries.some(s => s.titre === this.data?.Title);
    }
  }

  choisirStatut(statut: string) {
    this.statutChoisi = statut;

    if (this.dejaAjoute) {
      if (this.type === 'movie') {
        const film = this.catalogue.listeFilms.find(f => f.titre === this.data?.Title);
        if (film) {
          film.statut = statut;
          this.messageConfirmation = `Statut changé en "${this.getStatutLabel(statut)}"`;
          setTimeout(() => {
            this.messageConfirmation = '';
          }, 2000);
        }
      } else {
        const serie = this.catalogue.listeSeries.find(s => s.titre === this.data?.Title);
        if (serie) {
          serie.statut = statut;
          this.messageConfirmation = `Statut changé en "${this.getStatutLabel(statut)}"`;
          setTimeout(() => {
            this.messageConfirmation = '';
          }, 2000);
        }
      }
    }
  }

  ajouter() {
    if (this.type === 'movie') {
      const nouveauFilm = {
        _id: this.data.imdbID,
        _titre: this.data.Title,
        _description: this.data.Plot,
        _annee: this.data.Year,
        _affiche: this.data.Poster !== 'N/A' ? this.data.Poster : 'assets/poster-placeholder.svg',
        _statut: this.statutChoisi
      };
      this.catalogue.ajouter(nouveauFilm, 'movie');
    } else {
      this.catalogue.ajouter({
        tvmazeId: +this.imdbId,
        statut: this.statutChoisi
      }, 'series');
    }

    this.messageConfirmation = `"${this.data.Title}" a été ajouté à votre liste (${this.getStatutLabel(this.statutChoisi)})`;
    this.dejaAjoute = true;

    setTimeout(() => {
      this.messageConfirmation = '';
    }, 2000);
  }

  supprimer() {
    if (this.type === 'movie') {
      const index = this.catalogue.listeFilms.findIndex(f => f.titre === this.data.Title);
      if (index !== -1) {
        this.catalogue.listeFilms.splice(index, 1);
      }
    } else {
      const index = this.catalogue.listeSeries.findIndex(s => s.titre === this.data.Title);
      if (index !== -1) {
        this.catalogue.listeSeries.splice(index, 1);
      }
    }
    this.dejaAjoute = false;
    this.messageConfirmation = `"${this.data.Title}" a été supprimé de votre liste`;

    setTimeout(() => {
      this.messageConfirmation = '';
    }, 2000);
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'vu': return 'Vu';
      case 'en_cours': return 'En cours';
      case 'a_voir': return 'À voir';
      default: return statut;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/poster-placeholder.svg';
  }
}
