import { Injectable } from '@angular/core';

export enum EstadoAsunto {
  Registrado = 'Registrado',
  EnCurso = 'En curso',
  Concluido = 'Concluido'
}

export enum PrioridadAsunto {
  Alta = 'Alta',
  Media = 'Media',
  Baja = 'Baja'
}

@Injectable({
  providedIn: 'root'
})
export class ColorsEnum {
  private readonly estadoStyles: Record<EstadoAsunto, { icon: string; colorClass: string }> = {
    [EstadoAsunto.Registrado]: {
      icon: 'fas fa-file',
      colorClass: 'bg-deep-blue text-white'
    },
    [EstadoAsunto.EnCurso]: {
      icon: 'fas fa-clock',
      colorClass: 'bg-purple text-white'
    },
    [EstadoAsunto.Concluido]: {
      icon: 'fas fa-check',
      colorClass: 'bg-success text-white'
    }
  };

  private readonly prioridadStyles: Record<PrioridadAsunto, { colorClass: string }> = {
    [PrioridadAsunto.Alta]: { colorClass: 'bg-primary text-white' },
    [PrioridadAsunto.Media]: { colorClass: 'bg-gold text-white' },
    [PrioridadAsunto.Baja]: { colorClass: 'bg-secondary text-white' }
  };

  getEstadoIcon(estado: string): string {
    return this.estadoStyles[estado as EstadoAsunto]?.icon || 'x-circle';
  }

  getEstadoColor(estado: string): string {
    return this.estadoStyles[estado as EstadoAsunto]?.colorClass || '';
  }

  getPrioridadColor(prioridad: string): string {
    return this.prioridadStyles[prioridad as PrioridadAsunto]?.colorClass || '';
  }
}