/**
 * Created by lianpan on 09/13/2016.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

var Navigation = new keystone.List('Navigation', {
	autokey: {from: 'name', path: 'autokey', unique: true},
	defaultSort: '-sortBy'
});


Navigation.add(
	{
		name: {type: String},
		type: {
			type: Types.Select, options: [
				{label: 'Container', value: 'container'},
				{label: 'Page', value: 'page'},
				{label: 'Link', value: 'link'},
			]
		},
		description: {type: String},
		url: {type: Types.Url},
		keywords: {type: String},
		parent: {type: String, initial: '/'},
		sortBy: {type: Types.Number, initial: 1},
		isValid: {type: Types.Boolean, initial: true},
		createBy: {type: Types.Relationship, ref: 'User', index: true},
		createDate: {type: Types.Date},
		updateBy: {type: Types.Relationship, ref: 'User', index: true},
		updateDate: {type: Types.Date},
	});


Navigation.schema.pre('save', function (next) {
	next();
});


Navigation.defaultColumns = 'name, type, parent, url, sortBy, isValid';
Navigation.register();
