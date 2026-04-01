import { Pipe, PipeTransform } from '@angular/core';

// Pipe personnalisé qui transforme les codes de statut en libellés lisibles
@Pipe({
  name: 'statutFilm',
  standalone: true
})
export class StatutFilmPipe implements PipeTransform {
  transform(statut: string): string {
    switch (statut) {
      case 'vu':      return 'Vu';
      case 'en_cours': return 'En cours';
      case 'a_voir':  return 'À voir';
      default:        return statut;
    }
  }
}
