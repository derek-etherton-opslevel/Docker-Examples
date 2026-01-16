class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :require_login, only: [:new, :create, :edit, :update, :destroy]
  
  def index
    @posts = Post.published.recent.page(params[:page])
  end
  
  def show
    @comment = Comment.new
    @comments = @post.comments.recent
  end
  
  def new
    @post = Post.new
  end
  
  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      redirect_to @post, notice: 'Post was successfully created.'
    else
      render :new
    end
  end
  
  def edit
    authorize_post
  end
  
  def update
    authorize_post
    if @post.update(post_params)
      redirect_to @post, notice: 'Post was successfully updated.'
    else
      render :edit
    end
  end
  
  def destroy
    authorize_post
    @post.destroy
    redirect_to posts_path, notice: 'Post was successfully deleted.'
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
  
  def authorize_post
    unless @post.user == current_user || current_user.admin?
      flash[:danger] = "You can only edit your own posts."
      redirect_to @post
    end
  end
end
