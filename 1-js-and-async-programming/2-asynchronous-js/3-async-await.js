/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

const { getUsersWithMoreDislikedMoviesThanLikedMoviesAsync } = require("./2-promise");
const { getUserSubscriptionByUserId } = require("./utils/mocked-api");

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

    const mostCommon = suscriptions.reduce((subs, sub) => {
      subs[sub] = (subs[sub] || 0) + 1;
      return subs;
    });
    return mostCommon.subscription;
  } catch (error) {
    throw error;
  }
};

getCommonDislikedSubscription()
  .then(subscription => console.log(`Common more dislike subscription is: ${subscription}`))
  .catch(error => console.log(`Occurred an error getting the common more dislike subscription: ${error}`));
