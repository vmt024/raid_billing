class Users::SessionsController < Devise::SessionsController
  def sign_out
    reset_session
  end
end
