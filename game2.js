// ═══════════════════════════════════════════════════════════════
// БУНКЕР 2026 v2 — РАСШИРЕНИЕ
// Дни 31-60, скримеры, RU/EN, новые механики
// ═══════════════════════════════════════════════════════════════

// ─── ЭКРАН ЗАГРУЗКИ ──────────────────────────────────────────────
var Загрузчик = (function() {
    var шаги = [
        { текст: 'ЗАГРУЗКА СИСТЕМ...', прогресс: 15 },
        { текст: 'ИНИЦИАЛИЗАЦИЯ AI...', прогресс: 35 },
        { текст: 'ЗАГРУЗКА СЦЕНАРИЕВ...', прогресс: 55 },
        { текст: 'ПОДГОТОВКА БУНКЕРА...', прогресс: 75 },
        { текст: 'АКТИВАЦИЯ ПРОТОКОЛА...', прогресс: 90 },
        { текст: 'ГОТОВО', прогресс: 100 }
    ];
    var текущийШаг = 0;
    var интервал = null;

    function обновить(текст, прогресс) {
        var бар = document.getElementById('загрузка-бар');
        var тxt = document.getElementById('загрузка-текст');
        if (бар) бар.style.width = прогресс + '%';
        if (тxt) тxt.textContent = текст;
    }

    function запустить(колбэк) {
        var экран = document.getElementById('экран-загрузки');
        if (!экран) { if (колбэк) колбэк(); return; }

        // Показываем экран
        экран.classList.remove('скрывается');
        экран.classList.add('активен');

        текущийШаг = 0;
        обновить(шаги[0].текст, шаги[0].прогресс);

        if (интервал) clearInterval(интервал);
        интервал = setInterval(function() {
            текущийШаг++;
            if (текущийШаг >= шаги.length) {
                clearInterval(интервал);
                интервал = null;
                setTimeout(function() {
                    экран.classList.add('скрывается');
                    setTimeout(function() {
                        экран.classList.remove('активен');
                        экран.classList.remove('скрывается');
                        if (колбэк) колбэк();
                    }, 800);
                }, 400);
                return;
            }
            обновить(шаги[текущийШаг].текст, шаги[текущийШаг].прогресс);
        }, 400);
    }

    return { запустить: запустить };
})();

// ─── ЛОКАЛИЗАЦИЯ (RU/EN) ─────────────────────────────────────────
var i18n = (function() {
    var текущий = 'ru';
    var строки = {
        ru: {
            здоровье: '❤️ Здоровье', рассудок: '🧠 Рассудок',
            еда: '🍖 Еда', вода: '💧 Вода',
            энергия: '⚡ Энергия', день: '📅 День',
            репутация: '⭐ Репутация', инвентарь: '🎒 Инвентарь',
            статус: '📊 Статус', карта: '🗺️ Карта',
            дневник: '📓 Дневник', сохранить: '💾 Сохранить',
            загрузить: '📂 Загрузить', достижения: '🏅 Достижения',
            громкость: '🔊 Громкость', язык: '🌍 RU/EN',
            день_текст: 'День', ночь_текст: 'Ночь',
            предупреждение_еда: '⚠️ Еда заканчивается!',
            предупреждение_вода: '⚠️ Вода заканчивается!',
            сохранено: '💾 Сохранено',
            загружено: '📂 Загружено',
            нпс_в_бункере: '👥 В бункере',
            время_осталось: '⚠️ ВРЕМЕНИ ОСТАЛОСЬ',
            пусто: 'пусто',
            спрашиваю_аню: '💬 Спросить Аню...',
            спрашиваю_игоря: '💬 Спросить Игоря...',
            думает: '...',
            новая_игра: '🔄 Новая игра',
            продолжить: '▶️ Продолжить'
        },
        en: {
            здоровье: '❤️ Health', рассудок: '🧠 Sanity',
            еда: '🍖 Food', вода: '💧 Water',
            энергия: '⚡ Energy', день: '📅 Day',
            репутация: '⭐ Reputation', инвентарь: '🎒 Inventory',
            статус: '📊 Status', карта: '🗺️ Map',
            дневник: '📓 Diary', сохранить: '💾 Save',
            загрузить: '📂 Load', достижения: '🏅 Achievements',
            громкость: '🔊 Volume', язык: '🌍 RU/EN',
            день_текст: 'Day', ночь_текст: 'Night',
            предупреждение_еда: '⚠️ Food running low!',
            предупреждение_вода: '⚠️ Water running low!',
            сохранено: '💾 Saved',
            загружено: '📂 Loaded',
            нпс_в_бункере: '👥 In bunker',
            время_осталось: '⚠️ TIME REMAINING',
            пусто: 'empty',
            спрашиваю_аню: '💬 Ask Anya...',
            спрашиваю_игоря: '💬 Ask Igor...',
            думает: '...',
            новая_игра: '🔄 New Game',
            продолжить: '▶️ Continue'
        }
    };

    function т(ключ) { return (строки[текущий] || строки.ru)[ключ] || ключ; }
    function установить(л) {
        текущий = л;
        if (typeof ИИ !== 'undefined') ИИ.установитьЯзык(л);
        if (typeof Достижения !== 'undefined') Достижения.установитьЯзык(л);
        if (typeof Слоты !== 'undefined') Слоты.установитьЯзык(л);
        обновитьТекстыИнтерфейса();
        try { localStorage.setItem('bunker2026_lang', л); } catch(e) {}
    }
    function получить() { return текущий; }
    function загрузить() {
        try { var л = localStorage.getItem('bunker2026_lang'); if (л) текущий = л; } catch(e) {}
    }
    загрузить();
    return { т: т, установить: установить, получить: получить };
})();

function обновитьТекстыИнтерфейса() {
    var карта = {
        'статус-панель h3':   i18n.т('статус'),
        'инвентарь-панель h3': i18n.т('инвентарь')
    };
    // Обновляем заголовки панелей
    var сп = document.querySelector('#статус-панель h3');
    if (сп) сп.textContent = i18n.т('статус');
    var ип = document.querySelector('#инвентарь-панель h3');
    if (ип) ип.textContent = i18n.т('инвентарь');
}

// ─── СКРИМЕРЫ ────────────────────────────────────────────────────
var Скримеры = (function() {

    var последний = 0;
    var ИНТЕРВАЛ = 45000; // минимум 45 сек между скримерами

    var список = [
        { файл: 'images2/scream_face.jpg',    звук: 'images2/scream.mp3',       длит: 400 },
        { файл: 'images2/scream_eye.jpg',     звук: 'images2/scream.mp3',       длит: 350 },
        { файл: 'images2/scream_shadow.jpg',  звук: 'images2/whisper.mp3',      длит: 500 },
        { файл: 'images2/scream_door.jpg',    звук: 'images2/metal_creak.mp3',  длит: 600 },
        { файл: 'images2/scream_corridor.jpg',звук: 'images2/footsteps.mp3',    длит: 500 },
        { файл: 'images2/scream_hands.jpg',   звук: 'images2/scream.mp3',       длит: 350 },
        { файл: 'images2/scream_mirror.jpg',  звук: 'images2/stati.mp3',        длит: 450 },
        { файл: 'images2/scream_bunker.jpg',  звук: 'images2/scream.mp3',       длит: 400 },
        { файл: 'images2/scream_child.jpg',   звук: 'images2/whisper.mp3',      длит: 550 },
        { файл: 'images2/scream_text.jpg',    звук: 'images2/stati.mp3',        длит: 600 }
    ];

    function показать(индекс) {
        var сейчас = Date.now();
        if (сейчас - последний < ИНТЕРВАЛ) return;
        последний = сейчас;

        var с = индекс !== undefined ? список[индекс] : список[Math.floor(Math.random() * список.length)];
        if (!с) return;

        // Звук
        try {
            var аудиоЭл = new Audio(с.звук);
            аудиоЭл.volume = 0.7;
            аудиоЭл.play().catch(function(){});
        } catch(e) {}

        // Изображение — вспышка
        var слой = document.createElement('div');
        слой.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 99998; background: #000;
            display: flex; align-items: center; justify-content: center;
        `;
        var img = document.createElement('img');
        img.src = с.файл;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0.95;';
        img.onerror = function() { слой.style.background = '#ff0000'; };
        слой.appendChild(img);
        document.body.appendChild(слой);

        // Тряска
        document.body.classList.add('тряска-экрана');
        setTimeout(function() { document.body.classList.remove('тряска-экрана'); }, 400);

        setTimeout(function() {
            if (слой.parentNode) слой.parentNode.removeChild(слой);
        }, с.длит);
    }

    // Скример по условию рассудка
    function проверитьРассудок(рассудок) {
        if (рассудок <= 20 && Math.random() < 0.15) показать();
        else if (рассудок <= 40 && Math.random() < 0.07) показать();
    }

    return { показать: показать, проверитьРассудок: проверитьРассудок };
})();

// ─── АТМОСФЕРНЫЕ ЭФФЕКТЫ ─────────────────────────────────────────
var Атмосфера = (function() {

    // Частицы пыли
    var частицыАктивны = false;
    function запуститьЧастицы() {
        if (частицыАктивны) return;
        частицыАктивны = true;
        function создатьЧастицу() {
            if (!частицыАктивны) return;
            var ч = document.createElement('div');
            var размер = 1 + Math.random() * 2;
            var х = Math.random() * 100;
            var длит = 8000 + Math.random() * 12000;
            ч.style.cssText = `
                position:fixed; left:${х}vw; top:-10px;
                width:${размер}px; height:${размер}px;
                background:rgba(255,255,255,${0.1 + Math.random()*0.2});
                border-radius:50%; pointer-events:none; z-index:2;
                animation: падение_частицы ${длит}ms linear forwards;
            `;
            document.body.appendChild(ч);
            setTimeout(function() { if (ч.parentNode) ч.parentNode.removeChild(ч); }, длит);
            setTimeout(создатьЧастицу, 300 + Math.random() * 700);
        }

        // CSS анимация падения
        if (!document.getElementById('стиль-частицы')) {
            var ст = document.createElement('style');
            ст.id = 'стиль-частицы';
            ст.textContent = `
                @keyframes падение_частицы {
                    0%   { transform: translateY(0) translateX(0); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 0.5; }
                    100% { transform: translateY(110vh) translateX(${(Math.random()-0.5)*100}px); opacity: 0; }
                }
            `;
            document.head.appendChild(ст);
        }
        создатьЧастицу();
    }

    // Мигание лампочки при низкой энергии
    function мигатьЛампочка(энергия) {
        var фон = document.getElementById('фон-локации');
        if (!фон) return;
        if (энергия <= 20) {
            if (!фон.getAttribute('data-мигает')) {
                фон.setAttribute('data-мигает', '1');
                var мигание = setInterval(function() {
                    if (parseInt(фон.style.opacity || 1) === 0) {
                        фон.style.opacity = '1';
                    } else {
                        фон.style.opacity = Math.random() < 0.3 ? '0.3' : '0.85';
                    }
                    if (!фон.getAttribute('data-мигает')) clearInterval(мигание);
                }, 100 + Math.random() * 200);
            }
        } else {
            фон.removeAttribute('data-мигает');
            фон.style.opacity = '1';
        }
    }

    // Кровь на стенах при низком здоровье
    function обновитьКровь(здоровье) {
        var сущ = document.getElementById('слой-крови');
        if (здоровье > 30) {
            if (сущ) сущ.remove();
            return;
        }
        if (!сущ) {
            сущ = document.createElement('div');
            сущ.id = 'слой-крови';
            сущ.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
            document.body.appendChild(сущ);
        }
        var интенсивность = (30 - здоровье) / 30;
        сущ.style.boxShadow = `inset 0 0 ${150 * интенсивность}px rgba(180,0,0,${0.4 * интенсивность})`;
    }

    // Глитч-текст — буквы рассыпаются
    function глитчТекст(элемент, интенсивность) {
        if (!элемент || интенсивность <= 0) return;
        var оригинал = элемент.textContent;
        var символы = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзиклмнопрстуфхцчшщъыьэюя█▓▒░';
        var итераций = 0;
        var макс = Math.floor(интенсивность * 5);
        var интервал = setInterval(function() {
            if (итераций >= макс) {
                элемент.textContent = оригинал;
                clearInterval(интервал);
                return;
            }
            var текст = оригинал.split('').map(function(с) {
                if (Math.random() < интенсивность * 0.15) {
                    return символы[Math.floor(Math.random() * символы.length)];
                }
                return с;
            }).join('');
            элемент.textContent = текст;
            итераций++;
        }, 80);
    }

    // Динамический ambient звук по рассудку
    function обновитьАмбиент(рассудок) {
        // Используем Web Audio API для изменения фильтра
        // Чем ниже рассудок — тем больше низких частот (мрачнее)
        if (typeof аудио !== 'undefined' && аудио) {
            // Передаём информацию аудио-движку
            if (аудио.установитьФильтрРассудка) аудио.установитьФильтрРассудка(рассудок);
        }
    }

    // Помехи на экране (static)
    function показатьПомехи(длительность) {
        var слой = document.createElement('div');
        слой.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            z-index:9990;pointer-events:none;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
            opacity:0.4;animation:помехи_анимация 0.1s infinite;
        `;
        if (!document.getElementById('стиль-помехи')) {
            var ст = document.createElement('style');
            ст.id = 'стиль-помехи';
            ст.textContent = '@keyframes помехи_анимация { 0%{opacity:0.4} 50%{opacity:0.2} 100%{opacity:0.4} }';
            document.head.appendChild(ст);
        }
        document.body.appendChild(слой);
        setTimeout(function() { if (слой.parentNode) слой.parentNode.removeChild(слой); }, длительность || 2000);
    }

    return {
        запуститьЧастицы: запуститьЧастицы,
        мигатьЛампочка: мигатьЛампочка,
        обновитьКровь: обновитьКровь,
        глитчТекст: глитчТекст,
        обновитьАмбиент: обновитьАмбиент,
        показатьПомехи: показатьПомехи
    };
})();

