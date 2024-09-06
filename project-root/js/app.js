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
            limitedQuestions: [],  // 5問限定のリスト
            roomNumberPlaceholder: '',
            namePlaceholder: '',
            startQuizButton: '',
            musicNotes: [],
            notes: ['♪', '♫', '♬', '♩', '♭', '♮'],
            numNotes: 7
        };
    },
    created() {
        this.loadLanguageData(this.selectedLanguage);
    },

    mounted() {
        this.generateInitialNotes();
    },

    methods: {   
        loadLanguageData(language) {
            if (language === 'ja') {
                this.texts = textsDataJa;
                this.questions = this.prepareQuestions(questionsDataJa);
            } else if (language === 'en') {
                this.texts = textsDataEn;
                this.questions = this.prepareQuestions(questionsDataEn);
            } else if (language === 'zh') {
                this.texts = textsDataZh;
                this.questions = this.prepareQuestions(questionsDataZh);
            }
            this.shuffleQuestions();
            
            // 各言語のプレースホルダーとボタンのテキストを更新
            this.roomNumberPlaceholder = this.texts.roomNumberPlaceholder;
            this.namePlaceholder = this.texts.namePlaceholder;
            this.startQuizButton = this.texts.startQuizButton;

            this.resetQuiz();
        },

        prepareQuestions(questions) {
            return questions.map(q => ({
                ...q,
                options: this.shuffleArray([...q.options]),
                originalIndex: q.options.indexOf(q.correct)
            }));
        },

        shuffleQuestions() {
            this.limitedQuestions = this.shuffleArray([...this.questions]).slice(0, 5);
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        submitAnswer() {
            this.answered = true;
            this.answers[this.currentQuestionIndex] = this.currentAnswer;

            // 正解のチェックを修正
            const currentQuestion = this.limitedQuestions[this.currentQuestionIndex];
            if (this.currentAnswer === currentQuestion.options[currentQuestion.originalIndex]) {
                this.score++;
            }

            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.backgroundColor = '#cccccc';
                submitButton.style.cursor = 'not-allowed';
                submitButton.classList.remove('active');
            }

            // 自動的に次の質問に進まないようにします
            // 最後の質問でない場合は、nextQuestionボタンが表示されます
            // 最後の質問の場合は、showResultsボタンが表示されます
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.limitedQuestions.length - 1) {
                this.currentQuestionIndex++;
                this.currentAnswer = '';
                this.answered = false;
                this.checkAnswerSelected();
            }
        },
        showResults() {
            this.quizCompleted = true;
        },

        checkAnswerSelected() {
            const submitButton = document.querySelector('.btn-primary');
            if (submitButton) {
                submitButton.disabled = !this.currentAnswer;
                submitButton.style.backgroundColor = this.currentAnswer ? '#4CAF50' : '#cccccc';
                submitButton.style.cursor = this.currentAnswer ? 'pointer' : 'not-allowed';
            }
        },
        login() {
            if (this.name && this.roomNumber) {
                this.loggedIn = true;
                this.resetQuiz();
            } else {
                alert(this.texts.loginError || 'Please enter both name and room number.');
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

            alert(this.feedback.trim() !== '' ? this.texts.thankYouFeedback : this.texts.tryAgain);

            console.log('Feedback submitted:', feedbackData);
            this.resetQuiz();
            this.loggedIn = false;
        },
        resetQuiz() {
            this.quizCompleted = false;
            this.currentQuestionIndex = 0;
            this.currentAnswer = '';
            this.score = 0;
            this.answers = [];
            this.feedback = '';
            this.answered = false;
            this.shuffleQuestions();
        },
        changeLanguage() {
            this.loadLanguageData(this.selectedLanguage);
        },

        generateInitialNotes() {
            for (let i = 0; i < this.numNotes; i++) {
                this.addNote();
            }
        },
        addNote() {
            const note = {
                id: Date.now() + Math.random(),
                symbol: this.notes[Math.floor(Math.random() * this.notes.length)],
                top: `${Math.random() * 80 + 10}vh`,
                left: `${Math.random() * 80 + 10}vw`,
                fontSize: `${20 + Math.random() * 30}px`,
                opacity: 0.2
            };
            this.musicNotes.push(note);
        },
        removeNote(noteId) {
            const index = this.musicNotes.findIndex(note => note.id === noteId);
            if (index !== -1) {
                this.musicNotes[index].opacity = 0;
                setTimeout(() => {
                    this.musicNotes.splice(index, 1);
                    this.addNote();  // 新しい音符を追加
                }, 1000);
            }
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
        },
        selectedLanguage() {
            this.changeLanguage();
        }
    }
});

app.component('music-notes', {
    template: `
        <div>
            <div v-for="note in musicNotes" :key="note.id" 
                class="music-note" 
                :style="{ top: note.top, left: note.left, fontSize: note.fontSize, opacity: note.opacity }"
                @click="$emit('remove-note', note.id)">
                {{ note.symbol }}
            </div>
        </div>
    `,
    props: ['musicNotes']
});

app.mount('#app');
