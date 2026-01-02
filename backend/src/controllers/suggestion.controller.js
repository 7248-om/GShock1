const Suggestion = require('../models/suggestion.model');
const SearchHistory = require('../models/searchHistory.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

// Get or create default suggestions record
async function ensureSuggestionsExist() {
  let suggestions = await Suggestion.findOne({});
  if (!suggestions) {
    suggestions = await Suggestion.create({
      defaultSuggestions: [],
      userSuggestions: [],
      enableAutoSuggestions: true,
      autoSuggestionType: 'hybrid',
    });
  }
  return suggestions;
}

// Get personalized suggestions for a user (or defaults for guests)
async function getSuggestions(req, res) {
  try {
    const userId = req.user?._id; // Optional for guests
    const suggestions = await ensureSuggestionsExist();

    let suggestedProducts = [];

    // If user is authenticated
    if (userId) {
      // Check if user has manual suggestions
      const userSuggestionsEntry = suggestions.userSuggestions.find(
        (us) => us.userId.toString() === userId.toString()
      );

      // If user has manual suggestions or auto is disabled
      if (userSuggestionsEntry || !suggestions.enableAutoSuggestions) {
        if (userSuggestionsEntry && userSuggestionsEntry.productIds.length > 0) {
          suggestedProducts = await Product.find({
            _id: { $in: userSuggestionsEntry.productIds },
          });
        } else {
          // Fall back to default
          const defaultIds = suggestions.defaultSuggestions
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((s) => s.productId);
          suggestedProducts = await Product.find({ _id: { $in: defaultIds } });
        }
      } else {
        // Auto suggestions enabled
        if (suggestions.autoSuggestionType === 'orderHistory') {
          suggestedProducts = await getOrderBasedSuggestions(userId);
        } else if (suggestions.autoSuggestionType === 'searchHistory') {
          suggestedProducts = await getSearchBasedSuggestions(userId);
        } else if (suggestions.autoSuggestionType === 'related') {
          suggestedProducts = await getRelatedProductSuggestions(userId);
        } else if (suggestions.autoSuggestionType === 'hybrid') {
          // Hybrid: combine multiple approaches
          suggestedProducts = await getHybridSuggestions(userId);
        }

        // If auto suggestions didn't produce enough, fill with defaults
        if (suggestedProducts.length < 3) {
          const defaultIds = suggestions.defaultSuggestions
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((s) => s.productId);
          const defaultProducts = await Product.find({ _id: { $in: defaultIds } });
          suggestedProducts = [...suggestedProducts];

          for (const product of defaultProducts) {
            if (
              !suggestedProducts.find((p) => p._id.toString() === product._id.toString())
            ) {
              suggestedProducts.push(product);
              if (suggestedProducts.length >= 3) break;
            }
          }
        }
      }
    } else {
      // Guest user - show default suggestions
      const defaultIds = suggestions.defaultSuggestions
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((s) => s.productId);
      suggestedProducts = await Product.find({ _id: { $in: defaultIds } });
    }

    // Return only first 3
    res.status(200).json({ 
      suggestions: suggestedProducts.slice(0, 3),
      isPersonalized: !!userId 
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Get suggestions based on order history
async function getOrderBasedSuggestions(userId) {
  try {
    const orders = await Order.find({ user: userId })
      .populate('items.itemId')
      .sort({ createdAt: -1 })
      .limit(5);

    const orderedProductIds = new Set();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.itemType === 'menu' && item.itemId) {
          orderedProductIds.add(item.itemId._id.toString());
        }
      });
    });

    if (orderedProductIds.size === 0) return [];

    // Find products with similar categories/tags
    const orderedProducts = await Product.find({ _id: { $in: Array.from(orderedProductIds) } });
    const categories = [...new Set(orderedProducts.map((p) => p.category))];
    const tags = [...new Set(orderedProducts.flatMap((p) => p.tags || []))];

    const suggestions = await Product.find({
      $and: [
        { _id: { $nin: Array.from(orderedProductIds) } },
        {
          $or: [{ category: { $in: categories } }, { tags: { $in: tags } }],
        },
      ],
    })
      .limit(3);

    return suggestions;
  } catch (error) {
    console.error('Error in getOrderBasedSuggestions:', error);
    return [];
  }
}

// Get suggestions based on search history
async function getSearchBasedSuggestions(userId) {
  try {
    const searchHistory = await SearchHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const searchedTags = [...new Set(searchHistory.flatMap((sh) => sh.tags || []))];
    const searchQueries = [...new Set(searchHistory.map((sh) => sh.searchQuery))];

    if (searchedTags.length === 0 && searchQueries.length === 0) return [];

    const suggestions = await Product.find({
      $or: [
        { tags: { $in: searchedTags } },
        { name: { $regex: searchQueries.join('|'), $options: 'i' } },
        { description: { $regex: searchQueries.join('|'), $options: 'i' } },
      ],
    })
      .limit(3);

    return suggestions;
  } catch (error) {
    console.error('Error in getSearchBasedSuggestions:', error);
    return [];
  }
}

