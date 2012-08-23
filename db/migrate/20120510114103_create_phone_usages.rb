class CreatePhoneUsages < ActiveRecord::Migration
  def change
    create_table :phone_usages do |t|
      t.integer   :user_id,               :null => false
      t.datetime  :date_and_time,         :null => false
      t.string    :calling_from,          :null => false
      t.string    :calling_to,            :null => false
      t.integer   :duration,              :null => false
      t.integer   :category_id,           :null => false
      t.decimal   :cost,                  :null => false, :precision => 11, :scale => 2
      t.integer   :qty
      t.timestamps
    end
  end
end
