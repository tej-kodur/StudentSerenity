
let currentPage = 1;
document.addEventListener('DOMContentLoaded', function() {
    const articlesPerPage = 20;

    function loadArticles() {
        fetch('articles.json')
          .then(response => response.json())
          .then(data => {
            articles = data.articles; // Assuming your JSON structure matches the one given above
            totalPages = Math.ceil(articles.length / articlesPerPage);
            renderPage();
          });
      }
    
      // Call the loadArticles function to load your articles from the JSON file
    loadArticles();



    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const paginationContainer = document.getElementById('pagination'); // Ensure this element exists in your HTML


    const articlesContainer = document.getElementById('articles');
    const searchInput = document.getElementById('searchInput');
    const suggestionsPanel = document.getElementById('suggestions');
    const filterButton = document.getElementById('filterButton');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');

    
    function renderPage() {
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const pageArticles = articles.slice(startIndex, endIndex);
        renderArticles(pageArticles);
        updatePagination();
    }



    function renderArticles(articlesToRender) {
        articlesContainer.innerHTML = articlesToRender.map((article, index) => `
            <div class="article-card">
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <button class="read-more-btn" data-index="${index}">Read More</button>
            </div>
        `).join('');
    
        // Add click event listeners to each "Read More" button
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const articleIndex = this.getAttribute('data-index');
                // Redirect to the article content page with the index as a query parameter
                window.location.href = `article.html?index=${articleIndex}`;
            });
        });
    }
    

    
    function updatePagination() {
        paginationContainer.innerHTML = '';

        // Add previous button
        if (currentPage > 1) {
            const prevButton = createPaginationButton(currentPage - 1, 'Previous');
            paginationContainer.appendChild(prevButton);
        }

        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, i);
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            paginationContainer.appendChild(pageButton);
        }

        // Add next button
        if (currentPage < totalPages) {
            const nextButton = createPaginationButton(currentPage + 1, 'Next');
            paginationContainer.appendChild(nextButton);
        }
    }

    function createPaginationButton(page, text) {
        const button = document.createElement('a');
        button.href = '#';
        button.textContent = text;
        button.addEventListener('click', function(e) {
            e.preventDefault();
            changePage(page);
        });
        return button;
    }

    window.changePage = function(newPage) {
        currentPage = newPage;
        renderPage();
    };


    function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredArticles = articles;
    
        // Filter by search term
        if (searchTerm) {
            filteredArticles = filteredArticles.filter(article => {
                const tagsString = Object.values(article.tags).join(' ').toLowerCase();
                return article.title.toLowerCase().includes(searchTerm) ||
                       article.summary.toLowerCase().includes(searchTerm) ||
                       tagsString.includes(searchTerm);
            });
        }
    
        // Get selected years from the checkboxes
        const selectedYears = Array.from(document.querySelectorAll('input[name="date"]:checked'))
                                   .map(checkbox => checkbox.value);
    
        // Filter by checkboxes for each category
        filteredArticles = filteredArticles.filter(article => {
            // Filter by selected years, including the special case for "Before 2018"
            const articleYear = article.tags.date.split('-')[0];
            if (selectedYears.includes('before2018') && parseInt(articleYear, 10) < 2018) {
                return true;
            }
            if (selectedYears.length > 0 && !selectedYears.includes(articleYear)) {
                return false;
            }
    
            // Filter by other categories (concern, length, etc.)
            return Array.from(filterCheckboxes).every(checkbox => {
                if (!checkbox.checked || checkbox.name === 'date') {
                    return true; // Skip unchecked checkboxes and date checkboxes since it's already handled
                }
                // Check if the article's tags match the checkbox value
                const category = checkbox.name;
                const value = checkbox.value.toLowerCase();
                return article.tags[category].toLowerCase() === value;
            });
        });
    
        renderArticles(filteredArticles);
    }
    


    

        // On your main page with the articles list
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', function() {
            // Assuming each card has a data attribute with the article ID
            const articleId = this.dataset.articleId;
            // Store the article ID in local storage or pass it in the URL
            localStorage.setItem('currentArticleId', articleId);
            // Redirect to the article content page
            window.location.href = 'article.html';
        });
    });


    function getCheckedBoxesValues(name) {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    }

    function showSuggestions(value) {
        if (value.length > 0) {
            // Filter and show suggestions
            const suggestions = getAllTags(articles).filter(tag => 
                tag.toLowerCase().includes(value.toLowerCase())
            );
            suggestionsPanel.innerHTML = '';
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.textContent = suggestion;
                div.onclick = function() {
                    searchInput.value = suggestion;
                    filterArticles();
                    closeSuggestions(); // Close the suggestions panel after a suggestion is clicked
                };
                suggestionsPanel.appendChild(div);
            });
            // Only display the suggestions panel if there are suggestions
            if (suggestions.length > 0) {
                suggestionsPanel.style.display = 'block';
            } else {
                closeSuggestions();
            }
        } else {
            closeSuggestions();
        }
    }

    function closeSuggestions() {
        suggestionsPanel.style.display = 'none';
    }

    // Event listener for the search input
    searchInput.addEventListener('input', function(e) {
        showSuggestions(e.target.value);
    });

    // Event listener for closing the suggestions panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !suggestionsPanel.contains(event.target)) {
            closeSuggestions();
        }
    });



    function getAllTags(articles) {
        const allTags = new Set();
        articles.forEach(article => {
            Object.values(article.tags).forEach(tag => {
                allTags.add(tag);
            });
        });
        return Array.from(allTags);
    }

    filterButton.addEventListener('click', function() {
        this.classList.toggle('active');
        filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function(event) {
        if (!filterButton.contains(event.target) && !filterDropdown.contains(event.target)) {
            filterDropdown.style.display = 'none';
            filterButton.classList.remove('active');
        }
    });
    

    filterDropdown.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            // Reset to the first page when filters change
            currentPage = 1;
            filterArticles();
        }
    });

    searchInput.addEventListener('input', function(e) {
        // Reset to the first page when search terms change
        currentPage = 1;
        showSuggestions(e.target.value);
        filterArticles();
    });

    // Call the initial render function
    renderPage();
});
