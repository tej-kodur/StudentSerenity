
let currentPage = 1;
document.addEventListener('DOMContentLoaded', function() {
    const articlesPerPage = 20;


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
                    <span class="tag">${article.tags.author}</span>
                </div>
            </div>
        `).join('');
    }
    function updatePagination() {
        paginationContainer.innerHTML = '';

        // Add previous button
        if (currentPage > 1) {
            const prevButton = createPaginationButton(currentPage - 1, '&laquo; Previous');
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
            const nextButton = createPaginationButton(currentPage + 1, 'Next &raquo;');
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

        // Filter by checkboxes for each category
        filteredArticles = filteredArticles.filter(article => {
            return Array.from(filterCheckboxes).every(checkbox => {
                if (!checkbox.checked) {
                    return true; // If the checkbox is not checked, don't filter by it
                }
                // Check if the article's tags match the checkbox value
                const category = checkbox.name;
                const value = checkbox.value.toLowerCase();
                return article.tags[category].toLowerCase() === value;
            });
        });

        renderArticles(filteredArticles);
    }


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
        // Display a message if no articles match the filter
        if (articlesToRender.length === 0) {
            articlesContainer.innerHTML = '<p class="no-articles">No articles found.</p>';
        }
    }

  

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
