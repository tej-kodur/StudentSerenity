document.addEventListener('DOMContentLoaded', function() {
    const articles = [
        {
            title: "Understanding ADHD Causes",
            summary: "Attention deficit hyperactivity disorder (ADHD) is a neurodevelopmental disorder...",
            tags: { length: 'short', concern: 'adhd', feeling: 'anxious', date: '2021-01-01', type: 'informative' }
        },
        {
            title: "Depression in the Workplace",
            summary: "Depression in the workplace is an often-overlooked issue that can significantly impact productivity...",
            tags: { length: 'long', concern: 'depression', feeling: 'sad', date: '2021-02-15', type: 'selfhelp' }
        },
        {
            title: "Coping with PTSD in Family Settings",
            summary: "Managing PTSD within a family context presents unique challenges and dynamics...",
            tags: { length: 'long', concern: 'ptsd', feeling: 'stressed', date: '2021-03-30', type: 'informative' }
        },
        // Add more article objects as needed
    ];

    const articlesContainer = document.getElementById('articles');
    const searchInput = document.getElementById('searchInput');
    const suggestionsPanel = document.getElementById('suggestions');


    function renderArticles(articlesToRender) {
        articlesContainer.innerHTML = articlesToRender.map(article => `
            <div class="article-card">
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <div class="tags">
                    <span class="tag">${article.tags.length}</span>
                    <span class="tag">${article.tags.concern}</span>
                    <span class="tag">${article.tags.feeling}</span>
                    <span class="tag">${article.tags.date}</span>
                    <span class="tag">${article.tags.type}</span>
                </div>
            </div>
        `).join('');
    }

    function filterArticles(searchTerm) {
        return articles.filter(article => {
            const tagsString = Object.values(article.tags).join(' ').toLowerCase();
            return article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   tagsString.includes(searchTerm.toLowerCase());
        });
    }




    // Function to collect all unique tags from the articles
    function getAllTags(articles) {
        const allTags = new Set();
        articles.forEach(article => {
            Object.values(article.tags).forEach(tag => {
                allTags.add(tag);
            });
        });
        return Array.from(allTags);
    }

    function showSuggestions(value) {
        const suggestions = getAllTags(articles).filter(tag => 
            tag.toLowerCase().includes(value.toLowerCase())
        );
        suggestionsPanel.innerHTML = '';
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.innerHTML = suggestion;
            div.onclick = function() {
                searchInput.value = suggestion;
                const filteredArticles = filterArticles(suggestion);
                renderArticles(filteredArticles);
                suggestionsPanel.innerHTML = '';
            };
            suggestionsPanel.appendChild(div);
        });
    }

    searchInput.addEventListener('input', function(e) {
        const filteredArticles = filterArticles(e.target.value);
        renderArticles(filteredArticles);
        if (e.target.value.length > 0) {
            showSuggestions(e.target.value);
        } else {
            suggestionsPanel.innerHTML = '';
        }
    });

    // Hide suggestions panel when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.id !== 'searchInput') {
            suggestionsPanel.innerHTML = '';
        }
    });

    // Initially display all articles
    renderArticles(articles);
});
