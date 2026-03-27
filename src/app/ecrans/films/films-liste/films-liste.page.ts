import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent,
  IonBadge, IonSpinner
} from '@ionic/angular/standalone';
import { CatalogueService } from '../../../commun/catalogue';
import { UnFilm } from '../../../commun/un-film';

@Component({
  selector: 'app-films-liste',
  templateUrl: './films-liste.page.html',
  styleUrls: ['./films-liste.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardContent,
    IonBadge, IonSpinner
  ]
})
export class FilmsListePage implements AfterViewInit, OnDestroy {

  @ViewChild('filmsContent') filmsContentEl!: ElementRef<HTMLElement>;

  filtreActif = 'tous';

  // Scroll : l'overlay d'ion-tabs bloque les wheel events, on intercepte au niveau document
  private readonly handleWheel = (e: WheelEvent) => {
    const el = this.filmsContentEl?.nativeElement;
    if (el) {
      el.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  // Clics : même overlay bloque les clics, on cherche la carte sous le curseur
  private readonly handleClick = (e: MouseEvent) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // Filtres
    if (elements.some(el => el.classList?.contains('filtre-tous')))     { this.filtreActif = 'tous'; return; }
    if (elements.some(el => el.classList?.contains('filtre-en-cours'))) { this.filtreActif = 'en_cours'; return; }
    if (elements.some(el => el.classList?.contains('filtre-a-voir')))   { this.filtreActif = 'a_voir'; return; }
    if (elements.some(el => el.classList?.contains('filtre-vu')))       { this.filtreActif = 'vu'; return; }

    // Clic sur une carte film
    for (const el of elements) {
      if (el.hasAttribute('data-id')) {
        const id = el.getAttribute('data-id');
        if (id) this.router.navigate(['/films-detail', +id]);
        break;
      }
    }
  };

  constructor(public catalogue: CatalogueService, private router: Router) {}

  ngAfterViewInit() {
    document.addEventListener('wheel', this.handleWheel, { passive: false });
    document.addEventListener('click', this.handleClick, true); // capture phase
  }

  ngOnDestroy() {
    document.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('click', this.handleClick, true);
  }

  get filmsFiltres(): UnFilm[] {
    if (this.filtreActif === 'tous') return this.catalogue.listeFilms;
    return this.catalogue.listeFilms.filter(f => f.statut === this.filtreActif);
  }

  couleurStatut(statut: string): string {
    switch (statut) {
      case 'vu':       return 'success';
      case 'en_cours': return 'warning';
      case 'a_voir':   return 'primary';
      default:         return 'primary';
    }
  }

  labelStatut(statut: string): string {
    switch (statut) {
      case 'vu':       return 'Vu';
      case 'en_cours': return 'En cours';
      case 'a_voir':   return 'À voir';
      default:         return statut;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/poster-placeholder.svg';
  }
}
