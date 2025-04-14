import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BookService } from '../../../Services/book.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-book-pdf',
  templateUrl: './book-pdf.component.html',
  styleUrls: ['./book-pdf.component.scss'],
})
export class BookPdfComponent implements OnInit, OnDestroy {
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef;
  @ViewChild('container', { static: false }) container!: ElementRef;
  private key = "hnxTLnQCb9sXgTngmjASPw==";
  pdfDoc: any = null;
  pageNum = 1;
  pageRendering = false;
  pageNumPending: number | null = null;
  scale = 1.5;
  errorMessage: string = '';
  totalPages = 0;
  isLoading = false;
  canRetry = false;
  isTouchDevice = false;

  // Chapter navigation and page input
  chapters: { title: string; pageNumber: number }[] = [];
  currentChapter: string = '';
  goToPageInput: number = 1;
  showChapters: boolean = false;

  private destroy$ = new Subject<void>();
  private lastTapTime = 0;
  private touchStartX = 0;
  private touchStartY = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
  ) {
    // Set the worker source path for PDF.js
    const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

    // Detect if device uses touch
    this.detectTouchDevice();
  }

  detectTouchDevice(): void {
    this.isTouchDevice = 'ontouchstart' in window ||
                         navigator.maxTouchPoints > 0 ||
                         (navigator as any).msMaxTouchPoints > 0;
  }

  ngOnInit(): void {
    const pdfId = this.route.snapshot.paramMap.get('id');
    if (pdfId) {
      this.loadPdf(pdfId);
    }

    // Set initial zoom based on device
    this.setInitialZoom();
  }

  setInitialZoom(): void {
    // Set smaller initial zoom for mobile devices
    if (window.innerWidth < 768) {
      this.scale = 1.0;
    } else if (window.innerWidth < 1200) {
      this.scale = 1.2;
    } else {
      this.scale = 1.5;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Adjust canvas if window is resized
    if (this.pdfDoc) {
      this.queueRenderPage(this.pageNum);
    }
  }

  loadPdf(pdfId: string): void {
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous errors
    this.canRetry = false;

    this.bookService.getPdfStream(pdfId, this.key).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: blob => {
        // Convert Blob to Uint8Array
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          this.renderPdf(uint8Array);
        };
        reader.onerror = () => {
          this.errorMessage = 'Failed to process PDF file';
          this.isLoading = false;
          this.canRetry = true;
        };
        reader.readAsArrayBuffer(blob);
      },
      error: err => {
        console.error("Error loading PDF:", err);
        this.errorMessage = 'Failed to load PDF';
        this.isLoading = false;
        this.canRetry = true;
      }
    });
  }

  renderPdf(pdfData: Uint8Array): void {
    pdfjsLib.getDocument({ data: pdfData }).promise.then((pdfDoc: any) => {
      this.pdfDoc = pdfDoc;
      this.totalPages = pdfDoc.numPages;
      this.isLoading = false;
      this.renderPage(this.pageNum);
      this.goToPageInput = this.pageNum;

      // Extract outline/chapters after loading the PDF
      this.extractChapters();
    }).catch((error: any) => {
      this.errorMessage = 'Failed to render PDF: ' + error.message;
      this.isLoading = false;
      this.canRetry = true;
    });
  }

  renderPage(num: number): void {
    this.pageRendering = true;
    // Using promise to fetch the page
    this.pdfDoc.getPage(num).then((page: any) => {
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = this.pdfCanvas.nativeElement;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      const renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          // New page rendering is pending
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }

        // Update current chapter based on page number
        this.updateCurrentChapter();
        // Update page input to reflect current page
        this.goToPageInput = this.pageNum;
      });
    });
  }

  // Navigation methods
  queueRenderPage(num: number): void {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }

  previousPage(): void {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  nextPage(): void {
    if (this.pageNum >= this.totalPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  // Zoom methods
  zoomIn(): void {
    this.scale += 0.25;
    this.queueRenderPage(this.pageNum);
  }

  zoomOut(): void {
    if (this.scale <= 0.5) {
      return;
    }
    this.scale -= 0.25;
    this.queueRenderPage(this.pageNum);
  }

  zoomFit(): void {
    // Calculate scale to fit the container width
    if (this.container && this.pdfDoc) {
      this.pdfDoc.getPage(this.pageNum).then((page: any) => {
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = this.container.nativeElement.offsetWidth - 40; // Subtract padding
        this.scale = containerWidth / viewport.width;
        this.queueRenderPage(this.pageNum);
      });
    }
  }

  // Methods for page input and chapter navigation
  goToPage(): void {
    if (this.goToPageInput && this.goToPageInput >= 1 && this.goToPageInput <= this.totalPages) {
      this.pageNum = this.goToPageInput;
      this.queueRenderPage(this.pageNum);
    }
  }

  retryLoading(): void {
    const pdfId = this.route.snapshot.paramMap.get('id');
    if (pdfId) {
      this.loadPdf(pdfId);
    }
  }

  // Touch handlers for mobile gestures
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;

      const now = new Date().getTime();
      const timeSince = now - this.lastTapTime;

      if (timeSince < 300 && timeSince > 0) {
        // Double tap detected - could implement zoom in/out here
        event.preventDefault();
      }

      this.lastTapTime = now;
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === 0 && this.touchStartY === 0) return;

    // Calculate swipe distance on x-axis
    const deltaX = this.touchStartX - (event.changedTouches[0]?.clientX || 0);
    const deltaY = Math.abs(this.touchStartY - (event.changedTouches[0]?.clientY || 0));

    // Only trigger page change if horizontal swipe is significant and not primarily vertical
    if (Math.abs(deltaX) > 75 && deltaY < 50) {
      if (deltaX > 0) {
        // Swipe left - next page
        this.nextPage();
      } else {
        // Swipe right - previous page
        this.previousPage();
      }
    }

    // Reset values
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  // Chapter navigation methods (keeping your existing implementation)
  extractChapters(): void {
    // Default chapters if outline extraction fails or isn't available
    this.chapters = [
      { title: 'Cover', pageNumber: 1 }
    ];

    // Try to extract document outline/table of contents if available
    if (this.pdfDoc) {
      this.pdfDoc.getOutline().then((outline: any[]) => {
        if (outline && outline.length > 0) {
          // Process outline into chapters
          this.processOutline(outline);
        } else {
          console.log("No outline found in PDF, using document structure analysis");
          // If no outline, attempt to analyze document structure
          this.analyzeDocumentStructure();
        }
        this.updateCurrentChapter();
      }).catch((error:any) => {
        console.error("Failed to get PDF outline:", error);
        // Fallback if outline extraction fails
        this.analyzeDocumentStructure();
      });
    }
  }

  processOutline(outline: any[]): void {
    // Process the PDF outline into chapter information
    this.chapters = [];

    const processItems = async (items: any[]) => {
      for (const item of items) {
        // Process this item
        if (item.dest) {
          try {
            let destRef;
            if (typeof item.dest === 'string') {
              // If dest is a string name, resolve it
              destRef = await this.pdfDoc.getDestination(item.dest);
            } else if (Array.isArray(item.dest)) {
              // If dest is already an array, use it directly
              destRef = item.dest;
            }

            if (destRef && Array.isArray(destRef) && destRef.length > 0) {
              // Get the page reference
              const ref = destRef[0];
              try {
                // Find the page number from the reference
                const pageIndex = await this.pdfDoc.getPageIndex(ref);
                this.chapters.push({
                  title: item.title,
                  pageNumber: pageIndex + 1 // +1 because pageIndex is 0-based
                });
                // Sort chapters by page number
                this.chapters.sort((a, b) => a.pageNumber - b.pageNumber);
                this.updateCurrentChapter();
              } catch (pageError) {
                console.warn(`Failed to get page index for "${item.title}":`, pageError);
              }
            }
          } catch (error) {
            console.warn(`Failed to process outline item "${item.title}":`, error);
            // Continue processing other items
          }
        }

        // Process any child items
        if (item.items && item.items.length > 0) {
          await processItems(item.items);
        }
      }
    };

    processItems(outline).catch(error => {
      console.error("Error processing outline:", error);
      // Fall back to document structure analysis if outline processing fails
      this.analyzeDocumentStructure();
    });
  }

  analyzeDocumentStructure(): void {
    // Fallback method to analyze document structure and guess chapters
    // This would involve scanning through pages and looking for chapter headers
    // Simplified implementation for demonstration
    this.chapters = [
      { title: 'Cover', pageNumber: 1 },
      { title: 'Table of Contents', pageNumber: 2 }
    ];

    // Add estimated chapters every ~20 pages as a fallback
    const chapterInterval = Math.max(10, Math.floor(this.totalPages / 10));
    for (let i = 1; i <= 10; i++) {
      const pageNum = i * chapterInterval;
      if (pageNum < this.totalPages) {
        this.chapters.push({
          title: `Chapter ${i}`,
          pageNumber: pageNum
        });
      }
    }
  }

  updateCurrentChapter(): void {
    // Find the current chapter based on the current page
    if (this.chapters.length === 0) return;

    let foundChapter = this.chapters[0].title;
    for (let i = 0; i < this.chapters.length; i++) {
      if (this.pageNum >= this.chapters[i].pageNumber &&
          (i === this.chapters.length - 1 || this.pageNum < this.chapters[i + 1].pageNumber)) {
        foundChapter = this.chapters[i].title;
        break;
      }
    }
    this.currentChapter = foundChapter;
  }

  goToChapter(pageNumber: number): void {
    this.pageNum = pageNumber;
    this.queueRenderPage(this.pageNum);
    this.showChapters = false;
  }

  toggleChapterMenu(): void {
    this.showChapters = !this.showChapters;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
