const axios = require('axios');
const Item = require('../models/item.model');
const { API_MONDAY_URL, API_MONDAY_KEY } = require('../config/constants');
const findDuplicates = async (boardId, columnId, value, itemId) => {
  return await Item.find({ boardId, [`columnValues.${columnId}`]: value, itemId: { $ne: itemId } });
};

const performActionOnDuplicates = async (boardId, itemId, action) => {
  if (action === 'move_to_group') {
    // Move item to 'Duplicates' group
    await axios.post(API_MONDAY_URL, {
      query: `mutation { change_column_value (board_id: ${boardId}, item_id: ${itemId}, column_id: "group", value: "Duplicates") { id } }`
    }, {
      headers: { Authorization: API_MONDAY_KEY }
    });
  } else if (action === 'change_status') {
    // Change item status to 'Duplicate'
    await axios.post(API_MONDAY_URL, {
      query: `mutation { change_column_value (board_id: ${boardId}, item_id: ${itemId}, column_id: "status", value: "Duplicate") { id } }`
    }, {
      headers: { Authorization: API_MONDAY_KEY }
    });
  }
};

const getConfig = async () => {
  const response = await axios.post(API_MONDAY_URL, {
    query: `query { storage(instance_id: "duplicateFinderConfig") { value } }`
  }, {
    headers: { Authorization: API_MONDAY_KEY }
  });

  return JSON.parse(response.data.data.storage.value);
};

const handleColumnValueChange = async (event) => {
  const { itemId, boardId, columnId, value } = event;

  // Update or insert item in the database
  await Item.findOneAndUpdate(
    { itemId, boardId },
    { $set: { [`columnValues.${columnId}`]: value } },
    { new: true, upsert: true }
  );

  // Retrieve configuration
  const { selectedColumn, action } = await getConfig();

  // Find duplicates
  const duplicates = await findDuplicates(boardId, selectedColumn, value, itemId);

  if (duplicates.length > 0) {
    await performActionOnDuplicates(boardId, itemId, action);
  }
};


module.exports = {
  findDuplicates,
  performActionOnDuplicates,
  getConfig,
  handleColumnValueChange
};