
/*
    Challenge 1.
    Write a SQL query that counts the number of films in each category in the Pagila database.
    - The query should return two columns: category and film_count
    - category should display the name of each category
    - film_count should show the total number of films in that category
    - Results should be grouped by category name
 */
SELECT
    c.name as category,
    COUNT(*) as film_count
FROM public.film_category fc
    INNER JOIN public.category c USING (category_id)
GROUP BY
    c.category_id,
    c.name
ORDER BY
    category;


 /*
    Challenge 2.
    Write a SQL query that finds the top 5 customers who have spent the most money in the Pagila database.
    - The query should return three columns: first_name, last_name, and total_spent
    - total_spent should show the sum of all payments made by that customer
    - Results should be ordered by total_spent in descending order
    - The query should limit results to only the top 5 highest-spending customers
 */
SELECT
    c.first_name,
    c.last_name,
    SUM(p.amount) as total_spent
FROM
    public.customer c
    INNER JOIN public.payment p ON c.customer_id = p.customer_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
ORDER BY
    total_spent DESC,
    first_name,
    last_name
LIMIT 5;


/*
    Challenge 3.
    Write a SQL query that lists all film titles that have been rented in the past 10 years in the Pagila database.
    - The query should return one column: title
    - title should display the name of each film that has been rented
    - The time period for "recent" should be within the last 10 years from the current date
    - Results should only include films that have rental records in this time period
*/
SELECT
    f.title
FROM
    public.film f
    INNER JOIN public.inventory i ON f.film_id = i.film_id
    INNER JOIN public.rental r ON i.inventory_id = r.inventory_id
WHERE
    r.rental_date BETWEEN (CURRENT_DATE - INTERVAL '10 YEAR') AND CURRENT_DATE
GROUP BY
    f.film_id,
    f.title
ORDER BY
    title;


/*
    Challenge 4.
    Write a SQL query that lists all films that have never been rented in the Pagila database.
    - The query should return two columns: title and inventory_id
    - title should display the name of each film that has never been rented
    - inventory_id should show the inventory ID of the specific copy
*/
WITH films_with_zero_rents AS (
    SELECT
        f.title,
        i.inventory_id,
        COUNT(r.rental_id) as count
    FROM
        public.film f
        LEFT JOIN public.inventory i ON f.film_id = i.film_id
        LEFT JOIN public.rental r ON r.inventory_id = i.inventory_id
    GROUP BY
        f.film_id,
        f.title,
        i.inventory_id
    HAVING
        COUNT(r.rental_id) = 0
)
SELECT
    title,
    inventory_id
FROM
    films_with_zero_rents
ORDER BY
    title;


/*
    Challenge 5.
    Write a SQL query that lists all films that were rented more times than the average rental count per film in the Pagila database.
    - The query should return two columns: title and rental_count
    - title should display the name of each film
    - rental_count should show the total number of times the film was rented
*/
WITH films_rental AS (
    SELECT
        f.title,
        COUNT(r.rental_id) as rental_count
    FROM
        public.film f
        INNER JOIN public.inventory i ON f.film_id = i.film_id
        INNER JOIN public.rental r ON i.inventory_id = r.inventory_id
    GROUP BY
        f.film_id,
        f.title
)
SELECT
    title,
    rental_count
FROM
    films_rental
WHERE
    rental_count > (SELECT AVG(rental_count) FROM films_rental)
ORDER BY
    title;


/*
    Challenge 6.
    Write a SQL query that calculates rental activity for each customer.
    - The query should return the customer's first_name and last_name
    - It should also return their first rental date as first_rental
    - Their most recent rental date should be shown as last_rental
    - The difference in days between the first and last rentals should be shown as rental_span_days
    - Results should be grouped by customer and ordered by rental_span_days in descending order
*/
SELECT
    CONCAT(c.first_name, ' ', c.last_name) as customer,
    MIN(r.rental_date) as first_rental,
    MAX(r.rental_date) as last_rental,
    DATE_PART('DAY', MAX(r.rental_date) - MIN(r.rental_date)) as rental_span_days
FROM
    public.customer c
    INNER JOIN public.rental r ON c.customer_id = r.customer_id
    INNER JOIN public.inventory i ON r.inventory_id = i.inventory_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
ORDER BY
    rental_span_days DESC;


/*
    Challenge 7.
    Find all customers who have not rented movies from every available genre.
    - The result should include the customer's first_name and last_name
    - Only include customers who are missing at least one genre in their rental history
*/
SELECT
    CONCAT(c.first_name, ' ', c.last_name) as customer,
    COUNT(DISTINCT fc.category_id) as total_categories_rented
FROM
    public.customer c
    INNER JOIN public.rental r ON c.customer_id = r.customer_id
    INNER JOIN public.inventory i ON r.inventory_id = i.inventory_id
    INNER JOIN public.film f ON i.film_id = f.film_id
    INNER JOIN public.film_category fc ON f.film_id = fc.film_id
GROUP BY
    c.customer_id,
    c.first_name,
    c.last_name
HAVING
    COUNT(DISTINCT fc.category_id) < (
        SELECT COUNT(*) FROM public.category
    );


/*
    Bonus Challenge 8 (opt)
    Find the Top 3 Most Frequently Rented Films in Each Category and Their Total Rental Revenue.
    - The result should include the film title, category name, rental count, and total revenue
    - Only the top 3 films per category should be returned
    - Results should be ordered by category and ranking within the category
*/
WITH category_rents_by_film AS (
    SELECT
        c.name as category_name,
        f.title as film_title,
        COUNT(r.rental_id) as rental_count,
        SUM(p.amount) as total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY c.name
            ORDER BY COUNT(r.rental_id) DESC, SUM(p.amount) DESC
        ) AS rank
    FROM
        public.film f
        INNER JOIN public.inventory i ON f.film_id = i.film_id
        INNER JOIN public.rental r ON i.inventory_id = r.inventory_id
        INNER JOIN public.film_category fc ON f.film_id = fc.film_id
        INNER JOIN public.category c ON fc.category_id = c.category_id
        INNER JOIN public.payment p ON r.rental_id = p.rental_id
    GROUP BY
        c.category_id,
        c.name,
        f.film_id,
        f.title
    ORDER BY
        category_name,
        rank
)
SELECT
    category_name,
    film_title,
    rental_count,
    total_revenue
FROM
    category_rents_by_film
WHERE
    rank < 4;