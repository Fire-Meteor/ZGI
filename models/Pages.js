'use strict';

var keystone = require('keystone');
var _ = require('underscore');
var Types = keystone.Field.Types;


var Page = new keystone.List('Page', {
	map: {name: 'title'},
	autokey: {path: 'slug', from: 'title', unique: true}
});

function updateNavigation() {
	Page.model.find({
		state: 'published'
	}, function (err, pages) {
		console.log(pages.length);
		pages.forEach(function (page, i) {
			var navLink = _.findWhere(keystone.get('navigation'), {
				key: page.parent
			});
			if (i === 0) navLink.children = [];
			navLink.children.push({
				label: page.title,
				key: page.slug,
				href: '/' + page.parent + '/' + page.slug
			});
		});
	});
}

//var t=keystone.get('nav');

//var tt=t;


Page.add({
	title: {type: String, required: true},
	slug: {type: String, index: true},
	state: {type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true},
	author: {type: Types.Relationship, ref: 'User', index: true},
	publishedDate: {type: Types.Date, index: true},
	parent: {
		type: Types.Select,
		options: _.pluck(keystone.get('nav'), 'key').join(','),
		required: true,
		default: ''
	},
	content: {
		html: {type: Types.Html, wysiwyg: true, height: 600}
	},
	categories: {type: Types.Relationship, ref: 'PageCategory', many: true}
});

Page.defaultColumns = 'title, parent|10%, state|10%, author|10%, publishedDate|20%';

// Update navigation on page save
Page.schema.post('save', function () {
	console.log('Save Post');
	updateNavigation();
});

Page.register();

// Init navigation
updateNavigation();
