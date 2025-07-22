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
options: string[] = [
      "Agua Prieta",
      "Ciudad Acuña",
      "Ciudad Camargo",
      "Ciudad Juárez",
      "Ciudad Miguel Alemán",
      "Ciudad Reynosa",
      "Colombia",
      "Matamoros",
      "Mexicali",
      "Naco",
      "Nogales",
      "Nuevo Laredo",
      "Ojinaga",
      "Piedras Negras",
      "Puerto Palomas",
      "San Luis Río Colorado",
      "Sonoyta",
      "Tecate",
      "Tijuana",

      "Acapulco",
      "Altamira",
      "Cancún",
      "Ciudad del Carmen",
      "Coatzacoalcos",
      "Dos Bocas",
      "Ensenada",
      "Guaymas",
      "La Paz",
      "Lázaro Cárdenas",
      "Manzanillo",
      "Mazatlán",
      "Progreso",
      "Salina Cruz",
      "Tampico",
      "Tuxpan",
      "Veracruz",

      "Ciudad Hidalgo",
      "Subteniente López",

      "Aeropuerto Internacional de la Ciudad de México",
      "Aguascalientes",
      "Chihuahua",
      "Guadalajara",
      "Guanajuato",
      "México",
      "Monterrey",
      "Puebla",
      "Querétaro",
      "Toluca",
      "Torreón",
      "Aeropuerto Internacional Felipe Ángeles"
  ];
  filteredOptions: string[] = [...this.options];
  searchText: string = '';
  showDropdown = false;
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  filterOptions() {
    const text = this.searchText.toLowerCase();
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(text)
    );
  }

  selectOption(option: string) {
    this.searchText = option;
    this.showDropdown = false;
  }

  onBlur() {
    // Delay para permitir seleccionar con click antes de ocultar
    setTimeout(() => this.showDropdown = false, 2000);
  }

  graphs:any[] = [
    // 0. Rotación de personal por mes (Barra)
  {
    id: 'graph0',
    title: 'Rotación de personal por mes',
    chartData: {
      labels: [
        'Jul 2024', 'Ago 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dic 2024',
        'Ene 2025', 'Feb 2025', 'Mar 2025', 'Abr 2025', 'May 2025', 'Jun 2025'
      ],
      datasets: [
        {
          type: 'bar',
          label: 'Ingresos',
          data: [5, 7, 6, 8, 9, 7, 6, 8, 7, 9, 8, 7],
          backgroundColor: '#007B5D' // Azul primario
        },
        {
          type: 'bar',
          label: 'Egresos',
          data: [2, 3, 2, 4, 3, 2, 3, 2, 4, 3, 2, 3],
          backgroundColor: '#9F2241' // Rojo
        }
      ]
    }
  },
  // 1. Contrataciones por unidad administrativa (Pie)
  {
    id: 'graph1',
    title: 'Contrataciones por unidad administrativa',
    
    chartData: { 
      labels: [
      'Recursos Humanos',
      'Unidad de Administración y Finanzas',
      'Dirección General de Operación Aduanera',
      'Dirección de Recursos Materiales',
      'Dirección de Actualización Normativa'
    ],
      options: { // Agrega esta sección
          scales: {
            x: { // Deshabilita el eje X
              display: false
            },
            y: { // Deshabilita el eje Y
              display: false
            }
          }
        },
      datasets: [{
          type: 'pie',
          label: 'Contrataciones',
          data: [15, 8, 12, 20, 5],
          backgroundColor: [
            '#007B5D', // Azul primario
            '#C9A977', // Amarillo oro
            '#0D324D', // Azul profundo
            '#9F2241', // Verde secundario
            '#A188A6'  // Morado
          ],
          borderColor: [
            '#1565c0', // Azul primario oscuro
            '#C9A977', // Amarillo más claro
            '#1a237e', // Azul más profundo
            '#9F2241', // Verde más oscuro
            '#6d1b7b'  // Morado oscuro
          ],
          borderWidth: 2,
          
        },
        
      ],
      
    } as MultiChartData
  },
  // 2. Cantidad de contrataciones por mes (Línea)
  {
    id: 'graph2',
    title: 'Cantidad de contrataciones por mes',
    chartData: {
      labels: [
        'Jul 2024', 'Ago 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dic 2024',
        'Ene 2025', 'Feb 2025', 'Mar 2025', 'Abr 2025', 'May 2025', 'Jun 2025'
      ],
      
      datasets: [
        {
          type: 'line',
          label: 'Contrataciones',
          data: [12, 15, 10, 18, 20, 22, 25, 19, 17, 21, 23, 20],
          borderColor: '#0D324D', // Azul primario
          backgroundColor: 'rgba(145, 110, 191, 0.44)', // Azul claro
          fill: true,
          tension: 0.5,
          borderWidth:2 
        }
      ] as ChartDataset<'line', number[]>[]
    } 
  },
  // 3. Personal Civil vs Militar (Pie)
  {
    id: 'graph3',
    title: 'Personal Civil vs Militar',
    chartData: {
      labels: ['Civil', 'Militar'],
      datasets: [
        {
          type: 'pie',
          label: 'Personal',
          data: [120, 80],
          backgroundColor: [
            '#C9A977', // Amarillo oro
            '#0D324D'  // Azul profundo
          ],
          borderColor: [
            '#C9A977', // Amarillo más claro
            '#1a237e'  // Azul más profundo
          ],
          borderWidth: 2
        }
      ] as ChartDataset<'pie', number[]>[]
    } as MultiChartData
  }
  ]
}
