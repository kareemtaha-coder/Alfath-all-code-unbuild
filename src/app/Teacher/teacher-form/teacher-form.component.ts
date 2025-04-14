import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { TeacherService } from '../../Services/teacher.service';
import { QuizService } from '../../Services/quiz.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject, interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { TranslateService } from '@ngx-translate/core';

interface QuizQuestion {
  id: number;
  content: string;
  choices: { id: number; content: string }[];
  userChoiceId?: number;
}

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('buttonHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('normal <=> hovered', animate('200ms ease-in-out')),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class TeacherFormComponent implements OnInit, OnDestroy {
  teacherForm!: FormGroup;
  quizzes: any[] = [];
  quizQuestions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  quizStarted = false;
  quizEnded = false;
  timeLeft = 30;
  timer: any;
  score:number = 0;
  isHovered = false;
  isLoading = false;
  submitted = false;
  progressPercentage = 0;
  errorMessage = '';
  submissionSuccessful = false;
  private destroy$ = new Subject<void>();
  private teacherId: number | null = null;
  private quizIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private quizService: QuizService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadQuizzes();
    this.loadSavedProgress();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTimer();
  }

  private initForm() {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      education: ['', Validators.required],
      yearsOfExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      phone: ['', [Validators.required]],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      selectedQuizzes: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    });

    this.teacherForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.saveProgress());
  }

  private ageValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 65 ? null : { invalidAge: true };
    }
    return null;
  }

  get selectedQuizzes() {
    return this.teacherForm.get('selectedQuizzes') as FormArray;
  }

  onCheckboxChange(event: any, quizId: number) {
    const selectedQuizzes = this.selectedQuizzes;
    const quizIdIndex = selectedQuizzes.controls.findIndex((x) => x.value === quizId);
    if (event.target.checked ) {
      // Add the quiz ID only if it doesn't already exist
      selectedQuizzes.push(this.fb.control(quizId));
      console.log(selectedQuizzes.value)
    } else if (!event.target.checked ) {
      // Remove the quiz ID if it exists
      selectedQuizzes.removeAt(quizIdIndex);
      console.log(selectedQuizzes.value)

    }
  }

  startQuiz() {
    if (this.selectedQuizzes.length > 0) {
      // Cast selectedQuizzes.value to number[] and remove duplicates
      this.quizIds = [...new Set(this.selectedQuizzes.value as number[])];
      this.submitTeacherData();
    }
  }

  private loadQuizzes() {
    this.quizService.getQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load quizzes. Please try again later.';
        this.cdr.markForCheck();
      },
    });
  }

  private loadQuizQuestions(quizIds: number[]) {
    this.quizService.getQuizQuestionsforTeacher(quizIds).subscribe({
      next: (questions) => {
        this.quizQuestions = questions;
        this.quizStarted = true;
        this.quizEnded = false;
        this.currentQuestionIndex = 0;
        this.startTimer();
        this.updateProgressBar();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load questions. Please try again later.';
        console.log(error);
        this.cdr.markForCheck();
      },
    });
  }

  selectAnswer(choiceId: number) {
    this.quizQuestions[this.currentQuestionIndex].userChoiceId = choiceId;
    this.nextQuestion();
  }

  submitTeacherData() {
    if (this.teacherForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const teacherData = {
        ...this.teacherForm.value,
        phone: this.teacherForm.value.phone.internationalNumber,
      };

      this.teacherService.submitTeacherData(teacherData).subscribe({
        next: (response) => {
          console.log(teacherData)
          this.teacherId = response.id; // Store the teacher ID
          this.loadQuizQuestions(this.quizIds); // Load quiz questions after submitting teacher data
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to submit teacher data. Please try again later.';
          this.cdr.markForCheck();
        },
      });
    }
  }

   submitQuizSolutions() {
    if (this.teacherId === null) {
      this.errorMessage = 'Teacher ID is missing. Cannot submit quiz solutions.';
      return;
    }

    const solutions = {
      quizIds: this.quizIds,
      teacherId: this.teacherId,
      choices: this.quizQuestions.map((question) => ({
        questionId: question.id,
        choiceId: question.userChoiceId,
      })),
    };
    this.teacherService.submitQuizSolutions(solutions).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.submitted = true;
        this.submissionSuccessful = true;
        this.clearSavedProgress();
        this.cdr.markForCheck();
        this.score = response.score
        console.log(this.score)

      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to submit quiz solutions. Please try again later.';
        this.cdr.markForCheck();
      },
    });
  }

  private startTimer() {
    this.clearTimer();
    this.timeLeft = 30;
    this.timer = interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        take(31)
      )
      .subscribe(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.nextQuestion();
        }
        this.cdr.markForCheck();
      });
  }

  private nextQuestion() {
    this.clearTimer();
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
      this.updateProgressBar();
    } else {
      this.endQuiz();
    }
  }

  endQuiz() {
    this.clearTimer();
    this.quizEnded = true;
    // this.calculateFinalScore();
    this.cdr.markForCheck();
    localStorage.removeItem('teacherFormProgress');

  }

  // private calculateFinalScore(score:number) {
  //   this.score = score
  // }

  private clearTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  private saveProgress() {
    localStorage.setItem('teacherFormProgress', JSON.stringify({
      formData: this.teacherForm.value,
      quizStarted: this.quizStarted,
      currentQuestionIndex: this.currentQuestionIndex,
    }));
  }

  private loadSavedProgress() {
    const savedProgress = localStorage.getItem('teacherFormProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.teacherForm.patchValue(progress.formData);

      // Clear the selectedQuizzes array before populating it
      this.selectedQuizzes.clear();

      if (progress.formData.selectedQuizzes) {
        progress.formData.selectedQuizzes.forEach((quizId: number) => {
          this.selectedQuizzes.push(this.fb.control(quizId));
        });
      }
      this.cdr.markForCheck();
    }
  }

  private clearSavedProgress() {
    localStorage.removeItem('teacherFormProgress');
  }

  resetComponent() {
    this.clearSavedProgress();
    this.quizStarted = false;
    this.quizEnded = false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.teacherForm.reset();
    this.selectedQuizzes.clear();
    this.cdr.markForCheck();
  }

  private updateProgressBar() {
    this.progressPercentage = ((this.currentQuestionIndex + 1) / this.quizQuestions.length) * 100;
    this.cdr.markForCheck();
  }

  restartQuiz() {
    this.quizStarted = false;
    this.quizEnded = false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.loadQuizQuestions(this.quizIds);
    this.startQuiz();
  }

  onKeyDown(event: KeyboardEvent, choiceId: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.selectAnswer(choiceId);
    }
  }

  // Phone code
  CountryISO = CountryISO;
  allowedCountries: CountryISO[] = [];

  filterCountries() {
    const allCountries = Object.values(CountryISO);
    const excludedCountries = [CountryISO.Israel];
    this.allowedCountries = allCountries.filter(country => !excludedCountries.includes(country));
  }

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
}
