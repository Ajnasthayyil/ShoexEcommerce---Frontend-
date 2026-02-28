import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Chart, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  // Chart Labels
  pieChartLabels: string[] = ['Ordered', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  // Donut (Pie) Chart setup
  pieChartType: 'doughnut' = 'doughnut';
  pieChartData: ChartData<'doughnut', number[], string> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#f97316', '#fb923c', '#111827', '#10b981', '#ef4444'], // Orange, Light Orange, Black, Emerald, Red
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  pieChartOptions: any = {
    responsive: true,
    cutout: '70%', // Donut hole size
    plugins: {
      legend: { display: false }, // We'll build a custom legend in HTML if needed
      tooltip: { enabled: true },
      datalabels: { display: false }
    }
  };

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.registerCenterTextPlugin();
    this.loadOrders();
  }

  // Plugin for center text inside donut
  registerCenterTextPlugin(): void {
    Chart.register({
      id: 'centerText',
      afterDraw(chart) {
        const { ctx, chartArea: { width, height } } = chart;
        ctx.save();
        const total = (chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Total: ${total}`, width / 2, height / 2);
      }
    });
  }

  // Load all orders
  loadOrders(): void {
    this.adminService.getOrdersBackend().subscribe({
      next: (res: any) => {
        const fetchedOrders = res.data || res;
        const allOrders: any[] = [];

        fetchedOrders.forEach((orderListDto: any) => {
          orderListDto.items?.forEach((item: any) => {
            allOrders.push({
              orderId: orderListDto.orderId,
              customerName: orderListDto.customerName,
              productId: item.productId,
              productName: item.productName,
              price: item.unitPrice,
              quantity: item.quantity,
              total: item.totalPrice,
              status: orderListDto.status || 'Ordered',
              date: new Date(orderListDto.createdOn)
            });
          });
        });

        this.orders = allOrders;
        this.updatePieChart();
      },
      error: err => console.error('Error loading orders', err)
    });
  }

  // Update Pie chart data
  updatePieChart(): void {
    const statusCount: Record<string, number> = {
      Ordered: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    this.orders.forEach(order => {
      if (statusCount[order.status] !== undefined) {
        statusCount[order.status]++;
      }
    });

    const dataValues = Object.values(statusCount);

    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: ['#f97316', '#fb923c', '#111827', '#10b981', '#ef4444'], // Matching theme
          borderWidth: 2,
          hoverOffset: 8
        }
      ]
    };
  }
  getColor(i: number): string {
    const colors = this.pieChartData.datasets?.[0]?.backgroundColor as string[] | undefined;
    return colors && colors[i] ? colors[i] : '#ccc';
  }

  // Update order status
  updateOrderStatus(order: any): void {
    const statusEnumMap: { [key: string]: number } = {
      'Ordered': 1,
      'UnderProcess': 2,
      'Packed': 3,
      'Shipped': 4,
      'Delivered': 5,
      'Cancelled': 6
    };

    const statusId = statusEnumMap[order.status] || 1;

    this.adminService.updateOrderStatusBackend(order.orderId, statusId).subscribe({
      next: () => {
        this.toastr.success(`Order ${order.orderId} updated to ${order.status}`, 'Success');

        // update all rows that share the same orderId
        this.orders.forEach(o => {
          if (o.orderId === order.orderId) {
            o.status = order.status;
          }
        });
        this.updatePieChart();
        this.adminService.refreshDashboardStats();
      },
      error: () => this.toastr.error('Failed to update order status', 'Error')
    });
  }
}
