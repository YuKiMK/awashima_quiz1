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
            totalQuestions: 5,  // Limit to 5 questions
            randomizedQuestions: [] // For storing the randomized questions
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
            this.randomizeQuestions();
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.answered = false;
        },
        randomizeQuestions() {
            const shuffled = [...this.questions];
            // Fisher-Yates shuffle
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            // Take the first 5 questions
            this.randomizedQuestions = shuffled.slice(0, this.totalQuestions);
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
                submitButton.classList.remove('active');
            }
        },
        checkAnswerSelected() {
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                if (this.currentAnswer) {
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '#4CAF50';
                    submitButton.style.cursor = 'pointer';
                } else {
                    submitButton.disabled = true;
                    submitButton.style.backgroundColor = '#cccccc';
                    submitButton.style.cursor = 'not-allowed';
                }
            }
        },
        nextQuestion() {
            this.currentQuestionIndex++;
            this.currentAnswer = '';
            this.answered = false;

            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.backgroundColor = '#cccccc';
                submitButton.style.cursor = 'not-allowed';
            }
        },
        login() {
            if (this.name && this.roomNumber) {
                this.loggedIn = true;
                this.currentQuestionIndex = 0;
            } else {
                alert(this.texts.roomNumberPlaceholder);
            }
        },
        showResults() {
            this.quizCompleted = true;
        },
        submitFeedback() {
            const feedbackData = {
                roomNumber: this.roomNumber,
                name: this.name,
                score: this.score,
                feedback: this.feedback
            };

            if (this.feedback.trim() !== '') {
                alert('ご感想・ご意見誠に有難うございます！');
            } else {
                alert('また問題に挑戦してみてね');
            }

            this.loggedIn = false;
            this.name = '';
            this.roomNumber = '';
            this.quizCompleted = false;
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.score = 0;
            this.answers = [];
            this.feedback = '';
            this.answered = false;
        }
    },
    mounted() {
        this.shuffleOptions();
    },
    computed: {
        currentQuestion() {
            return this.randomizedQuestions[this.currentQuestionIndex] || {};
        },
        currentOptions() {
            return this.currentQuestion.options || [];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        }
    },
    watch: {
        currentAnswer() {
            this.checkAnswerSelected();
        }
    }
});

app.mount('#app');