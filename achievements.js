// ═══════════════════════════════════════════════════════════════
// БУНКЕР 2026 — ДОСТИЖЕНИЯ + СЛОТЫ СОХРАНЕНИЙ
// ═══════════════════════════════════════════════════════════════

// ─── СИСТЕМА ДОСТИЖЕНИЙ ──────────────────────────────────────────
var Достижения = (function() {

    var список = [
        { ид: 'survivor_30',   иконка: '🏆', название: { ru: 'Выживший',         en: 'Survivor'        }, описание: { ru: 'Прожить 30 дней',              en: 'Survive 30 days'             }, секрет: false },
        { ид: 'survivor_60',   иконка: '💀', название: { ru: 'Железный человек',  en: 'Iron Man'        }, описание: { ru: 'Прожить все 60 дней',          en: 'Survive all 60 days'         }, секрет: false },
        { ид: 'all_secrets',   иконка: '🔍', название: { ru: 'Вся правда',        en: 'Whole Truth'     }, описание: { ru: 'Найти все 15 секретов',        en: 'Find all 15 secrets'         }, секрет: false },
        { ид: 'save_all_npc',  иконка: '👥', название: { ru: 'Никого не бросил',  en: 'No One Left'     }, описание: { ru: 'Спасти всех НПС',             en: 'Save all NPCs'               }, секрет: false },
        { ид: 'true_ending',   иконка: '🌟', название: { ru: 'Истинная концовка', en: 'True Ending'     }, описание: { ru: 'Открыть истинную концовку',   en: 'Unlock the true ending'      }, секрет: true  },
        { ид: 'no_kill',       иконка: '🕊️', название: { ru: 'Пацифист',         en: 'Pacifist'        }, описание: { ru: 'Не убить никого',             en: 'Kill no one'                 }, секрет: false },
        { ид: 'full_madness',  иконка: '🌀', название: { ru: 'Добро пожаловать', en: 'Welcome'         }, описание: { ru: 'Довести рассудок до 0',       en: 'Reduce sanity to 0'          }, секрет: true  },
        { ид: 'third_play',    иконка: '🔄', название: { ru: 'Ты снова здесь',   en: 'You\'re Back'    }, описание: { ru: 'Пройти игру 3 раза',          en: 'Complete 3 playthroughs'     }, секрет: true  },
        { ид: 'fake_ending',   иконка: '🎭', название: { ru: 'Обманут',          en: 'Deceived'        }, описание: { ru: 'Получить фальшивую концовку', en: 'Get the fake ending'         }, секрет: true  },
        { ид: 'archivist',     иконка: '📚', название: { ru: 'Архивариус',       en: 'Archivist'       }, описание: { ru: 'Заполнить дневник 20 записями', en: '20 diary entries'          }, секрет: false },
        { ид: 'trust_100',     иконка: '❤️', название: { ru: 'Доверие',          en: 'Trust'           }, описание: { ru: 'Получить максимальное доверие', en: 'Max trust from NPCs'       }, секрет: false },
        { ид: 'bunker23',      иконка: '🏭', название: { ru: 'Бункер 23',        en: 'Bunker 23'       }, описание: { ru: 'Добраться до Бункера 23',     en: 'Reach Bunker 23'             }, секрет: false },
        { ид: 'all_tapes',     иконка: '📼', название: { ru: 'Коллекционер',     en: 'Collector'       }, описание: { ru: 'Найти все 7 кассет',          en: 'Find all 7 tapes'            }, секрет: false },
        { ид: 'double_found',  иконка: '👤', название: { ru: 'Двойник',          en: 'Doppelganger'    }, описание: { ru: 'Встретить двойника',          en: 'Meet the doppelganger'       }, секрет: true  },
        { ид: 'project_truth', иконка: '🧬', название: { ru: 'Создатель',        en: 'The Creator'     }, описание: { ru: 'Узнать всю правду о проекте', en: 'Learn the full truth'        }, секрет: true  },
        { ид: 'ritual_master', иконка: '🕯️', название: { ru: 'Ритуалист',       en: 'Ritualist'       }, описание: { ru: 'Использовать все ритуалы',    en: 'Use all survival rituals'    }, секрет: false },
        { ид: 'letter_sent',   иконка: '✉️', название: { ru: 'Послание',         en: 'Message'         }, описание: { ru: 'Написать письмо будущему',    en: 'Write a letter to the future'}, секрет: false },
        { ид: 'radio_lore',    иконка: '📡', название: { ru: 'Слушатель',        en: 'Listener'        }, описание: { ru: 'Услышать все радиосигналы',   en: 'Hear all radio signals'      }, секрет: false },
        { ид: 'craft_master',  иконка: '🔧', название: { ru: 'Инженер',          en: 'Engineer'        }, описание: { ru: 'Создать 5 предметов крафтом',  en: 'Craft 5 items'              }, секрет: false },
        { ид: 'meta_aware',    иконка: '🎮', название: { ru: 'Осознание',        en: 'Awareness'       }, описание: { ru: 'Достичь мета-осознания',      en: 'Achieve meta-awareness'      }, секрет: true  }
    ];

    var разблокированные = {};
    var язык = 'ru';

    function загрузить() {
        try {
            var д = JSON.parse(localStorage.getItem('bunker2026_achievements') || '{}');
            разблокированные = д;
        } catch(e) { разблокированные = {}; }
    }

    function сохранить() {
        try { localStorage.setItem('bunker2026_achievements', JSON.stringify(разблокированные)); } catch(e) {}
    }

    function разблокировать(ид) {
        if (разблокированные[ид]) return; // уже есть
        разблокированные[ид] = Date.now();
        сохранить();
        var достижение = список.find(function(д) { return д.ид === ид; });
        if (достижение) показатьПопап(достижение);
    }

    function проверить(ид) { return !!разблокированные[ид]; }

    function установитьЯзык(л) { язык = л; }

    function показатьПопап(д) {
        var попап = document.createElement('div');
        попап.style.cssText = `
            position: fixed; bottom: 120px; right: 20px;
            background: rgba(10,10,20,0.97);
            border: 1px solid rgba(245,166,35,0.6);
            border-radius: 12px; padding: 14px 18px;
            z-index: 99999; display: flex; align-items: center; gap: 12px;
            box-shadow: 0 0 30px rgba(245,166,35,0.3);
            transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
            max-width: 280px;
        `;
        var иконкаЭл = document.createElement('div');
        иконкаЭл.style.cssText = 'font-size:28px;flex-shrink:0';
        иконкаЭл.textContent = д.иконка;
        var текстБлок = document.createElement('div');
        var заголовок = document.createElement('div');
        заголовок.style.cssText = 'color:#f5a623;font-size:11px;font-weight:bold;letter-spacing:1px;margin-bottom:3px';
        заголовок.textContent = язык === 'ru' ? '🏅 ДОСТИЖЕНИЕ' : '🏅 ACHIEVEMENT';
        var названиеЭл = document.createElement('div');
        названиеЭл.style.cssText = 'color:#fff;font-size:14px;font-weight:bold';
        названиеЭл.textContent = д.название[язык] || д.название.ru;
        var описаниеЭл = document.createElement('div');
        описаниеЭл.style.cssText = 'color:#aaa;font-size:12px;margin-top:2px';
        описаниеЭл.textContent = д.описание[язык] || д.описание.ru;
        текстБлок.appendChild(заголовок);
        текстБлок.appendChild(названиеЭл);
        текстБлок.appendChild(описаниеЭл);
        попап.appendChild(иконкаЭл);
        попап.appendChild(текстБлок);
        document.body.appendChild(попап);

        setTimeout(function() { попап.style.transform = 'translateX(0)'; }, 50);
        setTimeout(function() {
            попап.style.transform = 'translateX(120%)';
            setTimeout(function() { if (попап.parentNode) попап.parentNode.removeChild(попап); }, 400);
        }, 4000);
    }

    function показатьЭкран() {
        var сущ = document.getElementById('экран-достижений');
        if (сущ) { сущ.remove(); return; }

        var оверлей = document.createElement('div');
        оверлей.id = 'экран-достижений';
        оверлей.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:8000;overflow-y:auto;padding:30px 20px;';

        var контент = document.createElement('div');
        контент.style.cssText = 'max-width:700px;margin:0 auto;';

        var шапка = document.createElement('div');
        шапка.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;';
        var загол = document.createElement('h2');
        загол.style.cssText = 'color:#f5a623;font-size:24px';
        загол.textContent = язык === 'ru' ? '🏅 Достижения' : '🏅 Achievements';
        var счёт = document.createElement('span');
        var разбл = Object.keys(разблокированные).length;
        счёт.style.cssText = 'color:#888;font-size:14px';
        счёт.textContent = разбл + ' / ' + список.length;
        var закрыть = document.createElement('button');
        закрыть.style.cssText = 'background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 16px;border-radius:8px;cursor:pointer';
        закрыть.textContent = '✕';
        закрыть.onclick = function() { оверлей.remove(); };
        шапка.appendChild(загол);
        шапка.appendChild(счёт);
        шапка.appendChild(закрыть);
        контент.appendChild(шапка);

        // Прогресс бар
        var прогрБлок = document.createElement('div');
        прогрБлок.style.cssText = 'background:rgba(255,255,255,0.05);border-radius:10px;height:6px;margin-bottom:20px;overflow:hidden;';
        var прогрПол = document.createElement('div');
        прогрПол.style.cssText = 'height:100%;background:linear-gradient(90deg,#f5a623,#e94560);border-radius:10px;transition:width 1s ease;width:' + (разбл/список.length*100) + '%';
        прогрБлок.appendChild(прогрПол);
        контент.appendChild(прогрБлок);

        var сетка = document.createElement('div');
        сетка.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;';

        список.forEach(function(д) {
            var откр = !!разблокированные[д.ид];
            var скрыт = д.секрет && !откр;

            var карточка = document.createElement('div');
            карточка.style.cssText = 'background:' + (откр ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.03)') + ';' +
                'border:1px solid ' + (откр ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.07)') + ';' +
                'border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;' +
                (откр ? '' : 'opacity:0.5;');

            var ик = document.createElement('div');
            ик.style.cssText = 'font-size:24px;flex-shrink:0;' + (откр ? '' : 'filter:grayscale(1)');
            ик.textContent = скрыт ? '❓' : д.иконка;

            var тб = document.createElement('div');
            var нм = document.createElement('div');
            нм.style.cssText = 'color:' + (откр ? '#f5a623' : '#888') + ';font-size:13px;font-weight:bold';
            нм.textContent = скрыт ? (язык === 'ru' ? '???' : '???') : (д.название[язык] || д.название.ru);
            var оп = document.createElement('div');
            оп.style.cssText = 'color:#666;font-size:11px;margin-top:2px';
            оп.textContent = скрыт ? (язык === 'ru' ? 'Секретное достижение' : 'Secret achievement') : (д.описание[язык] || д.описание.ru);

            тб.appendChild(нм);
            тб.appendChild(оп);
            карточка.appendChild(ик);
            карточка.appendChild(тб);
            сетка.appendChild(карточка);
        });

        контент.appendChild(сетка);
        оверлей.appendChild(контент);
        document.body.appendChild(оверлей);
    }

    загрузить();

    return {
        разблокировать: разблокировать,
        проверить: проверить,
        показатьЭкран: показатьЭкран,
        установитьЯзык: установитьЯзык,
        список: список
    };
})();


