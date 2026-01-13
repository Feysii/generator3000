const typeNames = {
	'password': 'Пароль',
	'nickname': 'Никнейм',
	'number': 'Число',
	'coordinate': 'Координаты',
	'date': 'Идея для свидания'
};

let allHistory = [];

function loadHistory() {
	try {
		const stored = localStorage.getItem('generatorHistory');

		if (!stored) {
			showEmpty();
			return;
		}

		allHistory = JSON.parse(stored);

		if (allHistory.length === 0) {
			showEmpty();
			return;
		}

		// Показать статистику
		showStats(allHistory);

		// Применить фильтры
		applyFilters();

	} catch (e) {
		console.error('Error loading history:', e);
		showEmpty();
	}
}

function showEmpty() {
	document.getElementById('history-list').innerHTML = '<div class="empty-message">История пуста. Начните генерировать!</div>';
	document.getElementById('stats').style.display = 'none';
	document.getElementById('filters-bar').style.display = 'none';
}

function applyFilters() {
	const typeFilter = document.getElementById('filter-type').value;
	const dateSort = document.getElementById('filter-date').value;

	let filtered = [...allHistory];

	// Фильтр по типу
	if (typeFilter !== 'all') {
		filtered = filtered.filter(item => item.type === typeFilter);
	}

	// Сортировка по дате
	if (dateSort === 'old') {
		// Старые первые - оставляем как есть
		displayHistory(filtered, false);
	} else {
		// Новые первые - реверсим
		displayHistory(filtered, true);
	}
}

function parseDate(dateString) {
	try {
		// Парсим дату формата "12.01.2026, 14:30:45"
		const parts = dateString.split(', ');
		const dateParts = parts[0].split('.');
		const timeParts = parts[1].split(':');

		return new Date(
			parseInt(dateParts[2]), // год
			parseInt(dateParts[1]) - 1, // месяц (0-11)
			parseInt(dateParts[0]), // день
			parseInt(timeParts[0]), // часы
			parseInt(timeParts[1]), // минуты
			parseInt(timeParts[2]) // секунды
		);
	} catch (e) {
		console.error('Error parsing date:', dateString, e);
		return new Date();
	}
}

function displayHistory(history, reverseOrder = true) {
	const historyList = document.getElementById('history-list');

	if (history.length === 0) {
		historyList.innerHTML = '<div class="empty-message">Нет результатов по выбранным фильтрам</div>';
		return;
	}

	historyList.innerHTML = '';

	// Показать количество результатов
	const resultsCount = document.createElement('div');
	resultsCount.className = 'results-count';
	resultsCount.textContent = `Найдено: ${history.length} генераций`;
	historyList.appendChild(resultsCount);

	// Показать историю
	const displayArray = reverseOrder ? [...history].reverse() : [...history];

	displayArray.forEach((item, displayIndex) => {
		// Найти реальный индекс в allHistory
		const actualIndex = allHistory.findIndex(h =>
			h.value === item.value &&
			h.date === item.date &&
			h.type === item.type
		);

		const itemDiv = document.createElement('div');
		itemDiv.className = 'history-item';

		const escapedValue = String(item.value).replace(/'/g, "\\'").replace(/"/g, '&quot;');

		itemDiv.innerHTML = `
                <div class="history-info">
                    <span class="history-type type-${item.type}">${typeNames[item.type] || item.type}</span>
                    <div class="history-value">${item.value}</div>
                    <div class="history-date">📅 ${item.date}</div>
                </div>
                <div class="history-actions">
                    <button class="copy-btn" onclick="copyItem('${escapedValue}')">📋</button>
                    <button class="delete-btn" onclick="deleteItem(${actualIndex})">❌</button>
                </div>
            `;
		historyList.appendChild(itemDiv);
	});
}

function resetFilters() {
	document.getElementById('filter-type').value = 'all';
	document.getElementById('filter-date').value = 'new';
	applyFilters();
}

function showStats(history) {
	const stats = {
		total: history.length,
		password: history.filter(i => i.type === 'password').length,
		nickname: history.filter(i => i.type === 'nickname').length,
		number: history.filter(i => i.type === 'number').length,
		coordinate: history.filter(i => i.type === 'coordinate').length,
		date: history.filter(i => i.type === 'date').length
	};

	document.getElementById('stats').style.display = 'flex';
	document.getElementById('stats').innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Всего генераций</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.password}</div>
                <div class="stat-label">Паролей</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.nickname}</div>
                <div class="stat-label">Никнеймов</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.number}</div>
                <div class="stat-label">Чисел</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.coordinate}</div>
                <div class="stat-label">Координат</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.date}</div>
                <div class="stat-label">Идей</div>
            </div>
        `;
}

function copyItem(value) {
	navigator.clipboard.writeText(value).then(() => {
		alert('Скопировано в буфер обмена!');
	}).catch(err => {
		console.error('Error copying:', err);
		alert('Ошибка копирования');
	});
}

function deleteItem(index) {
	if (confirm('Удалить эту генерацию?')) {
		allHistory.splice(index, 1);
		localStorage.setItem('generatorHistory', JSON.stringify(allHistory));
		loadHistory();
	}
}

function clearHistory() {
	if (confirm('Вы уверены, что хотите удалить ВСЮ историю генераций?')) {
		localStorage.removeItem('generatorHistory');
		allHistory = [];
		loadHistory();
	}
}

// Загрузить историю при загрузке страницы
window.addEventListener('DOMContentLoaded', loadHistory);