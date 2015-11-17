;(function($) {

	var defaults = {
		url: false,
		type: 'icon',
		selectedClass: 'selected',
		order: 'name'
	};
	var settings;
	var data = [];
	var selected = [];
	var browser;

	var methods = {
		init: function (options) {
			settings = $.extend(true, {}, defaults, options);
			browser = $(this);
			$(settings.selector.deselect).on('mousedown', function (e) {
				if ($(e.target).closest(':data(jsbrowser-item)').length === 0) {
					var selected = browser.find('.' + settings.selectedClass);
					if (selected.length > 0) {
						selected.removeClass(settings.selectedClass);
						browser.trigger('selectionChange');
					}
				}
			});
			methods.fetch();
		},
		fetch: function () {
			$.get(settings.url, function (result) {
				data = result;
				methods.render();
			});
		},
		type: function (arg) {
			selected = methods.getSelected();
			settings.type = arg;
			methods.render();
		},
		getSelected: function () {
			var ret = [];
			browser.find('.' + settings.selectedClass).each(function () {
				ret.push($(this).index());
			});
			return ret;
		},
		addEvents: function (item) {
			item.on('mousedown', function (e) {
				e.preventDefault();

				if (e.shiftKey === true) {
					if ((browser.find(':data(jsbrowser-item).' + settings.selectedClass).length === 1) && (!browser.find(':data(jsbrowser-item).' + settings.selectedClass).is(item))) {

						var started = false;
						var finishedAfter = false;
						var finished = false;

						browser.find(':data(jsbrowser-item)').each(function () {
							if (($(this).is(item)) || ($(this).hasClass(settings.selectedClass))) {
								if (started === false) {
									started = true;
								}
								else {
									finishedAfter = true;
								}
							}
							if ((started === true) && (finished === false)) {
								$(this).addClass(settings.selectedClass);
							}
							if (finishedAfter === true) {
								finished = true;
							}
						});

						browser.trigger('selectionChange');
					}
				}
				else if (e.ctrlKey === true) {
					if (!item.hasClass(settings.selectedClass)) {
						item.addClass(settings.selectedClass);
					}
					else {
						item.removeClass(settings.selectedClass);
					}
					browser.trigger('selectionChange');
				}
				else {
					var items = browser.find(':data(jsbrowser-item).' + settings.selectedClass).not(item);
					if (items.length > 0) {
						items.removeClass(settings.selectedClass);
						browser.trigger('selectionChange');
						if (!item.hasClass(settings.selectedClass)) {
							item.addClass(settings.selectedClass);
						}
					}
					else if (!item.hasClass(settings.selectedClass)) {
						item.addClass(settings.selectedClass);
						browser.trigger('selectionChange');
					}

				}
			});
		},
		render: function () {
			browser.html('');

			browser.removeData('jsbrowser-root');

			var populate = function (item, data) {
				for (i in data) {
					item.find('[data-jsbrowser="' + i + '"]').html(data[i]);
				}
				return item;
			}

			if (settings.type === 'icon') {
				var iconTemplate = $(settings.selector.icon).html();


				browser.data('jsbrowser-root', true);

				var makeIcon = function (data, selected) {
					var item = $(iconTemplate);

					item = populate(item, data);
					item.data('jsbrowser', data);
					item.data('jsbrowser-item', true);
					methods.addEvents(item);
					if (selected === true) {
						item.addClass(settings.selectedClass);
					}

					browser.append(item);
				};

				for (var i in data) {
					if (selected.indexOf(parseInt(i)) > -1) {
						makeIcon(data[i], true);
					}
					else {
						makeIcon(data[i], false);
					}
				}
			}


			if (settings.type === 'list') {
				var browserList;
				var listTemplate = $(settings.selector.list).html();
				var listItemTemplate = $(settings.selector.listItem).html();

				var makeListIcon = function (data, selected) {
					var item = $(listItemTemplate);

					item = populate(item, data);
					item.data('jsbrowser', data);
					item.data('jsbrowser-item', true);
					methods.addEvents(item);
					if (selected === true) {
						item.addClass(settings.selectedClass);
					}

					browserList.append(item);
				}

				browser.append($(listTemplate));
				browserList = $(settings.selector.listContent);
				browserList.data('jsbrowser-root', true);
				for (var i in data) {
					if (selected.indexOf(parseInt(i)) > -1) {
						makeListIcon(data[i], true);
					}
					else {
						makeListIcon(data[i], false);
					}
				}
			}

			browser.trigger('rendered');

		}
	};

	$.fn.jsbrowser = function (methodOrOptions) {
		if (methods[methodOrOptions]) {
			return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if ((typeof methodOrOptions === 'object') || (!methodOrOptions)) {
			// Default to "init"
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  methodOrOptions + ' does not exist on jQuery.jsbrowser');
		}
	};

	$.extend($.expr[':'], {
		data: $.expr.createPseudo(function (dataName) {
			return function (elem) {
				return !!$.data( elem, dataName );
			};
		})
	});
})(jQuery);
