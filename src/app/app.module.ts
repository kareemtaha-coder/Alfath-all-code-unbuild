import { AdminBlogsComponent } from './Dashboard/Marketing/admin-blogs/admin-blogs.component';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './Components/Shared/nav/nav.component';
import { AboutComponent } from './Components/about/about.component';
import { BlogSectionComponent } from './Components/blog-section/blog-section.component';
import { VideoSectionComponent } from './Components/video-section/video-section.component';
import { FeaturesSectionComponent } from './Components/features-section/features-section.component';
import { TeamSectionComponent } from './Components/team-section/team-section.component';
import { CommonQuestionsSectionComponent } from './Components/common-questions-section/common-questions-section.component';
import { SessionsSectionComponent } from './Components/sessions-section/sessions-section.component';
import { TestimonialVideoSectionComponent } from './Components/testimonial-video-section/testimonial-video-section.component';
import { HeroComponent } from './Components/hero/hero.component';
import { AdventuresComponent } from './Components/adventures/adventures.component';
import { CoursesSectionComponent } from './Components/courses-section/courses-section.component';
import { TestimonialSectionComponent } from './Components/testimonial-section/testimonial-section.component';
import { HomeComponent } from './home/home.component';
import { ContactModalComponent } from './Components/Shared/contact-modal/contact-modal.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import hljs from 'highlight.js';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginComponent } from './Dashboard/login/login.component';
import { CommonModule } from '@angular/common';
import { AdminContactComponent } from './Dashboard/admin-contact/admin-contact.component';
import { BlogComponent } from './Blogs/blog/blog.component';
import { BlogsComponent } from './Blogs/blogs/blogs.component';
import { AdminStarterComponent } from './Dashboard/admin-starter/admin-starter.component';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { TeacherFormComponent } from './Teacher/teacher-form/teacher-form.component';
import { QuizComponent } from './Teacher/quiz/quiz.component';
import { FooterComponent } from './Components/Shared/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './Translate-config/http-loader.factory';
import { NgxScrollAnimationsModule } from 'ngx-scroll-animations';
import { AdminTeacherComponent } from './Dashboard/HR/admin-teacher/admin-teacher.component';
import { AdminUserComponent } from './Dashboard/users/users.component';
import { AdminSessionsComponent } from './Dashboard/Marketing/admin-sessions/admin-sessions.component';
import { SessionsPageComponent } from './sessions-page/sessions-page.component';
import { ArabicCourseComponent } from './Courses/arabic-course/arabic-course.component';
import { IslamicCourseComponent } from './Courses/islamic-course/islamic-course.component';
import { SecurityCodeDialogComponent } from './Dashboard/security-code-dialog/security-code-dialog.component';
import { QuranCourseComponent } from './Courses/quran-course/quran-course.component';
import { TagInputModule } from 'ngx-chips';
import { BlogListComponent } from './Dashboard/Marketing/admin-blogs/blog-list/blog-list.component';
import { LoaderComponent } from './loader/loader.component';
import { WhyChooseAlfathComponent } from './Components/why-choose-alfath/why-choose-alfath.component';
import Swiper from 'swiper';
import { OnInit } from '@angular/core';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AdminFeedBackComponent } from './Dashboard/admin-feed-back/admin-feed-back.component';
import { AdminCertificatesComponent } from './Dashboard/admin-certificates/admin-certificates.component';
import { CertificateComponent } from './Components/certificate/certificate.component';
import { AdminQuizComponent } from './Dashboard/admin-quiz/admin-quiz.component';
import { ConfirmationModalComponent } from './Dashboard/admin-quiz/confirmation-modal/confirmation-modal.component'; // Import AOS styles
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateTeacherComponent } from './Dashboard/Teacher/create-teacher/create-teacher.component';
import { TeacherStarterComponent } from './Dashboard/Teacher/teacher-starter/teacher-starter.component';
import { ManageTeachersComponent } from './Dashboard/Teacher/manage-teachers/manage-teachers.component';
import { ConfirmEmailComponent } from './Dashboard/Teacher/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './Dashboard/login/reset-password/reset-password.component';
import { AvailableBooksComponent } from './Dashboard/Books/available-books/available-books.component';
import { CreateBookComponent } from './Dashboard/Books/create-book/create-book.component';
import { BookStarterComponent } from './Dashboard/Books/book-starter/book-starter.component';
import { BookPdfComponent } from './Dashboard/Books/book-pdf/book-pdf.component';
import { BookDetailsComponent } from './Dashboard/Books/book-details/book-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    BlogSectionComponent,
    FeaturesSectionComponent,
    TeamSectionComponent,
    CommonQuestionsSectionComponent,
    SessionsSectionComponent,
    TestimonialVideoSectionComponent,
    HeroComponent,
    AdventuresComponent,
    CoursesSectionComponent,
    TestimonialSectionComponent,
    HomeComponent,
    ContactModalComponent,
    AdminBlogsComponent,
    LoginComponent,
    AdminContactComponent,
    BlogComponent,
    BlogsComponent,
    AdminStarterComponent,
    VideoSectionComponent,
    AdminUserComponent,
    TeacherFormComponent,
    QuizComponent,
    FooterComponent,
    AdminTeacherComponent,
    AdminSessionsComponent,
    SessionsPageComponent,
    ArabicCourseComponent,
    IslamicCourseComponent,
    SecurityCodeDialogComponent,
    QuranCourseComponent,
    BlogListComponent,
    LoaderComponent,
    WhyChooseAlfathComponent,
    AdminFeedBackComponent,
    AdminCertificatesComponent,
    CertificateComponent,
    AdminQuizComponent,
    ConfirmationModalComponent,
    CreateTeacherComponent,
    TeacherStarterComponent,
    ManageTeachersComponent,
    ConfirmEmailComponent,
    ResetPasswordComponent,
    AvailableBooksComponent,
    CreateBookComponent,
    BookStarterComponent,
    BookPdfComponent,
    BookDetailsComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    FormsModule,
    NgxIntlTelInputModule,
    RouterLinkActive,
    CommonModule,
    PdfViewerModule,
    QuillModule.forRoot({
        modules: {
            syntax: {
                highlight: (text: string) => hljs.highlightAuto(text).value
            },
        }
    }),
    PdfViewerModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxScrollAnimationsModule,
    TagInputModule,
      ToastrModule.forRoot({
      positionClass: 'toast-center-center',
      preventDuplicates: true,
      progressBar: true,
      timeOut: 3000
    }),
    NgxPaginationModule,
    DragDropModule
],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  ngOnInit() {
    AOS.init(); // Initialize AOS
  }
  constructor() {
    // Configure the location of the PDF worker
    (window as any).pdfWorkerSrc = '/assets/pdf.worker.min.js';
  }

}
