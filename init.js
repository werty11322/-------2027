// init.js
console.log('init.js загружен');

// ============================================
// ЖДЁМ ПОЛНОЙ ЗАГРУЗКИ СТРАНИЦЫ
// Обработчик кнопки "Начать игру" живёт только
// в game.js (window.onload). Здесь — только fullscreen.
// ============================================
window.addEventListener('load', function() {
    console.log('window.load сработал (init.js)');
    initFullscreen();

});

// ============================================
// ПОЛНОЭКРАННЫЙ РЕЖИМ (Firefox + фоллбэк)
// ============================================
function initFullscreen() {
    var fsBtn = document.getElementById('fullscreen-btn');
    if (!fsBtn) {
        console.warn('⚠️ Кнопка #fullscreen-btn не найдена');
        return;
    }

    console.log('✅ initFullscreen: кнопка найдена');

    fsBtn.addEventListener('click', function() {
        console.log('🔘 Клик по кнопке полноэкранного режима');

        var isFull = document.fullscreenElement || document.mozFullScreenElement;

        if (!isFull) {
            // === ВХОД В ПОЛНОЭКРАННЫЙ РЕЖИМ ===
            console.log('🔳 Попытка входа в fullscreen...');

            var target = document.documentElement;
            var promise = null;

            if (target.requestFullscreen) {
                promise = target.requestFullscreen();
            } else if (target.mozRequestFullScreen) {
                target.mozRequestFullScreen();
            } else if (target.webkitRequestFullscreen) {
                target.webkitRequestFullscreen();
            }

            // Ловим ошибку — в popup fullscreen заблокирован, используем CSS-фоллбэк
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function(err) {
                    console.warn('⚠️ Fullscreen blocked:', err.message);
                    togglePseudoFullscreen();
                });
            } else {
                console.warn('⚠️ Нет Promise — включаю псевдо-режим');
                setTimeout(togglePseudoFullscreen, 100);
            }

            fsBtn.textContent = '✕';
            fsBtn.title = 'Выйти из полноэкранного режима';

        } else {
            // === ВЫХОД ИЗ ПОЛНОЭКРАННОГО РЕЖИМА ===
            console.log('🔲 Выход из fullscreen');

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            fsBtn.textContent = '⛶';
            fsBtn.title = 'Полноэкранный режим';
            document.body.classList.remove('pseudo-fullscreen');
        }
    });

    // === СЛУШАЕМ СИСТЕМНЫЕ ИЗМЕНЕНИЯ РЕЖИМА (ESC и т.д.) ===
    ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange'].forEach(function(evt) {
        document.addEventListener(evt, function() {
            var isFull = document.fullscreenElement || document.mozFullScreenElement;
            var btn = document.getElementById('fullscreen-btn');
            if (btn) {
                btn.textContent = isFull ? '✕' : '⛶';
                btn.title = isFull ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим';
            }
            if (!isFull) {
                document.body.classList.remove('pseudo-fullscreen');
            }
        });
    });

    console.log('✅ Полноэкранный режим инициализирован');
}

// ============================================
// ПСЕВДО-ПОЛНОЭКРАННЫЙ РЕЖИМ (через CSS)
// ============================================
function togglePseudoFullscreen() {
    var body = document.body;
    var fsBtn = document.getElementById('fullscreen-btn');
    var isPseudo = body.classList.contains('pseudo-fullscreen');

    if (!isPseudo) {
        body.classList.add('pseudo-fullscreen');
        if (fsBtn) {
            fsBtn.textContent = '✕';
            fsBtn.title = 'Выйти из полноэкранного режима';
        }
        console.log('🎭 Псевдо-полноэкранный режим ВКЛЮЧЁН');
    } else {
        body.classList.remove('pseudo-fullscreen');
        if (fsBtn) {
            fsBtn.textContent = '⛶';
            fsBtn.title = 'Полноэкранный режим';
        }
        console.log('🎭 Псевдо-полноэкранный режим ВЫКЛЮЧЕН');
    }
}

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ (отладка в консоли)
// ============================================
function checkElements() {
    var ids = [
        'кнопка-старт', 'экран-описания', 'статус-панель',
        'инвентарь-панель', 'игра', 'текст-диалога',
        'кнопки-диалога', 'фон-локации', 'слой-спрайтов', 'fullscreen-btn'
    ];
    console.group('🔍 Проверка элементов');
    ids.forEach(function(id) {
        console.log(id + ':', document.getElementById(id) ? '✅' : '❌');
    });
    console.groupEnd();
}

window.checkElements = checkElements;
window.togglePseudoFullscreen = togglePseudoFullscreen;
window.initFullscreen = initFullscreen;
