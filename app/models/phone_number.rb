class PhoneNumber < ActiveRecord::Base
  has_many :phone_usages
  belongs_to :user
end
