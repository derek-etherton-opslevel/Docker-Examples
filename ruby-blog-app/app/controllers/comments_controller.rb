class CommentsController < ApplicationController
  before_action :require_login
  before_action :set_post
  before_action :set_comment, only: [:destroy]
  
  def create
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user
    
    if @comment.save
      redirect_to @post, notice: 'Comment was successfully added.'
    else
      @comments = @post.comments.recent
      render 'posts/show'
    end
  end
  
  def destroy
    if @comment.user == current_user || current_user.admin?
      @comment.destroy
      redirect_to @post, notice: 'Comment was successfully deleted.'
    else
      redirect_to @post, alert: 'You can only delete your own comments.'
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:post_id])
  end
  
  def set_comment
    @comment = @post.comments.find(params[:id])
  end
  
  def comment_params
    params.require(:comment).permit(:content)
  end
end
