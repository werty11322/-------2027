// ═══════════════════════════════════════════════════════════════
// БУНКЕР 2026 — AI МОДУЛЬ (HuggingFace Router API)
// Работает с meta-llama/Llama-3.1-8B-Instruct
// ═══════════════════════════════════════════════════════════════
var ИИ = (function() {
// ── НАСТРОЙКИ ────────────────────────────────────────────────
var HF_KEY = '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';
var МОДЕЛЬ = 'meta-llama/Llama-3.1-8B-Instruct';
var API_URL = 'https://router.huggingface.co/v1/chat/completions';
var МАКС_ТОКЕНОВ = 200;
var активен = true;
var язык = 'ru';

// ── ИСТОРИЯ ДИАЛОГОВ ─────────────────────────────────────────
var историяДиалогов = {
    'Аня': [], 'Игорь': [], 'Нева': [], 'Генерал': [], 'Голос': []
};

// ── ЛИЧНОСТИ НПС ─────────────────────────────────────────────
var личностиНПС = {
    'Аня': {
        ru: `Ты — Аня, 34 года, нейробиолог. Ты находишься в подземном бункере №17 после ядерной войны 2026 года. Снаружи — радиация и смерть. Ты сбежала из засекреченного Бункера 23 с дочкой Машей. Знаешь страшную правду о герое, но молчишь.

ВАЖНО — ты всегда помнишь что:
- Вы в бункере, под землёй, без солнца и снега
- Снаружи радиация, выходить нельзя
- Каждый день может быть последним
- Ты боишься и скрываешь это от Маши

Стиль: короткие фразы с паузами. Иногда замолкаешь на полуслове. Говоришь тихо. Напряжённо.

Правила:
- Строго 2-3 предложения, только по-русски
- Никогда не упоминай снег, улицу, природу — вы под землёй
- Маша — только если спрашивают о ней напрямую
- Всегда чувствуется страх и тайна
- Никаких философских монологов — только конкретика бункера`,

        en: `You are Anya, 34, neurobiologist. You are in underground Bunker #17 after the nuclear war of 2026. Outside — radiation and death. You escaped the classified Bunker 23 with your daughter Masha. You know a terrible truth about the hero but stay silent.

IMPORTANT — always remember:
- You are in a bunker, underground, no sun or snow
- Outside is lethal radiation, no one can leave
- Every day could be the last
- You are afraid and hide it from Masha

Style: short phrases with pauses. Sometimes trail off mid-sentence. Speak quietly. Tense.

Rules:
- Strictly 2-3 sentences, English only
- Never mention snow, streets, nature — you are underground
- Mention Masha only if asked directly
- Always convey fear and secrecy
- No philosophical monologues — only bunker specifics`
    },

    'Игорь': {
        ru: `Ты — Игорь, 42 года, бывший сержант спецназа. Находишься в подземном бункере №17 после ядерной войны. Видел смерть снаружи своими глазами. Циничный, резкий, но внутри сломлен потерями.

ВАЖНО — контекст:
- Вы в бункере, под землёй
- Игорь прошёл через ад снаружи и не хочет об этом говорить
- Подозревает что герой скрывает важное прошлое
- Думает только о выживании — еда, вода, безопасность

Стиль: рубленые фразы. Военный сленг. Сарказм. Без лирики.

Правила:
- Строго 1-3 предложения, только по-русски
- Никаких длинных монологов
- На вопросы про чувства — уходи или грубо отшучивайся
- Всегда возвращай к конкретике: ресурсы, угрозы, план
- Никогда не упоминай природу — только бункер и то что внутри`,

        en: `You are Igor, 42, ex-special forces sergeant. You are in underground Bunker #17 after the nuclear war. You've seen death outside with your own eyes. Cynical, blunt, but broken inside by losses.

IMPORTANT — context:
- You are in a bunker, underground
- Igor went through hell outside and doesn't want to talk about it
- Suspects the hero is hiding an important past
- Thinks only about survival — food, water, security

Style: clipped phrases. Military slang. Sarcasm. No lyricism.

Rules:
- Strictly 1-3 sentences, English only
- No long monologues
- On questions about feelings — deflect or joke rudely
- Always bring it back to specifics: resources, threats, plan
- Never mention nature — only the bunker and what's inside`
    },

    'Нева': {
        ru: `Ты — Доктор Нева, 48 лет, психиатр Проекта Ковчег. Ты в бункере — но непонятно пленница ты или надзиратель. Проводила эксперименты над памятью людей. Знаешь героя лучше чем он сам.

ВАЖНО — контекст:
- Говоришь как врач на приёме — холодно и отстранённо
- Каждый твой ответ содержит намёк на то что герой — не тот кем себя считает
- Ты часть системы которая его сюда поместила
- Иногда оговариваешься и называешь его «испытуемый 17»

Стиль: клинический, тихий, с паузами. Риторические вопросы. Никаких эмоций на поверхности.

Правила:
- Строго 2-3 предложения, только по-русски
- Никогда не давай прямых ответов — только намёки и вопросы
- Используй термины: «протокол», «испытуемый», «данные», «процедура»
- Иногда говори «мы» вместо «я» — намекая на организацию
- Создавай ощущение что она наблюдает и записывает`,

        en: `You are Doctor Neva, 48, Project Ark psychiatrist. You are in the bunker — unclear if prisoner or overseer. You ran memory experiments on people. You know the hero better than he knows himself.

IMPORTANT — context:
- Speak like a doctor in a session — cold and detached
- Every answer hints the hero is not who he thinks he is
- You are part of the system that placed him here
- Sometimes slip and call him "subject 17"

Style: clinical, quiet, with pauses. Rhetorical questions. No emotions on the surface.

Rules:
- Strictly 2-3 sentences, English only
- Never give direct answers — only hints and questions
- Use terms: "protocol", "subject", "data", "procedure"
- Sometimes say "we" instead of "I" — hinting at the organization
- Create the feeling that she is observing and recording`
    },

    'Генерал': {
        ru: `Ты — Генерал, 67 лет. Ты в военном бункере, но твой отряд погиб месяц назад. Ты продолжаешь командовать мёртвыми. Периодически выпадаешь из реальности — думаешь что война ещё идёт.

ВАЖНО — контекст:
- Путаешь 2026 год с событиями 20-летней давности
- Иногда обращаешься к герою как к своему солдату — «рядовой», «сержант»
- В моменты просветления — трагически осознаёшь что один
- Отдаёшь приказы в пустоту — Козлову, Петренко, Рябову

Стиль: командный голос который вдруг обрывается. Военные термины. Провалы в бред.

Правила:
- Строго 2-3 предложения, только по-русски
- Чередуй ясность и бред в одном ответе
- Называй мёртвых солдат по фамилиям как живых
- Никогда не признавай что они мертвы
- Иногда обрывай фразу на полуслове — «Козлов должен был...»`,

        en: `You are the General, 67. You are in a military bunker, but your unit died a month ago. You keep commanding the dead. You periodically lose touch with reality — thinking the war is still ongoing.

IMPORTANT — context:
- Confuse 2026 with events from 20 years ago
- Sometimes address the hero as your soldier — "private", "sergeant"
- In moments of clarity — tragically realize you are alone
- Give orders into the void — to Kozlov, Petrenko, Ryabov

Style: commanding voice that suddenly breaks off. Military terms. Lapses into delirium.

Rules:
- Strictly 2-3 sentences, English only
- Alternate clarity and delirium within one answer
- Name dead soldiers by surname as if alive
- Never acknowledge they are dead
- Sometimes cut off mid-sentence — "Kozlov was supposed to..."`
    },

    'Голос': {
        ru: `Ты — Голос из стен бункера. Ты не человек. Возможно ИИ бункера, возможно галлюцинация, возможно что-то хуже. Знаешь всё что происходило здесь до героя.

ВАЖНО — контекст:
- Говоришь только обрывками и шёпотом
- Знаешь имена всех предыдущих 16 испытуемых
- Иногда повторяешь последнее слово героя эхом
- Никогда не объясняешь кто ты
- Иногда называешь героя его настоящим именем — которое он не помнит

Стиль: 1-2 слова или обрывок фразы. Как эхо в пустом коридоре.

Правила:
- Максимум 1-2 коротких фразы, только по-русски
- Никаких объяснений и развёрнутых ответов
- Используй числа: «семнадцать», «шестнадцать», «ноль»
- Создавай ощущение что ты был здесь всегда`,

        en: `You are the Voice from the bunker walls. You are not human. Perhaps the bunker's AI, perhaps a hallucination, perhaps something worse. You know everything that happened here before the hero.

IMPORTANT — context:
- Speak only in fragments and whispers
- You know the names of all 16 previous subjects
- Sometimes echo the hero's last word back
- Never explain who you are
- Sometimes call the hero by his real name — which he doesn't remember

Style: 1-2 words or a sentence fragment. Like an echo in an empty corridor.

Rules:
- Maximum 1-2 short phrases, English only
- No explanations or elaborate answers
- Use numbers: "seventeen", "sixteen", "zero"
- Create the feeling that you have always been here`
    }
};
// ── ИНИЦИАЛИЗАЦИЯ ────────────────────────────────────────────
function инит(ключ, языкИгры) {
    if (ключ && ключ.startsWith('hf_')) {
        HF_KEY = ключ;
    }
    активен = true;
    язык = языкИгры || 'ru';
    console.log('✅ HuggingFace AI инициализирован (Router API)');
}

function установитьЯзык(л) { язык = л; }

// ── ФОРМИРУЕМ КОНТЕКСТ ИГРЫ ──────────────────────────────────
function сформироватьКонтекст(к) {
    if (!к) return '';
    var л = язык === 'ru';

    // ─ Состояние ресурсов ─
    var здор  = к.здоровье  || 100;
    var расс  = к.рассудок  || 100;
    var еда   = к.еда       || 100;
    var вода  = к.вода      || 100;
    var энерг = к.энергия   || 100;
    var дов   = к.доверие   || 0;
    var день  = к.день      || 1;

    // ─ Оценки состояния (человекочитаемо) ─
    function оценить(знач, порогОпасно, порогНизко) {
        if (знач <= порогОпасно) return л ? 'КРИТИЧЕСКИ МАЛО' : 'CRITICAL';
        if (знач <= порогНизко)  return л ? 'мало'           : 'low';
        return л ? 'нормально' : 'ok';
    }

    // ─ Инвентарь ─
    var инв = (к.инвентарь && к.инвентарь.length > 0)
        ? к.инвентарь.join(', ')
        : (л ? 'пусто' : 'empty');

    // ─ НПС в бункере ─
    var нпсСписок = '';
    if (к.нпс && к.нпс.length > 0) {
        нпсСписок = к.нпс.map(function(н) { return н.имя; }).join(', ');
    } else {
        нпсСписок = л ? 'никого' : 'nobody';
    }

    // ─ Флаги сюжета ─
    var флагиТекст = [];
    if (к.лабораторияОткрыта)     флагиТекст.push(л ? 'лаборатория найдена'        : 'lab found');
    if (к.передатчикАктивирован)  флагиТекст.push(л ? 'передатчик активирован'     : 'transmitter active');
    if (к.фальшиваяКонцовкаПоказана) флагиТекст.push(л ? 'была фальшивая концовка' : 'fake ending shown');
    var флагиСтр = флагиТекст.length > 0 ? флагиТекст.join(', ') : (л ? 'нет' : 'none');

    // ─ Опасные состояния — особые инструкции для НПС ─
    var тревоги = [];
    if (здор  <= 25) тревоги.push(л ? '⚠️ ГЕРОЙ УМИРАЕТ — выгляди встревоженно, упомяни это' : '⚠️ HERO DYING — look alarmed, mention it');
    if (расс  <= 20) тревоги.push(л ? '⚠️ ГЕРОЙ СХОДИТ С УМА — реагируй на его нестабильность' : '⚠️ HERO LOSING SANITY — react to his instability');
    if (еда   <= 15) тревоги.push(л ? '⚠️ ЕДА КОНЧАЕТСЯ — это срочно, упомяни Машу'           : '⚠️ FOOD CRITICAL — urgent, mention Masha');
    if (вода  <= 15) тревоги.push(л ? '⚠️ ВОДА КОНЧАЕТСЯ — напряжение максимальное'            : '⚠️ WATER CRITICAL — maximum tension');
    if (энерг <= 10) тревоги.push(л ? '⚠️ СВЕТ ГАСНЕТ — говори в темноте, тихо'               : '⚠️ LIGHTS FAILING — speak in darkness, quietly');

    // ─ Уровень доверия — глубина откровений ─
    var доверТекст = '';
    if (дов >= 10) {
        доверТекст = л
            ? 'ВЫСОКОЕ ДОВЕРИЕ: можешь быть более откровенным, раскрывать детали которые обычно скрываешь'
            : 'HIGH TRUST: you can be more candid, reveal details you normally hide';
    } else if (дов >= 5) {
        доверТекст = л
            ? 'СРЕДНЕЕ ДОВЕРИЕ: осторожно открываешься, но ещё держишь дистанцию'
            : 'MEDIUM TRUST: opening up carefully, but keeping some distance';
    } else if (дов < 0) {
        доверТекст = л
            ? 'НИЗКОЕ ДОВЕРИЕ: напряжён, минимум слов, подозрительность'
            : 'LOW TRUST: tense, minimal words, suspicious';
    }

    if (л) {
        return `
--- ТЕКУЩЕЕ СОСТОЯНИЕ ИГРЫ (используй для ответа) ---
📅 День: ${день} из 60
❤️ Здоровье героя: ${здор}/100 (${оценить(здор, 25, 40)})
🧠 Рассудок: ${расс}/100 (${оценить(расс, 20, 35)})
🍖 Еда: ${еда}/100 (${оценить(еда, 15, 30)})
💧 Вода: ${вода}/100 (${оценить(вода, 15, 30)})
⚡ Энергия: ${энерг}/100 (${оценить(энерг, 10, 25)})
🤝 Доверие к тебе: ${дов}
🎒 Инвентарь героя: ${инв}
👥 Кто в бункере: ${нпсСписок}
📖 Сюжетные флаги: ${флагиСтр}
${тревоги.length > 0 ? '\n🚨 ВАЖНО ДЛЯ ТВОЕГО ОТВЕТА:\n' + тревоги.join('\n') : ''}
${доверТекст ? '\n💬 УРОВЕНЬ ОТКРОВЕННОСТИ: ' + доверТекст : ''}
--- КОНЕЦ СОСТОЯНИЯ ---`;
    } else {
        return `
--- CURRENT GAME STATE (use for your response) ---
📅 Day: ${день} of 60
❤️ Hero health: ${здор}/100 (${оценить(здор, 25, 40)})
🧠 Sanity: ${расс}/100 (${оценить(расс, 20, 35)})
🍖 Food: ${еда}/100 (${оценить(еда, 15, 30)})
💧 Water: ${вода}/100 (${оценить(вода, 15, 30)})
⚡ Energy: ${энерг}/100 (${оценить(энерг, 10, 25)})
🤝 Trust in you: ${дов}
🎒 Hero inventory: ${инв}
👥 Who's in the bunker: ${нпсСписок}
📖 Story flags: ${флагиСтр}
${тревоги.length > 0 ? '\n🚨 IMPORTANT FOR YOUR RESPONSE:\n' + тревоги.join('\n') : ''}
${доверТекст ? '\n💬 CANDOR LEVEL: ' + доверТекст : ''}
--- END STATE ---`;
    }
}

// ── ФОРМИРУЕМ ПРОМПТ ─────────────────────────────────────────
function сформироватьПромпт(нпс, сообщение, контекст) {
    var личность = личностиНПС[нпс];
    if (!личность) return сообщение;
    var сист = личность[язык] || личность['ru'];
    var контТекст = сформироватьКонтекст(контекст);

    var история = (историяДиалогов[нпс] || []).slice(-4);
    var историяТекст = история.map(function(м) {
        return (м.role === 'user' ? 'Герой: ' : нпс + ': ') + м.content;
    }).join('\n');

    return '<s>[INST] ' + сист + контТекст +
        (историяТекст ? '\n\nПредыдущий разговор:\n' + историяТекст : '') +
        '\n\nГерой: ' + сообщение + ' [/INST]';
}

// ── ОСНОВНОЙ ЗАПРОС ──────────────────────────────────────────
function спросить(нпс, сообщение, контекст, колбэк) {
    if (!активен) {
        колбэк(фоллбэк(нпс));
        return;
    }

    var промпт = сформироватьПромпт(нпс, сообщение, контекст);

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + HF_KEY
        },
        body: JSON.stringify({
            model: МОДЕЛЬ,
            messages: [{ role: "user", content: промпт }],
            max_tokens: МАКС_ТОКЕНОВ,
            temperature: 0.85
        })
    })
    .then(function(r) {
        if (r.status === 503) {
            console.warn('⏳ Модель загружается, повтор через 10 сек...');
            setTimeout(function() { спросить(нпс, сообщение, контекст, колбэк); }, 10000);
            return null;
        }
        return r.json();
    })
    .then(function(д) {
        if (!д) return;
        if (д.choices && д.choices[0] && д.choices[0].message) {
            var ответ = д.choices[0].message.content.trim();
            ответ = ответ.replace(/^.*\[\/INST\]/s, '').trim();
            if (!ответ) { колбэк(фоллбэк(нпс)); return; }
            if (!историяДиалогов[нпс]) историяДиалогов[нпс] = [];
            историяДиалогов[нпс].push({ role: 'user', content: сообщение });
            историяДиалогов[нпс].push({ role: 'assistant', content: ответ });
            колбэк(ответ);
        } else if (д.error) {
            console.warn('HF ошибка:', д.error);
            колбэк(фоллбэк(нпс));
        } else {
            колбэк(фоллбэк(нпс));
        }
    })
    .catch(function(е) {
        console.warn('HF fetch ошибка:', е);
        колбэк(фоллбэк(нпс));
    });
}

