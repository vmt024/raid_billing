class UpdatePhoneNumber < ActiveRecord::Migration
  def up
    add_column :phone_numbers, :primary_phone_number, :string
  end

  def down
    remove_column :phone_numbers, :primary_phone_number
  end
end
