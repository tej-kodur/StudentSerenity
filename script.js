document.addEventListener('DOMContentLoaded', function() {
    const articles = [
        { title: "Article 1", content: "This is the first article", url: "article1.html", tags: ['short', 'introductory'] },
        { title: "Article 2", content: "This is the second article", url: "article2.html", tags: ['long', 'detailed'] },
        // Add more articles with tags as needed...
    ];

    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];


    function displayArticles(filteredArticles) {
        const container = document.getElementById('articlesContainer');
        container.innerHTML = ''; // Clear current content
        filteredArticles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.className = 'article';
            articleDiv.innerHTML = `
                <div class="article-title">${article.title}</div>
                <div class="article-content">${article.content}</div>
                <div class="article-tags">Tags: ${article.tags.join(', ')}</div>
                <a href="${article.url}">Read more</a>
            `;
            container.appendChild(articleDiv);
        });
    }

    function searchArticles(query) {
        return articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) || 
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }

    function updateRecentSearches(query) {
        if (query && !recentSearches.includes(query)) {
            recentSearches.unshift(query); // Add to the beginning of the array
            if (recentSearches.length > 5) { // Limit to 5 recent searches
                recentSearches.pop();
            }
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        }
    }

    function displaySearchSuggestions(inputValue) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        suggestionsContainer.innerHTML = ''; // Clear existing suggestions

        if (inputValue) {
            const suggestions = recentSearches.filter(search => 
                search.toLowerCase().includes(inputValue.toLowerCase())
            );

            suggestions.forEach(suggestion => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.textContent = suggestion;
                suggestionDiv.addEventListener('click', () => {
                    document.getElementById('searchInput').value = suggestion;
                    const results = searchArticles(suggestion);
                    displayArticles(results);
                    suggestionsContainer.innerHTML = ''; // Clear suggestions after selection
                });
                suggestionsContainer.appendChild(suggestionDiv);
            });
        }
    }

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const results = searchArticles(e.target.value);
        displayArticles(results);
        displaySearchSuggestions(e.target.value);
    });

    searchInput.addEventListener('change', (e) => {
        updateRecentSearches(e.target.value.trim());
    });

    // Initially display all articles
    displayArticles(articles);
});