// ─── ГЕНЕТИЧЕСКАЯ ПАМЯТЬ ──────────────────────────────────────────
var ГенПамять = (function() {
    var ключ = 'bunker2026_genetic';

    function сохранить(флаги) {
        try { localStorage.setItem(ключ, JSON.stringify(флаги)); } catch(e) {}
    }

    function загрузить() {
        try { return JSON.parse(localStorage.getItem(ключ) || '{}'); } catch(e) { return {}; }
    }

    function установить(имя, значение) {
        var д = загрузить();
        д[имя] = значение;
        сохранить(д);
    }

    function получить(имя) {
        return загрузить()[имя];
    }

    return { установить: установить, получить: получить, загрузить: загрузить };
})();

// ─── РИТУАЛЫ ВЫЖИВАНИЯ ────────────────────────────────────────────
var Ритуалы = (function() {
    var использованные = {};

    var список = {
        ru: [
            { ид: 'фото',    текст: '📷 Говорить с фотографией',  эффект: function(г) { г.рассудок += 8;  г.энергия -= 5;  return 'Вы говорите с фотографией полчаса. Смеётесь. Плачете. Потом становится немного легче.'; } },
            { ид: 'трубы',   текст: '🔩 Стучать по трубам',       эффект: function(г) { г.рассудок += 6;  г.энергия -= 8;  return 'Три удара. Пауза. Три удара. Где-то в глубине — ответный стук. Один раз. Вы не одни.'; } },
            { ид: 'шаги',    текст: '👣 Считать шаги',             эффект: function(г) { г.рассудок += 5;  г.здоровье -= 3; return 'Сто восемьдесят два шага от стены до стены. Вы считаете снова. Сто восемьдесят два. Порядок.'; } },
            { ид: 'список',  текст: '📝 Составить список выживших', эффект: function(г) { г.рассудок += 10; г.вода -= 5;     return 'Вы пишете все имена которые помните. Потом вычёркиваете тех кого потеряли. Список становится короче. Но те кто остались — реальны.'; } },
            { ид: 'мусор',   текст: '🗑️ Убраться в комнате',      эффект: function(г) { г.рассудок += 7;  г.энергия -= 10; return 'Порядок снаружи — порядок внутри. Ненадолго. Но достаточно.'; } }
        ],
        en: [
            { ид: 'фото',    текст: '📷 Talk to the photograph',   эффект: function(г) { г.рассудок += 8;  г.энергия -= 5;  return 'You talk to the photograph for half an hour. You laugh. You cry. Then it gets a little easier.'; } },
            { ид: 'трубы',   текст: '🔩 Tap on the pipes',         эффект: function(г) { г.рассудок += 6;  г.энергия -= 8;  return 'Three taps. Pause. Three taps. Somewhere deep — an answering knock. Once. You are not alone.'; } },
            { ид: 'шаги',    текст: '👣 Count your steps',         эффект: function(г) { г.рассудок += 5;  г.здоровье -= 3; return 'One hundred eighty-two steps from wall to wall. You count again. One hundred eighty-two. Order.'; } },
            { ид: 'список',  текст: '📝 List the survivors',       эффект: function(г) { г.рассудок += 10; г.вода -= 5;     return 'You write every name you remember. Then cross out those you\'ve lost. The list grows shorter. But those who remain — are real.'; } },
            { ид: 'мусор',   текст: '🗑️ Clean the room',          эффект: function(г) { г.рассудок += 7;  г.энергия -= 10; return 'Order outside — order inside. Briefly. But enough.'; } }
        ]
    };

    function получитьДоступные(игра) {
        if (игра.рассудок >= 30) return [];
        var л = i18n.получить();
        return (список[л] || список.ru).filter(function(р) { return !использованные[р.ид]; });
    }

    function использовать(ид, игра) {
        var л = i18n.получить();
        var ритуал = (список[л] || список.ru).find(function(р) { return р.ид === ид; });
        if (!ритуал) return null;
        использованные[ид] = true;
        var результат = ритуал.эффект(игра);

        // Достижение если использованы все
        var использовано = Object.keys(использованные).length;
        if (использовано >= (список.ru.length)) {
            if (typeof Достижения !== 'undefined') Достижения.разблокировать('ritual_master');
        }
        return результат;
    }

    function сбросить() { использованные = {}; }

    return { получитьДоступные: получитьДоступные, использовать: использовать, сбросить: сбросить };
})();

