const routes = require('../../routes');

module.exports = (req, res) => {
    const filteredRoutes = routes.filter((route) => {

        let testRoute = route.path;
        let queriedRoute = req.originalUrl;

        if(queriedRoute.length > 1 && queriedRoute.slice(queriedRoute.length - 1) === '/' ){
            testRoute = testRoute + '/';
        }

        if(queriedRoute.indexOf('?') > 0){
            let query = queriedRoute.slice(queriedRoute.indexOf('?'), queriedRoute.length);
            queriedRoute = queriedRoute.replace(query, '');
        }

        //NOTE: this only works for my specific case to be honest
        if(testRoute.indexOf(':id') > 0){
            testRoute = testRoute.replace(':id', '.+');
            testRoute = new RegExp(testRoute);
            return testRoute.test(queriedRoute);
        }

        return queriedRoute === testRoute ? true : false;
    });

    if(filteredRoutes.length === 0){
        res.append('Allow', 'OPTIONS,HEAD');
        res.append('Access-Control-Allow-Methods', 'OPTIONS,HEAD');
        return res.send();
    }

    const allowedMethods = filteredRoutes.map(route => route.method);

    allowedMethods.push('HEAD');
    allowedMethods.push('OPTIONS');
    res.append('Allow', allowedMethods);
    res.append('Access-Control-Allow-Methods', allowedMethods);
    return res.send();
}
