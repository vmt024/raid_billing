class BillingCredit < ActiveRecord::Migration
  def up
    create_table :billing_credits do |t|
      t.integer :user_id,          :null => false
      t.decimal :amount,           :null => false, :precision => 11, :scale => 2
      t.string  :description,      :null => false, :limit => 255
      t.string  :billing_period,   :null => false, :limit => 255
      t.timestamps
    end
  end

  def down
    drop_table :billing_credits
  end
end
