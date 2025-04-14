import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetContactsService } from '../../Services/get-contacts.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, retry, share } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface Contact {
  id: number;
  name: string;
  country: string;
  phone: string;
  numberOfChildren: number;
  planChoice: string;
  brandName: string;
  course: string;
  city: string;
  sentAt: string;
  isContact: boolean;
}

@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.scss'],
})
export class AdminContactComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  displayedContacts: Contact[] = [];
  private subscriptions: Subscription = new Subscription();
  isGridView = true;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 1;

  constructor(
    private contactService: GetContactsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initContactsSubscription();
    this.initRealTimeUpdates();
  }



  // Update Contacts Every 2 Minutes

  private initContactsSubscription(): void {
    this.subscriptions.add(
      this.contactService.contacts$.subscribe({
        next: (res) => {
          this.contacts = res.reverse();
          this.updatePagination();
          console.log('Contacts updated:', this.contacts);
        },
        error: (error) => console.error('Error fetching contacts:', error),
      })
    );
  }

  private initRealTimeUpdates(): void {
    const realTimeUpdates$ = timer(0, 120000).pipe(
      switchMap(() => this.contactService.getContacts()),
      retry(1),
      share()
    );

    this.subscriptions.add(
      realTimeUpdates$.subscribe({
        next: (contacts) => this.contactService.contactsSubject.next(contacts),
        error: (error) => console.error('Error fetching contacts:', error),
      })
    );
  }



  //Toggle View
  toggleView(isGrid: boolean): void {
    this.isGridView = isGrid;
  }


  //Toggle Status For Contactes
  toggleContactStatus(contact: Contact) {
    const originalStatus = contact.isContact;
    contact.isContact = !contact.isContact;
    this.contactService.toggleContactStatus(contact.id).subscribe({
      next: () => {
        this.snackBar.open('Contact status updated successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Failed to update contact status.', 'Close', {
          duration: 3000,

        });
        contact.isContact = originalStatus; // Revert on error

      },
    });
  }


  // Download Data Button Methods
  downloadDisplayedExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.displayedContacts);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'contacts');
  }
  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.contacts);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'contacts');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }


  // Refresh Data Button Method

  isLoading: boolean = false;
  refreshData(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.contactService.getContacts().subscribe({
        next: (contacts) => {
          this.contactService.contactsSubject.next(contacts);
          console.log('Data refreshed successfully');
          this.snackBar.open('Refresh contacts success.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error refreshing contacts:', error);
          this.snackBar.open('Error refreshing contacts.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      })
    );
  }


  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.contacts.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedContacts();
  }

  updateDisplayedContacts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedContacts = this.contacts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedContacts();
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

