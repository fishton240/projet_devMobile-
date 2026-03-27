import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonBackButton,
  IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, playCircleOutline, bookmarkOutline } from 'ionicons/icons';
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
    IonButton, IonIcon
  ]
})
export class FilmsDetailPage implements OnInit {

  film?: UnFilm;

  constructor(
    private route: ActivatedRoute,
    public catalogue: CatalogueService,
    private location: Location
  ) {
    addIcons({ checkmarkCircleOutline, playCircleOutline, bookmarkOutline });
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.film = this.catalogue.listeFilms.find(f => f.id === id);
  }

  changerStatut(statut: string) {
    if (this.film) {
      this.catalogue.changerStatut(this.film.id, statut, 'movie');
      this.film.statut = statut;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/poster-placeholder.svg';
  }
}
