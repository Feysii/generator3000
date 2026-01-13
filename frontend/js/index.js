let currentMode = 'password';
let usedDateIdeas = [];

const dateIdeas = [
	'Пикник в парке', 'Кино под звездами', 'Кулинарный мастер-класс', 'Прогулка по набережной',
	'Поход в музей', 'Катание на велосипедах', 'Ужин при свечах', 'Квест-комната',
	'Концерт живой музыки', 'Фотосессия в городе', 'Прогулка на лодке', 'Боулинг',
	'Караоке-вечер', 'Посещение планетария', 'Пляжный отдых', 'Горные лыжи',
	'Спа-день', 'Винная дегустация', 'Кулинарный вечер дома', 'Настольные игры',
	'Escape room', 'Прыжки с парашютом', 'Картинг', 'Мини-гольф', 'Аквапарк',
	'Зоопарк', 'Ботанический сад', 'Фермерский рынок', 'Антикварные магазины',
	'Книжный магазин с кофейней', 'Фестиваль еды', 'Театральная постановка',
	'Балет или опера', 'Стенд-ап комедия', 'Джазовый клуб', 'Танцевальные уроки',
	'Йога вдвоем', 'Скалолазание', 'Пейнтбол', 'Лазертаг', 'Батутный центр',
	'Ледовый каток', 'Роллердром', 'Конная прогулка', 'Рыбалка', 'Кемпинг',
	'Наблюдение за звездами', 'Фотоохота на закате', 'Граффити-тур', 'Уличная еда',
	'Пикап-пикник', 'Завтрак в постель', 'Домашний кинотеатр', 'Вечер настолок',
	'Совместная готовка', 'Дегустация сыров', 'Шоколадная фабрика', 'Пивоварня',
	'Гончарная мастерская', 'Живопись и вино', 'Флористика', 'Мыловарение',
	'Свечеварение', 'Парфюмерная мастерская', 'Столярное дело', 'Кожевенная мастерская',
	'Ювелирное дело', 'Валяние из шерсти', 'Мастер-класс по фотографии',
	'Каллиграфия', 'Оригами', 'Икебана', 'Бонсай', 'Террариум своими руками',
	'Планетарий-шоу', 'Научный музей', 'Выставка современного искусства',
	'Исторический музей', 'Дом-музей писателя', 'Архитектурная экскурсия',
	'Речной круиз', 'Морская прогулка', 'Вертолетная экскурсия', 'Воздушный шар',
	'Дайвинг', 'Снорклинг', 'Сёрфинг', 'Виндсёрфинг', 'Каякинг', 'Рафтинг',
	'Зиплайн', 'Банджи-джампинг', 'Планеризм', 'Параглайдинг', 'Дельтапланеризм',
	'Картинг', 'Квадроциклы', 'Снегоходы', 'Водные лыжи', 'Вейкбординг',
	'Кайтсёрфинг', 'Пещерный туризм'
];

const continents = {
	'world': { lat: [-90, 90], lon: [-180, 180] },
	'europe': { lat: [35, 71], lon: [-10, 40] },
	'asia': { lat: [10, 80], lon: [40, 180] },
	'africa': { lat: [-35, 37], lon: [-18, 51] },
	'north-america': { lat: [15, 72], lon: [-168, -52] },
	'south-america': { lat: [-56, 12], lon: [-81, -35] },
	'australia': { lat: [-44, -10], lon: [113, 154] },
	'antarctica': { lat: [-90, -60], lon: [-180, 180] }
};

function selectMode(mode) {
	currentMode = mode;

	// Убрать класс active1 у всех кнопок
	document.querySelectorAll('.password, .nickname, .number, .coordinate, .date').forEach(btn => {
		btn.classList.remove('active1');
	});

	// Добавить класс active1 к выбранной кнопке (находим по классу mode)
	const btn = document.querySelector(`button.${mode}`);
	if (btn) btn.classList.add('active1');

	// Скрыть все фильтры
	document.querySelectorAll('.filters').forEach(f => f.classList.remove('active'));

	// Показать нужный фильтр
	const filter = document.getElementById('filter-' + mode);
	if (filter) filter.classList.add('active');
}

