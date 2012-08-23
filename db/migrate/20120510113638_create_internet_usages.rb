class CreateInternetUsages < ActiveRecord::Migration
  def change
    create_table :internet_usages do |t|
      t.integer :user_id,    :null => false
      t.date    :date,       :null => false
      t.integer :data_uploaded,     :null => false, :default => 0
      t.integer :data_downloaded,   :null => false, :default => 0
      t.timestamps
    end
  end
end
