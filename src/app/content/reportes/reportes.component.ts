import { Component } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { MultiChartData } from '../../entidades/chart-datasets.model';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
startDate: string = '';
  endDate: string = '';

  applyFilter(): void {
    // Lógica para aplicar el filtro
    console.log('Aplicar filtro:', this.startDate, this.endDate);
  }

  clearFilter(): void {
    this.startDate = '';
    this.endDate = '';
    console.log('Filtro limpiado');
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
}
