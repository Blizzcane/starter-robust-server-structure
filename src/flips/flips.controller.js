const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

function flipExists(req, res, next) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) {
    res.locals.flip = foundFlip;
    return next();
  }
  next({
    status: 404,
    message: `Flip id not found: ${flipId}`,
  });
}

function read(req, res) { 
  res.json({ data: res.locals.flip });
}

let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

function bodyHasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next();
  }
  next({
    status: 400,
    message: "A 'result' property is required",
  });
}

function resultPropertyIsValid(req, res, next) {
  const { data: { result } = {} } = req.body;
  const validResult = ["heads", "tails", "edge"];
  if (validResult.includes(result)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'result' property must be one of ${validResult}. Received: ${result}`,
  });
}

function create(req, res) {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId,
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1;
  res.status(201).json({ data: newFlip });
}

function list(req, res) {
  res.json({ data: flips });
}

function update(req, res) { 
    const flip = res.locals.flip;
    const originalResult = flip.result;
    const { data: { result } = {} } = req.body;

    if (originalResult !== result) {
      // update the flip
      flip.result = result;
      // Adjust the counts
      counts[originalResult] = counts[originalResult] - 1;
      counts[result] = counts[result] + 1;
    }

    res.json({ data: flip });
}

function destroy(req, res) {
  const { flipId } = req.params;
  const index = flips.findIndex((flip) => flip.id === Number(flipId));
  // splice returns an array of the deleted elements, even if it is one element
  const deletedFlip = flips.splice(index, 1);
  deletedFlip.forEach(
    (deletedFlip) =>
      (counts[deletedFlip.result] = counts[deletedFlip.result] - 1)
  );
  res.sendStatus(204);
}

module.exports = {
  create: [bodyHasResultProperty, resultPropertyIsValid, create],
  list,
  read: [flipExists, read],
  update: [flipExists, bodyHasResultProperty, resultPropertyIsValid, update],
  delete: [flipExists, destroy]
};
