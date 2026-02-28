import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;


  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Fetch users from DB
  loadUsers(): void {
    this.adminService.getUsersBackend().subscribe({
      next: (res: any) => {
        // The .NET backend returns the data array inside a wrapper
        this.users = res.data || res;
      },
      error: err => this.toastr.error('Failed to fetch users', 'Error')
    });
  }

  // Open modal with user details
  openUserModal(user: any): void {
    this.selectedUser = { ...user, orders: [] }; // Set user immediately with empty orders

    this.adminService.getOrdersBackend().subscribe({
      next: (res: any) => {
        const allOrders = res.data || res;
        const mappedOrders: any[] = [];

        // Filter orders for this specific user
        allOrders
          .filter((o: any) => o.userId === user.id)
          .forEach((orderData: any) => {
            orderData.items?.forEach((item: any) => {
              mappedOrders.push({
                orderId: orderData.orderId,
                status: orderData.status,
                createdOn: orderData.createdOn,
                quantity: item.quantity,
                product: {
                  name: item.productName,
                  price: item.unitPrice,
                  imageUrl: item.productImageUrl
                }
              });
            });
          });

        this.selectedUser.orders = mappedOrders;
      },
      error: () => console.error('Failed to load user orders')
    });
  }

  // Close user modal
  closeUserModal(): void {
    this.selectedUser = null;
  }

  // Block/Unblock user permanently
  toggleBlock(user: any) {
    this.adminService.toggleBlockUserBackend(user.id).subscribe({
      next: (res: any) => {
        // Toggle the property in the local array to update the UI instantly without reloading
        user.isBlocked = !user.isBlocked;
        this.toastr.success(res?.message || `${user.fullName} status updated`, 'Success');
      },
      error: () => this.toastr.error('Failed to update user status', 'Error')
    });
  }


}
