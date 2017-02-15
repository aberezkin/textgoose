# textgoose

This is a simple plugin to enable textsearch in your mongoose schema.

## Usage

You can use this plugin just as any other mongoose plugin. For example for a blog post schema you would do something like that.

    const mongoose = require('mongoose');
    const textgoose = require('textgoose');

    const postSchema = new mongoose.Schema({
        title: String,
        text: String,
        author: String,
        created_at: {type: Date, default: Date.now}
    });

    postSchema.index({title: 'text', text: 'text'});
    postSchema.plugin(textgoose, options);

    mongoose.model('Item', itemSchema);

**Note** that you need to mark the text fiels you want to use in search queries as indexes.

### Plugin options

Also you can provide plugin with `options` object. Here's what you can customize

**language: string** - the language of the queries. Default is `en`.

**Note** that you need to mark your index field the same `default_language` you use in plugin's options like that: 

    postSchema.index({title: 'text', text: 'text'}, {default_language: 'russian'});
    
**caseSensetive: boolean** - clarify if you want your searches to be case sesitive. Default is `false`.

**diacriticSensitive: boolean** - clarify if you want your searches to be diacritic sensitive. Default is `false`.

To use textgoose on your module write use `textSearch` method like that.

	Item.textSearch(query, queryOptions, (err, data) => {
        if (err)
            return console.log(err);

        return res.send(data);
    });

### Query options

Queries are customizable too. You can use the following options.

**filter: object** - use this as additional filter for your database documetns. For examle you can filter your posts by author using this filter `{author: "John"}`. Default is `null`.

**limit: number** - defines the maximum documents returned by your database. Default is `100`.

**scoreSort: boolean** - If you want your docs to be sorted by their search score set it to `true`. Default is `false`.
