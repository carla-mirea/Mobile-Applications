const repository = require('../db/repository');
const Concert = require('../model/concert');
const { broadcast } = require('../db/websocket');

const getConcerts = async (req, res) => {
  try {
    const concerts = await repository.getAllConcerts();
    const formattedConcerts = concerts.map((row) => Concert.fromDbRow(row).toJSON());
    res.json(formattedConcerts);
  } catch (err) {
    console.error('[Controller] Error fetching concerts:', err.message);
    res.status(500).json({ error: 'Failed to fetch concerts.' });
  }
};

const createConcert = async (req, res) => {
    try {
      const { name, description, date, location, performers } = req.body;
  
      if (!name || !description || !date || !location || !performers) {
        console.error('[Controller] Missing required fields:', req.body);
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      const formattedPerformers = Array.isArray(performers) ? performers : performers.split(',').map((p) => p.trim());
  
      const newConcert = new Concert(null, name, description, date, location, formattedPerformers);
      const concertId = await repository.createConcert(newConcert.toDbRow());
  
      const createdConcertRow = await repository.getConcertById(concertId);
      const createdConcert = Concert.fromDbRow(createdConcertRow).toJSON();
      broadcast({ type: 'concert_created', concert: createdConcert });
  
      res.status(201).json(createdConcert);
    } catch (err) {
      console.error('[Controller] Error creating concert:', err.message);
      res.status(500).json({ error: 'Failed to create concert.' });
    }
  };
  
  const updateConcert = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, date, location, performers } = req.body;
  
      if (!name || !description || !date || !location || !performers) {
        console.error('[Controller] Missing required fields:', req.body);
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      const formattedPerformers = Array.isArray(performers) ? performers : performers.split(',').map((p) => p.trim());
  
      const updatedConcert = new Concert(id, name, description, date, location, formattedPerformers);
      const rowsAffected = await repository.updateConcert(updatedConcert.toDbRow());
  
      if (rowsAffected === 0) {
        return res.status(404).json({ error: 'Concert not found.' });
      }
  
      const updatedConcertRow = await repository.getConcertById(id);
      const concert = Concert.fromDbRow(updatedConcertRow).toJSON();
      broadcast({ type: 'concert_updated', concert });
  
      res.json(concert);
    } catch (err) {
      console.error('[Controller] Error updating concert:', err.message);
      res.status(500).json({ error: 'Failed to update concert.' });
    }
  };
  

const deleteConcert = async (req, res) => {
  try {
    const { id } = req.params;
    const rowsAffected = await repository.deleteConcert(id);

    if (rowsAffected === 0) {
      return res.status(404).json({ error: 'Concert not found.' });
    }

    broadcast({ type: 'concert_deleted', concertId: id });
    res.json({ message: 'Concert deleted successfully.' });
  } catch (err) {
    console.error('[Controller] Error deleting concert:', err.message);
    res.status(500).json({ error: 'Failed to delete concert.' });
  }
};

module.exports = {
  getConcerts,
  createConcert,
  updateConcert,
  deleteConcert,
};