// ─── СИСТЕМА КРАФТА ───────────────────────────────────────────────
var Крафт = (function() {
    var счётчикКрафта = 0;

    var рецепты = {
        ru: [
            {
                ид: 'вода_чистая',
                компоненты: ['🔧 фильтр замена', '💧 вода'],
                результат: '💧 чистая вода',
                описание: 'Фильтр + Вода = Чистая вода',
                эффект: function(г) { г.вода += 30; г.здоровье += 5; return 'Вода очищена. Чистая, холодная. Почти как раньше.'; }
            },
            {
                ид: 'аптечка',
                компоненты: ['💊 медикаменты', '🩹 бинты'],
                результат: '🏥 аптечка',
                описание: 'Медикаменты + Бинты = Аптечка',
                эффект: function(г) { г.здоровье += 40; return 'Аптечка собрана. Здоровье восстановлено.'; }
            },
            {
                ид: 'факел',
                компоненты: ['🔧 гаечный ключ', '🥫 консервы'],
                результат: '🔦 факел',
                описание: 'Инструменты + Консервы (масло) = Факел',
                эффект: function(г) { г.энергия += 20; г.рассудок += 5; return 'Свет в темноте. Самодельный, но надёжный.'; }
            },
            {
                ид: 'передатчик_усил',
                компоненты: ['📻 передатчик', '⚡ батарея'],
                результат: '📡 усиленный передатчик',
                описание: 'Передатчик + Батарея = Усиленный передатчик',
                эффект: function(г) { г.репутация += 5; г.найденныеСекреты += 2; return 'Сигнал усилен. Теперь тебя слышат дальше. Намного дальше.'; }
            },
            {
                ид: 'защита',
                компоненты: ['🔧 гаечный ключ', '📋 файлы Ковчег'],
                результат: '🛡️ самодельная защита',
                описание: 'Инструменты + Файлы = Бронежилет из документов',
                эффект: function(г) { г.здоровье += 15; г.рассудок -= 5; return 'Вы сделали броню из секретных документов. Ирония судьбы.'; }
            }
        ],
        en: [
            {
                ид: 'вода_чистая',
                компоненты: ['🔧 replacement filter', '💧 water'],
                результат: '💧 clean water',
                описание: 'Filter + Water = Clean Water',
                эффект: function(г) { г.вода += 30; г.здоровье += 5; return 'Water purified. Clean, cold. Almost like before.'; }
            },
            {
                ид: 'аптечка',
                компоненты: ['💊 medication', '🩹 bandages'],
                результат: '🏥 first aid kit',
                описание: 'Medication + Bandages = First Aid Kit',
                эффект: function(г) { г.здоровье += 40; return 'First aid kit assembled. Health restored.'; }
            },
            {
                ид: 'факел',
                компоненты: ['🔧 wrench', '🥫 canned goods'],
                результат: '🔦 torch',
                описание: 'Tools + Cans (oil) = Torch',
                эффект: function(г) { г.энергия += 20; г.рассудок += 5; return 'Light in the darkness. Makeshift, but reliable.'; }
            },
            {
                ид: 'передатчик_усил',
                компоненты: ['📻 transmitter', '⚡ battery'],
                результат: '📡 enhanced transmitter',
                описание: 'Transmitter + Battery = Enhanced Transmitter',
                эффект: function(г) { г.репутация += 5; г.найденныеСекреты += 2; return 'Signal boosted. Now you can be heard farther. Much farther.'; }
            },
            {
                ид: 'защита',
                компоненты: ['🔧 wrench', '📋 Ark files'],
                результат: '🛡️ makeshift armor',
                описание: 'Tools + Files = Document Armor',
                эффект: function(г) { г.здоровье += 15; г.рассудок -= 5; return 'You made armor from classified documents. The irony.'; }
            }
        ]
    };

    function показатьКрафт(игра) {
        var сущ = document.getElementById('крафт-оверлей');
        if (сущ) { сущ.remove(); return; }

        var л = i18n.получить();
        var доступные = (рецепты[л] || рецепты.ru).filter(function(р) {
            return р.компоненты.every(function(к) {
                return typeof естьПредмет !== 'undefined' ? естьПредмет(к) : false;
            });
        });

        var оверлей = document.createElement('div');
        оверлей.id = 'крафт-оверлей';
        оверлей.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;max-width:95vw;background:rgba(5,5,15,0.98);border:1px solid rgba(255,165,0,0.4);border-radius:16px;padding:25px;z-index:9000;';

        var загол = document.createElement('h3');
        загол.style.cssText = 'color:#f5a623;font-size:18px;margin-bottom:15px';
        загол.textContent = л === 'ru' ? '🔧 Крафт' : '🔧 Crafting';
        оверлей.appendChild(загол);

        if (доступные.length === 0) {
            var пусто = document.createElement('p');
            пусто.style.cssText = 'color:#666;text-align:center;padding:20px';
            пусто.textContent = л === 'ru' ? 'Недостаточно материалов' : 'Not enough materials';
            оверлей.appendChild(пусто);
        } else {
            доступные.forEach(function(р) {
                var карточка = document.createElement('div');
                карточка.style.cssText = 'background:rgba(255,165,0,0.08);border:1px solid rgba(255,165,0,0.2);border-radius:10px;padding:12px;margin-bottom:10px;cursor:pointer;transition:all 0.2s;';
                карточка.onmouseenter = function() { this.style.background = 'rgba(255,165,0,0.18)'; };
                карточка.onmouseleave = function() { this.style.background = 'rgba(255,165,0,0.08)'; };

                var назв = document.createElement('div');
                назв.style.cssText = 'color:#f5a623;font-size:14px;font-weight:bold;margin-bottom:4px';
                назв.textContent = р.результат;
                var опис = document.createElement('div');
                опис.style.cssText = 'color:#888;font-size:12px';
                опис.textContent = р.описание;

                карточка.appendChild(назв);
                карточка.appendChild(опис);
                карточка.onclick = function() {
                    // Убираем компоненты
                    р.компоненты.forEach(function(к) {
                        if (typeof удалитьПредмет !== 'undefined') удалитьПредмет(к);
                    });
                    // Добавляем результат
                    if (typeof добавитьПредмет !== 'undefined') добавитьПредмет(р.результат);
                    var рез = р.эффект(игра);
                    оверлей.remove();
                    счётчикКрафта++;
                    if (счётчикКрафта >= 5) {
                        if (typeof Достижения !== 'undefined') Достижения.разблокировать('craft_master');
                    }
                    if (typeof показатьУведомление !== 'undefined') показатьУведомление('🔧 ' + рез);
                    if (typeof обновитьИнтерфейс !== 'undefined') обновитьИнтерфейс();
                };
                оверлей.appendChild(карточка);
            });
        }

        var бЗакрыть = document.createElement('button');
        бЗакрыть.style.cssText = 'width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#888;padding:10px;border-radius:8px;cursor:pointer;margin-top:5px;';
        бЗакрыть.textContent = л === 'ru' ? '✕ Закрыть' : '✕ Close';
        бЗакрыть.onclick = function() { оверлей.remove(); };
        оверлей.appendChild(бЗакрыть);
        document.body.appendChild(оверлей);
    }

    return { показатьКрафт: показатьКрафт };
})();

// ─── РАДИО-ТЕАТР ─────────────────────────────────────────────────
var РадиоТеатр = (function() {
    var индекс = 0;
    var сигналы = {
        ru: [
            "📡 Бункер 45: «...кислород заканчивается... дети ещё живы... кто-нибудь...»",
            "📡 Бункер 12: «Мы открыли дверь. Снаружи... это не то что мы думали...»",
            "📡 Неизвестный: «Протокол Ковчег завершён. Все испытуемые... все испытуемые...»",
            "📡 Военная частота: «Зона 7 потеряна. Зона 8 потеряна. Отступаем к...» [тишина]",
            "📡 Детский голос: «Папа сказал ждать. Мы ждём. Уже долго ждём.»",
            "📡 Бункер 23: «Не ходите сюда. Здесь не то, чем кажется. Не ходите.»",
            "📡 Учёный: «Эксперимент успешен. Испытуемый семнадцать демонстрирует... [помехи] ...именно то, что планировалось.»"
        ],
        en: [
            "📡 Bunker 45: '...oxygen running out... children still alive... anyone...'",
            "📡 Bunker 12: 'We opened the door. Outside... it's not what we thought...'",
            "📡 Unknown: 'Project Ark protocol complete. All subjects... all subjects...'",
            "📡 Military frequency: 'Zone 7 lost. Zone 8 lost. Retreating to...' [silence]",
            "📡 Child's voice: 'Dad said to wait. We're waiting. We've been waiting so long.'",
            "📡 Bunker 23: 'Don't come here. It's not what it seems. Don't come.'",
            "📡 Scientist: 'Experiment successful. Subject seventeen demonstrates... [static] ...exactly as planned.'"
        ]
    };

    var прослушанные = {};

    function показатьСледующий() {
        var л = i18n.получить();
        var список = сигналы[л] || сигналы.ru;
        if (индекс >= список.length) return;
        var сигнал = список[индекс];
        прослушанные[индекс] = true;
        индекс++;
        if (typeof показатьУведомление !== 'undefined') показатьУведомление(сигнал);

        // Достижение
        if (Object.keys(прослушанные).length >= список.length) {
            if (typeof Достижения !== 'undefined') Достижения.разблокировать('radio_lore');
        }
    }

    function запустить(день) {
        // Показываем сигнал каждые 4 дня
        if (день % 4 === 0 && день > 0) {
            setTimeout(показатьСледующий, 3000 + Math.random() * 5000);
        }
    }

    return { запустить: запустить, показатьСледующий: показатьСледующий };
})();

// ─── ДИАЛОГ С НПС ЧЕРЕЗ AI ───────────────────────────────────────
var ДиалогНПС = (function() {

    function показать(имяНПС, игра) {
        var сущ = document.getElementById('диалог-нпс-оверлей');
        if (сущ) { сущ.remove(); return; }

        var л = i18n.получить();

        var оверлей = document.createElement('div');
        оверлей.id = 'диалог-нпс-оверлей';
        оверлей.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(0,0,0,0.97);border-top:1px solid rgba(255,255,255,0.15);padding:20px;z-index:9000;max-height:50vh;display:flex;flex-direction:column;';

        // Шапка
        var шапка = document.createElement('div');
        шапка.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;';
        var имяЭл = document.createElement('div');
        имяЭл.style.cssText = 'color:#e94560;font-size:16px;font-weight:bold';
        имяЭл.textContent = '💬 ' + имяНПС;
        var закрыть = document.createElement('button');
        закрыть.style.cssText = 'background:none;border:none;color:#888;cursor:pointer;font-size:18px';
        закрыть.textContent = '✕';
        закрыть.onclick = function() { оверлей.remove(); };
        шапка.appendChild(имяЭл);
        шапка.appendChild(закрыть);
        оверлей.appendChild(шапка);

        // Ответ НПС
        var ответЭл = document.createElement('div');
        ответЭл.style.cssText = 'color:#ccc;font-size:15px;line-height:1.7;min-height:60px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:12px;';
        ответЭл.textContent = л === 'ru' ? '...' : '...';
        оверлей.appendChild(ответЭл);

        // Поле ввода
        var ввод = document.createElement('div');
        ввод.style.cssText = 'display:flex;gap:8px;';
        var поле = document.createElement('input');
        поле.type = 'text';
        поле.placeholder = л === 'ru' ? 'Что спросить у ' + имяНПС + '?' : 'What to ask ' + имяНПС + '?';
        поле.style.cssText = 'flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:10px 14px;border-radius:8px;font-size:14px;outline:none;';
        var кнопкаОтпр = document.createElement('button');
        кнопкаОтпр.style.cssText = 'background:rgba(233,69,96,0.3);border:1px solid rgba(233,69,96,0.5);color:#fff;padding:10px 16px;border-radius:8px;cursor:pointer;font-size:14px;';
        кнопкаОтпр.textContent = л === 'ru' ? 'Спросить' : 'Ask';

        function отправить() {
            var вопрос = поле.value.trim();
            if (!вопрос) return;
            поле.value = '';
            кнопкаОтпр.disabled = true;
            ответЭл.textContent = л === 'ru' ? '...' : '...';
            ответЭл.style.opacity = '0.5';

            if (typeof ИИ !== 'undefined' && ИИ.естьКлюч()) {
                ИИ.спросить(имяНПС, вопрос, игра, function(ответ) {
                    ответЭл.textContent = ответ;
                    ответЭл.style.opacity = '1';
                    кнопкаОтпр.disabled = false;
                    // Автозапись в дневник
                    if (typeof добавитьЗапись !== 'undefined') {
                        добавитьЗапись(
                            (л === 'ru' ? 'Разговор с ' : 'Talk with ') + имяНПС,
                            вопрос + ' — ' + ответ
                        );
                    }
                });
            } else {
                // Fallback без AI
                setTimeout(function() {
                    ответЭл.textContent = typeof ИИ !== 'undefined' ? ИИ.спросить(имяНПС, вопрос, игра, function(о){ ответЭл.textContent = о; }) : '...';
                    ответЭл.style.opacity = '1';
                    кнопкаОтпр.disabled = false;
                }, 500);
            }
        }

        кнопкаОтпр.onclick = отправить;
        поле.onkeypress = function(е) { if (е.key === 'Enter') отправить(); };

        ввод.appendChild(поле);
        ввод.appendChild(кнопкаОтпр);
        оверлей.appendChild(ввод);
        document.body.appendChild(оверлей);
        поле.focus();
    }

    return { показать: показать };
})();

