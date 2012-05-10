class CreatePhoneNumbers < ActiveRecord::Migration
  def change
    create_table :phone_numbers do |t|
      t.integer :user_id,    :null => false
      t.string :phone_number,:null => false
      t.string :area_code,   :null => false
      t.timestamps
    end
  end
end
