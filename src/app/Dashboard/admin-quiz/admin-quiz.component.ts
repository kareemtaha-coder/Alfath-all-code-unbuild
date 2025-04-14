import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuizService } from '../../Services/quiz.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { QuillModules } from 'ngx-quill';

interface Quiz {
  id: number;
  title: string;
  questions?: Question[];
}

interface Question {
  id: number;
  content: string;
  isActive: boolean;
  choices: Choice[];
}

interface Choice {
  id: number;
  content: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-admin-quiz',
  templateUrl: './admin-quiz.component.html',
  styleUrls: ['./admin-quiz.component.scss'],
})
export class AdminQuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  selectedQuiz: Quiz | null = null;
  quizForm!: FormGroup;
  questionForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  isQuizModalOpen = false;
  isQuestionModalOpen = false;
  isConfirmationModalOpen = false;
  itemToDelete: { type: 'quiz' | 'question'; id: number } | null = null;
  editMode = false;
  editQuestionMode = false;
  selectedQuestionId: number | null = null;
  loadingStates: { [key: string]: boolean } = {};
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  quillConfig: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  constructor(
    private quizService: QuizService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  private initializeForms(): void {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      NumberOfQuestions: [null, [Validators.max(50)]],
    });

    this.questionForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
      choices: this.fb.array([]),
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error('Error:', error);
    if (error.error?.errors?.length > 0) {
      error.error.errors.forEach((err: any) => {
        this.toastr.error(err.description, err.code || 'Error');
      });
    } else {
      this.toastr.error(defaultMessage, 'Error');
    }
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService
      .getQuizzes()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.quizzes = data;
          this.filteredQuizzes = data;
        },
        error: (error) => this.handleError(error, 'Failed to load quizzes'),
      });
  }

  submitQuiz(): void {
    if (this.quizForm.invalid) return;

    this.isSubmitting = true;
    const quizData = this.quizForm.value;

    const request =
      this.editMode && this.selectedQuiz
        ? this.quizService.updateQuiz(this.selectedQuiz.id, quizData)
        : this.quizService.addQuiz(quizData);

    request
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Quiz saved successfully!', 'Success');
          this.loadQuizzes();
          this.closeQuizModal();
        },
        error: (error) => this.handleError(error, 'Failed to save quiz'),
      });
  }

  submitQuestion(): void {
    if (this.questionForm.invalid || !this.selectedQuiz) return;

    const correctChoices = this.choices.controls.filter(
      (c) => c.get('isCorrect')?.value
    );
    if (correctChoices.length !== 1) {
      this.toastr.warning('Please mark exactly one correct answer', 'Warning');
      return;
    }

    this.isSubmitting = true;
    const questionData = this.questionForm.value;

    const request =
      this.editQuestionMode && this.selectedQuestionId
        ? this.quizService.updateQuizQuestion(
            this.selectedQuiz.id,
            this.selectedQuestionId,
            questionData
          )
        : this.quizService.addQuizQuestion(this.selectedQuiz.id, questionData);

    request
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Question saved successfully!', 'Success');
          this.loadQuizQuestions(this.selectedQuiz!);
          this.closeQuestionModal();
        },
        error: (error) => this.handleError(error, 'Failed to save question'),
      });
  }

  onConfirmDelete(): void {
    if (!this.itemToDelete) return;

    const serviceCall =
      this.itemToDelete.type === 'quiz'
        ? this.quizService.deleteQuiz(this.itemToDelete.id)
        : null;

    if (serviceCall) {
      serviceCall.subscribe({
        next: () => {
          this.toastr.success('Item deleted successfully!', 'Success');
          this.loadQuizzes();
          this.isConfirmationModalOpen = false;
        },
        error: (error) => this.handleError(error, 'Failed to delete item'),
      });
    }
  }

  toggleQuestionStatus(quiz: Quiz, question: Question): void {
    this.loadingStates[`question-${question.id}`] = true;
    this.quizService
      .toggleQuestionStatus(quiz.id, question.id)
      .pipe(
        finalize(() => (this.loadingStates[`question-${question.id}`] = false))
      )
      .subscribe({
        next: () => {
          question.isActive = !question.isActive;
          this.toastr.success('Question status updated!', 'Success');
        },
        error: (error) => this.handleError(error, 'Failed to update status'),
      });
  }

  private handleErrors(error: any): void {
    if (error.error?.errors?.length > 0) {
      error.error.errors.forEach((err: any) => {
        const title = err.code || 'Error';
        const message = err.description || 'An unexpected error occurred';
        this.toastr.error(message, title);
      });
    } else {
      this.toastr.error(
        'An unexpected error occurred. Please try again.',
        'Error'
      );
    }
  }

  openQuizModal(quiz?: Quiz): void {
    this.editMode = !!quiz;
    if (quiz) {
      this.quizForm.patchValue({ title: quiz.title });
      this.selectedQuiz = quiz;
    } else {
      this.quizForm.reset();
      this.selectedQuiz = null;
    }
    this.isQuizModalOpen = true;
  }

  openConfirmationModal(type: 'quiz' | 'question', id: number): void {
    this.itemToDelete = { type, id };
    this.isConfirmationModalOpen = true;
  }

  onCancelDelete(): void {
    this.isConfirmationModalOpen = false;
    this.itemToDelete = null;
  }

  loadQuizQuestions(quiz: Quiz): void {
    this.selectedQuiz = quiz;
    this.isLoading = true;
    this.quizService
      .getQuizQuestions(quiz.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          quiz.questions = data;
        },
        error: (error) => this.handleErrors(error),
      });
  }

  openQuestionModal(quiz: Quiz, question?: Question): void {
    this.selectedQuiz = quiz;
    this.editQuestionMode = !!question;
    this.selectedQuestionId = question?.id ?? null;

    // Reset form and choices
    this.questionForm.reset();
    const choices = this.questionForm.get('choices') as FormArray;
    while (choices.length) {
      choices.removeAt(0);
    }

    if (question) {
      this.questionForm.patchValue({ content: question.content });
      question.choices.forEach((choice) => {
        this.addChoiceToQuestion(choice.content, choice.isCorrect);
      });
    } else {
      // Add two empty choices by default
      this.addChoiceToQuestion();
      this.addChoiceToQuestion();
    }

    this.isQuestionModalOpen = true;
  }

  // Form Array Helpers
  get choices(): FormArray {
    return this.questionForm.get('choices') as FormArray;
  }

  createChoice(content: string = '', isCorrect: boolean = false): FormGroup {
    return this.fb.group({
      content: [content, Validators.required],
      isCorrect: [isCorrect],
    });
  }

  addChoiceToQuestion(content: string = '', isCorrect: boolean = false): void {
    const choices = this.questionForm.get('choices') as FormArray;
    choices.push(this.createChoice(content, isCorrect));
  }

  removeChoice(index: number): void {
    const choices = this.questionForm.get('choices') as FormArray;
    if (choices.length > 2) {
      choices.removeAt(index);
    }
  }

  setCorrectAnswer(selectedIndex: number): void {
    const choices = this.choices.controls;
    choices.forEach((choice, index) => {
      choice.get('isCorrect')?.setValue(index === selectedIndex);
    });
  }

  // Modal Helpers
  closeQuizModal(): void {
    this.isQuizModalOpen = false;
    this.quizForm.reset();
    this.editMode = false;
    this.selectedQuiz = null;
  }

  closeQuestionModal(): void {
    this.isQuestionModalOpen = false;
    this.questionForm.reset();
    this.editQuestionMode = false;
    this.selectedQuestionId = null;
    const choices = this.questionForm.get('choices') as FormArray;
    while (choices.length) {
      choices.removeAt(0);
    }
  }
}