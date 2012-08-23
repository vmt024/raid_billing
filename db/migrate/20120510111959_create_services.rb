class CreateServices < ActiveRecord::Migration
  def change
    create_table :services do |t|
      t.string :name,                       :null => false, :default => ""
      #t.integer :included_internet_usage,   :null => false
      t.decimal :price_include_gst,         :null => false, :precision => 11, :scale => 2
      t.string  :billing_period,            :null => false, :default => "monthly"
      t.timestamps
    end
  end
end
