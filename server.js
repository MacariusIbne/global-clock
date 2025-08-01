const express = require('express');
const website = express();
website.use(express.static('public'));
website.listen(3000, () => {
  console.log('Running...');
});