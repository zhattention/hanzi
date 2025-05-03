document.addEventListener('DOMContentLoaded', () => {
    // 按课程分组的汉字
    const lessons = [
        { id: 1, name: "第1课", chars: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百'] },
        { id: 2, name: "第2课", chars: ['人', '头', '目', '耳', '口', '手', '足', '大', '小', '多', '少'] },
        { id: 3, name: "第3课", chars: ['日', '月', '山', '石', '田', '水', '火', '土', '木', '禾'] },
        { id: 4, name: "第4课", chars: ['上', '下', '左', '右', '中', '来', '去', '出', '入', '坐', '立', '走'] },
        { id: 5, name: "第5课", chars: ['风', '雨', '雪', '云', '电', '天', '春', '夏', '秋', '冬', '地'] },
        { id: 6, name: "第6课", chars: ['马', '羊', '牛', '虫', '鸟', '草', '黄', '红', '蓝', '绿', '白'] },
        { id: 7, name: "第7课", chars: ['学', '生', '我', '是', '爱', '老', '师', '同', '文', '校'] },
        { id: 8, name: "第8课", chars: ['开', '了', '真', '高', '兴', '车', '见', '说', '早', '你', '们', '好'] },
        { id: 9, name: "第9课", chars: ['的', '家', '这', '有', '爷', '奶', '爸', '妈', '和'] },
        { id: 10, name: "第10课", chars: ['花', '园', '门', '前', '个', '他', '后', '外', '年', '季', '儿', '看'] },
        { id: 11, name: "第11课", chars: ['认', '方', '向', '面', '太', '阳', '东', '西', '南', '北'] },
        { id: 12, name: "第12课", chars: ['新', '到', '热', '闹', '穿', '衣', '戴', '帽', '祝', '身', '体', '习'] },
        { id: 13, name: "第13课", chars: ['又', '两', '不', '见', '长', '鞋', '子', '它', '最', '忙', '色', '自', '飞', '里', '爬', '游', '林', '她', '就', '像', '对', '书', '包', '要', '放', '回', '给', '完', '把', '公', '朵', '可', '玫', '菊', '兰', '象', '朋', '友', '猪', '起', '过', '团', '快', '乐', '平', '安'] }
    ];
    
    // 创建课程选择UI
    function createLessonSelectors() {
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'lesson-selector-container';
        selectorContainer.innerHTML = '<h3>选择课程:</h3>';
        
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'lesson-checkboxes';
        
        lessons.forEach(lesson => {
            const lessonWrapper = document.createElement('div');
            lessonWrapper.className = 'lesson-wrapper';
            
            // 创建课程标签和复选框
            const lessonLabel = document.createElement('label');
            lessonLabel.className = 'lesson-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = lesson.id;
            checkbox.id = `lesson-${lesson.id}`;
            checkbox.checked = lesson.id === 1; // 默认选中第一课
            
            lessonLabel.appendChild(checkbox);
            lessonLabel.appendChild(document.createTextNode(` ${lesson.name}`));
            
            // 创建汉字预览
            const charsPreview = document.createElement('div');
            charsPreview.className = 'chars-preview';
            charsPreview.textContent = lesson.chars.join(' ');
            
            // 将标签和汉字预览添加到包装器
            lessonWrapper.appendChild(lessonLabel);
            lessonWrapper.appendChild(charsPreview);
            
            checkboxContainer.appendChild(lessonWrapper);
        });
        
        // 添加全选/全不选按钮
        const allContainer = document.createElement('div');
        allContainer.className = 'select-all-container';
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = '全选';
        selectAllBtn.className = 'select-all-btn';
        selectAllBtn.onclick = () => {
            document.querySelectorAll('.lesson-checkbox input').forEach(cb => {
                cb.checked = true;
            });
        };
        
        const selectNoneBtn = document.createElement('button');
        selectNoneBtn.textContent = '全不选';
        selectNoneBtn.className = 'select-none-btn';
        selectNoneBtn.onclick = () => {
            document.querySelectorAll('.lesson-checkbox input').forEach(cb => {
                cb.checked = false;
            });
        };
        
        // 添加开始游戏按钮
        const startGameBtn = document.createElement('button');
        startGameBtn.textContent = '开始测试';
        startGameBtn.className = 'start-game-btn';
        startGameBtn.onclick = startGame;
        
        allContainer.appendChild(selectAllBtn);
        allContainer.appendChild(selectNoneBtn);
        
        selectorContainer.appendChild(checkboxContainer);
        selectorContainer.appendChild(allContainer);
        selectorContainer.appendChild(startGameBtn);
        
        // 把选择器添加到页面
        const container = document.querySelector('.container');
        container.insertBefore(selectorContainer, container.firstChild);
        
        // 隐藏游戏区域和结果面板，直到用户选择课程并开始
        document.querySelector('.game-container').style.display = 'none';
        document.querySelector('#results').classList.add('hidden');
        
        // 隐藏记分板，在游戏开始时才显示
        document.querySelector('.score-display').style.display = 'none';
    }
    
    // 从选中的课程中获取字符
    function getSelectedCharacters() {
        const selectedLessons = [];
        document.querySelectorAll('.lesson-checkbox input:checked').forEach(checkbox => {
            const lessonId = parseInt(checkbox.value);
            selectedLessons.push(lessonId);
        });
        
        if (selectedLessons.length === 0) {
            alert('请至少选择一个课程！');
            return null;
        }
        
        // 收集所有选中课程的汉字
        let selectedChars = [];
        selectedLessons.forEach(lessonId => {
            const lesson = lessons.find(l => l.id === lessonId);
            if (lesson) {
                selectedChars = [...selectedChars, ...lesson.chars];
            }
        });
        
        return selectedChars;
    }
    
    // 开始游戏函数
    function startGame() {
        const selectedChars = getSelectedCharacters();
        if (!selectedChars) return;
        
        // 清除可能存在的计时器
        if (gameState.timer) {
            clearTimeout(gameState.timer);
            gameState.timer = null;
        }
        
        // 隐藏课程选择器
        document.querySelector('.lesson-selector-container').style.display = 'none';
        
        // 更新游戏状态，使用选中的字符
        const shuffledChars = shuffleArray(selectedChars);
        gameState = {
            currentIndex: 0,
            score: 0,
            total: 0,
            knownCharacters: [],
            uncertainCharacters: [],
            unknownCharacters: [],
            shuffledCharacters: shuffledChars,
            soundEnabled: gameState.soundEnabled,
            timer: null,
            timeLimit: 8000
        };
        
        // 重置UI并显示游戏区域和记分板
        scoreElement.textContent = '0';
        totalElement.textContent = '0';
        document.querySelector('.game-container').style.display = 'flex';
        document.querySelector('.score-display').style.display = 'inline-block';
        
        // 开始游戏
        displayCurrentCharacter();
    }
    
    // Function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // 修改重新开始函数，返回到课程选择页面
    function restartGame() {
        // 清除可能存在的计时器
        if (gameState.timer) {
            clearTimeout(gameState.timer);
            gameState.timer = null;
        }
        
        // 移除计时器进度条（如果存在）
        const timerBar = document.getElementById('timer-bar');
        if (timerBar) {
            timerBar.remove();
        }
        
        // 重置游戏状态
        gameState = {
            currentIndex: 0,
            score: 0,
            total: 0,
            knownCharacters: [],
            uncertainCharacters: [],
            unknownCharacters: [],
            shuffledCharacters: [],
            soundEnabled: gameState.soundEnabled,
            timer: null,
            timeLimit: 3000
        };
        
        // 重置UI
        scoreElement.textContent = '0';
        totalElement.textContent = '0';
        resultsDiv.classList.add('hidden');
        gameContainer.style.display = 'none';
        
        // 隐藏记分板
        document.querySelector('.score-display').style.display = 'none';
        
        // 显示课程选择器
        document.querySelector('.lesson-selector-container').style.display = 'block';
    }
    
    // Game state
    let gameState = {
        currentIndex: 0,
        score: 0,
        total: 0,
        knownCharacters: [],
        uncertainCharacters: [],
        unknownCharacters: [],
        shuffledCharacters: [],
        soundEnabled: true,
        timer: null,
        timeLimit: 3000
    };
    
    // DOM elements
    const characterDisplay = document.getElementById('character-display');
    const scoreElement = document.getElementById('score');
    const totalElement = document.getElementById('total');
    const correctBtn = document.getElementById('correct-btn');
    const uncertainBtn = document.getElementById('uncertain-btn');
    const incorrectBtn = document.getElementById('incorrect-btn');
    const resultsDiv = document.getElementById('results');
    const gameContainer = document.querySelector('.game-container');
    const finalScoreElement = document.getElementById('final-score');
    const finalTotalElement = document.getElementById('final-total');
    const knownGrid = document.getElementById('known-grid');
    const uncertainGrid = document.getElementById('uncertain-grid');
    const unknownGrid = document.getElementById('unknown-grid');
    const restartBtn = document.getElementById('restart-btn');
    const soundToggle = document.getElementById('sound-toggle');
    const catSprite = document.getElementById('cat-sprite');
    const catFrame = catSprite.querySelector('.cat-frame');
    
    // 初始化猫咪动画类
    const catAnimation = new CatAnimation(
        catSprite, 
        catFrame
    );
    
    // Sound effects
    const correctSound = new Audio('win.wav');
    const incorrectSound = new Audio('lose.wav');
    const nextSound = new Audio('https://soundbible.com/mp3/btn402.mp3');
    const completionSound = new Audio('https://soundbible.com/mp3/electronic_chime-KevanGC-495939803.mp3');
    const uncertainSound = new Audio('https://soundbible.com/mp3/button-30.mp3');
    
    // Function to play sound with lower volume
    function playSound(sound) {
        // Only play if sound is enabled
        if (gameState.soundEnabled) {
            // Set lower volume to make it kid-friendly
            sound.volume = 0.3;
            sound.play().catch(e => console.error("Error playing sound:", e));
        }
    }
    
    // Toggle sound on/off
    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        
        // Update button icon and style
        if (gameState.soundEnabled) {
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundToggle.classList.remove('muted');
        } else {
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            soundToggle.classList.add('muted');
        }
    }
    
    // Function to display the current character
    function displayCurrentCharacter() {
        if (gameState.currentIndex >= gameState.shuffledCharacters.length) {
            // No more characters, show results
            showResults();
            return;
        }
        
        characterDisplay.textContent = gameState.shuffledCharacters[gameState.currentIndex];
        
        // Play sound for next character
        playSound(nextSound);
        
        // Reset buttons
        correctBtn.style.display = 'block';
        correctBtn.disabled = false;
        uncertainBtn.style.display = 'block';
        uncertainBtn.disabled = false;
        incorrectBtn.style.display = 'block';
        incorrectBtn.disabled = false;
        
        // 清除之前的计时器（如果有）
        if (gameState.timer) {
            clearTimeout(gameState.timer);
        }
        
        // 创建进度条元素（如果不存在）
        let timerBar = document.getElementById('timer-bar');
        if (!timerBar) {
            timerBar = document.createElement('div');
            timerBar.id = 'timer-bar';
            timerBar.className = 'timer-bar';
            document.querySelector('.character-display').appendChild(timerBar);
        }
        
        // 重置进度条
        timerBar.style.width = '100%';
        timerBar.style.backgroundColor = '#4CAF50';
        
        // 添加过渡效果
        timerBar.style.transition = `width ${gameState.timeLimit/1000}s linear`;
        
        // 开始计时动画
        setTimeout(() => {
            timerBar.style.width = '0%';
            timerBar.style.backgroundColor = '#f44336';
        }, 50);
        
        // 设置新的计时器
        gameState.timer = setTimeout(() => {
            // 时间到，自动选择"不认识"
            if (!correctBtn.disabled) {  // 确保按钮没有被禁用（即用户还没有回答）
                handleTimeout();
            }
        }, gameState.timeLimit);
    }
    
    // 通用的结果处理函数，处理得分和显示
    function processResult(resultType, points) {
        // 每道题目总计数量始终+1
        gameState.total += 1;
        
        // 根据结果类型添加相应的动画和声音
        if (resultType === 'correct') {
            // 只有正确答案才加分
            gameState.score += points;
            gameState.knownCharacters.push(gameState.shuffledCharacters[gameState.currentIndex]);
            
            // 播放声音
            playSound(correctSound);
            
            // 显示正确动画
            characterDisplay.classList.add('correct-animation');
            characterDisplay.addEventListener('animationend', () => {
                characterDisplay.classList.remove('correct-animation');
            }, { once: true });
        } 
        else if (resultType === 'uncertain') {
            // 不加分，只记录字符
            gameState.uncertainCharacters.push(gameState.shuffledCharacters[gameState.currentIndex]);
            
            // 播放声音
            playSound(uncertainSound);
            
            // 显示不确定动画
            characterDisplay.classList.add('uncertain-animation');
            characterDisplay.addEventListener('animationend', () => {
                characterDisplay.classList.remove('uncertain-animation');
            }, { once: true });
        } 
        else if (resultType === 'incorrect') {
            // 不加分，只记录字符
            gameState.unknownCharacters.push(gameState.shuffledCharacters[gameState.currentIndex]);
            
            // 播放声音
            playSound(incorrectSound);
            
            // 显示错误动画
            characterDisplay.classList.add('incorrect-animation');
            characterDisplay.addEventListener('animationend', () => {
                characterDisplay.classList.remove('incorrect-animation');
            }, { once: true });
        }
        
        // 更新分数显示
        scoreElement.textContent = gameState.score;
        totalElement.textContent = gameState.total;
        
        // 前进到下一个字符
        gameState.currentIndex++;
        
        // 重置按钮禁用状态
        correctBtn.disabled = false;
        uncertainBtn.disabled = false;
        incorrectBtn.disabled = false;
    }
    
    // Function to handle correct button click
    function handleCorrect() {
        // 清除计时器
        if (gameState.timer) {
            clearTimeout(gameState.timer);
            gameState.timer = null;
        }
        
        // 记录结果类型用于球扔完后的处理
        const resultType = 'correct';
        const points = 1; // 改为1分
        
        // 禁用按钮，但不隐藏
        correctBtn.disabled = true;
        uncertainBtn.disabled = true;
        incorrectBtn.disabled = true;
        
        // 播放猫咪动画，投球到用户点击的按钮，加快速度
        catAnimation.playAnimation(0.5, () => {
            // 动画完成后处理结果并播放声音
            processResult(resultType, points);
            
            // 直接显示下一个字符，不显示下一步按钮
            setTimeout(() => {
                displayCurrentCharacter();
            }, 800); // 短暂延迟，让用户看清结果
        }, correctBtn); // 将球投向正确按钮
    }
    
    // Function to show trophy animation
    function showTrophyAnimation() {
        // 创建奖杯元素
        const trophy = document.createElement('div');
        trophy.className = 'trophy';
        trophy.innerHTML = '<i class="fas fa-trophy"></i>';
        
        // 添加到容器
        const container = document.querySelector('.container');
        container.appendChild(trophy);
        
        // 播放奖杯音效（使用已有的音效文件）
        const trophySound = completionSound; // 重用完成音效作为奖杯音效
        trophySound.volume = 0.3;
        trophySound.play().catch(e => console.log('Trophy sound play failed:', e));
        
        // 移除奖杯元素
        setTimeout(() => {
            trophy.classList.add('fade-out');
            setTimeout(() => {
                container.removeChild(trophy);
            }, 1000);
        }, 2500);
    }
    
    // Function to handle uncertain button click
    function handleUncertain() {
        // 清除计时器
        if (gameState.timer) {
            clearTimeout(gameState.timer);
            gameState.timer = null;
        }
        
        const resultType = 'uncertain';
        const points = 0;
        
        // 禁用按钮
        correctBtn.disabled = true;
        uncertainBtn.disabled = true;
        incorrectBtn.disabled = true;
        
        // 直接处理结果，不播放球的动画
        processResult(resultType, points);
        
        // 直接显示下一个字符，不显示下一步按钮
        setTimeout(() => {
            displayCurrentCharacter();
        }, 1000); // 短暂延迟，让用户看清结果
    }
    
    // Function to handle incorrect button click
    function handleIncorrect() {
        // 清除计时器
        if (gameState.timer) {
            clearTimeout(gameState.timer);
            gameState.timer = null;
        }
        
        const resultType = 'incorrect';
        const points = 0;
        
        // 禁用按钮
        correctBtn.disabled = true;
        uncertainBtn.disabled = true;
        incorrectBtn.disabled = true;
        
        // 直接处理结果，不播放球的动画
        processResult(resultType, points);
        
        // 直接显示下一个字符，不显示下一步按钮
        setTimeout(() => {
            displayCurrentCharacter();
        }, 800); // 短暂延迟，让用户看清结果
    }
    
    // Function to show results
    function showResults() {
        gameContainer.style.display = 'none';
        resultsDiv.classList.remove('hidden');
        
        // Calculate stats
        const knownCount = gameState.knownCharacters.length;
        const uncertainCount = gameState.uncertainCharacters.length;
        const unknownCount = gameState.unknownCharacters.length;
        const total = knownCount + uncertainCount + unknownCount;
        
        // Calculate percentages
        const knownPercent = Math.round((knownCount / total) * 100) || 0;
        const uncertainPercent = Math.round((uncertainCount / total) * 100) || 0;
        const unknownPercent = Math.round((unknownCount / total) * 100) || 0;
        
        // Update stats display
        document.getElementById('known-count').textContent = knownCount;
        document.getElementById('uncertain-count').textContent = uncertainCount;
        document.getElementById('unknown-count').textContent = unknownCount;
        document.getElementById('final-total').textContent = total;
        
        document.getElementById('known-percent').textContent = knownPercent;
        document.getElementById('uncertain-percent').textContent = uncertainPercent;
        document.getElementById('unknown-percent').textContent = unknownPercent;
        
        // Play completion sound
        playSound(completionSound);
        
        // 显示选中的课程
        const lessonsSummary = document.createElement('div');
        lessonsSummary.className = 'lessons-summary';
        lessonsSummary.innerHTML = '<h3>测试课程:</h3>';
        
        const selectedLessonsText = document.createElement('p');
        const selectedLessonsIds = [];
        document.querySelectorAll('.lesson-checkbox input:checked').forEach(checkbox => {
            selectedLessonsIds.push(parseInt(checkbox.value));
        });
        
        // 构建已选课程文本
        if (selectedLessonsIds.length > 0) {
            const lessonNames = selectedLessonsIds.map(id => {
                const lesson = lessons.find(l => l.id === id);
                return lesson ? lesson.name : '';
            }).filter(name => name !== '');
            
            selectedLessonsText.textContent = lessonNames.join('、');
        } else {
            selectedLessonsText.textContent = '无选中课程';
        }
        
        lessonsSummary.appendChild(selectedLessonsText);
        
        // 添加到结果中
        const resultsHeader = document.querySelector('#results h2');
        if (resultsHeader) {
            resultsDiv.insertBefore(lessonsSummary, resultsHeader.nextSibling);
        } else {
            resultsDiv.insertBefore(lessonsSummary, resultsDiv.firstChild);
        }
        
        // Display known characters
        knownGrid.innerHTML = '';
        gameState.knownCharacters.forEach(char => {
            const charElement = document.createElement('div');
            charElement.className = 'character-item known-char';
            charElement.textContent = char;
            knownGrid.appendChild(charElement);
        });
        
        // Display uncertain characters
        uncertainGrid.innerHTML = '';
        gameState.uncertainCharacters.forEach(char => {
            const charElement = document.createElement('div');
            charElement.className = 'character-item uncertain-char';
            charElement.textContent = char;
            uncertainGrid.appendChild(charElement);
        });
        
        // Display unknown characters
        unknownGrid.innerHTML = '';
        gameState.unknownCharacters.forEach(char => {
            const charElement = document.createElement('div');
            charElement.className = 'character-item unknown-char';
            charElement.textContent = char;
            unknownGrid.appendChild(charElement);
        });
        
        // 显示返回选择课程按钮
        const backToSelectBtn = document.createElement('button');
        backToSelectBtn.textContent = '返回选择课程';
        backToSelectBtn.className = 'back-to-select-btn';
        backToSelectBtn.onclick = () => {
            // 移除课程总结和返回按钮
            if (document.querySelector('.lessons-summary')) {
                document.querySelector('.lessons-summary').remove();
            }
            if (document.querySelector('.back-to-select-btn')) {
                document.querySelector('.back-to-select-btn').remove();
            }
            restartGame();
        };
        
        resultsDiv.appendChild(backToSelectBtn);
    }
    
    // 添加超时处理函数
    function handleTimeout() {
        const resultType = 'incorrect';
        const points = 0;
        
        // 添加一个闪烁效果提示用户时间到
        incorrectBtn.classList.add('timeout-flash');
        setTimeout(() => {
            incorrectBtn.classList.remove('timeout-flash');
        }, 1000);
        
        // 禁用按钮
        correctBtn.disabled = true;
        uncertainBtn.disabled = true;
        incorrectBtn.disabled = true;
        
        // 直接处理结果
        processResult(resultType, points);
        
        // 延迟显示下一个字符
        setTimeout(() => {
            displayCurrentCharacter();
        }, 800);
    }
    
    // Event listeners
    correctBtn.addEventListener('click', handleCorrect);
    uncertainBtn.addEventListener('click', handleUncertain);
    incorrectBtn.addEventListener('click', handleIncorrect);
    restartBtn.addEventListener('click', restartGame);
    soundToggle.addEventListener('click', toggleSound);
    
    // 初始化课程选择器
    createLessonSelectors();
}); 