// Mock function to mimic fetching article data based on an index
function getArticleData(index) {
    // Replace this with the actual articles array or fetching logic
    
    return articles[index];
}

// This is your existing code where you call getArticleData
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleIndex = parseInt(urlParams.get('index'), 10);
   
    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            const articleData = articles[articleIndex];
            document.getElementById('article-title').textContent = articleData.title;
            document.getElementById('article-author').textContent = `Author: ${articleData.tags.author}`;
            document.getElementById('article-date').textContent = `Date: ${articleData.tags.date}`;
            // Set the content for other elements...
            document.getElementById('article-body').innerHTML = articleData.summary; // If summary contains HTML, use innerHTML
        });
            // if (!isNaN(articleIndex) && articleIndex >= 0 && articleIndex < articles.length) {
            //     const articleData = articles[articleIndex];
            //     document.getElementById('article-title').textContent = articleData.title;
            //     document.getElementById('article-author').textContent = `Author: ${articleData.tags.author}`;
            //     document.getElementById('article-date').textContent = `Date: ${articleData.tags.date}`;
            //     // Set the content for other elements...
            //     document.getElementById('article-body').innerHTML = articleData.summary; // If summary contains HTML, use innerHTML
            // } else {
            //     console.error('Article index is out of bounds or not defined');
            //     // Handle error...
            // }}
});
