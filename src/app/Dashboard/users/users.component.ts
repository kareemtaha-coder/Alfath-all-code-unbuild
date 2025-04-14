import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterService } from '../../Services/register.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, retry, share } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';  // Add this import

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  isContacted: boolean;
}

@Component({
  selector: 'app-admin-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DatePipe]  // Add DatePipe to the providers array
})
export class AdminUserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  displayedUsers: User[] = [];
  private subscriptions: Subscription = new Subscription();
  isGridView = true;
  isLoading = false;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 1;

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initUsersSubscription();
    this.initRealTimeUpdates();
  }

  private initUsersSubscription(): void {
    this.subscriptions.add(
      this.registerService.users$.subscribe({
        next: (res) => {
          this.users = res.slice(3).reverse();
          this.updatePagination();
          console.log('Users updated:', this.users);
        },
        error: (error) => console.error('Error fetching users:', error),
      })
    );
  }

  private initRealTimeUpdates(): void {
    const realTimeUpdates$ = timer(0, 120000).pipe(
      switchMap(() => this.registerService.getUsers()),
      retry(1),
      share()
    );
    
    this.subscriptions.add(
      realTimeUpdates$.subscribe({
        next: (users) => this.registerService.usersSubject.next(users),
        error: (error) => console.error('Error fetching users:', error),
      })
    );
  }

  toggleView(isGrid: boolean): void {
    this.isGridView = isGrid;
  }

  toggleUserContact(user: User) {
    this.registerService.toggleUserContact(user.id).subscribe({
      next: () => {
        user.isContacted = !user.isContacted;
        this.snackBar.open(`User contact status ${user.isContacted ? 'enabled' : 'disabled'}`, 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error toggling user contact status:', error);
        this.snackBar.open('Failed to toggle user contact status.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'users');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  refreshData(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.registerService.getUsers().subscribe({
        next: (users) => {
          this.registerService.usersSubject.next(users);
          console.log('Data refreshed successfully');
          this.snackBar.open('Refresh users success.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error refreshing users:', error);
          this.snackBar.open('Error refreshing users.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      })
    );
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedUsers();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}