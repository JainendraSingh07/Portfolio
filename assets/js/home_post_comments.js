$(document).ready(function() {

    // Class to handle comment creation and deletion for each post
    class PostComments {
        // Initialize the instance of the class for a specific post
        constructor(postId) {
            this.postId = postId;
            this.postContainer = $(`#post-${postId}`);
            this.newCommentForm = $(`#post-${postId}-comments-form`);

            this.createComment(postId);

            let self = this;
            // Call for all the existing comments
            $(this.postContainer).find('.delete-comment-button').each(function() {
                self.deleteComment($(this));
            });
        }

        createComment(postId) {
            let pSelf = this;
            this.newCommentForm.submit(function(e) {
                e.preventDefault();
                let self = this;

                $.ajax({
                    type: 'post',
                    url: '/message/comments/create', // Adjusted URL to match your route
                    data: $(self).serialize(),
                    success: function(data) {
                        let newComment = pSelf.newCommentDom(data.data.comment);
                        $(`#post-comments-${postId}`).prepend(newComment);
                        pSelf.deleteComment($('.delete-comment-button', newComment));

                        // Enable the functionality of the toggle like button on the new comment
                        new ToggleLike($('.toggle-like-button', newComment));

                        new Noty({
                            theme: 'relax',
                            text: "Comment published!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }).show();

                    },
                    error: function(error) {
                        console.log(error.responseText);
                    }
                });
            });
        }

        newCommentDom(comment) {
            // Show the count of zero likes on this comment
            return $(`<li id="comment-${comment._id}">
                        <p>
                            <small>
                                <a class="delete-comment-button" href="/message/comments/destroy/${comment._id}" aria-label="Delete Comment"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg></a>
                            </small>
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.username}
                            </small>
                            <small>
                                <a class="toggle-like-button" data-likes="0" href="/message/likes/toggle/?id=${comment._id}&type=Comment">
                                    0 Likes
                                </a>
                            </small>
                        </p>
                    </li>`);
        }

        deleteComment(deleteLink) {
            $(deleteLink).click(function(e) {
                e.preventDefault();

                $.ajax({
                    type: 'get',
                    url: $(deleteLink).prop('href'),
                    success: function(data) {
                        $(`#comment-${data.data.comment_id}`).remove();

                        new Noty({
                            theme: 'relax',
                            text: "Comment Deleted",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                        }).show();
                    },
                    error: function(error) {
                        console.log(error.responseText);
                    }
                });
            });
        }
    }

    // Initialize PostComments for each post on the page
    $('.post-comments').each(function() {
        let postId = $(this).data('post-id');
        new PostComments(postId);
    });

});
