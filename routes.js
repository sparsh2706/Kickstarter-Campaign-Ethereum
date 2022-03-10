const routes = module.exports = require('next-routes')(); // The second () means that we are invoking it as a function and it gets called the moment it is imported

routes
    .add('/campaigns/new', '/campaigns/new') // This was made since 'new' was going into the 'show' route as our routes didnt know that the word 'new' is not an address, so we created a route specificaaly for new and we added it before the 'show' route
    .add('/campaigns/:address', '/campaigns/show') // To indicate a wildcard, we use colon
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;


/* We have to make this file in accordance with the module next-routes (github.com/fridays/next-routes) since next routes dont have support for Dynamic Routing (having Tokens or wildcards in a URL). */
/* So for this we would create a route.js where we would only include the URLs which have some kind of variable parameter in it, since the normal routing would be covered up by the default next.js. We also would have to make change in the server.js since we have to boot up the next server and point it towards routes.js */
