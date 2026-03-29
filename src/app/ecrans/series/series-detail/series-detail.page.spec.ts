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
    IonButton, IonIcon
  ]
})
export class SeriesDetailPage implements OnInit {

  serie?: UneSerie;

  constructor(
    private route: ActivatedRoute,
    public catalogue: CatalogueService,
    private location: Location
  ) {
    addIcons({ checkmarkCircleOutline, playCircleOutline, bookmarkOutline });
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.serie = this.catalogue.listeSeries.find(s => s.id === id);
  }

  changerStatut(statut: string) {
    if (this.serie) {
      this.catalogue.changerStatut(this.serie.id, statut, 'series');
      this.serie.statut = statut;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/poster-placeholder.svg';
  }
}
