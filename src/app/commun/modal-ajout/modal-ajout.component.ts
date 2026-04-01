import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CatalogueService } from '../catalogue';

@Component({
  selector: 'app-modal-ajout',
  templateUrl: './modal-ajout.component.html',
  styleUrls: ['./modal-ajout.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon
  ]
})
export class ModalAjoutComponent {

  // 'film' ou 'serie' – transmis à l'ouverture de la modal
  @Input() type: 'film' | 'serie' = 'film';

  titre = '';
  annee = '';
  statut = 'a_voir';
  affiche: string | null = null;
  erreur = '';
  saisons = '';
  episodesParSaison = '';

  constructor(private modalCtrl: ModalController, private catalogue: CatalogueService) {
    addIcons({ imageOutline });
  }

  // Ouvre la galerie photo via Capacitor Camera
  async choisirPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      this.affiche = image.dataUrl ?? null;
    } catch {
      // Utilisateur a annulé ou permission refusée
    }
  }

  ajouter() {
    if (!this.titre.trim()) {
      this.erreur = 'Le titre est obligatoire.';
      return;
    }
    this.erreur = '';
    const imageUrl = this.affiche ?? 'assets/poster-placeholder.svg';
    const annee = String(this.annee ?? '').trim();

    if (this.type === 'film') {
      this.catalogue.ajouterFilmManuel(this.titre.trim(), annee, imageUrl, this.statut);
    } else {
      const nbSaisons = parseInt(this.saisons, 10) || 0;
      const nbEpParSaison = parseInt(this.episodesParSaison, 10) || 0;
      this.catalogue.ajouterSerieManuelle(this.titre.trim(), annee, imageUrl, this.statut, nbSaisons, nbEpParSaison);
    }

    this.modalCtrl.dismiss({ ajout: true });
  }

  annuler() {
    this.modalCtrl.dismiss({ ajout: false });
  }
}
