import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-sales-statistics',
  templateUrl: './analytics.component.html',
})
export class SalesStatisticsComponent implements OnInit {
  selectedPeriod: 'day' | 'month' = 'day';
  data: any = null;

  periodRevenue: number = 0;
  periodSales: number = 0;

  chartLabels: string[] = [];
  chartDatasets: ChartConfiguration<'line'>['data']['datasets'] = [];
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    },
  };

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadSalesData();
  }

  // ✅ Load data from db.json
  loadSalesData() {
    this.adminService.getSalesAnalysis().subscribe({
      next: (data) => {
        this.data = data;
        this.updateChart('day'); // default view
      },
      error: (err) => console.error('Error loading sales data:', err),
    });
  }

  // ✅ Update chart for day or month
  updateChart(period: 'day' | 'month') {
    if (!this.data) return;
    this.selectedPeriod = period;

    this.chartLabels = this.data[period].labels;

    // Calculate totals for the selected period
    this.periodRevenue = this.data[period].revenue.reduce((a: number, b: number) => a + b, 0);
    this.periodSales = this.data[period].sales.reduce((a: number, b: number) => a + b, 0);

    this.chartDatasets = [
      {
        label: 'Revenue',
        data: this.data[period].revenue,
        borderColor: '#f97316', // orange
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#f97316',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Sales Vol.',
        data: this.data[period].sales,
        borderColor: '#dc2626', // red
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#dc2626',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ];
  }

  // ✅ Button click handler
  setPeriod(period: 'day' | 'month') {
    this.updateChart(period);
  }
}