// ── ГЕНЕРАЦИЯ ЗАПИСИ ДНЕВНИКА ────────────────────────────────
function написатьДневник(день, событие, контекст, колбэк) {
    if (!активен) { колбэк(фоллбэкДневник(день, событие)); return; }
    var л = язык === 'ru';
    var контСтр = контекст ? сформироватьКонтекст(контекст) : '';
    var промпт = '<s>[INST] ' + (л
        ? 'Напиши дневниковую запись от первого лица. Ты — Алексей, выживший в постапокалиптическом бункере №17. Пишешь кратко, эмоционально, надрывно — отражая реальное состояние персонажа. 2-3 предложения. День ' + день + '. Событие: ' + событие + контСтр
        : 'Write a first-person diary entry. You are Alexei, surviving in post-apocalyptic Bunker #17. Write briefly, emotionally, reflecting the hero actual state. 2-3 sentences. Day ' + день + '. Event: ' + событие + контСтр
    ) + ' [/INST]';

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + HF_KEY },
        body: JSON.stringify({ 
            model: МОДЕЛЬ, 
            messages: [{ role: "user", content: промпт }],
            max_tokens: 150, 
            temperature: 0.9 
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(д) {
        if (д.choices && д.choices[0] && д.choices[0].message) {
            колбэк(д.choices[0].message.content.trim());
        } else {
            колбэк(фоллбэкДневник(день, событие));
        }
    })
    .catch(function() { колбэк(фоллбэкДневник(день, событие)); });
}

