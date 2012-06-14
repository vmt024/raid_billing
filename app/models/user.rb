class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  # Disabled modules: :recoverable, :registerable, :validatable
  devise :database_authenticatable, :rememberable, :trackable, :lockable, :timeoutable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_protected :is_admin

  has_many :phone_numbers
  has_many :internet_usages
  has_many :billing_credits
  belongs_to :service


  def is_admin?
    is_admin.eql?(true)
  end
end
