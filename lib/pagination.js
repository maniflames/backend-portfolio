//NOTE: if I ever have some time left some of these can be transformed into recursive functions
module.exports = {
        //NOTE: Ik krijg deze niet mooi omdat de logica net iets te complex is
        currentItems: (count, start, limit) => {
            const currentPage = module.exports.currentPage(start, limit);
            const lastPage = module.exports.numberOfPages(count, limit);
            if(!limit){
                return count;
            } else if (currentPage === lastPage) {
                if(count % limit == 0){
                    return limit;
                } else {
                    return count % limit;
                }
            } else {
                return limit;
            }
        },

        numberOfPages: (count, limit) => {
            return !limit ? 1 : Math.ceil(count / limit);
        },

        currentPage: (start, limit) => {
            return !start ? 1 : !limit ? 2 : Math.ceil((start + 1) / limit);
        },

        getFirstPageString: (start, limit) => {
            return !limit ? '' : '?start=1&limit=' + limit;
        },

        getLastPageString: (count, limit) => {
            return !limit ? '' : '?start=' + ((count + 1) - limit) + '&limit=' + limit;
        },

        getPreviousPage: (start, limit) => {
            const currentPage = module.exports.currentPage(start, limit);
            return currentPage == 1 ? 1 : currentPage - 1;
        },

        getPreviousPageString: (start, limit) => {
            const previousPage = module.exports.getPreviousPage(start, limit)
            return !limit ? '' : '?start=' + ((limit * previousPage) - limit + 1) + '&limit=' + limit
        },

        getNextPage: (count, start, limit) => {
            const currentPage = module.exports.currentPage(start, limit);
            const total = module.exports.numberOfPages(count, limit);
            return currentPage + 1 > total ? total : currentPage + 1;
        },

        getNextPageString: (count, start, limit) => {
            const nextPage = module.exports.getNextPage(count, start, limit);
            return !limit ? '' : '?start=' + ((limit * nextPage) - limit + 1) + '&limit=' + limit
        },

        getPagination: (count, start, limit, collectionHref) => {
            return {
                currentPage: module.exports.currentPage(start, limit), //start is corrected within pagination function by start + 1
                currentItems: module.exports.currentItems(count, start, limit),
                totalPages: module.exports.numberOfPages(count, limit),
                totalItems: count,
                _links: {
                    first: {
                        page: 1,
                        href: collectionHref + module.exports.getFirstPageString(start, limit)
                    },
                    last: {
                        page: module.exports.numberOfPages(count, limit),
                        href: collectionHref + module.exports.getLastPageString(count, limit)
                    },
                    previous: {
                        page: module.exports.getPreviousPage(start, limit),
                        href: collectionHref + module.exports.getPreviousPageString(start, limit)
                    },
                    next: {
                        page: module.exports.getNextPage(count, start, limit),
                        href: collectionHref + module.exports.getNextPageString(count, start, limit)
                    }
                }
            }

        }

}
