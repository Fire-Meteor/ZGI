/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// 处理404错误
keystone.set('404', function (req, res, next) {
	res.status(404).render('errors/404');
});



// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	// app.get('/blog/:category?', routes.views.blog);
	// app.get('/blog/post/:post', routes.views.post);
	// app.get('/gallery', routes.views.gallery);
	// app.all('/contact', routes.views.contact);

	// app.get('/blog/post/:post', function (req,res) {
	// 	var url=req.url;
	// 	url=url.replace('/blog/post/','/product/item/');
	// 	res.redirect(url);
	// });
	
	
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);

	app.get('/product/:category?', routes.views.blog);
	app.get('/product/item/:post', routes.views.post);
	
	app.get('/document/:category?', routes.views.documents);
	app.get('/document/item/:post', routes.views.document);
	
	app.get('/buy', routes.views.post);

	
	app.get('/admin/navigations_map', routes.views.admin.navigation_map);
	//app.get('/:parent/:slug?', routes.views.pages);

	
	
	
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
