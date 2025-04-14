import { Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  // questions = [
  //   { question: 'What is 2 + 2?', answers: [2, 3, 4, 5], correctAnswer: 4 },
  //   { question: 'What is the capital of France?', answers: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswer: 'Paris' },
  //   // Add 8 more questions
  //   { question: 'Which planet is known as the Red Planet?', answers: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 'Mars' },
  //   { question: 'What is the boiling point of water?', answers: ['90°C', '100°C', '110°C', '120°C'], correctAnswer: '100°C' },
  //   { question: 'Who wrote "Hamlet"?', answers: ['Shakespeare', 'Hemingway', 'Tolkien', 'Doyle'], correctAnswer: 'Shakespeare' },
  //   { question: 'What is the square root of 16?', answers: [2, 3, 4, 5], correctAnswer: 4 },
  //   { question: 'What is the largest ocean?', answers: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 'Pacific' },
  //   { question: 'How many continents are there?', answers: [5, 6, 7, 8], correctAnswer: 7 },
  //   { question: 'What is the currency of Japan?', answers: ['Dollar', 'Pound', 'Yen', 'Euro'], correctAnswer: 'Yen' },
  //   { question: 'Who painted the Mona Lisa?', answers: ['Da Vinci', 'Picasso', 'Van Gogh', 'Rembrandt'], correctAnswer: 'Da Vinci' }
  // ];
  // currentQuestionIndex = 0;
  // selectedAnswer: any = null;
  // timeLeft = 30;
  // quizTimer!: Subscription;
  // result = 0;

  // constructor(private router: Router) {}

  // ngOnInit(): void {
  //   this.startTimer();
  // }

  // startTimer() {
  //   this.quizTimer = interval(1000).subscribe(() => {
  //     this.timeLeft--;
  //     if (this.timeLeft === 0) {
  //       this.nextQuestion();
  //     }
  //   });
  // }

  // selectAnswer(answer: any) {
  //   this.selectedAnswer = answer;
  // }

  // nextQuestion() {
  //   if (this.selectedAnswer === this.questions[this.currentQuestionIndex].correctAnswer) {
  //     this.result++; // Increment result on correct answer
  //   }

  //   this.currentQuestionIndex++;
  //   this.selectedAnswer = null;
  //   this.timeLeft = 30;

  //   if (this.currentQuestionIndex >= this.questions.length) {
  //     this.endQuiz();
  //   }
  // }

  // endQuiz() {
  //   this.quizTimer.unsubscribe();
  //   this.router.navigate(['/hiring'], { state: { quizResult: this.result } }); // Pass quiz result via navigation
  // }

}
