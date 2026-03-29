// une-serie.ts
export class UneSerie {

  private _id!: number;
  private _titre!: string;
  private _description!: string;
  private _annee!: string;
  private _affiche!: string;
  private _statut!: string;

  // Propriétés spécifiques aux séries
  private _saisons!: number;
  private _episodesParSaison: number[] = [];
  private _saisonActuelle!: number;
  private _episodeActuel!: number;
  private _episodesTotal!: number;

  constructor(obj: any) {
    Object.assign(this, obj);

    // Initialiser episodesParSaison si manquant
    if (!this._episodesParSaison || this._episodesParSaison.length === 0) {
      if (this._saisons && this._saisons > 0) {
        // Par défaut, on suppose 10 épisodes par saison
        this._episodesParSaison = Array(this._saisons).fill(10);
        this._episodesTotal = this._saisons * 10;
      } else {
        this._episodesParSaison = [];
        this._episodesTotal = 0;
      }
    } else {
      this._episodesTotal = this._episodesParSaison.reduce((a, b) => a + b, 0);
    }

    // Initialiser saisonActuelle et episodeActuel si manquants
    if (!this._saisonActuelle || this._saisonActuelle === 0) {
      this._saisonActuelle = 1;
    }
    if (!this._episodeActuel || this._episodeActuel === 0) {
      this._episodeActuel = 1;
    }
  }

  public get id(): number { return this._id; }
  public set id(value: number) { this._id = value; }

  public get titre(): string { return this._titre; }
  public set titre(value: string) { this._titre = value; }

  public get description(): string { return this._description; }
  public set description(value: string) { this._description = value; }

  public get annee(): string { return this._annee; }
  public set annee(value: string) { this._annee = value; }

  public get affiche(): string { return this._affiche; }
  public set affiche(value: string) { this._affiche = value; }

  public get statut(): string { return this._statut; }
  public set statut(value: string) { this._statut = value; }

  public get saisons(): number { return this._saisons; }
  public set saisons(value: number) { this._saisons = value; }

  public get episodesParSaison(): number[] { return this._episodesParSaison; }
  public set episodesParSaison(value: number[]) {
    this._episodesParSaison = value;
    this._episodesTotal = this._episodesParSaison.reduce((a, b) => a + b, 0);
  }

  public get saisonActuelle(): number { return this._saisonActuelle; }
  public set saisonActuelle(value: number) { this._saisonActuelle = value; }

  public get episodeActuel(): number { return this._episodeActuel; }
  public set episodeActuel(value: number) { this._episodeActuel = value; }

  public get episodesTotal(): number { return this._episodesTotal; }
  public set episodesTotal(value: number) { this._episodesTotal = value; }

  // Retourne le nombre d'épisodes dans la saison actuelle
  get episodesDansSaisonActuelle(): number {
    if (this._saisonActuelle <= this._episodesParSaison.length) {
      return this._episodesParSaison[this._saisonActuelle - 1];
    }
    return 10; // fallback
  }

  // Calcule le nombre total d'épisodes vus
  get episodesVus(): number {
    let total = 0;
    for (let i = 0; i < this._saisonActuelle - 1; i++) {
      total += this._episodesParSaison[i];
    }
    total += this._episodeActuel;
    return total;
  }

  // Calcule la progression en pourcentage
  get progression(): number {
    if (!this._episodesTotal) return 0;
    return Math.min(100, Math.round((this.episodesVus / this._episodesTotal) * 100));
  }

  // Texte de progression (ex: "S2E5/13" ou "S2E5")
  get episodeTexte(): string {
    if (this._saisonActuelle && this._episodeActuel) {
      const maxEp = this.episodesDansSaisonActuelle;
      return `S${this._saisonActuelle}E${this._episodeActuel}/${maxEp}`;
    }
    return '';
  }

  // Incrémente l'épisode
  incrementEpisode(): boolean {
    const maxEp = this.episodesDansSaisonActuelle;

    if (this._episodeActuel < maxEp) {
      this._episodeActuel++;
      return false; // pas de changement de saison
    } else if (this._saisonActuelle < this._saisons) {
      // Passer à la saison suivante
      this._saisonActuelle++;
      this._episodeActuel = 1;
      return false; // pas encore terminé
    } else {
      // Série terminée
      return true; // terminé
    }
  }

  // Décrémente l'épisode
  decrementEpisode(): boolean {
    if (this._episodeActuel > 1) {
      this._episodeActuel--;
    } else if (this._saisonActuelle > 1) {
      this._saisonActuelle--;
      this._episodeActuel = this.episodesDansSaisonActuelle;
    }
    return false;
  }
}
