import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'fechaMexico',
  standalone: false
})
export class FechaMexicoPipe implements PipeTransform {
  transform(value: any, mostrarHora: boolean = false,hora:boolean = false): any {
    if (!value) return '';

    // Se fuerza a tratarlo como fecha local
    const fecha = new Date(value.replace('Z', ''));

    // Si se quiere mostrar solo la hora
    if (hora) {
      return formatDate(fecha, 'HH:mm:ss', 'es-MX');
    }
    const formato = mostrarHora
      ? 'dd-MMM-yyyy HH:mm:ss'
      : 'dd-MMM-yyyy';

    return formatDate(fecha, formato, 'es-MX');
  }
}