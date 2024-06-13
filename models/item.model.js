const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: Number,
  boardId: Number,
  columnValues: Object
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;