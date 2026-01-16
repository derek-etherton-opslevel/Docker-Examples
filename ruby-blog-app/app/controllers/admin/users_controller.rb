module Admin
  class UsersController < ApplicationController
    before_action :require_login
    before_action :require_admin
    before_action :set_user, only: [:show, :edit, :update, :destroy]
    
    def index
      @users = User.order(:username).page(params[:page])
    end
    
    def show
    end
    
    def edit
    end
    
    def update
      if @user.update(user_params)
        redirect_to admin_user_path(@user), notice: 'User was successfully updated.'
      else
        render :edit
      end
    end
    
    def destroy
      @user.destroy
      redirect_to admin_users_path, notice: 'User was successfully deleted.'
    end
    
    private
    
    def set_user
      @user = User.find(params[:id])
    end
    
    def user_params
      params.require(:user).permit(:username, :email, :role)
    end
  end
end
