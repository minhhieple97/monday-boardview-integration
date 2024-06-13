const {
  findDuplicates,
  performActionOnDuplicates,
  getConfig,
  handleColumnValueChange,
} = require("../services/duplicate.service");

const handleWebhook = async (req, res) => {
  // const { event } = req.body;
  // if (event && event.type === 'change_column_value') {
  //   await handleColumnValueChange(event);
  // }
  // res.sendStatus(200);
  console.log(JSON.stringify(req.body, 0, 2));
  res.status(200).send(req.body);
};

module.exports = {
  handleWebhook,
};
