module Admin
  class DashboardController < ApplicationController
    before_action :require_login
    before_action :require_admin
    
    def index
      @posts_count = Post.count
      @users_count = User.count
      @comments_count = Comment.count
      @recent_posts = Post.recent.limit(5)
    end
  end
end
