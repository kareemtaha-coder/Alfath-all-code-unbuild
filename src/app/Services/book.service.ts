import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { decryptAES } from './utils/crypto-utils';
@Injectable({
  providedIn: 'root',
})
export class BookService implements OnDestroy {
  private apiUrl = 'https://al-fath.runasp.net/api/Books';
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Get all books
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(takeUntil(this.destroy$));
  }

  // Get a single book by ID
  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(takeUntil(this.destroy$));
  }

  getPdfStream(pdfId: string, key: string): Observable<Blob> {
    return this.http.get<{ base64Pdf: string; iv: string }>(`${this.apiUrl}/stream/${pdfId}`).pipe(
      map(response => {
        // Decrypt PDF content
        const decryptedBase64 = decryptAES(response.base64Pdf, key, response.iv);

        // Convert Base64 to Binary (Blob)
        const byteCharacters = atob(decryptedBase64);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'application/pdf' });
      })
    );
  }
  // Add a new book
  addBook(book: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, book).pipe(takeUntil(this.destroy$));
  }

  // Update an existing book
  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, book).pipe(takeUntil(this.destroy$));
  }

  // Delete a book
  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  convertBase64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

}
