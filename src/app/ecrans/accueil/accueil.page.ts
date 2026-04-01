import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CatalogueService } from '../../commun/catalogue';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonIcon]
})
export class AccueilPage implements AfterViewInit, OnDestroy {

  photo: string | null = null;
  pseudo = 'Utilisateur';
  modeEditionPseudo = false;
  pseudoTemp = '';

  private readonly handleClick = (e: MouseEvent) => {
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    const avatarClasses = ['avatar-wrapper', 'avatar-img', 'avatar-placeholder', 'avatar-initiale', 'avatar-overlay', 'avatar-overlay-icon'];
    if (elements.some(el => avatarClasses.some(cls => el.classList?.contains(cls)))) {
      this.prendrePhoto();
      return;
    }

    if (elements.some(el => el.classList?.contains('edit-btn'))) {
      this.editerPseudo();
      return;
    }

    if (elements.some(el => el.classList?.contains('valider-btn'))) {
      this.validerPseudo();
      return;
    }

    if (elements.some(el => el.classList?.contains('btn-charger-demo'))) {
      this.chargerDemo();
      return;
    }

    if (elements.some(el => el.classList?.contains('btn-tout-vider'))) {
      this.toutVider();
      return;
    }
  };

  constructor(public catalogue: CatalogueService) {
    addIcons({ cameraOutline });
  }

  ngAfterViewInit() {
    document.addEventListener('click', this.handleClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClick, true);
  }

  // ── Stats films ──────────────────────────────────────
  get nbFilmsVus(): number {
    return this.catalogue.listeFilms.filter(f => f.statut === 'vu').length;
  }
  get nbFilmsEnCours(): number {
    return this.catalogue.listeFilms.filter(f => f.statut === 'en_cours').length;
  }
  get nbFilmsAVoir(): number {
    return this.catalogue.listeFilms.filter(f => f.statut === 'a_voir').length;
  }
  get totalFilms(): number {
    return this.catalogue.listeFilms.length;
  }

  // ── Stats séries ─────────────────────────────────────
  get nbSeriesVues(): number {
    return this.catalogue.listeSeries.filter(s => s.statut === 'vu').length;
  }
  get nbSeriesEnCours(): number {
    return this.catalogue.listeSeries.filter(s => s.statut === 'en_cours').length;
  }
  get nbSeriesAVoir(): number {
    return this.catalogue.listeSeries.filter(s => s.statut === 'a_voir').length;
  }
  get totalSeries(): number {
    return this.catalogue.listeSeries.length;
  }

  // ── Pseudo ───────────────────────────────────────────
  editerPseudo() {
    this.pseudoTemp = this.pseudo;
    this.modeEditionPseudo = true;
  }

  validerPseudo() {
    if (this.pseudoTemp.trim()) {
      this.pseudo = this.pseudoTemp.trim();
    }
    this.modeEditionPseudo = false;
  }

  // ── Données de démo ──────────────────────────────────
  chargerDemo() {
    this.catalogue.chargerDonneesDemo();
  }

  toutVider() {
    this.catalogue.toutVider();
  }

  // ── Camera ───────────────────────────────────────────
  async prendrePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      this.photo = image.dataUrl ?? null;
    } catch (err) {
      console.error('[Profil] Camera error:', err);
    }
  }
}
