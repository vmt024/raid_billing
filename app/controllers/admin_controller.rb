class AdminController < ApplicationController

  def accounts
    @account = current_user
    @accounts = User.order(:email).all
  end

  def edit_account
    @account = current_user
    @edit_account = User.find(params[:id])
  end

  def update_account
    @account = current_user
    @edit_account = User.find(params[:id])
    @edit_account.email = params[:user][:email] unless params[:user][:email].blank?
    @edit_account.base_fee = params[:user][:fee] unless params[:user][:fee].blank?
    @edit_account.service_id = params[:user][:plan] unless params[:user][:plan].blank?
    if @edit_account.save
      flash[:notice] = "Account Information Updated"
      redirect_to :action => :accounts
    else
      flash[:error] = "Update Account Information Failed"
      render :action => :edit_account
    end
  end

  def add_phone_number
    @account = current_user
    @phone_number = PhoneNumber.new
    @phone_number.user_id = params[:user_id]
  end

  def create_phone_number
    @phone_number = PhoneNumber.new(params[:phone_number])
    if @phone_number.save
      flash[:notice] = "Phone Number Saved"
      redirect_to edit_account_admin_url(@phone_number.user_id)
    else
      flash[:error] = "Saving Phone Number Failed"
      render add_phone_number_admin_url
    end
  end

  def edit_phone_number
    @account = current_user
    @phone_number = PhoneNumber.find(params[:id])
  end

  def update_phone_number
    @phone_number = PhoneNumber.find(params[:id])
    @phone_number.user_id = params[:phone_number][:user_id]
    @phone_number.phone_number = params[:phone_number][:phone_number]
    if @phone_number.save
      flash[:notice] = "Phone Number Saved"
      redirect_to edit_account_admin_url(@phone_number.user_id)
    else
      flash[:error] = "Saving Phone Number Failed"
      render edit_phone_number_admin_url(@phone_number.id)
    end
  end

  def destroy_phone_number
    @phone_number = PhoneNumber.find(params[:id])
    @phone_number.destroy
    redirect_to edit_account_admin_url(@phone_number.user_id)
  end

  def account_credit
    @account = current_user
    @edit_account = User.find(params[:id])
    @billing_credits = BillingCredit.where(['user_id = ?', @edit_account.id])
  end

  def edit_credit
    @account = current_user
    @edit_account = User.find(params[:id])
    @billing_credit = BillingCredit.where(['user_id = ? and billing_period like ?', @edit_account.id, params[:billing_period]])
    if @billing_credit.blank?
      @billing_credit = BillingCredit.new
      @billing_credit.amount = 0
      @billing_credit.description = 'Credit'
    else 
      @billing_credit = @billing_credit.first
    end
  end

  def update_credit
    @account = current_user
    @billing_credit = BillingCredit.where(['user_id = ? and billing_period like ?',params[:id], params[:billing][:period]])
    if @billing_credit.blank?
     @billing_credit = BillingCredit.new
    else 
      @billing_credit = @billing_credit.first
    end
    @billing_credit.amount = params[:billing][:credit]
    @billing_credit.billing_period = params[:billing][:period]
    @billing_credit.user_id = params[:id]
    @billing_credit.description = params[:billing][:description]

    if @billing_credit.save
      flash[:notice] = "Credit Saved"
      redirect_to account_credit_admin_url
    else
      flash[:error] = "System cannot save credit."
      render edit_credit_admin_url
    end
  end

end
