
$(document).ready(() => {


  // TOGGLE IN NAVBAR ============================

  $('#compose').on('click', () => {
    $('.new-tweet').slideToggle(500);
    $('#tweet-text').focus();
  });

  
  // TWEET ARTICLE ================================
  
  const createTweetElement = (tweet) => {
    
    const { name, avatars, handle } = tweet.user;
    const tweetText = tweet.content.text;
    const timespamp = tweet.created_at;
    
    let $tweet = $(
      `<article class="tweet-container">
        <header>
          <div>
            <img src=${avatars}> 
            <p class="name">${name}</p>
          </div>
          <span class="handle">${handle}</span>
        </header>
        
        <textarea name="text" class="tweet">${tweetText}</textarea>
        <footer>
          <h6 class="timestamp">${moment(timespamp).fromNow()}</h6>
          <div class="article-icons">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>
      `).addClass('tweet');
    return $tweet;
  };
    
  const renderTweets = function(tweets) {
    for (let tweet of tweets) {
      let $tweet = createTweetElement(tweet);
      $('.tweets-container').prepend($tweet);
    }
  };
    
  // FORM SUBMISSION === ERROR MESSAGE ==== SAFEHTML==========
  
  const $tweetText = $('#tweet-text');

  const loadtweets = () => {
    $.get('/tweets', { method: 'GET' })
      .then((response) => {
        let newTweet = [response[response.length - 1]];
        renderTweets(newTweet);
        $tweetText.val('').focus();
        $('.counter').html('140');
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      });
  };
  
  $('#post-tweet').submit(function() {
    event.preventDefault();
    $('.error-message').slideUp(200);
    
    let tweetText = $('#tweet-text').val();
    const safeHTML = `<p>${escape(tweetText)}</p>`;
    const $errorMessage = $('.error-message');
    const errIcon = '<i class="fa fa-times-circle"></i>';

    if (tweetText === null || tweetText.length < 1) {
      $errorMessage.html(errIcon + ' Please, type your tweet').slideDown(200);
      $tweetText.focus();
    } if (tweetText.length - 1 >= 140) {
      $errorMessage.html(errIcon + ' Your tweet is too long. Maxlength is 140 characters').slideDown(200);
      $tweetText.focus();
    } else if (safeHTML.includes('%3C')) {
      $errorMessage.html(errIcon + ' Unsecure text tweet has been submitted').slideDown(200);
      $tweetText.val('').focus();
    } else {
      $.ajax('/tweets', { method: 'POST', data: $(this).serialize() })
        .then(() => {
          loadtweets();
        });
    }
  });

  $.get('/tweets', { method: 'GET' })
    .then((response) => {
      renderTweets(response);
    })
    .fail((err) => {
      console.log('Something went wrong', err);
    });
       
});


