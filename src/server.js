const http = require('http');
const url = require('url');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key value object to look up URL routes to specific functions and their codes
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/badRequest?valid=true': responseHandler.getSuccess,
  '/unauthorized': responseHandler.getUnauthorized,
  '/unauthorized?loggedIn=yes': responseHandler.getSuccess,
  '/forbidden': responseHandler.getForbidden,
  '/internal': responseHandler.getInternal,
  '/notImplemented': responseHandler.getNotImplemented,
  '/notFound': responseHandler.getNotFound,
  index: responseHandler.getIndex,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  const acceptedTypes = request.headers.accept.split(',');

  if (urlStruct[parsedUrl.pathname]) {
    if (parsedUrl.pathname === '/badRequest' && parsedUrl.query === 'valid=true') {
      responseHandler.getSuccess(request, response, acceptedTypes);
    } else if (parsedUrl.pathname === '/unauthorized' && parsedUrl.query === 'loggedIn=yes') {
      responseHandler.getSuccess(request, response, acceptedTypes);
    } else {
      urlStruct[parsedUrl.pathname](request, response, acceptedTypes);
    }
  } else {
    // sends the not found page for any other pathname
    responseHandler.getNotFound(request, response, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}`);