// ─── ИСКАЖЕНИЕ ВРЕМЕНИ ───────────────────────────────────────────
var ИскажениеВремени = (function() {
    var активно = false;
    var оригинальныйДень = 0;

    function активировать(день) {
        if (активно) return;
        активно = true;
        оригинальныйДень = день;

        var элДень = document.getElementById('день-знач');
        if (!элДень) return;

        // Анимация "плывущих" цифр
        if (!document.getElementById('стиль-искажения')) {
            var ст = document.createElement('style');
            ст.id = 'стиль-искажения';
            ст.textContent = `
                @keyframes плавающие_цифры {
                    0%   { content: "${день}"; }
                    25%  { content: "${день-1}"; color: #e94560; }
                    50%  { content: "${день+1}"; }
                    75%  { content: "${день-2}"; color: #8a2be2; }
                    100% { content: "${день}"; }
                }
                .день-искажён { animation: мигание 0.5s infinite; color: #e94560 !important; }
            `;
            document.head.appendChild(ст);
        }
        элДень.classList.add('день-искажён');

        // Через 3 секунды возвращаем
        setTimeout(function() {
            элДень.classList.remove('день-искажён');
            активно = false;
        }, 3000);
    }

    function проверить(день) {
        if (день > 30 && Math.random() < 0.1) активировать(день);
    }

    return { активировать: активировать, проверить: проверить };
})();

// ─── ПИСЬМО В НИКУДА ─────────────────────────────────────────────
var ПисьмоВНикуда = (function() {
    var ключ = 'bunker2026_letters';

    function получитьВсе() {
        try { return JSON.parse(localStorage.getItem(ключ) || '[]'); } catch(e) { return []; }
    }

    function сохранить(текст) {
        var письма = получитьВсе();
        письма.push({ текст: текст, дата: new Date().toLocaleDateString('ru') });
        if (письма.length > 10) письма.shift(); // максимум 10 писем
        try { localStorage.setItem(ключ, JSON.stringify(письма)); } catch(e) {}
        if (typeof Достижения !== 'undefined') Достижения.разблокировать('letter_sent');
    }

    function получитьСлучайное() {
        var письма = получитьВсе();
        if (письма.length === 0) return null;
        return письма[Math.floor(Math.random() * письма.length)];
    }

    function показатьФорму() {
        var л = i18n.получить();
        var сущ = document.getElementById('письмо-оверлей');
        if (сущ) { сущ.remove(); return; }

        var оверлей = document.createElement('div');
        оверлей.id = 'письмо-оверлей';
        оверлей.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:95vw;background:rgba(5,5,15,0.98);border:1px solid rgba(255,215,0,0.3);border-radius:16px;padding:30px;z-index:9000;';

        var загол = document.createElement('h3');
        загол.style.cssText = 'color:#ffd700;font-size:18px;margin-bottom:8px';
        загол.textContent = л === 'ru' ? '✉️ Письмо будущему выжившему' : '✉️ Letter to the Future Survivor';

        var подзагол = document.createElement('p');
        подзагол.style.cssText = 'color:#666;font-size:13px;margin-bottom:15px';
        подзагол.textContent = л === 'ru'
            ? 'Это сообщение появится как найденная записка в следующем прохождении'
            : 'This message will appear as a found note in the next playthrough';

        var поле = document.createElement('textarea');
        поле.style.cssText = 'width:100%;height:120px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,0,0.3);color:#fff;padding:12px;border-radius:8px;font-size:14px;resize:none;font-family:inherit;outline:none;';
        поле.placeholder = л === 'ru' ? 'Напиши что-нибудь тому, кто придёт после тебя...' : 'Write something to whoever comes after you...';
        поле.maxLength = 300;

        var бОтпр = document.createElement('button');
        бОтпр.style.cssText = 'width:100%;background:rgba(255,215,0,0.2);border:1px solid rgba(255,215,0,0.4);color:#ffd700;padding:12px;border-radius:8px;cursor:pointer;font-size:15px;margin-top:10px;';
        бОтпр.textContent = л === 'ru' ? '📨 Отправить в будущее' : '📨 Send to the Future';
        бОтпр.onclick = function() {
            var текст = поле.value.trim();
            if (текст) {
                сохранить(текст);
                оверлей.remove();
                if (typeof показатьУведомление !== 'undefined') {
                    показатьУведомление(л === 'ru' ? '✉️ Письмо сохранено' : '✉️ Letter saved');
                }
            }
        };

        var бЗакрыть = document.createElement('button');
        бЗакрыть.style.cssText = 'width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#888;padding:10px;border-radius:8px;cursor:pointer;margin-top:8px;';
        бЗакрыть.textContent = л === 'ru' ? '✕ Закрыть' : '✕ Close';
        бЗакрыть.onclick = function() { оверлей.remove(); };

        оверлей.appendChild(загол);
        оверлей.appendChild(подзагол);
        оверлей.appendChild(поле);
        оверлей.appendChild(бОтпр);
        оверлей.appendChild(бЗакрыть);
        document.body.appendChild(оверлей);
    }

    return { показатьФорму: показатьФорму, получитьСлучайное: получитьСлучайное, сохранить: сохранить };
})();

