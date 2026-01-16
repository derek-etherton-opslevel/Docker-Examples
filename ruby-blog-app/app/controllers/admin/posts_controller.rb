module Admin
  class PostsController < ApplicationController
    before_action :require_login
    before_action :require_admin
    before_action :set_post, only: [:show, :edit, :update, :destroy]
    
    def index
      @posts = Post.recent.page(params[:page])
    end
    
    def show
    end
    
    def edit
    end
    
    def update
      if @post.update(post_params)
        redirect_to admin_post_path(@post), notice: 'Post was successfully updated.'
      else
        render :edit
      end
    end
    
    def destroy
      @post.destroy
      redirect_to admin_posts_path, notice: 'Post was successfully deleted.'
    end
    
    private
    
    def set_post
      @post = Post.find(params[:id])
    end
    
    def post_params
      params.require(:post).permit(:title, :content, :published)
    end
  end
end
