import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, chevronForwardOutline } from 'ionicons/icons';
import { CatalogueService } from '../../commun/catalogue';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.page.html',
  styleUrls: ['./recherche.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon]
})
export class RecherchePage implements AfterViewInit, OnDestroy {

  rechercheTitre = '';
  typeRecherche: 'movie' | 'series' = 'movie';
  resultats: any[] = [];
  chargement = false;
  messageErreur = '';

  private readonly handleClick = (e: MouseEvent) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // Toggle film / série
    if (elements.some(el => el.classList?.contains('toggle-film'))) {
      this.typeRecherche = 'movie'; return;
    }
    if (elements.some(el => el.classList?.contains('toggle-serie'))) {
      this.typeRecherche = 'series'; return;
    }

    // Bouton rechercher
    if (elements.some(el => el.classList?.contains('btn-rechercher'))) {
      this.lancerRecherche(); return;
    }

    // Clic sur l'input → focus
    if (elements.some(el => el.classList?.contains('search-input'))) {
      (document.querySelector('.search-input') as HTMLInputElement)?.focus();
      return;
    }

    // Clic sur une carte résultat → naviguer vers le détail
    const carteEl = elements.find(el =>
      el.classList?.contains('resultat-card') ||
      el.classList?.contains('resultat-poster') ||
      el.classList?.contains('resultat-infos') ||
      el.classList?.contains('resultat-titre') ||
      el.classList?.contains('resultat-annee')
    );
    if (carteEl) {
      const toutesLesCartes = Array.from(document.querySelectorAll('.resultat-card'));
      const carte = (carteEl.classList?.contains('resultat-card') ? carteEl : carteEl.closest('.resultat-card')) as HTMLElement;
      const index = toutesLesCartes.indexOf(carte);
      if (index >= 0 && this.resultats[index]) {
        const item = this.resultats[index];
        this.router.navigate(['/recherche-detail', item.imdbID, this.typeRecherche]);
      }
    }
  };

  constructor(public catalogue: CatalogueService, private router: Router) {
    addIcons({ searchOutline, chevronForwardOutline });
  }

  ngAfterViewInit() {
    document.addEventListener('click', this.handleClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClick, true);
  }

  lancerRecherche() {
    const titre = this.rechercheTitre.trim();
    if (!titre) return;
    this.chargement = true;
    this.messageErreur = '';
    this.resultats = [];

    this.catalogue.rechercher(titre, this.typeRecherche).subscribe({
      next: (data: any) => {
        this.chargement = false;
        if (data.Response === 'True') {
          this.resultats = data.Search;
        } else {
          this.messageErreur = 'Aucun résultat trouvé.';
        }
      },
      error: () => {
        this.chargement = false;
        this.messageErreur = 'Erreur lors de la recherche.';
      }
    });
  }
}