// ─── СЦЕНАРИИ ДНЕЙ 31-60 ─────────────────────────────────────────
var сценарии2 = {
    31: {
        фон: 'images2/Туннели между бункерами.png',
        спрайт: 'none',
        текст: function() {
            var л = i18n.получить();
            var генПамять = ГенПамять.загрузить();
            if (л === 'ru') {
                return генПамять.аняПогибла
                    ? "День 31. Туннель. Холодный, узкий, бесконечный. Ты помнишь что Аня не дошла сюда. Её вещи у тебя в рюкзаке. Маша идёт молча. Впереди — свет. Или тебе кажется."
                    : "День 31. Туннель между бункерами. Вы идёте уже три часа. Аня держит Машу за руку. Игорь — замыкающим. Свет фонаря едва достигает стен. Где-то капает вода. Где-то скрипит металл. Туннель живёт своей жизнью.";
            } else {
                return генПамять.аняПогибла
                    ? "Day 31. The tunnel. Cold, narrow, endless. You remember Anya didn't make it here. Her things are in your pack. Masha walks in silence. Ahead — light. Or so you think."
                    : "Day 31. The tunnel between bunkers. You've been walking for three hours. Anya holds Masha's hand. Igor brings up the rear. The flashlight barely reaches the walls. Somewhere water drips. Somewhere metal creaks. The tunnel lives its own life.";
            }
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Идти быстрее", эффект: function(г) { г.здоровье -= 10; г.энергия -= 15; г.день++; Скримеры.показать(4); return "Вы бежите. В темноте кажется что кто-то бежит рядом. Такой же шаг. Такое же дыхание. Вы останавливаетесь — шаги продолжаются ещё секунду."; } },
                { текст: "Осторожно, проверяя каждый поворот", эффект: function(г) { г.энергия -= 20; г.рассудок += 5; г.найденныеСекреты += 1; return "На стене — надпись. Ваш почерк. «День 31. Не иди дальше». Дата — сегодняшняя. Вы её не писали."; } },
                { текст: "Прислушаться к звукам туннеля", эффект: function(г) { г.рассудок -= 8; г.найденныеСекреты += 2; Атмосфера.показатьПомехи(1500); return "Шёпот. Слова неразборчивые, но один звук повторяется снова и снова. Ваше имя. Не Алексей. Другое имя."; } },
                { текст: "Спросить Аню о туннеле", эффект: function(г) { г.доверие += 1; return "Аня молчит долго. «Я бывала здесь. До всего этого». Она не объясняет что значит «до»."; }, условие: function(г) { return г.нпс && г.нпс.some(function(н){ return н.имя === 'Аня'; }); } }
            ];
            return [
                { текст: "Move faster", эффект: function(г) { г.здоровье -= 10; г.энергия -= 15; г.день++; Скримеры.показать(4); return "You run. In the dark it feels like someone runs beside you. Same step. Same breath. You stop — the footsteps continue one second longer."; } },
                { текст: "Carefully, checking each turn", эффект: function(г) { г.энергия -= 20; г.рассудок += 5; г.найденныеСекреты += 1; return "On the wall — writing. Your handwriting. 'Day 31. Don't go further.' Today's date. You didn't write it."; } },
                { текст: "Listen to the tunnel sounds", эффект: function(г) { г.рассудок -= 8; г.найденныеСекреты += 2; Атмосфера.показатьПомехи(1500); return "Whispering. Words inaudible, but one sound repeats over and over. Your name. Not Alexei. Another name."; } }
            ];
        }
    },
    32: {
        фон: 'images2/Бункер 23 — входной шлюз.png',
        спрайт: 'none',
        текст: function() {
            var л = i18n.получить();
            return л === 'ru'
                ? "День 32. Бункер 23. Входной шлюз. Дверь открыта — это странно. Замки взломаны изнутри. На полу — следы. Много следов. Все ведут внутрь. Ни одного — наружу."
                : "Day 32. Bunker 23. Entry airlock. The door is open — that's strange. Locks broken from the inside. On the floor — tracks. Many tracks. All lead inward. Not one leads out.";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Войти в шлюз", эффект: function(г) { г.найденныеСекреты += 2; г.рассудок -= 5; Достижения.разблокировать('bunker23'); return "Внутри — тепло. Свет горит. Кто-то живёт здесь. Или жил совсем недавно. На столе — горячий чай."; } },
                { текст: "Осмотреть следы", эффект: function(г) { г.найденныеСекреты += 3; г.энергия -= 10; return "Следы разные. Детские. Взрослые. И ещё одни — босые, очень большие. Нечеловечески большие. Потом они просто обрываются посреди коридора."; } },
                { текст: "Послать Игоря вперёд", эффект: function(г) { г.доверие -= 1; return "Игорь возвращается через минуту. Белый как мел. «Там кто-то есть. Не двигается. Просто стоит и... смотрит»."; }, условие: function(г) { return г.нпс && г.нпс.some(function(н){ return н.имя === 'Игорь'; }); } },
                { текст: "Отступить и разбить лагерь снаружи", эффект: function(г) { г.здоровье += 10; г.рассудок += 5; return "Ночь снаружи. Холодно. Но в 03:00 из бункера доносится музыка. Старая, довоенная. Танцевальная."; } }
            ];
            return [
                { текст: "Enter the airlock", эффект: function(г) { г.найденныеСекреты += 2; г.рассудок -= 5; Достижения.разблокировать('bunker23'); return "Inside — warm. The lights are on. Someone lives here. Or lived very recently. A hot cup of tea on the table."; } },
                { текст: "Examine the tracks", эффект: function(г) { г.найденныеСекреты += 3; г.энергия -= 10; return "Different tracks. Children's. Adults'. And others — barefoot, very large. Inhumanly large. Then they simply stop in the middle of the corridor."; } },
                { текст: "Retreat and camp outside", эффект: function(г) { г.здоровье += 10; г.рассудок += 5; return "Night outside. Cold. But at 3 AM music drifts from the bunker. Old, pre-war. Dance music."; } }
            ];
        }
    },
    33: {
        фон: 'images2/Бункер 23 — главный зал.png',
        спрайт: 'none',
        текст: function() {
            var л = i18n.получить();
            return л === 'ru'
                ? "День 33. Главный зал Бункера 23. Люди. Живые, здоровые, улыбающиеся. Слишком улыбающиеся. Они встречают вас как старых друзей. Называют по именам — всех. Даже Машу. Откуда они знают Машу?"
                : "Day 33. Bunker 23 main hall. People. Alive, healthy, smiling. Too smiling. They greet you like old friends. They know everyone's names — all of you. Even Masha's. How do they know Masha?";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Принять гостеприимство", эффект: function(г) { г.здоровье += 20; г.еда += 30; г.вода += 20; г.рассудок -= 10; return "Еда вкусная. Слишком вкусная. После месяца в бункере — почти нереально вкусная. Аня не ест. Просто смотрит на вас."; } },
                { текст: "Спросить откуда они знают ваши имена", эффект: function(г) { г.найденныеСекреты += 3; г.рассудок -= 8; return "Улыбки не меняются. «Мы всегда знали. Вы — часть плана. Испытуемый семнадцать и его группа»."; } },
                { текст: "Незаметно осмотреться", эффект: function(г) { г.найденныеСекреты += 4; г.энергия -= 10; return "За зеркалом — стекло наблюдения. Кто-то смотрит оттуда. Всегда смотрел. На стенах — камеры. Везде камеры."; } },
                { текст: "Попытаться уйти", эффект: function(г) { г.рассудок -= 15; г.здоровье -= 10; Скримеры.показать(6); return "Двери заперты. Добродушный мужчина объясняет: «Просто безопасность. Вы можете уйти завтра». Завтра скажут то же самое."; } }
            ];
            return [
                { текст: "Accept the hospitality", эффект: function(г) { г.здоровье += 20; г.еда += 30; г.вода += 20; г.рассудок -= 10; return "The food is delicious. Too delicious. After a month in the bunker — almost unrealistically delicious. Anya doesn't eat. Just watches you."; } },
                { текст: "Ask how they know your names", эффект: function(г) { г.найденныеСекреты += 3; г.рассудок -= 8; return "The smiles don't change. 'We always knew. You are part of the plan. Subject seventeen and his group.'"; } },
                { текст: "Look around inconspicuously", эффект: function(г) { г.найденныеСекреты += 4; г.энергия -= 10; return "Behind the mirror — observation glass. Someone watches from there. Always watching. Cameras on the walls. Cameras everywhere."; } },
                { текст: "Try to leave", эффект: function(г) { г.рассудок -= 15; г.здоровье -= 10; Скримеры.показать(6); return "The doors are locked. A friendly man explains: 'Just security. You can leave tomorrow.' Tomorrow they'll say the same thing."; } }
            ];
        }
    },
    34: {
        фон: 'images2/Бункер 23 — лаборатория Ковчег.png',
        спрайт: 'учёный',
        текст: function() {
            var л = i18n.получить();
            return л === 'ru'
                ? "День 34. Лаборатория Ковчег. Аня провела вас сюда тайно. «Смотри», — говорит она. На экранах — данные. Мозговые паттерны. Ваши. С первого дня в бункере. Они наблюдали за вами всё это время."
                : "Day 34. Ark Laboratory. Anya led you here secretly. 'Look,' she says. On the screens — data. Brain patterns. Yours. From day one in the bunker. They've been watching you all along.";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Изучить данные", эффект: function(г) { г.найденныеСекреты += 5; г.рассудок -= 20; ГенПамять.установить('видел_данные', true); return "Данные показывают: каждый выбор предсказан. Каждая реакция — запрограммирована. Вы не выживали. Вы выполняли протокол. Всегда."; } },
                { текст: "Уничтожить оборудование", эффект: function(г) { г.репутация += 5; г.энергия -= 20; г.найденныеСекреты += 2; return "Экраны гаснут. Данные потеряны. Где-то срабатывает тревога. У вас есть минуты."; } },
                { текст: "Спросить Аню — она знала с самого начала?", эффект: function(г) { г.доверие -= 5; г.найденныеСекреты += 3; return "Долгая пауза. «Да». Одно слово. Потом: «Но я не знала что полюблю вас всех»."; } },
                { текст: "Скопировать данные", эффект: function(г) { г.найденныеСекреты += 6; добавитьПредмет && добавитьПредмет('💾 данные Ковчег'); ГенПамять.установить('скопировал_данные', true); return "Флешка. Данные скопированы. Это доказательство. Или приговор."; } }
            ];
            return [
                { текст: "Study the data", эффект: function(г) { г.найденныеСекреты += 5; г.рассудок -= 20; ГенПамять.установить('видел_данные', true); return "The data shows: every choice was predicted. Every reaction — programmed. You weren't surviving. You were executing a protocol. Always."; } },
                { текст: "Destroy the equipment", эффект: function(г) { г.репутация += 5; г.энергия -= 20; г.найденныеСекреты += 2; return "Screens go dark. Data lost. Somewhere an alarm sounds. You have minutes."; } },
                { текст: "Ask Anya — did she know from the start?", эффект: function(г) { г.доверие -= 5; г.найденныеСекреты += 3; return "Long pause. 'Yes.' One word. Then: 'But I didn't know I'd come to love you all.'"; } },
                { текст: "Copy the data", эффект: function(г) { г.найденныеСекреты += 6; добавитьПредмет && добавитьПредмет('💾 Ark data'); ГенПамять.установить('скопировал_данные', true); return "A flash drive. Data copied. This is evidence. Or a death sentence."; } }
            ];
        }
    },
    40: {
        фон: 'images2/Военный бункер — командный пункт.png',
        спрайт: 'игорь',
        текст: function() {
            var л = i18n.получить();
            return л === 'ru'
                ? "День 40. Военный бункер. Командный пункт. Генерал жив. Старый, сломленный, но живой. Он отдаёт приказы — в пустоту. Солдаты которым он командует погибли месяц назад. Он знает это. И всё равно командует."
                : "Day 40. Military bunker. Command post. The General is alive. Old, broken, but alive. He gives orders — to emptiness. The soldiers he commands died a month ago. He knows this. And still gives orders.";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Представиться генералу", эффект: function(г) { г.репутация += 3; г.найденныеСекреты += 2; return "Генерал смотрит долго. «Ещё один из Ковчега». Не вопрос — утверждение. «Они все были из Ковчега. Все семнадцать. Знал бы раньше — расстрелял бы проект ещё в зародыше»."; } },
                { текст: "Спросить про Проект Ковчег", эффект: function(г) { г.найденныеСекреты += 4; г.рассудок -= 10; return "Генерал рассказывает час. Проект создан вами. Вы и есть его создатель. Вы сами придумали эксперимент. Вы сами вошли в него. Потому что хотели знать: выживет ли создатель собственного эксперимента."; } },
                { текст: "Помочь генералу (принести еду)", эффект: function(г) { г.еда -= 15; г.репутация += 5; г.доверие += 3; добавитьПредмет && добавитьПредмет('📜 военные коды'); return "Генерал принимает еду молча. Потом протягивает папку. «Коды доступа. Уровень 5. На случай если вы решите закончить это всё»."; } },
                { текст: "Оставить генерала и уйти", эффект: function(г) { г.рассудок -= 5; return "За спиной — его голос: «Рота, смирно! Испытуемый семнадцать покидает зону наблюдения. Протокол продолжается. Протокол всегда продолжается»."; } }
            ];
            return [
                { текст: "Introduce yourself to the General", эффект: function(г) { г.репутация += 3; г.найденныеСекреты += 2; return "The General stares for a long time. 'Another one from Ark.' Not a question — a statement. 'They were all from Ark. All seventeen. If I'd known sooner, I'd have shut the project down in its cradle.'"; } },
                { текст: "Ask about Project Ark", эффект: function(г) { г.найденныеСекреты += 4; г.рассудок -= 10; return "The General speaks for an hour. The project was created by you. You are its creator. You designed the experiment yourself. You entered it yourself. Because you wanted to know: would the creator of their own experiment survive."; } },
                { текст: "Help the General (bring food)", эффект: function(г) { г.еда -= 15; г.репутация += 5; г.доверие += 3; добавитьПредмет && добавитьПредмет('📜 military codes'); return "The General accepts the food in silence. Then hands over a folder. 'Access codes. Level 5. In case you decide to end all this.'"; } },
                { текст: "Leave the General and go", эффект: function(г) { г.рассудок -= 5; return "Behind you — his voice: 'Company, attention! Subject seventeen is leaving the observation zone. Protocol continues. Protocol always continues.'"; } }
            ];
        }
    },
    45: {
        фон: 'images2/Медицинский бункер — операционная.png',
        спрайт: 'учёный',
        текст: function() {
            var л = i18n.получить();
            return л === 'ru'
                ? "День 45. Медицинский бункер. Операционная. Доктор Нева. Она ждала вас. «Я знала что вы придёте. Вы всегда приходите на 45-й день». Она произносит это как факт. Как будто видела это много раз."
                : "Day 45. Medical bunker. Operating room. Doctor Neva. She was waiting for you. 'I knew you'd come. You always come on day 45.' She says it like a fact. As if she's seen it many times.";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Спросить кто она такая", эффект: function(г) { г.найденныеСекреты += 3; return "«Я твой психиатр. Была твоим психиатром. Я наблюдала за тобой последние три года. В разных прохождениях». Она произносит слово «прохождениях» как обычное медицинское."; } },
                { текст: "Спросить про операционную", эффект: function(г) { г.найденныеСекреты += 2; г.рассудок -= 15; Скримеры.показать(3); return "На столах следы. Свежие. Нева не объясняет. «Протокол требует обслуживания. Испытуемые иногда... требуют перезагрузки»."; } },
                { текст: "Попросить её восстановить память", эффект: function(г) { г.найденныеСекреты += 5; г.рассудок -= 20; мета.истиннаяКонцовкаДоступна = true; return "Нева долго смотрит. «Ты уверен? В прошлый раз когда ты вспомнил всё — ты... не выдержал. Вот почему ты снова здесь»."; } },
                { текст: "Отказаться от разговора и уйти", эффект: function(г) { г.рассудок += 10; return "За дверью — её голос: «Хорошо. Запись номер сорок семь. Испытуемый семнадцать отказался от восстановления. Снова»."; } }
            ];
            return [
                { текст: "Ask who she is", эффект: function(г) { г.найденныеСекреты += 3; return "'I'm your psychiatrist. Was your psychiatrist. I've been observing you for the last three years. Through different runs.' She says the word 'runs' like a normal medical term."; } },
                { текст: "Ask about the operating room", эффект: function(г) { г.найденныеСекреты += 2; г.рассудок -= 15; Скримеры.показать(3); return "Traces on the tables. Fresh. Neva doesn't explain. 'Protocol requires maintenance. Subjects sometimes... require a reset.'"; } },
                { текст: "Ask her to restore your memory", эффект: function(г) { г.найденныеСекреты += 5; г.рассудок -= 20; мета.истиннаяКонцовкаДоступна = true; return "Neva stares for a long time. 'Are you sure? Last time you remembered everything — you... couldn't handle it. That's why you're here again.'"; } },
                { текст: "Refuse to talk and leave", эффект: function(г) { г.рассудок += 10; return "Behind the door — her voice: 'Good. Entry number forty-seven. Subject seventeen refused restoration. Again.'"; } }
            ];
        }
    },
    50: {
        фон: 'images2/Поверхность — радиационная пус.png',
        спрайт: 'none',
        текст: function() {
            var л = i18n.получить();
            return л === 'ru'
                ? "День 50. Поверхность. Радиационная пустошь. Вы вышли наружу впервые за полтора месяца. Серое небо. Пепел. Тишина. Но вдали — огни. Живые огни. Кто-то там есть. И вы знаете — вам нужно туда."
                : "Day 50. The surface. Radiation wasteland. You've gone outside for the first time in six weeks. Grey sky. Ash. Silence. But in the distance — lights. Living lights. Someone is there. And you know — you need to go there.";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Идти к огням", эффект: function(г) { г.здоровье -= 20; г.найденныеСекреты += 3; ГенПамять.установить('вышел_наружу', true); return "Огни — лагерь выживших. Их десятки. Они смотрят на вас как на призрака. «Из Бункера 17? Но тот бункер... тот бункер был закрыт три года назад»."; } },
                { текст: "Осмотреть руины вокруг", эффект: function(г) { г.найденныеСекреты += 4; г.здоровье -= 10; return "В руинах — таблички. Ваш бункер. «Бункер №17. Проект Ковчег. Закрыт в 2023 году. Испытуемые: 17». Рядом — могильные холмы. Шестнадцать холмов. Вы — семнадцатый."; } },
                { текст: "Взять образцы воздуха и вернуться", эффект: function(г) { г.здоровье -= 5; г.рассудок += 10; return "Воздух грязный, но дышать можно. Радиация падает. Мир умирает медленнее чем казалось. Это даёт надежду. Странную, горькую надежду."; } },
                { текст: "Крикнуть в пустоту", эффект: function(г) { г.рассудок -= 10; Атмосфера.показатьПомехи(2000); return "Эхо. Долгое эхо. Потом — ответный крик. Очень далеко. Очень похожий на ваш голос."; } }
            ];
            return [
                { текст: "Go toward the lights", эффект: function(г) { г.здоровье -= 20; г.найденныеСекреты += 3; ГенПамять.установить('вышел_наружу', true); return "The lights — a survivor camp. Dozens of them. They look at you like a ghost. 'From Bunker 17? But that bunker... that bunker was closed three years ago.'"; } },
                { текст: "Examine the ruins around you", эффект: function(г) { г.найденныеСекреты += 4; г.здоровье -= 10; return "In the ruins — plaques. Your bunker. 'Bunker #17. Project Ark. Closed in 2023. Subjects: 17.' Nearby — burial mounds. Sixteen mounds. You are the seventeenth."; } },
                { текст: "Take air samples and return", эффект: function(г) { г.здоровье -= 5; г.рассудок += 10; return "The air is dirty but breathable. Radiation is dropping. The world is dying slower than it seemed. This gives hope. A strange, bitter hope."; } },
                { текст: "Shout into the void", эффект: function(г) { г.рассудок -= 10; Атмосфера.показатьПомехи(2000); return "Echo. Long echo. Then — an answering shout. Very far away. Sounding very much like your own voice."; } }
            ];
        }
    },
    55: {
        фон: 'images2/Бункер 23 — лаборатория Ковчег.png',
        спрайт: 'учёный',
        текст: function() {
            var л = i18n.получить();
            var мета_д = typeof мета !== 'undefined' ? мета : { прохождений: 0 };
            if (л === 'ru') {
                return мета_д.прохождений >= 2
                    ? "День 55. Ты снова здесь. Ты знаешь что это не первый раз. Нева смотрит на тебя иначе — с чем-то похожим на уважение. «Ты единственный кто возвращается осознанно. Все остальные думали что это первый раз»."
                    : "День 55. Финальная лаборатория. Всё сходится здесь. Данные. Память. Выбор. Нева стоит у терминала. «Пришло время. Ты знаешь достаточно. Что ты выберешь?»";
            }
            return мета_д.прохождений >= 2
                ? "Day 55. You're back here again. You know this isn't the first time. Neva looks at you differently — with something like respect. 'You're the only one who returns consciously. Everyone else thought it was the first time.'"
                : "Day 55. The final laboratory. Everything converges here. Data. Memory. Choice. Neva stands at the terminal. 'The time has come. You know enough. What will you choose?'";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Уничтожить Проект Ковчег полностью", эффект: function(г) { г.репутация += 10; г.найденныеСекреты += 3; ГенПамять.установить('уничтожил_проект', true); Достижения.разблокировать('project_truth'); return "Взрыв. Данные стёрты. Проект мёртв. Нева улыбается: «Впервые. За семнадцать испытуемых — впервые кто-то это сделал». Вы спрашиваете что теперь. «Теперь — свобода. Настоящая»."; } },
                { текст: "Продолжить Проект, но изменить его", эффект: function(г) { г.найденныеСекреты += 5; г.рассудок -= 10; return "Вы берёте управление. Проект Ковчег продолжится — но теперь вы решаете кто войдёт в него и зачем. Нева уходит. «Ты стал тем, против кого боролся»."; } },
                { текст: "Передать данные миру", эффект: function(г) { г.репутация += 8; ГенПамять.установить('раскрыл_правду', true); return "Сигнал уходит во все частоты. Правда — снаружи. Что с ней сделает мир — не в ваших руках. Это страшно. Это правильно."; } },
                { текст: "Войти в следующий цикл добровольно", эффект: function(г) { г.рассудок += 20; Достижения.разблокировать('meta_aware'); ГенПамять.установить('добровольный_цикл', true); return "«Понимаю». Вы сами нажимаете кнопку. Экран гаснет. Где-то начинается день первый. Но на этот раз — вы помните. Маленький кусочек. Достаточно."; } }
            ];
            return [
                { текст: "Destroy Project Ark completely", эффект: function(г) { г.репутация += 10; г.найденныеСекреты += 3; ГенПамять.установить('уничтожил_проект', true); Достижения.разблокировать('project_truth'); return "Explosion. Data erased. The project is dead. Neva smiles: 'First time. In seventeen subjects — the first one to do this.' You ask what now. 'Now — freedom. Real freedom.'"; } },
                { текст: "Continue the Project, but change it", эффект: function(г) { г.найденныеСекреты += 5; г.рассудок -= 10; return "You take control. Project Ark will continue — but now you decide who enters it and why. Neva leaves. 'You've become what you fought against.'"; } },
                { текст: "Release the data to the world", эффект: function(г) { г.репутация += 8; ГенПамять.установить('раскрыл_правду', true); return "The signal goes out on all frequencies. The truth is outside. What the world does with it is not in your hands. That's terrifying. That's right."; } },
                { текст: "Enter the next cycle voluntarily", эффект: function(г) { г.рассудок += 20; Достижения.разблокировать('meta_aware'); ГенПамять.установить('добровольный_цикл', true); return "'I understand.' You press the button yourself. The screen goes dark. Somewhere day one begins. But this time — you remember. A small piece. Enough."; } }
            ];
        }
    },
    60: {
        фон: 'images2/Поверхность — путь через руины.png',
        спрайт: 'none',
        текст: function() {
            var л = i18n.получить();
            var генПамять = ГенПамять.загрузить();
            if (л === 'ru') {
                if (генПамять.уничтожил_проект) return "День 60. КОНЕЦ. Проект мёртв. Вы стоите снаружи. Аня держит Машу. Игорь — рядом. Горизонт серый, но там — свет. Не иллюзия. Настоящий. «Куда теперь?» — спрашивает Маша. Вы смотрите на горизонт. «Туда».";
                if (генПамять.раскрыл_правду) return "День 60. КОНЕЦ. Правда известна. Весь мир знает о Проекте Ковчег. О вас. О том что вы сделали и что с вами сделали. Это больно. Но это — правда. И с ней можно жить.";
                if (генПамять.добровольный_цикл) return "День 60. НОВЫЙ ЦИКЛ. Бункер №17. 2026 год. Вы просыпаетесь. Воздух спёртый. Пахнет ржавчиной. На столе — фотография. И маленький листок бумаги. «Ты знаешь что делать. На этот раз — по-другому».";
                return "День 60. КОНЕЦ. Шестьдесят дней. Вы выжили. Вы узнали правду. Что делать с ней — ваш выбор. Как и всегда был. Может быть, в этом и есть смысл эксперимента.";
            }
            if (генПамять.уничтожил_проект) return "Day 60. THE END. The project is dead. You stand outside. Anya holds Masha. Igor is beside you. The horizon is grey, but there — light. Not an illusion. Real. 'Where now?' asks Masha. You look at the horizon. 'There.'";
            if (генПамять.раскрыл_правду) return "Day 60. THE END. The truth is known. The whole world knows about Project Ark. About you. About what you did and what was done to you. It hurts. But it's the truth. And you can live with it.";
            if (генПамять.добровольный_цикл) return "Day 60. NEW CYCLE. Bunker #17. 2026. You wake up. Stale air. Smells of rust. On the table — a photograph. And a small piece of paper. 'You know what to do. This time — differently.'";
            return "Day 60. THE END. Sixty days. You survived. You learned the truth. What to do with it — your choice. As it always was. Maybe that's the whole point of the experiment.";
        },
        выборы: function() {
            var л = i18n.получить();
            if (л === 'ru') return [
                { текст: "Написать письмо будущему", эффект: function(г) { ПисьмоВНикуда.показатьФорму(); return ""; } },
                { текст: "Посмотреть статистику прохождения", эффект: function(г) { if (typeof показатьСтатистику !== 'undefined') показатьСтатистику('rescue'); return "Шестьдесят дней. Вся статистика перед вами."; } },
                { текст: "Начать заново", эффект: function(г) { мета.прохождений += 1; if (typeof сохранитьМету !== 'undefined') сохранитьМету(); setTimeout(function(){ location.reload(); }, 1500); return "Новое прохождение. Но что-то останется. Всегда что-то остаётся."; } }
            ];
            return [
                { текст: "Write a letter to the future", эффект: function(г) { ПисьмоВНикуда.показатьФорму(); return ""; } },
                { текст: "View playthrough statistics", эффект: function(г) { if (typeof показатьСтатистику !== 'undefined') показатьСтатистику('rescue'); return "Sixty days. All the statistics before you."; } },
                { текст: "Start over", эффект: function(г) { мета.прохождений += 1; if (typeof сохранитьМету !== 'undefined') сохранитьМету(); setTimeout(function(){ location.reload(); }, 1500); return "New playthrough. But something will remain. Something always remains."; } }
            ];
        }
    }
};

