const WORDS_PER_MINUTE = 200; // Average reading speed
const CODE_READING_FACTOR = 0.3; // Reading code is slower

export const calculateReadingTime = (content) => {
    // Split content into regular text and code blocks
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const textContent = content.replace(/```[\s\S]*?```/g, '');

    // Count words in text
    const textWords = textContent.trim().split(/\s+/).length;
    
    // Count words in code (weighted differently)
    const codeWords = codeBlocks.reduce((total, block) => {
        return total + block.split(/\s+/).length;
    }, 0);

    // Calculate total time (in minutes)
    const textTime = textWords / WORDS_PER_MINUTE;
    const codeTime = (codeWords / WORDS_PER_MINUTE) / CODE_READING_FACTOR;
    const totalMinutes = Math.ceil(textTime + codeTime);

    return totalMinutes === 1 ? '1 min' : `${totalMinutes} mins`;
};
