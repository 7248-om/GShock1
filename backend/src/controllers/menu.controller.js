const Menu = require('../models/menu.model');

exports.getMenu = async (req, res, next) => {
  try {
    const { category, tag } = req.query;

    const query = { isAvailable: true };

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag.toLowerCase()] };

    const items = await Menu.find(query);
    res.json(items);
  } catch (error) {
    next(error);
  }
};