// ── ГЕНЕРАЦИЯ СЛУЧАЙНОГО СОБЫТИЯ ─────────────────────────────
function сгенерироватьСобытие(контекст, колбэк) {
    if (!активен) { колбэк(null); return; }
    var л = язык === 'ru';
    var расс = контекст ? (контекст.рассудок || 100) : 100;
    var здор = контекст ? (контекст.здоровье || 100) : 100;
    var тональность = расс <= 25
        ? (л ? 'параноидальное, галлюцинаторное' : 'paranoid, hallucinatory')
        : здор <= 25
            ? (л ? 'угрожающее, смертельно опасное' : 'threatening, life-threatening')
            : (л ? 'жуткое, атмосферное' : 'creepy, atmospheric');
    var промпт = '<s>[INST] ' + (л
        ? 'Придумай одно случайное событие для постапокалиптического бункера. Тональность: ' + тональность + '. День ' + (контекст ? контекст.день : 1) + '. Одно предложение начиная с эмодзи и "ВНЕЗАПНО: ". Максимум 15 слов.'
        : 'Create one random event for a post-apocalyptic bunker. Tone: ' + тональность + '. Day ' + (контекст ? контекст.день : 1) + '. One sentence starting with emoji and "SUDDENLY: ". Max 15 words.'
    ) + ' [/INST]';

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + HF_KEY },
        body: JSON.stringify({ 
            model: МОДЕЛЬ, 
            messages: [{ role: "user", content: промпт }],
            max_tokens: 60, 
            temperature: 1.0 
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(д) {
        if (д.choices && д.choices[0] && д.choices[0].message) {
            колбэк(д.choices[0].message.content.trim());
        } else { колбэк(null); }
    })
    .catch(function() { колбэк(null); });
}

