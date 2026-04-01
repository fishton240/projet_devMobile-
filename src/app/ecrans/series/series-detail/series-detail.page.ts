import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { UneSerie } from '../../../commun/une-serie';

@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.page.html',
  styleUrls: ['./series-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton,
    IonIcon
  ]
})
export class SeriesDetailPage implements OnInit {

  serie?: UneSerie;
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
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.serie = this.catalogue.listeSeries.find(s => s.id === id);
  }

  changerStatut(statut: string) {
    if (this.serie) {
      this.catalogue.changerStatut(this.serie.id, statut, 'series');
      this.serie.statut = statut;

      this.messageConfirmation = `Statut changé en "${this.getStatutLabel(statut)}"`;
      setTimeout(() => {
        this.messageConfirmation = '';
      }, 2000);
    }
  }

  supprimer() {
    if (this.serie) {
      const idASupprimer = this.serie.id;
      this.catalogue.supprimerSerie(idASupprimer);
      this.messageConfirmation = `"${this.serie.titre}" a été retiré de votre liste`;

      setTimeout(() => {
        this.messageConfirmation = '';
        this.location.back();
      }, 1500);
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
