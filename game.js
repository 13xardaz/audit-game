document.addEventListener('DOMContentLoaded', function () {
    // Инициализация начальных данных
    let resources = {
        T: 100,  // Время
        B: 100,  // Бюджет
        C: 100,  // Команда
        R: 100   // Риски
    };

    let mods = {
        T: 0,
        B: 0,
        C: 0,
        R: 0
    };

    let modsNext = {
        T: 0,
        B: 0,
        C: 0,
        R: 0
    };

    let stage = 1;
    let step = 1;
    let history = [];

    const API_URL = "https://script.google.com/macros/s/AKfycbyPiiNCzTsHd7gyBy7vNKBdJcMqxJ29O_6fqUuJeJAIrTpqMwkVjixAo38ksKiIyQYuYw/exec";

    // Функция отправки данных на сервер
    async function sendEvent(eventData) {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });
    }

    // Функция для выбора карточки и расчёта новых ресурсов
    function selectCard(card) {
        // Подсчитываем стоимости
        const T_cost = card.base.T + mods.T;
        const B_cost = card.base.B + mods.B;
        const C_cost = card.base.C + mods.C;
        const R_cost = card.base.R + mods.R;

        // Списываем ресурсы
        resources.T -= T_cost;
        resources.B -= B_cost;
        resources.C -= C_cost;
        resources.R -= R_cost;

        // Логируем выбор
        const event = {
            fullName: "ФИО игрока",  // Пример, ты передашь это из формы
            email: "email@example.com",  // Также передавай из формы
            sessionId: "unique_session_id",  // Здесь может быть уникальный ID сессии
            step: step,
            stage: stage,
            cardId: card.id,
            before: { T: resources.T + T_cost, B: resources.B + B_cost, C: resources.C + C_cost, R: resources.R + R_cost },
            cost: { T: T_cost, B: B_cost, C: C_cost, R: R_cost },
            after: { T: resources.T, B: resources.B, C: resources.C, R: resources.R },
            mods: { T: mods.T, B: mods.B, C: mods.C, R: mods.R },
            deferredType: card.deferredType,
            stopFlag: resources.T < 0 || resources.B < 0 || resources.C < 0 || resources.R < 0,
            stopReason: resources.T < 0 ? "T" : resources.B < 0 ? "B" : resources.C < 0 ? "C" : "R"
        };

        // Отправляем данные на сервер
        sendEvent(event);

        // Обновляем экран игры
        updateGameScreen();
    }

    // Пример карточки
    const exampleCard = {
        id: "card_1",
        base: {
            T: 10,
            B: 15,
            C: 5,
            R: 7
        },
        deferredType: "B" // Бюджетный налог
    };

    // Функция обновления экрана игры
    function updateGameScreen() {
        // Обновляем ресурсы на экране (например, через DOM)
        document.getElementById("T_resource").textContent = resources.T;
        document.getElementById("B_resource").textContent = resources.B;
        document.getElementById("C_resource").textContent = resources.C;
        document.getElementById("R_resource").textContent = resources.R;

        // Проверяем, не закончились ли ресурсы
        if (resources.T < 0 || resources.B < 0 || resources.C < 0 || resources.R < 0) {
            alert("Игра завершена. Вы исчерпали все ресурсы!");
            // Можно также остановить игру или предложить перезапуск
        }
    }

    // Пример того, как вызывается выбор карточки
    const card1Button = document.getElementById("card_1_button");
    if (card1Button) {
        card1Button.addEventListener("click", function () {
            selectCard(exampleCard);
        });
    }
});
