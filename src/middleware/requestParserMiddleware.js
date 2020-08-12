const requestParserMiddleware = (request, response, next) => {
  let requestQuery = {
    ...request.query,
  };
  let fields, sortFields, pageSize, limit;
  let query = {};
  //Fields to exclude for matching
  const removeFields = ["selectFields", "sortFields", "pageSize", "limitSize"];

  //Loop over the remove fields and delete from requestQuery
  removeFields.forEach((param) => delete requestQuery[param]);
  let queryString = JSON.stringify(requestQuery);

  //Create operators if present in query string
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in|ne)\b/g,
    (match) => `$${match}`
  );

  //If query selector (columns) are present
  if (request.query.selectFields) {
    fields = request.query.selectFields.split(",").join(" ");
  }

  if (request.query.sortFields) {
    sortFields = request.query.sortFields.split(",").join(" ");
  }

  pageSize = parseInt(request.query.pageSize, 10) || 1;
  limit = parseInt(request.query.limitSize, 10) || 20;
  let startIndex = (pageSize - 1) * limit;
  let endIndex = pageSize * limit;

  if (typeof fields != "undefined") {
    query["select"] = fields;
  }
  if (typeof sortFields != "undefined") {
    query["sort"] = sortFields;
  }
  if (queryString != "") {
    query["queryString"] = queryString;
  }
  let skip = 0;
  query["skip"] = skip;
  query["limit"] = limit;

  request.modifiedQuery = {
    query,
    paginationData: { startIndex, endIndex, pageSize, limit },
  };
  next();
};

module.exports = requestParserMiddleware;
