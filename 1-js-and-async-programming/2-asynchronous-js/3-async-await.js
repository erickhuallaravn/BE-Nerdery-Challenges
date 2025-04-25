/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/
const { getUsers, getLikedMovies, getDislikedMovies } = require("./utils/mocked-api");
const { getUserSubscriptionByUserId } = require("./utils/mocked-api");

const getUsersWithMoreDislikedMoviesThanLikedMoviesAsync = async () => {
  try {
    const users = await getUsers();
    const likedMovies = await getLikedMovies();
    const dislikedMovies = await getDislikedMovies();
    
    const filteredUsers = await Promise.all(
      users.filter(async user => {
        let likedMoviesCount = likedMovies.find(m => m.userId == user.id)?.movies.length || 0;
        let dislikedMoviesCount = dislikedMovies.find(m => m.userId == user.id)?.movies.length || 0;
        return dislikedMoviesCount > likedMoviesCount;
      }));
    return filteredUsers;
  } catch (error) {
    throw error;
  }
};

/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */
const getCommonDislikedSubscription = async () => {
  try {
    const harshReviewers = await getUsersWithMoreDislikedMoviesThanLikedMoviesAsync();

    const suscriptions = await Promise.all(
      harshReviewers.map(async reviewer => await getUserSubscriptionByUserId(reviewer.id)
      ));
      
      const subsCount = suscriptions.reduce((accumulator, item) => {
        accumulator[item.subscription] = (accumulator[item.subscription] || 0) + 1;
        return accumulator;
      }, []);
      const sortedSubsCountList = Object.entries(subsCount).sort((curr, next) => next[1] - curr[1]);
    return sortedSubsCountList[0][0];
  } catch (error) {
    throw error;
  }
};

getCommonDislikedSubscription()
  .then(subscription => console.log(`Common more dislike subscription is: ${subscription}`))
  .catch(error => console.log(`Occurred an error getting the common more dislike subscription: ${error}`));
