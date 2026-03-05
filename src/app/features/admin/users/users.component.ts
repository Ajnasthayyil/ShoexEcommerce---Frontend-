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
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchText: string = '';
  selectedFilter: string = '';
  sortField: string = 'fullName';
  sortDir: 'asc' | 'desc' = 'asc';


  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Fetch users from DB
  loadUsers(): void {
    this.adminService.getUsersBackend().subscribe({
      next: (res: any) => {
        this.users = res.data || res;
        this.applyFilters();
      },
      error: err => this.toastr.error('Failed to fetch users', 'Error')
    });
  }

  applyFilters(): void {
    let result = [...this.users];

    if (this.searchText) {
      const search = this.searchText.toLowerCase().trim();
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(search) ||
        u.username.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.mobileNumber || u.mobile || '').includes(search)
      );
    }

    if (this.selectedFilter) {
      if (this.selectedFilter === 'blocked') {
        result = result.filter(u => u.isBlocked);
      } else if (this.selectedFilter === 'active') {
        result = result.filter(u => !u.isBlocked);
      }
    }

    // Sort logic
    result.sort((a, b) => {
      const valA = (a[this.sortField] || '').toString().toLowerCase();
      const valB = (b[this.sortField] || '').toString().toLowerCase();
      let comparison = 0;
      if (valA > valB) comparison = 1;
      else if (valA < valB) comparison = -1;
      return this.sortDir === 'asc' ? comparison : -comparison;
    });

    this.filteredUsers = result;
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedFilter = '';
    this.applyFilters();
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
        this.applyFilters();
        this.toastr.success(res?.message || `${user.fullName} status updated`, 'Success');
      },
      error: () => this.toastr.error('Failed to update user status', 'Error')
    });
  }


}
