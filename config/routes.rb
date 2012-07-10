RaidBilling::Application.routes.draw do
  get "home/index"

  devise_for :users, :controllers => {:sessions => 'users/sessions'}
  devise_scope :user do
      get "sign_in", :to => "users/sessions#new"
      delete "sign_out", :to => "users/sessions#destroy"
  end

  resources :accounts, :only =>[:overview, :phone, :internet] do
    collection do
    get :overview
    post :set_billing_period
    post :set_phone_number
    get :phone
    get :internet
    end
  end

  resources :admin, :only=>[:accounts,:edit_account, :sign_in_as_account] do
    member do
      get :edit_account
      get :add_phone_number
      get :edit_phone_number
      get :account_credit
      post:update_account
      post:update_phone_number
      post:update_credit
      put :create_credit
      post :create_phone_number
      get :new_credit
      get :edit_credit
      delete :destroy_credit
      delete :destroy_phone_number
      get :sign_in_as_account
    end
    collection do
      get :accounts
    end
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'
   root :to => 'accounts#overview'
  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
