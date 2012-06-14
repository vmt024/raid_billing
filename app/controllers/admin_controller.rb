class AdminController < ApplicationController

  def accounts
    @account = current_user
    @accounts = User.all
  end

  def edit_account
    @account = current_user
    @edit_account = User.find(params[:id])
    @billing_credits = BillingCredit.where(['user_id = ?', params[:id]])
  end

  def add_credit

  end

  def create_credit

  end

  def update_credit

  end

  def delete_credit

  end
end
