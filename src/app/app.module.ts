import { AdminBlogsComponent } from './Dashboard/admin-blogs/admin-blogs.component';
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
import { NgModel, ReactiveFormsModule } from '@angular/forms';
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
import { UsersComponent } from './Dashboard/users/users.component';
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
    UsersComponent,
    TeacherFormComponent,
    QuizComponent,
    FooterComponent
   
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
    QuillModule.forRoot({
        modules: {
            syntax: {
                highlight: (text: string) => hljs.highlightAuto(text).value
            },
        }
    }),
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
    NgxScrollAnimationsModule
],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
