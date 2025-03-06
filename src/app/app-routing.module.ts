import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Dashboard/login/login.component';
import { AdminStarterComponent } from './Dashboard/admin-starter/admin-starter.component';
import { authGuard } from './Guards/auth.guard';
import { AdminBlogsComponent } from './Dashboard/admin-blogs/admin-blogs.component';
import { AdminContactComponent } from './Dashboard/admin-contact/admin-contact.component';
import { BlogComponent } from './Blogs/blog/blog.component';
import { BlogsComponent } from './Blogs/blogs/blogs.component';
import { UsersComponent } from './Dashboard/users/users.component';
import { TeacherFormComponent } from './Teacher/teacher-form/teacher-form.component';
import { QuizComponent } from './Teacher/quiz/quiz.component';

const routes: Routes = [
  {path:"" , component:HomeComponent},
  {path:"admin-log" , component:LoginComponent},
  {path:"hiring" , component:TeacherFormComponent},
  {path:"quiz" , component:QuizComponent},
  {path:"admin-dashboard" ,canActivate:[authGuard], component:AdminStarterComponent, children: [
    { path: 'contacts', component: AdminContactComponent },
    { path: 'blogs', component: AdminBlogsComponent }, 
    { path: 'users', component: UsersComponent }, 
    { path: '', redirectTo: 'contacts', pathMatch: 'full' }, // Default child route
  ]},
  {path:"admin-blogs" ,canActivate:[authGuard], component:AdminBlogsComponent},
  {path:"admin-contacts" ,canActivate:[authGuard], component:AdminContactComponent},
  {path:"blogs" , component:BlogsComponent},
  {path:"blog/:id",component:BlogComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
