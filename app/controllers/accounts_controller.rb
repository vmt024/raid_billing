class AccountsController < ApplicationController
  # add account to system
  # edit account information 
  # reset web sign in password for user
  # 
  before_filter :load_user_info

  def overview
  end

  def phone
    @transactions = PhoneUsage.transactions_for(session[:phone_number],session[:billing_period],params[:page])
  end

  def internet
    @transactions = InternetUsage.transactions_for(current_user.id,session[:billing_period])
  end

  # change billing period for current session
  def set_billing_period
    back_url = CGI.escapeHTML(request.referrer)
    session[:billing_period] = params[:billing_period]
    redirect_to back_url
  end

  # change phone number for current session
  def set_phone_number
    back_url = CGI.escapeHTML(request.referrer)
    session[:phone_number] = params[:phone_number]
    redirect_to back_url
  end

  private 


end
