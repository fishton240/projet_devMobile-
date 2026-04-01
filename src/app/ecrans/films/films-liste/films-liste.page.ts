import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonTitle, IonToolbar, IonButtons,
  IonBadge, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, addOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { CatalogueService } from '../../../commun/catalogue';
import { UnFilm } from '../../../commun/un-film';
import { StatutFilmPipe } from '../../../commun/pipes/statut-film.pipe';
import { ModalAjoutComponent } from '../../../commun/modal-ajout/modal-ajout.component';

@Component({
  selector: 'app-films-liste',
  templateUrl: './films-liste.page.html',
  styleUrls: ['./films-liste.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonTitle, IonToolbar, IonButtons,
    IonBadge, IonSpinner, IonIcon,
    StatutFilmPipe
  ]
})
export class FilmsListePage implements AfterViewInit, OnDestroy {

  @ViewChild('filmsContent') filmsContentEl!: ElementRef<HTMLElement>;

  filtreActif = 'tous';

  // Scroll : l'overlay d'ion-tabs bloque les wheel events, on intercepte au niveau document
  private readonly handleWheel = (e: WheelEvent) => {
    const el = this.filmsContentEl?.nativeElement;
    // N'intercepte le scroll que si cette page est visible (pas masquée par les tabs)
    if (el && !el.closest('.ion-page-hidden')) {
      el.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  private readonly handleClick = (e: MouseEvent) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // Bouton d'ajout manuel (uniquement sur la page films)
    if (elements.some(el => el.classList?.contains('btn-ajout-film'))) {
      this.ouvrirModalAjout();
      return;
    }

    // Filtres
    if (elements.some(el => el.classList?.contains('filtre-tous'))) {
      this.filtreActif = 'tous';
      return;
    }
    if (elements.some(el => el.classList?.contains('filtre-en-cours'))) {
      this.filtreActif = 'en_cours';
      return;
    }
    if (elements.some(el => el.classList?.contains('filtre-a-voir'))) {
      this.filtreActif = 'a_voir';
      return;
    }
    if (elements.some(el => el.classList?.contains('filtre-vu'))) {
      this.filtreActif = 'vu';
      return;
    }

    // Clic sur la partie cliquable pour aller au détail
    for (const el of elements) {
      const clickable = el.closest('.film-clickable');
      if (clickable) {
        const id = clickable.getAttribute('data-id');
        if (id) {
          this.router.navigate(['/films-detail', id]);
        }
        break;
      }
    }
  };

  constructor(
    public catalogue: CatalogueService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    addIcons({ checkmarkCircleOutline, addOutline });
  }

  async ouvrirModalAjout() {
    const modal = await this.modalCtrl.create({
      component: ModalAjoutComponent,
      componentProps: { type: 'film' },
      breakpoints: [0, 1],
      initialBreakpoint: 1
    });
    await modal.present();
  }

  ngAfterViewInit() {
    document.addEventListener('wheel', this.handleWheel, { passive: false });
    document.addEventListener('click', this.handleClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('click', this.handleClick, true);
  }

  get filmsEnCours(): UnFilm[] {
    return this.catalogue.listeFilms.filter(f => f.statut === 'en_cours');
  }

  get filmsAVoir(): UnFilm[] {
    return this.catalogue.listeFilms.filter(f => f.statut === 'a_voir');
  }

  get filmsVus(): UnFilm[] {
    return this.catalogue.listeFilms.filter(f => f.statut === 'vu');
  }

  get tousLesFilms(): UnFilm[] {
    return this.catalogue.listeFilms;
  }

  get filmsFiltres(): UnFilm[] {
    if (this.filtreActif === 'tous') {
      return this.tousLesFilms;
    }
    return this.catalogue.listeFilms.filter(f => f.statut === this.filtreActif);
  }

  couleurStatut(statut: string): string {
    switch (statut) {
      case 'vu': return 'success';
      case 'en_cours': return 'warning';
      case 'a_voir': return 'primary';
      default: return 'primary';
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/poster-placeholder.svg';
  }
}
