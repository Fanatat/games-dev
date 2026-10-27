// Asgard's Vanguard: Siege — связка с VK Bridge (docs/MOBILE_GDD.md §11; образец — game9/export/vk_glue.js).
// Godot ходит сюда только из scripts/platform/vk_platform_bridge.gd. Страница открыта не в ВК
// (нет vk_app_id в адресе) — window.AvVk.active = false, игра работает без площадки.
// VKWebAppInit отправляем сразу, до загрузки движка (требование ВК).
(function () {
	'use strict';
	const search = new URLSearchParams(window.location.search);
	const bridge = window.vkBridge;
	const api = {
		active: search.has('vk_app_id') && typeof bridge !== 'undefined',
		// 0 — ждём ответа на VKWebAppInit, 1 — готово, -1 — ошибка.
		initState: 0,
		_callback: null,
		_queue: [],
		// Ответ на запрос id придёт в callback строкой JSON { id, ok, data }.
		setCallback: function (callback) {
			api._callback = callback;
			const queued = api._queue;
			api._queue = [];
			queued.forEach(function (text) {
				callback(text);
			});
		},
		send: function (id, method, paramsJson) {
			let params = {};
			try {
				params = JSON.parse(paramsJson || '{}');
			} catch (err) {
				params = {};
			}
			if (!api.active) {
				api._answer(id, false, { error_type: 'client_error', error_data: { error_code: 6 } });
				return;
			}
			try {
				bridge.send(method, params).then(function (data) {
					api._answer(id, true, data);
				}, function (err) {
					api._answer(id, false, err);
				});
			} catch (err) {
				api._answer(id, false, { error_type: 'client_error', error_data: { error_reason: String(err) } });
			}
		},
		_answer: function (id, ok, data) {
			let text;
			try {
				text = JSON.stringify({ id: id, ok: ok, data: data === undefined ? null : data });
			} catch (err) {
				text = JSON.stringify({ id: id, ok: ok, data: null });
			}
			if (api._callback) {
				api._callback(text);
			} else {
				api._queue.push(text);
			}
		},
	};
	if (api.active) {
		// Свернули окно ВК или нажали «Выйти» — страница не прячется сама; сообщаем игре как «hide».
		try {
			bridge.subscribe(function (e) {
				const type = e && e.detail ? e.detail.type : '';
				if (type === 'VKWebAppViewHide' && window.AvPage) {
					window.AvPage.emit('hide');
				} else if (type === 'VKWebAppViewRestore' && window.AvPage) {
					window.AvPage.emit('show');
				}
			});
		} catch (err) {
			console.warn('vkBridge.subscribe failed', err);
		}
		bridge.send('VKWebAppInit', {}).then(function () {
			api.initState = 1;
		}, function (err) {
			api.initState = -1;
			console.warn('VKWebAppInit failed', err);
		});
	}
	window.AvVk = api;
}());
