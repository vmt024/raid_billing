class CreateServices < ActiveRecord::Migration
  def change
    create_table :services do |t|
      t.string :name,                       :null => false, :default => ""
      t.decimal :rate,                      :null => false
      t.string  :unit,                      :null => false, :default => "monthly"
      t.decimal :nz_mobile_rate,            :null => false
      t.integer :nz_mobile_charging_unit,   :null => false
      t.decimal :nz_landline_rate,          :null => false
      t.integer :nz_landline_charging_unit, :null => false
      t.decimal :cn_rate,                   :null => false
      t.integer :cn_charging_unit,          :null => false
      t.decimal :internet_rate,             :null => false
      t.integer :internet_limit,            :null => false

      t.timestamps
    end
  end
end
