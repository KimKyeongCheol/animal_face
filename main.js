document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const mainH1 = document.querySelector('h1');

    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const progressIndicator = document.getElementById('progress-indicator');
    
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultIcon = document.getElementById('result-icon');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');
    const body = document.body;

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
    let currentLang = 'ko';
    let currentTestQuestions = [];

    const NUM_QUESTIONS_PER_TEST = 5; // Number of questions to show per test run

    // --- Language Data (questions will be loaded dynamically) ---
    const langData = {
        ko: {
            appTitle: "LOGIC-TREE",
            startScreen: {
                h2: "당신의 마인드 유형을 분석합니다.",
                p: "몇 가지 시나리오 기반 질문에 답변하고 당신의 생각 패턴을 알아보세요."
            },
            startButton: "시작하기",
            retryButton: "다시 테스트하기",
            questionPrefix: "질문",
            of: "/",
            resultScreen: {
                h2: "당신의 마인드 유형은:"
            },
            results: {
                LOGIC_MASTER: {
                    title: "논리주의 분석가 🧠",
                    description: "당신은 감정이나 불확실성에 휘둘리지 않고, 오직 데이터와 명확한 사실에 근거하여 판단하는 냉철한 마인드의 소유자입니다. 모든 상황을 객관적으로 파악하고 가장 효율적이며 합리적인 해결책을 찾아내는 데 탁월한 능력을 발휘합니다.",
                    icon: "🧠",
                    className: "result-logic"
                },
                CHAOTIC_AGENT: {
                    title: "혼돈의 에이전트 🌪️",
                    description: "당신은 예측 불가능한 에너지와 창의력으로 가득 찬 마인드입니다. 정해진 규칙이나 틀에 얽매이는 것을 싫어하며, 즉흥적이고 자유로운 방식으로 새로운 가능성을 탐색합니다. 당신의 행동은 때로는 혼란을 야기하지만, 그 속에서 혁신적인 아이디어가 탄생하곤 합니다.",
                    icon: "🌪️",
                    className: "result-chaos"
                },
                ORDERLY_GUARDIAN: {
                    title: "질서의 수호자 🛡️",
                    description: "당신은 안정과 조화를 최우선으로 생각하는 책임감 강한 마인드입니다. 사회의 규칙과 질서를 중요하게 여기며, 혼란스러운 상황에서도 평정심을 잃지 않고 체계적인 해결책을 모색합니다. 공동체의 안녕을 위해 헌신하며, 모든 것이 제자리에 있을 때 편안함을 느낍니다.",
                    icon: "🛡️",
                    className: "result-order"
                },
                EMPATHETIC_SOUL: {
                    title: "공감적 중재자 ❤️",
                    description: "당신은 타인의 감정을 깊이 이해하고 공감하는 능력이 뛰어난 따뜻한 마인드입니다. 이성적인 판단보다는 사람 사이의 관계와 감정적인 조화를 중요하게 생각하며, 갈등을 중재하고 모두가 행복할 수 있는 길을 모색합니다. 당신의 존재 자체가 주변 사람들에게 위안과 힘이 됩니다.",
                    icon: "❤️",
                    className: "result-emotion"
                }
            },
            questions: [] // Questions will be loaded dynamically
        },
        en: {
            appTitle: "LOGIC-TREE",
            startScreen: {
                h2: "Analyze Your Mind Type.",
                p: "Answer a few scenario-based questions and discover your thought patterns."
            },
            startButton: "Start Test",
            retryButton: "Retake Test",
            questionPrefix: "Question",
            of: "of",
            resultScreen: {
                h2: "Your Mind Type is:"
            },
            results: {
                LOGIC_MASTER: {
                    title: "Logic Master 🧠",
                    description: "You are a cool-headed analyst who makes decisions based solely on data and clear facts, unswayed by emotions or uncertainty. You excel at objectively grasping all situations and finding the most efficient and rational solutions.",
                    icon: "🧠",
                    className: "result-logic"
                },
                CHAOTIC_AGENT: {
                    title: "Chaotic Agent 🌪️",
                    description: "You are a mind full of unpredictable energy and creativity. You dislike being bound by fixed rules or frameworks, exploring new possibilities spontaneously and freely. Your actions sometimes cause chaos, but innovative ideas often emerge from them.",
                    icon: "🌪️",
                    className: "result-chaos"
                },
                ORDERLY_GUARDIAN: {
                    title: "Orderly Guardian 🛡️",
                    description: "You are a responsible mind that prioritizes stability and harmony. You value societal rules and order, seeking systematic solutions even in chaotic situations without losing composure. You dedicate yourself to the well-being of the community and feel at peace when everything is in its proper place.",
                    icon: "🛡️",
                    className: "result-order"
                },
                EMPATHETIC_SOUL: {
                    title: "Empathetic Soul ❤️",
                    description: "You are a warm mind with an exceptional ability to deeply understand and empathize with others' feelings. You prioritize human relationships and emotional harmony over rational judgment, mediating conflicts and seeking paths where everyone can be happy. Your very presence brings comfort and strength to those around you.",
                    icon: "❤️",
                    className: "result-emotion"
                }
            },
            questions: [] // Questions will be loaded dynamically
        }
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to load questions from JSON
    async function loadQuestions() {
        try {
            const response = await fetch('./data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            langData.ko.questions = data.ko;
            langData.en.questions = data.en;
            console.log("Questions loaded successfully from questions.json");
        } catch (error) {
            console.error("Error loading questions.json:", error);
            // Fallback to empty questions or show an error message to the user
            langData.ko.questions = [];
            langData.en.questions = [];
            alert("Error loading questions. Please ensure 'data/questions.json' exists and is correctly formatted.");
        }
    }

    function updateUI(lang) {
        const data = langData[lang];
        document.title = data.appTitle;
        mainH1.innerText = data.appTitle;
        
        // Start Screen
        if (startScreen.querySelector('h2')) startScreen.querySelector('h2').innerText = data.startScreen.h2;
        if (startScreen.querySelector('p')) startScreen.querySelector('p').innerText = data.startScreen.p;
        startBtn.innerText = data.startButton;
        retryBtn.innerText = data.retryButton; // Update retry button for language switch

        // If test screen is currently visible, update question and choices text
        if (!testScreen.classList.contains('hidden')) {
            const questionData = currentTestQuestions[currentQuestionIndex];
            if (questionData) { // Only update if there's a valid question
                questionText.innerText = questionData.text;
                progressIndicator.innerText = `${data.questionPrefix} ${currentQuestionIndex + 1} ${data.of} ${currentTestQuestions.length}`;
                
                answerButtons.innerHTML = '';
                questionData.choices.forEach((choice) => {
                    const button = document.createElement('button');
                    button.innerText = choice.text;
                    button.classList.add('answer-btn');
                    button.addEventListener('click', () => selectAnswer(choice));
                    answerButtons.appendChild(button);
                });
            }
        }
        
        // If result screen is currently visible, update result texts
        if (!resultScreen.classList.contains('hidden')) {
            const finalResult = calculateResult(); // This gets localized result data
            resultScreen.querySelector('h2').innerText = data.resultScreen.h2; // Update H2 in result
            resultTitle.innerText = finalResult.title;
            resultDescription.innerText = finalResult.description;
            resultIcon.innerText = finalResult.icon;
        }

        // Update active language button
        langKoBtn.classList.remove('active');
        langEnBtn.classList.remove('active');
        if (lang === 'ko') {
            langKoBtn.classList.add('active');
        } else if (lang === 'en') {
            langEnBtn.classList.add('active');
        }
    }

    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('logicTreeLang', lang);
        // Regenerate questions only if the test is NOT active (i.e., on start or result screen)
        if (testScreen.classList.contains('hidden')) { 
            generateRandomQuestions();
        }
        updateUI(lang);
    }

    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggleBtn.innerText = isDarkMode ? '🌙' : '☀️';
        localStorage.setItem('logicTreeTheme', isDarkMode ? 'dark' : 'light');
    }

    function loadPreferences() {
        const savedLang = localStorage.getItem('logicTreeLang');
        if (savedLang) {
            currentLang = savedLang;
        } else {
            const browserLang = navigator.language.split('-')[0];
            currentLang = (browserLang === 'ko' || browserLang === 'en') ? browserLang : 'ko';
        }
        
        const savedTheme = localStorage.getItem('logicTreeTheme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.innerText = '🌙';
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.innerText = '☀️';
        }
        generateRandomQuestions(); // Generate initial questions based on loaded lang
        updateUI(currentLang);
    }

    function generateRandomQuestions() {
        const fullQuestionPool = langData[currentLang].questions;
        // Check if questions are loaded
        if (!fullQuestionPool || fullQuestionPool.length === 0) {
            console.error("Question pool is empty. Cannot generate random questions.");
            currentTestQuestions = []; // Ensure currentTestQuestions is empty to prevent errors
            return;
        }
        const shuffledPool = shuffleArray([...fullQuestionPool]);
        currentTestQuestions = shuffledPool.slice(0, NUM_QUESTIONS_PER_TEST);
    }

    function startTest() {
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        generateRandomQuestions();
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion');
        testScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const questionData = currentTestQuestions[currentQuestionIndex];
        questionText.innerText = questionData.text;
        progressIndicator.innerText = `${langData[currentLang].questionPrefix} ${currentQuestionIndex + 1} ${langData[currentLang].of} ${currentTestQuestions.length}`;
        
        answerButtons.innerHTML = '';
        questionData.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(choice));
            answerButtons.appendChild(button);
        });
    }

    function selectAnswer(choice) {
        for (const key in choice.scores) {
            if (scores.hasOwnProperty(key)) {
                scores[key] += choice.scores[key];
            }
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < currentTestQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function calculateResult() {
        const finalScores = Object.entries(scores);
        if (finalScores.length === 0) {
            return langData[currentLang].results.LOGIC_MASTER; 
        }
        finalScores.sort((a, b) => b[1] - a[1]);
        const highestType = finalScores[0][0];

        if (langData[currentLang].results.hasOwnProperty(highestType)) {
            return langData[currentLang].results[highestType];
        } else {
            return langData[currentLang].results.LOGIC_MASTER;
        }
    }

    function showResult() {
        const finalResult = calculateResult();
        resultTitle.innerText = finalResult.title;
        resultDescription.innerText = finalResult.description;
        resultIcon.innerText = finalResult.icon;
        resultScreen.classList.add(finalResult.className);

        testScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
    
    function restartTest() {
      resultScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
      resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion');
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startTest);
    retryBtn.addEventListener('click', restartTest);
    themeToggleBtn.addEventListener('click', toggleTheme);
    langKoBtn.addEventListener('click', () => switchLanguage('ko'));
    langEnBtn.addEventListener('click', () => switchLanguage('en'));

    // --- Ad Hiding Functionality ---
    function hideEmptyAdContainers() {
        const adContainers = document.querySelectorAll('.ad-top, .ad-bottom, .ad-side-left, .ad-side-right');
        adContainers.forEach(container => {
            if (container.innerHTML.trim() === '') {
                container.classList.add('hidden');
            }
        });
    }

    // Load questions then preferences and hide empty ads on initial load
    loadQuestions().then(() => {
        loadPreferences();
        hideEmptyAdContainers();
    });
});