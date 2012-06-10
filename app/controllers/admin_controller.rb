class AdminController < ApplicationController

  def accounts
    @accounts = User.all
  end

  def edit_account
    @account = User.find(params[:id])
  end

  def sign_in_as_account()
    @account = User.find(params[:id])
    current_user = @account
    redirect_to root_url
  end

end
