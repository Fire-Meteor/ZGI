/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');

/**
 Initialises the standard view locals

 The included layout depends on the navLinks array to generate
 the navigation in the header, you may wish to change this array
 or replace it with your own templates / logic.
 */
exports.initLocals = function (req, res, next) {

	res.locals.user = req.user;

	res.locals.navLinks = [
		 // {label: '首页', key: 'home', href: '/',children: []},
		// {label: '产品应用', key: 'blog', href: '/product',children: []},
		// {label: '科普文档', key: 'document', href: '/document',children: []},
		// { label: '关于我们', key: 'contact', href: '/contact' },
		// { label: '在线购买', key: 'buy', href: '/' },
	];


	var q = keystone.list('Navigation').model.find().populate('parent').sort([['sortBy', 'ascending']]);
	q.exec(function (err, result) {
		var tmpNav = result;

		for (var n in tmpNav) {
			
			thisNav=tmpNav[n];
			if (thisNav.parent == '' ||  thisNav.parent == null) {
				res.locals.navLinks.push({
					label: thisNav.name,
					key: thisNav.keywords,
					href: thisNav.url,
					children: []
				});
			}
			else {
				var tt=res.locals.navLinks;
				
				for (var i in tt) {
					if (tt[i].label == thisNav.parent.name) {
						res.locals.navLinks[i].children.push({
							label: tmpNav[n].name,
							key: tmpNav[n].keywords,
							href: tmpNav[n].url
						});
					}
				}
			}
		}


		res.locals.navLinks.push(
			{label: '关于我们', key: 'contact', href: '/contact',children: []},
			{label: '在线购买', key: 'buy', href: '/',children: []}
		);


		next(err);
	});


	// { label: '产品应用', key: 'blog', href: '/blog' },
	// { label: '科普文档', key: 'gallery', href: '/gallery' },
	// { label: '关于我们', key: 'contact', href: '/contact' },
	// { label: '在线购买', key: 'gallery', href: '/gallery' },


};


/**
 Fetches and clears the flashMessages before a view is rendered
 */
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) {
		return msgs.length;
	}) ? flashMessages : false;
	next();
};


/**
 Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


/**
 Inits the error handler functions into `req`
 */

exports.initErrorHandlers = function (req, res, next) {
	res.err = function (err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	}
	res.notfound = function (title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	}
	next();
};


/**
 Returns a closure that can be used within views to change a parameter in the query string
 while preserving the rest.
 */

var qs_set = exports.qs_set = function (req, res) {
	return function qs_set(obj) {
		var params = _.clone(req.query);
		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}
		var qs = querystring.stringify(params);
		return req.path + (qs ? '?' + qs : '');
	}
}
