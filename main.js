document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const testScreen = document.getElementById('test-screen');
    const resultScreen = document.getElementById('result-screen');

    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const mainH1 = document.querySelector('h1'); // Reference to the main h1 tag

    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const progressIndicator = document.getElementById('progress-indicator');
    
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const resultIcon = document.getElementById('result-icon');

    // Theme and Language Switchers
    const themeToggleBtn = document.getElementById('theme-toggle');
    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');
    const body = document.body;

    let currentQuestionIndex = 0;
    let scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
    let currentLang = 'ko'; // Default language

    // --- Language Data ---
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
            questions: [
                {
                    text: "길을 가다가 값비싸 보이는 지갑을 주웠다...",
                    choices: [
                        { text: "가까운 경찰서에 바로 가져다준다.", scores: { order: 1 } },
                        { text: "주인을 찾아주기 위해 지갑을 열어 신분증을 확인한다.", scores: { chaos: 1, emotion: 1 } },
                        { text: "내용물만 챙기고 지갑은 버린다.", scores: { chaos: 2 } },
                        { text: "고민하다가 일단 주머니에 넣고 계속 길을 간다.", scores: { logic: 1, chaos: 1 } }
                    ]
                },
                {
                    text: "팀 프로젝트에서 아무도 힘든 역할을 맡으려 하지 않는다...",
                    choices: [
                        { text: "모두를 위해 내가 총대를 메고 힘든 역할을 자처한다.", scores: { emotion: 1, order: 1 } },
                        { text: "가장 합리적이고 공정한 방법으로 역할을 분담하자고 제안한다.", scores: { logic: 2 } },
                        { text: "일단 상황을 지켜보다가, 누군가 하겠지 하고 기다린다.", scores: { chaos: 1 } },
                        { text: "이 상황을 재밌어하며, 누가 맡게 될지 내기를 제안한다.", scores: { chaos: 2, emotion: 1 } }
                    ]
                },
                {
                    text: "내일이 세상의 마지막 날이라는 것이 확실해졌다...",
                    choices: [
                        { text: "사랑하는 사람들과 마지막 순간을 함께 보낸다.", scores: { emotion: 2 } },
                        { text: "혼란 속에서 질서를 유지하기 위해 사람들을 돕는다.", scores: { order: 2 } },
                        { text: "평소에 해보고 싶었던 모든 일(합법 또는 불법)을 시도한다.", scores: { chaos: 2 } },
                        { text: "이 현상이 과학적으로 가능한지, 어떻게든 살아남을 방법은 없는지 분석한다.", scores: { logic: 2 } }
                    ]
                },
                {
                    text: "매우 중요한 시험 전날, 친구가 급한 고민 상담을 요청했다...",
                    choices: [
                        { text: "시험이 중요하지만, 친구를 외면할 수 없어 이야기를 들어준다.", scores: { emotion: 2 } },
                        { text: "친구에게 상황을 설명하고, 시험이 끝난 직후에 바로 만나자고 약속한다.", scores: { logic: 1, order: 1 } },
                        { text: "일단 공부를 계속하며, 메시지로 간간이 답장해준다.", scores: { logic: 2 } },
                        { text: "모르겠다. 일단 같이 술이나 한잔하자고 한다.", scores: { chaos: 2 } }
                    ]
                }
            ]
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
            questions: [
                {
                    text: "IF you found a valuable-looking wallet on the street...",
                    choices: [
                        { text: "Immediately take it to the nearest police station.", scores: { order: 1 } },
                        { text: "Open the wallet to find ID and return it to the owner.", scores: { chaos: 1, emotion: 1 } },
                        { text: "Take only the contents and discard the wallet.", scores: { chaos: 2 } },
                        { text: "Hesitate, put it in your pocket for now, and keep walking.", scores: { logic: 1, chaos: 1 } }
                    ]
                },
                {
                    text: "IF no one wants to take on a difficult role in a team project...",
                    choices: [
                        { text: "I volunteer for the tough role for the sake of everyone.", scores: { emotion: 1, order: 1 } },
                        { text: "I suggest a rational and fair method to distribute roles.", scores: { logic: 2 } },
                        { text: "I'll observe the situation, assuming someone else will do it.", scores: { chaos: 1 } },
                        { text: "I find the situation amusing and propose a bet on who will take the role.", scores: { chaos: 2, emotion: 1 } }
                    ]
                },
                {
                    text: "IF it was certain that tomorrow is the last day of the world...",
                    choices: [
                        { text: "Spend the last moments with loved ones.", scores: { emotion: 2 } },
                        { text: "Help people maintain order amidst chaos.", scores: { order: 2 } },
                        { text: "Try everything I've always wanted to do (legal or illegal).", scores: { chaos: 2 } },
                        { text: "Analyze if this phenomenon is scientifically possible, and if there's any way to survive.", scores: { logic: 2 } }
                    ]
                },
                {
                    text: "IF the day before a very important exam, a friend urgently asks for advice...",
                    choices: [
                        { text: "The exam is important, but I can't ignore a friend, so I listen.", scores: { emotion: 2 } },
                        { text: "I explain the situation to my friend and promise to meet right after the exam.", scores: { logic: 1, order: 1 } },
                        { text: "I continue studying, replying to messages occasionally.", scores: { logic: 2 } },
                        { text: "I don't know. I just suggest having a drink together.", scores: { chaos: 2 } }
                    ]
                }
            ]
        }
    };

    function updateUI(lang) {
        const data = langData[lang];
        document.title = data.appTitle;
        mainH1.innerText = data.appTitle;
        
        // Start Screen
        if (startScreen.querySelector('h2')) startScreen.querySelector('h2').innerText = data.startScreen.h2;
        if (startScreen.querySelector('p')) startScreen.querySelector('p').innerText = data.startScreen.p;
        startBtn.innerText = data.startButton;

        // Result Screen
        if (resultScreen.querySelector('h2')) resultScreen.querySelector('h2').innerText = data.resultScreen.h2;
        retryBtn.innerText = data.retryButton;

        // Update current question text if on test screen
        if (!testScreen.classList.contains('hidden') && questions[currentQuestionIndex]) {
            questionText.innerText = data.questions[currentQuestionIndex].text;
            progressIndicator.innerText = `${data.questionPrefix} ${currentQuestionIndex + 1} ${data.of} ${data.questions.length}`;
            // Re-render answer buttons for current language
            answerButtons.innerHTML = '';
            data.questions[currentQuestionIndex].choices.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice.text;
                button.classList.add('answer-btn');
                // Pass original score object, not localized text
                const originalChoice = langData['ko'].questions[currentQuestionIndex].choices.find(c => c.text === langData[currentLang].questions[currentQuestionIndex].choices.find(lc => lc.text === choice.text).text);
                button.addEventListener('click', () => selectAnswer(originalChoice));
                answerButtons.appendChild(button);
            });
        }
        // If result screen is visible, update result texts
        if (!resultScreen.classList.contains('hidden')) {
            const finalResult = calculateResult(); // Recalculate based on original scores
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
        updateUI(lang);
    }

    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggleBtn.innerText = isDarkMode ? '🌙' : '☀️';
        localStorage.setItem('logicTreeTheme', isDarkMode ? 'dark' : 'light');
    }

    function loadPreferences() {
        // Load Language Preference
        const savedLang = localStorage.getItem('logicTreeLang');
        if (savedLang) {
            currentLang = savedLang;
        } else {
            // Auto-detect browser language if no preference saved
            const browserLang = navigator.language.split('-')[0]; // e.g., 'en' from 'en-US'
            currentLang = (browserLang === 'ko' || browserLang === 'en') ? browserLang : 'ko';
        }
        updateUI(currentLang);

        // Load Theme Preference
        const savedTheme = localStorage.getItem('logicTreeTheme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.innerText = '🌙';
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.innerText = '☀️';
        }
    }

    function startTest() {
        currentQuestionIndex = 0;
        scores = { logic: 0, emotion: 0, order: 0, chaos: 0 };
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        resultScreen.classList.remove('result-logic', 'result-chaos', 'result-order', 'result-emotion');
        testScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        const questionData = langData[currentLang].questions[currentQuestionIndex]; // Use localized question
        questionText.innerText = questionData.text;
        progressIndicator.innerText = `${langData[currentLang].questionPrefix} ${currentQuestionIndex + 1} ${langData[currentLang].of} ${langData[currentLang].questions.length}`;
        
        answerButtons.innerHTML = '';
        questionData.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.innerText = choice.text;
            button.classList.add('answer-btn');
            // Pass the original score object from the base language (ko) to selectAnswer
            // This ensures scores are consistently applied regardless of displayed language
            const originalChoice = langData['ko'].questions[currentQuestionIndex].choices[index];
            button.addEventListener('click', () => selectAnswer(originalChoice));
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

        if (currentQuestionIndex < langData[currentLang].questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function calculateResult() {
        const finalScores = Object.entries(scores);
        finalScores.sort((a, b) => b[1] - a[1]);
        const highestType = finalScores[0][0];

        // Return localized result data
        return langData[currentLang].results[highestType];
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

    // Load user preferences on initial load
    loadPreferences();
});