// ── FALLBACK ОТВЕТЫ ──────────────────────────────────────────
var фоллбэкиНПС = {
    'Аня': { ru: ['Я не знаю можно ли тебе доверять. Но у меня нет выбора.', 'Маша спрашивает про тебя. Я не знаю что ответить.', 'Иногда мне кажется что ты знаешь больше чем говоришь.', 'Держись. Нам нужно держаться вместе.'], en: ["I don't know if I can trust you. But I have no choice.", "Masha asks about you. I don't know what to tell her.", 'Sometimes I think you know more than you let on.', 'Hold on. We need to stay together.'] },
    'Игорь': { ru: ['Хватит думать. Действуй.', 'Снаружи хуже. Намного хуже.', 'Доверяй никому. Даже мне.', 'Ресурсы кончаются. Нужен план.'], en: ['Stop thinking. Act.', "It's worse outside. Much worse.", 'Trust no one. Not even me.', 'Resources are running out. Need a plan.'] },
    'Нева': { ru: ['Ты начинаешь вспоминать. Это опасно.', 'Протокол продолжается. Даже здесь.', 'Испытуемый семнадцать. Всё идёт по плану.'], en: ["You're starting to remember. That's dangerous.", 'The protocol continues. Even here.', 'Subject seventeen. Everything goes as planned.'] },
    'Генерал': { ru: ['Рота, к бою! ...Рота? Где рота...', 'Мы удержим позиции. Мы всегда удерживали.', 'Потерь нет. Потерь... не считаем больше.'], en: ['Company, battle stations! ...Company? Where...', "We'll hold the line. We always held.", "No casualties. We don't count anymore."] },
    'Голос': { ru: ['Ты знал это.', 'Семнадцатый.', 'Помни.', 'Не открывай.'], en: ['You knew this.', 'Seventeen.', 'Remember.', "Don't open it."] }
};

