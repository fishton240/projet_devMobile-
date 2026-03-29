import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent,
  IonBadge, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playBackOutline, playForwardOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { CatalogueService } from '../../../commun/catalogue';
import { UneSerie } from '../../../commun/une-serie';

@Component({
  selector: 'app-series-liste',
  templateUrl: './series-liste.page.html',
  styleUrls: ['./series-liste.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardContent,
    IonBadge, IonSpinner, IonIcon
  ]
})
export class SeriesListePage implements AfterViewInit, OnDestroy {

  @ViewChild('seriesContent') seriesContentEl!: ElementRef<HTMLElement>;

  filtreActif = 'tous';

  private readonly handleWheel = (e: WheelEvent) => {
    const el = this.seriesContentEl?.nativeElement;
    if (el) {
      el.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  private readonly handleClick = (e: MouseEvent) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // Filtres
    if (elements.some(el => el.classList?.contains('filtre-tous'))) { this.filtreActif = 'tous'; return; }
    if (elements.some(el => el.classList?.contains('filtre-en-cours'))) { this.filtreActif = 'en_cours'; return; }
    if (elements.some(el => el.classList?.contains('filtre-a-voir'))) { this.filtreActif = 'a_voir'; return; }
    if (elements.some(el => el.classList?.contains('filtre-vu'))) { this.filtreActif = 'vu'; return; }

    // Boutons de progression
    if (elements.some(el => el.classList?.contains('btn-prev'))) {
      const btn = elements.find(el => el.classList?.contains('btn-prev'));
      if (btn) {
        const id = btn.getAttribute('data-id');
        if (id) this.catalogue.changerProgressionSerie(+id, false);
      }
      return;
    }

    if (elements.some(el => el.classList?.contains('btn-next'))) {
      const btn = elements.find(el => el.classList?.contains('btn-next'));
      if (btn) {
        const id = btn.getAttribute('data-id');
        if (id) this.catalogue.changerProgressionSerie(+id, true);
      }
      return;
    }

    // Clic sur la partie cliquable (affiche + infos) pour aller au détail
    for (const el of elements) {
      const clickable = el.closest('.serie-clickable');
      if (clickable) {
        const id = clickable.getAttribute('data-id');
        if (id) {
          this.router.navigate(['/series-detail', +id]);
        }
        break;
      }
    }
  };

  constructor(public catalogue: CatalogueService, private router: Router) {
    addIcons({ playBackOutline, playForwardOutline, checkmarkCircleOutline });
  }

  ngAfterViewInit() {
    document.addEventListener('wheel', this.handleWheel, { passive: false });
    document.addEventListener('click', this.handleClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('click', this.handleClick, true);
  }

  get seriesFiltrees(): UneSerie[] {
    if (this.filtreActif === 'tous') return this.catalogue.listeSeries;
    return this.catalogue.listeSeries.filter(s => s.statut === this.filtreActif);
  }

  get seriesEnCours(): UneSerie[] {
    return this.seriesFiltrees.filter(s => s.statut === 'en_cours');
  }

  get seriesAVoir(): UneSerie[] {
    return this.seriesFiltrees.filter(s => s.statut === 'a_voir');
  }

  get seriesVues(): UneSerie[] {
    return this.seriesFiltrees.filter(s => s.statut === 'vu');
  }

  couleurStatut(statut: string): string {
    switch (statut) {
      case 'vu': return 'success';
      case 'en_cours': return 'warning';
      case 'a_voir': return 'primary';
      default: return 'primary';
    }
  }

  labelStatut(statut: string): string {
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
