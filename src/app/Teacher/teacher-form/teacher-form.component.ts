import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TeacherService } from '../../Services/teacher.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject, interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';


interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

type Field = 'Field1' | 'Field2' | 'Field3' | 'Field4';

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
  ]
})
export class TeacherFormComponent implements OnInit, OnDestroy {
  teacherForm!: FormGroup;
  fields: Field[] = ['Field1', 'Field2', 'Field3', 'Field4'];
  teacherFormProgress:any = localStorage.getItem('teacherFormProgress');
  selectedField!: Field | null ;
  quizQuestions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  quizStarted = false;
  quizEnded = false;
  timeLeft = 30;
  timer: any;
  score = 0;
  isHovered = false;
  fieldSelected = false;
  isLoading = false;
  submitted = false;
  progressPercentage = 0;
  errorMessage = '';
  submissionSuccessful = false;
  private destroy$ = new Subject<void>();

  questions: { [key in Field]: QuizQuestion[] } = {
    Field1: [
      { question: 'Field1 Question 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field1 Question 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field1 Question 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field1 Question 4?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field1 Question 5?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field1 Question 6?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field1 Question 7?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field1 Question 8?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field1 Question 9?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field1 Question 10?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1},
    ],
    Field2: [
      { question: 'Field2 Question 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field2 Question 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field2 Question 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field2 Question 4?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field2 Question 5?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field2 Question 6?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field2 Question 7?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field2 Question 8?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field2 Question 9?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field2 Question 10?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2},
    ],
    Field3: [
      { question: 'Field3 Question 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field3 Question 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field3 Question 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field3 Question 4?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field3 Question 5?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field3 Question 6?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field3 Question 7?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field3 Question 8?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field3 Question 9?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field3 Question 10?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3},
    ],
    Field4: [
      { question: 'Field4 Question 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field4 Question 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field4 Question 3?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field4 Question 4?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field4 Question 5?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field4 Question 6?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
      { question: 'Field4 Question 7?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1 },
      { question: 'Field4 Question 8?', options: ['A', 'B', 'C', 'D'], correctAnswer: 2 },
      { question: 'Field4 Question 9?', options: ['A', 'B', 'C', 'D'], correctAnswer: 3 },
      { question: 'Field4 Question 10?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0},
    ],
  };

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit() {
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
      dateOfBirth: ['', [Validators.required, this.ageValidator]]
    });

    this.teacherForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.saveProgress());
  }

  private ageValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return (age >= 18 && age <= 65) ? null : { 'invalidAge': true };
    }
    return null;
  }

  selectField(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedField = target.value as Field;
    this.quizQuestions = this.shuffleQuestions(this.questions[this.selectedField]);
    this.fieldSelected = true;
    this.cdr.markForCheck();
    
  }

  private shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
    return [...questions].sort(() => Math.random() - 0.5);
  }

  startQuiz() {
    if (this.quizQuestions.length > 0) {
      this.quizStarted = true;
      this.quizEnded = false;
      this.currentQuestionIndex = 0;
      this.startTimer();
      this.updateProgressBar();
    }
  }

  startTimer() {
    this.clearTimer();
    this.timeLeft = 30;
    this.timer = interval(1000).pipe(
      takeUntil(this.destroy$),
      take(31)
    ).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.nextQuestion();
      }
      this.cdr.markForCheck();
    });
  }

  nextQuestion() {
    this.clearTimer();
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
      this.updateProgressBar();
    } else {
      this.endQuiz();
    }
  }

  selectAnswer(optionIndex: number) {
    this.quizQuestions[this.currentQuestionIndex].userAnswer = optionIndex;
    this.nextQuestion();
  }

  endQuiz() {
    this.clearTimer();
    this.quizEnded = true;
    this.calculateFinalScore();
    this.cdr.markForCheck();
  }

  submitTeacherData() {
    if (this.selectedField && this.teacherForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const teacherData = {
        ...this.teacherForm.value,
        examResult: `${this.score}/${this.quizQuestions.length}`,
        education: `${this.selectedField} - ${this.teacherForm.value.education}`,
        phone:  `${JSON.parse(localStorage.getItem('teacherFormProgress')!).formData.phone}`
        
      };

      this.teacherService.submitTeacherData(teacherData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.submitted = true;
          this.submissionSuccessful = true;
          this.clearSavedProgress();
          console.log("Success", response);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while submitting your data. Please try again.';
          console.error("Error submitting data", error);
          this.cdr.markForCheck();
        }
      });
    }
  }

  private calculateFinalScore() {
    this.score = this.quizQuestions.reduce((total, question) => {
      return total + (question.userAnswer === question.correctAnswer ? 1 : 0);
    }, 0);
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  private clearTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  private saveProgress() {
    if( this.teacherForm.value.phone !=null){
      this.teacherForm.value.phone = this.teacherForm.value.phone.internationalNumber 
    }
    localStorage.setItem('teacherFormProgress', JSON.stringify({
      formData: this.teacherForm.value,
      selectedField: this.selectedField,
      quizStarted: this.quizStarted,
      currentQuestionIndex: this.currentQuestionIndex,
    }));
  }

  private loadSavedProgress() {
    const savedProgress = localStorage.getItem('teacherFormProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.teacherForm.patchValue(progress.formData);
      this.selectedField = progress.selectedField;
      this.quizStarted = progress.quizStarted;
      this.currentQuestionIndex = progress.currentQuestionIndex;
      if (this.selectedField) {
        this.quizQuestions = this.questions[this.selectedField];
        this.fieldSelected = true;
      }
      this.cdr.markForCheck();
    }
  }

  public clearSavedProgress() {
    localStorage.removeItem('teacherFormProgress');
  }




  resetComponent() {
    this.clearSavedProgress();
    this.fieldSelected = false;
    this.quizStarted = false;
    this.quizEnded = false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.teacherForm.reset();
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
    this.quizQuestions = this.shuffleQuestions(this.questions[this.selectedField!]);
    this.startQuiz();
  }

  onKeyDown(event: KeyboardEvent, optionIndex: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.selectAnswer(optionIndex);
    }
  }




  //phone code
  CountryISO = CountryISO;
  allowedCountries: CountryISO[] = [];


  filterCountries() {
    const allCountries = Object.values(CountryISO);

    const excludedCountries = [
      CountryISO.Israel
      
    ];

    this.allowedCountries = allCountries.filter(
      country => !excludedCountries.includes(country)
    );
  }



  separateDialCode = false;
	SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

	changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}
}