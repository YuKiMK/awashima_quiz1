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
            questions: []
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
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.answered = false;
        },
        changeLanguage() {
            this.loadLanguageData(this.selectedLanguage);
        },
        shuffleQuestions() {
            for (let i = this.questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
            }
        },
        shuffleOptions() {
            this.questions.forEach(question => {
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
        },
        reappearNote() {
            setTimeout(() => {
                const note = document.createElement('div');
                const notes = ['♪', '♫', '♬', '♩', '♭', '♮'];
                note.className = 'music-note';
                note.style.top = `${Math.random() * 80 + 10}vh`;
                note.style.left = `${Math.random() * 80 + 10}vw`;
                note.style.fontSize = `${20 + Math.random() * 30}px`;
                note.style.opacity = 0;
                note.textContent = notes[Math.floor(Math.random() * notes.length)];
                document.body.appendChild(note);
                setTimeout(() => {
                    note.style.opacity = 0.4;
                }, 100);
                note.addEventListener('click', () => {
                    note.classList.add('fade-out');
                    setTimeout(() => {
                        note.remove();
                        this.reappearNote();
                    }, 1000);
                });
            }, 3000);
        },
        login() {
            if (this.name && this.roomNumber) {
                this.loggedIn = true;
                this.currentQuestionIndex = 0;
            } else {
                alert(this.texts.roomNumberPlaceholder);
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
            const feedbackData = {
                roomNumber: this.roomNumber,
                name: this.name,
                score: this.score,
                feedback: this.feedback
            };

            console.log('Feedback submitted:', feedbackData);
            alert('ご意見ありがとうございます！');
        }
    },
    mounted() {
        this.shuffleQuestions();
        this.shuffleOptions();
        const notes = ['♪', '♫', '♬', '♩', '♭', '♮'];
        const numNotes = 10;
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
                    this.reappearNote();
                }, 1000);
            });
            document.body.appendChild(note);
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex] || {};
        },
        currentOptions() {
            return this.currentQuestion.options || [];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        }
    }
});

app.mount('#app');
