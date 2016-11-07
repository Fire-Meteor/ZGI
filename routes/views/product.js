var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'product';
	locals.filters = {
		product: req.params.product,
	};
	locals.data = {
		products: [],
	};

	// Load the current product
	view.on('init', function (next) {

		var q = keystone.list('Product').model.findOne({
			state: 'published',
			slug: locals.filters.product,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.product = result;
			next(err);
		});

	});
	
	
	// Load other products
	view.on('init', function (next) {

		var q = keystone.list('Product').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.products = results;
			next(err);
		});

	});

	// Render the view
	view.render('product',{
		layout:'productLayout'
	});
};
