Rails.application.routes.draw do
  root 'posts#index'
  
  resources :posts do
    resources :comments, only: [:create, :destroy]
  end
  
  resources :users, only: [:show]
  
  get '/health', to: 'health#check'
  
  # Admin routes
  namespace :admin do
    root 'dashboard#index'
    resources :posts, except: [:new, :create]
    resources :users, except: [:new, :create]
  end
  
  # Authentication
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
end
