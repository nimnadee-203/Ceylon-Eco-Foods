const Route = require("../Model/RoutesModel");

// Get all routes
const getAllRoutes = async (req, res, next) => {
  let routes;
  try {
    routes = await Route.find();
  } catch (err) {
    console.log(err);
  }

  if (!routes) {
    return res.status(404).json({ message: "Routes not found" });
  }

  return res.status(200).json({ routes });
};

// Add route
const addRoute = async (req, res, next) => {
  const { routeName, startLocation, endLocation, totalDistance, estimatedTime, status } = req.body;

  let route;
  try {
    route = new Route({ routeName, startLocation, endLocation, totalDistance, estimatedTime, status });
    await route.save();
  } catch (err) {
    console.log(err);
  }

  if (!route) {
    return res.status(404).json({ message: "Unable To Add Route" });
  }

  return res.status(200).json({ route });
};

// Get route by ID
const getRouteById = async (req, res, next) => {
  const id = req.params.id;
  let route;
  try {
    route = await Route.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!route) {
    return res.status(404).json({ message: "Route not found" });
  }

  return res.status(200).json({ route });
};

// Update route
const updateRoute = async (req, res, next) => {
  const id = req.params.id;
  const { routeName, startLocation, endLocation, totalDistance, estimatedTime, status } = req.body;

  let route;
  try {
    route = await Route.findByIdAndUpdate(
      id,
      { routeName, startLocation, endLocation, totalDistance, estimatedTime, status },
      { new: true, runValidators: true }
    );
  } catch (err) {
    console.log(err);
  }

  if (!route) {
    return res.status(404).json({ message: "Unable To Update Route" });
  }

  return res.status(200).json({ route });
};

// Delete route
const deleteRoute = async (req, res, next) => {
  const id = req.params.id;
  let route;
  try {
    route = await Route.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!route) {
    return res.status(404).json({ message: "Unable To Delete Route" });
  }

  return res.status(200).json({ message: "Route Successfully Deleted" });
};

exports.getAllRoutes = getAllRoutes;
exports.addRoute = addRoute;
exports.getRouteById = getRouteById;
exports.updateRoute = updateRoute;
exports.deleteRoute = deleteRoute;
 
