const express = require('express');
const concertsController = require('../controller/concertsController');

const router = express.Router();

router.get('/', concertsController.getConcerts);
router.post('/', concertsController.createConcert);
router.put('/:id', concertsController.updateConcert);
router.delete('/:id', concertsController.deleteConcert);

module.exports = router;
