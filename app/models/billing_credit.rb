class BillingCredit < ActiveRecord::Base

  belongs_to :user

  def self.get_credit_for(date,user_id)
    billing_period = date[0,7]
    credit = where("billing_period like ? and user_id = ?","#{billing_period}%",user_id)
    return credit.first unless credit.blank?
    return nil
  end

end