// ─── ФОНЫ ДЛЯ НОВЫХ ЛОКАЦИЙ ──────────────────────────────────────
var фоныЛокаций2 = {
    'туннель':        'images2/Туннели между бункерами.png',
    'б23_шлюз':       'images2/Бункер 23 — входной шлюз.png',
    'б23_зал':        'images2/Бункер 23 — главный зал.png',
    'б23_лаб':        'images2/Бункер 23 — лаборатория Ковчег.png',
    'военный_кп':     'images2/Военный бункер — командный пункт.png',
    'военный_оруж':   'images2/Военный бункер — оружейная.png',
    'мед_операц':     'images2/Медицинский бункер — операционная.png',
    'поверхность_рад':'images2/Поверхность — радиационная пус.png',
    'поверхность_рун':'images2/Поверхность — путь через руины.png',
    'поверхность_гор':'images2/Поверхность — разрушенный гор.png'
};

// ─── ПАТЧИНГ ОСНОВНОГО game.js ───────────────────────────────────
function запуститьРасширение() {
    // Ждём пока game.js объявит свои переменные
    if (typeof сценарии === 'undefined' || typeof обновитьИнтерфейс === 'undefined') {
        setTimeout(запуститьРасширение, 50);
        return;
    }
    (function() {

        // 1. Добавляем сценарии дней 31-60
        if (typeof сценарии !== 'undefined') {
            // Заполняем пропуски между ключевыми днями (35-39, 41-44 и т.д.)
            var шаблоны = {
                ru: [
                    { текст: "Очередной день в туннелях. Темнота. Капли воды. Шаги.", спрайт: 'none' },
                    { текст: "День проходит в тишине. Слишком тихой.", спрайт: 'none' },
                    { текст: "Ресурсы падают. Надежда — медленнее.", спрайт: 'none' },
                    { текст: "Маша рисует. Вы не смотрите что именно.", спрайт: 'none' },
                    { текст: "Игорь чистит оружие. Молчит. Значит — думает.", спрайт: 'игорь' }
                ],
                en: [
                    { текст: "Another day in the tunnels. Darkness. Dripping water. Footsteps.", спрайт: 'none' },
                    { текст: "The day passes in silence. Too quiet.", спрайт: 'none' },
                    { текст: "Resources falling. Hope — slower.", спрайт: 'none' },
                    { текст: "Masha draws. You don't look at what.", спрайт: 'none' },
                    { текст: "Igor cleans his weapon. Silent. That means — thinking.", спрайт: 'игорь' }
                ]
            };

            for (var д = 31; д <= 60; д++) {
                if (!сценарии[д]) {
                    if (сценарии2[д]) {
                        // Ключевой день — из сценарии2
                        var с2 = сценарии2[д];
                        сценарии[д] = (function(сц) {
                            return {
                                текст: typeof сц.текст === 'function' ? сц.текст : function(){ return сц.текст; },
                                выборы: typeof сц.выборы === 'function' ? сц.выборы() : сц.выборы,
                                фон: сц.фон,
                                спрайт: сц.спрайт || 'none'
                            };
                        })(с2);
                    } else {
                        // Промежуточный день — шаблон
                        var шабл = шаблоны[i18n.получить()][д % шаблоны.ru.length];
                        сценарии[д] = (function(ш, номерДня) {
                            return {
                                текст: 'День ' + номерДня + '. ' + ш.текст,
                                спрайт: ш.спрайт,
                                выборы: [
                                    { текст: i18n.получить() === 'ru' ? 'Продолжать идти' : 'Keep going', эффект: function(г) { г.энергия -= 10; г.еда -= 5; г.вода -= 5; return i18n.получить() === 'ru' ? 'Вы идёте. Это единственное что можно делать.' : 'You keep going. It\'s the only thing you can do.'; } },
                                    { текст: i18n.получить() === 'ru' ? 'Отдохнуть' : 'Rest', эффект: function(г) { г.здоровье += 10; г.рассудок += 5; г.энергия += 15; return i18n.получить() === 'ru' ? 'Отдых. Редкая роскошь.' : 'Rest. A rare luxury.'; } },
                                    { текст: i18n.получить() === 'ru' ? 'Осмотреться' : 'Look around', эффект: function(г) { if (Math.random() < 0.3) { г.найденныеСекреты += 1; г.еда += 10; return i18n.получить() === 'ru' ? 'Находка. Небольшая, но настоящая.' : 'A find. Small, but real.'; } return i18n.получить() === 'ru' ? 'Ничего. Пусто.' : 'Nothing. Empty.'; } }
                                ]
                            };
                        })(шабл, д);
                    }
                }
            }
        }

        // 2. Добавляем кнопки в панель — ждём её появления (она создаётся после клика "Начать игру")
        function добавитьКнопкиВПанель() {
            var панель = document.getElementById('панель-инструментов');
            if (!панель) {
                // Панель ещё не создана — проверяем снова через 200мс
                setTimeout(добавитьКнопкиВПанель, 200);
                return;
            }
            if (document.getElementById('кнопка-языка')) return; // уже добавлены

            var стиль = 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;padding:6px 12px;border-radius:7px;cursor:pointer;font-size:12px;white-space:nowrap;transition:all 0.2s;';

            // RU/EN
            var бЯзык = document.createElement('button');
            бЯзык.id = 'кнопка-языка';
            бЯзык.style.cssText = стиль;
            бЯзык.textContent = '🌍 RU/EN';
            бЯзык.addEventListener('click', function() {
                var текущий = i18n.получить();
                var новый = текущий === 'ru' ? 'en' : 'ru';
                i18n.установить(новый);
                if (typeof игра !== 'undefined' && typeof загрузитьДиалог !== 'undefined') {
                    загрузитьДиалог(игра.текущийДиалог);
                }
                if (typeof показатьУведомление !== 'undefined') {
                    показатьУведомление(новый === 'ru' ? '🌍 Русский язык' : '🌍 English');
                }
            });

            // Достижения
            var бДост = document.createElement('button');
            бДост.style.cssText = стиль;
            бДост.textContent = '🏅';
            бДост.title = 'Достижения / Achievements';
            бДост.addEventListener('click', function() { Достижения.показатьЭкран(); });

            // Крафт
            var бКрафт = document.createElement('button');
            бКрафт.style.cssText = стиль;
            бКрафт.textContent = '🔧';
            бКрафт.title = 'Крафт / Craft';
            бКрафт.addEventListener('click', function() {
                if (typeof игра !== 'undefined') Крафт.показатьКрафт(игра);
            });

            // Загрузить из слота
            var бЗагр = document.createElement('button');
            бЗагр.style.cssText = стиль;
            бЗагр.textContent = '📂';
            бЗагр.title = 'Загрузить / Load';
            бЗагр.addEventListener('click', function() {
                if (typeof игра !== 'undefined') {
                    Слоты.показатьЭкран('load', function(данные) {
                        if (данные && данные.игра) {
                            Object.assign(игра, данные.игра);
                            if (typeof обновитьИнтерфейс !== 'undefined') обновитьИнтерфейс();
                            if (typeof загрузитьДиалог !== 'undefined') загрузитьДиалог(игра.текущийДиалог);
                            if (typeof показатьУведомление !== 'undefined') показатьУведомление(i18n.т('загружено'));
                        }
                    }, null);
                }
            });

            панель.appendChild(бЯзык);
            панель.appendChild(бДост);
            панель.appendChild(бКрафт);
            панель.appendChild(бЗагр);

            // Патчим кнопку "Сохранить" для использования слотов
            панель.querySelectorAll('button').forEach(function(к) {
                if (к.textContent.includes('Сохранить') || к.textContent.includes('💾')) {
                    к.addEventListener('click', function(е) {
                        е.stopImmediatePropagation();
                        if (typeof игра !== 'undefined') {
                            Слоты.показатьЭкран('save', null, {
                                игра: игра,
                                дневник: typeof дневник !== 'undefined' ? дневник : [],
                                историяВыборов: typeof историяВыборов !== 'undefined' ? историяВыборов : []
                            });
                        }
                    }, true);
                }
            });

            console.log('✅ Кнопки панели добавлены');
        }
        добавитьКнопкиВПанель();

        // 4. Запускаем атмосферные эффекты
        Атмосфера.запуститьЧастицы();

        // Звук запускается на первый клик (требование браузера)
        var звукЗапущен = false;
        function запуститьЗвукПоКлику() {
            if (звукЗапущен) return;
            звукЗапущен = true;
            if (typeof аудио !== 'undefined') {
                аудио.запуститьФон();
                // Запускаем фоновые атмосферные звуки
                setTimeout(function() {
                    // атмосферный звук запускается через запуститьФон
                }, 2000);
            }
            document.removeEventListener('click', запуститьЗвукПоКлику);
            document.removeEventListener('keydown', запуститьЗвукПоКлику);
        }
        document.addEventListener('click', запуститьЗвукПоКлику);
        document.addEventListener('keydown', запуститьЗвукПоКлику);

        // 5. Инициализируем AI (HuggingFace)
        var ключ = '';
        try {
            var пользовательскийКлюч = localStorage.getItem('bunker2026_hf_key') || '';
            if (пользовательскийКлюч && пользовательскийКлюч.startsWith('hf_')) {
                ключ = пользовательскийКлюч;
            }
        } catch(e) {}
        if (typeof ИИ !== 'undefined') {
            ИИ.инит(ключ, i18n.получить());
        }

        // 6. Показываем найденную записку (письмо из прошлого прохождения)
        var письмо = ПисьмоВНикуда.получитьСлучайное();
        if (письмо && typeof мета !== 'undefined' && мета.прохождений > 0) {
            setTimeout(function() {
                if (typeof показатьУведомление !== 'undefined') {
                    показатьУведомление('📜 Найдена записка: «' + письмо.текст.substring(0, 60) + (письмо.текст.length > 60 ? '...' : '') + '»');
                }
            }, 5000);
        }

        // 7. Добавляем диалог с НПС по клику на панель НПС
        var нпсПанель = document.getElementById('нпс-панель');
        if (нпсПанель) {
            нпсПанель.addEventListener('click', function() {
                if (typeof игра !== 'undefined' && игра.нпс && игра.нпс.length > 0) {
                    var живые = игра.нпс.filter(function(н) { return н.имя !== 'Маша (ребёнок)'; });
                    if (живые.length > 0) {
                        ДиалогНПС.показать(живые[0].имя, игра);
                    }
                }
            });
        }

        // 8. Патчим обновление интерфейса для новых эффектов
        var оригОбновить = typeof обновитьИнтерфейс !== 'undefined' ? обновитьИнтерфейс : null;
        if (оригОбновить) {
            window.обновитьИнтерфейс = function() {
                оригОбновить();
                if (typeof игра !== 'undefined') {
                    Атмосфера.мигатьЛампочка(игра.энергия);
                    Атмосфера.обновитьКровь(игра.здоровье);
                    Скримеры.проверитьРассудок(игра.рассудок);
                    ИскажениеВремени.проверить(игра.день);
                    РадиоТеатр.запустить(игра.день);

                    // Ритуалы при низком рассудке
                    var ритуалыДост = Ритуалы.получитьДоступные(игра);
                    if (ритуалыДост.length > 0) {
                        var кнопки = document.getElementById('кнопки-диалога');
                        if (кнопки) {
                            var уже = кнопки.querySelector('.кнопка-ритуал');
                            if (!уже) {
                                var рит = ритуалыДост[0];
                                var б = document.createElement('button');
                                б.className = 'кнопка-выбора кнопка-ритуал';
                                б.style.borderColor = 'rgba(138,43,226,0.5)';
                                б.textContent = '🕯️ ' + рит.текст;
                                б.onclick = function() {
                                    var рез = Ритуалы.использовать(рит.ид, игра);
                                    if (рез) {
                                        var поле = document.getElementById('текст-диалога');
                                        if (поле) { поле.textContent = рез; }
                                        обновитьИнтерфейс();
                                    }
                                };
                                кнопки.appendChild(б);
                                setTimeout(function() { б.classList.add('видимая'); }, 100);
                            }
                        }
                    }

                    // Глитч-текст при низком здоровье
                    if (игра.здоровье <= 20) {
                        var поле = document.getElementById('текст-диалога');
                        if (поле && Math.random() < 0.2) Атмосфера.глитчТекст(поле, 0.3);
                    }

                    // Достижения
                    if (игра.день >= 30) Достижения.разблокировать('survivor_30');
                    if (игра.день >= 60) Достижения.разблокировать('survivor_60');
                    if (игра.найденныеСекреты >= 15) Достижения.разблокировать('all_secrets');
                    if (игра.убийства === 0 && игра.день >= 10) Достижения.разблокировать('no_kill');
                    if (игра.рассудок <= 0) Достижения.разблокировать('full_madness');
                    if (игра.спасённые >= 3) Достижения.разблокировать('save_all_npc');
                    if (typeof дневник !== 'undefined' && дневник.length >= 20) Достижения.разблокировать('archivist');
                    if (игра.доверие >= 10) Достижения.разблокировать('trust_100');
                    if (typeof мета !== 'undefined' && мета.прохождений >= 3) Достижения.разблокировать('third_play');
                }
            };
        }

        console.log('✅ game2.js загружен — расширение активно');
    })();
}

