import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeacherService } from '../../../Services/teacher.service';
import { Subscription, timer } from 'rxjs';
import { switchMap, retry, share } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface Teacher {
  id: number;
  name: string;
  education: string;
  yearsOfExperience: number;
  phone: string;
  nationalId: string;
  examResult: string;
  dateOfBirth: string;
  quizzes: string[];
  solution: {
    questions: {
      id: number;
      content: string;
      choices: {
        id: number;
        content: string;
        isCorrect: boolean;
        isChoosen: boolean;
      }[];
    }[];
  };
}

@Component({
  selector: 'app-admin-teacher',
  templateUrl: './admin-teacher.component.html',
  styleUrls: ['./admin-teacher.component.scss'],
})
export class AdminTeacherComponent implements OnInit, OnDestroy {
  teachers: Teacher[] = [];
  displayedTeachers: Teacher[] = [];
  private subscriptions: Subscription = new Subscription();
  isGridView = true;
  isLoading = false;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 1;

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initTeachersSubscription();
    this.initRealTimeUpdates();
  }



  selectedTeacher: Teacher | null = null;

  showQuizzes(teacher: Teacher): void {
    this.selectedTeacher = teacher;
  }



  private initTeachersSubscription(): void {
    this.subscriptions.add(
      this.teacherService.teachers$.subscribe({
        next: (res) => {
          this.teachers = res.reverse();
          this.updatePagination();
          console.log('Teachers updated:', this.teachers);
        },
        error: (error) => console.error('Error fetching teachers:', error),
      })
    );
  }

  private initRealTimeUpdates(): void {
    const realTimeUpdates$ = timer(0, 120000).pipe(
      switchMap(() => this.teacherService.getTeachers()),
      retry(1),
      share()
    );

    this.subscriptions.add(
      realTimeUpdates$.subscribe({
        next: (teachers) => this.teacherService.teachersSubject.next(teachers),
        error: (error) => console.error('Error fetching teachers:', error),
      })
    );
  }

  toggleView(isGrid: boolean): void {
    this.isGridView = isGrid;
  }

  deleteTeacher(id: number) {
    this.teacherService.deleteTeacher(id).subscribe({
      next: () => {
        this.snackBar.open('Teacher deleted successfully!', 'Close', {
          duration: 3000,
        });
        this.refreshData();
      },
      error: () => {
        this.snackBar.open('Failed to delete teacher.', 'Close', {
          duration: 3000,
        });
      },
    });
  }


  downloadExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.teachers);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'teachers');
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
      this.teacherService.getTeachers().subscribe({
        next: (teachers) => {
          this.teacherService.teachersSubject.next(teachers);
          console.log('Data refreshed successfully');
          this.snackBar.open('Refresh teachers success.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error refreshing teachers:', error);
          this.snackBar.open('Error refreshing teachers.', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      })
    );
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.teachers.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedTeachers();
  }

  updateDisplayedTeachers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedTeachers = this.teachers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedTeachers();
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
