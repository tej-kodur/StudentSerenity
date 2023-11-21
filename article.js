// Mock function to mimic fetching article data based on an index

const articles = [
    // Adding 30 articles with different tags and an author tag
    {
        title: "Understanding ADHD Causes: Unraveling the Complex Web",
        summary: "Attention deficit hyperactivity disorder (ADHD) is a neurodevelopmental disorder. It is one of the most common disorders of this kind diagnosed in children. ADHD often carries over into adulthood...",
        tags: { length: 'short', concern: 'adhd', feeling: 'anxious', date: '2021-01-01', type: 'informative', author: 'Dr. A. Smith' }
    },
    {
        title: "Depression in the Workplace: Recognizing and Responding",
        summary: "Depression in the workplace is an often-overlooked issue that can significantly impact productivity and employee well-being. Understanding how to recognize the signs of depression among colleagues and the best ways to offer support are crucial steps in creating a supportive work environment...",
        tags: { length: 'long', concern: 'depression', feeling: 'sad', date: '2021-02-15', type: 'selfhelp', author: 'J. Doe' }
    },
    // ... 28 more articles ...
    {
        title: "Navigating Social Anxiety in College Settings",
        summary: "Social anxiety can deeply affect one's ability to engage in university life. This article explores strategies to manage social anxiety, create meaningful relationships, and enhance academic performance...",
        tags: { length: 'medium', concern: 'anxiety', feeling: 'stressed', date: '2021-03-30', type: 'selfhelp', author: 'C. Brown' }
    },
    // Repeated articles with variations for the example
    ...Array.from({ length: 27 }, (_, i) => ({
        title: `Article Title ${i + 4}`,
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        tags: { 
            length: ['short', 'medium', 'long'][i % 3],
            concern: ['adhd', 'depression', 'ptsd', 'anxiety', 'insomnia'][i % 5],
            feeling: ['anxious', 'sad', 'stressed', 'lonely'][i % 4],
            date: ['2021', '2020', '2019', '2018', 'before 2018'][i % 5],
            type: ['informative', 'selfhelp'][i % 2],
            author: `Author ${i % 10}`
        }
    }))
];

function getArticleData(index) {
    // Replace this with the actual articles array or fetching logic
    
    return articles[index];
}

// This is your existing code where you call getArticleData
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleIndex = parseInt(urlParams.get('index'), 10);

    if (!isNaN(articleIndex) && articleIndex >= 0 && articleIndex < articles.length) {
        const articleData = articles[articleIndex];
        document.getElementById('article-title').textContent = articleData.title;
        document.getElementById('article-author').textContent = `Author: ${articleData.tags.author}`;
        document.getElementById('article-date').textContent = `Date: ${articleData.tags.date}`;
        // Set the content for other elements...
        document.getElementById('article-body').innerHTML = articleData.summary; // If summary contains HTML, use innerHTML
    } else {
        console.error('Article index is out of bounds or not defined');
        // Handle error...
    }
});