// ─── СИСТЕМА СЛОТОВ СОХРАНЕНИЙ ────────────────────────────────────
var Слоты = (function() {

    var КЛЮЧ = 'bunker2026_slots';
    var язык = 'ru';

    function установитьЯзык(л) { язык = л; }

    function получитьВсе() {
        try { return JSON.parse(localStorage.getItem(КЛЮЧ) || '{}'); } catch(e) { return {}; }
    }

    function сохранитьВСлот(номер, данныеИгры) {
        var слоты = получитьВсе();
        слоты[номер] = {
            данные: данныеИгры,
            дата: new Date().toLocaleString('ru'),
            день: данныеИгры.игра ? данныеИгры.игра.день : 1,
            здоровье: данныеИгры.игра ? данныеИгры.игра.здоровье : 100,
            рассудок: данныеИгры.игра ? данныеИгры.игра.рассудок : 100
        };
        try { localStorage.setItem(КЛЮЧ, JSON.stringify(слоты)); return true; } catch(e) { return false; }
    }

    function загрузитьИзСлота(номер) {
        var слоты = получитьВсе();
        return слоты[номер] ? слоты[номер].данные : null;
    }

    function удалитьСлот(номер) {
        var слоты = получитьВсе();
        delete слоты[номер];
        try { localStorage.setItem(КЛЮЧ, JSON.stringify(слоты)); } catch(e) {}
    }

    function показатьЭкран(режим, колбэкЗагрузки, текущиеДанные) {
        // режим: 'save' или 'load'
        var сущ = document.getElementById('экран-слотов');
        if (сущ) { сущ.remove(); return; }

        var слоты = получитьВсе();
        var л = язык === 'ru';

        var оверлей = document.createElement('div');
        оверлей.id = 'экран-слотов';
        оверлей.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;max-width:95vw;background:rgba(5,5,15,0.98);border:1px solid rgba(138,43,226,0.5);border-radius:16px;padding:25px;z-index:9000;box-shadow:0 0 60px rgba(138,43,226,0.2);';

        var загол = document.createElement('h3');
        загол.style.cssText = 'color:#8a2be2;font-size:20px;margin-bottom:20px;text-align:center';
        загол.textContent = режим === 'save'
            ? (л ? '💾 Сохранить игру' : '💾 Save Game')
            : (л ? '📂 Загрузить игру' : '📂 Load Game');
        оверлей.appendChild(загол);

        [1, 2, 3].forEach(function(н) {
            var слот = слоты[н];
            var карточка = document.createElement('div');
            карточка.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:14px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all 0.2s;';
            карточка.onmouseenter = function() { this.style.background = 'rgba(138,43,226,0.15)'; this.style.borderColor = 'rgba(138,43,226,0.4)'; };
            карточка.onmouseleave = function() { this.style.background = 'rgba(255,255,255,0.04)'; this.style.borderColor = 'rgba(255,255,255,0.1)'; };

            var инфо = document.createElement('div');
            var номерЭл = document.createElement('div');
            номерЭл.style.cssText = 'color:#8a2be2;font-size:13px;font-weight:bold;margin-bottom:4px';
            номерЭл.textContent = (л ? 'Слот ' : 'Slot ') + н;
            var детали = document.createElement('div');
            детали.style.cssText = 'color:#888;font-size:12px';

            if (слот) {
                детали.innerHTML = (л ? '📅 День ' : '📅 Day ') + слот.день +
                    ' &nbsp;❤️ ' + слот.здоровье +
                    ' &nbsp;🧠 ' + слот.рассудок +
                    '<br><span style="color:#555;font-size:11px">' + слот.дата + '</span>';
            } else {
                детали.textContent = л ? 'Пусто' : 'Empty';
                детали.style.color = '#444';
            }

            инфо.appendChild(номерЭл);
            инфо.appendChild(детали);

            var кнопкиБлок = document.createElement('div');
            кнопкиБлок.style.cssText = 'display:flex;gap:6px;';

            if (режим === 'save') {
                var бСохр = document.createElement('button');
                бСохр.style.cssText = 'background:rgba(138,43,226,0.3);border:1px solid rgba(138,43,226,0.5);color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;';
                бСохр.textContent = л ? 'Сохранить' : 'Save';
                бСохр.onclick = function(е) {
                    е.stopPropagation();
                    if (сохранитьВСлот(н, текущиеДанные)) {
                        оверлей.remove();
                        показатьМиниУведомление(л ? '💾 Сохранено в слот ' + н : '💾 Saved to slot ' + н);
                    }
                };
                кнопкиБлок.appendChild(бСохр);
            } else {
                if (слот) {
                    var бЗагр = document.createElement('button');
                    бЗагр.style.cssText = 'background:rgba(74,222,128,0.2);border:1px solid rgba(74,222,128,0.4);color:#4ade80;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;';
                    бЗагр.textContent = л ? 'Загрузить' : 'Load';
                    бЗагр.onclick = function(е) {
                        е.stopPropagation();
                        var данные = загрузитьИзСлота(н);
                        if (данные && колбэкЗагрузки) {
                            оверлей.remove();
                            колбэкЗагрузки(данные);
                        }
                    };
                    кнопкиБлок.appendChild(бЗагр);

                    var бУдал = document.createElement('button');
                    бУдал.style.cssText = 'background:rgba(233,69,96,0.2);border:1px solid rgba(233,69,96,0.3);color:#e94560;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;';
                    бУдал.textContent = '🗑️';
                    бУдал.onclick = function(е) {
                        е.stopPropagation();
                        удалитьСлот(н);
                        оверлей.remove();
                        показатьЭкран(режим, колбэкЗагрузки, текущиеДанные);
                    };
                    кнопкиБлок.appendChild(бУдал);
                }
            }

            карточка.appendChild(инфо);
            карточка.appendChild(кнопкиБлок);
            оверлей.appendChild(карточка);
        });

        var бЗакрыть = document.createElement('button');
        бЗакрыть.style.cssText = 'width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#888;padding:10px;border-radius:8px;cursor:pointer;margin-top:5px;font-size:14px;';
        бЗакрыть.textContent = л ? '✕ Закрыть' : '✕ Close';
        бЗакрыть.onclick = function() { оверлей.remove(); };
        оверлей.appendChild(бЗакрыть);

        document.body.appendChild(оверлей);
    }

    function показатьМиниУведомление(текст) {
        var эл = document.createElement('div');
        эл.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(0,0,0,0.9);color:#fff;padding:10px 20px;border-radius:8px;border:1px solid rgba(138,43,226,0.4);font-size:14px;z-index:99999;opacity:0;transition:all 0.3s;pointer-events:none;';
        эл.textContent = текст;
        document.body.appendChild(эл);
        setTimeout(function() { эл.style.opacity = '1'; эл.style.transform = 'translateX(-50%) translateY(0)'; }, 50);
        setTimeout(function() {
            эл.style.opacity = '0';
            setTimeout(function() { if (эл.parentNode) эл.parentNode.removeChild(эл); }, 300);
        }, 2500);
    }

    return {
        показатьЭкран: показатьЭкран,
        сохранитьВСлот: сохранитьВСлот,
        загрузитьИзСлота: загрузитьИзСлота,
        установитьЯзык: установитьЯзык
    };
})();
