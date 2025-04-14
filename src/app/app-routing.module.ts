import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Dashboard/login/login.component';
import { AdminStarterComponent } from './Dashboard/admin-starter/admin-starter.component';
import { authGuard } from './Guards/auth.guard';
import { AdminBlogsComponent } from './Dashboard/Marketing/admin-blogs/admin-blogs.component';
import { AdminContactComponent } from './Dashboard/admin-contact/admin-contact.component';
import { BlogComponent } from './Blogs/blog/blog.component';
import { BlogsComponent } from './Blogs/blogs/blogs.component';
import { AdminUserComponent } from './Dashboard/users/users.component';
import { TeacherFormComponent } from './Teacher/teacher-form/teacher-form.component';
import { QuizComponent } from './Teacher/quiz/quiz.component';
import { AdminTeacherComponent } from './Dashboard/HR/admin-teacher/admin-teacher.component';
import { AdminSessionsComponent } from './Dashboard/Marketing/admin-sessions/admin-sessions.component';
import { SessionsPageComponent } from './sessions-page/sessions-page.component';
import { ArabicCourseComponent } from './Courses/arabic-course/arabic-course.component';
import { IslamicCourseComponent } from './Courses/islamic-course/islamic-course.component';
import { QuranCourseComponent } from './Courses/quran-course/quran-course.component';
import { BlogListComponent } from './Dashboard/Marketing/admin-blogs/blog-list/blog-list.component';
import { AdminFeedBackComponent } from './Dashboard/admin-feed-back/admin-feed-back.component';
import { AdminCertificatesComponent } from './Dashboard/admin-certificates/admin-certificates.component';
import { AdminQuizComponent } from './Dashboard/admin-quiz/admin-quiz.component';
import { CreateTeacherComponent } from './Dashboard/Teacher/create-teacher/create-teacher.component';
import { TeacherStarterComponent } from './Dashboard/Teacher/teacher-starter/teacher-starter.component';
import { ConfirmEmailComponent } from './Dashboard/Teacher/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './Dashboard/login/reset-password/reset-password.component';
import { BookStarterComponent } from './Dashboard/Books/book-starter/book-starter.component';
import { BookDetailsComponent } from './Dashboard/Books/book-details/book-details.component';
import { BookPdfComponent } from './Dashboard/Books/book-pdf/book-pdf.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "admin-log", component: LoginComponent },
  { path: "hiring", component: TeacherFormComponent },
  { path: "admin-quiz", component: AdminQuizComponent }, // Fixed route path
  {
    path: "admin-dashboard",
    canActivate: [authGuard],
    component: AdminStarterComponent,
    children: [
      { path: "contacts", component: AdminContactComponent },
      { path: "feedBack", component: AdminFeedBackComponent },
      { path: "certificate", component: AdminCertificatesComponent },
      { path: "quiz", component: AdminQuizComponent },
      { path: "teacher", component: TeacherStarterComponent },
      {path:"book",component:BookStarterComponent},
      { path: 'book-details/:id', component: BookDetailsComponent },
      { path: 'book-pdf/:id', component: BookPdfComponent },
      {
        path: "blogs",
        component: AdminBlogsComponent,
        children: [
          { path: "", component: BlogListComponent },
          { path: "new", component: AdminBlogsComponent },
          { path: "edit/:id", component: AdminBlogsComponent },
        ],
      },
      { path: "users", component: AdminUserComponent },
      { path: "teachers", component: AdminTeacherComponent },
      { path: "sessions", component: AdminSessionsComponent },
    ],
  },
  { path: "blogs", component: BlogsComponent },
  { path: "blog/:id", component: BlogComponent },
  { path: "sessions", component: SessionsPageComponent },
  { path: "arabic-course", component: ArabicCourseComponent },
  { path: "islamic-course", component: IslamicCourseComponent },
  { path: "quran-course", component: QuranCourseComponent },
  { path: 'auth/confirm-email', component: ConfirmEmailComponent },
  { path: 'auth/forget-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled',useHash:true} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
