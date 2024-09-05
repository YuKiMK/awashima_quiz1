const app = Vue.createApp({
    data() {
        return {
            loggedIn: false,
            name: '',
            roomNumber: '',
            quizCompleted: false,
            currentQuestionIndex: 0,
            currentAnswer: '',
            score: 0,
            answers: [],
            selectedLanguage: 'ja',
            answered: false,
            feedback: '',
            texts: {},
            questions: [],
            randomizedQuestions: []
        };
    },
    created() {
        this.loadLanguageData(this.selectedLanguage);
    },
    methods: {
        loadLanguageData(language) {
            if (language === 'ja') {
                this.texts = textsDataJa;
                this.questions = questionsDataJa;
            } else if (language === 'en') {
                this.texts = textsDataEn;
                this.questions = questionsDataEn;
            } else if (language === 'zh') {
                this.texts = textsDataZh;
                this.questions = questionsDataZh;
            }
            this.shuffleQuestions();
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.answered = false;
        },
        shuffleQuestions() {
            const shuffled = [...this.questions];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            this.randomizedQuestions = shuffled.slice(0, 5); // 5問だけをランダムで選択
        },
        shuffleOptions() {
            this.randomizedQuestions.forEach(question => {
                for (let i = question.options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
                }
            });
        },
        submitAnswer() {
            this.answered = true;
            this.answers[this.currentQuestionIndex] = this.currentAnswer;

            if (this.currentAnswer === this.currentQuestion.correct) {
                this.score++;
            }
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.backgroundColor = '#cccccc';
                submitButton.style.cursor = 'not-allowed';
            }
        },
        nextQuestion() {
            this.currentQuestionIndex++;
            this.currentAnswer = '';
            this.answered = false;
        },
        showResults() {
            this.quizCompleted = true;
        },
        shareResults() {
            const scoreMessage = `淡島クイズで${this.score}点を獲得しました！`;
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(scoreMessage)}`;
            window.open(url, '_blank');
        },
        submitFeedback() {
            if (this.feedback) {
                alert('ご感想・ご意見誠に有難うございます！');
            } else {
                alert('また問題に挑戦してみてね');
            }
            this.resetQuiz();
        },
        resetQuiz() {
            this.loggedIn = false;
            this.quizCompleted = false;
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.score = 0;
            this.answers = [];
            this.feedback = '';
            this.shuffleQuestions(); // クイズをリセットして再シャッフル
        }
    },
    mounted() {
        this.shuffleOptions();
        const notes = ['♪', '♫', '♬', '♩', '♭', '♮'];
        const numNotes = 7;
        for (let i = 0; i < numNotes; i++) {
            const note = document.createElement('div');
            note.className = 'music-note';
            note.style.top = `${Math.random() * 80 + 10}vh`;
            note.style.left = `${Math.random() * 80 + 10}vw`;
            note.style.fontSize = `${20 + Math.random() * 30}px`;
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.addEventListener('click', () => {
                note.classList.add('fade-out');
                setTimeout(() => {
                    note.remove();
                }, 1000);
            });
            document.body.appendChild(note);
        }
    },
    computed: {
        currentQuestion() {
            return this.randomizedQuestions[this.currentQuestionIndex] || {};
        },
        currentOptions() {
            return this.currentQuestion.options || [];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex + 1) / this.randomizedQuestions.length) * 100;
        },
        displayedQuestions() {
            return this.randomizedQuestions.slice(0, this.currentQuestionIndex + 1);
        }
    }
});

app.mount('#app');
