class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authenticate_user!
  after_filter :load_user_info, :only=>[:user_session]

  private

  # load default info into session
  def load_user_info
    if current_user
      session[:area_code] ||= current_user.phone_numbers.first.area_code.to_s
      session[:phone_number] ||= current_user.phone_numbers.first.phone_number.to_s
      session[:billing_period] ||= Date.today.beginning_of_month.to_s
      session[:full_phone_number] ||= [session[:area_code],session[:phone_number]].join(' ')
    end
  end
end
