import express from "express";
import Restaurant from "../models/restaurant.js"; // Update path as necessary
import { jwtDecode } from "jwt-decode";
const router = express.Router();

// Create a new restaurant
router.post("/", async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/restaurantList", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from Authorization header
    console.log("Restaurant Owner wala log :", token);
    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }

    // Decode the token to extract restaurantOwnerId
    const decodedToken = jwtDecode(token);
    const restaurantOwnerId = decodedToken.userId; // Assuming the token contains the restaurantOwnerId
    // console.log("Decoded restaurantOwnerId:", restaurantOwnerId); // Debugging log

    // Fetch all restaurants and check the owner id
    const restaurants = await Restaurant.find()
    // console.log("sara chutiyapa hai", restaurants);
    // Filter the restaurants that belong to the decoded restaurantOwnerId
    // const filteredRestaurants = restaurants.filter(
    //   (restaurant) =>
    //     restaurant.owner &&
    //     restaurant.owner._id.toString() === restaurantOwnerId
    // );
    const filteredRestaurants = restaurants.filter((restaurant) => {
      // console.log("Restaurant being checked:", restaurant.owner); // Log the restaurant name
      // console.log("Restaurant owner ID:", restaurant.owner._id); // Log the owner's ID if it exists
      // console.log("Decoded restaurantOwnerId:", restaurantOwnerId); // Log the decoded owner ID
    
      // Filter condition
      return (
        
        console.log("sara chutiyapa hai", restaurant);
        // restaurant.owner=== restaurantOwnerId
      );
    });
    
    console.log("Filtered Restaurants:", filteredRestaurants); // Log the final filtered array
    
    console.log(filteredRestaurants);
    // If no restaurants are found, return a message with a 200 status
    if (filteredRestaurants.length === 0) {
      return res.status(200).json({ message: "No restaurants in database" });
    }

    // Return the filtered restaurants
    res.status(200).json(filteredRestaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err); // Error handling log
    res.status(500).json({ error: err.message });
  }
});

// Middleware to authenticate and extract the user ID from the token
// const authenticateJWT = (req, res, next) => {
//     const token = req.cookies.jwt; // Get the JWT token from cookies
//     if (!token) {
//       return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
//       req.userId = decoded.id; // Attach the user ID to the request
//       next();
//     } catch (err) {
//       res.status(400).json({ error: 'Invalid token.' });
//     }
//   };

//   // Route to fetch restaurants for the logged-in owner
//   router.get('/', authenticateJWT, async (req, res) => {
//     try {
//       // Fetch restaurants created by the owner (user)
//       const restaurants = await Restaurant.find({ owner: req.userId })
//         .populate('owner')
//         .populate('orders');

//       res.status(200).json(restaurants);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
// Get a restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("owner")
      .populate("orders");
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a restaurant
router.put("/:id", async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("owner")
      .populate("orders");
    if (!updatedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a restaurant
router.delete("/:id", async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get menu of a specific restaurant
router.get("/:id/menu", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    // Return the menu
    res.status(200).json(restaurant.menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update menu item of a specific restaurant
router.put("/:id/menu/:itemId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    // Find the item to update in the menu
    const menuItem = restaurant.menu.id(req.params.itemId);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });

    // Update the menu item with the new data
    menuItem.set(req.body);
    await restaurant.save();

    res.status(200).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;
