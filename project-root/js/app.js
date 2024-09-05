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
            totalQuestions: 5,  // Limit to 5 questions
            randomizedQuestions: [], // To store the 5 randomized questions
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
    // Take only the first 5 questions
    this.randomizedQuestions = shuffled.slice(0, this.totalQuestions);
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
            // 回答ボタンを無効にして色を固定
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.disabled = true; // ボタンを無効化
                submitButton.style.backgroundColor = '#cccccc'; // 背景色を灰色に固定
                submitButton.style.cursor = 'not-allowed'; // カーソルを「押せない」状態に
                submitButton.classList.remove('active'); // アクティブ状態を解除
            }
        },
        checkAnswerSelected() {
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                if (this.currentAnswer) {
                    submitButton.disabled = false; // ボタンを有効化
                    submitButton.style.backgroundColor = '#4CAF50'; // 背景色を緑に戻す
                    submitButton.style.cursor = 'pointer'; // カーソルを「押せる」状態に
                } else {
                    submitButton.disabled = true; // ボタンを無効化
                    submitButton.style.backgroundColor = '#cccccc'; // 背景色を灰色に固定
                    submitButton.style.cursor = 'not-allowed'; // カーソルを「押せない」状態に
                }
            }
        },
        nextQuestion() {
            this.currentQuestionIndex++;
            this.currentAnswer = '';
            this.answered = false;

            // 回答ボタンの状態をリセット
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.disabled = true; // 次の問題では再び無効からスタート
                submitButton.style.backgroundColor = '#cccccc'; // 背景色を灰色に固定
                submitButton.style.cursor = 'not-allowed'; // カーソルを「押せない」状態に
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
                this.currentQuestionIndex = 0;
            } else {
                alert(this.texts.roomNumberPlaceholder);
            }
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
    
            // データ送信処理（必要に応じて実装）
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
            return this.questions[this.currentQuestionIndex] || {};
        },
        currentOptions() {
            return this.currentQuestion.options || [];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        }
    },
    watch: {
        currentAnswer() {
            this.checkAnswerSelected();
        }
    }
});

app.mount('#app');