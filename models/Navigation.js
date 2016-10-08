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
		description: {type: Types.Textarea},
		url: {type: Types.Url},
		keywords: {type: String},
		parent: {type: Types.Relationship, ref: 'Navigation'},
		sortBy: {type: Types.Number},
		isValid: {type: Types.Boolean, initial: true},
		createBy: {type: Types.Relationship, ref: 'User', index: true},
		createDate: {type: Types.Date},
		updateBy: {type: Types.Relationship, ref: 'User', index: true},
		updateDate: {type: Types.Date},
	});


Navigation.schema.pre('save', function (next) {
	next();
});


Navigation.schema.virtual('fullPath').get(function () {
	var thisName = this.name;

	if (this.parent == null || typeof (this.parent) == 'undefined' || this.parent == '') {
		return thisName;
	}
	else {
		return this.parent.name + '/' + thisName;
	}
});

Navigation.relationship({ref: 'Navigation', path: "children", refPath: "parent"});

Navigation.defaultColumns = 'name, type, parent, url, keywords, sortBy, isValid';
Navigation.register();