window.addEventListener('load', function() {
    setTimeout(запуститьРасширение, 50);
});

// ─── НАСТРОЙКИ GROQ КЛЮЧА ─────────────────────────────────────────
function показатьНастройкиAI() {
    var л = i18n.получить();
    var сущ = document.getElementById('настройки-ai');
    if (сущ) { сущ.remove(); return; }

    var текущийКлюч = '';
    try { текущийКлюч = localStorage.getItem('bunker2026_groq_key') || ''; } catch(e) {}

    var оверлей = document.createElement('div');
    оверлей.id = 'настройки-ai';
    оверлей.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:450px;max-width:95vw;background:rgba(5,5,15,0.98);border:1px solid rgba(0,200,100,0.4);border-radius:16px;padding:25px;z-index:9000;';

    var загол = document.createElement('h3');
    загол.style.cssText = 'color:#4ade80;font-size:18px;margin-bottom:8px';
    загол.textContent = '🤖 ' + (л === 'ru' ? 'Настройки AI' : 'AI Settings');

    var инфо = document.createElement('p');
    инфо.style.cssText = 'color:#888;font-size:12px;margin-bottom:15px;line-height:1.6';
    инфо.innerHTML = л === 'ru'
        ? 'Получи бесплатный ключ на <b style="color:#4ade80">console.groq.com</b><br>Модель: llama-3.3-70b-versatile (бесплатно)'
        : 'Get a free key at <b style="color:#4ade80">console.groq.com</b><br>Model: llama-3.3-70b-versatile (free)';

    var поле = document.createElement('input');
    поле.type = 'password';
    поле.value = текущийКлюч;
    поле.placeholder = 'gsk_...';
    поле.style.cssText = 'width:100%;background:rgba(255,255,255,0.07);border:1px solid rgba(0,200,100,0.3);color:#fff;padding:10px 14px;border-radius:8px;font-size:14px;outline:none;margin-bottom:10px;';

    var статус = document.createElement('div');
    статус.style.cssText = 'font-size:12px;margin-bottom:12px;padding:6px 10px;border-radius:6px;';
    if (текущийКлюч && текущийКлюч.startsWith('gsk_')) {
        статус.style.background = 'rgba(74,222,128,0.1)';
        статус.style.color = '#4ade80';
        статус.textContent = л === 'ru' ? '✅ AI активен' : '✅ AI active';
    } else {
        статус.style.background = 'rgba(255,100,100,0.1)';
        статус.style.color = '#f87171';
        статус.textContent = л === 'ru' ? '❌ Ключ не задан — используются заготовленные ответы' : '❌ No key — using fallback responses';
    }

    var бСохр = document.createElement('button');
    бСохр.style.cssText = 'width:100%;background:rgba(74,222,128,0.2);border:1px solid rgba(74,222,128,0.4);color:#4ade80;padding:12px;border-radius:8px;cursor:pointer;font-size:15px;margin-bottom:8px;';
    бСохр.textContent = л === 'ru' ? '💾 Сохранить ключ' : '💾 Save Key';
    бСохр.onclick = function() {
        var ключ = поле.value.trim();
        try { localStorage.setItem('bunker2026_hf_key', ключ); } catch(e) {}
        if (typeof ИИ !== 'undefined') ИИ.инит(ключ, i18n.получить());
        оверлей.remove();
        if (typeof показатьУведомление !== 'undefined') {
            показатьУведомление(ключ.startsWith('hf_') ? '🤖 AI активирован!' : '⚠️ Ключ сохранён');
        }
    };

    var бЗакрыть = document.createElement('button');
    бЗакрыть.style.cssText = 'width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#888;padding:10px;border-radius:8px;cursor:pointer;';
    бЗакрыть.textContent = '✕';
    бЗакрыть.onclick = function() { оверлей.remove(); };

    оверлей.appendChild(загол);
    оверлей.appendChild(инфо);
    оверлей.appendChild(статус);
    оверлей.appendChild(поле);
    оверлей.appendChild(бСохр);
    оверлей.appendChild(бЗакрыть);
    document.body.appendChild(оверлей);
    поле.focus();
}

// Экспорт
window.показатьНастройкиAI = показатьНастройкиAI;
window.i18n = i18n;
window.Скримеры = Скримеры;
window.Атмосфера = Атмосфера;
window.ГенПамять = ГенПамять;
window.Ритуалы = Ритуалы;
window.Крафт = Крафт;
window.РадиоТеатр = РадиоТеатр;
window.ДиалогНПС = ДиалогНПС;
window.ИскажениеВремени = ИскажениеВремени;
window.ПисьмоВНикуда = ПисьмоВНикуда;
window.сценарии2 = сценарии2;
