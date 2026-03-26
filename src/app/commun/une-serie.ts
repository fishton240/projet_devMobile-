// On définit une classe UneSerie qui représente une série dans l'application
export class UneSerie {

  // Les propriétés sont privées
  private _id!: number;
  private _titre!: string;
  private _description!: string;
  private _annee!: string;
  private _affiche!: string;
  private _statut!: string; // "vu", "en_cours", "a_voir"
  private _saisons!: number; // nombre de saisons — spécifique aux séries

  // Le constructeur copie automatiquement les données reçues (API ou JSON)
  constructor(obj: any) {
    Object.assign(this, obj);
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

  // Propriété supplémentaire par rapport à UnFilm : le nombre de saisons
  public get saisons(): number { return this._saisons; }
  public set saisons(value: number) { this._saisons = value; }
}