function generateValue() {
	const input = document.getElementById('input');
	let result = '';

	console.log('Generating with mode:', currentMode); // Для отладки

	switch (currentMode) {
		case 'password':
			result = generatePassword();
			break;
		case 'nickname':
			result = generateNickname();
			break;
		case 'number':
			result = generateNumber();
			break;
		case 'coordinate':
			result = generateCoordinate();
			break;
		case 'date':
			result = generateDateIdea();
			break;
	}

	input.value = result;

	if (result !== null && result !== undefined && result !== '') {
		const resultStr = String(result);
		// Не сохраняем HTML элементы, объекты и ошибки
		if (!resultStr.includes('[object') &&
			!resultStr.includes('Выберите') &&
			!resultStr.includes('должно') &&
			resultStr.length > 0) {
			saveToHistory(currentMode, resultStr);
			console.log('Saved to history:', currentMode, resultStr);
		} else {
			console.log('Skipped saving invalid result:', resultStr);
		}
	}
}
saveToHistory(currentMode, result);


// Сохранить в историю
if (result) {
	const resultStr = String(result);
	if (!resultStr.includes('Выберите') && !resultStr.includes('должно')) {
		saveToHistory(currentMode, resultStr);
		console.log('Saved to history:', currentMode, resultStr); // Для отладки
	}
}
// Сохранить в историю

function saveToHistory(type, value) {
	const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
	let history = [];
	try {
		const stored = localStorage.getItem('generatorHistory');
		if (stored) {
			history = JSON.parse(stored);
		}
	} catch (e) {
		console.error('Error reading history:', e);
		history = [];
	}

	const newEntry = {
		type: type,
		value: valueStr,
		date: new Date().toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})
	};
	console.log('Saving entry:', newEntry); // Для проверки
	history.push(newEntry);

	try {
		localStorage.setItem('generatorHistory', JSON.stringify(history));
		console.log('History saved successfully'); // Для отладки
	} catch (e) {
		console.error('Error saving history:', e);
	}
}


function generatePassword() {
	const length = parseInt(document.getElementById('password-length').value);
	const useUppercase = document.getElementById('use-uppercase').checked;
	const useLowercase = document.getElementById('use-lowercase').checked;
	const useNumbers = document.getElementById('use-numbers').checked;
	const useSpecial = document.getElementById('use-special').checked;

	let chars = '';
	if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
	if (useNumbers) chars += '0123456789';
	if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

	if (chars === '') return 'Выберите хотя бы один тип символов!';

	let password = '';
	for (let i = 0; i < length; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return password;
}

function generateNickname() {
	const base = document.getElementById('nickname-base').value.trim();
	const addNumbers = document.getElementById('nickname-numbers').checked;

	const prefixes = ['Dark', 'Shadow', 'Swift', 'Cyber', 'Neon', 'Ghost', 'Storm', 'Fire', 'Ice', 'Thunder'];
	const suffixes = ['Hunter', 'Warrior', 'Master', 'Knight', 'Wolf', 'Dragon', 'Phoenix', 'Blade', 'Ranger', 'Slayer'];

	let nickname = '';

	if (base) {
		nickname = base;
		if (Math.random() > 0.5) {
			nickname = prefixes[Math.floor(Math.random() * prefixes.length)] + nickname;
		} else {
			nickname = nickname + suffixes[Math.floor(Math.random() * suffixes.length)];
		}
	} else {
		nickname = prefixes[Math.floor(Math.random() * prefixes.length)] +
			suffixes[Math.floor(Math.random() * suffixes.length)];
	}

	if (addNumbers) {
		nickname += Math.floor(Math.random() * 1000);
	}

	return nickname;
}

function generateNumber() {
	const from = parseInt(document.getElementById('number-from').value);
	const to = parseInt(document.getElementById('number-to').value);

	if (from >= to) return 'Значение "От" должно быть меньше "До"';

	return Math.floor(Math.random() * (to - from + 1)) + from;
}

function generateCoordinate() {
	const continent = document.getElementById('continent').value;
	const bounds = continents[continent];

	const lat = (Math.random() * (bounds.lat[1] - bounds.lat[0]) + bounds.lat[0]).toFixed(4);
	const lon = (Math.random() * (bounds.lon[1] - bounds.lon[0]) + bounds.lon[0]).toFixed(4);

	return `${lat}, ${lon}`;
}

function generateDateIdea() {
	if (usedDateIdeas.length >= dateIdeas.length) {
		usedDateIdeas = [];
		return 'Все идеи использованы! Сброс списка...';
	}

	let availableIdeas = dateIdeas.filter(idea => !usedDateIdeas.includes(idea));
	let randomIdea = availableIdeas[Math.floor(Math.random() * availableIdeas.length)];
	usedDateIdeas.push(randomIdea);

	return randomIdea;
}

function copy() {
	const input = document.getElementById('input');
	if (input.value) {
		navigator.clipboard.writeText(input.value).then(() => {
			alert('Скопировано!');
		});
	}
}