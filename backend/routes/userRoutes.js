const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
// signup

router.post('/signup', async(req, res)=> {
  const {name, email, password} = req.body;

  try {
    const user = await User.create({name, email, password});
    res.json(user);
  } catch (e) {
    if(e.code === 11000) return res.status(400).send('Email đã tồn tại');
    res.status(400).send(e.message)
  }
})

// login

router.post('/login', async(req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    res.json(user)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

// get users;

router.get('/', async(req, res)=> {
  try {
    const users = await User.find({ isAdmin: false }).populate('orders');
    res.json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// get user orders

router.get('/:id/orders', async (req, res)=> {
  const {id} = req.params;
  try {
    const user = await User.findById(id).populate('orders');
    res.json(user.orders);
  } catch (e) {
    res.status(400).send(e.message);
  }
})
// update user notifcations
router.post('/:id/updateNotifications', async(req, res)=> {
  const {id} = req.params;
  try {
    const user = await User.findById(id);
    user.notifications.forEach((notif) => {
      notif.status = "read"
    });
    user.markModified('notifications');
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    // Find the user by the provided user_id
    const user = await User.findById(user_id);

    // Check if the user has permission to delete
    if (!user.isAdmin) {
      return res.status(401).json("You don't have permission");
    }

    // Delete the user by the given id
    await User.findByIdAndDelete(id);

    // Fetch the updated list of users
    const users = await User.find();
    
    // Send the updated user list as a response
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
});


module.exports = router;