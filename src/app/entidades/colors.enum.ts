import { Injectable } from '@angular/core';

export enum EstadoAsunto {
  Pendiente = 'pendiente',
  EnProgreso = 'en_progreso',
  Concluido = 'Concluido'
}

export enum PrioridadAsunto {
  Alta = 'alta',
  Media = 'media',
  Baja = 'baja'
}

@Injectable({
  providedIn: 'root'
})
export class ColorsEnum {
  private readonly estadoStyles: Record<EstadoAsunto, { icon: string; colorClass: string }> = {
    [EstadoAsunto.Pendiente]: {
      icon: 'fas fa-clock',
      colorClass: 'bg-deep-blue text-white'
    },
    [EstadoAsunto.EnProgreso]: {
      icon: 'fas fa-edit',
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