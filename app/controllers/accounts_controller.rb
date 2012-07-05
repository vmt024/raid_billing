class AccountsController < ApplicationController
  # add account to system
  # edit account information 
  # reset web sign in password for user
  # 
  before_filter :load_user_info

  def overview
    if current_user.is_admin? && !params[:id].blank?
      @account = User.find(params[:id])
    else
      @account = current_user
    end
    respond_to do |format|
      format.html
      format.pdf do
        render :pdf => "account_overview"
      end
    end
  end

  def phone
    if current_user.is_admin? && !params[:id].blank?
      @account = User.find(params[:id])
    else
      @account = current_user
    end
    phone_number = @account.phone_numbers.first
    @transactions = PhoneUsage.transactions_for(phone_number.phone_number,session[:billing_period],params[:page])
  end

  def internet
    if current_user.is_admin? && !params[:id].blank?
      @account = User.find(params[:id])
    else
      @account = current_user
    end
    @transactions = InternetUsage.transactions_for(@account.id,session[:billing_period])
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
