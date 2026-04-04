const store = require('../database/store');

/**
 * Calculates a match score between a lost item and a found item.
 * 
 * @param {Object} lostItem 
 * @param {Object} foundItem 
 * @returns {number} Score from 0 to 100
 */
function calculateMatchScore(lostItem, foundItem) {
    let score = 0;
    const maxScore = 100;

    // 1. Keyword Matching (Title & Description) - Weight: 40%
    const lostText = `${lostItem.title} ${lostItem.description}`.toLowerCase();
    const foundText = `${foundItem.title} ${foundItem.description}`.toLowerCase();

    const keywords = lostText.split(/\s+/).filter(w => w.length > 2);
    let keywordMatches = 0;
    keywords.forEach(word => {
        if (foundText.includes(word)) keywordMatches++;
    });

    if (keywords.length > 0) {
        const keywordScore = Math.min((keywordMatches / keywords.length) * 40, 40);
        score += keywordScore;
    }

    // 2. Color Matching (Simulated for MVP) - Weight: 30%
    // In a real app, use Cloud Vision to extract colors.
    // Here, we check if the description contains color names.
    const colors = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'grey', 'silver', 'gold'];
    const lostColors = colors.filter(c => lostText.includes(c));
    const foundColors = colors.filter(c => foundText.includes(c));

    const commonColors = lostColors.filter(c => foundColors.includes(c));
    if (lostColors.length > 0 && commonColors.length > 0) {
        score += 30; // Full points if color matches (simple logic)
    }

    // 3. Category/Type Matching - Weight: 30%
    // Assuming we have a 'category' field or infer it from title
    if (lostItem.category && foundItem.category &&
        lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
        score += 30;
    }

    return score;
}

/**
 * Finds potential matches for a given item.
 * 
 * @param {Object} sourceItem - The item we are looking for (Lost)
 * @param {Array} candidateItems - List of items to search in (Found)
 * @returns {Array} List of matches with scores
 */
function findMatches(sourceItem, candidateItems) {
    const matches = candidateItems.map(candidate => {
        const score = calculateMatchScore(sourceItem, candidate);
        return {
            item: candidate,
            score: Math.round(score)
        };
    }).filter(match => match.score > 0); // Only return matches with some relevance

    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
}

module.exports = {
    findMatches,
    calculateMatchScore
};
