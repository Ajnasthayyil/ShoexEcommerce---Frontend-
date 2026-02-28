import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { AdminService } from 'src/app/core/services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  // Dashboard metrics
  public totalOrders: number = 0;
  public totalRevenue: number = 0;
  public pendingOrders: number = 0;
  public totalUsers: number = 0;

  public completedOrders: number = 0;
  public cancelledOrders: number = 0;

  public recentOrders: any[] = [];

  private statsSubscription: Subscription = new Subscription();

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadDashboardStats();
    this.statsSubscription = this.adminService.dashboardStats$.subscribe((stats: any) => {
      if (stats) {
        this.updateStats(stats);
      }
    });
  }

  ngOnDestroy(): void {
    this.statsSubscription.unsubscribe();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe((t: any) => {
      this.updateStats(t);
    });
  }

  // Additional Chart Properties
  public salesChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public salesChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
    }
  };

  public ordersChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  public ordersChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' }
      }
    }
  };

  private updateStats(stats: any): void {
    this.totalOrders = stats.totalOrders;
    this.totalRevenue = stats.totalRevenue;
    this.pendingOrders = stats.pendingOrders;
    this.completedOrders = stats.completedOrders || 0;
    this.cancelledOrders = stats.cancelledOrders || 0;
    this.totalUsers = stats.totalUsers;
    this.recentOrders = stats.recentOrders || [];

    // ------------------------------
    // Sales Line Chart
    // ------------------------------
    const salesSeries = stats.salesSeries || [];
    const lineLabels = salesSeries.map((s: any) => s.key);
    const lineData = salesSeries.map((s: any) => s.value);

    this.salesChartData = {
      labels: lineLabels,
      datasets: [
        {
          data: lineData,
          label: 'Revenue',
          borderColor: '#ef4444', // Red-500
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#ef4444',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };

    const statusCount: Record<string, number> = {
      Pending: this.pendingOrders,
      Completed: this.completedOrders,
      Cancelled: this.cancelledOrders
    };

    this.ordersChartData = {
      labels: Object.keys(statusCount),
      datasets: [
        {
          data: Object.values(statusCount),
          backgroundColor: ['#f97316', '#10b981', '#ef4444'], // Orange, Emerald, Red
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    };
  }
}
