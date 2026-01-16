class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  
  include SessionsHelper
  
  private
  
  def require_login
    unless logged_in?
      flash[:danger] = "Please log in to access this page."
      redirect_to login_path
    end
  end
  
  def require_admin
    unless current_user&.admin?
      flash[:danger] = "You must be an admin to access this page."
      redirect_to root_path
    end
  end
end