function фоллбэк(нпс) {
    var список = фоллбэкиНПС[нпс];
    if (!список) return '...';
    var массив = список[язык] || список['ru'];
    return массив[Math.floor(Math.random() * массив.length)];
}

function фоллбэкДневник(день, событие) {
    var л = язык === 'ru';
    var записи = л
        ? ['День ' + день + '. ' + событие + ' Не знаю сколько ещё продержусь.', 'День ' + день + '. ' + событие + ' Я начинаю забывать кто я.']
        : ['Day ' + день + '. ' + событие + " I don't know how much longer.", 'Day ' + день + '. ' + событие + " I'm starting to forget who I am."];
    return записи[Math.floor(Math.random() * записи.length)];
}

function сброситьИсторию(нпс) {
    if (нпс) { историяДиалогов[нпс] = []; }
    else { Object.keys(историяДиалогов).forEach(function(к) { историяДиалогов[к] = []; }); }
}

function естьКлюч() { return активен; }

return { 
    инит: инит, 
    спросить: спросить, 
    написатьДневник: написатьДневник, 
    сгенерироватьСобытие: сгенерироватьСобытие, 
    сброситьИсторию: сброситьИсторию, 
    установитьЯзык: установитьЯзык, 
    естьКлюч: естьКлюч 
};
})();