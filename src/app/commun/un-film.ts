// On définit une classe UnFilm qui représente un film dans l'application
export class UnFilm {

  // Les propriétés sont privées : on ne peut pas y accéder directement de l'extérieur
  // Le "!" signifie qu'on promet à TypeScript que la valeur sera assignée plus tard
  private _id!: number;
  private _titre!: string;
  private _description!: string;
  private _annee!: string;
  private _affiche!: string;
  private _statut!: string; // "vu", "en_cours", "a_voir"

  // Le constructeur reçoit un objet "obj" qui vient de l'API ou du JSON
  // Object.assign copie automatiquement toutes les propriétés de obj dans this
  constructor(obj: any) {
    Object.assign(this, obj);
  }

  // GETTER : permet de lire la valeur de _id depuis l'extérieur
  public get id(): number { return this._id; }
  // SETTER : permet de modifier la valeur de _id depuis l'extérieur
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
}
