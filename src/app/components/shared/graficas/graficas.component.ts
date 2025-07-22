import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart, ChartType, ChartConfiguration, registerables } from 'chart.js';

// ⚠️ Ajusta esta ruta según dónde tengas el archivo de modelos
import { MultiChartData } from '../../../entidades/chart-datasets.model';

Chart.register(...registerables); // Registro global de Chart.js

@Component({
  standalone: false,
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss'],
})
export class GraficasComponent implements OnInit, AfterViewInit {
  // Inputs personalizables desde el componente padre
  @Input() chartID: string = 'defaultChart';
  @Input() width: string = '100%';
  @Input() height: string = '400px';
  @Input() type: ChartType | 'multi' = 'bar'; // 'multi' para gráficas compuestas
  @Input() showLegend: boolean = true; // por defecto muestra las leyendas
  @Input() showXAxisLabels: boolean = true;
  @Input() showXAxis: boolean = true;
  @Input() showYAxisLabels: boolean = true;
  @Input() showYAxis: boolean = true;
  @Input() showTooltips: boolean = true;
  @Input() compact: boolean = false;

 @Input()
	set datasets(data: any | undefined) {
	if (!data) return;
	this._datasets = data;
	this.refreshChartData();
	}

	private refreshChartData(): void {
  if (!this.chart || !this.chart.data) return;
  if (!this._datasets || !this._datasets.datasets || !this._datasets.labels) return;

  this.chart.data.labels = [...this._datasets.labels];
  this.chart.data.datasets = [...this._datasets.datasets];
  this.chart.update();
}

  get datasets(): MultiChartData {
    return this._datasets;
  }

  @ViewChild('chartCanvas', { static: true })
  chartCanvasRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  private _datasets!: MultiChartData;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderChart();
  }

  private renderChart(): void {
	if (this.chart) return;

	const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
	if (!ctx) return;

	const resolvedType: ChartType = this.type === 'multi' ? 'bar' : this.type;

    const config: ChartConfiguration = {
      type: resolvedType,
      data: this._datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: this.compact ? 0 : 1000,
        },
        interaction: this.compact
          ? { mode: undefined, intersect: false }
          : { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: !this.compact && this.showLegend,
          },
          tooltip: {
            enabled: !this.compact && this.showTooltips,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            display: !this.compact && this.showXAxis,
            ticks: {
              display: !this.compact && this.showXAxisLabels,
              autoSkip: false, // ¡Importante! Deshabilita el salto automático de etiquetas
              maxRotation: 90, // Rota las etiquetas hasta 90 grados para que quepan
              minRotation: 0,  // Sin rotación mínima
            },
          },
          y: {
            display: !this.compact && this.showYAxis,
            beginAtZero: true,
            ticks: {
              display: !this.compact && this.showYAxisLabels,
            },
          },
        },
      },
    };

      this.chart = new Chart(ctx, config);
  }
}