// Get related product suggestions (complementary items)
async function getRelatedProductSuggestions(userId) {
  try {
    const orders = await Order.find({ user: userId })
      .populate('items.itemId')
      .sort({ createdAt: -1 })
      .limit(3);

    const lastOrderedProductIds = new Set();
    if (orders.length > 0) {
      orders[0].items.forEach((item) => {
        if (item.itemType === 'menu' && item.itemId) {
          lastOrderedProductIds.add(item.itemId._id.toString());
        }
      });
    }

    if (lastOrderedProductIds.size === 0) return [];

    // Find products in same category or with complementary tags
    const lastProducts = await Product.find({ _id: { $in: Array.from(lastOrderedProductIds) } });
    const categories = lastProducts.map((p) => p.category);

    const suggestions = await Product.find({
      $and: [
        { _id: { $nin: Array.from(lastOrderedProductIds) } },
        { category: { $in: categories } },
      ],
    })
      .limit(3);

    return suggestions;
  } catch (error) {
    console.error('Error in getRelatedProductSuggestions:', error);
    return [];
  }
}

// Hybrid: combine multiple approaches
async function getHybridSuggestions(userId) {
  try {
    const orderBased = await getOrderBasedSuggestions(userId);
    const searchBased = await getSearchBasedSuggestions(userId);
    const related = await getRelatedProductSuggestions(userId);

    // Combine and deduplicate
    const allSuggestions = [...orderBased, ...searchBased, ...related];
    const uniqueMap = new Map();

    allSuggestions.forEach((product) => {
      if (!uniqueMap.has(product._id.toString())) {
        uniqueMap.set(product._id.toString(), product);
      }
    });

    return Array.from(uniqueMap.values()).slice(0, 3);
  } catch (error) {
    console.error('Error in getHybridSuggestions:', error);
    return [];
  }
}

// Admin: Get default suggestions
async function getDefaultSuggestions(req, res) {
  try {
    const suggestions = await ensureSuggestionsExist();
    const products = await Product.find({
      _id: { $in: suggestions.defaultSuggestions.map((s) => s.productId) },
    });

    const sorted = suggestions.defaultSuggestions
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((s) => products.find((p) => p._id.toString() === s.productId.toString()));

    res.status(200).json({
      suggestions: sorted,
      settings: {
        enableAutoSuggestions: suggestions.enableAutoSuggestions,
        autoSuggestionType: suggestions.autoSuggestionType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Admin: Update default suggestions
async function updateDefaultSuggestions(req, res) {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length < 3) {
      return res.status(400).json({ message: 'Exactly 3 products must be selected' });
    }

    const suggestions = await ensureSuggestionsExist();

    suggestions.defaultSuggestions = productIds.map((id, index) => ({
      productId: id,
      displayOrder: index,
    }));

    await suggestions.save();

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Admin: Get all user suggestions
async function getAllUserSuggestions(req, res) {
  try {
    const suggestions = await ensureSuggestionsExist();
    const userSuggestions = await Promise.all(
      suggestions.userSuggestions.map(async (us) => {
        const products = await Product.find({ _id: { $in: us.productIds } });
        return {
          userId: us.userId,
          products,
          type: us.type,
          createdAt: us.createdAt,
        };
      })
    );

    res.status(200).json(userSuggestions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Admin: Set suggestions for a specific user
async function setUserSuggestions(req, res) {
  try {
    const { userId, productIds, type = 'manual' } = req.body;

    if (!Array.isArray(productIds) || productIds.length < 3) {
      return res.status(400).json({ message: 'Exactly 3 products must be selected' });
    }

    const suggestions = await ensureSuggestionsExist();

    // Remove existing suggestions for this user
    suggestions.userSuggestions = suggestions.userSuggestions.filter(
      (us) => us.userId.toString() !== userId
    );

    // Add new suggestions
    suggestions.userSuggestions.push({
      userId,
      productIds,
      type,
      createdAt: new Date(),
    });

    await suggestions.save();

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Admin: Remove user suggestions (revert to auto)
async function removeUserSuggestions(req, res) {
  try {
    const { userId } = req.params;

    const suggestions = await ensureSuggestionsExist();
    suggestions.userSuggestions = suggestions.userSuggestions.filter(
      (us) => us.userId.toString() !== userId
    );

    await suggestions.save();

    res.status(200).json({ message: 'User suggestions removed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Admin: Update suggestion settings
async function updateSuggestionSettings(req, res) {
  try {
    const { enableAutoSuggestions, autoSuggestionType } = req.body;

    const suggestions = await ensureSuggestionsExist();

    if (enableAutoSuggestions !== undefined) {
      suggestions.enableAutoSuggestions = enableAutoSuggestions;
    }

    if (autoSuggestionType !== undefined) {
      suggestions.autoSuggestionType = autoSuggestionType;
    }

    await suggestions.save();

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Track search
async function trackSearch(req, res) {
  try {
    const { searchQuery, productId, tags } = req.body;
    const userId = req.user._id;

    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    await SearchHistory.create({
      user: userId,
      searchQuery,
      productId: productId || undefined,
      tags: tags || [],
    });

    res.status(201).json({ message: 'Search tracked' });
  } catch (error) {
    console.error('Error tracking search:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = {
  getSuggestions,
  getDefaultSuggestions,
  updateDefaultSuggestions,
  getAllUserSuggestions,
  setUserSuggestions,
  removeUserSuggestions,
  updateSuggestionSettings,
  trackSearch,
  getOrderBasedSuggestions,
  getSearchBasedSuggestions,
  getRelatedProductSuggestions,
  getHybridSuggestions,
};
