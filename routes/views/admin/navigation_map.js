var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var tmpNav = [];

	view.on('init', function (next) {
		var q = keystone.list('Navigation').model.find().populate('parent');

		q.exec(function (err, result) {
			tmpNav = result;
					

			for (var n in tmpNav) {
						
				locals.navLinks.push({
					label: tmpNav[n].name,
					key: tmpNav[n].keywords,
					href: tmpNav[n].fullPath,
				});

				if(tmpNav[n].parent!=''){
					
				}
			}

			locals.navLinks.push(
				{label: '关于我们', key: 'contact', href: '/contact'},
				{label: '在线购买', key: 'buy', href: '/'}
			);

			next(err);
		});
	});

	// Render the view
	view.render('admin/navigation_map');
};
