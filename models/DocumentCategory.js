var keystone = require('keystone');

/**
 * PostCategory Model
 * ==================
 */

var DocumentCategory = new keystone.List('DocumentCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

DocumentCategory.add({
	name: { type: String, required: true },
});

DocumentCategory.relationship({ ref: 'Document', path: 'categories' });

DocumentCategory.register();
