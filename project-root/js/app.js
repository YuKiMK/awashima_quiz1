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
            limitedQuestions: []  // 5問限定のリスト
        };
    },
    created() {
        this.loadLanguageData(this.selectedLanguage);
    },
    methods: {
        loadLanguageData(language) {
            if (language === 'ja') {
                this.texts = textsDataJa;
                this.questions = this.shuffleArray(questionsDataJa).slice(0, 5); // 8問からランダムに5問取得
            } else if (language === 'en') {
                this.texts = textsDataEn;
                this.questions = this.shuffleArray(questionsDataEn).slice(0, 5);
            } else if (language === 'zh') {
                this.texts = textsDataZh;
                this.questions = this.shuffleArray(questionsDataZh).slice(0, 5);
            }
            this.limitedQuestions = this.questions;
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.answered = false;
        },
        changeLanguage() ‹
            this.loadLanguageData (this.selectedLanguage);
        },
        shuffleArray(array) {
            // Fisher-Yatesアルゴリズムでシャッフル
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
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
                    note.style.opacity = 0.2;
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
                
                this.loadLanguageData(this.selectedLanguage);  // クイズの質問をロードする
                this.shuffleQuestions();  // 質問をシャッフルする
                this.currentQuestionIndex = 0; // クイズを最初の質問からスタート
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

            // 初期状態に戻す
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

            console.log('Feedback submitted:', feedbackData);
        }
    },
    mounted() {
        this.shuffleQuestions();
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
                    this.reappearNote();
                }, 1000);
            });
            document.body.appendChild(note);
        }
    },
    
    computed: {
        currentQuestion() {
            return this.limitedQuestions[this.currentQuestionIndex] || {};
        },
        currentOptions() {
            return this.currentQuestion.options || [];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex + 1) / this.limitedQuestions.length) * 100;
        }
    },
    watch: {
        currentAnswer() {
            this.checkAnswerSelected();
        }
    }
});

app.mount('#app');