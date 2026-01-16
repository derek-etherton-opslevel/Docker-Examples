class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @posts = @user.posts.published.recent.limit(10)
  end
end
