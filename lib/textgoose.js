const defaultOptions = {
    language: 'en',
    caseSensitive: false,
    diacriticSensitive: false,
};

const defaultQueryOptions = {
    filter: null,
    limit: 100,
    scoreSort: false,
};

function squashOptions(options) {
    if (options) {
        return {
            language: options.language || defaultOptions.language,
            caseSensitive: options.caseSensitive || defaultOptions.caseSensitive,
            diacriticSensitive: options.diacriticSensitive || defaultOptions.diacriticSensitive,
        }
    } else {
        return defaultOptions;
    }
}

function squashQueryOptions(queryOptions) {
    if (queryOptions) {
        return {
            filter: queryOptions.filter || defaultQueryOptions.filter,
            limit: queryOptions.limit || defaultQueryOptions.limit,
            scoreSort: queryOptions.scoreSort || defaultQueryOptions.scoreSort,
            includeScore: queryOptions.includeScore || defaultQueryOptions.includeScore,
        }
    } else {
        return defaultQueryOptions;
    }
}

module.exports = exports = function textSearchPlugin(schema, options) {
    options = squashOptions(options);

    schema.statics.textSearch = function (text, queryOptions, callback) {
        let model = this;

        if ('function' == typeof queryOptions) {
            callback = queryOptions;
            queryOptions = null;
        }

        queryOptions = squashQueryOptions(queryOptions);

        let query = {
            $text: {
                $search: text,
                $language: options.language,
                $caseSensitive: options.caseSensitive,
                $diacriticSensitive: options.diacriticSensitive,
            },
        };

        let findArgs = [
            query,
            {score: {$meta: "textScore"}}
        ];

        let filter = queryOptions.filter;

        if (null != filter) {
            for (let field in filter) {
                query[field] = filter[field];
            }
        }

        let mongooseQuery = model.find(...findArgs);

        let limit = queryOptions.limit;

        if ('number' == typeof limit) {
            mongooseQuery.limit(limit);
        }

        let scoreSort = queryOptions.scoreSort;

        if (scoreSort) {
            mongooseQuery.sort({score: {$meta: "textScore"}})
        }

        if (callback) {
            return mongooseQuery.exec(callback);
        } else {
            return mongooseQuery;
        }
    }
};
