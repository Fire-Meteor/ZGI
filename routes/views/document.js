var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'document';
	locals.filters = {
		document: req.params.document,
	};
	locals.data = {
		documents: [],
	};

	// Load the current document
	view.on('init', function (next) {

		var q = keystone.list('Document').model.findOne({
			state: 'published',
			slug: locals.filters.document,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.document = result;
			next(err);
		});

	});
	
	
	// Load other documents
	view.on('init', function (next) {

		var q = keystone.list('Document').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.documents = results;
			next(err);
		});

	});

	// Render the view
	view.render('document');
};
