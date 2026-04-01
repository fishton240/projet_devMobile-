import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe, SlicePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  playCircleOutline,
  bookmarkOutline,
  trashOutline,
  checkmarkCircle
} from 'ionicons/icons';
import { CatalogueService } from '../../../commun/catalogue';
import { UnFilm } from '../../../commun/un-film';

@Component({
  selector: 'app-films-detail',
  templateUrl: './films-detail.page.html',
  styleUrls: ['./films-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton,
    IonIcon,
    UpperCasePipe, SlicePipe
  ]
})
export class FilmsDetailPage implements OnInit {

  film?: UnFilm;
  messageConfirmation = '';

  constructor(
    private route: ActivatedRoute,
    public catalogue: CatalogueService,
    private location: Location
  ) {
    addIcons({
      checkmarkCircleOutline,
      playCircleOutline,
      bookmarkOutline,
      trashOutline,
      checkmarkCircle
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.film = this.catalogue.listeFilms.find(f => f.id === id);
  }

  changerStatut(statut: string) {
    if (this.film) {
      this.catalogue.changerStatut(this.film.id, statut, 'movie');
      this.film.statut = statut;

      this.messageConfirmation = `Statut changé en "${this.getStatutLabel(statut)}"`;
      setTimeout(() => {
        this.messageConfirmation = '';
      }, 2000);
    }
  }

  supprimer() {
    if (this.film) {
      const index = this.catalogue.listeFilms.findIndex(f => f.id === this.film!.id);
      if (index !== -1) {
        this.catalogue.listeFilms.splice(index, 1);
        this.messageConfirmation = `"${this.film.titre}" a été retiré de votre liste`;

        setTimeout(() => {
          this.messageConfirmation = '';
          this.location.back();
        }, 1500);
      }
    }
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
