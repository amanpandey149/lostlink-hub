const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Item = require('../models/Item');
const { findMatches } = require('../services/matcher');

// Configure Multer for memory storage (Serverless compatible)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// --- ROUTES ---

// Submit a LOST item
router.post('/lost', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, contact, date } = req.body;

        const newItem = await Item.create({
            type: 'lost',
            title,
            description,
            category,
            contact,
            date: date || new Date(),
            title,
            description,
            category,
            contact,
            date: date || new Date(),
            imageUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null,
            status: 'active'
        });

        // Find immediate matches from existing 'found' items
        const foundItems = await Item.find({ type: 'found', status: 'active' });
        const matches = findMatches(newItem, foundItems);

        res.status(201).json({
            success: true,
            message: 'Lost item reported successfully',
            item: newItem,
            potentialMatches: matches
        });
    } catch (error) {
        console.error('Error reporting lost item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Submit a FOUND item
router.post('/found', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, contact, location, date } = req.body;

        const newItem = await Item.create({
            type: 'found',
            title,
            description,
            category,
            contact,
            location,
            date: date || new Date(),
            title,
            description,
            category,
            contact,
            date: date || new Date(),
            imageUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null,
            status: 'active'
        });

        // Find immediate matches from existing 'lost' items
        const lostItems = await Item.find({ type: 'lost', status: 'active' });
        const matches = findMatches(newItem, lostItems);

        res.status(201).json({
            success: true,
            message: 'Found item reported successfully',
            item: newItem,
            potentialMatches: matches
        });
    } catch (error) {
        console.error('Error reporting found item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all lost items
router.get('/lost', async (req, res) => {
    try {
        const items = await Item.find({ type: 'lost' }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all found items
router.get('/found', async (req, res) => {
    try {
        const items = await Item.find({ type: 'found' }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get specific item by ID (search both lists)
router.get('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Check if valid ObjectId
        let item;
        if (mongoose.Types.ObjectId.isValid(id)) {
            item = await Item.findById(id);
        } else {
            // Fallback if we were using UUIDs before (mostly for legacy support or if user searches old ID)
            // But since we switched to Mongoose, we likely use _id. 
            // If we wanted to keep using UUIDs we would have added a separate uuid field.
            // For now, assume _id.
        }

        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get matches for a specific item
router.get('/matches/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        let matches = [];
        if (item.type === 'lost') {
            const candidates = await Item.find({ type: 'found', status: 'active' });
            matches = findMatches(item, candidates);
        } else {
            const candidates = await Item.find({ type: 'lost', status: 'active' });
            matches = findMatches(item, candidates);
        }

        return res.json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
