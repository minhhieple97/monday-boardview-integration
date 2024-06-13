const { findDuplicates, performActionOnDuplicates, getConfig, handleColumnValueChange } = require('../services/duplicate.service');


const handleWebhook = async (req, res) => {
  const { event } = req.body;
  if (event && event.type === 'change_column_value') {
    await handleColumnValueChange(event);
  }
  res.sendStatus(200);
};

module.exports = {
  handleWebhook,
};